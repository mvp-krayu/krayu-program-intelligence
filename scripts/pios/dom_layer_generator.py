#!/usr/bin/env python3
"""
dom_layer_generator.py
Contract: PI.LENS.DOM-LAYER.GENERATOR.01

Generic deterministic DOM layer generator using A.5 path-prefix semantic
participation reconstruction. Consumes canonical topology (40.4), structural
node inventory (40.2), and CEU grounding outputs to produce dom_layer.json
for any client.

Path A.5 reconstruction method:
  - Group nodes by path-prefix structural boundaries
  - For clusters with significant internal directory structure, subdivide
    into domains at the next meaningful path depth
  - Root-level files (no subdirectory ancestor within cluster) form their
    own domain
  - Domain labels derived deterministically from path segments

Reads:   clients/<client_id>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.2/structural_node_inventory.json
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

RULE: Deterministic — same 40.2 + 40.4 → same domain assignment.
RULE: No semantic inference. Path structure only.
RULE: CREATE_ONLY — abort if dom_layer.json already exists (in write mode).
RULE: Manifest update adds dom_layer_path only if field is absent.
RULE: Lane isolation — this is A.5 output; Lane A artifacts (40.x) are READ-ONLY.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.DOM-LAYER.GENERATOR.01"

MIN_SUBDIVISION_NODES = 3
INTERMEDIATE_RATIO = 0.75


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic DOM layer generator (A.5 path-prefix)")
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


def normalize_label(segment: str) -> str:
    """Convert a path segment to a deterministic snake_case domain label."""
    label = segment.lstrip(".")
    label = re.sub(r"[^a-zA-Z0-9]+", "_", label)
    label = label.strip("_").lower()
    return label or "unnamed"


# ── A.5 Path-Prefix Domain Derivation ────────────────────────────────────────

def build_node_path_index(nodes: list[dict]) -> dict[str, str]:
    """Build {node_id → path} index from 40.2 node inventory."""
    return {n["node_id"]: n["path"] for n in nodes}


def effective_path(raw_path: str, wrapper_prefix: str | None) -> str:
    """Strip wrapper prefix if present, returning the effective structural path."""
    if wrapper_prefix is None:
        return raw_path
    parts = Path(raw_path).parts
    if len(parts) >= 2 and parts[0] == wrapper_prefix:
        return str(Path(*parts[1:]))
    return raw_path


def _group_by_next_component(
    node_ids: list[str],
    node_path_index: dict[str, str],
    wrapper_prefix: Optional[str],
    prefix_parts: tuple[str, ...],
) -> dict[str, list[str]]:
    """
    Group node_ids by the next path component after prefix_parts.
    Nodes at prefix depth (no further component) go to "_root".
    """
    groups: dict[str, list[str]] = defaultdict(list)
    depth = len(prefix_parts)

    for nid in node_ids:
        raw = node_path_index.get(nid, "")
        ep = effective_path(raw, wrapper_prefix)
        parts = Path(ep).parts

        if len(parts) <= depth:
            groups["_root"].append(nid)
        elif parts[:depth] == prefix_parts:
            if len(parts) == depth + 1:
                groups["_root"].append(nid)
            else:
                groups[parts[depth]].append(nid)
        else:
            groups["_root"].append(nid)

    return dict(groups)


def derive_domains_a5(
    clusters: list[dict],
    node_path_index: dict[str, str],
    wrapper_prefix: Optional[str],
) -> tuple[list[dict], list[dict], dict[str, str]]:
    """
    A.5 path-prefix semantic participation reconstruction.

    Two-pass subdivision:
      Pass 1: subdivide cluster by first subdirectory level.
      Pass 2: if any sub-group from pass 1 contains > INTERMEDIATE_RATIO of the
              cluster's nodes (an intermediate aggregation directory like src/),
              subdivide that group one more level.

    Small clusters (< MIN_SUBDIVISION_NODES) become a single domain.

    Returns (domains, dom_groups, node_to_domain_map).
    """
    domain_buckets: dict[str, dict] = {}

    for cluster in clusters:
        clu_name = cluster["name"]
        node_ids = cluster["node_ids"]

        if len(node_ids) < MIN_SUBDIVISION_NODES:
            label = normalize_label(clu_name)
            _add_to_bucket(domain_buckets, label, node_ids,
                           f"path_prefix_direct_{clu_name}",
                           [f"{clu_name}/"])
            continue

        pass1 = _group_by_next_component(
            node_ids, node_path_index, wrapper_prefix, (clu_name,),
        )

        if len(pass1) <= 1:
            label = normalize_label(clu_name)
            _add_to_bucket(domain_buckets, label, node_ids,
                           f"path_prefix_{clu_name}",
                           [f"{clu_name}/"])
            continue

        total = len(node_ids)

        for sub_name, sub_nids in pass1.items():
            if sub_name == "_root":
                sub_label = normalize_label(clu_name) + "_root"
                _add_to_bucket(domain_buckets, sub_label, sub_nids,
                               f"path_prefix_root_{clu_name}",
                               [f"{clu_name}/*"])
                continue

            ratio = len(sub_nids) / total if total > 0 else 0

            if ratio > INTERMEDIATE_RATIO and len(sub_nids) >= MIN_SUBDIVISION_NODES:
                pass2 = _group_by_next_component(
                    sub_nids, node_path_index, wrapper_prefix,
                    (clu_name, sub_name),
                )

                if len(pass2) <= 1:
                    sub_label = normalize_label(clu_name) + "_" + normalize_label(sub_name)
                    _add_to_bucket(domain_buckets, sub_label, sub_nids,
                                   f"path_prefix_{clu_name}/{sub_name}",
                                   [f"{clu_name}/{sub_name}/"])
                    continue

                for sub2_name, sub2_nids in pass2.items():
                    if sub2_name == "_root":
                        sub2_label = normalize_label(clu_name) + "_" + normalize_label(sub_name) + "_root"
                        _add_to_bucket(domain_buckets, sub2_label, sub2_nids,
                                       f"path_prefix_root_{clu_name}/{sub_name}",
                                       [f"{clu_name}/{sub_name}/*"])
                    else:
                        sub2_label = normalize_label(clu_name) + "_" + normalize_label(sub_name) + "_" + normalize_label(sub2_name)
                        _add_to_bucket(domain_buckets, sub2_label, sub2_nids,
                                       f"path_prefix_{clu_name}/{sub_name}/{sub2_name}",
                                       [f"{clu_name}/{sub_name}/{sub2_name}/"])
            else:
                sub_label = normalize_label(clu_name) + "_" + normalize_label(sub_name)
                _add_to_bucket(domain_buckets, sub_label, sub_nids,
                               f"path_prefix_{clu_name}/{sub_name}",
                               [f"{clu_name}/{sub_name}/"])

    sorted_labels = sorted(domain_buckets.keys())
    domains: list[dict] = []
    dom_groups: list[dict] = []
    node_to_domain_map: dict[str, str] = {}

    for i, label in enumerate(sorted_labels, start=1):
        dom_id = f"DOM-{i:02d}"
        bucket = domain_buckets[label]
        nids = sorted(bucket["node_ids"])
        patterns = sorted(set(bucket["path_patterns"]))

        domains.append({
            "domain_id":  dom_id,
            "name":       label,
            "node_ids":   nids,
            "node_count": len(nids),
        })

        dom_groups.append({
            "dom_id":          dom_id,
            "dom_label":       label,
            "included_nodes":  nids,
            "derivation_rule": bucket["derivation_rule"],
            "path_patterns":   patterns,
        })

        for nid in nids:
            node_to_domain_map[nid] = dom_id

    return domains, dom_groups, node_to_domain_map


def _add_to_bucket(
    buckets: dict[str, dict],
    label: str,
    node_ids: list[str],
    rule: str,
    patterns: list[str],
) -> None:
    if label not in buckets:
        buckets[label] = {
            "node_ids": [],
            "derivation_rule": rule,
            "path_patterns": [],
        }
    buckets[label]["node_ids"].extend(node_ids)
    buckets[label]["path_patterns"].extend(patterns)


# ── Manifest Update ────────────────────────────────────────────────────────────

def update_manifest(
    manifest_path: Path,
    dom_layer_path_rel: str,
    dry_run: bool,
) -> None:
    """
    Add dom_layer_path to source_manifest.json if not already present.
    If field exists with a conflicting value, treat as legacy reference metadata
    and skip manifest update — do not fail run-specific execution.
    PI.LENS.REAL-E2E-PIPELINE.BLOCKER-08-CLOSURE.01
    """
    manifest = load_json(manifest_path)
    existing = manifest.get("dom_layer_path")

    if existing is not None:
        if existing == dom_layer_path_rel:
            print(f"  [SKIP]    dom_layer_path already set to correct value")
            return
        print(f"  [LEGACY]  dom_layer_path in manifest refers to a legacy/reference path:")
        print(f"            existing: {existing}")
        print(f"            run-path: {dom_layer_path_rel}")
        print(f"  [LEGACY]  manifest not updated — run-specific output path used for this run")
        return

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
    run_dir        = REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id
    dom_dir        = run_dir / "dom"
    output_path    = dom_dir / "dom_layer.json"
    canon_path     = run_dir / "structure" / "40.4" / "canonical_topology.json"
    node_inv_path  = run_dir / "structure" / "40.2" / "structural_node_inventory.json"
    grounding_path = run_dir / "ceu" / "grounding_state_v3.json"
    manifest_path  = REPO_ROOT / "clients" / client_id / "sources" / source_id / "source_manifest.json"

    dom_layer_path_rel = f"clients/{client_id}/psee/runs/{run_id}/dom/dom_layer.json"

    # ── [1] Validate inputs ───────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    if not canon_path.exists():
        fail_closed(
            f"canonical_topology.json not found at "
            f"{canon_path.relative_to(REPO_ROOT)}\n"
            f"  Run structural_scanner.py first."
        )

    if not node_inv_path.exists():
        fail_closed(
            f"structural_node_inventory.json not found at "
            f"{node_inv_path.relative_to(REPO_ROOT)}\n"
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

    topology    = load_json(canon_path)
    node_inv    = load_json(node_inv_path)
    grounding   = load_json(grounding_path)

    clusters = topology["clusters"]
    wrapper_meta = topology.get("wrapper_normalization", {})
    wrapper_prefix = wrapper_meta.get("wrapper_prefix") if wrapper_meta.get("wrapper_detected") else None

    print(f"  canonical_topology:   {len(clusters)} clusters, platform={topology['platform']}")
    if wrapper_prefix:
        print(f"  wrapper_prefix:       {wrapper_prefix} (normalized by 40.4)")
    print(f"  node_inventory:       {node_inv['total_nodes']} nodes")
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

    # ── [2] Build node path index ────────────────────────────────────────────
    print("\n[2] Building node path index from 40.2 ...")
    node_path_index = build_node_path_index(node_inv["nodes"])
    print(f"  indexed: {len(node_path_index)} nodes")

    # ── [3] Derive domains (A.5 path-prefix reconstruction) ──────────────────
    print("\n[3] Deriving domains via A.5 path-prefix reconstruction ...")

    domains, dom_groups, node_to_domain_map = derive_domains_a5(
        clusters, node_path_index, wrapper_prefix,
    )

    print(f"  domains derived: {len(domains)}")
    for d in domains:
        print(f"    {d['domain_id']} {d['name']:30s} ({d['node_count']} nodes)")

    total_assigned = len(node_to_domain_map)
    total_expected = sum(c["node_count"] for c in clusters)
    unassigned = total_expected - total_assigned

    if unassigned != 0:
        print(f"  WARNING: {unassigned} nodes unassigned (expected 0)")
        validation_status = "PARTIAL"
    else:
        print(f"  All {total_assigned} nodes assigned to domains")
        validation_status = "PASS"

    # ── [4] Assemble output ──────────────────────────────────────────────────
    dom_layer = {
        "contract_id":        CONTRACT_ID,
        "client":             client_id,
        "run_id":             run_id,
        "generated_at":       now_iso(),
        "domain_count":       len(domains),
        "total_nodes":        total_assigned,
        "domains":            domains,
        "dom_groups":         dom_groups,
        "node_to_domain_map": node_to_domain_map,
        "generation_rules": {
            "method":      "a5_path_prefix_reconstruction",
            "version":     "2.0",
            "min_subdivision_nodes": MIN_SUBDIVISION_NODES,
            "evaluation":  "path_prefix_grouping_with_subdivision",
            "basis":       "40.2_node_paths_grouped_by_40.4_clusters",
            "wrapper_normalization_applied": wrapper_prefix is not None,
            "wrapper_prefix": wrapper_prefix,
        },
        "validation_status": validation_status,
    }

    # ── [5] Write DOM artifact ───────────────────────────────────────────────
    print("\n[4] Writing dom_layer.json ...")
    save_json(output_path, dom_layer, dry_run)

    # ── [6] Update manifest ──────────────────────────────────────────────────
    print("\n[5] Updating source_manifest.json ...")
    update_manifest(manifest_path, dom_layer_path_rel, dry_run)

    print("\n" + "=" * 64)
    print(
        f"DOM COMPLETE — {len(domains)} domains, {total_assigned} nodes assigned — "
        f"{validation_status}"
    )
    print("=" * 64)


if __name__ == "__main__":
    main()
