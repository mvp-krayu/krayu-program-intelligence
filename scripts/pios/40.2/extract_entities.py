#!/usr/bin/env python3
"""
extract_entities.py
Contract: INT-04-40.2-RUNTIME-EXTRACTION
Stream:   40.2 — PiOS Evidence Connectors Layer

Purpose:
    Replicates the entity extraction logic from INT-03-40.2-GITHUB-INTAKE.
    Extracts explicitly named entities from documentation files using
    observable pattern rules matching those applied during INT-03.

RUNTIME GAP DECLARATION:
    During INT-03, entity extraction was performed by direct file reading
    with judgment-based identification of named entities (components, modules,
    analytical constructs, governance constructs). A script cannot exactly
    replicate judgment-based reading. This script implements the observable
    pattern rules that were applied, producing equivalent but not byte-identical
    output to the normalized_evidence_map.md artifact.

    Patterns extracted:
        - CKR entries:      "CKR-NNN | <name> | <class>"
        - Stream references: "Stream <N[.N]> — <name>"
        - Component names:  explicit named systems (PiOS, Signäl, Krayu)

    Patterns NOT extracted by script (extracted by reading during INT-03):
        - Structural hints within prose paragraphs
        - Pipeline stage descriptions
        - Governance rule text

Usage:
    python3 scripts/pios/40.2/extract_entities.py [REPO_ROOT]

Output:
    Tab-separated to stdout: entity_type <TAB> name <TAB> source_file
    Summary printed to stderr.
"""

import sys
import os
import re
from pathlib import Path


# Patterns applied during INT-03 entity extraction
PATTERN_CKR = re.compile(
    r'^(CKR-\d{3})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|',
    re.MULTILINE
)

PATTERN_STREAM = re.compile(
    r'Stream\s+(\d+(?:\.\d+)?)\s+[—–-]+\s+([^\n\r•]+)',
)

# Explicit component names observable in the repository
NAMED_COMPONENTS = ["PiOS", "Signäl", "Krayu"]
PATTERN_COMPONENT = re.compile(
    r'\b(' + '|'.join(re.escape(c) for c in NAMED_COMPONENTS) + r')\b'
)


def extract_from_file(rel_path: str, repo_root: str) -> list:
    """Extract entities from a single file. Returns list of (entity_type, name, source)."""
    full_path = os.path.join(repo_root, rel_path)
    entities = []

    try:
        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
    except (OSError, IOError):
        return entities

    # Extract CKR entries (explicitly present in canonical_knowledge_registry.md)
    for match in PATTERN_CKR.finditer(content):
        ckr_id = match.group(1).strip()
        name = match.group(2).strip()
        ckr_class = match.group(3).strip()
        entities.append(("analytical_construct", f"{ckr_id} — {name} [{ckr_class}]", rel_path))

    # Extract stream references
    seen_streams = set()
    for match in PATTERN_STREAM.finditer(content):
        stream_id = match.group(1).strip()
        stream_name = match.group(2).strip().rstrip(".")
        key = f"Stream {stream_id}"
        if key not in seen_streams:
            seen_streams.add(key)
            entities.append(("module", f"Stream {stream_id} — {stream_name}", rel_path))

    # Extract named components
    seen_components = set()
    for match in PATTERN_COMPONENT.finditer(content):
        name = match.group(1)
        if name not in seen_components:
            seen_components.add(name)
            entities.append(("component", name, rel_path))

    return entities


def main():
    if len(sys.argv) >= 2:
        repo_root = sys.argv[1].rstrip("/")
    else:
        try:
            import subprocess
            repo_root = subprocess.check_output(
                ["git", "rev-parse", "--show-toplevel"],
                stderr=subprocess.DEVNULL
            ).decode().strip()
        except Exception:
            repo_root = os.getcwd()

    # Files read during INT-03 entity extraction (documentation files only)
    import subprocess
    find_output = subprocess.check_output(
        ["find", repo_root,
         "-not", "-path", "*/.git/*",
         "-not", "-type", "d",
         "-name", "*.md"],
        text=True
    )
    md_files = sorted([
        line.replace(repo_root + "/", "", 1)
        for line in find_output.strip().split("\n")
        if line.strip()
    ])

    all_entities = []
    for rel_path in md_files:
        entities = extract_from_file(rel_path, repo_root)
        all_entities.extend(entities)

    # Output
    for entity_type, name, source in all_entities:
        print(f"{entity_type}\t{name}\t{source}")

    print("", file=sys.stderr)
    print(f"Total entities extracted: {len(all_entities)}", file=sys.stderr)
    print(f"Source files scanned: {len(md_files)}", file=sys.stderr)
    print("", file=sys.stderr)
    print("RUNTIME GAP: Entity extraction by pattern matching approximates INT-03 judgment-based", file=sys.stderr)
    print("reading. Structural hints and prose-embedded entities require normalization step.", file=sys.stderr)


if __name__ == "__main__":
    main()
