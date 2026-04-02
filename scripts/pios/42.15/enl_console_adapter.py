#!/usr/bin/env python3
"""
enl_console_adapter.py
PIOS-42.15-RUN01-CONTRACT-v1

ENL Console Adapter — Structured JSON

Layer chain:
  42.1  computation / traversal   (QUERY → SIGNAL → EVIDENCE)
  42.2  narrative rendering       (structured data → executive narrative)
  42.15 ENL surface              (projection-enriched signal view, JSON adapter)

Reads:
  - query-signal bindings via 42.2 → 42.1
  - emphasis and signal_state from docs/pios/44.2/projection_attachment.json

Rules:
  R1  query-signal data sourced via 42.2 module (_r42._q41.*)
  R2  projection data read read-only from 44.2 artifact — no derivation
  R3  no scoring, no inference, no computation of emphasis
  R4  fail closed on invalid or absent query_id (exit 1)
  R5  JSON output to stdout only; no file writes
  R6  deterministic — same inputs → same output

Usage:
  python3 scripts/pios/42.15/enl_console_adapter.py --query GQ-003
"""

import argparse
import json
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# R1: Import 42.2 rendering path
# ---------------------------------------------------------------------------

_42_2_PATH = Path(__file__).resolve().parents[1] / "42.2"
if str(_42_2_PATH) not in sys.path:
    sys.path.insert(0, str(_42_2_PATH))

try:
    import render_executive_narrative as _r42
except ImportError as e:
    print(json.dumps({
        "error": f"ADAPTER FAILURE [R1] — cannot import 42.2 rendering module: {e}",
        "expected_path": str(_42_2_PATH / "render_executive_narrative.py"),
    }), file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# R2: Projection attachment path (read-only)
# ---------------------------------------------------------------------------

PROJECTION_ATTACHMENT_PATH = (
    Path(__file__).resolve().parents[3]
    / "docs" / "pios" / "44.2" / "projection_attachment.json"
)

CONTRACT_ID = "PIOS-42.15-RUN01-CONTRACT-v1"


def _load_projection_index() -> dict:
    """
    Load 44.2 projection_attachment.json.
    Returns dict keyed by signal_id → projection record.
    Read-only. No derivation. [R2, R3]
    """
    try:
        with open(PROJECTION_ATTACHMENT_PATH) as f:
            data = json.load(f)
    except FileNotFoundError:
        return {}
    return {
        p["signal_reference"]["signal_id"]: p
        for p in data.get("projections", [])
        if "signal_reference" in p
    }


def get_enl_output(query_id: str) -> dict:
    """
    Return structured ENL output for query_id.
    Signals from 42.2 → 42.1. Emphasis from 44.2 projection attachment.
    No derivation. [R1, R2, R3, R6]
    """
    # Preflight via 42.2 → 42.1
    _r42._q41.preflight_check()

    # Load via 42.2 → 42.1 [R1]
    qsmap           = _r42._q41.load_query_signal_map()
    signal_registry = _r42._q41.load_signal_registry()

    # R4: fail closed on invalid query_id
    query_entry = _r42._q41.resolve_query(query_id, qsmap)

    # Projection index from 44.2 [R2]
    proj_index = _load_projection_index()

    # Assemble ENL signal entries
    enl_signals = []
    emphasis_nodes = []

    for mapping in query_entry.get("mapped_signals", []):
        sig_id = mapping["signal_id"]

        # Resolve signal from registry (dict keyed by signal_id)
        sig = signal_registry.get(sig_id)
        if sig is None:
            continue

        # Projection record for this signal [R2, R3]
        proj = proj_index.get(sig_id, {})
        signal_state    = proj.get("signal_reference", {}).get("signal_state", "unknown")
        emphasis        = proj.get("emphasis", "none")
        node_id         = proj.get("node_reference", {}).get("node_id")
        proj_reference  = proj.get("projection_reference")

        entry = {
            "signal_id":       sig_id,
            "relevance":       mapping["relevance"],
            "title":           sig["title"],
            "signal_state":    signal_state,
            "emphasis":        emphasis,
            "node_id":         node_id,
            "projection_reference": proj_reference,
            "domain_id":       sig.get("domain_id"),
            "domain_name":     sig.get("domain_name"),
            "capability_id":   sig.get("capability_id"),
            "capability_name": sig.get("capability_name"),
            "component_ids":   sig.get("component_ids", []),
            "component_names": sig.get("component_names", []),
        }
        enl_signals.append(entry)

        if emphasis == "high" and node_id:
            emphasis_nodes.append({
                "node_id":   node_id,
                "emphasis":  emphasis,
                "signal_id": sig_id,
            })

    return {
        "contract_id":        CONTRACT_ID,
        "query_id":           query_id,
        "query_text":         query_entry["query_text"],
        "intent_type":        query_entry["intent_type"],
        "aggregate_confidence": query_entry["aggregate_confidence"],
        "enl_signals":        enl_signals,
        "emphasis_nodes":     emphasis_nodes,
        "projection_source":  str(PROJECTION_ATTACHMENT_PATH.relative_to(
            Path(__file__).resolve().parents[3]
        )),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description=(
            "ENL Console Adapter — PIOS-42.15-RUN01-CONTRACT-v1\n"
            "Projection-enriched signal view for a given query.\n"
            "No derivation. Evidence-first. Fail closed on invalid query."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--query", "-q",
        required=True,
        help="Query ID (e.g. GQ-003)",
    )
    args = parser.parse_args()

    query_id = args.query.strip().upper()
    if not query_id:
        print(json.dumps({"error": "ERROR [R4]: empty query_id"}), file=sys.stderr)
        sys.exit(1)

    data = get_enl_output(query_id)
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    main()
