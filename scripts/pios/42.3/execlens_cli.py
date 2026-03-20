#!/usr/bin/env python3
"""
execlens_cli.py
PIOS-42.3-RUN01-CONTRACT-v1

ExecLens Delivery & Interface Layer — Stream 42.3

Layer chain:
  42.1  computation / traversal   (QUERY → SIGNAL → EVIDENCE → NAVIGATION)
  42.2  narrative rendering       (structured data → executive narrative)
  42.3  delivery / interface      (CLI surface — formatting only, no logic)

This script imports and calls the 42.2 rendering path directly. [R2]
No bypass of 42.2. No direct access to 41.x artifacts. No recomputation.

Rules:
  R1  entrypoint validates query_id before passing to 42.2
  R2  must call 42.2; must not bypass
  R3  formatting/headers/spacing allowed; content modification forbidden
  R4  all signals, evidence, navigation passed through unchanged
  R5  no new reasoning
  R6  identical input → identical output

Usage:
  python3 scripts/pios/42.3/execlens_cli.py GQ-001
  python3 scripts/pios/42.3/execlens_cli.py GQ-006 --verbose
  python3 scripts/pios/42.3/execlens_cli.py --list
"""

import argparse
import sys
from pathlib import Path
from typing import List

# ---------------------------------------------------------------------------
# R2: Import 42.2 rendering path — no bypass allowed
# ---------------------------------------------------------------------------

_42_2_PATH = Path(__file__).resolve().parents[1] / "42.2"
if str(_42_2_PATH) not in sys.path:
    sys.path.insert(0, str(_42_2_PATH))

try:
    import render_executive_narrative as _r42
except ImportError as e:
    print(f"DELIVERY FAILURE [R2] — cannot import 42.2 rendering module: {e}")
    print(f"  Expected at: {_42_2_PATH}/render_executive_narrative.py")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Demo formatting constants  (G2: framing only — no meaning change)
# ---------------------------------------------------------------------------

_W    = 80
_DEMO = "·" * _W

CONTRACT_ID = "PIOS-42.3-RUN01-CONTRACT-v1"
LAYER_TAG   = "ExecLens CLI  ·  Stream 42.3 — Delivery & Interface Layer"


# ---------------------------------------------------------------------------
# R3: CLI framing  (formatting only — content unchanged from 42.2)
# ---------------------------------------------------------------------------

def _demo_header(query_id: str) -> List[str]:
    return [
        _DEMO,
        f"  {LAYER_TAG}",
        f"  {CONTRACT_ID} / run_01_blueedge",
        _DEMO,
        f"  Executing query: {query_id}",
        f"  Layer chain    : 42.1 (traversal) → 42.2 (rendering) → 42.3 (delivery)",
        _DEMO,
        "",
    ]


def _demo_footer() -> List[str]:
    return [
        "",
        _DEMO,
        f"  ExecLens session complete.",
        f"  All content sourced from locked 41.x artifacts via 42.1 → 42.2.",
        f"  No inference. No recomputation. Evidence-first delivery.",
        _DEMO,
    ]


# ---------------------------------------------------------------------------
# Main deliver function
# ---------------------------------------------------------------------------

def deliver(query_id: str, verbose: bool = False) -> None:
    """
    Deliver executive narrative for query_id via 42.2 rendering layer. [R2, R4, R6]
    Adds demo framing (header/footer) without altering 42.2 output content.
    """
    # Demo header  (R3: formatting only)
    print("\n".join(_demo_header(query_id)))

    # R2: delegate all rendering to 42.2 — no bypass, no direct 41.x access
    _r42.render_narrative(query_id, verbose=verbose)

    # Demo footer  (R3: formatting only)
    print("\n".join(_demo_footer()))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description=(
            "ExecLens CLI — PIOS-42.3-RUN01-CONTRACT-v1\n"
            "Delivery interface (42.3) over 42.2 rendering over 42.1 traversal.\n"
            "Layer chain: 42.1 → 42.2 → 42.3"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "query_id",
        nargs="?",
        help="Query ID to deliver (e.g. GQ-001)",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List all available query IDs and exit.",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Include business_impact and risk from signal registry.",
    )
    args = parser.parse_args()

    if args.list:
        # R2: delegate to 42.2 which delegates to 42.1
        _r42._q41.preflight_check()
        qsmap = _r42._q41.load_query_signal_map()
        _r42._q41.list_queries(qsmap)
        sys.exit(0)

    if not args.query_id:
        parser.print_help()
        print()
        print("ERROR: query_id argument required.")
        sys.exit(1)

    # R1: validate input format before passing downstream
    query_id = args.query_id.strip().upper()
    if not query_id:
        print("ERROR [R1]: empty query_id")
        sys.exit(1)

    # R2: deliver via 42.2 (fail closed if 42.2/42.1 fail — G4)
    deliver(query_id, verbose=args.verbose)


if __name__ == "__main__":
    main()
