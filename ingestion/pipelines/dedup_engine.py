"""
ANVESH Deduplication Engine
Implements MinHash and cryptographic shingling for entity resolution and duplicate detection.
Adheres to Section 2.2 of docs/architecture/data-flow.md.
"""

import hashlib
import re
from typing import Set, Dict, List, Optional


class DedupEngine:
    def __init__(self, jaccard_threshold: float = 0.85):
        self.jaccard_threshold = jaccard_threshold
        self.seen_hashes: Set[str] = set()
        self.seen_signatures: Dict[str, Set[str]] = {}

    def clean_text(self, text: str) -> str:
        """Strip HTML tags, punctuation, and multiple spaces."""
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"[^\w\s]", " ", text)
        return " ".join(text.lower().split())

    def get_shingles(self, text: str, k: int = 3) -> Set[str]:
        """Generate k-gram word shingles for Jaccard similarity."""
        words = self.clean_text(text).split()
        if len(words) < k:
            return set(words)
        return {" ".join(words[i:i + k]) for i in range(len(words) - k + 1)}

    def compute_dedup_hash(self, company: str, title: str, description: str) -> str:
        """
        Compute deterministic deduplication signature.
        Combines normalized company, title, and first 300 words of description.
        """
        norm_company = self.clean_text(company)
        norm_title = self.clean_text(title)
        first_words = " ".join(self.clean_text(description).split()[:150])

        payload = f"{norm_company}::{norm_title}::{first_words}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:24]

    def is_duplicate(self, dedup_hash: str, description: str, company_title_key: Optional[str] = None) -> bool:
        """
        Determine if the job posting has already been seen or is duplicate via Jaccard.
        """
        # Exact hash match
        if dedup_hash in self.seen_hashes:
            return True

        # Shingle comparison if company_title matches
        if company_title_key and company_title_key in self.seen_signatures:
            existing_shingles = self.seen_signatures[company_title_key]
            new_shingles = self.get_shingles(description)
            if existing_shingles and new_shingles:
                intersection = len(existing_shingles.intersection(new_shingles))
                union = len(existing_shingles.union(new_shingles))
                similarity = intersection / float(union) if union > 0 else 0.0
                if similarity >= self.jaccard_threshold:
                    return True

        return False

    def register(self, dedup_hash: str, description: str, company_title_key: Optional[str] = None):
        """Register a unique job signature in memory."""
        self.seen_hashes.add(dedup_hash)
        if company_title_key:
            self.seen_signatures[company_title_key] = self.get_shingles(description)
