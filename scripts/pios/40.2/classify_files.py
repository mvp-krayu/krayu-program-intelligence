#!/usr/bin/env python3
"""
classify_files.py
Contract: INT-04-40.2-RUNTIME-EXTRACTION
Stream:   40.2 — PiOS Evidence Connectors Layer

Purpose:
    Replicates the exact classification logic from INT-03-40.2-GITHUB-INTAKE.
    Assigns each file exactly one primary classification.

Classification rules (in priority order, as applied during INT-03):

    code:
        - .sh extension

    configuration:
        - .yml extension under .github/workflows/
        - .gitignore
        - filename starts with .env

    documentation:
        - .md extension

    other:
        - .DS_Store
        - .zip
        - any file not matched by the above rules

    interface:
        - not present in this repository (zero files)
        - reserved for API schemas, OpenAPI specs, contract definitions

Single primary classification rule:
    Every file receives exactly one classification.
    No file may appear in more than one category.
    Secondary interpretive notes do not affect classification assignment.

Usage:
    python3 scripts/pios/40.2/classify_files.py [REPO_ROOT]

    Or pipe from scan_repository.sh:
    ./scripts/pios/40.2/scan_repository.sh | python3 scripts/pios/40.2/classify_files.py --stdin

Output:
    Tab-separated: classification <TAB> relative_file_path
    Summary counts printed to stderr.

Expected classification distribution (INT-03 baseline):
    code:          1
    documentation: 94
    configuration: 3
    interface:     0
    other:         8
    total:         106
"""

import sys
import os
from pathlib import Path


EXPECTED = {
    "code": 1,
    "documentation": 94,
    "configuration": 3,
    "interface": 0,
    "other": 8,
}


def classify(relative_path: str) -> str:
    """
    Apply INT-03 classification rules to a relative file path.
    Returns exactly one classification string.
    """
    p = Path(relative_path)
    name = p.name
    suffix = p.suffix.lower()
    parts = p.parts

    # code: shell scripts
    if suffix == ".sh":
        return "code"

    # configuration: CI/CD workflow files
    if suffix == ".yml" and ".github" in parts and "workflows" in parts:
        return "configuration"

    # configuration: git ignore
    if name == ".gitignore":
        return "configuration"

    # configuration: environment files
    if name.startswith(".env"):
        return "configuration"

    # documentation: markdown files
    if suffix == ".md":
        return "documentation"

    # other: macOS system files
    if name == ".DS_Store":
        return "other"

    # other: binary archives
    if suffix == ".zip":
        return "other"

    # other: fallback for any unmatched file
    return "other"


def main():
    use_stdin = "--stdin" in sys.argv
    repo_root = None

    if not use_stdin:
        if len(sys.argv) >= 2 and sys.argv[1] != "--stdin":
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

    results = []

    if use_stdin:
        lines = [line.rstrip("\n") for line in sys.stdin if line.strip()]
    else:
        # Run scan inline using same logic as scan_repository.sh
        import subprocess
        find_output = subprocess.check_output(
            ["find", repo_root,
             "-not", "-path", "*/.git",
             "-not", "-path", "*/.git/*",
             "-not", "-path", "*/node_modules/*",
             "-not", "-type", "d"],
            text=True
        )
        lines = sorted([
            line.replace(repo_root + "/", "", 1)
            for line in find_output.strip().split("\n")
            if line.strip()
        ])

    counts = {k: 0 for k in EXPECTED}

    for rel_path in lines:
        if not rel_path.strip():
            continue
        classification = classify(rel_path)
        counts[classification] = counts.get(classification, 0) + 1
        results.append((classification, rel_path))
        print(f"{classification}\t{rel_path}")

    total = sum(counts.values())

    print("", file=sys.stderr)
    print("Classification Summary:", file=sys.stderr)
    print(f"  code:          {counts.get('code', 0)}", file=sys.stderr)
    print(f"  documentation: {counts.get('documentation', 0)}", file=sys.stderr)
    print(f"  configuration: {counts.get('configuration', 0)}", file=sys.stderr)
    print(f"  interface:     {counts.get('interface', 0)}", file=sys.stderr)
    print(f"  other:         {counts.get('other', 0)}", file=sys.stderr)
    print(f"  total:         {total}", file=sys.stderr)
    print("", file=sys.stderr)

    pass_fail = True
    for cat, expected_count in EXPECTED.items():
        actual = counts.get(cat, 0)
        status = "PASS" if actual == expected_count else "FAIL"
        if status == "FAIL":
            pass_fail = False
        print(f"  {cat}: expected {expected_count}, got {actual} — {status}", file=sys.stderr)

    print("", file=sys.stderr)
    if pass_fail:
        print("Classification verification: PASS", file=sys.stderr)
    else:
        print("Classification verification: FAIL — repository state may differ from INT-03 baseline (2026-03-18)", file=sys.stderr)


if __name__ == "__main__":
    main()
