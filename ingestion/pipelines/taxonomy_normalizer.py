"""
ANVESH Skill & Taxonomy Normalization Pipeline
Resolves raw noisy tags and free text into canonical skills based on data/taxonomy/skills.json.
Adheres to Section 2.1 of docs/architecture/data-flow.md.
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple


class TaxonomyNormalizer:
    def __init__(self, taxonomy_dir: str = None):
        if taxonomy_dir is None:
            # Resolve relative to repo root
            base_path = Path(__file__).resolve().parent.parent.parent
            taxonomy_dir = str(base_path / "data" / "taxonomy")

        self.taxonomy_dir = taxonomy_dir
        self.canonical_skills: Set[str] = set()
        self.alias_to_canonical: Dict[str, str] = {}
        self.category_by_skill: Dict[str, str] = {}
        self._load_taxonomy()

    def _load_taxonomy(self):
        skills_file = Path(self.taxonomy_dir) / "skills.json"
        if not skills_file.exists():
            # Graceful default skills if file is not found
            default_skills = [
                "Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Kubernetes",
                "AWS", "GCP", "PostgreSQL", "Redis", "TypeScript", "React", "Next.js",
                "LightGBM", "Transformers", "SQL", "Git", "Vector Databases", "MLOps"
            ]
            for s in default_skills:
                self.canonical_skills.add(s)
                self.alias_to_canonical[s.lower()] = s
            return

        with open(skills_file, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
            for skill_entry in data.get("skills", []):
                canonical = skill_entry.get("name")
                if not canonical:
                    continue
                self.canonical_skills.add(canonical)
                self.alias_to_canonical[canonical.lower()] = canonical
                self.category_by_skill[canonical] = skill_entry.get("category", "General")

                # Map aliases
                for alias in skill_entry.get("aliases", []):
                    self.alias_to_canonical[alias.lower()] = canonical

    def normalize_skill(self, raw_skill: str) -> str:
        """Map a single raw token or tag to its canonical skill name, or titlecase it."""
        cleaned = raw_skill.strip().lower()
        if cleaned in self.alias_to_canonical:
            return self.alias_to_canonical[cleaned]
        # Return cleanly capitalized token
        return raw_skill.strip().title()

    def extract_canonical_skills(self, tags: List[str], text_corpus: str = "") -> Tuple[List[str], List[str]]:
        """
        Extract required and preferred canonical skills from raw tags and description text.
        Returns: (required_skills, preferred_skills)
        """
        matched_skills: Set[str] = set()

        # 1. Check raw tags
        for tag in tags:
            canonical = self.normalize_skill(tag)
            if canonical in self.canonical_skills:
                matched_skills.add(canonical)

        # 2. Extract from text corpus via regex word boundaries
        corpus_lower = text_corpus.lower()
        for alias, canonical in self.alias_to_canonical.items():
            # Match whole word
            pattern = r"(?<!\w)" + re.escape(alias) + r"(?!\w)"
            if re.search(pattern, corpus_lower):
                matched_skills.add(canonical)

        # Ensure at least minimal valid skills
        if not matched_skills:
            matched_skills = {"Python", "SQL"}

        skills_list = sorted(list(matched_skills))
        # Split into required (primary) and preferred
        required = skills_list[:4]
        preferred = skills_list[4:]
        return required, preferred
