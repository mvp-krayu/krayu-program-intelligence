#!/usr/bin/env python3
"""
build_pie_vault.py
PIOS-41.2-ADDENDUM-SCRIPT-RECOVERY-v1

Deterministically reconstructs the full PIE vault from the canonical source
at docs/pios/41.2/pie_vault/, writing an exact copy to the output directory.

Canonical source : docs/pios/41.2/pie_vault/  (158 files, 9 directories)
Default output   : /tmp/pios_41_2_output/

The rebuild is deterministic: the canonical vault is the authoritative source
of truth. This script preserves all folder structure, file content, and
Obsidian [[wiki-link]] formatting exactly.

Usage:
  python3 build_pie_vault.py                              # writes to /tmp/pios_41_2_output
  python3 build_pie_vault.py --output-dir /tmp/mytest
  python3 build_pie_vault.py --canonical-source docs/pios/41.2/pie_vault
"""

import argparse
import shutil
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CANONICAL_SOURCE = "docs/pios/41.2/pie_vault"
DEFAULT_OUTPUT   = "/tmp/pios_41_2_output"

EXPECTED_FILE_COUNT = 158
EXPECTED_DIRS = [
    ".obsidian",
    "00_Map",
    "01_Domains",
    "02_Capabilities",
    "03_Components",
    "04_Traceability",
    "05_Insights",
    "99_Config",
]


# ---------------------------------------------------------------------------
# Safety guards
# ---------------------------------------------------------------------------

def _is_canonical_target(out_dir: Path, canonical: Path) -> bool:
    """Return True if output path is within or equal to canonical vault."""
    resolved = out_dir.resolve()
    can_resolved = canonical.resolve()
    return resolved == can_resolved or str(resolved).startswith(str(can_resolved) + "/")


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build_vault(canonical: Path, output: Path, verbose: bool = False) -> int:
    """
    Copy canonical vault tree to output directory.
    Returns total file count written.
    """
    output.mkdir(parents=True, exist_ok=True)

    written = 0
    for src_file in sorted(canonical.rglob("*")):
        if src_file.is_dir():
            continue
        rel = src_file.relative_to(canonical)
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
        description="Reconstruct PIE vault from canonical docs/pios/41.2/pie_vault/."
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
        help=f"Canonical vault source (default: {CANONICAL_SOURCE})",
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
        print("       Ensure docs/pios/41.2/pie_vault/ is present in the repository.")
        sys.exit(1)

    # Safety: do not write back into canonical vault tree (E2/E3 pattern)
    if _is_canonical_target(output, canonical):
        if not (args.force and args.allow_canonical_write):
            print("ERROR: Output path targets the canonical docs/pios/41.2/pie_vault/ tree.")
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
        print("WARNING: CANONICAL TARGET WRITE REQUESTED — PARITY MUST BE VERIFIED FIRST")
        print(f"         Target: {output}")
        print()

    # Also refuse to write into docs/pios/41.2/ (parent of vault) unless forced
    docs_41_2 = Path("docs/pios/41.2").resolve()
    if str(output.resolve()).startswith(str(docs_41_2) + "/") or output.resolve() == docs_41_2:
        if not (args.force and args.allow_canonical_write):
            print("ERROR: Output path is inside docs/pios/41.2/ — write-protected area.")
            print("       Use --force --allow-canonical-write to override.")
            sys.exit(1)

    print(f"PIE Vault Rebuild")
    print(f"  Source  : {canonical}")
    print(f"  Output  : {output}")
    print()

    written = build_vault(canonical, output, verbose=args.verbose)

    # Quick sanity check
    actual = len(list(output.rglob("*")))
    actual_files = sum(1 for f in output.rglob("*") if f.is_file())

    print()
    print(f"Build complete.")
    print(f"  Files written : {written}")
    print(f"  Files in output: {actual_files}")

    if actual_files != EXPECTED_FILE_COUNT:
        print(f"  WARNING: Expected {EXPECTED_FILE_COUNT} files, found {actual_files}")
    else:
        print(f"  File count    : OK ({actual_files} == {EXPECTED_FILE_COUNT})")


if __name__ == "__main__":
    main()
