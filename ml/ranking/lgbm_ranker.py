"""
ANVESH LightGBM LambdaMART Ranker & TreeSHAP Attribution Engine
Implements Section 5 of docs/architecture/recommendation-pipeline.md.
"""

import os
import numpy as np
import lightgbm as lgb
from typing import List, Dict, Any, Tuple
from ml.ranking.feature_extractor import FEATURE_NAMES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "lgbm_model.txt")

class LGBMRanker:
    def __init__(self, model_file: str = MODEL_PATH):
        self.model_file = model_file
        self.booster = None
        self._init_model()

    def _init_model(self):
        """
        Load pretrained model or train baseline LambdaMART model with synthetic relevance pairs.
        """
        if os.path.exists(self.model_file):
            try:
                self.booster = lgb.Booster(model_file=self.model_file)
                return
            except Exception:
                pass
        self._train_baseline()

    def _train_baseline(self):
        """
        Train a baseline LambdaMART model on simulated candidate-job pairwise queries.
        Optimizes NDCG@10 with 12 features.
        """
        np.random.seed(42)
        n_queries = 200
        query_size = 30
        n_samples = n_queries * query_size

        # Generate realistic synthetic training features
        # f1: semantic_sim (0.4 - 0.98)
        # f2: req_skill_match (0.3 - 1.0)
        # f3: pref_skill_match (0.0 - 1.0)
        # f4: missing_skill_count (0 - 5)
        # f5: exp_delta (0 - 4)
        # f6: exp_overqual (0 - 3)
        # f7: work_mode_match (0 or 1)
        # f8: location_dist (0.7 - 1.0)
        # f9: freshness (0.3 - 1.0)
        # f10: comp_affinity (0.1 - 0.9)
        # f11: role_affinity (0.1 - 0.9)
        # f12: salary_alignment (0 or 1)
        X = np.zeros((n_samples, 12), dtype=np.float32)
        X[:, 0] = np.random.uniform(0.4, 0.98, n_samples)
        X[:, 1] = np.random.uniform(0.3, 1.0, n_samples)
        X[:, 2] = np.random.uniform(0.0, 1.0, n_samples)
        X[:, 3] = np.random.poisson(1.5, n_samples)
        X[:, 4] = np.clip(np.random.normal(0.5, 1.0, n_samples), 0, 5)
        X[:, 5] = np.clip(np.random.normal(0.2, 0.5, n_samples), 0, 5)
        X[:, 6] = np.random.choice([0.0, 1.0], size=n_samples, p=[0.2, 0.8])
        X[:, 7] = np.random.uniform(0.7, 1.0, n_samples)
        X[:, 8] = np.random.uniform(0.3, 1.0, n_samples)
        X[:, 9] = np.random.uniform(0.2, 0.8, n_samples)
        X[:, 10] = np.random.uniform(0.2, 0.8, n_samples)
        X[:, 11] = np.random.choice([0.0, 1.0], size=n_samples, p=[0.15, 0.85])

        # Formulate true relevance grades y in {0, 1, 2, 3, 4}
        # Strongly driven by required skills, semantic fit, and low experience delta
        latent_utility = (
            X[:, 0] * 3.5 +
            X[:, 1] * 4.0 +
            X[:, 2] * 1.5 -
            X[:, 3] * 0.8 -
            X[:, 4] * 1.2 +
            X[:, 6] * 1.0 +
            X[:, 8] * 0.8 +
            X[:, 11] * 0.7 +
            np.random.normal(0, 0.4, n_samples)
        )
        y = np.clip(np.digitize(latent_utility, bins=np.percentile(latent_utility, [30, 55, 75, 90])), 0, 4)

        groups = [query_size] * n_queries

        train_data = lgb.Dataset(X, label=y, group=groups, feature_name=FEATURE_NAMES)
        params = {
            "objective": "lambdarank",
            "metric": "ndcg",
            "ndcg_eval_at": [1, 3, 5, 10],
            "learning_rate": 0.08,
            "num_leaves": 31,
            "min_data_in_leaf": 15,
            "verbose": -1,
        }

        self.booster = lgb.train(params, train_data, num_boost_round=60)
        self.booster.save_model(self.model_file)

    def rank(self, feature_matrix: np.ndarray) -> np.ndarray:
        """
        Compute predicted relevance scores for feature matrix (N, 12).
        Returns normalized scores in [0.0, 1.0].
        """
        raw_scores = self.booster.predict(feature_matrix)
        # Sigmoid calibration to map scores to calibrated probabilities
        calibrated = 1.0 / (1.0 + np.exp(-raw_scores))
        return calibrated.astype(np.float32)

    def explain(self, feature_vector: np.ndarray) -> Dict[str, Any]:
        """
        Compute TreeSHAP feature attribution breakdown for a single item.
        Returns waterfall decomposing match score into positive gains and negative deductions.
        """
        # LightGBM predict with pred_contrib=True calculates exact TreeSHAP values
        shap_values = self.booster.predict(feature_vector.reshape(1, -1), pred_contrib=True)[0]
        base_value = float(shap_values[-1])
        feature_shaps = shap_values[:-1]

        gains = []
        deductions = []

        friendly_labels = {
            "semantic_sim": "Dense Vector Semantic Alignment",
            "req_skill_match": "Mandatory Skill Coverage",
            "pref_skill_match": "Preferred / Bonus Skill Synergy",
            "missing_skill_count": "Missing Core Competencies",
            "exp_delta": "Seniority Disparity Penalty",
            "exp_overqual": "Overqualification Delta",
            "work_mode_match": "Work Mode Alignment (Remote)",
            "location_dist_score": "Location Proximity",
            "freshness_score": "Catalog Posting Freshness",
            "company_affinity": "Company Historical Affinity",
            "role_affinity": "Role Family Affinity",
            "salary_alignment": "Compensation Bracket Alignment",
        }

        for name, shap_val, feat_val in zip(FEATURE_NAMES, feature_shaps, feature_vector):
            val_float = float(shap_val)
            item = {
                "feature": name,
                "label": friendly_labels.get(name, name),
                "contribution": round(val_float, 4),
                "feature_value": round(float(feat_val), 3),
            }
            if val_float >= 0:
                gains.append(item)
            else:
                deductions.append(item)

        gains.sort(key=lambda x: x["contribution"], reverse=True)
        deductions.sort(key=lambda x: x["contribution"])

        total_score = float(np.sum(feature_shaps) + base_value)
        calibrated_score = float(1.0 / (1.0 + np.exp(-total_score)))

        return {
            "base_value": round(base_value, 4),
            "calibrated_match_score": round(calibrated_score, 4),
            "top_positive_factors": gains[:4],
            "top_negative_factors": deductions[:4],
            "all_attributions": gains + deductions,
        }
