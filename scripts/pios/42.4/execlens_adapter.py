#!/usr/bin/env python3
"""
execlens_adapter.py
PIOS-42.4-RUN01-CONTRACT-v2

ExecLens Demo Surface Layer — Structured JSON Adapter

Layer chain:
  42.1  computation / traversal   (QUERY → SIGNAL → EVIDENCE → NAVIGATION)
  42.2  narrative rendering       (structured data → executive narrative)
  42.3  delivery / interface      (CLI surface — formatting only, no logic)
  42.4  demo surface              (graphical UI — JSON adapter, no logic)

This script imports the 42.2 module and accesses 42.1 data via _r42._q41.*.
No bypass of 42.2. No direct 41.x artifact file access. No recomputation.
No synthetic data. All values sourced from locked 41.x artifacts via 42.1 → 42.2.

Rules:
  R1  all data sourced via 42.2 module (_r42._q41.*)
  R2  no direct 41.x file access (no open() of 41.x paths)
  R3  no synthetic data, no placeholder values; missing data → explicit null
  R4  fail closed on invalid or absent query_id (exit 1)
  R5  JSON output to stdout only; no file writes
  R6  deterministic — same query_id → same JSON output

Usage:
  python3 scripts/pios/42.4/execlens_adapter.py GQ-001
  python3 scripts/pios/42.4/execlens_adapter.py GQ-006
  python3 scripts/pios/42.4/execlens_adapter.py --list
"""

import argparse
import json
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# EX.3: Import PiOS bridge — live CE.4/CE.5/CE.2 governed outputs
# ---------------------------------------------------------------------------

_EX3_PATH = Path(__file__).resolve().parents[1] / "EX.3"
if str(_EX3_PATH) not in sys.path:
    sys.path.insert(0, str(_EX3_PATH))

try:
    import pios_bridge as _bridge
    _BRIDGE_AVAILABLE = True
except ImportError:
    _BRIDGE_AVAILABLE = False

# ---------------------------------------------------------------------------
# R1: Import 42.2 rendering path — no bypass allowed
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

CONTRACT_ID = "PIOS-42.4-RUN01-CONTRACT-v2"


# ---------------------------------------------------------------------------
# R1: Structured data assembly via 42.2 → 42.1
# ---------------------------------------------------------------------------

def get_query_data(query_id: str) -> dict:
    """
    Retrieve structured data for query_id via 42.2 module → 42.1 traversal.
    All values sourced from locked 41.x artifacts. [R1, R3, R6]
    Fail closed on invalid query_id. [R4]
    """
    # Preflight via 42.2 → 42.1
    _r42._q41.preflight_check()

    # Load all data sources via 42.2 → 42.1 (R1: no direct 41.x access)
    qsmap           = _r42._q41.load_query_signal_map()
    signal_registry = _r42._q41.load_signal_registry()
    evidence_index  = _r42._q41.load_evidence_index()
    templates_text  = _r42._q41.load_response_templates()

    # R4: resolve query — 42.1 fails closed (exit 1) if absent
    query_entry = _r42._q41.resolve_query(query_id, qsmap)

    # Bind signals via 42.1
    bound_signals = _r42._q41.bind_signals(query_entry, signal_registry)

    # Bind evidence via 42.1
    bound_signals = _r42._q41.bind_evidence(bound_signals, evidence_index)

    # Extract template section via 42.1
    template_section = _r42._q41.extract_template_section(query_id, templates_text)

    # Bind navigation via 42.1
    nav_bindings = _r42._q41.bind_navigation(template_section)

    # EX.3: Invoke live engine once for all signals in this query
    _live_data = _bridge.get_live_pios_data() if _BRIDGE_AVAILABLE else None

    # --- Assemble signal entries ---
    signals_out = []
    for bs in bound_signals:
        m   = bs["mapping"]
        reg = bs["registry"]
        ev  = bs.get("evidence")
        ev_warning = bs.get("evidence_warning")

        # EX.3: CE.4/CE.5/CE.2 governed context for this L3 signal
        pios_ctx = _bridge.get_l3_signal_pios_context(_live_data, reg["signal_id"]) if _BRIDGE_AVAILABLE else {
            "pios_emission_state": None, "pios_ce5_consumption_state": None,
            "pios_condition_tier": None, "pios_diagnosis_state": None, "pios_run_id": None,
        }

        signal_entry = {
            "signal_id":                  reg["signal_id"],
            "relevance":                  m["relevance"],
            "title":                      reg["title"],
            "evidence_confidence":        reg["evidence_confidence"],
            "domain_id":                  reg["domain_id"],
            "domain_name":                reg["domain_name"],
            "capability_id":              reg["capability_id"],
            "capability_name":            reg["capability_name"],
            "component_ids":              reg.get("component_ids", []),
            "component_names":            reg.get("component_names", []),
            "statement":                  reg["statement"],
            "business_impact":            reg.get("business_impact"),
            "risk":                       reg.get("risk"),
            "pios_emission_state":        pios_ctx["pios_emission_state"],
            "pios_ce5_consumption_state": pios_ctx["pios_ce5_consumption_state"],
            "pios_condition_tier":        pios_ctx["pios_condition_tier"],
            "pios_diagnosis_state":       pios_ctx["pios_diagnosis_state"],
            "pios_run_id":                pios_ctx["pios_run_id"],
        }

        # Evidence — only from evidence_mapping_index.json; null if missing
        if ev_warning:
            signal_entry["evidence"] = None
            signal_entry["evidence_warning"] = ev_warning
        else:
            signal_entry["evidence"] = {
                "source_object_id":   ev["source_object_id"],
                "source_layer":       ev["source_layer"],
                "source_file":        ev["source_file"],
                "supporting_objects": ev.get("supporting_objects", []),
                "evidence_chain":     ev.get("evidence_chain", ""),
                "blocking_point":     ev.get("blocking_point"),
                "temporal_reference": ev.get("temporal_reference"),
            }
            signal_entry["evidence_warning"] = None

        signals_out.append(signal_entry)

    # --- Assemble navigation ---
    navigation_out = [
        {
            "link":     nb["link"],
            "filename": nb["filename"],
            "resolved": nb["resolved"],
            "path":     nb.get("path"),
        }
        for nb in nav_bindings
    ]

    return {
        "contract_id":          CONTRACT_ID,
        "query_id":             query_id,
        "query_text":           query_entry["query_text"],
        "intent_type":          query_entry["intent_type"],
        "aggregate_confidence": query_entry["aggregate_confidence"],
        "semantic_tags":        query_entry.get("semantic_tags", []),
        "signals":              signals_out,
        "navigation":           navigation_out,
        "template_section":     template_section,
    }


def get_query_list() -> dict:
    """
    Return list of all available queries as JSON. [R1]
    Sourced from query_signal_map.json via 42.2 → 42.1.
    """
    _r42._q41.preflight_check()
    qsmap = _r42._q41.load_query_signal_map()
    queries = sorted(qsmap.get("queries", []), key=lambda q: q["query_id"])
    return {
        "contract_id": CONTRACT_ID,
        "queries": [
            {
                "query_id":             q["query_id"],
                "query_text":           q["query_text"],
                "intent_type":          q["intent_type"],
                "aggregate_confidence": q["aggregate_confidence"],
                "semantic_tags":        q.get("semantic_tags", []),
            }
            for q in queries
        ],
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description=(
            "ExecLens JSON Adapter — PIOS-42.4-RUN01-CONTRACT-v2\n"
            "Structured JSON output via 42.2 → 42.1 layer chain.\n"
            "No synthetic data. Evidence-first. Fail closed on invalid query."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "query_id",
        nargs="?",
        help="Query ID to retrieve (e.g. GQ-001)",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="Return JSON list of all available queries.",
    )
    args = parser.parse_args()

    if args.list:
        print(json.dumps(get_query_list(), indent=2))
        sys.exit(0)

    if not args.query_id:
        parser.print_help(sys.stderr)
        print("\nERROR [R4]: query_id argument required.", file=sys.stderr)
        sys.exit(1)

    query_id = args.query_id.strip().upper()
    if not query_id:
        print(json.dumps({"error": "ERROR [R4]: empty query_id"}), file=sys.stderr)
        sys.exit(1)

    data = get_query_data(query_id)
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    main()
