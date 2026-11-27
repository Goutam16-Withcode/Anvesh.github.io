"""
ANVESH Master Ingestion Pipeline Orchestrator
Coordinates data extraction, validation, taxonomy normalization, deduplication, vectorization, and storage.
Adheres to docs/architecture/data-flow.md.
"""

import argparse
import math
import sys
import uuid
from datetime import datetime
from typing import List, Optional

from ingestion.schemas.job_schema import RawJobPosting, NormalizedJob, IngestionQualityReport
from ingestion.sources.base_source import BaseJobSource
from ingestion.sources.sample_source import SampleJobSource
from ingestion.sources.remoteok_source import RemoteOKJobSource
from ingestion.sources.arbeitnow_source import ArbeitnowJobSource
from ingestion.sources.linkedin_source import LinkedInJobSource
from ingestion.sources.mnc_startup_source import MNCAndStartupLiveSource
from ingestion.pipelines.taxonomy_normalizer import TaxonomyNormalizer
from ingestion.pipelines.dedup_engine import DedupEngine
from ingestion.pipelines.vector_indexer import QdrantVectorIndexer
from ingestion.pipelines.db_writer import DatabaseWriter


class IngestionOrchestrator:
    def __init__(self):
        self.normalizer = TaxonomyNormalizer()
        self.dedup_engine = DedupEngine(jaccard_threshold=0.85)
        self.vector_indexer = QdrantVectorIndexer()
        self.db_writer = DatabaseWriter()

    def get_source(self, source_name: str) -> BaseJobSource:
        s = source_name.lower().strip()
        if s == "remoteok":
            return RemoteOKJobSource()
        elif s == "arbeitnow":
            return ArbeitnowJobSource()
        elif s == "linkedin":
            return LinkedInJobSource()
        elif s == "mnc_startup":
            return MNCAndStartupLiveSource()
        else:
            return SampleJobSource()

    def _classify_company_tier(self, company: str) -> str:
        c = company.lower()
        top_mncs = ["google", "microsoft", "amazon", "nvidia", "meta", "apple", "stripe", "spotify", "datadog", "cloudflare"]
        unicorns = ["anthropic", "openai", "perplexity", "databricks", "vercel", "linear", "mistral", "sarvam", "razorpay"]
        if any(m in c for m in top_mncs):
            return "TOP_MNC"
        if any(u in c for u in unicorns):
            return "AI_UNICORN"
        return "HIGH_GROWTH_STARTUP"

    def _classify_region_hub(self, location: str) -> str:
        loc = (location or "").lower()
        if any(k in loc for k in ["bengaluru", "bangalore", "hyderabad", "pune", "delhi", "india", "mumbai"]):
            return "India Hubs"
        if any(k in loc for k in ["london", "berlin", "paris", "europe", "amsterdam", "dublin"]):
            return "Europe Hubs"
        if any(k in loc for k in ["san francisco", "new york", "seattle", "austin", "boston", "santa clara", "menlo park", "usa", "united states"]):
            return "USA Hubs"
        return "Global Remote"

    def _compute_freshness_score(self, posted_at: Optional[datetime]) -> float:
        if not posted_at:
            return 0.99
        age_days = max(0.0, (datetime.utcnow() - posted_at).total_seconds() / 86400.0)
        # Exponential 14-day half-life decay: f(t) = exp(-ln(2) * t / 14)
        return round(math.exp(-math.log(2) * age_days / 14.0), 3)

    def run_pipeline(
        self,
        source_name: str = "sample",
        limit: int = 50,
        dry_run: bool = False
    ) -> IngestionQualityReport:
        """
        Execute end-to-end ingestion pipeline for given source.
        """
        report = IngestionQualityReport(source_name=source_name)
        source = self.get_source(source_name)

        print(f"\n=======================================================")
        print(f"🚀 [ANVESH Ingestion] Starting run for source: '{source_name}' (Limit: {limit})")
        print(f"=======================================================")

        # 1. Fetch raw jobs
        try:
            raw_jobs: List[RawJobPosting] = source.fetch_jobs(limit=limit)
            report.total_fetched = len(raw_jobs)
            print(f"📥 Fetched {len(raw_jobs)} raw postings from '{source_name}'.")
        except Exception as err:
            err_msg = f"Failed to fetch jobs from {source_name}: {err}"
            print(f"❌ {err_msg}")
            report.errors.append(err_msg)
            report.completed_at = datetime.utcnow()
            return report

        if not raw_jobs:
            print("⚠️ No job postings retrieved.")
            report.completed_at = datetime.utcnow()
            return report

        # 2. Quality Gate & Normalization Loop
        normalized_jobs: List[NormalizedJob] = []

        for raw in raw_jobs:
            # Quality Gate Checks (Section 2.1)
            title = (raw.title or "").strip()
            company = (raw.company or "").strip()
            desc = (raw.description or "").strip()

            if len(title) < 3 or len(title) > 150:
                report.rejected_quality_gates += 1
                continue
            if len(company) < 2:
                report.rejected_quality_gates += 1
                continue
            if len(desc) < 30:
                report.rejected_quality_gates += 1
                continue

            report.passed_quality_gates += 1

            # Taxonomy Skill Extraction
            corpus = f"{title} {desc}"
            req_skills, pref_skills = self.normalizer.extract_canonical_skills(raw.tags, corpus)

            # Deduplication Check
            dedup_hash = self.dedup_engine.compute_dedup_hash(company, title, desc)
            company_title_key = f"{company.lower()}::{title.lower()}"

            if self.dedup_engine.is_duplicate(dedup_hash, desc, company_title_key):
                report.duplicates_dropped += 1
                continue

            # Register hash
            self.dedup_engine.register(dedup_hash, desc, company_title_key)

            # Build canonical normalized record
            job_id = f"job_{dedup_hash[:16]}"
            loc_str = raw.location or "Remote"
            norm_job = NormalizedJob(
                id=job_id,
                dedup_hash=dedup_hash,
                title=title,
                company=company,
                location=loc_str,
                work_mode=raw.work_mode or "REMOTE",
                description=desc,
                required_skills=req_skills,
                preferred_skills=pref_skills,
                min_experience_years=raw.min_experience_years or 2,
                max_experience_years=raw.max_experience_years or 6,
                min_salary=raw.min_salary or 130000,
                max_salary=raw.max_salary or 185000,
                currency=raw.currency or "USD",
                external_url=raw.url,
                source_name=raw.source_name,
                company_tier=self._classify_company_tier(company),
                region_hub=self._classify_region_hub(loc_str),
                freshness_score=self._compute_freshness_score(raw.posted_at),
                posted_at=raw.posted_at or datetime.utcnow(),
            )
            normalized_jobs.append(norm_job)
            report.successfully_normalized += 1

        print(f"✅ Passed Quality Gates: {report.passed_quality_gates}/{report.total_fetched}")
        print(f"🔍 Duplicates Dropped: {report.duplicates_dropped}")
        print(f"📦 Successfully Normalized: {len(normalized_jobs)}")

        if dry_run:
            print("🔬 [Dry Run Active] Skipping Qdrant vector indexing and DB writes.")
            report.completed_at = datetime.utcnow()
            return report

        # 3. Vector Indexing into Qdrant
        print("⚡ Generating 384-d dense embeddings & indexing to Qdrant...")
        indexed_count = self.vector_indexer.index_jobs(normalized_jobs)
        report.indexed_qdrant = indexed_count

        # 4. Relational Storage Persistence
        print("💾 Persisting canonical records to dual-store...")
        persisted_count = self.db_writer.persist_jobs(normalized_jobs)
        report.persisted_db = persisted_count

        report.completed_at = datetime.utcnow()
        print(f"🎉 Ingestion Run Completed successfully in {(report.completed_at - report.started_at).total_seconds():.2f}s!\n")
        return report


def main():
    parser = argparse.ArgumentParser(description="ANVESH Automated Job Ingestion Pipeline")
    parser.add_argument(
        "--source",
        type=str,
        default="sample",
        choices=["sample", "remoteok", "arbeitnow", "linkedin", "mnc_startup", "all"],
        help="Target job source feed",
    )
    parser.add_argument("--limit", type=int, default=20, help="Maximum postings to process")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing to DB or Qdrant")

    args = parser.parse_args()
    orchestrator = IngestionOrchestrator()

    if args.source == "all":
        sources = ["mnc_startup", "linkedin", "remoteok", "arbeitnow", "sample"]
        for s in sources:
            orchestrator.run_pipeline(source_name=s, limit=args.limit, dry_run=args.dry_run)
    else:
        orchestrator.run_pipeline(source_name=args.source, limit=args.limit, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
