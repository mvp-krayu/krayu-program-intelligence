#!/usr/bin/env python3
"""
dom_layer_generator.py
Contract: PI.LENS.DOM-LAYER.GENERATOR.01

Generic deterministic DOM layer generator. Consumes canonical topology and CEU
grounding outputs, groups structural clusters into domains, and produces
dom_layer.json for any client.

Reads:   clients/<client_id>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
         clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json

Writes:  clients/<client_id>/psee/runs/<run_id>/dom/dom_layer.json

Updates: clients/<client_id>/sources/<source_id>/source_manifest.json
           → adds dom_layer_path field if absent

Usage:
    python3 scripts/pios/dom_layer_generator.py \\
        --client fastapi \\
        --source source_01 \\
        --run-id run_02_oss_fastapi_pipeline

    --dry-run        Compute all results, log what would be written; no files written
    --validate-only  Check inputs only; no domain computation or writing

RULE: Deterministic — same canonical_topology → same domain assignment.
RULE: No semantic inference. Path/extension pattern matching only.
RULE: CREATE_ONLY — abort if dom_layer.json already exists (in write mode).
RULE: Manifest update adds dom_layer_path only if field is absent.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.DOM-LAYER.GENERATOR.01"

# ── Domain derivation rules ─────────────────────────────────────────────────
# Evaluated in order — first match wins per cluster name.
# Each rule: (domain_name, rule_id, predicate)
DOMAIN_RULES: list[tuple[str, str, object]] = [
    ("CI_INFRA",       "cluster_name_starts_with_ci_prefix",
     lambda n: n.startswith(".github") or n.startswith(".gitlab")),

    ("TOOLING",        "cluster_name_starts_with_dot",
     lambda n: n.startswith(".")),

    ("APPLICATION",    "cluster_name_in_application_set",
     lambda n: n in {"src", "lib", "app", "pkg", "core", "source"}),

    ("TESTING",        "cluster_name_in_test_set",
     lambda n: n in {"tests", "test", "spec", "__tests__"} or n.startswith("test")),

    ("GENERATED",      "cluster_name_in_generated_set",
     lambda n: n in {"generated", "dist", "build", "output"}),

    ("DOCUMENTATION",  "cluster_name_ends_with_doc_extension",
     lambda n: any(n.endswith(e) for e in (".md", ".txt", ".rst"))),

    ("DEPENDENCY",     "cluster_name_ends_with_lock",
     lambda n: n.endswith(".lock")),

    ("CONFIGURATION",  "cluster_name_ends_with_config_extension",
     lambda n: any(n.endswith(e) for e in (".toml", ".cfg", ".ini", ".json", ".yaml", ".yml"))),

    ("INFRA",          "cluster_name_ends_with_shell_extension",
     lambda n: any(n.endswith(e) for e in (".sh", ".bash", ".zsh", ".ps1"))),

    ("ROOT",           "default_catch_all",
     lambda n: True),
]


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic DOM layer generator")
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


# ── Domain Derivation ──────────────────────────────────────────────────────────

def classify_cluster(cluster_name: str) -> tuple[str, str]:
    """Return (domain_name, rule_id) for a cluster name. First rule wins."""
    for domain_name, rule_id, predicate in DOMAIN_RULES:
        if predicate(cluster_name):
            return domain_name, rule_id
    return "ROOT", "default_catch_all"


def derive_domains(
    clusters: list[dict],
) -> tuple[list[dict], list[dict], dict[str, str]]:
    """
    Assign clusters to domains. Return (domains, dom_groups, node_to_domain_map).

    domains:           contract-specified format (domain_id, name, node_ids, node_count)
    dom_groups:        orchestrator-compatible format (dom_id, dom_label, included_nodes,
                       derivation_rule, path_patterns)
    node_to_domain_map: {node_id → domain_id}
    """
    # Classify each cluster
    domain_buckets: dict[str, dict] = {}  # domain_name → accumulator

    for cluster in clusters:
        cname = cluster["name"]
        domain_name, rule_id = classify_cluster(cname)

        if domain_name not in domain_buckets:
            domain_buckets[domain_name] = {
                "node_ids": [],
                "cluster_names": [],
                "rule_id": rule_id,
            }
        domain_buckets[domain_name]["node_ids"].extend(cluster["node_ids"])
        domain_buckets[domain_name]["cluster_names"].append(cname)

    # Assign DOM-NN IDs sorted alphabetically by domain name
    sorted_names = sorted(domain_buckets.keys())
    domains: list[dict] = []
    dom_groups: list[dict] = []
    node_to_domain_map: dict[str, str] = {}

    for i, dname in enumerate(sorted_names, start=1):
        dom_id = f"DOM-{i:02d}"
        bucket = domain_buckets[dname]
        node_ids = sorted(bucket["node_ids"])
        path_patterns = sorted(bucket["cluster_names"])

        domains.append({
            "domain_id":  dom_id,
            "name":       dname,
            "node_ids":   node_ids,
            "node_count": len(node_ids),
        })

        dom_groups.append({
            "dom_id":         dom_id,
            "dom_label":      dname,
            "included_nodes": node_ids,
            "derivation_rule": bucket["rule_id"],
            "path_patterns":  path_patterns,
        })

        for nid in node_ids:
            node_to_domain_map[nid] = dom_id

    return domains, dom_groups, node_to_domain_map


# ── Manifest Update ────────────────────────────────────────────────────────────

def update_manifest(
    manifest_path: Path,
    dom_layer_path_rel: str,
    dry_run: bool,
) -> None:
    """
    Add dom_layer_path to source_manifest.json if not already present.
    Fail-closed if the field exists with a conflicting value.
    """
    manifest = load_json(manifest_path)
    existing = manifest.get("dom_layer_path")

    if existing is not None:
        if existing == dom_layer_path_rel:
            print(f"  [SKIP]    dom_layer_path already set to correct value")
            return
        fail_closed(
            f"dom_layer_path already set to a conflicting value:\n"
            f"  existing: {existing}\n"
            f"  expected: {dom_layer_path_rel}"
        )

    manifest["dom_layer_path"] = dom_layer_path_rel

    if dry_run:
        print(f"  [DRY-RUN] Would update: {manifest_path.relative_to(REPO_ROOT)}")
        print(f"            + dom_layer_path: {dom_layer_path_rel}")
        return

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"  [UPDATED] {manifest_path.relative_to(REPO_ROOT)}")
    print(f"            + dom_layer_path: {dom_layer_path_rel}")


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    source_id = args.source
    run_id    = args.run_id
    dry_run   = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"dom_layer_generator.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  source:  {source_id}")
    print(f"  run_id:  {run_id}")
    mode = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode}")
    print("=" * 64)

    # Path resolution
    run_dir       = REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id
    dom_dir       = run_dir / "dom"
    output_path   = dom_dir / "dom_layer.json"
    canon_path    = run_dir / "structure" / "40.4" / "canonical_topology.json"
    grounding_path = run_dir / "ceu" / "grounding_state_v3.json"
    manifest_path = REPO_ROOT / "clients" / client_id / "sources" / source_id / "source_manifest.json"

    dom_layer_path_rel = f"clients/{client_id}/psee/runs/{run_id}/dom/dom_layer.json"

    # ── [1] Validate inputs ───────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    if not canon_path.exists():
        fail_closed(
            f"canonical_topology.json not found at "
            f"{canon_path.relative_to(REPO_ROOT)}\n"
            f"  Run structural_scanner.py first."
        )

    if not grounding_path.exists():
        fail_closed(
            f"grounding_state_v3.json not found at "
            f"{grounding_path.relative_to(REPO_ROOT)}\n"
            f"  Run ceu_grounding.py first."
        )

    if not manifest_path.exists():
        fail_closed(f"source_manifest.json not found: {manifest_path.relative_to(REPO_ROOT)}")

    topology  = load_json(canon_path)
    grounding = load_json(grounding_path)

    clusters = topology["clusters"]
    print(f"  canonical_topology:   {len(clusters)} clusters, platform={topology['platform']}")
    print(f"  grounding_state_v3:   {grounding['total_ceu']} CEUs, "
          f"grounded={grounding['grounded_count']}, status={grounding['validation_status']}")

    if validate_only:
        print("\n  Inputs valid. Validate-only mode — stopping before domain derivation.")
        print("\n" + "=" * 64)
        print("VALIDATE-ONLY PASS")
        print("=" * 64)
        return

    if not dry_run and output_path.exists():
        fail_closed(
            f"CREATE_ONLY violation — dom_layer.json already exists: "
            f"{output_path.relative_to(REPO_ROOT)}"
        )

    # ── [2] Derive domains ────────────────────────────────────────────────────
    print("\n[2] Deriving domains from canonical topology ...")

    domains, dom_groups, node_to_domain_map = derive_domains(clusters)

    print(f"  domains derived: {len(domains)}")
    for d in domains:
        print(f"    {d['domain_id']} {d['name']:20s} ({d['node_count']} nodes)")

    total_assigned = len(node_to_domain_map)
    total_expected = sum(c["node_count"] for c in clusters)
    unassigned = total_expected - total_assigned

    if unassigned != 0:
        print(f"  WARNING: {unassigned} nodes unassigned (expected 0)")
        validation_status = "PARTIAL"
    else:
        print(f"  All {total_assigned} nodes assigned to domains")
        validation_status = "PASS"

    # ── [3] Assemble output ───────────────────────────────────────────────────
    dom_layer = {
        "contract_id":        CONTRACT_ID,
        "client":             client_id,
        "run_id":             run_id,
        "generated_at":       now_iso(),
        "domain_count":       len(domains),
        "total_nodes":        total_assigned,
        "domains":            domains,
        "dom_groups":         dom_groups,   # Phase 5 orchestrator compatibility
        "node_to_domain_map": node_to_domain_map,
        "generation_rules": {
            "method":      "cluster_name_pattern_matching",
            "version":     "1.0",
            "rule_count":  len(DOMAIN_RULES),
            "evaluation":  "first_match_wins",
            "basis":       "canonical_topology_clusters_from_40.4",
        },
        "validation_status": validation_status,
    }

    # ── [4] Write DOM artifact ────────────────────────────────────────────────
    print("\n[3] Writing dom_layer.json ...")
    save_json(output_path, dom_layer, dry_run)

    # ── [5] Update manifest ───────────────────────────────────────────────────
    print("\n[4] Updating source_manifest.json ...")
    update_manifest(manifest_path, dom_layer_path_rel, dry_run)

    print("\n" + "=" * 64)
    print(
        f"DOM COMPLETE — {len(domains)} domains, {total_assigned} nodes assigned — "
        f"{validation_status}"
    )
    print("=" * 64)


if __name__ == "__main__":
    main()
