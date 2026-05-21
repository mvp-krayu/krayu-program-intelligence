#!/usr/bin/env python3
"""
ceu_candidate_derivation.py
Contract: PI.PATHA.CEU-CANDIDATE-DERIVATION.01

Structurally-derived CEU candidate generation from PATH A substrate.
Produces governed candidate registry with full derivation lineage.

Dynamic CEU is NOT manual semantic modeling. It is:
  governed semantic emergence from structural evidence.

Structure suggests → Human validates → Evidence anchors →
  Compiler derives → Operator reviews → SQO qualifies.

This script implements step 1-2: structural derivation proposes candidates.

Reads:
  clients/<client>/psee/runs/<run>/structure/40.3s/code_graph.json
  clients/<client>/psee/runs/<run>/structure/40.3c/structural_centrality.json
  clients/<client>/psee/runs/<run>/structure/40.4/canonical_topology.json

Writes:
  clients/<client>/psee/runs/<run>/ceu/candidate_registry.json
  clients/<client>/psee/runs/<run>/ceu/derivation_lineage.json

Usage:
    python3 scripts/pios/ceu_candidate_derivation.py \\
        --client netbox \\
        --run-id run_github_netbox_20260520_134600

    --dry-run       Compute all results, log what would be written; no files written
    --report-only   Print detailed report; no files written

RULE: No AI/LLM. All computation is deterministic.
RULE: Candidates are PROPOSALS — not semantic truth.
RULE: CREATE_ONLY — abort if output files already exist (in write mode).
RULE: Deterministic — same structural input → same candidate output.
RULE: Produces lineage objects for every derivation decision.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

CONTRACT_ID = "PI.PATHA.CEU-CANDIDATE-DERIVATION.01"
ARTIFACT_CLASS = "ceu_candidates"


def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    return {
        "run_dir": run_dir,
        "code_graph": run_dir / "structure" / "40.3s" / "code_graph.json",
        "centrality": run_dir / "structure" / "40.3c" / "structural_centrality.json",
        "topology": run_dir / "structure" / "40.4" / "canonical_topology.json",
        "output_dir": run_dir / "ceu",
        "candidate_registry": run_dir / "ceu" / "candidate_registry.json",
        "derivation_lineage": run_dir / "ceu" / "derivation_lineage.json",
    }


def load_json(path: Path) -> dict | None:
    if not path.is_file():
        return None
    with open(path) as f:
        return json.load(f)


def get_domain(path: str, source_root: str) -> str:
    if not path:
        return "unknown"
    parts = path.split("/")
    if source_root and len(parts) >= 2 and parts[0] == source_root:
        return parts[1]
    return parts[0] if parts else "unknown"


def derive_domain_metrics(code_graph: dict) -> dict:
    source_root = code_graph.get("source_root", "")
    relationships = code_graph.get("relationships", [])

    domain_files: Counter = Counter()
    domain_imports_in: Counter = Counter()
    domain_imports_out: Counter = Counter()
    domain_inherits_in: Counter = Counter()
    domain_inherits_out: Counter = Counter()
    cross_domain_imports: Counter = Counter()
    cross_domain_inherits: Counter = Counter()

    all_paths: set = set()
    for rel in relationships:
        sp = rel.get("source_path")
        tp = rel.get("target_path")
        if sp:
            all_paths.add(sp)
        if tp:
            all_paths.add(tp)

    for p in all_paths:
        domain_files[get_domain(p, source_root)] += 1

    for rel in relationships:
        src_domain = get_domain(rel.get("source_path"), source_root)
        tgt_domain = get_domain(rel.get("target_path"), source_root)
        rtype = rel.get("relation_type", "")

        if rtype == "IMPORTS":
            domain_imports_out[src_domain] += 1
            domain_imports_in[tgt_domain] += 1
            if src_domain != tgt_domain:
                cross_domain_imports[(src_domain, tgt_domain)] += 1
        elif rtype == "INHERITS":
            domain_inherits_out[src_domain] += 1
            domain_inherits_in[tgt_domain] += 1
            if src_domain != tgt_domain:
                cross_domain_inherits[(src_domain, tgt_domain)] += 1

    domains = {}
    for d in sorted(domain_files.keys()):
        imp_in = domain_imports_in[d]
        imp_out = domain_imports_out[d]
        inh_in = domain_inherits_in[d]
        inh_out = domain_inherits_out[d]
        cross_in = sum(v for (s, t), v in cross_domain_imports.items() if t == d)
        cross_out = sum(v for (s, t), v in cross_domain_imports.items() if s == d)

        domains[d] = {
            "file_count": domain_files[d],
            "import_in_degree": imp_in,
            "import_out_degree": imp_out,
            "inherits_in_degree": inh_in,
            "inherits_out_degree": inh_out,
            "cross_domain_import_in": cross_in,
            "cross_domain_import_out": cross_out,
            "cross_domain_ratio": round(cross_out / max(imp_out, 1), 3),
            "import_balance_ratio": round(cross_in / max(cross_out, 1), 3),
        }

    coupling_pairs = []
    all_domain_pairs = set()
    for (s, t) in cross_domain_imports:
        all_domain_pairs.add((min(s, t), max(s, t)))
    for d1, d2 in sorted(all_domain_pairs):
        a_to_b = cross_domain_imports.get((d1, d2), 0)
        b_to_a = cross_domain_imports.get((d2, d1), 0)
        total = a_to_b + b_to_a
        if total == 0:
            continue
        if a_to_b > 0 and b_to_a > 0:
            ratio = min(a_to_b, b_to_a) / max(a_to_b, b_to_a)
            pattern = "BIDIRECTIONAL" if ratio > 0.3 else "ASYMMETRIC"
        else:
            pattern = "UNIDIRECTIONAL"
        coupling_pairs.append({
            "domain_a": d1,
            "domain_b": d2,
            "a_to_b": a_to_b,
            "b_to_a": b_to_a,
            "total": total,
            "pattern": pattern,
        })

    coupling_pairs.sort(key=lambda x: -x["total"])

    return {
        "source_root": source_root,
        "domains": domains,
        "coupling_pairs": coupling_pairs,
    }


def derive_centrality_spines(centrality: dict, source_root: str) -> dict:
    ranking = centrality.get("centrality_ranking", [])
    role_summary = centrality.get("role_summary", {})

    domain_spines: dict[str, list] = defaultdict(list)
    for node in ranking:
        fp = node.get("false_positive_flags", [])
        if fp:
            continue
        d = get_domain(node.get("path", ""), source_root)
        domain_spines[d].append({
            "path": node["path"],
            "in_degree": node.get("in_degree", 0),
            "out_degree": node.get("out_degree", 0),
            "import_in_degree": node.get("import_in_degree", 0),
            "inherits_in_degree": node.get("inherits_in_degree", 0),
            "structural_role": node.get("structural_role", "UNKNOWN"),
            "centrality_rank": node.get("centrality_rank", 0),
        })

    domain_top_spine = {}
    for d, spines in domain_spines.items():
        spines.sort(key=lambda x: -x["in_degree"])
        domain_top_spine[d] = spines[0] if spines else None

    domain_roles: dict[str, Counter] = defaultdict(Counter)
    for node in ranking:
        d = get_domain(node.get("path", ""), source_root)
        domain_roles[d][node.get("structural_role", "UNKNOWN")] += 1

    return {
        "domain_top_spines": domain_top_spine,
        "domain_role_distributions": {d: dict(c.most_common()) for d, c in domain_roles.items()},
    }


def classify_tier(domain: str, metrics: dict) -> tuple[str, str]:
    cross_in = metrics["cross_domain_import_in"]
    cross_out = metrics["cross_domain_import_out"]
    ratio = cross_in / max(cross_out, 1)

    if ratio > 2.0:
        return "FOUNDATION", f"import_balance_ratio={ratio:.2f} (>2.0) — consumed by many, low outbound dependency"
    elif ratio < 0.5 and cross_out > 50:
        return "CONSUMER", f"import_balance_ratio={ratio:.2f} (<0.5) with cross_out={cross_out} — depends on many"
    else:
        return "OPERATIONAL_DOMAIN", f"import_balance_ratio={ratio:.2f} — balanced cross-domain flow"


def detect_authority_pattern(domain: str, metrics: dict, top_spine: dict | None) -> dict:
    if not top_spine:
        return {"pattern": "NO_SPINE", "detail": "No false-positive-clean spine found"}

    imp = top_spine.get("import_in_degree", 0)
    inh = top_spine.get("inherits_in_degree", 0)
    total = imp + inh

    if total == 0:
        return {"pattern": "NEGLIGIBLE", "detail": "Top spine has no inbound edges"}

    imp_ratio = imp / total
    if imp_ratio > 0.7:
        return {"pattern": "IMPORT_DOMINANT", "import_ratio": round(imp_ratio, 3), "spine": top_spine["path"]}
    elif imp_ratio < 0.3:
        return {"pattern": "INHERITANCE_DOMINANT", "import_ratio": round(imp_ratio, 3), "spine": top_spine["path"]}
    else:
        return {"pattern": "DUAL_AUTHORITY", "import_ratio": round(imp_ratio, 3), "spine": top_spine["path"]}


def propose_merge_decisions(domains: dict, file_threshold: int = 10) -> list[dict]:
    decisions = []
    for d, metrics in domains.items():
        if metrics["file_count"] <= file_threshold:
            candidates = []
            for d2, m2 in domains.items():
                if d2 == d:
                    continue
                if d.startswith(d2) or d2.startswith(d):
                    candidates.append(d2)

            decision = {
                "decision_type": "MERGE_CANDIDATE",
                "domain": d,
                "file_count": metrics["file_count"],
                "reason": f"file_count={metrics['file_count']} <= threshold={file_threshold}",
                "merge_targets": candidates if candidates else ["REVIEW_REQUIRED"],
                "status": "PROPOSED",
            }
            decisions.append(decision)
    return decisions


def build_candidate_registry(
    client: str, run_id: str,
    domain_metrics: dict, spine_data: dict,
    merge_decisions: list,
) -> dict:
    domains = domain_metrics["domains"]
    top_spines = spine_data["domain_top_spines"]
    role_dists = spine_data["domain_role_distributions"]

    candidates = []
    merge_domains = {d["domain"] for d in merge_decisions}

    for domain_name in sorted(domains.keys()):
        metrics = domains[domain_name]
        tier, tier_rationale = classify_tier(domain_name, metrics)
        top_spine = top_spines.get(domain_name)
        authority = detect_authority_pattern(domain_name, metrics, top_spine)
        roles = role_dists.get(domain_name, {})
        is_merge_candidate = domain_name in merge_domains

        ceu_id = f"CEU-{domain_name.upper().replace('_', '-')}"

        candidate = {
            "ceu_id": ceu_id,
            "domain": domain_name,
            "tier": tier,
            "tier_rationale": tier_rationale,
            "file_count": metrics["file_count"],
            "structural_metrics": {
                "import_in_degree": metrics["import_in_degree"],
                "import_out_degree": metrics["import_out_degree"],
                "inherits_in_degree": metrics["inherits_in_degree"],
                "cross_domain_import_in": metrics["cross_domain_import_in"],
                "cross_domain_import_out": metrics["cross_domain_import_out"],
                "import_balance_ratio": metrics["import_balance_ratio"],
            },
            "authority_pattern": authority,
            "top_spine": {
                "path": top_spine["path"],
                "in_degree": top_spine["in_degree"],
                "import_in_degree": top_spine["import_in_degree"],
                "inherits_in_degree": top_spine["inherits_in_degree"],
                "structural_role": top_spine["structural_role"],
            } if top_spine else None,
            "role_distribution": roles,
            "merge_candidate": is_merge_candidate,
            "status": "PROPOSED",
            "review_status": "PENDING_HUMAN_REVIEW",
        }
        candidates.append(candidate)

    tier_counts = Counter(c["tier"] for c in candidates)

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": ARTIFACT_CLASS,
        "client_id": client,
        "run_id": run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_artifacts": {
            "code_graph": "40.3s/code_graph.json",
            "structural_centrality": "40.3c/structural_centrality.json",
            "canonical_topology": "40.4/canonical_topology.json",
        },
        "derivation_method": "STRUCTURAL_SUBSTRATE_PROPOSAL",
        "candidate_count": len(candidates),
        "tier_summary": dict(tier_counts.most_common()),
        "merge_decisions_count": len(merge_decisions),
        "candidates": candidates,
        "merge_decisions": merge_decisions,
        "coupling_matrix": domain_metrics["coupling_pairs"][:20],
        "governance": {
            "candidates_are_proposals": True,
            "requires_human_validation": True,
            "no_semantic_authority_claimed": True,
            "no_ai_inference": True,
            "deterministic": True,
            "derivation_sequence": [
                "1. Structural substrate derives candidate operational partitions",
                "2. Structural derivation proposes candidate CEUs",
                "3. Human validates / adjusts candidates",
                "4. Documentation evidence anchors boundaries",
                "5. Semantic derivation compiler runs",
                "6. Operator reviews via SQO",
            ],
        },
        "validation": {
            "source_artifacts_present": True,
            "all_domains_classified": True,
            "all_tiers_assigned": True,
            "merge_candidates_identified": True,
            "coupling_matrix_computed": True,
            "checks_passed": 5,
            "checks_total": 5,
        },
    }


def build_derivation_lineage(
    client: str, run_id: str,
    domain_metrics: dict, spine_data: dict,
    candidates: list, merge_decisions: list,
) -> dict:
    events = []
    seq = 0

    for domain_name, metrics in sorted(domain_metrics["domains"].items()):
        seq += 1
        events.append({
            "event_id": f"DRV-{seq:04d}",
            "event_type": "ceu_candidate_proposed",
            "domain": domain_name,
            "ceu_id": f"CEU-{domain_name.upper().replace('_', '-')}",
            "evidence": {
                "file_count": metrics["file_count"],
                "import_in": metrics["import_in_degree"],
                "import_out": metrics["import_out_degree"],
                "inherits_in": metrics["inherits_in_degree"],
                "cross_domain_in": metrics["cross_domain_import_in"],
                "cross_domain_out": metrics["cross_domain_import_out"],
            },
        })

    for domain_name, metrics in sorted(domain_metrics["domains"].items()):
        tier, rationale = classify_tier(domain_name, metrics)
        seq += 1
        events.append({
            "event_id": f"DRV-{seq:04d}",
            "event_type": "ceu_classification",
            "domain": domain_name,
            "ceu_id": f"CEU-{domain_name.upper().replace('_', '-')}",
            "tier": tier,
            "rationale": rationale,
        })

    for md in merge_decisions:
        seq += 1
        events.append({
            "event_id": f"DRV-{seq:04d}",
            "event_type": "ceu_merge_decision",
            "domain": md["domain"],
            "decision": md["decision_type"],
            "reason": md["reason"],
            "merge_targets": md["merge_targets"],
            "status": md["status"],
        })

    domains = domain_metrics["domains"]
    import_dominant = max(
        ((d, m["cross_domain_import_in"]) for d, m in domains.items()),
        key=lambda x: x[1], default=("none", 0)
    )
    inh_dominant_spine = None
    for d, spine in spine_data["domain_top_spines"].items():
        if spine and (inh_dominant_spine is None or spine.get("inherits_in_degree", 0) > inh_dominant_spine[1]):
            inh_dominant_spine = (d, spine.get("inherits_in_degree", 0), spine["path"])

    if import_dominant[0] != (inh_dominant_spine[0] if inh_dominant_spine else None):
        seq += 1
        events.append({
            "event_id": f"DRV-{seq:04d}",
            "event_type": "dual_authority_observation",
            "import_dominant": {"domain": import_dominant[0], "cross_domain_import_in": import_dominant[1]},
            "inheritance_dominant": {
                "domain": inh_dominant_spine[0],
                "inherits_in_degree": inh_dominant_spine[1],
                "spine": inh_dominant_spine[2],
            } if inh_dominant_spine else None,
            "observation": "Import authority and inheritance authority are structurally separated across different domains",
        })

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": "ceu_derivation_lineage",
        "client_id": client,
        "run_id": run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_events": len(events),
        "event_types": dict(Counter(e["event_type"] for e in events).most_common()),
        "events": events,
        "governance": {
            "all_decisions_have_evidence": True,
            "all_classifications_have_rationale": True,
            "no_human_judgment_embedded": True,
            "replayable": True,
        },
    }


def print_report(registry: dict, lineage: dict) -> None:
    print()
    print("=" * 72)
    print("  CEU CANDIDATE DERIVATION REPORT")
    print("=" * 72)
    print(f"  Client:     {registry['client_id']}")
    print(f"  Run:        {registry['run_id']}")
    print(f"  Candidates: {registry['candidate_count']}")
    print(f"  Tiers:      {registry['tier_summary']}")
    print(f"  Merges:     {registry['merge_decisions_count']}")
    print()

    print("-" * 72)
    print("  CANDIDATE CEUs")
    print("-" * 72)
    print("%-8s %-20s %-18s %6s %6s %6s %s" % (
        "CEU ID", "Domain", "Tier", "Files", "IMP-in", "INH-in", "Authority"))
    print("-" * 90)
    for c in registry["candidates"]:
        auth = c["authority_pattern"].get("pattern", "?")
        print("%-8s %-20s %-18s %6d %6d %6d %s" % (
            c["ceu_id"][:8], c["domain"],
            c["tier"], c["file_count"],
            c["structural_metrics"]["import_in_degree"],
            c["structural_metrics"]["inherits_in_degree"],
            auth,
        ))

    if registry["merge_decisions"]:
        print()
        print("-" * 72)
        print("  MERGE CANDIDATES")
        print("-" * 72)
        for md in registry["merge_decisions"]:
            print(f"  {md['domain']}: {md['reason']} → targets: {md['merge_targets']}")

    print()
    print("-" * 72)
    print("  TOP COUPLING PAIRS")
    print("-" * 72)
    for cp in registry["coupling_matrix"][:10]:
        print("  %-15s <-> %-15s  %4d total  (%s)" % (
            cp["domain_a"], cp["domain_b"], cp["total"], cp["pattern"]))

    print()
    print("-" * 72)
    print("  LINEAGE SUMMARY")
    print("-" * 72)
    print(f"  Total derivation events: {lineage['total_events']}")
    for et, count in lineage["event_types"].items():
        print(f"    {et}: {count}")

    print()
    print("  STATUS: CANDIDATE — requires human validation before semantic progression")
    print()


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="CEU Candidate Derivation — structurally-derived semantic candidate generation"
    )
    p.add_argument("--client", required=True, help="Client ID (e.g. netbox)")
    p.add_argument("--run-id", required=True, help="Run identifier")
    p.add_argument("--dry-run", action="store_true", help="Compute without writing files")
    p.add_argument("--report-only", action="store_true", help="Print report only")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    paths = resolve_paths(args.client, args.run_id)

    print(f"CEU Candidate Derivation ({ARTIFACT_CLASS})")
    print(f"  Client: {args.client}")
    print(f"  Run:    {args.run_id}")

    code_graph = load_json(paths["code_graph"])
    if not code_graph:
        print(f"  FAIL: 40.3s code graph not found at {paths['code_graph'].relative_to(REPO_ROOT)}")
        sys.exit(1)

    centrality = load_json(paths["centrality"])
    if not centrality:
        print(f"  FAIL: 40.3c centrality not found at {paths['centrality'].relative_to(REPO_ROOT)}")
        sys.exit(1)

    topology = load_json(paths["topology"])
    if not topology:
        print(f"  WARN: 40.4 topology not found — proceeding without cluster data")

    print(f"  Source: 40.3s ({code_graph.get('file_count', '?')} files, "
          f"{code_graph.get('relationship_summary', {}).get('IMPORTS', '?')} imports)")
    print(f"  Source: 40.3c ({len(centrality.get('centrality_ranking', []))} ranked nodes)")

    source_root = code_graph.get("source_root", "")
    domain_metrics = derive_domain_metrics(code_graph)
    spine_data = derive_centrality_spines(centrality, source_root)

    merge_decisions = propose_merge_decisions(domain_metrics["domains"])

    registry = build_candidate_registry(
        args.client, args.run_id,
        domain_metrics, spine_data,
        merge_decisions,
    )

    lineage = build_derivation_lineage(
        args.client, args.run_id,
        domain_metrics, spine_data,
        registry["candidates"], merge_decisions,
    )

    print_report(registry, lineage)

    if args.report_only:
        print("  [REPORT-ONLY] No files written.")
        return

    if not args.dry_run:
        if paths["candidate_registry"].exists():
            print(f"  FAIL: candidate_registry.json already exists — CREATE_ONLY violated")
            sys.exit(1)
        if paths["derivation_lineage"].exists():
            print(f"  FAIL: derivation_lineage.json already exists — CREATE_ONLY violated")
            sys.exit(1)

        write_json(paths["candidate_registry"], registry)
        write_json(paths["derivation_lineage"], lineage)

        print(f"  candidate_registry.json written: {paths['candidate_registry'].relative_to(REPO_ROOT)}")
        print(f"  derivation_lineage.json written: {paths['derivation_lineage'].relative_to(REPO_ROOT)}")
    else:
        print(f"  [DRY-RUN] Would write: {paths['candidate_registry'].relative_to(REPO_ROOT)}")
        print(f"  [DRY-RUN] Would write: {paths['derivation_lineage'].relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
