"""
ANVESH 12-Dimensional Feature Engineering Engine
Extracts pairwise candidate-job feature vectors adhering to Section 4 of docs/architecture/recommendation-pipeline.md.
"""

import math
import numpy as np
from typing import Dict, Any, List

FEATURE_NAMES = [
    "semantic_sim",
    "req_skill_match",
    "pref_skill_match",
    "missing_skill_count",
    "exp_delta",
    "exp_overqual",
    "work_mode_match",
    "location_dist_score",
    "freshness_score",
    "company_affinity",
    "role_affinity",
    "salary_alignment",
]

class FeatureExtractor:
    def extract_features(
        self,
        candidate: Dict[str, Any],
        job: Dict[str, Any],
        candidate_vector: np.ndarray,
        job_vector: np.ndarray,
    ) -> np.ndarray:
        """
        Extract a 12-dimensional feature vector for a given (candidate, job) pair.
        """
        user_skills = set(s.lower() for s in candidate.get("skills", []))
        req_skills = set(s.lower() for s in job.get("required_skills", []))
        pref_skills = set(s.lower() for s in job.get("preferred_skills", []))

        # f1: Semantic Cosine Similarity
        norm_c = np.linalg.norm(candidate_vector)
        norm_j = np.linalg.norm(job_vector)
        if norm_c > 0 and norm_j > 0:
            semantic_sim = float(np.dot(candidate_vector, job_vector) / (norm_c * norm_j))
        else:
            semantic_sim = 0.5

        # f2: Mandatory Skill Overlap Ratio
        if len(req_skills) > 0:
            matched_req = len(user_skills.intersection(req_skills))
            req_skill_match = matched_req / len(req_skills)
            missing_skill_count = len(req_skills) - matched_req
        else:
            req_skill_match = 1.0
            missing_skill_count = 0

        # f3: Preferred Skill Overlap Ratio
        if len(pref_skills) > 0:
            pref_skill_match = len(user_skills.intersection(pref_skills)) / len(pref_skills)
        else:
            pref_skill_match = 0.5

        # f5 & f6: Experience Disparity Delta
        candidate_exp = float(candidate.get("years_of_experience", 3.0))
        job_min_exp = float(job.get("min_experience_years", 2.0))
        job_max_exp = float(job.get("max_experience_years", 6.0))

        exp_delta = max(0.0, job_min_exp - candidate_exp)
        exp_overqual = max(0.0, candidate_exp - job_max_exp)

        # f7: Work Mode Match
        candidate_mode = candidate.get("preferred_work_mode", "REMOTE").upper()
        job_mode = job.get("work_mode", "REMOTE").upper()
        work_mode_match = 1.0 if (candidate_mode == "ANY" or candidate_mode == job_mode or job_mode == "REMOTE") else 0.0

        # f8: Location Distance Score (1.0 for Remote, inverse decay for on-site)
        location_dist_score = 1.0 if job_mode == "REMOTE" else 0.85

        # f9: Catalog Freshness Exponential Decay: exp(-ln(2) * delta_t / 30)
        freshness_days = float(job.get("freshness_days", 1.0))
        freshness_score = math.exp(- (math.log(2) * freshness_days) / 30.0)

        # f10 & f11: Company & Role Affinity
        company_affinity = float(candidate.get("company_affinity", {}).get(job.get("company", {}).get("name", ""), 0.5))
        role_affinity = float(candidate.get("role_affinity", {}).get(job.get("role_family", ""), 0.5))

        # f12: Salary Alignment
        candidate_min_sal = float(candidate.get("target_min_salary", 150000))
        job_max_sal = float(job.get("max_salary", 220000))
        salary_alignment = 1.0 if job_max_sal >= candidate_min_sal else 0.5

        return np.array([
            semantic_sim,
            req_skill_match,
            pref_skill_match,
            float(missing_skill_count),
            exp_delta,
            exp_overqual,
            work_mode_match,
            location_dist_score,
            freshness_score,
            company_affinity,
            role_affinity,
            salary_alignment,
        ], dtype=np.float32)

    def extract_batch(
        self,
        candidate: Dict[str, Any],
        jobs: List[Dict[str, Any]],
        candidate_vector: np.ndarray,
        job_vectors: np.ndarray,
    ) -> np.ndarray:
        """
        Extract feature matrix (N, 12) for all candidate jobs.
        """
        features = []
        for i, job in enumerate(jobs):
            feat = self.extract_features(candidate, job, candidate_vector, job_vectors[i])
            features.append(feat)
        return np.vstack(features).astype(np.float32)
