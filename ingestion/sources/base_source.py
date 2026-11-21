"""
ANVESH Base Job Source Adapter
Abstract interface for job ingestion sources (REST APIs, ATS webhooks, feed streams).
"""

from abc import ABC, abstractmethod
from typing import List
from ingestion.schemas.job_schema import RawJobPosting


class BaseJobSource(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def fetch_jobs(self, limit: int = 50) -> List[RawJobPosting]:
        """Fetch raw job postings from external source."""
        pass
