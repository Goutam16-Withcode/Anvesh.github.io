"""
ANVESH Job Ingestion Data Schemas
Pydantic v2 schemas defining raw payloads, normalized job models, and quality gates.
Adheres to Section 2.1 of docs/architecture/data-flow.md.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class RawJobPosting(BaseModel):
    """Raw unprocessed job posting directly from external feed or API."""
    source_name: str = Field(..., description="Source origin: e.g. remoteok, arbeitnow, greenhouse")
    external_id: str = Field(..., description="Unique ID within the source platform")
    title: str = Field(..., description="Raw job title")
    company: str = Field(..., description="Raw company name")
    description: str = Field(..., description="Full job description text or HTML")
    url: Optional[str] = Field(None, description="External application or posting URL")
    location: Optional[str] = Field("Remote", description="Job location or Remote")
    work_mode: Optional[str] = Field("REMOTE", description="REMOTE, HYBRID, or ONSITE")
    tags: List[str] = Field(default_factory=list, description="Tags, skills, or categories from source")
    min_salary: Optional[int] = Field(None, description="Reported minimum annual salary in USD")
    max_salary: Optional[int] = Field(None, description="Reported maximum annual salary in USD")
    currency: Optional[str] = Field("USD", description="Currency ISO code")
    min_experience_years: Optional[int] = Field(None, description="Reported minimum experience in years")
    max_experience_years: Optional[int] = Field(None, description="Reported maximum experience in years")
    posted_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Posting date")


class NormalizedJob(BaseModel):
    """
    Normalized, validated canonical job posting conforming to ANVESH domain models.
    Compatible with PostgreSQL schema.prisma Job model and Qdrant vector payload.
    """
    id: str = Field(..., description="Canonical UUID or deterministic hash ID")
    dedup_hash: str = Field(..., description="3-gram MinHash/MD5 deduplication signature")
    title: str = Field(..., min_length=3, max_length=150)
    company: str = Field(..., min_length=2, max_length=100)
    location: str = Field(default="Remote")
    work_mode: str = Field(default="REMOTE")
    description: str = Field(..., min_length=50)
    required_skills: List[str] = Field(..., min_length=1, description="Canonical skill names matched to taxonomy")
    preferred_skills: List[str] = Field(default_factory=list)
    min_experience_years: int = Field(default=2, ge=0, le=20)
    max_experience_years: int = Field(default=6, ge=0, le=25)
    min_salary: int = Field(default=120000, ge=0)
    max_salary: int = Field(default=180000, ge=0)
    currency: str = Field(default="USD")
    external_url: Optional[str] = None
    source_name: str
    seniority_level: str = Field(default="Mid-Senior")
    easy_apply: bool = Field(default=True)
    applicant_count: int = Field(default=15, ge=0)
    company_size: str = Field(default="Scaleup • 500-5,000 employees")
    industry: str = Field(default="Technology & AI")
    company_tier: str = Field(default="HIGH_GROWTH_STARTUP")
    region_hub: str = Field(default="Global Remote")
    freshness_score: float = Field(default=0.98, ge=0.0, le=1.0)
    is_active: bool = True
    posted_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("work_mode")
    @classmethod
    def validate_work_mode(cls, v: str) -> str:
        upper = v.upper()
        if upper in ["REMOTE", "HYBRID", "ONSITE"]:
            return upper
        return "REMOTE"


class IngestionQualityReport(BaseModel):
    """Metrics and observability telemetry for an ingestion run."""
    source_name: str
    total_fetched: int = 0
    passed_quality_gates: int = 0
    rejected_quality_gates: int = 0
    duplicates_dropped: int = 0
    successfully_normalized: int = 0
    indexed_qdrant: int = 0
    persisted_db: int = 0
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    errors: List[str] = Field(default_factory=list)
