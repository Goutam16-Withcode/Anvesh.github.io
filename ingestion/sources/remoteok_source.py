"""
ANVESH RemoteOK Job Source Adapter
Fetches verified remote technical positions from RemoteOK public API.
"""

from typing import List
from datetime import datetime
import requests
from ingestion.schemas.job_schema import RawJobPosting
from ingestion.sources.base_source import BaseJobSource


class RemoteOKJobSource(BaseJobSource):
    API_URL = "https://remoteok.com/api"

    def __init__(self):
        super().__init__(name="remoteok")

    def fetch_jobs(self, limit: int = 50) -> List[RawJobPosting]:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ANVESH-Career-Ingestor/1.0"
        }
        postings: List[RawJobPosting] = []

        try:
            resp = requests.get(self.API_URL, headers=headers, timeout=10)
            if resp.status_code != 200:
                print(f"[RemoteOKJobSource] Non-200 status code: {resp.status_code}")
                return []

            data = resp.json()
            # First item in RemoteOK is legal/info metadata
            items = [item for item in data if isinstance(item, dict) and "id" in item]

            for item in items[:limit]:
                # Salary parsing
                min_sal = item.get("salary_min")
                max_sal = item.get("salary_max")

                # Parse date
                posted_dt = datetime.utcnow()
                if item.get("epoch"):
                    try:
                        posted_dt = datetime.utcfromtimestamp(int(item["epoch"]))
                    except Exception:
                        pass

                postings.append(
                    RawJobPosting(
                        source_name="remoteok",
                        external_id=str(item.get("id")),
                        title=item.get("position", "Software Engineer"),
                        company=item.get("company", "Tech Co"),
                        description=item.get("description", ""),
                        url=item.get("url") or f"https://remoteok.com/l/{item.get('id')}",
                        location=item.get("location") or "Remote",
                        work_mode="REMOTE",
                        tags=item.get("tags") or [],
                        min_salary=int(min_sal) if min_sal else 125000,
                        max_salary=int(max_sal) if max_sal else 185000,
                        currency="USD",
                        posted_at=posted_dt,
                    )
                )
        except Exception as err:
            print(f"[RemoteOKJobSource] Network/Parse Exception: {err}")

        return postings
