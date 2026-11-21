"""ANVESH Ingestion Pipelines Package."""

__all__ = [
    "TaxonomyNormalizer",
    "DedupEngine",
    "QdrantVectorIndexer",
    "DatabaseWriter",
    "IngestionOrchestrator",
]

def __getattr__(name):
    if name == "TaxonomyNormalizer":
        from ingestion.pipelines.taxonomy_normalizer import TaxonomyNormalizer
        return TaxonomyNormalizer
    elif name == "DedupEngine":
        from ingestion.pipelines.dedup_engine import DedupEngine
        return DedupEngine
    elif name == "QdrantVectorIndexer":
        from ingestion.pipelines.vector_indexer import QdrantVectorIndexer
        return QdrantVectorIndexer
    elif name == "DatabaseWriter":
        from ingestion.pipelines.db_writer import DatabaseWriter
        return DatabaseWriter
    elif name == "IngestionOrchestrator":
        from ingestion.pipelines.orchestrator import IngestionOrchestrator
        return IngestionOrchestrator
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")
