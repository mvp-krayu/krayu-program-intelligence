# map_core_to_demo.py
#
# Materialized from:
#   pios/core/v0.1/engine/synthesize_intelligence.py  (Core engine output schema)
#   docs/pios/41.4/signal_registry.json               (demo signal registry — R3 source)
#   docs/pios/41.4/evidence_mapping_index.json        (demo evidence mapping — R4 source)
#   app/execlens-demo/components/SignalGaugeCard.js   (demo UI signal field schema)
#   app/execlens-demo/components/EvidencePanel.js     (demo UI evidence field schema)
#   scripts/pios/42.4/execlens_adapter.py             (demo API output schema)
#   scripts/pios/42.1/run_execlens_query.py           (41.4 access pattern)
#
# Branch: feature/demo-compat-adapter
# Contract: pios/core/v0.1/adapters/demo_compat/contract.yaml
#
# DEMO_TO_CORE_INTEL derivation basis:
#   41.4 signal_registry source_refs contain Core COND/SIG identifiers.
#   Cross-referencing those refs against Core INTEL originating_condition fields
#   produces the authoritative demo-signal → core-intel mapping.
#   Demo SIG-001 source_refs ["COND-006"] → Core INTEL-006 (originating_condition: COND-006)
#   Demo SIG-002 aggregate  (blocked dims) → no single Core INTEL; derived from blocked set
#   Demo SIG-003 source_refs ["COND-001"] → Core INTEL-001 (originating_condition: COND-001)
#   Demo SIG-004 source_refs ["COND-002"] → Core INTEL-002 (originating_condition: COND-002)
#   Demo SIG-005 source_refs ["COND-003"] → Core INTEL-003 (originating_condition: COND-003)
#
# Adapter rules:
#   A1  reads Core intelligence output JSON (from synthesize_intelligence.py)
#   A2  reads docs/pios/41.4/signal_registry.json for demo signal metadata
#   A3  reads docs/pios/41.4/evidence_mapping_index.json for demo evidence fields
#   A4  maps Core INTEL → Demo SIG via DEMO_TO_CORE_INTEL (COND-based derivation)
#   A5  synthesis_state carried from Core INTEL record exactly — no elevation
#   A6  relevance derived from synthesis_state — no override
#   A7  all 41.4 registry fields carried verbatim — no enrichment, no relabeling
#   A8  evidence fields carried from 41.4 evidence_mapping_index verbatim
#   A9  Demo SIG-002 synthesis_state and relevance derived from aggregate blocked state
#   A10 fail-closed on missing Core intelligence output or missing registry files
#   A11 no demo modification, no Core engine modification
#   A12 UNDEFINED values propagated as null — no substitution

import json
import os
import sys
from pathlib import Path

UNDEFINED = None

# ---------------------------------------------------------------------------
# Canonical 41.4 paths — demo registry sources (A2, A3; read-only)
# Verified from scripts/pios/42.1/run_execlens_query.py PATH_SIGNAL_REGISTRY /
# PATH_EVIDENCE_INDEX — same repo-relative paths.
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[5]

PATH_SIGNAL_REGISTRY = REPO_ROOT / "docs/pios/41.4/signal_registry.json"
PATH_EVIDENCE_INDEX  = REPO_ROOT / "docs/pios/41.4/evidence_mapping_index.json"

# ---------------------------------------------------------------------------
# Demo signal → Core INTEL mapping (A4)
# Derived from 41.4 signal_registry source_refs COND cross-reference — see header.
# None indicates aggregate derivation (SIG-002); handled separately in A9.
# ---------------------------------------------------------------------------

DEMO_TO_CORE_INTEL = {
    "SIG-001": "INTEL-006",  # Execution Instability / hasi_bridge (COND-006)
    "SIG-002": None,         # Platform Runtime State — aggregate blocked/partial
    "SIG-003": "INTEL-001",  # Dependency Load Elevation (COND-001)
    "SIG-004": "INTEL-002",  # Structural Volatility State (COND-002)
    "SIG-005": "INTEL-003",  # Coordination Pressure Active (COND-003)
}

# Canonical output order — matches 41.4 signal_registry signal ordering
DEMO_SIGNAL_ORDER = ["SIG-001", "SIG-002", "SIG-003", "SIG-004", "SIG-005"]

# ---------------------------------------------------------------------------
# Synthesis state → demo relevance (A6)
# No override. synthesized=HIGH / partial=MEDIUM / blocked=LOW.
# ---------------------------------------------------------------------------

SYNTHESIS_STATE_TO_RELEVANCE = {
    "synthesized": "HIGH",
    "partial":     "MEDIUM",
    "blocked":     "LOW",
}

# ---------------------------------------------------------------------------
# Path validation — fail-closed on forbidden write targets (A11)
# ---------------------------------------------------------------------------

def _resolve(path):
    return os.path.normpath(os.path.abspath(path))


def validate_output_path(path):
    norm = _resolve(path)
    cwd  = os.getcwd()

    docs_path = _resolve(os.path.join(cwd, "docs"))
    if norm.startswith(docs_path + os.sep) or norm == docs_path:
        sys.exit(f"ERROR: FORBIDDEN output path — targets docs/: {path}")

    for prefix in (
        "pios/core/v0.1/engine",
        "scripts/pios",
        "app/execlens-demo",
    ):
        forbidden = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(forbidden + os.sep) or norm == forbidden:
            sys.exit(f"ERROR: FORBIDDEN output path — targets immutable scope: {path}")

    for prefix in (
        "runs/pios/40.5/run_02_ce_validation",
        "runs/pios/40.6/run_01_condition_activation",
        "runs/pios/40.7/run_01_intelligence_synthesis",
    ):
        immutable = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(immutable + os.sep) or norm == immutable:
            sys.exit(f"ERROR: FORBIDDEN output path — targets immutable run: {path}")


# ---------------------------------------------------------------------------
# Data loaders (A1, A2, A3)
# ---------------------------------------------------------------------------

def load_core_intelligence(intel_path):
    """Load Core intelligence output JSON. Fail-closed (A10). A1."""
    p = _resolve(intel_path)
    if not os.path.isfile(p):
        sys.exit(f"ERROR: Core intelligence output not found: {intel_path}")
    with open(p, "r") as f:
        data = json.load(f)
    required = [f"INTEL-{i:03d}" for i in range(1, 9)]
    intel = data.get("intelligence", {})
    for rid in required:
        if rid not in intel:
            sys.exit(f"ERROR: required intelligence entry missing from input: {rid}")
    return data


def load_signal_registry():
    """Load 41.4 signal_registry.json keyed by signal_id. Fail-closed (A10). A2."""
    if not PATH_SIGNAL_REGISTRY.exists():
        sys.exit(f"ERROR: signal_registry.json not found at {PATH_SIGNAL_REGISTRY}")
    with open(PATH_SIGNAL_REGISTRY, encoding="utf-8") as f:
        data = json.load(f)
    return {s["signal_id"]: s for s in data.get("signals", [])}


def load_evidence_index():
    """Load 41.4 evidence_mapping_index.json keyed by signal_id. Fail-closed (A10). A3."""
    if not PATH_EVIDENCE_INDEX.exists():
        sys.exit(f"ERROR: evidence_mapping_index.json not found at {PATH_EVIDENCE_INDEX}")
    with open(PATH_EVIDENCE_INDEX, encoding="utf-8") as f:
        data = json.load(f)
    return {s["signal_id"]: s for s in data.get("signals", [])}


# ---------------------------------------------------------------------------
# Demo SIG-002 derivation (A9)
# SIG-002 represents the known space of blocked/unknown platform dimensions.
# When blocked Core INTELs exist, the declaration of unknown dimensions is itself
# a synthesized fact — the blocking IS the evidence.
# Relevance is always HIGH when blocked dims exist (known gaps are high priority).
# ---------------------------------------------------------------------------

def derive_sig_002_state(intel_entries):
    """
    Derive Demo SIG-002 synthesis_state and relevance from Core INTEL aggregate. A9.

    Logic:
      - If any Core INTEL is blocked: SIG-002 state = "synthesized" (the unknown
        space is fully declared; blocking is deterministic, not a gap in the adapter).
      - If no blocked but partial exist: state = "partial" (some dims partially known).
      - If all synthesized: state = "synthesized" (all dims resolved; SIG-002 as
        unknown-space declaration is vacuous but still present).
    """
    blocked = [k for k, v in intel_entries.items() if v["synthesis_state"] == "blocked"]
    partial  = [k for k, v in intel_entries.items() if v["synthesis_state"] == "partial"]

    if blocked:
        return "synthesized", "HIGH"   # Unknown space fully declared from blocked set
    if partial:
        return "partial", "MEDIUM"     # Unknown space partially declared
    return "synthesized", "LOW"        # All resolved; unknown-space signal vacuous


# ---------------------------------------------------------------------------
# Signal entry assembly (A4–A8)
# ---------------------------------------------------------------------------

def build_signal_entry(demo_sig_id, registry, evidence_index, intel_entries):
    """
    Build demo-compatible signal entry for demo_sig_id.
    Carries all 41.4 registry fields verbatim (A7).
    Carries all 41.4 evidence fields verbatim (A8).
    Derives synthesis_state from Core INTEL (A5).
    Derives relevance from synthesis_state (A6).
    """
    reg = registry.get(demo_sig_id)
    if reg is None:
        sys.exit(f"ERROR: demo signal {demo_sig_id} not found in signal_registry.json")

    ev_entry      = evidence_index.get(demo_sig_id)
    core_intel_id = DEMO_TO_CORE_INTEL[demo_sig_id]

    if core_intel_id is None:
        # SIG-002: aggregate derivation — A9
        synthesis_state, relevance = derive_sig_002_state(intel_entries)
    else:
        intel_rec       = intel_entries[core_intel_id]
        synthesis_state = intel_rec["synthesis_state"]                   # A5
        relevance       = SYNTHESIS_STATE_TO_RELEVANCE[synthesis_state]  # A6

    entry = {
        "signal_id":           demo_sig_id,
        "relevance":           relevance,
        "title":               reg["title"],                     # A7
        "evidence_confidence": reg["evidence_confidence"],       # A7
        "domain_id":           reg["domain_id"],                 # A7
        "domain_name":         reg["domain_name"],               # A7
        "capability_id":       reg["capability_id"],             # A7
        "capability_name":     reg["capability_name"],           # A7
        "component_ids":       reg.get("component_ids", []),     # A7
        "component_names":     reg.get("component_names", []),   # A7
        "statement":           reg["statement"],                 # A7
        "business_impact":     reg.get("business_impact"),       # A7
        "risk":                reg.get("risk"),                  # A7
        "synthesis_state":     synthesis_state,                  # A5 (adapter extension field)
        "core_intel_id":       core_intel_id,                    # traceability
    }

    # Evidence — A8: carry from 41.4 evidence_mapping_index verbatim; null if missing (A12)
    if ev_entry is None:
        entry["evidence"]         = UNDEFINED
        entry["evidence_warning"] = (
            f"No evidence entry in 41.4 evidence_mapping_index for {demo_sig_id}"
        )
    else:
        entry["evidence"] = {
            "source_object_id":   ev_entry["source_object_id"],           # A8
            "source_layer":       ev_entry["source_layer"],               # A8
            "source_file":        ev_entry["source_file"],                # A8
            "supporting_objects": ev_entry.get("supporting_objects", []), # A8
            "evidence_chain":     ev_entry.get("evidence_chain", ""),     # A8
            "blocking_point":     ev_entry.get("blocking_point"),         # A8
            "temporal_reference": ev_entry.get("temporal_reference"),     # A8
        }
        entry["evidence_warning"] = UNDEFINED

    return entry


# ---------------------------------------------------------------------------
# Main adapter entry point
# ---------------------------------------------------------------------------

def adapt(run_id, intel_path, output_path=None):
    """
    Read Core intelligence output. Map to demo-compatible signal format.
    Writes JSON to output_path. Rules A1–A12.
    """
    if output_path is None:
        output_path = os.path.join(
            "runs", "pios", "adapter", run_id, "demo_compat_output.json"
        )

    validate_output_path(output_path)

    core_data     = load_core_intelligence(intel_path)
    intel_entries = core_data["intelligence"]

    registry       = load_signal_registry()
    evidence_index = load_evidence_index()

    signals = [
        build_signal_entry(sig_id, registry, evidence_index, intel_entries)
        for sig_id in DEMO_SIGNAL_ORDER
    ]

    output = {
        "adapter":         "demo_compat/map_core_to_demo.py",
        "contract":        "pios/core/v0.1/adapters/demo_compat/contract.yaml",
        "run_id":          run_id,
        "upstream_intel":  intel_path,
        "core_stream":     core_data.get("stream"),
        "core_run_id":     core_data.get("run_id"),
        "registry_source": str(PATH_SIGNAL_REGISTRY),
        "evidence_source": str(PATH_EVIDENCE_INDEX),
        "signals":         signals,
        "summary": {
            "total_signals":    len(signals),
            "high_relevance":   [s["signal_id"] for s in signals if s["relevance"] == "HIGH"],
            "medium_relevance": [s["signal_id"] for s in signals if s["relevance"] == "MEDIUM"],
            "low_relevance":    [s["signal_id"] for s in signals if s["relevance"] == "LOW"],
            "synthesized":      [s["signal_id"] for s in signals if s["synthesis_state"] == "synthesized"],
            "partial":          [s["signal_id"] for s in signals if s["synthesis_state"] == "partial"],
            "blocked":          [s["signal_id"] for s in signals if s["synthesis_state"] == "blocked"],
        },
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"adapter output: {output_path}")
    print(f"signals:        {[s['signal_id'] for s in signals]}")
    print(f"high:           {output['summary']['high_relevance']}")
    print(f"medium:         {output['summary']['medium_relevance']}")
    print(f"low:            {output['summary']['low_relevance']}")

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "usage: map_core_to_demo.py <run_id> <intel_path> [output_path]",
            file=sys.stderr,
        )
        print(
            "  run_id       — required; adapter run identifier",
            file=sys.stderr,
        )
        print(
            "  intel_path   — required; JSON output from synthesize_intelligence.py",
            file=sys.stderr,
        )
        print(
            "  output_path  — optional; defaults to runs/pios/adapter/<run_id>/demo_compat_output.json",
            file=sys.stderr,
        )
        sys.exit(1)

    _run_id = sys.argv[1]
    _intel  = sys.argv[2]
    _out    = sys.argv[3] if len(sys.argv) > 3 else None

    adapt(_run_id, _intel, output_path=_out)
