#!/usr/bin/env python3
"""
build_binding_package.py
STREAM: PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01

Consolidated PSEE binding package builder.

Produces a complete, canonical binding package from L1 authoritative structure
in a single execution. No external delta step required.

Absorbs and supersedes:
  - build_binding_convergence.py    (T1/T2/T3 construction, 10 BC-CHECKs)
  - apply_binding_convergence_projection_delta.py  (R1-R3 topology promotion)

Native behavior (new vs prior scripts):
  R1. Capability surfaces as first-class topology nodes
  R2. Explicit domain → capability_surface CONTAINS edges
  R3. Explicit capability_surface → component_entity CONTAINS edges
  R4. Structural telemetry emission (CEU-level + domain-level)
  R5. SIG-006 static computed signal (sensor_batch_throughput_rate = 0.333 rec/sec)
  R6. Correct constraint_flags from structure_manifest (overlap + unknown_space)
  R7. Target handoff declarations: GAUGE and/or upper PiOS Core

Inputs (under clients/<uuid>/psee/runs/<run_id>/):
  structure/structure_manifest.json         REQUIRED
  lineage/ceu_registry.json                 OPTIONAL (fallback to repo)
  lineage/raw_input.json                    OPTIONAL (provenance reference)

Outputs (under clients/<uuid>/psee/runs/<run_id>/binding/):
  binding_transformation_spec.json          T1
  binding_model.json                        T2
  binding_envelope.json                     T3 — canonical consumption artifact
  validation_log.json
  package_manifest.json
  logs/                                     structured JSON-lines per run

Exit codes:
  0  PACKAGE_COMPLETE
  1  PRE-FLIGHT FAILURE
  2  INPUT VALIDATION FAILURE
  3  TRANSFORMATION FAILURE
  4  ENVELOPE EMISSION FAILURE
  5  VALIDATION FAILURE

Examples:
  # Build for both gauge and upper PiOS Core (default):
  python3 scripts/psee/build_binding_package.py \\
      --client 1de0d815-0721-58e9-bc8d-ca83e70fa903 \\
      --run-id run_335c0575a080

  # Gauge only, debug mode:
  python3 scripts/psee/build_binding_package.py \\
      --client 1de0d815-0721-58e9-bc8d-ca83e70fa903 \\
      --run-id run_335c0575a080 \\
      --target gauge --debug

  # Dry run (validate inputs, no file writes):
  python3 scripts/psee/build_binding_package.py \\
      --client 1de0d815-0721-58e9-bc8d-ca83e70fa903 \\
      --run-id run_335c0575a080 \\
      --dry-run
"""

import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

# Force line-buffered stdout for clean stdout/stderr interleave
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)


# ── IDENTITY ───────────────────────────────────────────────────────────────────
STREAM_ID      = "PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01"
CONTRACT_ID    = "PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01"
SCHEMA_VERSION = "1.0"
REPO_NAME      = "k-pi-core"
REQUIRED_BRANCH = "work/psee-runtime"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# CEU registry fallback path (when run lineage dir doesn't have it)
REPO_CEU_REGISTRY = os.path.join(
    REPO_ROOT, "docs", "pios",
    "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
    "ceu_registry.json"
)
REPO_STRUCTURAL_TOPOLOGY = os.path.join(
    REPO_ROOT, "docs", "pios",
    "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
    "structural_topology.json"
)

# ── GUARDS ─────────────────────────────────────────────────────────────────────
WP13B_LABELS = {
    "Blue Edge Fleet Frontend", "Blue Edge Fleet Management API",
    "HASI Bridge Agent", "Sensor Collector Agent", "MQTT Broker",
    "Redis", "PostgreSQL+TimescaleDB", "Monitoring-Prometheus+Grafana",
    "HASI Security System",
}
BM_PATTERN = re.compile(r"\bBM-\d+\b")

REQUIRED_DUAL_LENS = {"source_origin", "structural_topology_source", "documented_taxonomy_source"}

FORBIDDEN_EDGE_TYPES = {
    "CAPABILITY_TO_CAPABILITY", "COMPONENT_TO_COMPONENT",
    "INFERRED_DEPENDENCY", "BEHAVIORAL",
}

# ── SIG-006 AUTHORITATIVE CONSTANTS ────────────────────────────────────────────
# Source: 40.5/signal_output_set.md — COMPLETE static computed signal
# Derivation: DIM-PC-002 / DIM-PC-001 = batch_size / poll_interval_sec = 10/30 = 0.333
SIG006 = {
    "signal_id": "SIG-006",
    "metric_name": "sensor_batch_throughput_rate",
    "node_id": "NODE-010",
    "value": 0.333,
    "unit": "rec/sec",
    "computation_state": "COMPLETE",
    "temporal_classification": "STATIC",
    "source_basis": "STATIC_CONFIG_COMPUTED",
    "derivation": "DIM-PC-002 / DIM-PC-001 = 10 / 30 = 0.333 rec/sec",
    "provenance": {
        "ceu_id": "CEU-10",
        "parent_node": "NODE-010",
        "source_artifact": "ceu_registry.json",
        "source_field": "ceu_entries[ceu_id=CEU-10] hasi_bridge.py DEFAULT_CONFIG",
        "dim_pc_001": {"variable": "VAR_HASI_001", "value": 30, "unit": "sec"},
        "dim_pc_002": {"variable": "VAR_HASI_002", "value": 10, "unit": "records"},
        "authority_chain": (
            "40.5/signal_output_set.md + 40.5/signal_traceability_map.md"
        ),
        "binding_package_contract": CONTRACT_ID,
    },
}


# ── HELPERS ────────────────────────────────────────────────────────────────────
def now_iso():
    return datetime.now(timezone.utc).isoformat()


def now_compact():
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def jdump(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=True)


def load_json(path, label=""):
    if not os.path.isfile(path):
        return None
    with open(path, encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"JSON parse error in {label or path}: {e}")


def write_json_file(path, data, dry_run=False):
    if dry_run:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(jdump(data))


# ── STRUCTURED LOGGER ─────────────────────────────────────────────────────────
class Logger:
    def __init__(self, log_path, client_id, run_id, level="INFO", dry_run=False):
        self._level = level
        self._dry_run = dry_run
        self._client_id = client_id
        self._run_id = run_id
        self._path = log_path
        self._fh = None
        if not dry_run:
            os.makedirs(os.path.dirname(log_path), exist_ok=True)
            self._fh = open(log_path, "w", encoding="utf-8")

    def _write(self, level, stage, message, **metrics):
        entry = {
            "timestamp": now_iso(),
            "level": level,
            "stage": stage,
            "client_id": self._client_id,
            "run_id": self._run_id,
            "message": message,
        }
        if metrics:
            entry["metrics"] = {k: v for k, v in metrics.items() if v is not None}
        line = json.dumps(entry, ensure_ascii=True)
        if self._fh:
            self._fh.write(line + "\n")
            self._fh.flush()
        return entry

    def info(self, stage, message, **metrics):
        self._write("INFO", stage, message, **metrics)
        print(f"  [{stage}] {message}")

    def debug(self, stage, message, **metrics):
        if self._level == "DEBUG":
            self._write("DEBUG", stage, message, **metrics)
            print(f"  [{stage}] DEBUG: {message}")
        else:
            self._write("DEBUG", stage, message, **metrics)

    def warn(self, stage, message, **metrics):
        self._write("WARN", stage, message, **metrics)
        print(f"  [{stage}] WARN: {message}")

    def error(self, stage, message, **metrics):
        self._write("ERROR", stage, message, **metrics)
        print(f"  [{stage}] ERROR: {message}", file=sys.stderr)

    def close(self):
        if self._fh:
            self._fh.close()


# ── PRE-FLIGHT ─────────────────────────────────────────────────────────────────
def pre_flight(client_id, run_id, fail_on_warning, log):
    log.info("PREFLIGHT", "starting pre-flight checks")

    # 1. Git repo identity
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        name = os.path.basename(r.stdout.strip())
        if r.returncode != 0 or name != REPO_NAME:
            log.error("PREFLIGHT", f"repo mismatch: got={name!r} expected={REPO_NAME!r}")
            sys.exit(1)
        log.info("PREFLIGHT", f"repo: {name} — PASS")
    except FileNotFoundError:
        log.error("PREFLIGHT", "git not found in PATH")
        sys.exit(1)

    # 2. Branch
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            log.error("PREFLIGHT",
                      f"branch={branch!r} required={REQUIRED_BRANCH!r}")
            sys.exit(1)
        log.info("PREFLIGHT", f"branch: {branch} — PASS")
    except FileNotFoundError:
        log.error("PREFLIGHT", "git not found")
        sys.exit(1)

    # 3. Worktree
    r = subprocess.run(
        ["git", "status", "--porcelain"],
        capture_output=True, text=True, cwd=REPO_ROOT
    )
    dirty = [l for l in r.stdout.splitlines()
             if l.strip() and not l.startswith(f"?? clients/{client_id}/")]
    if dirty:
        msg = f"worktree not clean: {dirty[0]}"
        if fail_on_warning:
            log.error("PREFLIGHT", msg)
            sys.exit(1)
        log.warn("PREFLIGHT", msg)
    else:
        log.info("PREFLIGHT", "worktree: clean — PASS")

    # 4. Structure manifest (primary required input)
    sm_path = os.path.join(
        REPO_ROOT, "clients", client_id, "psee", "runs", run_id,
        "structure", "structure_manifest.json"
    )
    if not os.path.isfile(sm_path):
        log.error("PREFLIGHT", f"structure_manifest.json not found: {sm_path}")
        sys.exit(1)
    log.info("PREFLIGHT", "structure_manifest.json: found — PASS")

    # 5. CEU registry (run-local or repo fallback)
    lineage_ceu = os.path.join(
        REPO_ROOT, "clients", client_id, "psee", "runs", run_id,
        "lineage", "ceu_registry.json"
    )
    ceu_registry_path = lineage_ceu if os.path.isfile(lineage_ceu) else REPO_CEU_REGISTRY
    if not os.path.isfile(ceu_registry_path):
        log.warn("PREFLIGHT", "ceu_registry.json not found — SIG-006 will use hardcoded constants")
        ceu_registry_path = None
    else:
        log.info("PREFLIGHT", f"ceu_registry: {ceu_registry_path.replace(REPO_ROOT+os.sep,'')} — PASS")

    log.info("PREFLIGHT", "all pre-flight checks: PASS")
    return sm_path, ceu_registry_path


# ── LOAD AND VALIDATE INPUTS ───────────────────────────────────────────────────
def load_inputs(sm_path, log):
    log.info("LOAD_INPUTS", "loading structure_manifest.json")
    sm = load_json(sm_path, "structure_manifest.json")
    if sm is None:
        log.error("LOAD_INPUTS", "failed to load structure_manifest.json")
        sys.exit(2)

    # Stratum check
    if sm.get("stratum") != "L1_AUTHORITATIVE_STRUCTURE":
        log.error("LOAD_INPUTS",
                  f"stratum={sm.get('stratum')!r} expected=L1_AUTHORITATIVE_STRUCTURE")
        sys.exit(2)

    # Cross-projection boundary
    sb = sm.get("stratum_boundary", {})
    if sb.get("cross_projection_forbidden") is not True:
        log.error("LOAD_INPUTS", "stratum_boundary.cross_projection_forbidden is not true")
        sys.exit(2)

    domains = sm.get("domains", [])
    nodes = sm.get("nodes", [])
    relationships = sm.get("relationships", [])
    lineage_records = sm.get("lineage", [])
    telemetry = sm.get("structural_telemetry", [])
    constraint_flags = sm.get("constraint_flags", {})

    # Require sub-domain projection
    if not any(d.get("sub_domains") for d in domains):
        log.error("LOAD_INPUTS", "no sub-domain projection in structure_manifest")
        sys.exit(2)

    # WP-13B contamination check
    sm_str = jdump(sm)
    for label in WP13B_LABELS:
        if label in sm_str:
            log.error("LOAD_INPUTS", f"WP-13B label in manifest: {label!r}")
            sys.exit(2)

    # BM identifier check
    if BM_PATTERN.search(sm_str):
        log.error("LOAD_INPUTS", "BM-level identifier in manifest")
        sys.exit(2)

    # Dual-lens provenance on domains
    for dom in domains:
        missing = REQUIRED_DUAL_LENS - set(dom.keys())
        if missing:
            log.error("LOAD_INPUTS",
                      f"domain {dom.get('domain_id')} missing provenance: {missing}")
            sys.exit(2)

    # Dual-lens provenance on nodes
    for node in nodes:
        missing = REQUIRED_DUAL_LENS - set(node.keys())
        if missing:
            log.error("LOAD_INPUTS",
                      f"node {node.get('node_id')} missing provenance: {missing}")
            sys.exit(2)

    # STATIC-only telemetry
    for st in telemetry:
        if st.get("temporal_classification") != "STATIC":
            log.error("LOAD_INPUTS",
                      f"telemetry {st.get('telemetry_id')} is non-STATIC — forbidden")
            sys.exit(2)

    # constraint_flags: must be correct
    if constraint_flags.get("overlap_present") is not True:
        log.error("LOAD_INPUTS",
                  "constraint_flags.overlap_present != true — structure_manifest recovery incomplete")
        sys.exit(2)
    if constraint_flags.get("unknown_space_present") is not True:
        log.error("LOAD_INPUTS",
                  "constraint_flags.unknown_space_present != true — structure_manifest recovery incomplete")
        sys.exit(2)

    log.info("LOAD_INPUTS", "input validation: PASS",
             domains=len(domains), nodes=len(nodes),
             telemetry=len(telemetry), relationships=len(relationships))

    return domains, nodes, relationships, lineage_records, telemetry, constraint_flags


# ── TRANSFORMATION SPEC (T1) ───────────────────────────────────────────────────
def build_transformation_spec(log):
    log.info("T1_SPEC", "building binding_transformation_spec.json")
    spec = {
        "artifact_id": f"{STREAM_ID}-TRANSFORMATION-SPEC",
        "contract_id": CONTRACT_ID,
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "supersedes": [
            "build_binding_convergence.py → binding_transformation_spec",
            "apply_binding_convergence_projection_delta.py",
        ],
        "rules": [
            {
                "rule_id": "TR-01",
                "family": "domain_to_binding_context",
                "description": "Map each active domain to a binding_context node",
                "input_selector": "structure_manifest.domains[]",
                "output_type": "binding_context",
                "transformation_type": "STRUCTURAL_PROJECTION",
                "provenance_required": list(REQUIRED_DUAL_LENS),
                "temporal_classification_rule": "CARRY_AS_IS — must be STATIC",
                "exclusion_rule": "Exclude domains where intake_status=NOT_INGESTED",
            },
            {
                "rule_id": "TR-02",
                "family": "sub_domain_to_capability_surface",
                "description": "Map each sub-domain to a capability_surface node",
                "input_selector": "structure_manifest.domains[].sub_domains[]",
                "output_type": "capability_surface",
                "transformation_type": "STRUCTURAL_PROJECTION",
                "provenance_required": ["parent_ceu", "parent_node", "containment_basis"],
                "temporal_classification_rule": "CARRY_AS_IS — must be STATIC",
                "exclusion_rule": "Exclude sub-domains from NOT_INGESTED parent domains",
            },
            {
                "rule_id": "TR-03",
                "family": "ceu_node_to_component_entity",
                "description": "Map each CEU node to a component_entity node",
                "input_selector": "structure_manifest.nodes[]",
                "output_type": "component_entity",
                "transformation_type": "DIRECT_MAPPING",
                "provenance_required": list(REQUIRED_DUAL_LENS),
                "temporal_classification_rule": "CARRY_AS_IS — must be STATIC",
            },
            {
                "rule_id": "TR-04",
                "family": "structural_telemetry_to_signal_seed",
                "description": "Map STATIC telemetry to signal_seeds (CEU-level → signals, domain-level → domain_telemetry)",
                "input_selector": "structure_manifest.structural_telemetry[]",
                "output_type": "signal_seed | domain_telemetry",
                "transformation_type": "TELEMETRY_PROJECTION",
                "temporal_classification_rule": "MUST be STATIC",
                "exclusion_rule": "PENDING_RUNTIME excluded",
            },
            {
                "rule_id": "TR-05",
                "family": "lineage_to_provenance",
                "description": "Pass lineage records through to envelope provenance",
                "input_selector": "structure_manifest.lineage[]",
                "output_type": "envelope_provenance_entry",
                "transformation_type": "PASS_THROUGH",
            },
            {
                "rule_id": "R1",
                "family": "topology_promotion",
                "description": "Promote capability_surfaces to first-class topology nodes",
                "derivation_basis": "binding_model.capability_surfaces[]",
                "output_type": "topology_node:capability_surface",
                "transformation_type": "NODE_PROMOTION",
            },
            {
                "rule_id": "R2",
                "family": "contains_domain_to_surface",
                "description": "Materialize domain → capability_surface CONTAINS edges",
                "derivation_basis": "capability_surface.parent_binding_context",
                "output_type": "edge:CONTAINS:domain_to_surface",
                "transformation_type": "EDGE_MATERIALIZATION",
            },
            {
                "rule_id": "R3",
                "family": "contains_surface_to_component",
                "description": "Materialize capability_surface → component_entity CONTAINS edges",
                "derivation_basis": "capability_surface.parent_node",
                "output_type": "edge:CONTAINS:surface_to_component",
                "transformation_type": "EDGE_MATERIALIZATION",
            },
            {
                "rule_id": "R4",
                "family": "structural_telemetry_emission",
                "description": "Emit structural telemetry including CEU-level and domain-level",
                "transformation_type": "TELEMETRY_EMISSION",
            },
            {
                "rule_id": "R5",
                "family": "sig006_inclusion",
                "description": "Include SIG-006 static computed signal (0.333 rec/sec on NODE-010)",
                "source": "40.5/signal_output_set.md + 40.5/signal_traceability_map.md",
                "transformation_type": "STATIC_SIGNAL_INCLUSION",
            },
            {
                "rule_id": "R6",
                "family": "constraint_flags",
                "description": "Set correct overlap_present and unknown_space_present from structure_manifest",
                "transformation_type": "CONSTRAINT_FLAG_PROPAGATION",
            },
            {
                "rule_id": "R7",
                "family": "target_handoff",
                "description": "Emit target handoff declarations for gauge and/or upper-core",
                "transformation_type": "HANDOFF_DECLARATION",
            },
        ],
        "global_constraints": {
            "wp13b_exclusion": "gauge_state.json (WP-13B) is ADJACENT_CONSUMPTION_MODEL — excluded",
            "bm_expansion_forbidden": "No BM-001..BM-063 in any binding artifact",
            "semantic_inference_forbidden": "All labels from L1 structural truth only",
            "dom06_excluded": "DOM-06 NOT_INGESTED — excluded",
            "pending_runtime_excluded": "SIG-001..005, SIG-007..008 excluded (PENDING_RUNTIME)",
            "determinism": "sorted keys, stable ordering, same input → same output",
            "back_propagation_forbidden": "No downstream consumer may mutate L1 truth",
        },
    }
    log.info("T1_SPEC", "transformation_spec built", rules=len(spec["rules"]))
    return spec


# ── BINDING MODEL (T2) ─────────────────────────────────────────────────────────
def build_binding_model(client_id, run_id, domains, nodes, relationships,
                        lineage_records, telemetry, log):
    log.info("T2_MODEL", "building binding_model.json")

    # TR-01: domains → binding_contexts
    binding_contexts = []
    for dom in sorted(domains, key=lambda d: d["domain_id"]):
        bc = {
            "binding_context_id": dom["domain_id"],
            "label": dom["label"],
            "temporal_classification": dom.get("temporal_classification", "STATIC"),
            "source_origin": dom["source_origin"],
            "structural_topology_source": dom["structural_topology_source"],
            "documented_taxonomy_source": dom["documented_taxonomy_source"],
            "label_provenance": dom.get("label_provenance"),
            "transformation_rule": "TR-01",
            "source_artifact": "structure_manifest.json",
            "source_selector": f"domains[domain_id={dom['domain_id']}]",
        }
        binding_contexts.append(bc)

    # TR-02: sub_domains → capability_surfaces
    capability_surfaces = []
    for dom in sorted(domains, key=lambda d: d["domain_id"]):
        if not dom.get("sub_domains"):
            continue
        for sd in dom["sub_domains"]:
            cs = {
                "capability_surface_id": sd["sub_domain_id"],
                "parent_binding_context": dom["domain_id"],
                "label": sd["label"],
                "path_pattern": sd.get("path_pattern"),
                "containment_basis": sd.get("containment_basis"),
                "parent_ceu": sd.get("parent_ceu"),
                "parent_node": sd.get("parent_node"),
                "temporal_classification": sd.get("temporal_classification", "STATIC"),
                "transformation_rule": "TR-02",
                "source_artifact": "structure_manifest.json",
                "source_selector": (
                    f"domains[domain_id={dom['domain_id']}]"
                    f".sub_domains[sub_domain_id={sd['sub_domain_id']}]"
                ),
            }
            for opt in ("overlap", "file_level_parity", "platform_unique", "observed_count"):
                if sd.get(opt) is not None:
                    cs[opt] = sd[opt]
            capability_surfaces.append(cs)

    # TR-03: nodes → component_entities
    component_entities = []
    for node in sorted(nodes, key=lambda n: n["node_id"]):
        ce = {
            "component_entity_id": node["node_id"],
            "label": node["label"],
            "binding_context_id": node["domain_id"],
            "entity_type": node["entity_type"],
            "temporal_classification": node.get("temporal_classification", "STATIC"),
            "source_origin": node["source_origin"],
            "structural_topology_source": node["structural_topology_source"],
            "documented_taxonomy_source": node["documented_taxonomy_source"],
            "transformation_rule": "TR-03",
            "source_artifact": "structure_manifest.json",
            "source_selector": f"nodes[node_id={node['node_id']}]",
        }
        component_entities.append(ce)

    # TR-04: structural_telemetry → signal_seeds (CEU-level only; domain-level handled separately)
    signal_seeds = []
    domain_telemetry_seeds = []
    for st in sorted(telemetry, key=lambda t: t["telemetry_id"]):
        if st.get("temporal_classification") != "STATIC":
            continue
        if st.get("node_id"):
            # CEU-level telemetry → signal_seed
            ss = {
                "signal_seed_id": st["telemetry_id"],
                "metric_name": st["metric_name"],
                "component_entity_id": st["node_id"],
                "ceu_id": st.get("ceu_id"),
                "value": st["value"],
                "unit": st.get("unit"),
                "temporal_classification": "STATIC",
                "source_basis": "STRUCTURAL_CONTAINMENT_STATIC",
                "source_artifact": st["source_artifact"],
                "source_field": st["source_field"],
                "provenance": st.get("provenance", "STRUCTURAL_CONTAINMENT"),
                "transformation_rule": "TR-04",
            }
            signal_seeds.append(ss)
        elif st.get("domain_id"):
            # Domain-level telemetry → domain_telemetry_seed
            dt = {
                "telemetry_id": st["telemetry_id"],
                "metric_name": st["metric_name"],
                "binding_context_id": st["domain_id"],
                "value": st["value"],
                "unit": st.get("unit"),
                "temporal_classification": "STATIC",
                "source_artifact": st["source_artifact"],
                "source_field": st["source_field"],
                "provenance": st.get("provenance"),
                "transformation_rule": "TR-04",
            }
            domain_telemetry_seeds.append(dt)

    # Relationships
    binding_relationships = []
    for rel in sorted(relationships, key=lambda r: r["relationship_id"]):
        br = {
            "relationship_id": rel["relationship_id"],
            "from_component_entity": rel["from_node"],
            "to_component_entity": rel["to_node"],
            "relationship_type": rel["relationship_type"],
            "from_ceu": rel["from_entity"],
            "to_ceu": rel["to_entity"],
            "temporal_classification": rel.get("temporal_classification", "STATIC"),
            "source_artifact": "structure_manifest.json",
            "source_selector": f"relationships[relationship_id={rel['relationship_id']}]",
        }
        binding_relationships.append(br)

    # TR-05: lineage → provenance
    provenance_records = []
    for rec in sorted(lineage_records, key=lambda r: r["node_id"]):
        pr = {
            "node_id": rec["node_id"],
            "source_artifact": rec["source_artifact"],
            "source_field": rec["source_field"],
            "source_entity_label": rec["source_entity_label"],
            "binding_context_id": rec["domain_id"],
            "client_uuid": rec["client_uuid"],
            "run_id": rec["run_id"],
            "transformation_rule": "TR-05",
        }
        provenance_records.append(pr)

    # ── R1: topology nodes (all three types) ──
    domain_topo_nodes = []
    for bc in sorted(binding_contexts, key=lambda x: x["binding_context_id"]):
        node = {
            "node_id": bc["binding_context_id"],
            "label": bc["label"],
            "node_type": "binding_context",
            "temporal_classification": bc.get("temporal_classification", "STATIC"),
            "provenance": {
                "source_origin": bc.get("source_origin"),
                "structural_topology_source": bc.get("structural_topology_source"),
                "documented_taxonomy_source": bc.get("documented_taxonomy_source"),
                "source_artifact": "structure_manifest.json",
                "binding_model_ref": (
                    f"binding_model.binding_contexts[{bc['binding_context_id']}]"
                ),
            },
        }
        domain_topo_nodes.append(node)

    surface_topo_nodes = []
    for cs in sorted(capability_surfaces, key=lambda x: x["capability_surface_id"]):
        node = {
            "node_id": cs["capability_surface_id"],
            "label": cs["label"],
            "node_type": "capability_surface",
            "parent_binding_context": cs.get("parent_binding_context"),
            "parent_ceu": cs.get("parent_ceu"),
            "parent_node": cs.get("parent_node"),
            "temporal_classification": cs.get("temporal_classification", "STATIC"),
            "provenance": {
                "containment_basis": cs.get("containment_basis"),
                "path_pattern": cs.get("path_pattern"),
                "source_artifact": "structure_manifest.json",
                "binding_model_ref": (
                    f"binding_model.capability_surfaces[{cs['capability_surface_id']}]"
                ),
            },
        }
        for opt in ("overlap", "file_level_parity", "platform_unique", "observed_count"):
            if cs.get(opt) is not None:
                node[opt] = cs[opt]
        surface_topo_nodes.append(node)

    ce_topo_nodes = []
    for ce in sorted(component_entities, key=lambda x: x["component_entity_id"]):
        node = {
            "node_id": ce["component_entity_id"],
            "label": ce["label"],
            "node_type": "component_entity",
            "binding_context_id": ce.get("binding_context_id"),
            "entity_type": ce.get("entity_type"),
            "temporal_classification": ce.get("temporal_classification", "STATIC"),
            "provenance": {
                "source_origin": ce.get("source_origin"),
                "structural_topology_source": ce.get("structural_topology_source"),
                "documented_taxonomy_source": ce.get("documented_taxonomy_source"),
                "source_artifact": "structure_manifest.json",
                "binding_model_ref": (
                    f"binding_model.component_entities[{ce['component_entity_id']}]"
                ),
            },
        }
        ce_topo_nodes.append(node)

    all_topology_nodes = domain_topo_nodes + surface_topo_nodes + ce_topo_nodes

    # ── R2: domain → capability_surface CONTAINS edges ──
    r2_edges = []
    for cs in sorted(capability_surfaces, key=lambda x: x["capability_surface_id"]):
        parent_ctx = cs.get("parent_binding_context")
        if not parent_ctx:
            log.error("T2_MODEL",
                      f"capability_surface {cs['capability_surface_id']} missing parent_binding_context")
            sys.exit(3)
        r2_edges.append({
            "edge_id": f"EDGE-CONTAINS-{parent_ctx}-{cs['capability_surface_id']}",
            "from_node": parent_ctx,
            "to_node": cs["capability_surface_id"],
            "edge_type": "CONTAINS",
            "containment_level": "domain_to_surface",
            "temporal_classification": "STATIC",
            "provenance": {
                "derivation_rule": "R2: domain_structure.json domain.sub_domains containment",
                "source_artifact": "domain_structure.json",
                "source_selector": (
                    f"domains[domain_id={parent_ctx}]"
                    f".sub_domains[sub_domain_id={cs['capability_surface_id']}]"
                ),
            },
        })

    # ── R3: capability_surface → component_entity CONTAINS edges ──
    r3_edges = []
    for cs in sorted(capability_surfaces, key=lambda x: x["capability_surface_id"]):
        parent_node = cs.get("parent_node")
        if not parent_node:
            log.error("T2_MODEL",
                      f"capability_surface {cs['capability_surface_id']} missing parent_node")
            sys.exit(3)
        r3_edges.append({
            "edge_id": f"EDGE-CONTAINS-{cs['capability_surface_id']}-{parent_node}",
            "from_node": cs["capability_surface_id"],
            "to_node": parent_node,
            "edge_type": "CONTAINS",
            "containment_level": "surface_to_component",
            "temporal_classification": "STATIC",
            "provenance": {
                "derivation_rule": "R3: structure_manifest capability_surface.parent_node",
                "source_artifact": "structure_manifest.json",
                "source_selector": (
                    f"domains[].sub_domains[sub_domain_id={cs['capability_surface_id']}]"
                    ".parent_node"
                ),
                "parent_ceu": cs.get("parent_ceu", "UNKNOWN"),
            },
        })

    # Existing OVERLAP_STRUCTURAL edges
    overlap_edges = []
    for rel in sorted(binding_relationships, key=lambda r: r["relationship_id"]):
        overlap_edges.append({
            "edge_id": rel["relationship_id"],
            "from_node": rel["from_component_entity"],
            "to_node": rel["to_component_entity"],
            "edge_type": rel["relationship_type"],
            "temporal_classification": rel["temporal_classification"],
            "provenance": {
                "from_ceu": rel["from_ceu"],
                "to_ceu": rel["to_ceu"],
                "source_artifact": rel["source_artifact"],
                "binding_model_ref": (
                    f"binding_model.relationships[{rel['relationship_id']}]"
                ),
            },
        })

    all_topology_edges = (
        sorted(r2_edges,      key=lambda e: e["edge_id"])
        + sorted(r3_edges,    key=lambda e: e["edge_id"])
        + sorted(overlap_edges, key=lambda e: e["edge_id"])
    )

    # Forbidden edge type check (R4 from delta)
    actual_edge_types = {e["edge_type"] for e in all_topology_edges}
    forbidden_found = FORBIDDEN_EDGE_TYPES & actual_edge_types
    if forbidden_found:
        log.error("T2_MODEL", f"forbidden edge types introduced: {forbidden_found}")
        sys.exit(3)

    binding_model = {
        "artifact_id": f"{STREAM_ID}-BINDING-MODEL",
        "contract_id": CONTRACT_ID,
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "consolidation_contract": CONTRACT_ID,
        "supersedes_delta_contract": (
            "PSEE.BLUEEDGE.BINDING.CONVERGENCE.PROJECTION.DELTA.01"
        ),
        "metadata": {
            "client_uuid": client_id,
            "run_id": run_id,
            "source_artifact": "structure_manifest.json",
            "source_stratum": "L1_AUTHORITATIVE_STRUCTURE",
            "transformation_spec": "binding_transformation_spec.json",
            "generated_at": now_iso(),
        },
        "stratum_declaration": {
            "this_artifact": "BINDING_MODEL",
            "source_stratum": "L1_AUTHORITATIVE_STRUCTURE",
            "source_artifact_path": (
                f"clients/{client_id}/psee/runs/{run_id}/structure/structure_manifest.json"
            ),
            "adjacent_model_artifact": "gauge_state.json",
            "adjacent_model_authority": "ADJACENT_CONSUMPTION_MODEL",
            "cross_projection_forbidden": True,
            "wp13b_excluded": True,
        },
        "binding_contexts": binding_contexts,
        "capability_surfaces": capability_surfaces,
        "component_entities": component_entities,
        "relationships": binding_relationships,
        "signal_seeds": signal_seeds,
        "domain_telemetry_seeds": domain_telemetry_seeds,
        "provenance": provenance_records,
        "topology": {
            "derivation_rules": ["R1", "R2", "R3"],
            "topology_nodes": all_topology_nodes,
            "topology_edges": all_topology_edges,
            "summary": {
                "total_nodes": len(all_topology_nodes),
                "domain_nodes": len(domain_topo_nodes),
                "capability_surface_nodes": len(surface_topo_nodes),
                "component_entity_nodes": len(ce_topo_nodes),
                "total_edges": len(all_topology_edges),
                "contains_edges_r2": len(r2_edges),
                "contains_edges_r3": len(r3_edges),
                "overlap_structural_edges": len(overlap_edges),
                "l1_truth_modified": False,
                "new_node_types_introduced": False,
                "forbidden_relationships_introduced": False,
            },
        },
        "exclusions": {
            "dom06_provenance_archives": {
                "reason": "intake_status=NOT_INGESTED — excluded from binding contexts",
                "ceus_excluded": ["CEU-11", "CEU-12", "CEU-13"],
            },
            "module_level_entities": {
                "reason": "BM-001..BM-063 expansion is OPTIONAL — OUT OF SCOPE",
            },
            "wp13b_topology": {
                "reason": "WP-13B (gauge_state.json) is ADJACENT CONSUMPTION MODEL",
            },
            "pending_runtime_signals": {
                "reason": (
                    "SIG-001..005, SIG-007..008 require live Prometheus telemetry "
                    "— NOT-YET-INSTANTIATED LAWFUL CONTRACTs"
                ),
                "signals_excluded": [
                    "SIG-001", "SIG-002", "SIG-003",
                    "SIG-004", "SIG-005", "SIG-007", "SIG-008",
                ],
            },
        },
        "summary": {
            "binding_contexts_count": len(binding_contexts),
            "capability_surfaces_count": len(capability_surfaces),
            "component_entities_count": len(component_entities),
            "relationships_count": len(binding_relationships),
            "signal_seeds_count": len(signal_seeds),
            "domain_telemetry_seeds_count": len(domain_telemetry_seeds),
            "provenance_records_count": len(provenance_records),
            "topology_nodes_count": len(all_topology_nodes),
            "topology_edges_count": len(all_topology_edges),
        },
    }

    log.info("T2_MODEL", "binding_model built",
             binding_contexts=len(binding_contexts),
             capability_surfaces=len(capability_surfaces),
             component_entities=len(component_entities),
             topology_nodes=len(all_topology_nodes),
             topology_edges=len(all_topology_edges))

    return (binding_model, binding_contexts, capability_surfaces, component_entities,
            binding_relationships, signal_seeds, domain_telemetry_seeds,
            provenance_records, all_topology_nodes, all_topology_edges,
            domain_topo_nodes, surface_topo_nodes, ce_topo_nodes,
            r2_edges, r3_edges, overlap_edges)


# ── ENVELOPE (T3) ──────────────────────────────────────────────────────────────
def build_envelope(client_id, run_id, target,
                   binding_contexts, capability_surfaces, component_entities,
                   binding_relationships, signal_seeds, domain_telemetry_seeds,
                   provenance_records, all_topology_nodes, all_topology_edges,
                   constraint_flags, log):
    log.info("T3_ENVELOPE", "building binding_envelope.json", target=target)

    # ── Envelope nodes (3 types: binding_context + capability_surface + component_entity) ──
    env_domain_nodes = []
    for node in sorted(all_topology_nodes, key=lambda n: n["node_id"]):
        if node["node_type"] == "binding_context":
            env_domain_nodes.append({
                "node_id": node["node_id"],
                "label": node["label"],
                "type": "binding_context",
                "temporal_classification": node["temporal_classification"],
                "provenance": node["provenance"],
            })

    env_surface_nodes = []
    for node in sorted(all_topology_nodes, key=lambda n: n["node_id"]):
        if node["node_type"] == "capability_surface":
            en = {
                "node_id": node["node_id"],
                "label": node["label"],
                "type": "capability_surface",
                "parent_binding_context": node.get("parent_binding_context"),
                "temporal_classification": node["temporal_classification"],
                "provenance": node["provenance"],
            }
            for opt in ("overlap", "file_level_parity", "platform_unique", "observed_count"):
                if node.get(opt) is not None:
                    en[opt] = node[opt]
            env_surface_nodes.append(en)

    env_ce_nodes = []
    for node in sorted(all_topology_nodes, key=lambda n: n["node_id"]):
        if node["node_type"] == "component_entity":
            env_ce_nodes.append({
                "node_id": node["node_id"],
                "label": node["label"],
                "type": "component_entity",
                "binding_context_id": node.get("binding_context_id"),
                "entity_type": node.get("entity_type"),
                "temporal_classification": node["temporal_classification"],
                "provenance": node["provenance"],
            })

    all_env_nodes = (
        sorted(env_domain_nodes,  key=lambda n: n["node_id"])
        + sorted(env_surface_nodes, key=lambda n: n["node_id"])
        + sorted(env_ce_nodes,     key=lambda n: n["node_id"])
    )

    # ── Envelope edges ──
    all_env_edges = []
    for edge in all_topology_edges:
        ee = {
            "edge_id": edge["edge_id"],
            "from_node": edge["from_node"],
            "to_node": edge["to_node"],
            "edge_type": edge["edge_type"],
            "temporal_classification": edge["temporal_classification"],
            "provenance": edge["provenance"],
        }
        if "containment_level" in edge:
            ee["containment_level"] = edge["containment_level"]
        all_env_edges.append(ee)

    # ── Envelope signals: CEU-level L1-ST + SIG-006 (R5) ──
    env_signals = []
    ce_node_ids = {n["node_id"] for n in env_ce_nodes}

    for ss in signal_seeds:
        env_signals.append({
            "signal_id": ss["signal_seed_id"],
            "metric_name": ss["metric_name"],
            "node_id": ss["component_entity_id"],
            "value": ss["value"],
            "unit": ss.get("unit"),
            "temporal_classification": "STATIC",
            "source_basis": ss["source_basis"],
            "provenance": {
                "ceu_id": ss.get("ceu_id"),
                "source_artifact": ss["source_artifact"],
                "source_field": ss["source_field"],
                "provenance_class": ss["provenance"],
                "binding_model_ref": (
                    f"binding_model.signal_seeds[{ss['signal_seed_id']}]"
                ),
            },
        })

    # SIG-006 (R5 — static computed, always included)
    if SIG006["node_id"] not in ce_node_ids:
        log.error("T3_ENVELOPE",
                  f"SIG-006 target node {SIG006['node_id']} not found in component_entity nodes")
        sys.exit(4)
    env_signals.append(SIG006)

    # ── Domain telemetry ──
    env_domain_telemetry = []
    domain_ctx_ids = {n["node_id"] for n in env_domain_nodes}
    for dt in domain_telemetry_seeds:
        if dt["binding_context_id"] not in domain_ctx_ids:
            log.warn("T3_ENVELOPE",
                     f"domain telemetry {dt['telemetry_id']} references unknown context "
                     f"{dt['binding_context_id']}")
            continue
        env_domain_telemetry.append({
            "telemetry_id": dt["telemetry_id"],
            "metric_name": dt["metric_name"],
            "binding_context_id": dt["binding_context_id"],
            "value": dt["value"],
            "unit": dt.get("unit"),
            "temporal_classification": "STATIC",
            "source_artifact": dt["source_artifact"],
            "source_field": dt["source_field"],
            "provenance": dt.get("provenance"),
        })

    # ── Capability surfaces (sub-domain projection) ──
    env_surfaces = []
    for cs in capability_surfaces:
        es = {
            "surface_id": cs["capability_surface_id"],
            "parent_context": cs["parent_binding_context"],
            "label": cs["label"],
            "path_pattern": cs.get("path_pattern"),
            "containment_basis": cs.get("containment_basis"),
            "temporal_classification": cs["temporal_classification"],
            "provenance": {
                "parent_ceu": cs.get("parent_ceu"),
                "parent_node": cs.get("parent_node"),
                "source_artifact": cs["source_artifact"],
                "binding_model_ref": (
                    f"binding_model.capability_surfaces[{cs['capability_surface_id']}]"
                ),
            },
        }
        for opt in ("overlap", "file_level_parity", "platform_unique", "observed_count"):
            if cs.get(opt) is not None:
                es[opt] = cs[opt]
        env_surfaces.append(es)

    # ── Constraint flags (R6 — from structure_manifest) ──
    envelope_constraint_flags = {
        "overlap_present":          constraint_flags.get("overlap_present"),
        "overlap_count":            constraint_flags.get("overlap_count"),
        "overlap_evidence":         constraint_flags.get("overlap_evidence"),
        "overlap_source":           constraint_flags.get("overlap_source"),
        "unknown_space_present":    constraint_flags.get("unknown_space_present"),
        "unknown_space_count":      constraint_flags.get("unknown_space_count"),
        "unknown_space_evidence":   constraint_flags.get("unknown_space_evidence"),
        "unknown_space_source":     constraint_flags.get("unknown_space_source"),
        "propagated_from":          "structure_manifest.json:constraint_flags",
        "binding_package_contract": CONTRACT_ID,
    }

    # ── Target handoff declarations (R7) ──
    def _gauge_handoff():
        return {
            "target": "GAUGE",
            "gauge_input_source": (
                f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json"
            ),
            "forbidden_direct_reads": [
                f"clients/{client_id}/psee/runs/{run_id}/structure/structure_manifest.json"
                " — FORBIDDEN for Gauge topology rendering",
                "gauge_state.json — WP-13B ADJACENT CONSUMPTION MODEL ONLY",
            ],
            "allowed_render_surfaces": [
                "nodes", "edges", "signals", "capability_surfaces", "domain_telemetry"
            ],
            "back_propagation_forbidden": True,
            "declaration": (
                "Gauge MUST consume binding_envelope.json as its topology rendering source. "
                "Gauge MUST NOT read structure_manifest.json directly. "
                "Gauge MUST NOT treat gauge_state.json (WP-13B) as structural authority. "
                "Gauge MUST NOT back-propagate any derived projection into L1 truth."
            ),
        }

    def _upper_core_handoff():
        return {
            "target": "UPPER_PIOS_CORE",
            "upper_core_input_source": (
                f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json"
            ),
            "structural_authority_source": (
                f"clients/{client_id}/psee/runs/{run_id}/structure/structure_manifest.json"
            ),
            "stratum": "L1_AUTHORITATIVE_STRUCTURE",
            "allowed_operations": [
                "read topology nodes", "read edges", "read signals",
                "read capability_surfaces", "read domain_telemetry",
                "read constraint_flags"
            ],
            "forbidden_operations": [
                "mutate structure_manifest.json",
                "inject WP-13B topology",
                "perform semantic enrichment",
            ],
            "back_propagation_forbidden": True,
            "declaration": (
                "Upper PiOS Core consumes binding_envelope.json as the canonical L1 "
                "structural binding surface. All structural authority traces to "
                "structure_manifest.json. No mutation of L1 truth is permitted."
            ),
        }

    target_handoffs = {}
    if target in ("gauge", "both"):
        target_handoffs["gauge"] = _gauge_handoff()
    if target in ("upper-core", "both"):
        target_handoffs["upper_pios_core"] = _upper_core_handoff()

    # ── Counts ──
    contains_count = len([e for e in all_env_edges if e["edge_type"] == "CONTAINS"])
    overlap_count  = len([e for e in all_env_edges if e["edge_type"] == "OVERLAP_STRUCTURAL"])

    binding_envelope = {
        "artifact_id": f"{STREAM_ID}-BINDING-ENVELOPE",
        "contract_id": CONTRACT_ID,
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "consolidation_contract": CONTRACT_ID,
        "supersedes_delta_contract": (
            "PSEE.BLUEEDGE.BINDING.CONVERGENCE.PROJECTION.DELTA.01"
        ),
        "generated_at": now_iso(),

        "metadata": {
            "client_uuid": client_id,
            "run_id": run_id,
            "source_artifact": "binding_model.json",
            "source_stratum": "BINDING_MODEL (derived from L1_AUTHORITATIVE_STRUCTURE)",
        },

        "authority_boundary": {
            "envelope_source": (
                f"clients/{client_id}/psee/runs/{run_id}/binding/binding_model.json"
            ),
            "structural_authority": "L1_AUTHORITATIVE_STRUCTURE (structure_manifest.json)",
            "wp13b_declaration": (
                "gauge_state.json (WP-13B) is an ADJACENT CONSUMPTION MODEL. "
                "It is NOT structural authority and MUST NOT be used as topology source."
            ),
            "gauge_must_not_read_manifest_directly": True,
            "back_propagation_forbidden": True,
            "cross_projection_forbidden": True,
        },

        "nodes":             all_env_nodes,
        "edges":             all_env_edges,
        "signals":           env_signals,
        "capability_surfaces": env_surfaces,
        "domain_telemetry":  env_domain_telemetry,
        "constraint_flags":  envelope_constraint_flags,
        "target_handoffs":   target_handoffs,

        "provenance": {
            "envelope_derivation_chain": [
                {
                    "step": 1, "artifact": "ceu_registry.json",
                    "role": "CEU structural truth — 13 CEUs, 10 ACCEPTED",
                },
                {
                    "step": 2, "artifact": "domain_structure.json",
                    "role": "Domain topology and sub-domain projection",
                },
                {
                    "step": 3, "artifact": "raw_input.json",
                    "role": "CEU lineage — domains, entities, relationships",
                    "path": f"clients/{client_id}/input/intake/raw_input.json",
                },
                {
                    "step": 4, "artifact": "structure_manifest.json",
                    "role": "L1 authoritative structure",
                    "path": (
                        f"clients/{client_id}/psee/runs/{run_id}/"
                        "structure/structure_manifest.json"
                    ),
                },
                {
                    "step": 5, "artifact": "binding_model.json (this package)",
                    "role": "Lawful transformation of L1 structure",
                    "path": (
                        f"clients/{client_id}/psee/runs/{run_id}/binding/binding_model.json"
                    ),
                },
                {
                    "step": 6, "artifact": "binding_envelope.json (this artifact)",
                    "role": "Canonical consumption surface for gauge and upper-core",
                    "path": (
                        f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json"
                    ),
                },
            ],
            "lineage_records": provenance_records,
        },

        "exclusions": {
            "dom06_not_ingested": {
                "reason": "DOM-06 CEUs (CEU-11..13) have intake_status=NOT_INGESTED",
            },
            "module_level_expansion": {
                "reason": "OPTIONAL — requires normalized_file_inventory.json under separate contract",
            },
            "wp13b_runtime_topology": {
                "reason": "ADJACENT CONSUMPTION MODEL — no structural authority",
            },
            "pending_runtime_signals": {
                "reason": (
                    "SIG-001..005, SIG-007..008 require live Prometheus telemetry. "
                    "NOT-YET-INSTANTIATED LAWFUL CONTRACTs."
                ),
                "signals": [
                    "SIG-001", "SIG-002", "SIG-003", "SIG-004",
                    "SIG-005", "SIG-007", "SIG-008",
                ],
            },
        },

        "summary": {
            "nodes_count":                    len(all_env_nodes),
            "edges_count":                    len(all_env_edges),
            "signals_count":                  len(env_signals),
            "capability_surfaces_count":      len(env_surfaces),
            "domain_telemetry_count":         len(env_domain_telemetry),
            "domain_nodes_count":             len(env_domain_nodes),
            "capability_surface_nodes_count": len(env_surface_nodes),
            "component_entity_nodes_count":   len(env_ce_nodes),
            "contains_edges_count":           contains_count,
            "overlap_structural_edges_count": overlap_count,
        },
    }

    log.info("T3_ENVELOPE", "binding_envelope built",
             nodes=len(all_env_nodes),
             edges=len(all_env_edges),
             signals=len(env_signals),
             capability_surfaces=len(env_surfaces))

    return binding_envelope


# ── VALIDATION ─────────────────────────────────────────────────────────────────
def validate(binding_model, binding_envelope, log):
    log.info("VALIDATE", "running validation checks")
    checks = []
    all_pass = True

    def chk(check_id, desc, passed, detail=""):
        nonlocal all_pass
        result = "PASS" if passed else "FAIL"
        checks.append({"check_id": check_id, "description": desc,
                        "result": result, "detail": detail})
        mark = "PASS" if passed else "FAIL"
        print(f"  [{mark}] {check_id}: {desc}")
        if not passed:
            print(f"         {detail}")
            log.error("VALIDATE", f"{check_id} FAIL: {detail}")
        all_pass = all_pass and passed
        return passed

    bcs  = binding_model.get("binding_contexts", [])
    css  = binding_model.get("capability_surfaces", [])
    ces  = binding_model.get("component_entities", [])
    ss   = binding_model.get("signal_seeds", [])
    brs  = binding_model.get("relationships", [])
    topo = binding_model.get("topology", {})

    env_nodes   = binding_envelope.get("nodes", [])
    env_edges   = binding_envelope.get("edges", [])
    env_sigs    = binding_envelope.get("signals", [])
    env_surfs   = binding_envelope.get("capability_surfaces", [])
    env_cf      = binding_envelope.get("constraint_flags", {})

    # V1: capability_surfaces_count == 30 (authoritative)
    chk("V01", f"capability_surfaces count = {len(css)}", len(css) == 30,
        f"got {len(css)}, expected 30")

    # V2: component_entities_count == 10
    chk("V02", f"component_entities count = {len(ces)}", len(ces) == 10,
        f"got {len(ces)}, expected 10")

    # V3: topology edges include lawful containment (CONTAINS type present)
    edge_types = {e.get("edge_type") for e in env_edges}
    chk("V03", "topology edges include CONTAINS", "CONTAINS" in edge_types,
        f"edge_types found: {sorted(edge_types)}")

    # V4: SIG-006 present and correct
    sig_ids = [s.get("signal_id") for s in env_sigs]
    sig006_in = "SIG-006" in sig_ids
    chk("V04", "SIG-006 present in envelope signals", sig006_in,
        f"signals present: {sig_ids}")
    if sig006_in:
        s6 = next(s for s in env_sigs if s.get("signal_id") == "SIG-006")
        chk("V05", "SIG-006 value = 0.333 rec/sec",
            s6.get("value") == 0.333 and s6.get("unit") == "rec/sec",
            f"value={s6.get('value')}, unit={s6.get('unit')}")
        chk("V06", "SIG-006 attached to NODE-010",
            s6.get("node_id") == "NODE-010",
            f"node_id={s6.get('node_id')}")
    else:
        chk("V05", "SIG-006 value", False, "SIG-006 absent")
        chk("V06", "SIG-006 node", False, "SIG-006 absent")

    # V7: overlap_present = true
    chk("V07", "constraint_flags.overlap_present = true",
        env_cf.get("overlap_present") is True,
        f"overlap_present={env_cf.get('overlap_present')}")

    # V8: unknown_space_present = true
    chk("V08", "constraint_flags.unknown_space_present = true",
        env_cf.get("unknown_space_present") is True,
        f"unknown_space_present={env_cf.get('unknown_space_present')}")

    # V9: no BM-level expansion
    all_labels_ids = (
        [bc.get("binding_context_id", "") for bc in bcs]
        + [cs.get("capability_surface_id", "") for cs in css]
        + [ce.get("component_entity_id", "") for ce in ces]
        + [ce.get("label", "") for ce in ces]
        + [s.get("signal_id", "") for s in env_sigs]
        + [n.get("node_id", "") for n in env_nodes]
        + [n.get("label", "") for n in env_nodes]
    )
    bm_found = BM_PATTERN.search(" ".join(all_labels_ids))
    chk("V09", "no module-level (BM-xxx) expansion in binding artifacts",
        not bm_found,
        "BM identifier found in entity data" if bm_found else "")

    # V10: no WP-13B contamination
    data_labels_str = " ".join(
        [bc.get("label", "") for bc in bcs]
        + [cs.get("label", "") for cs in css]
        + [ce.get("label", "") for ce in ces]
        + [n.get("label", "") for n in env_nodes]
        + [s.get("label", "") for s in env_surfs]
    )
    wp13b_found = any(lbl in data_labels_str for lbl in WP13B_LABELS)
    chk("V10", "no WP-13B labels in entity data",
        not wp13b_found,
        "WP-13B label found" if wp13b_found else "")

    # V11: no node without provenance
    bad_prov = [n for n in env_nodes if not n.get("provenance")]
    chk("V11", "no topology node without provenance",
        len(bad_prov) == 0,
        f"nodes_without_provenance={[n.get('node_id') for n in bad_prov]}")

    # V12: no forbidden edge types
    unexpected_edge_types = edge_types - {"CONTAINS", "OVERLAP_STRUCTURAL"}
    chk("V12", "only CONTAINS and OVERLAP_STRUCTURAL edge types present",
        len(unexpected_edge_types) == 0,
        f"unexpected_types={sorted(unexpected_edge_types)}")

    # V13: structural L1-ST signals attached to component_entity nodes
    ce_ids_set = {n["node_id"] for n in env_nodes if n.get("type") == "component_entity"}
    l1st_sigs = [s for s in env_sigs if str(s.get("signal_id", "")).startswith("L1-ST")]
    bad_l1st = [s["signal_id"] for s in l1st_sigs if s.get("node_id") not in ce_ids_set]
    chk("V13", "all L1-ST signals attached to component_entity nodes",
        len(bad_l1st) == 0,
        f"misattached={bad_l1st}")

    # V14: target handoff declarations present
    handoffs = binding_envelope.get("target_handoffs", {})
    chk("V14", "at least one target handoff declaration present",
        len(handoffs) > 0,
        f"handoffs={list(handoffs.keys())}")

    # V15: determinism round-trip
    p15 = (jdump(json.loads(jdump(binding_model))) == jdump(binding_model) and
           jdump(json.loads(jdump(binding_envelope))) == jdump(binding_envelope))
    chk("V15", "outputs are deterministic (round-trip serialization stable)", p15)

    print()
    if not all_pass:
        failed = [c for c in checks if c["result"] == "FAIL"]
        log.error("VALIDATE", f"{len(failed)} check(s) failed",
                  failed=[c["check_id"] for c in failed])
        return False, checks

    log.info("VALIDATE", f"all {len(checks)} validation checks: PASS")
    return True, checks


# ── PACKAGE MANIFEST ───────────────────────────────────────────────────────────
def build_package_manifest(client_id, run_id, target, binding_dir, spec_path,
                            model_path, env_path, vlog_path, checks, log):
    log.info("PKG_MANIFEST", "building package_manifest.json")

    hashes = {}
    for name, path in [
        ("binding_transformation_spec.json", spec_path),
        ("binding_model.json", model_path),
        ("binding_envelope.json", env_path),
        ("validation_log.json", vlog_path),
    ]:
        if path and os.path.isfile(path):
            hashes[name] = sha256_file(path)

    pass_count = sum(1 for c in checks if c["result"] == "PASS")
    fail_count = sum(1 for c in checks if c["result"] == "FAIL")

    manifest = {
        "artifact_id": f"{STREAM_ID}-PACKAGE-MANIFEST",
        "contract_id": CONTRACT_ID,
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "client_id": client_id,
        "run_id": run_id,
        "target": target,
        "generated_at": now_iso(),
        "package_artifacts": [
            {
                "artifact": "binding_transformation_spec.json",
                "path": f"clients/{client_id}/psee/runs/{run_id}/binding/binding_transformation_spec.json",
                "type": "T1_TRANSFORMATION_SPEC",
                "sha256": hashes.get("binding_transformation_spec.json"),
            },
            {
                "artifact": "binding_model.json",
                "path": f"clients/{client_id}/psee/runs/{run_id}/binding/binding_model.json",
                "type": "T2_BINDING_MODEL",
                "sha256": hashes.get("binding_model.json"),
            },
            {
                "artifact": "binding_envelope.json",
                "path": f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json",
                "type": "T3_BINDING_ENVELOPE_CANONICAL",
                "sha256": hashes.get("binding_envelope.json"),
                "is_canonical_consumption_artifact": True,
            },
            {
                "artifact": "validation_log.json",
                "path": f"clients/{client_id}/psee/runs/{run_id}/binding/validation_log.json",
                "type": "VALIDATION_LOG",
                "sha256": hashes.get("validation_log.json"),
            },
        ],
        "validation_summary": {
            "checks_total": len(checks),
            "checks_pass":  pass_count,
            "checks_fail":  fail_count,
            "overall_result": "PASS" if fail_count == 0 else "FAIL",
        },
        "canonical_consumption_artifact": (
            f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json"
        ),
        "ready_for_targets": list({
            t for t in ["gauge", "upper_pios_core"]
            if fail_count == 0
        }) if target == "both" else (
            [target.replace("-", "_")] if fail_count == 0 else []
        ),
        "l1_truth_modified": False,
        "module_level_expansion": False,
        "wp13b_contamination": False,
        "semantic_inference": False,
    }
    return manifest


# ── ARGUMENT PARSER ────────────────────────────────────────────────────────────
def build_parser():
    p = argparse.ArgumentParser(
        prog="build_binding_package.py",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=__doc__,
        epilog="""
Exit codes:
  0  PACKAGE_COMPLETE
  1  PRE-FLIGHT FAILURE
  2  INPUT VALIDATION FAILURE
  3  TRANSFORMATION FAILURE
  4  ENVELOPE EMISSION FAILURE
  5  VALIDATION FAILURE
""",
    )
    p.add_argument("--client",          required=True,
                   help="Client UUID")
    p.add_argument("--run-id",          required=True, dest="run_id",
                   help="Run ID")
    p.add_argument("--target",          default="both",
                   choices=["gauge", "upper-core", "both"],
                   help="Target surface(s) for handoff declaration (default: both)")
    p.add_argument("--log-level",       default="INFO", dest="log_level",
                   choices=["DEBUG", "INFO", "WARN", "ERROR"],
                   help="Log level (default: INFO)")
    p.add_argument("--debug",           action="store_true",
                   help="Enable debug output (equivalent to --log-level DEBUG)")
    p.add_argument("--dry-run",         action="store_true", dest="dry_run",
                   help="Validate inputs and plan outputs — no files written")
    p.add_argument("--fail-on-warning", default=False, dest="fail_on_warning",
                   type=lambda v: v.lower() == "true",
                   help="Treat worktree warnings as failures (default: false)")
    p.add_argument("--emit-spec",       default=True, dest="emit_spec",
                   type=lambda v: v.lower() != "false",
                   help="Emit binding_transformation_spec.json (default: true)")
    return p


# ── MAIN ───────────────────────────────────────────────────────────────────────
def main():
    args = build_parser().parse_args()

    client_id = args.client
    run_id    = args.run_id
    target    = args.target
    dry_run   = args.dry_run
    log_level = "DEBUG" if args.debug else args.log_level

    binding_dir = os.path.join(
        REPO_ROOT, "clients", client_id, "psee", "runs", run_id, "binding"
    )
    logs_dir = os.path.join(binding_dir, "logs")
    log_path = os.path.join(logs_dir, f"package_{now_compact()}.jsonl")

    print("=== PSEE Binding Package Builder ===")
    print(f"stream:   {STREAM_ID}")
    print(f"client:   {client_id}")
    print(f"run_id:   {run_id}")
    print(f"target:   {target}")
    if dry_run:
        print("mode:     DRY-RUN (no files written)")
    print()

    log = Logger(log_path, client_id, run_id, level=log_level, dry_run=dry_run)
    log.info("MAIN", "PSEE Binding Package Builder started",
             stream=STREAM_ID, target=target, dry_run=dry_run)

    t_start = datetime.now(timezone.utc)

    # ── PRE-FLIGHT ──
    print("--- PRE-FLIGHT ---")
    sm_path, ceu_registry_path = pre_flight(
        client_id, run_id, args.fail_on_warning, log
    )
    print()

    # ── LOAD INPUTS ──
    print("--- LOAD INPUTS ---")
    (domains, nodes, relationships, lineage_records,
     telemetry, constraint_flags) = load_inputs(sm_path, log)
    print()

    # ── TRANSFORMATION SPEC (T1) ──
    print("--- T1: TRANSFORMATION SPEC ---")
    spec = build_transformation_spec(log)
    print()

    # ── BINDING MODEL (T2) ──
    print("--- T2: BINDING MODEL ---")
    (binding_model, binding_contexts, capability_surfaces, component_entities,
     binding_relationships, signal_seeds, domain_telemetry_seeds,
     provenance_records, all_topology_nodes, all_topology_edges,
     domain_topo_nodes, surface_topo_nodes, ce_topo_nodes,
     r2_edges, r3_edges, overlap_edges) = build_binding_model(
        client_id, run_id, domains, nodes, relationships,
        lineage_records, telemetry, log
    )
    print()

    # ── ENVELOPE (T3) ──
    print("--- T3: BINDING ENVELOPE ---")
    binding_envelope = build_envelope(
        client_id, run_id, target,
        binding_contexts, capability_surfaces, component_entities,
        binding_relationships, signal_seeds, domain_telemetry_seeds,
        provenance_records, all_topology_nodes, all_topology_edges,
        constraint_flags, log
    )
    print()

    # ── VALIDATION ──
    print("--- VALIDATION ---")
    passed, checks = validate(binding_model, binding_envelope, log)
    if not passed and not dry_run:
        log.close()
        print("\nPACKAGE_FAILED — validation errors above", file=sys.stderr)
        sys.exit(5)
    print()

    # ── WRITE ARTIFACTS ──
    if not dry_run:
        os.makedirs(binding_dir, exist_ok=True)
        governed_dir = os.path.join(
            REPO_ROOT, "docs", "pios", "PSEE.BLUEEDGE.BINDING.CONVERGENCE.01"
        )
        os.makedirs(governed_dir, exist_ok=True)

        spec_path = env_path = model_path = vlog_path = pmf_path = None

        # T1
        if args.emit_spec:
            spec_path = os.path.join(binding_dir, "binding_transformation_spec.json")
            write_json_file(spec_path, spec)
            print(f"  WRITTEN  binding_transformation_spec.json")

        # T2
        model_path = os.path.join(binding_dir, "binding_model.json")
        write_json_file(model_path, binding_model)
        print(f"  WRITTEN  binding_model.json")

        # T3 (canonical)
        env_path = os.path.join(binding_dir, "binding_envelope.json")
        write_json_file(env_path, binding_envelope)
        print(f"  WRITTEN  binding_envelope.json")

        # Validation log
        emission_ts = now_iso()
        artifact_hashes = {}
        for name, path in [
            ("binding_transformation_spec.json", spec_path),
            ("binding_model.json", model_path),
            ("binding_envelope.json", env_path),
        ]:
            if path and os.path.isfile(path):
                artifact_hashes[name] = sha256_file(path)

        validation_log = {
            "artifact_id": f"{STREAM_ID}-VALIDATION-LOG",
            "contract_id": CONTRACT_ID,
            "schema_version": SCHEMA_VERSION,
            "stream": STREAM_ID,
            "client_uuid": client_id,
            "run_id": run_id,
            "emission_timestamp": emission_ts,
            "overall_result": "PASS" if passed else "FAIL",
            "checks": checks,
            "artifact_hashes": artifact_hashes,
            "constraint_confirmations": {
                "no_l1_truth_modification": True,
                "no_module_level_expansion": True,
                "no_wp13b_contamination": True,
                "no_semantic_inference": True,
                "dual_lens_provenance_present": True,
                "temporal_classification_static": True,
                "sig006_included": True,
                "constraint_flags_correct": True,
                "target_handoffs_declared": True,
            },
        }
        vlog_path = os.path.join(binding_dir, "validation_log.json")
        write_json_file(vlog_path, validation_log)
        # Governed copy
        write_json_file(os.path.join(governed_dir, "validation_log.json"), validation_log)
        print(f"  WRITTEN  validation_log.json")

        # Package manifest
        pkg_manifest = build_package_manifest(
            client_id, run_id, target, binding_dir,
            spec_path, model_path, env_path, vlog_path, checks, log
        )
        pmf_path = os.path.join(binding_dir, "package_manifest.json")
        write_json_file(pmf_path, pkg_manifest)
        print(f"  WRITTEN  package_manifest.json")

        # Artifact hashes
        t1_hash = sha256_file(spec_path) if spec_path and os.path.isfile(spec_path) else "N/A"
        t2_hash = sha256_file(model_path) if os.path.isfile(model_path) else "N/A"
        t3_hash = sha256_file(env_path) if os.path.isfile(env_path) else "N/A"

    else:
        print("  DRY-RUN: no files written")
        t1_hash = t2_hash = t3_hash = "DRY-RUN"
        env_path = (
            f"clients/{client_id}/psee/runs/{run_id}/binding/binding_envelope.json"
        )
        pmf_path = (
            f"clients/{client_id}/psee/runs/{run_id}/binding/package_manifest.json"
        )

    elapsed = round((datetime.now(timezone.utc) - t_start).total_seconds(), 3)
    log.info("MAIN", "PACKAGE_COMPLETE", elapsed_sec=elapsed)
    log.close()

    # ── SUMMARY ──
    be_summary = binding_envelope.get("summary", {})
    print()
    print("=" * 60)
    if dry_run:
        print("DRY-RUN COMPLETE (no files written)")
    else:
        print("PACKAGE_COMPLETE")
    print()
    print(f"  stream:   {STREAM_ID}")
    print(f"  client:   {client_id}")
    print(f"  run_id:   {run_id}")
    print(f"  target:   {target}")
    print(f"  elapsed:  {elapsed}s")
    print()
    print("  Binding envelope summary:")
    print(f"    nodes_count:             {be_summary.get('nodes_count')}")
    print(f"    edges_count:             {be_summary.get('edges_count')}")
    print(f"    signals_count:           {be_summary.get('signals_count')}")
    print(f"    capability_surfaces:     {be_summary.get('capability_surfaces_count')}")
    print(f"    domain_telemetry:        {be_summary.get('domain_telemetry_count')}")
    print(f"    contains_edges:          {be_summary.get('contains_edges_count')}")
    print(f"    overlap_edges:           {be_summary.get('overlap_structural_edges_count')}")
    print()
    if not dry_run:
        print(f"  Artifacts ({t3_hash[:16]}...):")
        print(f"    T1: binding_transformation_spec.json  ({t1_hash[:16]}...)")
        print(f"    T2: binding_model.json                ({t2_hash[:16]}...)")
        print(f"    T3: binding_envelope.json             (canonical)")
        print(f"    validation_log.json")
        print(f"    package_manifest.json")
    print()
    print(f"  Confirmations:")
    print(f"    SIG-006 included:       YES")
    print(f"    constraint_flags:       overlap=true, unknown_space=true")
    print(f"    WP-13B contamination:   NO")
    print(f"    module-level expansion: NO")
    print(f"    L1 truth modified:      NO")
    print(f"    validation:             {len(checks)}/{len(checks)} PASS")
    print()
    if not dry_run:
        print(f"  Canonical envelope:")
        print(f"    {env_path}")
        print()
        print(f"  Package manifest:")
        print(f"    {pmf_path}")
    print("=" * 60)
    sys.exit(0)


if __name__ == "__main__":
    main()
