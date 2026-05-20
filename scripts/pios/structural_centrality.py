#!/usr/bin/env python3
"""
structural_centrality.py
Contract: PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01

Structural centrality derivation from 40.3s code-graph relationships.
Produces 40.3c artifact — normalized centrality metrics, structural role
classification, and false-positive centrality risk catalog.

40.3c is centrality EVIDENCE — not projection authority. It does NOT
influence DOM, pressure, SQO promotion, semantic derivation, CSR,
or S-state logic. Downstream consumption requires a separate governed stream.

Reads:   clients/<client>/psee/runs/<run>/structure/40.3s/code_graph.json

Writes:  clients/<client>/psee/runs/<run>/structure/40.3c/structural_centrality.json

Usage:
    python3 scripts/pios/structural_centrality.py \\
        --client pallets-flask \\
        --run-id run_github_flask_20260517_163222

    --dry-run       Compute all results, log what would be written; no files written
    --report-only   Print detailed centrality report; no files written

RULE: No AI/LLM. All computation is deterministic.
RULE: 40.3c is ADDITIVE evidence — does NOT feed any downstream consumer.
RULE: CREATE_ONLY — abort if output file already exists (in write mode).
RULE: Deterministic — same 40.3s input → same 40.3c output.
RULE: structural_throughput_proxy is a heuristic, NOT graph betweenness.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01"

STRUCTURAL_ROLES = [
    "ENTRYPOINT",
    "RE_EXPORT_HUB",
    "RUNTIME_SPINE",
    "UTILITY_HUB",
    "INTERFACE_BOUNDARY",
    "ISOLATED_LEAF",
    "VALIDATION_SUPPORT",
]

FALSE_POSITIVE_RISKS = [
    {
        "risk_id": "FP-01",
        "category": "init_re_export_inflation",
        "description": "__init__.py files appear highly central because every "
                       "submodule imports from them, but they typically contain "
                       "no logic — they are re-export pass-throughs.",
        "detection_rule": "filename == '__init__.py' AND class_count == 0 AND func_count == 0",
        "mitigation": "Role classification identifies these as RE_EXPORT_HUB; "
                      "in-degree should be discounted in any future projection.",
    },
    {
        "risk_id": "FP-02",
        "category": "type_stub_inflation",
        "description": "Type definition files (typing.py, types.py) may have "
                       "moderate in-degree despite being passive type containers.",
        "detection_rule": "filename in {'typing.py', 'types.py', '_types.py'}",
        "mitigation": "Flag when in_degree > file_count * 0.1.",
    },
    {
        "risk_id": "FP-03",
        "category": "conditional_import_overcounting",
        "description": "ast counts imports inside 'if TYPE_CHECKING:' blocks "
                       "equally with runtime imports, inflating in-degree for "
                       "files only imported for type checking.",
        "detection_rule": "Requires scope-aware ast walking (not implemented in current indexer)",
        "mitigation": "Document as known ast limitation; future SCIP indexer could resolve.",
    },
    {
        "risk_id": "FP-04",
        "category": "test_utility_leakage",
        "description": "If source root discovery includes test utilities, those "
                       "files inflate centrality of modules they test.",
        "detection_rule": "source_root includes test directories",
        "mitigation": "Upstream 40.3s already excludes test directories; validate at 40.3c level.",
    },
    {
        "risk_id": "FP-05",
        "category": "circular_dependency_masking",
        "description": "Two files mutually importing each other both get inflated "
                       "in-degree, masking that the dependency is bidirectional.",
        "detection_rule": "For each IMPORTS edge (A->B), check if (B->A) also exists",
        "mitigation": "Detect and flag circular pairs in false_positive_catalog.",
    },
]


# ── Path Resolution ─────────────────────────────────────────────────────────

def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    return {
        "run_dir": run_dir,
        "code_graph": run_dir / "structure" / "40.3s" / "code_graph.json",
        "output_dir": run_dir / "structure" / "40.3c",
        "output_file": run_dir / "structure" / "40.3c" / "structural_centrality.json",
    }


# ── Input Loading ───────────────────────────────────────────────────────────

def load_code_graph(path: Path) -> dict:
    if not path.is_file():
        print(f"FATAL: 40.3s artifact not found: {path}", file=sys.stderr)
        sys.exit(1)
    with open(path) as f:
        data = json.load(f)
    if data.get("artifact_class") != "40.3s":
        print(f"FATAL: Expected artifact_class '40.3s', got '{data.get('artifact_class')}'",
              file=sys.stderr)
        sys.exit(1)
    return data


# ── Centrality Computation ──────────────────────────────────────────────────

def collect_file_set(relationships: list[dict]) -> set[str]:
    files: set[str] = set()
    for r in relationships:
        if r.get("source_path"):
            files.add(r["source_path"])
        if r.get("target_path"):
            files.add(r["target_path"])
    return files


def compute_degree_metrics(
    relationships: list[dict],
    all_files: set[str],
) -> dict[str, dict]:
    in_count: Counter = Counter()
    out_count: Counter = Counter()
    class_count: Counter = Counter()
    func_count: Counter = Counter()
    inherit_count: Counter = Counter()

    for r in relationships:
        rtype = r["relation_type"]
        src = r.get("source_path")
        tgt = r.get("target_path")

        if rtype == "IMPORTS" and tgt:
            in_count[tgt] += 1
            if src:
                out_count[src] += 1
        elif rtype == "DEFINES_CLASS" and src:
            class_count[src] += 1
        elif rtype == "DEFINES_FUNCTION" and src:
            func_count[src] += 1
        elif rtype == "INHERITS_UNRESOLVED" and src:
            inherit_count[src] += 1

    metrics: dict[str, dict] = {}
    for fp in sorted(all_files):
        metrics[fp] = {
            "in_degree": in_count.get(fp, 0),
            "out_degree": out_count.get(fp, 0),
            "defines_classes": class_count.get(fp, 0),
            "defines_functions": func_count.get(fp, 0),
            "inherits_unresolved": inherit_count.get(fp, 0),
        }
    return metrics


def normalize_metrics(
    metrics: dict[str, dict],
    file_count: int,
) -> dict[str, dict]:
    denom = max(file_count - 1, 1)

    max_throughput = 0.0
    for m in metrics.values():
        tp = m["in_degree"] * m["out_degree"]
        if tp > max_throughput:
            max_throughput = tp

    for fp, m in metrics.items():
        m["in_degree_normalized"] = round(m["in_degree"] / denom, 4)
        m["out_degree_normalized"] = round(m["out_degree"] / denom, 4)
        raw_tp = m["in_degree"] * m["out_degree"]
        m["structural_throughput_proxy"] = (
            round(raw_tp / max_throughput, 4) if max_throughput > 0 else 0.0
        )

    return metrics


# ── Structural Role Classification ──────────────────────────────────────────

def classify_structural_role(
    path: str,
    m: dict,
    threshold_high: int,
) -> tuple[str, str]:
    filename = Path(path).name
    is_init = filename == "__init__.py"
    is_main = filename == "__main__.py"

    in_deg = m["in_degree"]
    out_deg = m["out_degree"]
    cls_ct = m["defines_classes"]
    fn_ct = m["defines_functions"]

    # 1. ENTRYPOINT
    if (is_main or filename == "__main__.py") and in_deg == 0:
        return "ENTRYPOINT", "zero inbound imports + entry point indicator (__main__.py)"

    # 2. RE_EXPORT_HUB
    if is_init and out_deg >= 3 and cls_ct == 0 and fn_ct == 0:
        return "RE_EXPORT_HUB", (
            f"__init__.py with out_degree={out_deg}, zero local definitions "
            f"(re-export pass-through)"
        )

    # 3. RUNTIME_SPINE
    if in_deg >= threshold_high and cls_ct >= 1:
        return "RUNTIME_SPINE", (
            f"in_degree={in_deg} (>= threshold {threshold_high}) + "
            f"defines {cls_ct} class(es)"
        )

    # 4. UTILITY_HUB
    if in_deg >= threshold_high and cls_ct <= 1:
        if fn_ct >= 3:
            return "UTILITY_HUB", (
                f"in_degree={in_deg} (>= threshold {threshold_high}) + "
                f"defines {fn_ct} functions (utility provider)"
            )
        if fn_ct == 0 and cls_ct == 0:
            return "UTILITY_HUB", (
                f"in_degree={in_deg} (>= threshold {threshold_high}) + "
                f"passive data provider (zero class/function definitions)"
            )

    # 5. INTERFACE_BOUNDARY
    if (cls_ct >= 1 or fn_ct >= 1) and in_deg <= 1:
        return "INTERFACE_BOUNDARY", (
            f"defines symbols (classes={cls_ct}, functions={fn_ct}) but "
            f"in_degree={in_deg} (rarely imported internally)"
        )

    # 6. ISOLATED_LEAF
    if in_deg == 0 and out_deg == 0:
        return "ISOLATED_LEAF", "no import relationships in either direction"

    # 7. VALIDATION_SUPPORT (fallback)
    return "VALIDATION_SUPPORT", (
        f"moderate connectivity (in={in_deg}, out={out_deg}, "
        f"classes={cls_ct}, functions={fn_ct}) — no dominant structural pattern"
    )


def classify_all_roles(
    metrics: dict[str, dict],
    file_count: int,
) -> dict[str, dict]:
    threshold_high = max(3, math.ceil(file_count * 0.20))

    for fp, m in metrics.items():
        role, evidence = classify_structural_role(fp, m, threshold_high)
        m["structural_role"] = role
        m["role_evidence"] = evidence

    return metrics


# ── False-Positive Detection ────────────────────────────────────────────────

def detect_false_positives(
    metrics: dict[str, dict],
    relationships: list[dict],
    file_count: int,
) -> list[dict]:
    catalog = []

    # FP-01: __init__.py re-export inflation
    init_inflated = [
        fp for fp, m in metrics.items()
        if Path(fp).name == "__init__.py"
        and m["defines_classes"] == 0
        and m["defines_functions"] == 0
        and m["in_degree"] > 0
    ]
    if init_inflated:
        catalog.append({
            **FALSE_POSITIVE_RISKS[0],
            "affected_files_in_this_project": sorted(init_inflated),
        })

    # FP-02: type stub inflation
    type_threshold = max(1, int(file_count * 0.1))
    type_inflated = [
        fp for fp, m in metrics.items()
        if Path(fp).name in {"typing.py", "types.py", "_types.py"}
        and m["in_degree"] > type_threshold
    ]
    if type_inflated:
        catalog.append({
            **FALSE_POSITIVE_RISKS[1],
            "affected_files_in_this_project": sorted(type_inflated),
        })

    # FP-03: conditional import overcounting (ast limitation — always present)
    catalog.append({
        **FALSE_POSITIVE_RISKS[2],
        "affected_files_in_this_project": [],
    })

    # FP-04: test utility leakage — check if any path contains /test/ or /tests/
    test_files = [
        fp for fp in metrics
        if "/test/" in fp or "/tests/" in fp or fp.startswith("test")
    ]
    if test_files:
        catalog.append({
            **FALSE_POSITIVE_RISKS[3],
            "affected_files_in_this_project": sorted(test_files),
        })

    # FP-05: circular dependency masking
    import_edges: set[tuple[str, str]] = set()
    for r in relationships:
        if r["relation_type"] == "IMPORTS" and r.get("source_path") and r.get("target_path"):
            import_edges.add((r["source_path"], r["target_path"]))

    circular_pairs = []
    seen: set[tuple[str, str]] = set()
    for a, b in import_edges:
        if (b, a) in import_edges and (b, a) not in seen:
            circular_pairs.append(f"{a} <-> {b}")
            seen.add((a, b))

    if circular_pairs:
        catalog.append({
            **FALSE_POSITIVE_RISKS[4],
            "affected_files_in_this_project": sorted(circular_pairs),
        })

    # Tag each file's false-positive flags
    for fp, m in metrics.items():
        flags = []
        if fp in init_inflated:
            flags.append("init_re_export_inflation")
        if fp in type_inflated:
            flags.append("type_stub_inflation")
        if fp in test_files:
            flags.append("test_utility_leakage")
        for pair_str in circular_pairs:
            if fp in pair_str:
                flags.append("circular_dependency_masking")
                break
        m["false_positive_flags"] = flags

    return catalog


# ── Ranking ─────────────────────────────────────────────────────────────────

def compute_ranking(metrics: dict[str, dict]) -> list[dict]:
    items = sorted(
        metrics.items(),
        key=lambda x: (
            -x[1]["in_degree"],
            -x[1]["out_degree"],
            -x[1]["structural_throughput_proxy"],
            x[0],
        ),
    )

    ranking = []
    for rank_idx, (fp, m) in enumerate(items, start=1):
        ranking.append({
            "path": fp,
            "node_id": None,
            "in_degree": m["in_degree"],
            "out_degree": m["out_degree"],
            "in_degree_normalized": m["in_degree_normalized"],
            "out_degree_normalized": m["out_degree_normalized"],
            "structural_throughput_proxy": m["structural_throughput_proxy"],
            "defines_classes": m["defines_classes"],
            "defines_functions": m["defines_functions"],
            "inherits_unresolved": m["inherits_unresolved"],
            "structural_role": m["structural_role"],
            "role_evidence": m["role_evidence"],
            "centrality_rank": rank_idx,
            "false_positive_flags": m.get("false_positive_flags", []),
        })

    return ranking


# ── Cross-Reference (optional node_id population) ──────────────────────────

def cross_reference_node_ids(
    ranking: list[dict],
    code_graph: dict,
) -> list[dict]:
    path_to_node: dict[str, str] = {}
    for r in code_graph.get("relationships", []):
        sp = r.get("source_path")
        sn = r.get("source_node_id")
        tp = r.get("target_path")
        tn = r.get("target_node_id")
        if sp and sn:
            path_to_node.setdefault(sp, sn)
        if tp and tn:
            path_to_node.setdefault(tp, tn)

    for entry in ranking:
        entry["node_id"] = path_to_node.get(entry["path"])

    return ranking


# ── Validation ──────────────────────────────────────────────────────────────

def validate_artifact(
    ranking: list[dict],
    source_files: set[str],
    file_count: int,
) -> dict:
    checks = {}

    ranking_paths = {e["path"] for e in ranking}
    checks["all_files_from_source"] = ranking_paths == source_files

    checks["no_negative_values"] = all(
        e["in_degree"] >= 0
        and e["out_degree"] >= 0
        and e["in_degree_normalized"] >= 0
        and e["out_degree_normalized"] >= 0
        and e["structural_throughput_proxy"] >= 0
        for e in ranking
    )

    checks["normalized_range_valid"] = all(
        0.0 <= e["in_degree_normalized"] <= 1.0
        and 0.0 <= e["out_degree_normalized"] <= 1.0
        and 0.0 <= e["structural_throughput_proxy"] <= 1.0
        for e in ranking
    )

    checks["role_coverage_complete"] = all(
        e["structural_role"] in STRUCTURAL_ROLES
        for e in ranking
    )

    ranks = [e["centrality_rank"] for e in ranking]
    checks["ranking_unique"] = len(ranks) == len(set(ranks))

    role_counts = Counter(e["structural_role"] for e in ranking)
    checks["sum_roles_equals_file_count"] = sum(role_counts.values()) == file_count

    return checks


# ── Artifact Assembly ───────────────────────────────────────────────────────

def build_artifact(
    ranking: list[dict],
    false_positive_catalog: list[dict],
    code_graph: dict,
    validation: dict,
) -> dict:
    file_count = code_graph["file_count"]
    rel_summary = code_graph["relationship_summary"]
    total_imports = rel_summary.get("IMPORTS", 0)
    max_edges = file_count * max(file_count - 1, 1)

    role_summary = Counter(e["structural_role"] for e in ranking)

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": "40.3c",
        "client_id": code_graph["client_id"],
        "run_id": code_graph["run_id"],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_artifact": "40.3s/code_graph.json",
        "source_artifact_class": "40.3s",
        "file_count": file_count,
        "project_metrics": {
            "total_files": file_count,
            "total_import_edges": total_imports,
            "total_classes": rel_summary.get("DEFINES_CLASS", 0),
            "total_functions": rel_summary.get("DEFINES_FUNCTION", 0),
            "total_inheritance_edges": rel_summary.get("INHERITS_UNRESOLVED", 0),
            "graph_density": round(total_imports / max_edges, 4) if max_edges > 0 else 0.0,
            "max_possible_edges": max_edges,
        },
        "normalization": {
            "method": "degree_centrality",
            "denominator": f"file_count - 1 = {file_count - 1}",
            "description": (
                "Standard graph-theoretic degree centrality: "
                "degree / (N - 1) where N = file_count. "
                "Values in [0.0, 1.0] regardless of project size."
            ),
        },
        "role_classification": {
            "method": "first_match_priority",
            "threshold_high": max(3, math.ceil(file_count * 0.20)),
            "threshold_description": (
                f"max(3, ceil({file_count} * 0.20)) = "
                f"{max(3, math.ceil(file_count * 0.20))}"
            ),
        },
        "role_summary": {role: role_summary.get(role, 0) for role in STRUCTURAL_ROLES},
        "centrality_ranking": ranking,
        "false_positive_catalog": false_positive_catalog,
        "governance": {
            "authority_level": "EVIDENCE_ONLY",
            "downstream_consumers": [],
            "no_authority_statement": (
                "This artifact provides structural centrality EVIDENCE. "
                "It does NOT influence DOM layer generation, pressure zone "
                "computation, SQO promotion, semantic derivation, CSR "
                "construction, or any S-state logic. Downstream consumption "
                "requires a separate governed stream."
            ),
            "safe_for_evidence_ranked_projection": "UNASSESSED",
            "projection_readiness": "NOT_EVALUATED",
            "projection_recommendation": (
                "Centrality evidence produced only. Evidence-ranked projection "
                "requires separate validation stream."
            ),
        },
        "validation": validation,
    }


# ── Report ──────────────────────────────────────────────────────────────────

def print_report(
    ranking: list[dict],
    false_positive_catalog: list[dict],
    project_metrics: dict,
    file_count: int,
) -> None:
    threshold = max(3, math.ceil(file_count * 0.20))

    print("\n" + "=" * 72)
    print("STRUCTURAL CENTRALITY REPORT — 40.3c")
    print("=" * 72)

    print(f"\nProject: {file_count} files, "
          f"{project_metrics['total_import_edges']} import edges, "
          f"density={project_metrics['graph_density']:.4f}")
    print(f"Role threshold (high): {threshold}")

    print(f"\n{'Rank':<5} {'In':>3} {'Out':>4} {'TP':>6} {'Role':<22} Path")
    print("-" * 72)
    for e in ranking:
        print(
            f"{e['centrality_rank']:<5} "
            f"{e['in_degree']:>3} "
            f"{e['out_degree']:>4} "
            f"{e['structural_throughput_proxy']:>6.3f} "
            f"{e['structural_role']:<22} "
            f"{e['path']}"
        )
        if e["false_positive_flags"]:
            print(f"      {'':>3} {'':>4} {'':>6} {'':>22} "
                  f"  [FP: {', '.join(e['false_positive_flags'])}]")

    role_counts = Counter(e["structural_role"] for e in ranking)
    print(f"\nRole Distribution:")
    for role in STRUCTURAL_ROLES:
        ct = role_counts.get(role, 0)
        if ct > 0:
            print(f"  {role:<22} {ct}")

    if false_positive_catalog:
        print(f"\nFalse-Positive Risks ({len(false_positive_catalog)} detected):")
        for fp in false_positive_catalog:
            affected = fp.get("affected_files_in_this_project", [])
            print(f"  [{fp['risk_id']}] {fp['category']}")
            if affected:
                for af in affected[:5]:
                    print(f"    - {af}")
                if len(affected) > 5:
                    print(f"    ... and {len(affected) - 5} more")

    print("\n" + "=" * 72)


# ── Save ────────────────────────────────────────────────────────────────────

def save_json(data: dict, path: Path, dry_run: bool = False) -> None:
    if path.exists():
        print(f"FATAL: output already exists (CREATE_ONLY): {path}", file=sys.stderr)
        sys.exit(1)
    if dry_run:
        print(f"  [DRY-RUN] Would write: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    print(f"  Written: {path}")


# ── CLI ─────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Structural centrality derivation from 40.3s code-graph (40.3c)",
    )
    p.add_argument("--client", required=True, help="Client ID")
    p.add_argument("--run-id", required=True, help="Pipeline run ID")
    p.add_argument("--dry-run", action="store_true",
                   help="Compute results, log what would be written; no files written")
    p.add_argument("--report-only", action="store_true",
                   help="Print centrality report; no files written")
    return p.parse_args()


# ── Main ────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    paths = resolve_paths(args.client, args.run_id)

    print(f"Structural Centrality Derivation (40.3c)")
    print(f"  Client: {args.client}")
    print(f"  Run:    {args.run_id}")

    # Load 40.3s
    code_graph = load_code_graph(paths["code_graph"])
    relationships = code_graph["relationships"]
    file_count = code_graph["file_count"]
    print(f"  Source: 40.3s ({len(relationships)} relationships, {file_count} files)")

    # Collect all files that appear in relationships
    all_files = collect_file_set(relationships)
    print(f"  Files in graph: {len(all_files)}")

    # Compute degree metrics
    metrics = compute_degree_metrics(relationships, all_files)

    # Normalize
    metrics = normalize_metrics(metrics, len(all_files))

    # Classify structural roles
    metrics = classify_all_roles(metrics, len(all_files))

    # Detect false positives
    fp_catalog = detect_false_positives(metrics, relationships, len(all_files))

    # Build ranking
    ranking = compute_ranking(metrics)

    # Cross-reference node IDs from 40.3s
    ranking = cross_reference_node_ids(ranking, code_graph)

    # Validate
    validation = validate_artifact(ranking, all_files, len(all_files))
    all_pass = all(validation.values())

    # Build artifact
    artifact = build_artifact(ranking, fp_catalog, code_graph, validation)

    # Report
    print_report(ranking, fp_catalog, artifact["project_metrics"], len(all_files))

    if not all_pass:
        failed = [k for k, v in validation.items() if not v]
        print(f"\nVALIDATION FAILED: {failed}", file=sys.stderr)
        sys.exit(1)

    print(f"\nValidation: {sum(validation.values())}/{len(validation)} PASS")

    if args.report_only:
        print("\n[REPORT-ONLY] No files written.")
        return

    # Write
    save_json(artifact, paths["output_file"], dry_run=args.dry_run)

    if args.dry_run:
        print("\n[DRY-RUN] No files written.")
    else:
        print(f"\n40.3c artifact written: {paths['output_file'].relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
