#!/usr/bin/env python3
"""
run_execlens_query.py
PIOS-42.1-RUN01-CONTRACT-v1

ExecLens Query Execution Entry Point — Stream 42.1

Traversal path (fixed, deterministic):
  QUERY → SIGNAL → EVIDENCE → NAVIGATION → OUTPUT

  query_id
    → docs/pios/41.5/query_signal_map.json        [R1: query resolution]
    → docs/pios/41.4/signal_registry.json         [R2-R3: signal binding]
    → docs/pios/41.4/evidence_mapping_index.json  [R4: evidence binding]
    → docs/pios/41.2/pie_vault/                   [R5: navigation binding]
    → docs/pios/41.5/query_response_templates.md  [R6: template rendering]
    → stdout                                       [R8: output only]

Rules enforced:
  R1  query resolved strictly from query_signal_map.json; fail if absent
  R2  all mapped signals retrieved — no filtering, no suppression
  R3  every signal resolved in signal_registry.json; unresolved = hard failure
  R4  evidence bound strictly from evidence_mapping_index.json; no enrichment
  R5  navigation links resolved only against docs/pios/41.2/pie_vault/
  R6  output rendered strictly from query_response_templates.md sections
  R7  no inference; no summaries beyond bound artifacts
  R8  stdout only; no persisted result files
  R9  deterministic — identical inputs produce identical output structure

Usage:
  python3 scripts/pios/42.1/run_execlens_query.py GQ-001
  python3 scripts/pios/42.1/run_execlens_query.py GQ-006 --verbose
  python3 scripts/pios/42.1/run_execlens_query.py --list
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Canonical input paths  (R1–R6 sources — all read-only)
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]

PATH_QUERY_SIGNAL_MAP       = REPO_ROOT / "docs/pios/41.5/query_signal_map.json"
PATH_SIGNAL_REGISTRY        = REPO_ROOT / "docs/pios/41.4/signal_registry.json"
PATH_EVIDENCE_INDEX         = REPO_ROOT / "docs/pios/41.4/evidence_mapping_index.json"
PATH_RESPONSE_TEMPLATES     = REPO_ROOT / "docs/pios/41.5/query_response_templates.md"
PATH_PIE_VAULT              = REPO_ROOT / "docs/pios/41.2/pie_vault"

MANDATORY_INPUTS = {
    "query_signal_map.json":    PATH_QUERY_SIGNAL_MAP,
    "signal_registry.json":     PATH_SIGNAL_REGISTRY,
    "evidence_mapping_index.json": PATH_EVIDENCE_INDEX,
    "query_response_templates.md": PATH_RESPONSE_TEMPLATES,
    "pie_vault/":               PATH_PIE_VAULT,
}

DIVIDER = "=" * 80
SECTION = "-" * 80


# ---------------------------------------------------------------------------
# Preflight: verify all mandatory inputs exist
# ---------------------------------------------------------------------------

def preflight_check():
    """Verify all mandatory input files/directories exist. Fail closed if any missing."""
    missing = []
    for label, path in MANDATORY_INPUTS.items():
        if not path.exists():
            missing.append(f"  MISSING: {label} at {path}")
    if missing:
        print("PREFLIGHT FAILURE — mandatory inputs missing:")
        for m in missing:
            print(m)
        sys.exit(1)


# ---------------------------------------------------------------------------
# Data loaders
# ---------------------------------------------------------------------------

def load_query_signal_map() -> dict:
    """Load and return full query signal map. R1 source."""
    with open(PATH_QUERY_SIGNAL_MAP, encoding="utf-8") as f:
        return json.load(f)


def load_signal_registry() -> dict:
    """Load and return signal registry keyed by signal_id. R3 source."""
    with open(PATH_SIGNAL_REGISTRY, encoding="utf-8") as f:
        data = json.load(f)
    return {s["signal_id"]: s for s in data.get("signals", [])}


def load_evidence_index() -> dict:
    """Load and return evidence mapping index keyed by signal_id. R4 source."""
    with open(PATH_EVIDENCE_INDEX, encoding="utf-8") as f:
        data = json.load(f)
    return {s["signal_id"]: s for s in data.get("signals", [])}


def load_response_templates() -> str:
    """Load full template text. R6 source."""
    return PATH_RESPONSE_TEMPLATES.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# R1: Query resolution
# ---------------------------------------------------------------------------

def resolve_query(query_id: str, qsmap: dict) -> dict:
    """
    Resolve query entry strictly from query_signal_map.json.
    Fail closed (exit 1) if query_id is absent. [R1, G4]
    """
    queries = {q["query_id"]: q for q in qsmap.get("queries", [])}
    if query_id not in queries:
        available = sorted(queries.keys())
        print(f"EXECUTION FAILURE [R1] — query_id '{query_id}' not found in query_signal_map.json")
        print(f"  Available query IDs: {available}")
        sys.exit(1)
    return queries[query_id]


# ---------------------------------------------------------------------------
# R2–R3: Signal binding and resolution
# ---------------------------------------------------------------------------

def bind_signals(query_entry: dict, signal_registry: dict) -> list[dict]:
    """
    Retrieve all mapped signals with no filtering or suppression. [R2]
    Every signal must resolve in signal_registry.json; unresolved = hard failure. [R3]
    Returns list of dicts: {mapping: ..., registry: ...}
    """
    mapped = query_entry.get("mapped_signals", [])
    if not mapped:
        print(f"EXECUTION FAILURE [R2] — query '{query_entry['query_id']}' has no mapped signals")
        sys.exit(1)

    bound = []
    missing = []
    for m in mapped:
        sid = m["signal_id"]
        if sid not in signal_registry:
            missing.append(sid)
        else:
            bound.append({"mapping": m, "registry": signal_registry[sid]})

    if missing:
        print(f"EXECUTION FAILURE [R3] — signals unresolved in signal_registry.json: {missing}")
        sys.exit(1)

    return bound


# ---------------------------------------------------------------------------
# R4: Evidence binding
# ---------------------------------------------------------------------------

def bind_evidence(bound_signals: list[dict], evidence_index: dict) -> list[dict]:
    """
    Attach evidence entries strictly from evidence_mapping_index.json. [R4]
    No enrichment, no external lookup, no synthetic evidence creation.
    Missing evidence for a signal is not a hard failure (evidence may be partial),
    but a warning is emitted.
    """
    result = []
    for bs in bound_signals:
        sid = bs["registry"]["signal_id"]
        ev = evidence_index.get(sid)
        if ev is None:
            # Warn but don't fail — not all signals require evidence entries
            bs["evidence"] = None
            bs["evidence_warning"] = f"No evidence entry in evidence_mapping_index.json for {sid}"
        else:
            bs["evidence"] = ev
            bs["evidence_warning"] = None
        result.append(bs)
    return result


# ---------------------------------------------------------------------------
# R5: Navigation binding
# ---------------------------------------------------------------------------

def _vault_filename_for_link(wiki_link: str) -> Optional[str]:
    """
    Map an Obsidian [[wiki-link]] target to a likely vault filename.
    The vault uses the exact filename as the wiki-link target.
    """
    return wiki_link + ".md"


def _find_vault_file(filename: str) -> Optional[Path]:
    """Search the PIE vault recursively for a file with the given name."""
    for candidate in PATH_PIE_VAULT.rglob(filename):
        return candidate
    return None


def bind_navigation(template_section: str) -> list[dict]:
    """
    Resolve all [[wiki-link]] references in a template section against
    docs/pios/41.2/pie_vault/. [R5]
    No graph edits, no backlink generation, no topology changes.
    Returns list of {link: str, filename: str, resolved: bool, path: str|None}
    """
    links = sorted(set(re.findall(r'\[\[([^\]]+)\]\]', template_section)))
    nav_bindings = []
    for lk in links:
        fname = _vault_filename_for_link(lk)
        found = _find_vault_file(fname)
        nav_bindings.append({
            "link":     lk,
            "filename": fname,
            "resolved": found is not None,
            "path":     str(found.relative_to(REPO_ROOT)) if found else None,
        })
    return nav_bindings


# ---------------------------------------------------------------------------
# R6: Template extraction
# ---------------------------------------------------------------------------

def extract_template_section(query_id: str, templates_text: str) -> str:
    """
    Extract the template section for query_id from query_response_templates.md. [R6]
    Fail closed if section not found.
    """
    # Each section starts with "## GQ-NNN —"
    pattern = re.compile(
        r'(^## ' + re.escape(query_id) + r' —.*?)(?=^## GQ-|\Z)',
        re.MULTILINE | re.DOTALL
    )
    match = pattern.search(templates_text)
    if not match:
        print(f"EXECUTION FAILURE [R6] — template section for '{query_id}' not found in "
              f"query_response_templates.md")
        sys.exit(1)
    return match.group(1).rstrip()


# ---------------------------------------------------------------------------
# Output rendering
# ---------------------------------------------------------------------------

def _confidence_bar(confidence: str) -> str:
    bars = {"STRONG": "████████ STRONG", "MODERATE": "█████░░░ MODERATE", "WEAK": "██░░░░░░ WEAK"}
    return bars.get(confidence.upper(), confidence)


def render_output(
    query_id:      str,
    query_entry:   dict,
    bound_signals: list[dict],
    template_text: str,
    nav_bindings:  list[dict],
    verbose:       bool = False,
):
    """
    Render full execution output to stdout. [R6, R8, R9]
    Output is deterministic: same inputs → same output.
    """
    out = []
    out.append(DIVIDER)
    out.append("EXECLENS QUERY EXECUTION")
    out.append("Stream 42.1 — ExecLens Query Execution Layer")
    out.append("PIOS-42.1-RUN01-CONTRACT-v1 / run_01_blueedge")
    out.append(DIVIDER)
    out.append("")

    # --- Query header ---
    out.append(f"QUERY     : {query_id}")
    out.append(f"TEXT      : {query_entry['query_text']}")
    out.append(f"INTENT    : {query_entry['intent_type']}")
    out.append(f"CONFIDENCE: {_confidence_bar(query_entry['aggregate_confidence'])}")
    tags = ", ".join(query_entry.get("semantic_tags", []))
    out.append(f"TAGS      : {tags}")
    out.append("")

    # --- Bound signals (R2–R3) ---
    out.append(SECTION)
    out.append(f"BOUND SIGNALS  [{len(bound_signals)} signal(s) — source: signal_registry.json]")
    out.append(SECTION)
    for bs in bound_signals:
        m   = bs["mapping"]
        reg = bs["registry"]
        out.append(f"")
        out.append(f"  [{m['signal_id']}]  Relevance: {m['relevance']}")
        out.append(f"  Title     : {reg['title']}")
        out.append(f"  Confidence: {_confidence_bar(reg['evidence_confidence'])}")
        out.append(f"  Domain    : {reg['domain_id']} — {reg['domain_name']}")
        out.append(f"  Capability: {reg['capability_id']} — {reg['capability_name']}")
        comps = ", ".join(
            f"{cid} ({cname})"
            for cid, cname in zip(reg["component_ids"], reg["component_names"])
        )
        out.append(f"  Components: {comps}")
        out.append(f"  Statement : {reg['statement']}")
        if verbose:
            out.append(f"  Impact    : {reg['business_impact']}")
            out.append(f"  Risk      : {reg['risk']}")

    # --- Evidence binding (R4) ---
    out.append("")
    out.append(SECTION)
    out.append(f"EVIDENCE BINDING  [source: evidence_mapping_index.json]")
    out.append(SECTION)
    for bs in bound_signals:
        sid = bs["registry"]["signal_id"]
        ev  = bs["evidence"]
        out.append("")
        if bs.get("evidence_warning"):
            out.append(f"  [{sid}]  WARNING: {bs['evidence_warning']}")
            continue
        out.append(f"  [{sid}]  Source: {ev['source_object_id']} @ "
                   f"{ev['source_layer']}/{ev['source_file']}")
        # Supporting objects in deterministic order
        for so in ev.get("supporting_objects", []):
            state_str = so.get("state", "")
            out.append(f"    ↳ {so['object_id']}  [{so['layer']}/{so['file']}]  state={state_str}")
        out.append(f"  Evidence chain:")
        # Wrap long chain for readability
        chain = ev.get("evidence_chain", "")
        for segment in chain.split("→"):
            out.append(f"    → {segment.strip()}")
        bp = ev.get("blocking_point")
        if bp:
            out.append(f"  Blocking point: {bp}")
        tr = ev.get("temporal_reference")
        if tr:
            out.append(f"  Temporal ref  : {tr}")

    # --- Navigation binding (R5) ---
    out.append("")
    out.append(SECTION)
    out.append(f"NAVIGATION BINDING  [source: docs/pios/41.2/pie_vault/]")
    out.append(SECTION)
    if nav_bindings:
        resolved_count   = sum(1 for n in nav_bindings if n["resolved"])
        unresolved_count = len(nav_bindings) - resolved_count
        out.append(f"  Links found : {len(nav_bindings)}  "
                   f"Resolved: {resolved_count}  Unresolved: {unresolved_count}")
        out.append("")
        for nb in nav_bindings:
            status = "RESOLVED" if nb["resolved"] else "UNRESOLVED"
            path_str = nb["path"] or "—"
            out.append(f"  [[{nb['link']}]]")
            out.append(f"    Status: {status}  Path: {path_str}")
    else:
        out.append("  No [[wiki-links]] found in template section.")

    # --- Template rendering (R6) ---
    out.append("")
    out.append(SECTION)
    out.append(f"RESPONSE TEMPLATE  [source: query_response_templates.md § {query_id}]")
    out.append(SECTION)
    out.append("")
    out.append(template_text)

    # --- Footer ---
    out.append("")
    out.append(DIVIDER)
    out.append(f"EXECUTION COMPLETE: {query_id}")
    out.append(f"Traversal: QUERY → SIGNAL → EVIDENCE → NAVIGATION → OUTPUT")
    out.append(f"Source artifacts: query_signal_map.json | signal_registry.json | "
               f"evidence_mapping_index.json | query_response_templates.md | pie_vault/")
    out.append(DIVIDER)

    print("\n".join(out))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def list_queries(qsmap: dict):
    """Print all available query IDs and their text."""
    queries = sorted(qsmap.get("queries", []), key=lambda q: q["query_id"])
    print(f"Available queries ({len(queries)} total):")
    for q in queries:
        print(f"  {q['query_id']}  [{q['intent_type']:12s}]  {q['query_text']}")


def main():
    parser = argparse.ArgumentParser(
        description=(
            "ExecLens Query Execution — PIOS-42.1-RUN01-CONTRACT-v1\n"
            "Traversal: QUERY → SIGNAL → EVIDENCE → NAVIGATION → OUTPUT"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "query_id",
        nargs="?",
        help="Query ID to execute (e.g. GQ-001)",
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

    # Preflight: all mandatory inputs must exist
    preflight_check()

    # Load all data sources
    qsmap           = load_query_signal_map()
    signal_registry = load_signal_registry()
    evidence_index  = load_evidence_index()
    templates_text  = load_response_templates()

    if args.list:
        list_queries(qsmap)
        sys.exit(0)

    if not args.query_id:
        parser.print_help()
        print()
        print("ERROR: query_id argument required.")
        sys.exit(1)

    query_id = args.query_id.upper()

    # R1: Resolve query
    query_entry = resolve_query(query_id, qsmap)

    # R2–R3: Bind and resolve signals
    bound_signals = bind_signals(query_entry, signal_registry)

    # R4: Bind evidence
    bound_signals = bind_evidence(bound_signals, evidence_index)

    # R6: Extract template section (before nav so we can extract links from it)
    template_section = extract_template_section(query_id, templates_text)

    # R5: Bind navigation from template section
    nav_bindings = bind_navigation(template_section)

    # Render to stdout (R8)
    render_output(
        query_id      = query_id,
        query_entry   = query_entry,
        bound_signals = bound_signals,
        template_text = template_section,
        nav_bindings  = nav_bindings,
        verbose       = args.verbose,
    )


if __name__ == "__main__":
    main()
