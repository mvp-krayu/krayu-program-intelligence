#!/usr/bin/env python3
"""
emit_structure_manifest.py
STREAM: PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4

Derive and emit structure_manifest.json from UUID client intake evidence.

SOURCE OF TRUTH: CEU lineage in raw_input.json (input-scope scan).
FORBIDDEN: inference, synthesis, heuristics, hardcoded structure.

Fail-closed on:
  - intake_mode != AUTHORITATIVE_INTAKE
  - rejected = true
  - coverage_percent < 100
  - reconstruction_state != PASS
  - any reconstruction violations
  - unknown_space_present == true
  - CEU lineage missing (no raw_input.json or no structural keys)
  - post-condition: node_count == 0
  - output already exists (no-overwrite)

Entry point:
  emit_structure_manifest.py --client <client_uuid> --run <run_id>

Reads:
  clients/<uuid>/runs/<run_id>/intake/intake_result.json    (MUST)
  clients/<uuid>/runs/<run_id>/package/coverage_state.json  (MUST)
  clients/<uuid>/runs/<run_id>/package/reconstruction_state.json (MUST)
  clients/<uuid>/runs/<run_id>/package/engine_state.json    (MUST)
  clients/<uuid>/runs/<run_id>/package/gauge_state.json     (MUST)
  clients/<uuid>/input/raw_input.json                       (CEU lineage source)
  clients/<uuid>/input/authoritative_state.json             (OPTIONAL — constraint flags)

Writes:
  clients/<uuid>/psee/runs/<run_id>/structure/structure_manifest.json

Exit codes:
  0 = EMISSION_COMPLETE
  1 = FAIL_CLOSED (any validation failure)
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
STREAM           = "PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4"
SCHEMA_VERSION   = "1.0"
REPO_NAME        = "k-pi-core"
REQUIRED_BRANCH  = "work/psee-runtime"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)
)))


# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg=""):
    print(msg)


def fail(stage, reason):
    print(f"\nFAIL-CLOSED [{stage}]", file=sys.stderr)
    print(f"  reason: {reason}", file=sys.stderr)
    sys.exit(1)


def sha256_of(obj):
    """Deterministic SHA256 over a JSON-serialisable object."""
    serialised = json.dumps(obj, sort_keys=True, separators=(",", ":"),
                            ensure_ascii=True)
    return hashlib.sha256(serialised.encode()).hexdigest()


def load_json(path, label):
    if not os.path.isfile(path):
        fail("ARTIFACT_LOAD", f"required artifact missing: {label} — {path}")
    with open(path, encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            fail("ARTIFACT_LOAD", f"JSON parse error in {label}: {e}")


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight(client_uuid, run_id):
    log("=== PSEE Structure Manifest Emitter ===")
    log(f"stream:      {STREAM}")
    log(f"client_uuid: {client_uuid}")
    log(f"run_id:      {run_id}")
    log()
    log("--- PRE-FLIGHT ---")

    # Repo identity
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        if r.returncode != 0:
            fail("PRE-FLIGHT", "not a git repository")
        actual = os.path.basename(r.stdout.strip())
        if actual != REPO_NAME:
            fail("PRE-FLIGHT", f"repo={actual!r} expected={REPO_NAME!r}")
    except FileNotFoundError:
        fail("PRE-FLIGHT", "git not found")

    log(f"  repo_root:    PASS  ({REPO_NAME})")

    # Branch
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            fail("PRE-FLIGHT",
                 f"branch={branch!r} required={REQUIRED_BRANCH!r}")
    except FileNotFoundError:
        fail("PRE-FLIGHT", "git not found")

    log(f"  branch:       PASS  ({REQUIRED_BRANCH})")

    # Worktree — allow untracked files under client scope and script itself
    try:
        r = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        lines = [l for l in r.stdout.splitlines() if l.strip()]
        allowed = (
            f"?? clients/{client_uuid}/",
            f"?? scripts/psee/emit_structure_manifest.py",
        )
        dirty = [l for l in lines if not any(l.startswith(a) for a in allowed)]
        if dirty:
            fail("PRE-FLIGHT",
                 f"worktree not clean: {'; '.join(dirty[:3])}")
    except FileNotFoundError:
        fail("PRE-FLIGHT", "git not found")

    log(f"  worktree:     PASS  (clean)")

    # UUID path
    client_base = os.path.join(REPO_ROOT, "clients", client_uuid)
    if not os.path.isdir(client_base):
        fail("PRE-FLIGHT", f"UUID path not found: clients/{client_uuid}/")
    log(f"  uuid_path:    PASS")

    # Run path
    run_base = os.path.join(client_base, "runs", run_id)
    if not os.path.isdir(run_base):
        fail("PRE-FLIGHT",
             f"run directory not found: clients/{client_uuid}/runs/{run_id}/")
    log(f"  run_path:     PASS")

    # Intake exists
    intake_path = os.path.join(run_base, "intake", "intake_result.json")
    if not os.path.isfile(intake_path):
        fail("PRE-FLIGHT",
             f"intake not found: clients/{client_uuid}/runs/{run_id}/intake/intake_result.json")
    log(f"  intake:       PASS")

    # Package exists
    package_dir = os.path.join(run_base, "package")
    if not os.path.isdir(package_dir):
        fail("PRE-FLIGHT",
             f"package not found: clients/{client_uuid}/runs/{run_id}/package/")
    log(f"  package:      PASS")

    log("PRE-FLIGHT: PASS")
    log()
    return client_base, run_base, package_dir


# ── FAIL-CLOSED VALIDATION ────────────────────────────────────────────────────
def fail_closed_validation(client_uuid, run_id, run_base, package_dir):
    log("--- FAIL-CLOSED VALIDATION ---")

    # Load all MUST-READ artifacts
    intake_result       = load_json(
        os.path.join(run_base, "intake", "intake_result.json"),
        "intake_result.json"
    )
    coverage_state      = load_json(
        os.path.join(package_dir, "coverage_state.json"),
        "coverage_state.json"
    )
    reconstruction_state = load_json(
        os.path.join(package_dir, "reconstruction_state.json"),
        "reconstruction_state.json"
    )
    engine_state        = load_json(
        os.path.join(package_dir, "engine_state.json"),
        "engine_state.json"
    )
    gauge_state         = load_json(
        os.path.join(package_dir, "gauge_state.json"),
        "gauge_state.json"
    )

    # 1. intake_mode
    intake_mode = intake_result.get("intake_mode")
    if intake_mode != "AUTHORITATIVE_INTAKE":
        fail("VALIDATION", f"intake_mode={intake_mode!r} != AUTHORITATIVE_INTAKE")
    log(f"  intake_mode:        PASS  ({intake_mode})")

    # 2. rejected
    if intake_result.get("rejected") is True:
        fail("VALIDATION", "intake rejected=true")
    log(f"  rejected:           PASS  (false)")

    # 3. coverage_percent
    cov_pct = coverage_state.get("coverage_percent")
    if cov_pct is None or float(cov_pct) < 100.0:
        fail("VALIDATION", f"coverage_percent={cov_pct} < 100")
    log(f"  coverage_percent:   PASS  ({cov_pct}%)")

    # 4. reconstruction_state
    recon_state = reconstruction_state.get("state")
    if recon_state != "PASS":
        fail("VALIDATION", f"reconstruction_state={recon_state!r} != PASS")
    log(f"  reconstruction:     PASS  ({recon_state})")

    # 5. violations (axis check)
    violations = reconstruction_state.get("violations", [])
    if violations:
        fail("VALIDATION",
             f"reconstruction violations present: {violations}")
    log(f"  axis_violations:    PASS  (none)")

    # 6. unknown_space_present
    dim4 = gauge_state.get("dimensions", {}).get("DIM-04", {})
    unk_count = dim4.get("total_count", 0)
    if unk_count > 0:
        fail("VALIDATION",
             f"unknown_space_present=true: DIM-04 total_count={unk_count}")
    log(f"  unknown_space:      PASS  (DIM-04 count={unk_count})")

    log("FAIL-CLOSED VALIDATION: PASS")
    log()

    # Derive constraint flags from structural_topology.json (authoritative source)
    _st_path = os.path.join(
        REPO_ROOT,
        "docs", "pios",
        "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
        "structural_topology.json",
    )
    _overlap_present       = False
    _unknown_space_present = False
    _overlap_evidence      = []
    _unknown_space_evidence = []
    if os.path.isfile(_st_path):
        _st = load_json(_st_path, "structural_topology.json")
        _overlaps     = _st.get("overlaps", [])
        _unknown_space = _st.get("unknown_space", [])
        _overlap_present       = len(_overlaps) > 0
        _unknown_space_present = len(_unknown_space) > 0
        _overlap_evidence = [
            f"{o['overlap_id']} ({o.get('domain_a','')}↔{o.get('domain_b','')})"
            for o in _overlaps
        ]
        _unknown_space_evidence = [
            f"{u['usp_id']} ({u.get('description','')})"
            for u in _unknown_space
        ]
        log(f"  structural_topology: LOADED  "
            f"(overlaps={len(_overlaps)}, unknown_space={len(_unknown_space)})")
    else:
        log(f"  structural_topology: NOT FOUND  (constraint flags default to false)")

    return {
        "overlap_present":        _overlap_present,
        "overlap_count":          len(_overlap_evidence),
        "overlap_evidence":       _overlap_evidence,
        "overlap_source":         "structural_topology.json:overlaps",
        "unknown_space_present":  _unknown_space_present,
        "unknown_space_count":    len(_unknown_space_evidence),
        "unknown_space_evidence": _unknown_space_evidence,
        "unknown_space_source":   "structural_topology.json:unknown_space",
    }


# ── CEU LINEAGE SCAN ──────────────────────────────────────────────────────────
def scan_ceu_lineage(client_uuid, client_base):
    """Scan for raw_input.json carrying explicit structural CEU declarations.

    CEU source must provide:
      - domains:       non-empty list of objects with 'id' and 'label'
      - entities:      non-empty list of objects with 'name', 'domain', 'type'
      - relationships: non-empty list of objects with 'from', 'to', 'type'

    Resolution order (first found wins):
      1. input/intake/raw_input.json  — extractor output (PSEE.BLUEEDGE.CEU.LINEAGE.EXTRACTOR)
      2. input/raw_input.json         — legacy WP-13B construction source

    FORBIDDEN: inferring structure from metrics (VAR_AT/DT/ST),
               inventing domains, guessing entity names.
    """
    log("--- CEU LINEAGE SCAN ---")

    # Resolution order: prefer extractor output in intake scope
    candidates = [
        (os.path.join(client_base, "input", "intake", "raw_input.json"),
         "input/intake/raw_input.json  [extractor output]"),
        (os.path.join(client_base, "input", "raw_input.json"),
         "input/raw_input.json         [legacy source]"),
    ]

    raw_input_path = None
    resolved_label = None
    for path, label in candidates:
        if os.path.isfile(path):
            raw_input_path = path
            resolved_label = label
            break

    if raw_input_path is None:
        fail("CEU_LINEAGE",
             f"CEU lineage missing: raw_input.json not found at either "
             f"input/intake/raw_input.json or input/raw_input.json")

    raw = load_json(raw_input_path, "raw_input.json")
    log(f"  source:             {resolved_label}")

    # Validate required structural keys
    domains_raw       = raw.get("domains", [])
    entities_raw      = raw.get("entities", [])
    relationships_raw = raw.get("relationships", [])

    if not domains_raw:
        fail("CEU_LINEAGE",
             "CEU lineage missing: raw_input.json has no domains")
    if not entities_raw:
        fail("CEU_LINEAGE",
             "CEU lineage missing: raw_input.json has no entities")

    # Validate domain schema: each entry must have 'id' and 'label'
    for i, d in enumerate(domains_raw):
        if not isinstance(d, dict) or not d.get("id") or not d.get("label"):
            fail("CEU_LINEAGE",
                 f"domains[{i}] missing required fields 'id' and/or 'label': {d!r}")

    # Validate entity schema: each entry must have 'name', 'domain', 'type'
    domain_ids = {d["id"] for d in domains_raw}
    for i, e in enumerate(entities_raw):
        if not isinstance(e, dict):
            fail("CEU_LINEAGE", f"entities[{i}] is not an object")
        for field in ("name", "domain", "type"):
            if not e.get(field):
                fail("CEU_LINEAGE",
                     f"entities[{i}] missing required field {field!r}: {e!r}")
        if e["domain"] not in domain_ids:
            fail("CEU_LINEAGE",
                 f"entities[{i}].domain={e['domain']!r} not declared in domains")

    # Validate relationship schema: each entry must have 'from', 'to', 'type'
    entity_names = {e["name"] for e in entities_raw}
    for i, r in enumerate(relationships_raw):
        if not isinstance(r, dict):
            fail("CEU_LINEAGE", f"relationships[{i}] is not an object")
        for field in ("from", "to", "type"):
            if not r.get(field):
                fail("CEU_LINEAGE",
                     f"relationships[{i}] missing required field {field!r}: {r!r}")
        if r["from"] not in entity_names:
            fail("CEU_LINEAGE",
                 f"relationships[{i}].from={r['from']!r} not in entity names")
        if r["to"] not in entity_names:
            fail("CEU_LINEAGE",
                 f"relationships[{i}].to={r['to']!r} not in entity names")

    log(f"  domains:            {len(domains_raw)}")
    log(f"  entities:           {len(entities_raw)}")
    log(f"  relationships:      {len(relationships_raw)}")
    log("CEU LINEAGE SCAN: PASS")
    log()
    return domains_raw, entities_raw, relationships_raw


# ── STRUCTURE DERIVATION ──────────────────────────────────────────────────────
def derive_structure(client_uuid, run_id, domains_raw, entities_raw,
                     relationships_raw, constraint_flags):
    """Derive governed structure objects from CEU lineage.

    Rules:
      domains      — direct from raw_input domains array
      nodes        — one node per entity (CEU); stable ID by alphabetical sort
      components   — cohesive CEU clusters by domain membership
      capabilities — behavioral groupings by entity type (Stratum 3)
      relationships — explicit CEU cross-references from raw_input
      lineage      — traceability record per node
    """
    log("--- STRUCTURE DERIVATION ---")

    # ── DOMAIN_STRUCTURE.JSON — optional sub_domain source ────────────────────
    _ds_path = os.path.join(
        REPO_ROOT,
        "docs", "pios",
        "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
        "domain_structure.json",
    )
    _sub_domain_map: dict = {}
    if os.path.isfile(_ds_path):
        _ds = load_json(_ds_path, "domain_structure.json")
        for _d in _ds.get("domains", []):
            _did = _d.get("domain_id")
            _sds = _d.get("sub_domains") or []
            if _did and _sds:
                _sub_domain_map[_did] = _sds
        log(f"  domain_structure:   LOADED  ({len(_sub_domain_map)} domains with sub_domains)")
    else:
        log(f"  domain_structure:   NOT FOUND  (sub_domains will be empty)")

    # ── DOMAINS ───────────────────────────────────────────────────────────────
    domains = []
    for d in sorted(domains_raw, key=lambda x: x["id"]):
        domain_obj = {
            "domain_id":    d["id"],
            "label":        d["label"],
            "source":       "raw_input.json:domains",
        }
        sds = _sub_domain_map.get(d["id"])
        if sds:
            domain_obj["sub_domains"] = sds
        domains.append(domain_obj)

    # ── NODES (one per entity, stable alphabetical ordering) ──────────────────
    entity_name_to_node_id = {}
    nodes = []
    for i, entity in enumerate(
        sorted(entities_raw, key=lambda x: x["name"]), start=1
    ):
        node_id = f"NODE-{i:03d}"
        entity_name_to_node_id[entity["name"]] = node_id
        nodes.append({
            "node_id":      node_id,
            "label":        entity["name"],
            "domain_id":    entity["domain"],
            "entity_type":  entity["type"],
            "source":       "raw_input.json:entities",
        })

    log(f"  nodes:              {len(nodes)}")

    # ── COMPONENTS (cohesive CEU clusters by domain) ──────────────────────────
    domain_entity_map: dict[str, list[str]] = {}
    for entity in entities_raw:
        domain_entity_map.setdefault(entity["domain"], []).append(entity["name"])

    components = []
    for domain in sorted(domains_raw, key=lambda x: x["id"]):
        d_id = domain["id"]
        members = sorted(domain_entity_map.get(d_id, []))
        member_node_ids = [
            entity_name_to_node_id[m] for m in members
            if m in entity_name_to_node_id
        ]
        components.append({
            "component_id":  f"COMP-{d_id}",
            "domain_id":     d_id,
            "member_nodes":  member_node_ids,
            "source":        "raw_input.json:entities[domain grouping]",
        })

    log(f"  components:         {len(components)}")

    # ── CAPABILITIES (behavioral linkage by entity type — Stratum 3) ──────────
    type_nodes: dict[str, list[str]] = {}
    for entity in entities_raw:
        etype = entity["type"]
        nid   = entity_name_to_node_id[entity["name"]]
        type_nodes.setdefault(etype, []).append(nid)

    capabilities = []
    for etype in sorted(type_nodes):
        capabilities.append({
            "capability_id":   f"CAP-{etype.upper()}",
            "behavioral_type": etype,
            "stratum":         "Stratum 3",
            "bearing_nodes":   sorted(type_nodes[etype]),
            "source":          "raw_input.json:entities[type]",
        })

    log(f"  capabilities:       {len(capabilities)}")

    # ── RELATIONSHIPS (explicit CEU cross-references) ─────────────────────────
    relationships = []
    for i, rel in enumerate(
        sorted(relationships_raw, key=lambda x: (x["from"], x["to"])), start=1
    ):
        relationships.append({
            "relationship_id":   f"REL-{i:03d}",
            "from_node":         entity_name_to_node_id[rel["from"]],
            "to_node":           entity_name_to_node_id[rel["to"]],
            "relationship_type": rel["type"],
            "from_entity":       rel["from"],
            "to_entity":         rel["to"],
            "source":            "raw_input.json:relationships",
        })

    log(f"  relationships:      {len(relationships)}")

    # ── LINEAGE (traceability per node) ───────────────────────────────────────
    lineage = [
        {
            "node_id":            node["node_id"],
            "source_artifact":    "raw_input.json",
            "source_field":       "entities",
            "source_entity_label": node["label"],
            "domain_id":          node["domain_id"],
            "client_uuid":        client_uuid,
            "run_id":             run_id,
        }
        for node in nodes
    ]

    # ── DETERMINISM HASH ──────────────────────────────────────────────────────
    determinism_input = {
        "client_uuid":    client_uuid,
        "run_id":         run_id,
        "domain_ids":     [d["domain_id"] for d in domains],
        "node_ids":       [n["node_id"] for n in nodes],
        "node_labels":    [n["label"] for n in nodes],
        "rel_ids":        [r["relationship_id"] for r in relationships],
        "rel_types":      [(r["from_entity"], r["to_entity"], r["relationship_type"])
                           for r in relationships],
    }
    determinism_hash = sha256_of(determinism_input)

    log(f"  determinism_hash:   {determinism_hash[:16]}...")
    log("STRUCTURE DERIVATION: PASS")
    log()

    return {
        "stream":            STREAM,
        "schema_version":    SCHEMA_VERSION,
        "client_uuid":       client_uuid,
        "run_id":            run_id,
        "stratum":           "L1_AUTHORITATIVE_STRUCTURE",
        "stratum_boundary":  {"cross_projection_forbidden": True},
        "source_artifact":   "raw_input.json",
        "source_field":      "domains + entities + relationships",
        "domains":           domains,
        "components":        components,
        "capabilities":      capabilities,
        "nodes":             nodes,
        "relationships":     relationships,
        "lineage":           lineage,
        "constraint_flags":  constraint_flags,
        "determinism_hash":  determinism_hash,
    }


# ── POST-CONDITIONS ───────────────────────────────────────────────────────────
def post_conditions(manifest):
    log("--- POST-CONDITIONS ---")

    node_count = len(manifest["nodes"])
    if node_count == 0:
        fail("POST-CONDITION", "node_count == 0 — empty topology not allowed")
    log(f"  node_count > 0:     PASS  ({node_count})")

    # Every node must appear in lineage
    node_ids_in_manifest = {n["node_id"] for n in manifest["nodes"]}
    node_ids_in_lineage  = {l["node_id"] for l in manifest["lineage"]}
    missing_lineage = node_ids_in_manifest - node_ids_in_lineage
    if missing_lineage:
        fail("POST-CONDITION",
             f"nodes missing lineage records: {sorted(missing_lineage)}")
    log(f"  every_node_lineage: PASS  ({len(node_ids_in_lineage)} records)")

    # Every relationship references nodes in the manifest
    node_id_set = node_ids_in_manifest
    for rel in manifest["relationships"]:
        if rel["from_node"] not in node_id_set:
            fail("POST-CONDITION",
                 f"relationship {rel['relationship_id']} from_node={rel['from_node']!r} "
                 f"not in node set")
        if rel["to_node"] not in node_id_set:
            fail("POST-CONDITION",
                 f"relationship {rel['relationship_id']} to_node={rel['to_node']!r} "
                 f"not in node set")
    log(f"  relationships_traceable: PASS  ({len(manifest['relationships'])} traced)")

    # Constraint flags present
    cf = manifest.get("constraint_flags", {})
    if "overlap_present" not in cf or "unknown_space_present" not in cf:
        fail("POST-CONDITION",
             "constraint_flags missing required keys")
    log(f"  constraint_flags:   PASS  (overlap={cf['overlap_present']}, "
        f"unknown={cf['unknown_space_present']})")

    log("POST-CONDITIONS: PASS")
    log()


# ── EMIT ──────────────────────────────────────────────────────────────────────
def emit(client_uuid, run_id, manifest):
    log("--- EMIT ---")

    output_dir  = os.path.join(
        REPO_ROOT, "clients", client_uuid, "psee", "runs", run_id, "structure"
    )
    output_path = os.path.join(output_dir, "structure_manifest.json")

    # No-overwrite
    if os.path.exists(output_path):
        fail("EMIT",
             f"output already exists (no-overwrite): {output_path}")

    os.makedirs(output_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=True)

    log(f"  WRITTEN  clients/{client_uuid}/psee/runs/{run_id}/structure/"
        f"structure_manifest.json")
    log(f"  domains:            {len(manifest['domains'])}")
    log(f"  components:         {len(manifest['components'])}")
    log(f"  capabilities:       {len(manifest['capabilities'])}")
    log(f"  nodes:              {len(manifest['nodes'])}")
    log(f"  relationships:      {len(manifest['relationships'])}")
    log(f"  determinism_hash:   {manifest['determinism_hash']}")
    log("EMIT: PASS")
    log()
    return output_path


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PSEE Structure Manifest Emitter — "
                    "PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4"
    )
    parser.add_argument("--client", required=True, help="Client UUID")
    parser.add_argument("--run",    required=True, help="Run ID")
    args = parser.parse_args()

    client_uuid = args.client
    run_id      = args.run

    # PRE-FLIGHT
    client_base, run_base, package_dir = preflight(client_uuid, run_id)

    # FAIL-CLOSED VALIDATION (loads all MUST-READ artifacts)
    constraint_flags = fail_closed_validation(
        client_uuid, run_id, run_base, package_dir
    )

    # CEU LINEAGE SCAN
    domains_raw, entities_raw, relationships_raw = scan_ceu_lineage(
        client_uuid, client_base
    )

    # STRUCTURE DERIVATION
    manifest = derive_structure(
        client_uuid, run_id,
        domains_raw, entities_raw, relationships_raw,
        constraint_flags
    )

    # POST-CONDITIONS
    post_conditions(manifest)

    # EMIT
    output_path = emit(client_uuid, run_id, manifest)

    # RETURN
    log("=" * 56)
    log("EMISSION_COMPLETE")
    log(f"  stream:      {STREAM}")
    log(f"  client_uuid: {client_uuid}")
    log(f"  run_id:      {run_id}")
    log(f"  node_count:  {len(manifest['nodes'])}")
    log(f"  output:      {output_path}")
    log("=" * 56)
    sys.exit(0)


if __name__ == "__main__":
    main()
