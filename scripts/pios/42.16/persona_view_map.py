#!/usr/bin/env python3
"""
persona_view_map.py
PIOS-42.16-RUN01-CONTRACT-v1

Persona View Map — Structured JSON

Maps ENL signal output to a persona-scoped view.
Personas: EXECUTIVE, CTO, ANALYST

Rules:
  R1  ENL data sourced from 42.15 adapter logic (same chain: 42.2 → 42.1 + 44.2)
  R2  persona mapping only — no new computation, no scoring
  R3  persona labels and focal fields are static mapping constants
  R4  fail closed on invalid persona or query_id (exit 1)
  R5  JSON output to stdout only; no file writes
  R6  deterministic — same inputs → same output

Usage:
  python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003
  python3 scripts/pios/42.16/persona_view_map.py --persona CTO --query GQ-003
  python3 scripts/pios/42.16/persona_view_map.py --persona ANALYST --query GQ-003
"""

import argparse
import json
import sys
from pathlib import Path

# Import 42.15 ENL adapter
_42_15_PATH = Path(__file__).resolve().parents[1] / "42.15"
if str(_42_15_PATH) not in sys.path:
    sys.path.insert(0, str(_42_15_PATH))

try:
    from enl_console_adapter import get_enl_output
except ImportError as e:
    print(json.dumps({
        "error": f"ADAPTER FAILURE [R1] — cannot import 42.15 ENL adapter: {e}",
        "expected_path": str(_42_15_PATH / "enl_console_adapter.py"),
    }), file=sys.stderr)
    sys.exit(1)

CONTRACT_ID = "PIOS-42.16-RUN01-CONTRACT-v1"

ALLOWED_PERSONAS = ["EXECUTIVE", "CTO", "ANALYST"]

# ---------------------------------------------------------------------------
# R3: Static persona mapping constants — no computation [R2, R3]
# ---------------------------------------------------------------------------

PERSONA_LENS = {
    "EXECUTIVE": {
        "lens":              "delivery_commitment",
        "framing_label":     "Program Delivery Risk",
        "primary_question":  "What does this mean for my program delivery commitment?",
        "focus_signal_states": ["evaluable", "computed", "partial"],
        "focus_emphasis":    ["high"],
        "exclude_signal_states": [],
    },
    "CTO": {
        "lens":              "structural_risk",
        "framing_label":     "Architectural Structural Risk",
        "primary_question":  "What structural risk does this expose in my architecture?",
        "focus_signal_states": ["evaluable", "computed"],
        "focus_emphasis":    ["high"],
        "exclude_signal_states": [],
    },
    "ANALYST": {
        "lens":              "evidence_gap",
        "framing_label":     "Evidence State and Gaps",
        "primary_question":  "What evidence gaps remain and what would close them?",
        "focus_signal_states": ["blocked", "partial", "evaluable"],
        "focus_emphasis":    [],
        "exclude_signal_states": [],
    },
}


def _apply_persona_filter(enl_signals: list, persona_config: dict) -> list:
    """
    Filter and order signals by persona lens.
    No computation — reorder and select from existing enl_signals. [R2]
    """
    focus_states   = set(persona_config["focus_signal_states"])
    focus_emphasis = set(persona_config["focus_emphasis"])

    primary   = []
    secondary = []

    for sig in enl_signals:
        state   = sig.get("signal_state", "unknown")
        emph    = sig.get("emphasis", "none")
        in_focus = (state in focus_states) or (emph in focus_emphasis and focus_emphasis)
        if in_focus:
            primary.append(sig)
        else:
            secondary.append(sig)

    return primary + secondary


def get_persona_view(persona: str, query_id: str) -> dict:
    """
    Return persona-scoped view for query_id.
    Maps ENL output to persona lens — no new computation. [R1, R2, R3, R6]
    """
    if persona not in ALLOWED_PERSONAS:
        print(json.dumps({
            "error": f"ERROR [R4]: invalid persona '{persona}' — must be one of {ALLOWED_PERSONAS}"
        }), file=sys.stderr)
        sys.exit(1)

    # R1: ENL output from 42.15 adapter logic
    enl = get_enl_output(query_id)

    persona_config = PERSONA_LENS[persona]

    # R2: map only — no new computation
    filtered_signals = _apply_persona_filter(enl["enl_signals"], persona_config)

    return {
        "contract_id":           CONTRACT_ID,
        "query_id":              query_id,
        "query_text":            enl["query_text"],
        "intent_type":           enl["intent_type"],
        "persona":               persona,
        "lens":                  persona_config["lens"],
        "framing_label":         persona_config["framing_label"],
        "primary_question":      persona_config["primary_question"],
        "aggregate_confidence":  enl["aggregate_confidence"],
        "enl_signals":           filtered_signals,
        "emphasis_nodes":        enl["emphasis_nodes"],
        "projection_source":     enl["projection_source"],
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description=(
            "Persona View Map — PIOS-42.16-RUN01-CONTRACT-v1\n"
            "Maps ENL signal output to persona-scoped view.\n"
            "Personas: EXECUTIVE, CTO, ANALYST\n"
            "No new computation. Mapping only. Fail closed on invalid inputs."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--persona", "-p",
        required=True,
        help="Persona (EXECUTIVE, CTO, or ANALYST)",
    )
    parser.add_argument(
        "--query", "-q",
        required=True,
        help="Query ID (e.g. GQ-003)",
    )
    args = parser.parse_args()

    persona  = args.persona.strip().upper()
    query_id = args.query.strip().upper()

    if not persona:
        print(json.dumps({"error": "ERROR [R4]: empty persona"}), file=sys.stderr)
        sys.exit(1)

    if not query_id:
        print(json.dumps({"error": "ERROR [R4]: empty query_id"}), file=sys.stderr)
        sys.exit(1)

    data = get_persona_view(persona, query_id)
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    main()
