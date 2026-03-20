#!/usr/bin/env python3
"""
render_executive_narrative.py
PIOS-42.2-RUN01-CONTRACT-v1

ExecLens Narrative Rendering Layer — Stream 42.2

Layer contract:
  42.1 = computation / traversal  (QUERY → SIGNAL → EVIDENCE → NAVIGATION)
  42.2 = rendering only           (structured data → executive-grade narrative)

This script imports and calls the 42.1 execution path directly. [R1, V1]
No bypass. No recomputation. No signal or evidence rebinding.

Rendering rules:
  R3  base narrative from query_response_templates.md (template locked)
  R4  formatting/emphasis/ordering allowed; meaning changes forbidden
  R5  all signals preserved; no filtering or suppression
  R6  evidence chains preserved exactly; reformatting allowed
  R7  all PIE navigation links preserved; unresolved links explicitly marked
  R8  no new statements beyond template + bound data
  R9  same query_id → identical rendered output
  R10 stdout primary; no hidden processing

Usage:
  python3 scripts/pios/42.2/render_executive_narrative.py GQ-001
  python3 scripts/pios/42.2/render_executive_narrative.py GQ-006 --verbose
  python3 scripts/pios/42.2/render_executive_narrative.py --list
"""

import argparse
import sys
from pathlib import Path
from typing import List, Optional

# ---------------------------------------------------------------------------
# R1: Import 42.1 execution path — no bypass allowed
# ---------------------------------------------------------------------------

_42_1_PATH = Path(__file__).resolve().parents[1] / "42.1"
if str(_42_1_PATH) not in sys.path:
    sys.path.insert(0, str(_42_1_PATH))

try:
    import run_execlens_query as _q41
except ImportError as e:
    print(f"RENDER FAILURE [R1] — cannot import 42.1 execution module: {e}")
    print(f"  Expected at: {_42_1_PATH}/run_execlens_query.py")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Rendering constants
# ---------------------------------------------------------------------------

_W   = 80
_HDR = "█" * _W
_DIV = "─" * _W
_SEP = "═" * _W

CONTRACT_ID   = "PIOS-42.2-RUN01-CONTRACT-v1"
RUN_REFERENCE = "run_01_blueedge"
STREAM_TITLE  = "Stream 42.2 — ExecLens Narrative Rendering Layer"


# ---------------------------------------------------------------------------
# Confidence rendering
# ---------------------------------------------------------------------------

_CONF_GLYPHS = {
    "STRONG":   ("████████", "STRONG   — fully grounded in static evidence"),
    "MODERATE": ("█████░░░", "MODERATE — computed; condition evaluable pending threshold"),
    "WEAK":     ("██░░░░░░", "WEAK     — partial signal; runtime component blocked"),
}

def _conf(level: str) -> str:
    g, label = _CONF_GLYPHS.get(level.upper(), ("????????", level))
    return f"{g}  {label}"


# ---------------------------------------------------------------------------
# Section builders — rendering only, no computation
# ---------------------------------------------------------------------------

def _section(title: str) -> str:
    return f"\n{_DIV}\n  {title}\n{_DIV}"


def render_header(query_id: str, query_entry: dict) -> List[str]:
    """Executive header block — renders query identity metadata."""
    lines = [
        _SEP,
        f"  PROGRAM INTELLIGENCE — EXECUTIVE NARRATIVE",
        f"  {STREAM_TITLE}",
        f"  {CONTRACT_ID} / {RUN_REFERENCE}",
        _SEP,
        "",
        f"  QUERY ID  : {query_id}",
        f"  QUESTION  : {query_entry['query_text']}",
        "",
        f"  Intent    : {query_entry['intent_type']}",
        f"  Confidence: {_conf(query_entry['aggregate_confidence'])}",
        f"  Tags      : {', '.join(query_entry.get('semantic_tags', []))}",
        "",
    ]
    return lines


def render_signals_section(bound_signals: List[dict], verbose: bool) -> List[str]:
    """
    Signal cards — preserves all signals from 42.1 with no filtering. [R5]
    Adds structured card formatting; content unchanged.
    """
    lines = [_section(f"INTELLIGENCE SIGNALS  [{len(bound_signals)} bound — from signal_registry.json]"), ""]
    for i, bs in enumerate(bound_signals, 1):
        m   = bs["mapping"]
        reg = bs["registry"]
        sid = reg["signal_id"]
        lines += [
            f"  ┌─ Signal {i}/{len(bound_signals)} ─────────────────────────────────────────────────┐",
            f"  │  ID         : {sid}  (query relevance: {m['relevance']})",
            f"  │  Title      : {reg['title']}",
            f"  │  Confidence : {_conf(reg['evidence_confidence'])}",
            f"  │  Domain     : {reg['domain_id']} — {reg['domain_name']}",
            f"  │  Capability : {reg['capability_id']} — {reg['capability_name']}",
        ]
        comps = "  │               ".join(
            f"{cid} — {cname}"
            for cid, cname in zip(reg["component_ids"], reg["component_names"])
        )
        lines.append(f"  │  Components : {comps}")
        lines += [
            f"  │",
            f"  │  Statement  :",
        ]
        # Wrap statement at ~70 chars per line
        stmt = reg["statement"]
        words = stmt.split()
        line_buf = "  │    "
        for w in words:
            if len(line_buf) + len(w) + 1 > 78:
                lines.append(line_buf)
                line_buf = f"  │    {w}"
            else:
                line_buf = line_buf + (" " if line_buf != "  │    " else "") + w
        if line_buf.strip():
            lines.append(line_buf)
        if verbose:
            lines += [
                f"  │",
                f"  │  Business Impact:",
            ]
            impact_words = reg["business_impact"].split()
            line_buf = "  │    "
            for w in impact_words:
                if len(line_buf) + len(w) + 1 > 78:
                    lines.append(line_buf)
                    line_buf = f"  │    {w}"
                else:
                    line_buf = line_buf + (" " if line_buf != "  │    " else "") + w
            if line_buf.strip():
                lines.append(line_buf)
            lines += [
                f"  │",
                f"  │  Risk:",
            ]
            risk_words = reg["risk"].split()
            line_buf = "  │    "
            for w in risk_words:
                if len(line_buf) + len(w) + 1 > 78:
                    lines.append(line_buf)
                    line_buf = f"  │    {w}"
                else:
                    line_buf = line_buf + (" " if line_buf != "  │    " else "") + w
            if line_buf.strip():
                lines.append(line_buf)
        lines.append("  └────────────────────────────────────────────────────────────────────────")
        lines.append("")
    return lines


def render_evidence_section(bound_signals: List[dict]) -> List[str]:
    """
    Evidence pipeline — preserves all evidence chains from 42.1 exactly. [R6]
    Chain order is deterministic (same as 42.1 binding order).
    """
    lines = [_section("EVIDENCE CHAINS  [from evidence_mapping_index.json]"), ""]
    for bs in bound_signals:
        sid = bs["registry"]["signal_id"]
        ev  = bs["evidence"]
        if bs.get("evidence_warning"):
            lines.append(f"  [{sid}]  ⚠  {bs['evidence_warning']}")
            lines.append("")
            continue

        lines += [
            f"  [{sid}]  Primary source: {ev['source_object_id']}"
            f"  ({ev['source_layer']}/{ev['source_file']})",
        ]

        # Supporting objects — deterministic order preserved
        for so in ev.get("supporting_objects", []):
            state = so.get("state", "")
            lines.append(f"    ↳  {so['object_id']:12s}  [{so['layer']}/{so['file']}]")
            if state:
                lines.append(f"       state: {state}")

        # Evidence chain as pipeline
        lines.append(f"  Chain:")
        chain = ev.get("evidence_chain", "")
        for seg in chain.split("→"):
            seg = seg.strip()
            if seg:
                lines.append(f"    →  {seg}")

        bp = ev.get("blocking_point")
        if bp:
            lines.append(f"  ⚑  Blocking point: {bp}")

        tr = ev.get("temporal_reference")
        if tr:
            lines.append(f"  ⏱  Temporal ref  : {tr}")

        lines.append("")

    return lines


def render_navigation_section(nav_bindings: List[dict]) -> List[str]:
    """
    Navigation map — all PIE vault links preserved. [R7]
    Unresolved links explicitly marked (not silently dropped).
    """
    lines = [_section("NAVIGATION MAP  [resolved against docs/pios/41.2/pie_vault/]"), ""]
    if not nav_bindings:
        lines.append("  No [[wiki-links]] found in template section.")
        return lines

    resolved_count   = sum(1 for n in nav_bindings if n["resolved"])
    unresolved_count = len(nav_bindings) - resolved_count
    lines.append(f"  Coverage: {resolved_count}/{len(nav_bindings)} links resolved"
                 f"  |  {unresolved_count} unresolved (marked ⚠)")
    lines.append("")

    # Group by prefix for readability
    domains = [n for n in nav_bindings if n["link"].startswith("D_")]
    caps    = [n for n in nav_bindings if n["link"].startswith("C_")]
    comps   = [n for n in nav_bindings if n["link"].startswith("CMP_")]
    other   = [n for n in nav_bindings if not any(
                   n["link"].startswith(p) for p in ("D_", "C_", "CMP_"))]

    def _render_link_group(group_label: str, group: List[dict]):
        if not group:
            return []
        out = [f"  {group_label}"]
        for nb in group:
            if nb["resolved"]:
                out.append(f"    ✓  [[{nb['link']}]]")
                out.append(f"         {nb['path']}")
            else:
                out.append(f"    ⚠  [[{nb['link']}]]  — UNRESOLVED in vault")
        out.append("")
        return out

    lines += _render_link_group("Domains:", domains)
    lines += _render_link_group("Capabilities:", caps)
    lines += _render_link_group("Components:", comps)
    lines += _render_link_group("Other:", other)

    return lines


def render_template_section(query_id: str, template_text: str) -> List[str]:
    """
    Template section — rendered verbatim from query_response_templates.md. [R3, R8]
    No content changes. Framed only.
    """
    lines = [
        _section(f"INTELLIGENCE RESPONSE  [from query_response_templates.md § {query_id}]"),
        f"  Source: docs/pios/41.5/query_response_templates.md",
        f"  Locked: template content rendered as-is; no modifications applied.",
        "",
    ]
    # Indent each template line for visual containment
    for raw_line in template_text.splitlines():
        lines.append(f"  {raw_line}" if raw_line.strip() else "")
    return lines


def render_footer(query_id: str) -> List[str]:
    """Execution footer — provenance and layer chain."""
    lines = [
        "",
        _SEP,
        f"  RENDER COMPLETE: {query_id}",
        "",
        f"  Layer chain   : 42.1 (traversal) → 42.2 (rendering)",
        f"  Traversal     : QUERY → SIGNAL → EVIDENCE → NAVIGATION",
        f"  Rendering     : template lock + signal/evidence/navigation fidelity",
        f"  Source chain  : query_signal_map.json → signal_registry.json",
        f"                  → evidence_mapping_index.json",
        f"                  → query_response_templates.md → pie_vault/",
        f"  Governance    : G1 evidence-first | G2 no semantic drift",
        f"                  G3 read-only foundation | G5 layer separation",
        _SEP,
    ]
    return lines


# ---------------------------------------------------------------------------
# Main render function — assembles all sections
# ---------------------------------------------------------------------------

def render_narrative(query_id: str, verbose: bool = False) -> None:
    """
    Full narrative render for query_id.
    Calls 42.1 execution path, then renders structured output. [R1, R9, R10]
    """
    # --- Preflight (42.1 must succeed — G4 fail closed) ---
    _q41.preflight_check()

    # --- 42.1 traversal: load all data ---
    qsmap           = _q41.load_query_signal_map()
    signal_registry = _q41.load_signal_registry()
    evidence_index  = _q41.load_evidence_index()
    templates_text  = _q41.load_response_templates()

    # R1: query resolved via 42.1 (fail closed if absent)
    query_entry = _q41.resolve_query(query_id, qsmap)

    # R5: all signals bound via 42.1 (no filtering)
    bound_signals = _q41.bind_signals(query_entry, signal_registry)

    # R6: evidence bound via 42.1
    bound_signals = _q41.bind_evidence(bound_signals, evidence_index)

    # R3: template extracted via 42.1
    template_section = _q41.extract_template_section(query_id, templates_text)

    # R7: navigation bound via 42.1
    nav_bindings = _q41.bind_navigation(template_section)

    # --- 42.2 rendering: assemble sections ---
    output_lines: List[str] = []

    output_lines += render_header(query_id, query_entry)
    output_lines += render_signals_section(bound_signals, verbose)
    output_lines += render_evidence_section(bound_signals)
    output_lines += render_navigation_section(nav_bindings)
    output_lines += render_template_section(query_id, template_section)
    output_lines += render_footer(query_id)

    print("\n".join(output_lines))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description=(
            "ExecLens Narrative Rendering — PIOS-42.2-RUN01-CONTRACT-v1\n"
            "Rendering layer (42.2) over 42.1 execution traversal.\n"
            "Traversal: QUERY → SIGNAL → EVIDENCE → NAVIGATION → RENDER"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "query_id",
        nargs="?",
        help="Query ID to render (e.g. GQ-001)",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List all available query IDs and exit.",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Include business_impact and risk fields from signal registry.",
    )
    args = parser.parse_args()

    if args.list:
        _q41.preflight_check()
        qsmap = _q41.load_query_signal_map()
        _q41.list_queries(qsmap)
        sys.exit(0)

    if not args.query_id:
        parser.print_help()
        print()
        print("ERROR: query_id argument required.")
        sys.exit(1)

    render_narrative(args.query_id.upper(), verbose=args.verbose)


if __name__ == "__main__":
    main()
