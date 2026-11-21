"""
ANVESH Python ML Microservice (FastAPI + LightGBM + TreeSHAP)
Exposes high-throughput inference endpoints on port 8001.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np

from ml.embeddings.dense_embedder import DenseEmbedder
from ml.ranking.feature_extractor import FeatureExtractor
from ml.ranking.lgbm_ranker import LGBMRanker
from ml.ranking.mmr_diversity import MMRDiversifier

app = FastAPI(
    title="ANVESH ML Microservice",
    description="High-Throughput Machine Learning Inference Engine: LightGBM LambdaMART, TreeSHAP & Dense Embeddings",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML engines
embedder = DenseEmbedder()
feature_extractor = FeatureExtractor()
ranker = LGBMRanker()
diversifier = MMRDiversifier()

class EmbedRequest(BaseModel):
    texts: List[str]

class ExplainRequest(BaseModel):
    candidate: Dict[str, Any]
    job: Dict[str, Any]

class RankRequest(BaseModel):
    candidate: Dict[str, Any]
    jobs: List[Dict[str, Any]]
    top_k: Optional[int] = 20
    diversity_factor: Optional[float] = 0.35

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ANVESH ML Inference Engine",
        "engine": "LightGBM LambdaMART (NDCG@10 Optimized)",
        "explainer": "TreeSHAP Local Attribution",
        "vector_dimensions": 384,
    }

@app.post("/embed")
def generate_embeddings(req: EmbedRequest):
    vectors = embedder.embed_batch(req.texts)
    return {
        "embeddings": vectors.tolist(),
        "dimension": vectors.shape[1],
        "count": len(req.texts),
    }

@app.post("/rank")
def rank_candidates(req: RankRequest):
    if not req.jobs:
        return {"recommendations": [], "meta": {"latency_ms": 0.5}}

    # 1. Embed candidate & jobs
    candidate_text = f"{req.candidate.get('headline', '')} {' '.join(req.candidate.get('skills', []))}"
    job_texts = [f"{j.get('title', '')} {j.get('description', '')} {' '.join(j.get('required_skills', []))}" for j in req.jobs]

    c_vec = embedder.embed_text(candidate_text)
    j_vecs = embedder.embed_batch(job_texts)

    # 2. Extract 12-dimensional feature matrix
    X = feature_extractor.extract_batch(req.candidate, req.jobs, c_vec, j_vecs)

    # 3. LightGBM LambdaMART pairwise scoring
    scores = ranker.rank(X)

    # 4. Multi-Objective MMR Diversification
    top_jobs = diversifier.diversify(
        candidates=req.jobs,
        scores=scores,
        job_vectors=j_vecs,
        top_k=req.top_k or 20,
    )

    return {
        "recommendations": top_jobs,
        "meta": {
            "retrieved_count": len(req.jobs),
            "output_count": len(top_jobs),
            "algorithm": "LightGBM LambdaMART + MMR",
        },
    }

@app.post("/explain")
def explain_job_fit(req: ExplainRequest):
    candidate_text = f"{req.candidate.get('headline', '')} {' '.join(req.candidate.get('skills', []))}"
    job_text = f"{req.job.get('title', '')} {req.job.get('description', '')} {' '.join(req.job.get('required_skills', []))}"

    c_vec = embedder.embed_text(candidate_text)
    j_vec = embedder.embed_text(job_text)

    feat = feature_extractor.extract_features(req.candidate, req.job, c_vec, j_vec)
    explanation = ranker.explain(feat)

    return {
        "job_id": req.job.get("id"),
        "job_title": req.job.get("title"),
        "explanation": explanation,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
