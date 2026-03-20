#!/usr/bin/env python3
"""
parity_check.py
PIOS-41.3-ADDENDUM-SCRIPT-RECOVERY-v1

Compares generated 41.3 artifacts against canonical docs/pios/41.3/.

Comparison strategy:
  1. File set equality (same relative paths in both)
  2. Byte-level SHA-256 content equality per file
  3. [[wiki-link]] structure equality for markdown files (secondary check)

Reports EXACT_MATCH (all checks pass, exit 0) or DIFF (any mismatch, exit 1).

Usage:
  python3 parity_check.py --generated /tmp/pios_41_3_verify --canonical docs/pios/41.3
  python3 parity_check.py --generated /tmp/pios_41_3_verify --canonical docs/pios/41.3 --verbose
"""

import argparse
import hashlib
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def _file_set(root: Path) -> dict[str, Path]:
    """Return {relative_path_str: absolute_path} for all files under root."""
    return {
        str(f.relative_to(root)): f
        for f in root.rglob("*") if f.is_file()
    }


def _extract_wiki_links(text: str) -> list[str]:
    """Return sorted list of all [[target]] values in text."""
    return sorted(re.findall(r'\[\[([^\]]+)\]\]', text))


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

class ParityReport:
    def __init__(self):
        self.diffs:  list[str] = []
        self.matches: list[str] = []

    def add_diff(self, context: str, detail: str):
        self.diffs.append(f"  DIFF  [{context}]\n        {detail}")

    def add_match(self, context: str):
        self.matches.append(f"  MATCH [{context}]")

    def is_exact_match(self) -> bool:
        return len(self.diffs) == 0


# ---------------------------------------------------------------------------
# Comparison phases
# ---------------------------------------------------------------------------

def phase1_file_set_equality(gen: dict, can: dict, report: ParityReport):
    """Check that both directories contain exactly the same set of relative paths."""
    gen_keys = set(gen.keys())
    can_keys = set(can.keys())

    only_generated = gen_keys - can_keys
    only_canonical = can_keys - gen_keys
    common         = gen_keys & can_keys

    if only_generated:
        for k in sorted(only_generated):
            report.add_diff("file_set: extra in generated", k)
    if only_canonical:
        for k in sorted(only_canonical):
            report.add_diff("file_set: missing from generated", k)
    if not only_generated and not only_canonical:
        report.add_match(f"file_set: {len(common)} file(s) match exactly")

    return common


def phase2_content_equality(common: set, gen: dict, can: dict,
                             report: ParityReport, verbose: bool = False):
    """Byte-level SHA-256 comparison for every file in common."""
    diff_count  = 0
    match_count = 0
    for rel in sorted(common):
        g_hash = _sha256(gen[rel])
        c_hash = _sha256(can[rel])
        if g_hash == c_hash:
            match_count += 1
            if verbose:
                report.add_match(f"content: {rel}")
        else:
            diff_count += 1
            report.add_diff(
                f"content: {rel}",
                f"generated SHA-256: {g_hash[:16]}... | canonical SHA-256: {c_hash[:16]}..."
            )
    if diff_count == 0:
        report.add_match(f"content: all {match_count} file(s) byte-identical")
    return diff_count


def phase3_wiki_link_structure(common: set, gen: dict, can: dict,
                                report: ParityReport):
    """
    Verify [[wiki-link]] structure equality for markdown files.
    Secondary check — content equality already catches these, but link
    structure is surfaced explicitly for diagnosis.
    """
    md_files   = {k for k in common if k.endswith(".md")}
    link_diffs = 0

    for rel in sorted(md_files):
        gen_text  = gen[rel].read_text(encoding="utf-8")
        can_text  = can[rel].read_text(encoding="utf-8")
        gen_links = _extract_wiki_links(gen_text)
        can_links = _extract_wiki_links(can_text)

        if gen_links == can_links:
            pass  # Only surface mismatches
        else:
            link_diffs += 1
            only_gen = sorted(set(gen_links) - set(can_links))
            only_can = sorted(set(can_links) - set(gen_links))
            detail_parts = []
            if only_gen:
                detail_parts.append(f"extra in generated: {only_gen}")
            if only_can:
                detail_parts.append(f"missing from generated: {only_can}")
            report.add_diff(
                f"wiki_links: {rel}",
                "; ".join(detail_parts)
            )

    if link_diffs == 0:
        report.add_match(
            f"wiki_links: all {len(md_files)} markdown file(s) have identical [[link]] structure"
        )
    return link_diffs


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Compare generated 41.3 artifacts against canonical docs/pios/41.3/."
    )
    parser.add_argument(
        "--generated",
        default="/tmp/pios_41_3_output",
        help="Generated artifacts directory (default: /tmp/pios_41_3_output)",
    )
    parser.add_argument(
        "--canonical",
        default="docs/pios/41.3",
        help="Canonical artifacts directory (default: docs/pios/41.3)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show MATCH lines as well as DIFF lines.",
    )
    args = parser.parse_args()

    gen_dir = Path(args.generated)
    can_dir = Path(args.canonical)

    if not gen_dir.exists():
        print(f"ERROR: Generated directory not found: {gen_dir}")
        print("       Run build_link_normalization.py first.")
        sys.exit(1)
    if not can_dir.exists():
        print(f"ERROR: Canonical directory not found: {can_dir}")
        sys.exit(1)

    print(f"Parity check")
    print(f"  Generated : {gen_dir}")
    print(f"  Canonical : {can_dir}")
    print()

    gen_files = _file_set(gen_dir)
    can_files = _file_set(can_dir)

    print(f"  Generated files : {len(gen_files)}")
    print(f"  Canonical files : {len(can_files)}")
    print()

    report = ParityReport()

    # Phase 1: file set equality
    common = phase1_file_set_equality(gen_files, can_files, report)

    # Phase 2: byte-level content equality
    phase2_content_equality(common, gen_files, can_files, report, verbose=args.verbose)

    # Phase 3: wiki-link structure (secondary check)
    phase3_wiki_link_structure(common, gen_files, can_files, report)

    # Print results
    print("=" * 60)
    if report.diffs:
        print("--- DIFFERENCES ---")
        for d in report.diffs:
            print(d)
        print()

    if args.verbose and report.matches:
        print("--- MATCHES ---")
        for m in report.matches:
            print(m)
        print()

    print("=" * 60)
    total_diffs = len(report.diffs)
    if report.is_exact_match():
        print("PARITY CHECK RESULT: EXACT_MATCH")
        print(f"Generated artifacts are structurally and byte-identical to canonical.")
        print(f"  Files compared  : {len(common)}")
        print(f"  Differences     : 0")
        print("Safe to promote to docs/pios/41.3/ if desired.")
        sys.exit(0)
    else:
        print("PARITY CHECK RESULT: DIFF")
        print(f"  Files compared  : {len(common)}")
        print(f"  Differences     : {total_diffs}")
        print("Review diffs before any canonical promotion.")
        sys.exit(1)


if __name__ == "__main__":
    main()
