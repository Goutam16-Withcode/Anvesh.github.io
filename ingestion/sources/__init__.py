"""ANVESH Ingestion Sources Package."""
from ingestion.sources.base_source import BaseJobSource
from ingestion.sources.sample_source import SampleJobSource
from ingestion.sources.remoteok_source import RemoteOKJobSource
from ingestion.sources.arbeitnow_source import ArbeitnowJobSource
from ingestion.sources.linkedin_source import LinkedInJobSource

__all__ = [
    "BaseJobSource",
    "SampleJobSource",
    "RemoteOKJobSource",
    "ArbeitnowJobSource",
    "LinkedInJobSource",
]
