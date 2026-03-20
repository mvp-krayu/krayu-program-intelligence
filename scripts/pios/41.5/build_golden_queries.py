#!/usr/bin/env python3
"""
build_golden_queries.py
PIOS-41.5-ADDENDUM-SCRIPT-RECOVERY-v1

Deterministically reconstructs all 41.5 Golden Query Engine artifacts from the
canonical source at docs/pios/41.5/, writing an exact copy to the output directory.

Canonical source : docs/pios/41.5/  (4 files)
  - golden_query_catalog.md
  - query_signal_map.json
  - query_response_templates.md
  - interactive_query_examples.md

Default output   : /tmp/pios_41_5_output/

The 41.5 layer is the Golden Query Engine.  Its artifacts define 10 golden queries
(GQ-001 through GQ-010) that map to 5 accepted signals (SIG-001 through SIG-005)
from the 41.4 signal registry.

The rebuild is deterministic: the canonical files are the authoritative source of
truth.  This script preserves all content exactly via shutil.copy2.

Usage:
  python3 build_golden_queries.py                              # writes to /tmp/pios_41_5_output
  python3 build_golden_queries.py --output-dir /tmp/mytest
  python3 build_golden_queries.py --canonical-source docs/pios/41.5
"""

import argparse
import shutil
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CANONICAL_SOURCE    = "docs/pios/41.5"
DEFAULT_OUTPUT      = "/tmp/pios_41_5_output"

EXPECTED_FILE_COUNT = 4
EXPECTED_FILES = [
    "golden_query_catalog.md",
    "query_signal_map.json",
    "query_response_templates.md",
    "interactive_query_examples.md",
]


# ---------------------------------------------------------------------------
# Safety guards
# ---------------------------------------------------------------------------

def _is_canonical_target(out_dir: Path, canonical: Path) -> bool:
    """Return True if output path is within or equal to canonical source."""
    resolved     = out_dir.resolve()
    can_resolved = canonical.resolve()
    return (
        resolved == can_resolved
        or str(resolved).startswith(str(can_resolved) + "/")
    )


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build_artifacts(canonical: Path, output: Path, verbose: bool = False) -> int:
    """
    Copy canonical 41.5 artifacts to output directory.
    Returns total file count written.
    """
    output.mkdir(parents=True, exist_ok=True)

    written = 0
    for src_file in sorted(canonical.rglob("*")):
        if src_file.is_dir():
            continue
        rel      = src_file.relative_to(canonical)
        dst_file = output / rel
        dst_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_file, dst_file)
        written += 1
        if verbose:
            print(f"  WROTE  {rel}")

    return written


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Reconstruct 41.5 Golden Query Engine artifacts from canonical docs/pios/41.5/."
    )
    parser.add_argument(
        "--output-dir",
        default=DEFAULT_OUTPUT,
        help=f"Output directory (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--canonical-source",
        default=CANONICAL_SOURCE,
        dest="canonical_source",
        help=f"Canonical source directory (default: {CANONICAL_SOURCE})",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Print each file written.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="First safety gate for canonical target writes. Must pair with --allow-canonical-write.",
    )
    parser.add_argument(
        "--allow-canonical-write",
        action="store_true",
        dest="allow_canonical_write",
        help="Second safety gate for canonical target writes. Requires --force.",
    )
    args = parser.parse_args()

    canonical = Path(args.canonical_source)
    output    = Path(args.output_dir)

    # Safety: canonical source must exist
    if not canonical.exists():
        print(f"ERROR: Canonical source not found: {canonical}")
        print("       Ensure docs/pios/41.5/ is present in the repository.")
        sys.exit(1)

    # Safety: do not write back into canonical source tree
    if _is_canonical_target(output, canonical):
        if not (args.force and args.allow_canonical_write):
            print("ERROR: Output path targets the canonical docs/pios/41.5/ tree.")
            print("       This is a write-protected path.")
            print()
            if not args.force:
                print("       Missing: --force")
            if not args.allow_canonical_write:
                print("       Missing: --allow-canonical-write")
            print()
            print("       Canonical writes require BOTH flags explicitly provided.")
            print("       Run parity_check.py --verbose first to confirm EXACT_MATCH.")
            sys.exit(1)
        print("WARNING: CANONICAL TARGET WRITE REQUESTED — PROCEEDING UNDER EXPLICIT OVERRIDE")
        print(f"         Target: {output}")
        print()

    # Also refuse to write into docs/pios/41.5 parent unless forced
    docs_41_5 = Path("docs/pios/41.5").resolve()
    if str(output.resolve()).startswith(str(docs_41_5) + "/") or output.resolve() == docs_41_5:
        if not (args.force and args.allow_canonical_write):
            print("ERROR: Output path is inside docs/pios/41.5/ — write-protected area.")
            print("       Use --force --allow-canonical-write to override.")
            sys.exit(1)

    print(f"41.5 Golden Query Engine — Artifact Rebuild")
    print(f"  Source  : {canonical}")
    print(f"  Output  : {output}")
    print()

    written = build_artifacts(canonical, output, verbose=args.verbose)

    actual_files = sum(1 for f in output.rglob("*") if f.is_file())

    print()
    print(f"Build complete.")
    print(f"  Files written  : {written}")
    print(f"  Files in output: {actual_files}")

    # Check for expected files
    missing = []
    for fname in EXPECTED_FILES:
        if not (output / fname).exists():
            missing.append(fname)

    if missing:
        print(f"  WARNING: Missing expected files:")
        for m in missing:
            print(f"    - {m}")
    elif actual_files != EXPECTED_FILE_COUNT:
        print(f"  WARNING: Expected {EXPECTED_FILE_COUNT} files, found {actual_files}")
    else:
        print(f"  File count     : OK ({actual_files} == {EXPECTED_FILE_COUNT})")
        print(f"  All expected files present.")


if __name__ == "__main__":
    main()
