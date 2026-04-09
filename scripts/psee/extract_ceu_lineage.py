#!/usr/bin/env python3
"""
extract_ceu_lineage.py
STREAM: PSEE.BLUEEDGE.CEU.LINEAGE.EXTRACTOR

Extract real CEU lineage from BlueEdge <=40.4 structural artifacts and produce
a governed raw_input.json for structure materialization by emit_structure_manifest.py.

Evidence sources (in precedence order):
  1. clients/blueedge/psee/runs/run_01_authoritative/package/coverage_state.json   (MUST)
  2. clients/blueedge/psee/runs/run_01_authoritative/package/reconstruction_state.json (MUST)
  3. docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/ceu_registry.json    (MUST — CEU list)
  4. docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/domain_structure.json (OPTIONAL)
  5. docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/structural_topology.json (OPTIONAL)

Derivation rules:
  domains      — from structural_topology.json domains (intake_status != NOT_INGESTED)
  entities     — one entity per ACCEPTED CEU; type derived from evidence_class + structural_role
  relationships — from overlap declarations in structural_topology.json ONLY
                  (no semantic inference; no invented cross-references)

Type derivation table (evidence_class + structural_role → type):
  documentation + documentation_root                               → governance
  documentation_interface + documentation_root                     → governance
  extraction_metadata + analysis_support                           → platform
  code_configuration_structural + code_tree_root                   → service
  code_configuration_structural_interface + code_tree_root         → service
  code_configuration_structural_documentation + platform_monorepo_root → platform

Fail-closed on:
  - coverage < 100
  - reconstruction != PASS
  - CEU list not found
  - any ACCEPTED CEU cannot be assigned a domain
  - any ACCEPTED CEU type cannot be derived from type table
  - any emitted relationship references unknown CEU
  - output already exists (no-overwrite)

Usage:
  python3 scripts/psee/extract_ceu_lineage.py

Reads:
  clients/blueedge/psee/runs/run_01_authoritative/package/coverage_state.json
  clients/blueedge/psee/runs/run_01_authoritative/package/reconstruction_state.json
  docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/ceu_registry.json
  docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/domain_structure.json (if exists)
  docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/structural_topology.json (if exists)

Writes:
  clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/input/intake/raw_input.json

Exit codes:
  0 = EXTRACTION_COMPLETE
  1 = FAIL_CLOSED
"""

import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
STREAM            = "PSEE.BLUEEDGE.CEU.LINEAGE.EXTRACTOR"
SCHEMA_VERSION    = "1.0"
REPO_NAME         = "k-pi-core"
REQUIRED_BRANCH   = "work/psee-runtime"

BLUEEDGE_CLIENT   = "blueedge"
BLUEEDGE_RUN_ID   = "run_01_authoritative"
TARGET_CLIENT_UUID = "1de0d815-0721-58e9-bc8d-ca83e70fa903"

TOPOLOGY_STREAM_DIR = "docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)
)))

# Type derivation table: (evidence_class, structural_role) → type
# Derived strictly from ceu_registry field values — no semantic extension
TYPE_DERIVATION_TABLE = {
    ("documentation",                          "documentation_root"):        "governance",
    ("documentation_interface",                "documentation_root"):        "governance",
    ("extraction_metadata",                    "analysis_support"):          "platform",
    ("code_configuration_structural",          "code_tree_root"):            "service",
    ("code_configuration_structural_interface","code_tree_root"):            "service",
    ("code_configuration_structural_documentation","platform_monorepo_root"):"platform",
}


# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg=""):
    print(msg)


def fail(stage, reason):
    print(f"\nFAIL-CLOSED [{stage}]", file=sys.stderr)
    print(f"  reason: {reason}", file=sys.stderr)
    sys.exit(1)


def sha256_of(obj):
    serialised = json.dumps(obj, sort_keys=True, separators=(",", ":"),
                            ensure_ascii=True)
    return hashlib.sha256(serialised.encode()).hexdigest()


def load_json(path, label, required=True):
    if not os.path.isfile(path):
        if required:
            fail("ARTIFACT_LOAD", f"required artifact not found: {label} — {path}")
        return None
    with open(path, encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            fail("ARTIFACT_LOAD", f"JSON parse error in {label}: {e}")


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight():
    log("=== PSEE BlueEdge CEU Lineage Extractor ===")
    log(f"stream:         {STREAM}")
    log(f"source_client:  {BLUEEDGE_CLIENT}")
    log(f"source_run_id:  {BLUEEDGE_RUN_ID}")
    log(f"target_client:  {TARGET_CLIENT_UUID}")
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
    log(f"  repo_root:      PASS  ({REPO_NAME})")

    # Branch
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            fail("PRE-FLIGHT", f"branch={branch!r} required={REQUIRED_BRANCH!r}")
    except FileNotFoundError:
        fail("PRE-FLIGHT", "git not found")
    log(f"  branch:         PASS  ({REQUIRED_BRANCH})")

    # Worktree clean (untracked client output files are allowed)
    try:
        r = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        lines = [l for l in r.stdout.splitlines() if l.strip()]
        allowed_prefixes = (
            f"?? clients/{TARGET_CLIENT_UUID}/",
            f"?? scripts/psee/extract_ceu_lineage.py",
        )
        dirty = [l for l in lines if not any(l.startswith(a) for a in allowed_prefixes)]
        if dirty:
            fail("PRE-FLIGHT", f"worktree not clean: {'; '.join(dirty[:3])}")
    except FileNotFoundError:
        fail("PRE-FLIGHT", "git not found")
    log(f"  worktree:       PASS  (clean)")

    # BlueEdge package path
    pkg_dir = os.path.join(
        REPO_ROOT, "clients", BLUEEDGE_CLIENT, "psee", "runs", BLUEEDGE_RUN_ID, "package"
    )
    if not os.path.isdir(pkg_dir):
        fail("PRE-FLIGHT", f"BlueEdge package not found: {pkg_dir}")
    log(f"  blueedge_pkg:   PASS")

    # Target intake path
    intake_dir = os.path.join(
        REPO_ROOT, "clients", TARGET_CLIENT_UUID, "input", "intake"
    )
    if not os.path.isdir(intake_dir):
        fail("PRE-FLIGHT", f"Target intake dir not found: {intake_dir}")
    log(f"  target_intake:  PASS")

    # No-overwrite
    output_path = os.path.join(intake_dir, "raw_input.json")
    if os.path.exists(output_path):
        fail("PRE-FLIGHT", f"output already exists (no-overwrite): {output_path}")
    log(f"  no_overwrite:   PASS  (raw_input.json not present)")

    log("PRE-FLIGHT: PASS")
    log()
    return pkg_dir, intake_dir, output_path


# ── STAGE: PACKAGE VALIDATION ─────────────────────────────────────────────────
def validate_package(pkg_dir):
    log("--- PACKAGE VALIDATION ---")

    coverage = load_json(
        os.path.join(pkg_dir, "coverage_state.json"), "coverage_state.json"
    )
    reconstruction = load_json(
        os.path.join(pkg_dir, "reconstruction_state.json"), "reconstruction_state.json"
    )

    # Coverage
    cov_pct = coverage.get("coverage_percent")
    if cov_pct is None or float(cov_pct) < 100.0:
        fail("PACKAGE_VALIDATION", f"coverage_percent={cov_pct} < 100")
    log(f"  coverage:       PASS  ({cov_pct}%)")

    # Reconstruction state
    recon_state = reconstruction.get("state")
    if recon_state != "PASS":
        fail("PACKAGE_VALIDATION", f"reconstruction_state={recon_state!r} != PASS")
    log(f"  reconstruction: PASS  ({recon_state})")

    # Reconstruction violations
    violations = reconstruction.get("violations", [])
    if violations:
        fail("PACKAGE_VALIDATION", f"reconstruction violations: {violations}")
    log(f"  violations:     PASS  (none)")

    # Reconstruction axes (if present)
    axis_results = reconstruction.get("axis_results", {})
    for axis, result in axis_results.items():
        if result != "PASS":
            fail("PACKAGE_VALIDATION",
                 f"reconstruction axis {axis}={result!r} != PASS")
    if axis_results:
        axes_str = ", ".join(f"{k}={v}" for k, v in sorted(axis_results.items()))
        log(f"  axes:           PASS  ({axes_str})")

    log("PACKAGE VALIDATION: PASS")
    log()
    return coverage, reconstruction


# ── STAGE: ARTIFACT DISCOVERY ─────────────────────────────────────────────────
def discover_artifacts():
    log("--- ARTIFACT DISCOVERY ---")

    topo_dir = os.path.join(REPO_ROOT, TOPOLOGY_STREAM_DIR)

    # ceu_registry.json — required for CEU list
    ceu_registry_path = os.path.join(topo_dir, "ceu_registry.json")
    if not os.path.isfile(ceu_registry_path):
        fail("ARTIFACT_DISCOVERY",
             f"CEU list not found: ceu_registry.json not at {ceu_registry_path}")
    log(f"  ceu_registry:       FOUND  ({TOPOLOGY_STREAM_DIR}/ceu_registry.json)")

    # domain_structure.json — optional
    domain_structure_path = os.path.join(topo_dir, "domain_structure.json")
    domain_structure_found = os.path.isfile(domain_structure_path)
    log(f"  domain_structure:   {'FOUND' if domain_structure_found else 'NOT FOUND'}  "
        f"({'optional, skipped' if not domain_structure_found else TOPOLOGY_STREAM_DIR + '/domain_structure.json'})")

    # structural_topology.json — optional
    structural_topology_path = os.path.join(topo_dir, "structural_topology.json")
    structural_topology_found = os.path.isfile(structural_topology_path)
    log(f"  structural_topology:{'FOUND' if structural_topology_found else 'NOT FOUND'}  "
        f"({'optional, skipped' if not structural_topology_found else TOPOLOGY_STREAM_DIR + '/structural_topology.json'})")

    log("ARTIFACT DISCOVERY: PASS")
    log()
    return (
        ceu_registry_path,
        domain_structure_path if domain_structure_found else None,
        structural_topology_path if structural_topology_found else None,
    )


# ── STAGE: CEU EXTRACTION ─────────────────────────────────────────────────────
def extract_ceus(ceu_registry_path):
    log("--- CEU EXTRACTION ---")

    ceu_registry = load_json(ceu_registry_path, "ceu_registry.json")

    entries = ceu_registry.get("ceu_entries", [])
    if not entries:
        fail("CEU_EXTRACTION", "ceu_entries is empty or missing in ceu_registry.json")

    # Filter to ACCEPTED only
    accepted = [e for e in entries if e.get("intake_status") == "ACCEPTED"]
    not_ingested = [e for e in entries if e.get("intake_status") == "NOT_INGESTED"]

    log(f"  total_ceus:     {len(entries)}")
    log(f"  accepted:       {len(accepted)}")
    log(f"  not_ingested:   {len(not_ingested)}  "
        f"({', '.join(e['ceu_id'] for e in not_ingested)})")

    if not accepted:
        fail("CEU_EXTRACTION", "no ACCEPTED CEUs in registry")

    log("CEU EXTRACTION: PASS")
    log()
    return accepted, ceu_registry


# ── STAGE: DOMAIN EXTRACTION ──────────────────────────────────────────────────
def extract_domains(structural_topology_path, domain_structure_path, accepted_ceus):
    log("--- DOMAIN EXTRACTION ---")

    # Determine which domains are needed by accepted CEUs
    # Primary source: structural_topology.json domains list
    # Fallback: domain_structure.json domains list
    # Fallback of fallback: build from ceu_registry ceu_members

    domain_source = None

    if structural_topology_path:
        topo = load_json(structural_topology_path, "structural_topology.json")
        raw_domains = topo.get("domains", [])
        domain_source = "structural_topology.json"
    elif domain_structure_path:
        ds = load_json(domain_structure_path, "domain_structure.json")
        raw_domains = ds.get("domains", [])
        domain_source = "domain_structure.json"
    else:
        raw_domains = []

    # Exclude NOT_INGESTED domains
    ingested_raw_domains = [
        d for d in raw_domains
        if d.get("intake_status") != "NOT_INGESTED"
    ]

    # Build domain map: domain_id → label
    domain_map = {}
    for d in ingested_raw_domains:
        d_id = d.get("domain_id")
        d_label = d.get("label")
        if d_id and d_label:
            domain_map[d_id] = d_label

    # Verify every accepted CEU can be assigned to an ingested domain
    # Build CEU → domain_id mapping from structural_topology ceu_members
    ceu_to_domain = {}
    for d in ingested_raw_domains:
        d_id = d.get("domain_id")
        for ceu_id in d.get("ceus", d.get("ceu_members", [])):
            ceu_to_domain[ceu_id] = d_id

    for ceu in accepted_ceus:
        cid = ceu["ceu_id"]
        if cid not in ceu_to_domain:
            fail("DOMAIN_EXTRACTION",
                 f"ACCEPTED CEU {cid!r} cannot be assigned a domain — "
                 f"not found in any ingested domain's ceu_members")

    log(f"  domain_source:  {domain_source or 'ceu_registry grouping'}")
    log(f"  total_raw:      {len(raw_domains)}")
    log(f"  ingested:       {len(domain_map)}  "
        f"({', '.join(sorted(domain_map.keys()))})")

    log("DOMAIN EXTRACTION: PASS")
    log()
    return domain_map, ceu_to_domain, (topo if structural_topology_path else None)


# ── STAGE: TYPE DERIVATION ────────────────────────────────────────────────────
def derive_entity_type(ceu):
    """Derive entity type from evidence_class + structural_role.

    Uses TYPE_DERIVATION_TABLE — no semantic inference allowed.
    Returns (type_string, derivation_basis) or raises ValueError.
    """
    ev_class  = ceu.get("evidence_class", "")
    str_role  = ceu.get("structural_role", "")
    key = (ev_class, str_role)
    derived = TYPE_DERIVATION_TABLE.get(key)
    if derived is None:
        raise ValueError(
            f"CEU {ceu['ceu_id']}: no type derivation for "
            f"evidence_class={ev_class!r} + structural_role={str_role!r} — "
            f"not in TYPE_DERIVATION_TABLE; cannot derive type without inference"
        )
    return derived, f"evidence_class={ev_class!r} + structural_role={str_role!r}"


# ── STAGE: RELATIONSHIP EXTRACTION ───────────────────────────────────────────
def extract_relationships(topo_data, accepted_ceu_ids):
    """Extract relationships from overlap declarations only.

    Only overlap declarations in structural_topology.json are valid
    CEU linkage evidence. No other relationships may be inferred.
    """
    log("--- RELATIONSHIP EXTRACTION ---")

    if topo_data is None:
        log("  topology:       NOT AVAILABLE — 0 relationships derived")
        log("RELATIONSHIP EXTRACTION: PASS  (0 relationships — no topology source)")
        log()
        return []

    overlaps = topo_data.get("overlaps", [])
    if not overlaps:
        log("  overlaps:       0 declared")
        log("RELATIONSHIP EXTRACTION: PASS  (0 relationships)")
        log()
        return []

    relationships = []
    for ovl in sorted(overlaps, key=lambda x: x.get("overlap_id", "")):
        ovl_id = ovl.get("overlap_id", "UNKNOWN")
        dom_a  = ovl.get("domain_a")
        dom_b  = ovl.get("domain_b")

        # Extract CEU IDs from overlap: domain_a maps to the CEU in that domain
        # and domain_b maps to the CEU in that domain/sub-domain
        # We resolve by checking which accepted CEU belongs to domain_a and domain_b
        # using the ceu_registry overlap_id / overlap_pair fields — but here we
        # derive directly from the topology overlap unit fields if available
        unit_a = ovl.get("unit_a", {})
        unit_b = ovl.get("unit_b", {})

        # Check if structural_topology.json has unit_a/unit_b (from overlap_registry embedded)
        # or just domain references
        ceu_from = unit_a.get("ceu_id") if unit_a else None
        ceu_to   = unit_b.get("ceu_id") if unit_b else None

        # If unit_* not available, derive from domain membership
        # (structural_topology overlaps reference domain_a and domain_b only)
        # In that case we must skip — no CEU-level resolution without inference
        if not ceu_from or not ceu_to:
            log(f"  {ovl_id}: SKIP — no ceu_id in overlap unit_a/unit_b; "
                f"domain-only reference cannot resolve to CEU without inference")
            continue

        # Validate both CEUs are in accepted set
        if ceu_from not in accepted_ceu_ids:
            fail("RELATIONSHIP_EXTRACTION",
                 f"{ovl_id}: from_ceu={ceu_from!r} not in accepted CEU set")
        if ceu_to not in accepted_ceu_ids:
            fail("RELATIONSHIP_EXTRACTION",
                 f"{ovl_id}: to_ceu={ceu_to!r} not in accepted CEU set")

        rel = {
            "from":  ceu_from,
            "to":    ceu_to,
            "type":  "OVERLAP_STRUCTURAL",
        }
        relationships.append(rel)
        log(f"  {ovl_id}: {ceu_from} → {ceu_to}: OVERLAP_STRUCTURAL  "
            f"(domain_a={dom_a}, domain_b={dom_b})")

    log(f"  total_relationships: {len(relationships)}")
    log("RELATIONSHIP EXTRACTION: PASS")
    log()
    return relationships


# ── STAGE: STRUCTURE ASSEMBLY ─────────────────────────────────────────────────
def assemble_structure(domain_map, ceu_to_domain, accepted_ceus, relationships):
    log("--- STRUCTURE ASSEMBLY ---")

    # Domains — sorted by domain_id
    domains = [
        {"id": d_id, "label": label}
        for d_id, label in sorted(domain_map.items())
    ]

    # Entities — one per ACCEPTED CEU, sorted by ceu_id
    entities = []
    for ceu in sorted(accepted_ceus, key=lambda x: x["ceu_id"]):
        ceu_id = ceu["ceu_id"]
        domain_id = ceu_to_domain.get(ceu_id)
        if not domain_id:
            fail("STRUCTURE_ASSEMBLY",
                 f"CEU {ceu_id!r} cannot be assigned a domain — missing lineage")

        try:
            derived_type, type_basis = derive_entity_type(ceu)
        except ValueError as e:
            fail("STRUCTURE_ASSEMBLY", str(e))

        entities.append({
            "name":   ceu_id,
            "domain": domain_id,
            "type":   derived_type,
        })
        log(f"  entity: {ceu_id:8s}  domain={domain_id}  type={derived_type}")

    # Relationships — already validated; sort by (from, to)
    rels_sorted = sorted(relationships, key=lambda r: (r["from"], r["to"]))

    log(f"  domains:       {len(domains)}")
    log(f"  entities:      {len(entities)}")
    log(f"  relationships: {len(rels_sorted)}")
    log("STRUCTURE ASSEMBLY: PASS")
    log()
    return domains, entities, rels_sorted


# ── STAGE: POST-CONDITIONS ────────────────────────────────────────────────────
def post_conditions(domains, entities, relationships):
    log("--- POST-CONDITIONS ---")

    # entity_count > 0
    if not entities:
        fail("POST-CONDITION", "entity_count == 0 — no valid entities derived")
    log(f"  entity_count > 0:   PASS  ({len(entities)})")

    # domain_count > 0
    if not domains:
        fail("POST-CONDITION", "domain_count == 0 — no valid domains derived")
    log(f"  domain_count > 0:   PASS  ({len(domains)})")

    # every entity's domain resolves to a declared domain
    domain_ids = {d["id"] for d in domains}
    for e in entities:
        if e["domain"] not in domain_ids:
            fail("POST-CONDITION",
                 f"entity {e['name']!r} domain={e['domain']!r} not in domain set")
    log(f"  entity_domains_resolve: PASS")

    # every relationship references known entities
    entity_names = {e["name"] for e in entities}
    for rel in relationships:
        if rel["from"] not in entity_names:
            fail("POST-CONDITION",
                 f"relationship from={rel['from']!r} not in entity set")
        if rel["to"] not in entity_names:
            fail("POST-CONDITION",
                 f"relationship to={rel['to']!r} not in entity set")
    log(f"  relationship_refs:      PASS  ({len(relationships)} validated)")

    # lineage: every entity traces to accepted CEU set — by construction
    log(f"  lineage:                PASS  (all entities derived from ACCEPTED CEUs)")

    log("POST-CONDITIONS: PASS")
    log()


# ── STAGE: EMIT ───────────────────────────────────────────────────────────────
def emit(output_path, domains, entities, relationships,
         coverage, reconstruction):
    log("--- EMIT ---")

    # Determinism hash over stable sorted content
    determinism_input = {
        "stream":      STREAM,
        "domain_ids":  [d["id"] for d in domains],
        "entity_names":[e["name"] for e in entities],
        "rels":        [(r["from"], r["to"], r["type"]) for r in relationships],
    }
    det_hash = sha256_of(determinism_input)

    output = {
        "__stream":               STREAM,
        "__schema_version":       SCHEMA_VERSION,
        "__source_run_id":        BLUEEDGE_RUN_ID,
        "__source_authority":     "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
        "__coverage_percent":     coverage.get("coverage_percent"),
        "__reconstruction_state": reconstruction.get("state"),
        "__determinism_hash":     det_hash,
        "domains":      domains,
        "entities":     entities,
        "relationships":relationships,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=True)

    short_path = output_path.replace(REPO_ROOT + os.sep, "")
    log(f"  WRITTEN  {short_path}")
    log(f"  domains:       {len(domains)}")
    log(f"  entities:      {len(entities)}")
    log(f"  relationships: {len(relationships)}")
    log(f"  det_hash:      {det_hash}")
    log("EMIT: PASS")
    log()
    return det_hash


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    # PRE-FLIGHT
    pkg_dir, intake_dir, output_path = preflight()

    # PACKAGE VALIDATION (MUST-READ artifacts)
    coverage, reconstruction = validate_package(pkg_dir)

    # ARTIFACT DISCOVERY (locate optional <=40.4 structural artifacts)
    ceu_registry_path, domain_structure_path, structural_topology_path \
        = discover_artifacts()

    # CEU EXTRACTION
    accepted_ceus, ceu_registry = extract_ceus(ceu_registry_path)
    accepted_ceu_ids = {c["ceu_id"] for c in accepted_ceus}

    # DOMAIN EXTRACTION
    domain_map, ceu_to_domain, topo_data \
        = extract_domains(structural_topology_path, domain_structure_path, accepted_ceus)

    # RELATIONSHIP EXTRACTION (from overlap declarations only)
    # Note: structural_topology.json overlaps reference domain-level only.
    # For CEU-level resolution we use the ceu_registry overlap fields.
    # Build augmented topo with ceu_id-level overlap data from ceu_registry.
    augmented_overlaps = []
    for ceu in accepted_ceus:
        cid = ceu["ceu_id"]
        # Check if this CEU has an overlap declaration pointing to another CEU
        ovl_id  = ceu.get("overlap_id")
        ovl_pair = ceu.get("overlap_pair")
        if ovl_id and ovl_pair:
            # overlap_pair is a sub_unit_id (e.g. CEU-10-BACKEND)
            # resolve to parent CEU: CEU-10-BACKEND → CEU-10
            # sub_unit ids follow pattern CEU-XX-SUFFIX
            parts = ovl_pair.split("-")
            # Parent CEU is CEU-XX (first two parts)
            if len(parts) >= 2:
                parent_ceu_id = f"{parts[0]}-{parts[1]}"
                if parent_ceu_id in accepted_ceu_ids and parent_ceu_id != cid:
                    augmented_overlaps.append({
                        "overlap_id": ovl_id,
                        "domain_a":   ceu_to_domain.get(cid),
                        "domain_b":   ceu_to_domain.get(parent_ceu_id),
                        "unit_a":     {"ceu_id": cid},
                        "unit_b":     {"ceu_id": parent_ceu_id},
                    })

    # Deduplicate (a → b already covers b → a for same overlap)
    seen_ovl_ids = set()
    dedup_overlaps = []
    for ovl in augmented_overlaps:
        if ovl["overlap_id"] not in seen_ovl_ids:
            dedup_overlaps.append(ovl)
            seen_ovl_ids.add(ovl["overlap_id"])

    # Build augmented topo object with resolved overlaps
    augmented_topo = {"overlaps": dedup_overlaps} if dedup_overlaps else topo_data
    relationships = extract_relationships(augmented_topo, accepted_ceu_ids)

    # STRUCTURE ASSEMBLY
    domains, entities, rels_sorted = assemble_structure(
        domain_map, ceu_to_domain, accepted_ceus, relationships
    )

    # POST-CONDITIONS
    post_conditions(domains, entities, rels_sorted)

    # EMIT
    det_hash = emit(output_path, domains, entities, rels_sorted,
                    coverage, reconstruction)

    # RETURN
    log("=" * 60)
    log("EXTRACTION_COMPLETE")
    log(f"  stream:        {STREAM}")
    log(f"  source:        {BLUEEDGE_CLIENT}/{BLUEEDGE_RUN_ID}")
    log(f"  output:        {output_path.replace(REPO_ROOT + os.sep, '')}")
    log(f"  domains:       {len(domains)}")
    log(f"  entities:      {len(entities)}")
    log(f"  relationships: {len(rels_sorted)}")
    log(f"  det_hash:      {det_hash}")
    log("=" * 60)
    sys.exit(0)


if __name__ == "__main__":
    main()
