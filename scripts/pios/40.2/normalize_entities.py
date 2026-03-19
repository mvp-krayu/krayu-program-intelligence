#!/usr/bin/env python3
"""
normalize_entities.py
Contract: INT-04-40.2-RUNTIME-EXTRACTION
Stream:   40.2 — PiOS Evidence Connectors Layer

Purpose:
    Replicates the normalization logic from INT-03-40.2-GITHUB-INTAKE.
    Deduplicates extracted entities, consolidates source file references,
    and standardizes naming as observed in source files.

Normalization rules applied during INT-03:
    1. Deduplicate entities by (entity_type, canonical_name).
    2. Consolidate all source file references for each unique entity.
    3. Standardize naming as observed (no reformatting).
    4. Maintain direct linkage to source files.
    5. No inference: only entities with at least one source file reference are retained.

Usage:
    pipe from extract_entities.py:
    python3 scripts/pios/40.2/extract_entities.py | python3 scripts/pios/40.2/normalize_entities.py

    or from saved file:
    python3 scripts/pios/40.2/normalize_entities.py --input extracted_entities.tsv

Output:
    Tab-separated to stdout: entity_type <TAB> canonical_name <TAB> source_files (semicolon-separated)
    Summary printed to stderr.
"""

import sys
from collections import defaultdict


def normalize_name(name: str) -> str:
    """
    Standardize entity name as observed during INT-03.
    Strips leading/trailing whitespace only. No case normalization.
    No reformatting — names preserved exactly as found in source files.
    """
    return name.strip()


def main():
    use_input_file = False
    input_path = None

    for i, arg in enumerate(sys.argv[1:], 1):
        if arg == "--input" and i + 1 <= len(sys.argv) - 1:
            use_input_file = True
            input_path = sys.argv[i + 1]

    if use_input_file and input_path:
        with open(input_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    else:
        lines = sys.stdin.readlines()

    # entity_map: (entity_type, canonical_name) → set of source files
    entity_map = defaultdict(set)

    for line in lines:
        line = line.rstrip("\n")
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        entity_type = parts[0].strip()
        name = normalize_name(parts[1])
        source = parts[2].strip()

        key = (entity_type, name)
        entity_map[key].add(source)

    # Sort for deterministic output: by entity_type then name
    sorted_entities = sorted(entity_map.items(), key=lambda x: (x[0][0], x[0][1]))

    counts = defaultdict(int)

    for (entity_type, name), sources in sorted_entities:
        # Sort source files for deterministic output
        source_list = "; ".join(sorted(sources))
        print(f"{entity_type}\t{name}\t{source_list}")
        counts[entity_type] += 1

    total = sum(counts.values())

    print("", file=sys.stderr)
    print("Normalization Summary:", file=sys.stderr)
    for entity_type in sorted(counts.keys()):
        print(f"  {entity_type}: {counts[entity_type]}", file=sys.stderr)
    print(f"  total unique entities: {total}", file=sys.stderr)
    print("", file=sys.stderr)
    print("Normalization rules applied:", file=sys.stderr)
    print("  - Deduplicated by (entity_type, canonical_name)", file=sys.stderr)
    print("  - Source files consolidated per entity", file=sys.stderr)
    print("  - Names preserved as observed (no reformatting)", file=sys.stderr)
    print("  - No entities without source file references retained", file=sys.stderr)


if __name__ == "__main__":
    main()
