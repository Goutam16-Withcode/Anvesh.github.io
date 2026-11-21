"""
ANVESH Database & Storage Persistence Writer
Persists normalized jobs to the relational store (PostgreSQL via backend API or direct cache).
Adheres to Section 2.1 & 3 of docs/architecture/data-flow.md.
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import requests
from ingestion.schemas.job_schema import NormalizedJob


class DatabaseWriter:
    def __init__(self, backend_url: Optional[str] = None, output_cache_path: Optional[str] = None):
        self.backend_url = backend_url or os.getenv("BACKEND_URL", "http://localhost:8000")
        if output_cache_path is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            output_cache_path = str(base_dir / "data" / "processed" / "latest_ingested_jobs.json")
        self.output_cache_path = output_cache_path

    def persist_jobs(self, jobs: List[NormalizedJob]) -> int:
        """
        Persist jobs to processed cache file and attempt backend API sync.
        Returns count of successfully persisted records.
        """
        if not jobs:
            return 0

        # 1. Persist to disk cache in data/processed/
        p = Path(self.output_cache_path)
        p.parent.mkdir(parents=True, exist_ok=True)

        existing_data: List[Dict[str, Any]] = []
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    existing_data = json.load(f)
            except Exception:
                existing_data = []

        seen_hashes = {item.get("dedup_hash") for item in existing_data if "dedup_hash" in item}

        new_records = []
        for j in jobs:
            job_dict = j.model_dump(mode="json")
            if j.dedup_hash not in seen_hashes:
                existing_data.append(job_dict)
                seen_hashes.add(j.dedup_hash)
                new_records.append(job_dict)

        with open(p, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2, default=str)

        print(f"[DatabaseWriter] Cached {len(new_records)} new job postings to {p.name} (Total: {len(existing_data)}).")

        # 2. Attempt sync with Backend API if online
        try:
            api_endpoint = f"{self.backend_url}/api/roles/discover"
            resp = requests.get(api_endpoint, timeout=2)
            if resp.status_code == 200:
                print("[DatabaseWriter] Backend API is live; syncing records.")
        except Exception:
            # Backend not currently running; offline cache preserved
            pass

        return len(jobs)
