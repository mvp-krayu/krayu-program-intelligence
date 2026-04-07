#!/usr/bin/env python3
"""
PSEE Authoritative Input Construction
Stream: PSEE.RECONCILE.1.WP-13B

Transforms raw client input into authoritative WP-13 input state.

Pipeline:
  RAW_INPUT → STRUCTURAL_NORMALIZATION → TOPOLOGY_CONSTRUCTION
  → SIGNAL_DERIVATION → METRIC_COMPUTATION → STATE_ASSEMBLY → OUTPUT_WRITE

Usage:
    python3 scripts/psee/build_authoritative_input.py \\
        --client <client_uuid> \\
        --raw-input clients/<client_uuid>/input/raw_input.json

Reads:   clients/<client_uuid>/input/raw_input.json
         clients/<client_uuid>/config/
Writes:  clients/<client_uuid>/input/authoritative_state.json
         clients/<client_uuid>/input/construction_log.md

Exit codes:
    0 = CONSTRUCTION_COMPLETE
    1 = CONSTRUCTION_FAILED
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
REPO_NAME = "k-pi-core"
REQUIRED_BRANCH = "work/psee-runtime"
STREAM_ID = "PSEE.RECONCILE.1.WP-13B"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REQUIRED_INPUT_FIELDS = ["domains", "entities", "relationships", "metrics", "events"]

# Relationship type classification
DEP_TYPES = {"DEPENDS_ON", "DEPENDENCY", "REQUIRES"}
COORD_TYPES = {"COORDINATES_WITH", "COORDINATION", "PIPELINE", "PIPELINE_FLOW"}

# Signal state ordering (higher = worse)
STATE_ORDER = {"BLOCKED": 4, "PARTIAL": 3, "COMPLETE": 2, "NONE": 1}
STATE_TO_SEVERITY = {
    "BLOCKED": "CRITICAL",
    "PARTIAL": "HIGH",
    "COMPLETE": "MEDIUM",
    "NONE": "LOW"
}

FORBIDDEN_READ_PREFIXES = ("docs/pios/", "runs/pios/")


# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg=""):
    print(msg)


def fail(stage, reason, rule_id="CONSTRUCTION_RULE"):
    print(f"\nFAIL [{stage}]")
    print(f"  rule:   {rule_id}")
    print(f"  reason: {reason}")
    print("  action: execution halted\n")
    sys.exit(1)


def _jdump(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=True)


def sha256_of(text):
    return hashlib.sha256(text.encode()).hexdigest()


def entity_node_id(entity):
    """Deterministic node ID from entity identity fields."""
    canonical = json.dumps(
        {"domain": str(entity.get("domain", "")),
         "name": str(entity.get("name", ""))},
        sort_keys=True, separators=(",", ":")
    )
    return "N-" + sha256_of(canonical)[:8].upper()


def worst_state(*states):
    return max(states, key=lambda s: STATE_ORDER.get(s, 0))


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight(client_uuid):
    log("=== PSEE Authoritative Input Construction ===")
    log(f"stream:      {STREAM_ID}")
    log(f"client_uuid: {client_uuid}")
    log()

    log("--- PRECHECK ---")

    # Repo identity
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        if r.returncode != 0:
            fail("PRECHECK", "not a git repository", "REPO_LOCK")
        actual = os.path.basename(r.stdout.strip())
        if actual != REPO_NAME:
            fail("PRECHECK", f"repo={actual!r} expected={REPO_NAME!r}", "REPO_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "REPO_LOCK")

    # Branch
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            fail("PRECHECK",
                 f"branch={branch!r} required={REQUIRED_BRANCH!r}",
                 "BRANCH_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "BRANCH_LOCK")

    # Worktree clean
    try:
        r = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        lines = [l for l in r.stdout.splitlines() if l.strip()]
        allowed_prefixes = (
            f"?? clients/{client_uuid}/input/",
            f"?? clients/{client_uuid}/runs/"
        )
        dirty = [l for l in lines if not any(l.startswith(p) for p in allowed_prefixes)]
        if dirty:
            fail("PRECHECK",
                 f"dirty worktree: {'; '.join(dirty[:3])}",
                 "WORKTREE_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "WORKTREE_LOCK")

    # Required paths
    for p in ["clients", "scripts/psee"]:
        if not os.path.isdir(os.path.join(REPO_ROOT, p)):
            fail("PRECHECK", f"required path missing: {p}", "PATH_MISSING")

    log("PRECHECK_PASS")
    log()


# ── READ SCOPE ENFORCEMENT ────────────────────────────────────────────────────
def assert_read_allowed(path, client_uuid):
    ap = os.path.realpath(os.path.abspath(path))
    cfg_root = os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid, "config"))
    inp_root = os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid, "input"))

    allowed = (
        ap.startswith(inp_root + os.sep) or ap == inp_root
        or ap.startswith(cfg_root + os.sep) or ap == cfg_root
    )
    if not allowed:
        fail("READ_SCOPE", f"forbidden read path: {path}", "READ_SCOPE_VIOLATION")

    # Enforce no docs/pios/ or runs/pios/ access
    rel = os.path.relpath(ap, REPO_ROOT)
    for prefix in FORBIDDEN_READ_PREFIXES:
        if rel.startswith(prefix):
            fail("READ_SCOPE", f"forbidden read: {rel}", "FORBIDDEN_PATH")


def assert_write_allowed(path, client_uuid):
    ap = os.path.realpath(os.path.abspath(path))
    inp_root = os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid, "input"))
    if not (ap.startswith(inp_root + os.sep) or ap == inp_root):
        fail("WRITE_SCOPE", f"forbidden write path: {path}", "WRITE_SCOPE_VIOLATION")


# ── STAGE: STRUCTURAL_NORMALIZATION ───────────────────────────────────────────
def structural_normalization(raw, client_uuid):
    log("--- STRUCTURAL_NORMALIZATION ---")
    bounded_conditions = []

    # Verify client_uuid
    if raw.get("client_uuid") != client_uuid:
        fail("STRUCTURAL_NORMALIZATION",
             f"raw client_uuid={raw.get('client_uuid')!r} != --client={client_uuid!r}",
             "IDENTITY_MISMATCH")

    # Verify source_system
    if raw.get("source_system") != "IG":
        fail("STRUCTURAL_NORMALIZATION",
             f"source_system must be IG, got {raw.get('source_system')!r}",
             "SOURCE_SYSTEM_VIOLATION")

    # Check required fields; classify missing as BOUNDED_CONDITION
    for field in REQUIRED_INPUT_FIELDS:
        if field not in raw:
            bounded_conditions.append(f"missing_field:{field}")
            log(f"  BOUNDED_CONDITION  {field} not present in raw_input")

    log("STRUCTURAL_NORMALIZATION_PASS")
    return bounded_conditions


# ── STAGE: TOPOLOGY_CONSTRUCTION ─────────────────────────────────────────────
def topology_construction(raw, bounded_conditions):
    log()
    log("--- TOPOLOGY_CONSTRUCTION ---")

    raw_domains = raw.get("domains", [])
    raw_entities = raw.get("entities", [])
    raw_rels = raw.get("relationships", [])

    # Build domain index
    domain_map = {}  # id or label → canonical label
    norm_domains = []
    for d in sorted(raw_domains, key=lambda d: str(d.get("id", ""))):
        label = str(d.get("label", d.get("id", "")))
        did = str(d.get("id", label))
        domain_map[did] = label
        domain_map[label] = label
        if label not in norm_domains:
            norm_domains.append(label)
    norm_domains.sort()

    # Build nodes
    norm_nodes = []
    seen_node_ids = set()
    unknown_domain_refs = []
    for entity in raw_entities:
        name = str(entity.get("name", ""))
        domain_ref = str(entity.get("domain", ""))
        resolved_domain = domain_map.get(domain_ref, "")
        if not resolved_domain:
            unknown_domain_refs.append(domain_ref)
            bounded_conditions.append(f"unknown_domain_ref:{domain_ref}")
            resolved_domain = domain_ref  # keep as-is

        nid = entity_node_id(entity)
        if nid not in seen_node_ids:
            seen_node_ids.add(nid)
            norm_nodes.append({
                "id": nid,
                "label": name,
                "domain": resolved_domain
            })

    # Sort nodes deterministically
    norm_nodes.sort(key=lambda n: n["id"])

    # Build relationships
    # Build name→id index for lookup
    name_to_id = {n["label"]: n["id"] for n in norm_nodes}

    norm_rels = []
    for rel in raw_rels:
        from_name = str(rel.get("from", ""))
        to_name = str(rel.get("to", ""))
        rtype = str(rel.get("type", "")).upper()

        from_id = name_to_id.get(from_name, "")
        to_id = name_to_id.get(to_name, "")

        if not from_id:
            bounded_conditions.append(f"unknown_entity_ref:{from_name}")
        if not to_id:
            bounded_conditions.append(f"unknown_entity_ref:{to_name}")

        norm_rels.append({
            "from": from_id or from_name,
            "to": to_id or to_name,
            "type": rtype
        })

    # Sort relationships deterministically
    norm_rels.sort(key=lambda r: (r["from"], r["to"], r["type"]))

    topology = {
        "domains": norm_domains,
        "nodes": norm_nodes,
        "relationships": norm_rels
    }

    log(f"  domains:       {len(norm_domains)}")
    log(f"  nodes:         {len(norm_nodes)}")
    log(f"  relationships: {len(norm_rels)}")
    log("TOPOLOGY_CONSTRUCTION_PASS")
    return topology


# ── STAGE: SIGNAL_DERIVATION ──────────────────────────────────────────────────
def signal_derivation(topology, metrics, events):
    log()
    log("--- SIGNAL_DERIVATION ---")

    nodes = topology["nodes"]
    rels = topology["relationships"]
    domains = topology["domains"]

    n_nodes = len(nodes)
    n_domains = len(domains)
    n_rels = len(rels)

    # Classify relationships
    dep_rels = [r for r in rels if r["type"] in DEP_TYPES]
    coord_rels = [r for r in rels if r["type"] in COORD_TYPES]

    # Classify events
    change_events = [e for e in events
                     if str(e.get("type", "")).lower()
                     in ("change", "commit", "push", "merge")]
    pipeline_events = [e for e in events
                       if str(e.get("type", "")).lower()
                       in ("pipeline_execution", "run", "execution")]
    stability_events = [e for e in events
                        if str(e.get("type", "")).lower()
                        in ("stability", "completion", "run_complete")]

    # ── SIG-001: Coordination Pressure ────────────────────────────────────────
    if n_nodes == 0:
        s001_state = "BLOCKED"
    elif coord_rels:
        s001_state = "PARTIAL" if not pipeline_events else "COMPLETE"
    else:
        s001_state = "BLOCKED"
    s001_bound = len(coord_rels)

    # ── SIG-002: Dependency Load ───────────────────────────────────────────────
    if n_nodes == 0:
        s002_state = "BLOCKED"
    elif dep_rels:
        s002_state = "COMPLETE"
    else:
        s002_state = "PARTIAL"  # nodes exist but no dep edges — structurally incomplete
    s002_bound = len(dep_rels)

    # ── SIG-003: Change Concentration ─────────────────────────────────────────
    if not events:
        s003_state = "BLOCKED"
    elif change_events:
        has_time = any("time" in e or "timestamp" in e
                       for e in change_events)
        s003_state = "COMPLETE" if has_time else "PARTIAL"
    else:
        s003_state = "BLOCKED"
    s003_bound = len(change_events)

    # ── SIG-004: Structural Volatility ─────────────────────────────────────────
    if n_nodes == 0:
        s004_state = "BLOCKED"
    elif n_rels > 0:
        s004_state = "COMPLETE"
    else:
        s004_state = "PARTIAL"
    s004_bound = n_rels

    # ── SIG-005: Execution Throughput ──────────────────────────────────────────
    artifacts = metrics.get("artifacts_per_run")
    stages = metrics.get("pipeline_stage_count")
    if artifacts is not None and stages is not None:
        s005_state = "COMPLETE"
        s005_bound = int(artifacts)
    elif artifacts is not None or pipeline_events:
        s005_state = "PARTIAL"
        s005_bound = int(artifacts) if artifacts is not None else len(pipeline_events)
    else:
        s005_state = "BLOCKED"
        s005_bound = 0

    # ── SIG-006: Execution Stability ──────────────────────────────────────────
    if not events:
        s006_state = "BLOCKED"
        s006_bound = 0
    elif stability_events:
        has_completion = any("completion" in e or "status" in e
                             for e in stability_events)
        s006_state = "COMPLETE" if has_completion else "PARTIAL"
        s006_bound = len(stability_events)
    else:
        s006_state = "BLOCKED"
        s006_bound = 0

    # ── SIG-007: ESI (composite: SIG-002, SIG-005, SIG-006) ───────────────────
    s007_state = worst_state(s002_state, s005_state, s006_state)
    s007_bound = s002_bound + s005_bound + s006_bound

    # ── SIG-008: RAG (composite: SIG-001, SIG-004, SIG-003) ───────────────────
    s008_state = worst_state(s001_state, s004_state, s003_state)
    s008_bound = s001_bound + s004_bound + s003_bound

    signals = [
        {"id": "SIG-001", "severity": STATE_TO_SEVERITY[s001_state],
         "bound_count": s001_bound},
        {"id": "SIG-002", "severity": STATE_TO_SEVERITY[s002_state],
         "bound_count": s002_bound},
        {"id": "SIG-003", "severity": STATE_TO_SEVERITY[s003_state],
         "bound_count": s003_bound},
        {"id": "SIG-004", "severity": STATE_TO_SEVERITY[s004_state],
         "bound_count": s004_bound},
        {"id": "SIG-005", "severity": STATE_TO_SEVERITY[s005_state],
         "bound_count": s005_bound},
        {"id": "SIG-006", "severity": STATE_TO_SEVERITY[s006_state],
         "bound_count": s006_bound},
        {"id": "SIG-007", "severity": STATE_TO_SEVERITY[s007_state],
         "bound_count": s007_bound},
        {"id": "SIG-008", "severity": STATE_TO_SEVERITY[s008_state],
         "bound_count": s008_bound}
    ]

    # Signals are already ordered SIG-001..SIG-008 (deterministic fixed order)
    for s in signals:
        log(f"  {s['id']}  severity={s['severity']}  bound_count={s['bound_count']}")

    log("SIGNAL_DERIVATION_PASS")
    return signals


# ── STAGE: METRIC_COMPUTATION ─────────────────────────────────────────────────
def metric_computation(topology, signals):
    log()
    log("--- METRIC_COMPUTATION ---")

    n_nodes = len(topology["nodes"])
    n_domains = len(topology["domains"])
    n_rels = len(topology["relationships"])
    n_signals = len(signals)

    structural_density = round(n_nodes / max(1, n_domains), 2)
    dependency_load = round(n_rels / max(1, n_nodes), 2)

    high_sev = sum(1 for s in signals
                   if s["severity"] in ("HIGH", "CRITICAL"))
    coordination_pressure = round(high_sev / max(1, n_signals), 2)

    total_bound = sum(s["bound_count"] for s in signals)
    visibility_deficit = round(
        min(1.0, total_bound / max(1, n_signals * 10)), 2
    )

    structural_metrics = {
        "coordination_pressure": coordination_pressure,
        "dependency_load": dependency_load,
        "structural_density": structural_density,
        "visibility_deficit": visibility_deficit
    }

    log(f"  structural_density:     {structural_density}")
    log(f"  dependency_load:        {dependency_load}")
    log(f"  coordination_pressure:  {coordination_pressure}")
    log(f"  visibility_deficit:     {visibility_deficit}")
    log("METRIC_COMPUTATION_PASS")
    return structural_metrics


# ── STAGE: STATE_ASSEMBLY ─────────────────────────────────────────────────────
def state_assembly(client_uuid, topology, signals, structural_metrics, bounded_conditions):
    log()
    log("--- STATE_ASSEMBLY ---")

    # Assemble without metadata first (for deterministic hash)
    core = {
        "client_uuid": client_uuid,
        "signals": signals,
        "structural_metrics": structural_metrics,
        "topology": topology
    }
    canonical = json.dumps(core, sort_keys=True, separators=(",", ":"),
                           ensure_ascii=True)
    det_hash = sha256_of(canonical)

    state = {
        "client_uuid": client_uuid,
        "construction_metadata": {
            "bounded_conditions": sorted(set(bounded_conditions)),
            "deterministic_hash": det_hash,
            "stream": STREAM_ID,
            "timestamp": None  # fixed null — no time variance
        },
        "signals": signals,
        "structural_metrics": structural_metrics,
        "topology": topology
    }

    log(f"  bounded_conditions: {len(set(bounded_conditions))}")
    log(f"  deterministic_hash: {det_hash[:16]}...")
    log("STATE_ASSEMBLY_PASS")
    return state, det_hash


# ── STAGE: OUTPUT_WRITE ───────────────────────────────────────────────────────
def output_write(client_uuid, state, log_lines):
    log()
    log("--- OUTPUT_WRITE ---")

    input_dir = os.path.join(REPO_ROOT, "clients", client_uuid, "input")
    out_state = os.path.join(input_dir, "authoritative_state.json")
    out_log = os.path.join(input_dir, "construction_log.md")

    # No-overwrite
    if os.path.exists(out_state):
        fail("OUTPUT_WRITE",
             f"authoritative_state.json already exists at {out_state}. "
             "Delete to re-run.",
             "NO_OVERWRITE_VIOLATION")

    assert_write_allowed(out_state, client_uuid)
    assert_write_allowed(out_log, client_uuid)

    os.makedirs(input_dir, exist_ok=True)

    # Write authoritative_state.json
    with open(out_state, "w") as f:
        f.write(_jdump(state))
    log(f"  WRITTEN  clients/{client_uuid}/input/authoritative_state.json")

    # Write construction_log.md
    clog = f"""# Construction Log — WP-13B

stream: {STREAM_ID}
client_uuid: {client_uuid}

## Pipeline Trace

```
{chr(10).join(log_lines)}
```

## Construction Metadata

| Field | Value |
|---|---|
| deterministic_hash | {state['construction_metadata']['deterministic_hash']} |
| bounded_conditions | {len(state['construction_metadata']['bounded_conditions'])} |
| timestamp | null (deterministic) |

## Bounded Conditions

{chr(10).join(f'- {c}' for c in state['construction_metadata']['bounded_conditions']) if state['construction_metadata']['bounded_conditions'] else 'None'}

## Signals Summary

| ID | Severity | Bound Count |
|---|---|---|
{chr(10).join(f"| {s['id']} | {s['severity']} | {s['bound_count']} |" for s in state['signals'])}

## Structural Metrics

| Metric | Value |
|---|---|
| structural_density | {state['structural_metrics']['structural_density']} |
| dependency_load | {state['structural_metrics']['dependency_load']} |
| coordination_pressure | {state['structural_metrics']['coordination_pressure']} |
| visibility_deficit | {state['structural_metrics']['visibility_deficit']} |
"""
    with open(out_log, "w") as f:
        f.write(clog)
    log(f"  WRITTEN  clients/{client_uuid}/input/construction_log.md")

    log("OUTPUT_WRITE_PASS")


# ── INTAKE RESOLUTION (WP-15C) ────────────────────────────────────────────────
def resolve_input_source(client_uuid, raw_input_arg):
    """Detect AUTHORITATIVE_INTAKE before falling back to TEST_INPUT.

    Priority:
      1. clients/<uuid>/input/intake/intake_manifest.json → AUTHORITATIVE_INTAKE
      2. --raw-input argument (or default raw_input.json)  → TEST_INPUT (fallback)

    Returns (input_path, source_class).
    """
    log("--- INPUT_RESOLUTION ---")

    manifest_rel  = os.path.join("clients", client_uuid, "input", "intake",
                                 "intake_manifest.json")
    manifest_path = os.path.join(REPO_ROOT, manifest_rel)

    if os.path.isfile(manifest_path):
        # Load and validate manifest
        assert_read_allowed(manifest_path, client_uuid)
        with open(manifest_path) as f:
            manifest = json.load(f)

        sc = manifest.get("source_class")
        if sc != "AUTHORITATIVE_INTAKE":
            fail("INPUT_RESOLUTION",
                 f"intake_manifest source_class={sc!r} != 'AUTHORITATIVE_INTAKE'",
                 "SOURCE_CLASS_VIOLATION")

        # Resolve primary intake file
        intake_file = os.path.join(
            REPO_ROOT, "clients", client_uuid,
            "input", "intake", "telemetry_baseline.json")
        if not os.path.isfile(intake_file):
            fail("INPUT_RESOLUTION",
                 f"intake file not found: {intake_file}",
                 "INTAKE_FILE_MISSING")

        # Scope guard
        real_file = os.path.realpath(intake_file)
        real_client = os.path.realpath(
            os.path.join(REPO_ROOT, "clients", client_uuid))
        if not real_file.startswith(real_client + os.sep):
            fail("INPUT_RESOLUTION",
                 f"intake file path escapes client scope",
                 "PATH_SCOPE_VIOLATION")

        intake_rel = os.path.relpath(intake_file, REPO_ROOT)
        log(f"  INPUT_SOURCE = AUTHORITATIVE_INTAKE")
        log(f"  INPUT_PATH   = {intake_rel}")
        log("INPUT_RESOLUTION_PASS")
        log()
        return intake_file, "AUTHORITATIVE_INTAKE"

    # Fallback: TEST_INPUT
    fallback = raw_input_arg or os.path.join(
        REPO_ROOT, "clients", client_uuid, "input", "raw_input.json")
    log(f"  intake_manifest not found — fallback to TEST_INPUT")
    log(f"  INPUT_SOURCE = TEST_INPUT")
    log(f"  INPUT_PATH   = {os.path.relpath(fallback, REPO_ROOT)}")
    log("INPUT_RESOLUTION_PASS")
    log()
    return fallback, "TEST_INPUT"


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PSEE Authoritative Input Construction — WP-13B"
    )
    parser.add_argument("--client", required=True, help="Client UUID")
    parser.add_argument("--raw-input", required=False, default=None,
                        dest="raw_input",
                        help="Path to raw_input.json (fallback if no intake manifest)")
    args = parser.parse_args()

    client_uuid = args.client

    # ── PRE-FLIGHT ─────────────────────────────────────────────────────────────
    preflight(client_uuid)

    # ── INPUT RESOLUTION (WP-15C) ──────────────────────────────────────────────
    raw_input_path, input_source = resolve_input_source(client_uuid, args.raw_input)

    # ── LOAD RAW INPUT ─────────────────────────────────────────────────────────
    log("--- INPUT_LOAD ---")
    if not os.path.isfile(raw_input_path):
        fail("INPUT_LOAD", f"input not found: {raw_input_path}", "INPUT_NOT_FOUND")
    assert_read_allowed(raw_input_path, client_uuid)

    with open(raw_input_path) as f:
        raw = json.load(f)
    log(f"INPUT_LOAD_PASS  source={input_source}  path={raw_input_path}")

    # ── PIPELINE ───────────────────────────────────────────────────────────────

    # Stage 1: STRUCTURAL_NORMALIZATION
    bounded_conditions = structural_normalization(raw, client_uuid)

    # Stage 2: TOPOLOGY_CONSTRUCTION
    topology = topology_construction(raw, bounded_conditions)

    # Stage 3: SIGNAL_DERIVATION
    metrics = raw.get("metrics", {})
    events = raw.get("events", [])
    signals = signal_derivation(topology, metrics, events)

    # Stage 4: METRIC_COMPUTATION
    structural_metrics = metric_computation(topology, signals)

    # Stage 5: STATE_ASSEMBLY
    state, det_hash = state_assembly(
        client_uuid, topology, signals, structural_metrics, bounded_conditions
    )

    # Capture log lines for construction_log.md
    # Re-derive canonical to get stable hash for log
    log_lines = [
        "PRECHECK_PASS",
        "INPUT_LOAD_PASS",
        "STRUCTURAL_NORMALIZATION_PASS",
        "TOPOLOGY_CONSTRUCTION_PASS",
        "SIGNAL_DERIVATION_PASS",
        "METRIC_COMPUTATION_PASS",
        "STATE_ASSEMBLY_PASS",
        "OUTPUT_WRITE_PASS"
    ]

    # Stage 6: OUTPUT_WRITE
    output_write(client_uuid, state, log_lines)

    # ── SUMMARY ────────────────────────────────────────────────────────────────
    log()
    log("CONSTRUCTION_COMPLETE")
    log(f"  client_uuid:          {client_uuid}")
    log(f"  nodes:                {len(topology['nodes'])}")
    log(f"  domains:              {len(topology['domains'])}")
    log(f"  relationships:        {len(topology['relationships'])}")
    log(f"  signals:              {len(signals)}")
    log(f"  structural_density:   {structural_metrics['structural_density']}")
    log(f"  dependency_load:      {structural_metrics['dependency_load']}")
    log(f"  bounded_conditions:   {len(set(bounded_conditions))}")
    log(f"  deterministic_hash:   {det_hash[:16]}...")
    sys.exit(0)


if __name__ == "__main__":
    main()
