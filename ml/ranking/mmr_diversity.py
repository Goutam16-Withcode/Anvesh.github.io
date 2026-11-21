"""
ANVESH Maximal Marginal Relevance (MMR) Diversification Engine
Implements Section 6 of docs/architecture/recommendation-pipeline.md.
Eliminates redundant listings and balances relevance with freshness and company diversity.
"""

import numpy as np
from typing import List, Dict, Any

class MMRDiversifier:
    def __init__(
        self,
        alpha: float = 0.65,
        diversity_factor: float = 0.35,
        beta_freshness: float = 0.15,
        max_per_company: int = 2,
    ):
        self.alpha = alpha
        self.diversity_penalty = diversity_factor
        self.beta_freshness = beta_freshness
        self.max_per_company = max_per_company

    def diversify(
        self,
        candidates: List[Dict[str, Any]],
        scores: np.ndarray,
        job_vectors: np.ndarray,
        top_k: int = 20,
    ) -> List[Dict[str, Any]]:
        """
        Select top_k diversified jobs from candidate pool using MMR.
        """
        n = len(candidates)
        if n <= top_k:
            ranked = []
            for i in np.argsort(-scores):
                item = dict(candidates[i])
                item["match_score"] = float(scores[i])
                ranked.append(item)
            return ranked

        selected_indices: List[int] = []
        remaining_indices = list(range(n))
        company_counts: Dict[str, int] = {}

        # Pre-normalize job vectors for fast cosine similarity
        norms = np.linalg.norm(job_vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        normalized_vectors = job_vectors / norms

        while len(selected_indices) < top_k and remaining_indices:
            best_idx = -1
            best_mmr_score = -float("inf")

            for idx in remaining_indices:
                cand = candidates[idx]
                comp_name = cand.get("company", {}).get("name", "Unknown")

                # Hard constraint: Capped company diversity
                if company_counts.get(comp_name, 0) >= self.max_per_company:
                    continue

                relevance = float(scores[idx])

                # Diversity penalty against already selected candidates
                if not selected_indices:
                    sim_to_selected = 0.0
                else:
                    cand_vec = normalized_vectors[idx]
                    selected_vecs = normalized_vectors[selected_indices]
                    cos_sims = np.dot(selected_vecs, cand_vec)

                    entity_penalties = []
                    for s_idx, cos_sim in zip(selected_indices, cos_sims):
                        s_comp = candidates[s_idx].get("company", {}).get("name", "")
                        comp_match = 1.0 if s_comp == comp_name else 0.0
                        entity_sim = 0.5 * comp_match + 0.5 * float(cos_sim)
                        entity_penalties.append(entity_sim)

                    sim_to_selected = max(entity_penalties) if entity_penalties else 0.0

                freshness_score = float(cand.get("freshness_score", 0.9))

                # MMR Formulation
                mmr_val = (
                    self.alpha * relevance -
                    self.diversity_penalty * sim_to_selected +
                    self.beta_freshness * freshness_score
                )

                if mmr_val > best_mmr_score:
                    best_mmr_score = mmr_val
                    best_idx = idx

            if best_idx == -1:
                # If all remaining hit company caps, relax company constraints
                best_idx = remaining_indices[0]

            selected_indices.append(best_idx)
            remaining_indices.remove(best_idx)

            comp = candidates[best_idx].get("company", {}).get("name", "Unknown")
            company_counts[comp] = company_counts.get(comp, 0) + 1

        output = []
        for rank, s_idx in enumerate(selected_indices, start=1):
            item = dict(candidates[s_idx])
            item["rank"] = rank
            item["match_score"] = round(float(scores[s_idx]), 4)
            output.append(item)

        return output
