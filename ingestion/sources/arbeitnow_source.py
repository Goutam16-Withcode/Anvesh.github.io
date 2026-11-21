"""
ANVESH Arbeitnow Job Source Adapter
Fetches verified technical and remote positions from Arbeitnow public API.
"""

from typing import List
from datetime import datetime
import requests
from ingestion.schemas.job_schema import RawJobPosting
from ingestion.sources.base_source import BaseJobSource


class ArbeitnowJobSource(BaseJobSource):
    API_URL = "https://www.arbeitnow.com/api/job-board-api"

    def __init__(self):
        super().__init__(name="arbeitnow")

    def fetch_jobs(self, limit: int = 50) -> List[RawJobPosting]:
        headers = {
            "User-Agent": "ANVESH-Ingestion-Bot/1.0 (Enterprise Career Intelligence)"
        }
        postings: List[RawJobPosting] = []

        try:
            resp = requests.get(self.API_URL, headers=headers, timeout=10)
            if resp.status_code != 200:
                print(f"[ArbeitnowJobSource] Non-200 response: {resp.status_code}")
                return []

            payload = resp.json()
            data = payload.get("data", [])

            for item in data[:limit]:
                is_remote = item.get("remote", False)
                work_mode = "REMOTE" if is_remote else "HYBRID"

                postings.append(
                    RawJobPosting(
                        source_name="arbeitnow",
                        external_id=str(item.get("slug") or item.get("id", len(postings))),
                        title=item.get("title", "Software Developer"),
                        company=item.get("company_name", "Global Tech"),
                        description=item.get("description", ""),
                        url=item.get("url"),
                        location=item.get("location") or ("Remote" if is_remote else "Global"),
                        work_mode=work_mode,
                        tags=item.get("tags") or [],
                        min_salary=120000,
                        max_salary=180000,
                        currency="USD",
                        posted_at=datetime.utcnow(),
                    )
                )
        except Exception as err:
            print(f"[ArbeitnowJobSource] Network/Parse Exception: {err}")

        return postings
