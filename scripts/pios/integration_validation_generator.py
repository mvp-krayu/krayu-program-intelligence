#!/usr/bin/env python3
"""
integration_validation_generator.py
Contract: PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01

Generic deterministic integration validation generator. Consumes upstream pipeline
outputs and produces integration_validation.json asserting cross-artifact consistency.

Reads:   clients/<client_id>/psee/runs/<run_id>/intake/intake_manifest.json
         clients/<client_id>/psee/runs/<run_id>/intake/source_inventory.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.2/structural_node_inventory.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.3/structural_topology_log.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
         clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json
         clients/<client_id>/psee/runs/<run_id>/dom/dom_layer.json
         clients/<client_id>/psee/runs/<run_id>/binding/binding_envelope.json

Writes:  clients/<client_id>/psee/runs/<run_id>/integration/integration_validation.json

Updates: clients/<client_id>/sources/<source_id>/source_manifest.json
           → adds integration_validation_path field if absent

Usage:
    python3 scripts/pios/integration_validation_generator.py \\
        --client fastapi \\
        --source source_01 \\
        --run-id run_02_oss_fastapi_pipeline

    --dry-run        Compute all results, log what would be written; no files written
    --validate-only  Check inputs only; no validation computation or writing

RULE: Deterministic — same inputs → same output.
RULE: No semantic inference. Structural and schema checks only.
RULE: CREATE_ONLY — abort if integration_validation.json already exists (in write mode).
RULE: Manifest update adds integration_validation_path only if field is absent.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01"


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic integration validation generator")
    p.add_argument("--client",        required=True)
    p.add_argument("--source",        required=True)
    p.add_argument("--run-id",        required=True)
    p.add_argument("--dry-run",       action="store_true")
    p.add_argument("--validate-only", action="store_true")
    return p.parse_args()


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict, dry_run: bool) -> None:
    if dry_run:
        print(f"  [DRY-RUN] Would write: {path.relative_to(REPO_ROOT)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"  [WROTE]   {path.relative_to(REPO_ROOT)}")


def fail_closed(msg: str) -> None:
    print(f"\nFAIL-CLOSED: {msg}")
    sys.exit(1)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ── Check helpers ──────────────────────────────────────────────────────────────

def make_check(check_id: str, name: str, status: str, evidence: list, notes: str) -> dict:
    return {
        "check_id": check_id,
        "name":     name,
        "status":   status,
        "evidence": evidence,
        "notes":    notes,
    }


def check_exists(check_id: str, name: str, path: Path, label: str) -> dict:
    if path.exists():
        return make_check(check_id, name, "PASS",
                          [str(path.relative_to(REPO_ROOT))],
                          f"{label} present")
    return make_check(check_id, name, "FAIL",
                      [str(path.relative_to(REPO_ROOT))],
                      f"{label} not found")


# ── Checks ─────────────────────────────────────────────────────────────────────

def run_checks(run_dir: Path, client_id: str) -> list:
    checks = []

    intake_manifest_path  = run_dir / "intake" / "intake_manifest.json"
    source_inventory_path = run_dir / "intake" / "source_inventory.json"
    node_inv_path         = run_dir / "structure" / "40.2" / "structural_node_inventory.json"
    topology_log_path     = run_dir / "structure" / "40.3" / "structural_topology_log.json"
    canon_topology_path   = run_dir / "structure" / "40.4" / "canonical_topology.json"
    grounding_path        = run_dir / "ceu" / "grounding_state_v3.json"
    dom_path              = run_dir / "dom" / "dom_layer.json"
    envelope_path         = run_dir / "binding" / "binding_envelope.json"

    # ── Checks 1–8: Existence ──────────────────────────────────────────────────

    checks.append(check_exists(
        "IV-01", "intake_manifest_exists", intake_manifest_path, "intake/intake_manifest.json"))
    checks.append(check_exists(
        "IV-02", "source_inventory_exists", source_inventory_path, "intake/source_inventory.json"))
    checks.append(check_exists(
        "IV-03", "structural_node_inventory_exists", node_inv_path,
        "structure/40.2/structural_node_inventory.json"))
    checks.append(check_exists(
        "IV-04", "structural_topology_log_exists", topology_log_path,
        "structure/40.3/structural_topology_log.json"))
    checks.append(check_exists(
        "IV-05", "canonical_topology_exists", canon_topology_path,
        "structure/40.4/canonical_topology.json"))
    checks.append(check_exists(
        "IV-06", "grounding_state_exists", grounding_path, "ceu/grounding_state_v3.json"))
    checks.append(check_exists(
        "IV-07", "dom_layer_exists", dom_path, "dom/dom_layer.json"))
    checks.append(check_exists(
        "IV-08", "binding_envelope_exists", envelope_path, "binding/binding_envelope.json"))

    # ── Check 9: Node count consistency ───────────────────────────────────────

    if node_inv_path.exists() and dom_path.exists():
        ni  = load_json(node_inv_path)
        dom = load_json(dom_path)
        ni_count  = len(ni.get("nodes", []))
        dom_count = dom.get("total_nodes", -1)
        if ni_count == dom_count:
            checks.append(make_check(
                "IV-09", "node_count_consistency", "PASS",
                [f"structural_node_inventory: {ni_count} nodes",
                 f"dom_layer total_nodes: {dom_count}"],
                f"Node counts match: {ni_count}"))
        else:
            checks.append(make_check(
                "IV-09", "node_count_consistency", "FAIL",
                [f"structural_node_inventory: {ni_count} nodes",
                 f"dom_layer total_nodes: {dom_count}"],
                f"Node count mismatch: {ni_count} vs {dom_count}"))
    else:
        checks.append(make_check(
            "IV-09", "node_count_consistency", "FAIL", [],
            "Cannot run: structural_node_inventory.json or dom_layer.json missing"))

    # ── Check 10: CEU count consistency ───────────────────────────────────────

    if grounding_path.exists() and envelope_path.exists():
        gs = load_json(grounding_path)
        be = load_json(envelope_path)
        gs_ceu_count = gs.get("total_ceu", -1)
        be_ce_count  = be.get("summary", {}).get("component_entity_count", -1)
        if gs_ceu_count == be_ce_count:
            checks.append(make_check(
                "IV-10", "ceu_count_consistency", "PASS",
                [f"grounding_state total_ceu: {gs_ceu_count}",
                 f"binding_envelope component_entity_count: {be_ce_count}"],
                f"CEU counts match: {gs_ceu_count}"))
        else:
            checks.append(make_check(
                "IV-10", "ceu_count_consistency", "FAIL",
                [f"grounding_state total_ceu: {gs_ceu_count}",
                 f"binding_envelope component_entity_count: {be_ce_count}"],
                f"CEU count mismatch: {gs_ceu_count} vs {be_ce_count}"))
    else:
        checks.append(make_check(
            "IV-10", "ceu_count_consistency", "FAIL", [],
            "Cannot run: grounding_state_v3.json or binding_envelope.json missing"))

    # ── Check 11: DOM node coverage ───────────────────────────────────────────

    if node_inv_path.exists() and dom_path.exists():
        ni  = load_json(node_inv_path)
        dom = load_json(dom_path)
        all_node_ids   = {n["node_id"] for n in ni.get("nodes", [])}
        mapped_node_ids = set(dom.get("node_to_domain_map", {}).keys())
        uncovered = all_node_ids - mapped_node_ids
        if not uncovered:
            checks.append(make_check(
                "IV-11", "dom_node_coverage", "PASS",
                [f"{len(all_node_ids)} nodes in inventory",
                 f"{len(mapped_node_ids)} nodes in dom_layer node_to_domain_map"],
                f"All {len(all_node_ids)} structural nodes covered by DOM layer"))
        else:
            checks.append(make_check(
                "IV-11", "dom_node_coverage", "FAIL",
                [f"{len(uncovered)} nodes not in dom_layer: {sorted(uncovered)[:5]}..."],
                f"{len(uncovered)} structural nodes have no DOM domain assignment"))
    else:
        checks.append(make_check(
            "IV-11", "dom_node_coverage", "FAIL", [],
            "Cannot run: structural_node_inventory.json or dom_layer.json missing"))

    # ── Check 12: No BlueEdge contamination in generic pipeline artifacts ──────

    be_contaminated = False
    contamination_evidence = []

    if envelope_path.exists():
        be = load_json(envelope_path)
        be_alias = be.get("client_alias", "")
        # artifact_id is an orchestrator-internal constant, not a client data field — not checked.
        # Contamination means client_alias resolves to a different client than expected.
        if be_alias and be_alias != client_id:
            be_contaminated = True
            contamination_evidence.append(
                f"binding_envelope client_alias '{be_alias}' != expected '{client_id}'")

    if dom_path.exists():
        dom = load_json(dom_path)
        dom_client = dom.get("client", "")
        if dom_client and dom_client != client_id:
            be_contaminated = True
            contamination_evidence.append(
                f"dom_layer client '{dom_client}' != expected '{client_id}'")

    if not be_contaminated:
        checks.append(make_check(
            "IV-12", "no_blueedge_contamination_for_fastapi", "PASS",
            [f"binding_envelope client_alias: {client_id}",
             f"dom_layer client: {client_id}"],
            "No cross-client contamination detected in generic pipeline artifacts"))
    else:
        checks.append(make_check(
            "IV-12", "no_blueedge_contamination_for_fastapi", "FAIL",
            contamination_evidence,
            "Cross-client contamination detected in pipeline artifacts"))

    return checks


# ── Manifest Update ────────────────────────────────────────────────────────────

def update_manifest(
    manifest_path: Path,
    iv_path_rel: str,
    dry_run: bool,
) -> None:
    manifest = load_json(manifest_path)
    existing = manifest.get("integration_validation_path")

    if existing is not None:
        if existing == iv_path_rel:
            print(f"  [SKIP]    integration_validation_path already set to correct value")
            return
        fail_closed(
            f"integration_validation_path already set to a conflicting value:\n"
            f"  existing: {existing}\n"
            f"  expected: {iv_path_rel}"
        )

    manifest["integration_validation_path"] = iv_path_rel

    if dry_run:
        print(f"  [DRY-RUN] Would update: {manifest_path.relative_to(REPO_ROOT)}")
        print(f"            + integration_validation_path: {iv_path_rel}")
        return

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"  [UPDATED] {manifest_path.relative_to(REPO_ROOT)}")
    print(f"            + integration_validation_path: {iv_path_rel}")


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args      = parse_args()
    client_id = args.client
    source_id = args.source
    run_id    = args.run_id
    dry_run   = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"integration_validation_generator.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  source:  {source_id}")
    print(f"  run_id:  {run_id}")
    mode = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode}")
    print("=" * 64)

    run_dir        = REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id
    integ_dir      = run_dir / "integration"
    output_path    = integ_dir / "integration_validation.json"
    manifest_path  = REPO_ROOT / "clients" / client_id / "sources" / source_id / "source_manifest.json"
    iv_path_rel    = f"clients/{client_id}/psee/runs/{run_id}/integration/integration_validation.json"

    # ── [1] Validate inputs ───────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    required_inputs = [
        (run_dir / "intake" / "intake_manifest.json",                    "intake_manifest.json"),
        (run_dir / "structure" / "40.2" / "structural_node_inventory.json", "structural_node_inventory.json"),
        (run_dir / "ceu" / "grounding_state_v3.json",                    "grounding_state_v3.json"),
        (run_dir / "dom" / "dom_layer.json",                             "dom_layer.json"),
    ]
    for path, label in required_inputs:
        if not path.exists():
            fail_closed(f"{label} not found at {path.relative_to(REPO_ROOT)}")

    if not manifest_path.exists():
        fail_closed(f"source_manifest.json not found: {manifest_path.relative_to(REPO_ROOT)}")

    print(f"  Required inputs: all present")

    if validate_only:
        print("\n  Inputs valid. Validate-only mode — stopping before checks.")
        print("\n" + "=" * 64)
        print("VALIDATE-ONLY PASS")
        print("=" * 64)
        return

    if not dry_run and output_path.exists():
        fail_closed(
            f"CREATE_ONLY violation — integration_validation.json already exists: "
            f"{output_path.relative_to(REPO_ROOT)}"
        )

    # ── [2] Run checks ────────────────────────────────────────────────────────
    print("\n[2] Running integration validation checks ...")

    checks = run_checks(run_dir, client_id)

    passed = sum(1 for c in checks if c["status"] == "PASS")
    failed = sum(1 for c in checks if c["status"] == "FAIL")

    for c in checks:
        mark = "✓" if c["status"] == "PASS" else "✗"
        print(f"  {mark} {c['check_id']} {c['name']}: {c['status']}")

    if failed == 0:
        validation_status = "PASS"
    elif passed > 0:
        validation_status = "PARTIAL"
    else:
        validation_status = "FAIL"

    print(f"\n  checks: {len(checks)} total, {passed} passed, {failed} failed")
    print(f"  validation_status: {validation_status}")

    # ── [3] Assemble output ───────────────────────────────────────────────────
    output = {
        "contract_id":       CONTRACT_ID,
        "client":            client_id,
        "run_id":            run_id,
        "generated_at":      now_iso(),
        "validation_status": validation_status,
        "checks":            checks,
        "summary": {
            "total_checks": len(checks),
            "passed":       passed,
            "failed":       failed,
        },
    }

    # ── [4] Write artifact ────────────────────────────────────────────────────
    print("\n[3] Writing integration_validation.json ...")
    save_json(output_path, output, dry_run)

    # ── [5] Update manifest ───────────────────────────────────────────────────
    print("\n[4] Updating source_manifest.json ...")
    update_manifest(manifest_path, iv_path_rel, dry_run)

    print("\n" + "=" * 64)
    print(
        f"INTEGRATION VALIDATION COMPLETE — "
        f"{passed}/{len(checks)} checks passed — {validation_status}"
    )
    print("=" * 64)


if __name__ == "__main__":
    main()
