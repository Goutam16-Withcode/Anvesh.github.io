"""
ANVESH Sample File Job Source
Loads pre-configured raw or sample job listings from disk for offline tests and seeding.
"""

import json
from pathlib import Path
from typing import List
from ingestion.schemas.job_schema import RawJobPosting
from ingestion.sources.base_source import BaseJobSource


class SampleJobSource(BaseJobSource):
    def __init__(self, file_path: str = None):
        super().__init__(name="sample_file")
        if file_path is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            file_path = str(base_dir / "data" / "sample" / "sample_jobs.json")
        self.file_path = file_path

    def fetch_jobs(self, limit: int = 50) -> List[RawJobPosting]:
        p = Path(self.file_path)
        if not p.exists():
            return []

        raw_postings: List[RawJobPosting] = []
        try:
            with open(p, "r", encoding="utf-8-sig") as f:
                data = json.load(f)
                for item in data[:limit]:
                    posting = RawJobPosting(
                        source_name="sample_catalog",
                        external_id=item.get("id", f"sample_{len(raw_postings)}"),
                        title=item.get("title", "Software Engineer"),
                        company=item.get("company", "Tech Innovations"),
                        description=item.get("description", "High impact engineering role."),
                        url=item.get("url", "https://anvesh.ai/jobs"),
                        location=item.get("location", "Remote"),
                        work_mode=item.get("work_mode", "REMOTE"),
                        tags=item.get("required_skills", []) + item.get("preferred_skills", []),
                        min_salary=item.get("min_salary", 130000),
                        max_salary=item.get("max_salary", 185000),
                        currency=item.get("currency", "USD"),
                        min_experience_years=item.get("min_experience_years", 2),
                        max_experience_years=item.get("max_experience_years", 6),
                    )
                    raw_postings.append(posting)
        except Exception as err:
            print(f"[SampleJobSource] Error loading sample jobs: {err}")

        return raw_postings
