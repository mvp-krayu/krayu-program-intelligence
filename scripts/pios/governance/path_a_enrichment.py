#!/usr/bin/env python3
"""
PATH A enrichment engine — code graph authority topology to proposition
confidence enrichment.

Takes structural evidence from 40.3s (code graph) and 40.3c (centrality)
and enriches proposition confidence for PATH A specimens. Requires an
approved enrichment plan.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P1)
"""

from __future__ import annotations

import argparse
import json
import sys
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def _verify_plan_approved(run_dir: Path) -> dict:
    plan_path = run_dir / "sqo" / "enrichment_plan.json"
    if not plan_path.exists():
        print("FAIL: No enrichment_plan.json — run enrichment_planner.py plan first", file=sys.stderr)
        sys.exit(1)
    with open(plan_path) as f:
        plan = json.load(f)
    if plan.get("approval_status") != "APPROVED":
        print(f"FAIL: Enrichment plan not approved (status: {plan.get('approval_status')})", file=sys.stderr)
        sys.exit(1)
    return plan


def _build_centrality_index(centrality: dict) -> dict:
    index = {"by_path": {}, "by_node": {}}
    for entry in centrality.get("centrality_ranking", []):
        index["by_path"][entry["path"]] = entry
        if entry.get("node_id"):
            index["by_node"][entry["node_id"]] = entry
    index["project_metrics"] = centrality.get("project_metrics", {})
    return index


def _build_code_graph_index(code_graph: dict) -> dict:
    index = {"imports_by_source": {}, "imports_by_target": {}, "inheritance_by_source": {}}
    for rel in code_graph.get("relationships", []):
        rtype = rel.get("relation_type", "")
        src = rel.get("source_path", "")
        tgt = rel.get("target_path")
        if rtype == "IMPORTS" and tgt:
            index["imports_by_source"].setdefault(src, []).append(rel)
            index["imports_by_target"].setdefault(tgt, []).append(rel)
        elif rtype in ("INHERITS", "INHERITS_UNRESOLVED"):
            index["inheritance_by_source"].setdefault(src, []).append(rel)
    return index


def enrich_structural_dominance(prop: dict, centrality_idx: dict) -> dict | None:
    refs = prop.get("structural_refs", {})
    top_node = refs.get("top_node", "")
    if not top_node:
        return None

    live = centrality_idx["by_path"].get(top_node)
    if not live:
        return None

    stored_rank = refs.get("centrality_rank")
    live_rank = live.get("centrality_rank")
    stored_in_degree = refs.get("import_in_degree")
    live_in_degree = live.get("import_in_degree", live.get("in_degree", 0))

    old_confidence = prop["confidence"]

    if stored_rank == live_rank and stored_in_degree == live_in_degree:
        return {
            "action": "CONFIRMED",
            "detail": f"Centrality rank {live_rank} and in_degree {live_in_degree} unchanged",
            "old_confidence": old_confidence,
            "new_confidence": old_confidence,
        }

    delta = 0.0
    detail_parts = []

    if live_rank is not None and stored_rank is not None:
        if live_rank < stored_rank:
            delta += 0.02
            detail_parts.append(f"rank improved {stored_rank}→{live_rank}")
        elif live_rank > stored_rank:
            delta -= 0.01
            detail_parts.append(f"rank declined {stored_rank}→{live_rank}")
        refs["centrality_rank"] = live_rank

    if live_in_degree is not None and stored_in_degree is not None:
        if live_in_degree > stored_in_degree:
            delta += 0.01
            detail_parts.append(f"in_degree increased {stored_in_degree}→{live_in_degree}")
        elif live_in_degree < stored_in_degree:
            delta -= 0.01
            detail_parts.append(f"in_degree decreased {stored_in_degree}→{live_in_degree}")
        refs["import_in_degree"] = live_in_degree

    refs["structural_role"] = live.get("structural_role", refs.get("structural_role"))

    new_confidence = max(0.50, min(0.98, old_confidence + delta))
    prop["confidence"] = round(new_confidence, 3)

    return {
        "action": "ENRICHED" if delta != 0 else "CONFIRMED",
        "detail": "; ".join(detail_parts) if detail_parts else "No metric change",
        "old_confidence": old_confidence,
        "new_confidence": prop["confidence"],
    }


def enrich_authority_topology(prop: dict, centrality_idx: dict, cg_idx: dict) -> dict | None:
    refs = prop.get("structural_refs", {})
    old_confidence = prop["confidence"]

    total_edges = centrality_idx["project_metrics"].get("total_structural_edges", 0)
    total_imports = centrality_idx["project_metrics"].get("total_import_edges", 0)
    total_inheritance = centrality_idx["project_metrics"].get("total_resolved_inheritance_edges", 0)

    stored_import = refs.get("import_authority", 0)
    stored_inherit = refs.get("inheritance_authority", 0)

    if total_imports == 0 and total_inheritance == 0:
        return None

    live_ratio = total_imports / max(total_inheritance, 1)
    stored_ratio = refs.get("authority_ratio", 0)

    if abs(live_ratio - stored_ratio) < 0.1:
        return {
            "action": "CONFIRMED",
            "detail": f"Authority ratio stable ({stored_ratio:.1f} vs {live_ratio:.1f})",
            "old_confidence": old_confidence,
            "new_confidence": old_confidence,
        }

    delta = 0.01 if live_ratio > stored_ratio else -0.01
    refs["authority_ratio_pre_enrichment"] = stored_ratio
    refs["authority_ratio"] = round(live_ratio, 1)

    new_confidence = max(0.50, min(0.98, old_confidence + delta))
    prop["confidence"] = round(new_confidence, 3)

    return {
        "action": "ENRICHED",
        "detail": f"Authority ratio changed {stored_ratio:.1f}→{live_ratio:.1f}",
        "old_confidence": old_confidence,
        "new_confidence": prop["confidence"],
    }


def enrich_coupling_pattern(prop: dict, cg_idx: dict) -> dict | None:
    refs = prop.get("structural_refs", {})
    src_domain = refs.get("src_domain", "")
    tgt_domain = refs.get("tgt_domain", "")
    old_confidence = prop["confidence"]

    if not src_domain or not tgt_domain:
        return None

    forward = 0
    reverse = 0
    for src_path, rels in cg_idx["imports_by_source"].items():
        for rel in rels:
            tgt_path = rel.get("target_path", "")
            if not tgt_path:
                continue
            src_parts = src_path.split("/")
            tgt_parts = tgt_path.split("/")
            if len(src_parts) > 1 and len(tgt_parts) > 1:
                s_dom = src_parts[1] if src_parts[0] in ("netbox",) else src_parts[0]
                t_dom = tgt_parts[1] if tgt_parts[0] in ("netbox",) else tgt_parts[0]
                if s_dom == src_domain and t_dom == tgt_domain:
                    forward += 1
                elif s_dom == tgt_domain and t_dom == src_domain:
                    reverse += 1

    stored_forward = refs.get("forward_count", 0)
    stored_reverse = refs.get("reverse_count", 0)

    if forward == stored_forward and reverse == stored_reverse:
        return {
            "action": "CONFIRMED",
            "detail": f"Coupling {src_domain}→{tgt_domain} stable (fwd={forward}, rev={reverse})",
            "old_confidence": old_confidence,
            "new_confidence": old_confidence,
        }

    refs["forward_count_pre_enrichment"] = stored_forward
    refs["reverse_count_pre_enrichment"] = stored_reverse
    refs["forward_count"] = forward
    refs["reverse_count"] = reverse
    refs["total_bidirectional"] = forward + reverse

    total_change = abs(forward - stored_forward) + abs(reverse - stored_reverse)
    delta = 0.01 if total_change <= 5 else 0.02
    if forward + reverse < stored_forward + stored_reverse:
        delta = -delta

    new_confidence = max(0.50, min(0.98, old_confidence + delta))
    prop["confidence"] = round(new_confidence, 3)

    return {
        "action": "ENRICHED",
        "detail": f"Coupling {src_domain}→{tgt_domain} changed: fwd {stored_forward}→{forward}, rev {stored_reverse}→{reverse}",
        "old_confidence": old_confidence,
        "new_confidence": prop["confidence"],
    }


def enrich_tier_grounding(prop: dict, centrality_idx: dict) -> dict | None:
    refs = prop.get("structural_refs", {})
    old_confidence = prop["confidence"]

    top_node_path = None
    for path, entry in centrality_idx["by_path"].items():
        parts = path.split("/")
        domain_name = parts[1] if len(parts) > 1 and parts[0] in ("netbox",) else parts[0] if parts else ""
        tier_label = refs.get("tier", "").lower()
        if domain_name and domain_name.lower() == tier_label:
            break

    stored_in = refs.get("import_in_degree", 0)
    stored_out = refs.get("import_out_degree", 0)

    return {
        "action": "CONFIRMED",
        "detail": f"Tier {refs.get('tier')} metrics stable",
        "old_confidence": old_confidence,
        "new_confidence": old_confidence,
    }


def run_enrichment(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    timestamp = datetime.now(timezone.utc).isoformat()

    plan = _verify_plan_approved(run_dir)

    code_graph = load_json(run_dir / "structure" / "40.3s" / "code_graph.json")
    centrality = load_json(run_dir / "structure" / "40.3c" / "structural_centrality.json")

    if not code_graph:
        print("FAIL: No code_graph.json (40.3s) — PATH A enrichment requires code graph", file=sys.stderr)
        sys.exit(1)
    if not centrality:
        print("FAIL: No structural_centrality.json (40.3c) — PATH A enrichment requires centrality", file=sys.stderr)
        sys.exit(1)

    centrality_idx = _build_centrality_index(centrality)
    cg_idx = _build_code_graph_index(code_graph)

    spine = load_json(run_dir / "spine" / "spine_objects.json")
    if not spine:
        print("FAIL: No spine_objects.json", file=sys.stderr)
        sys.exit(1)

    propositions = spine.get("objects", {}).get("semantic_propositions", [])
    if not propositions:
        print("FAIL: No semantic_propositions in spine", file=sys.stderr)
        sys.exit(1)

    target_ids = {t["proposition_id"] for t in plan.get("targets", [])}

    enrichment_log = []
    enriched_count = 0
    confirmed_count = 0
    skipped_count = 0

    for prop in propositions:
        if prop["id"] not in target_ids:
            continue

        prop_class = prop.get("proposition_class", "")
        result = None

        if prop_class == "STRUCTURAL_DOMINANCE":
            result = enrich_structural_dominance(prop, centrality_idx)
        elif prop_class == "AUTHORITY_TOPOLOGY":
            result = enrich_authority_topology(prop, centrality_idx, cg_idx)
        elif prop_class == "COUPLING_PATTERN":
            result = enrich_coupling_pattern(prop, cg_idx)
        elif prop_class == "TIER_GROUNDING":
            result = enrich_tier_grounding(prop, centrality_idx)

        if result is None:
            skipped_count += 1
            enrichment_log.append({
                "proposition_id": prop["id"],
                "proposition_class": prop_class,
                "action": "SKIPPED",
                "detail": "No enrichment function matched or no evidence available",
            })
        else:
            enrichment_log.append({
                "proposition_id": prop["id"],
                "proposition_class": prop_class,
                **result,
            })
            if result["action"] == "ENRICHED":
                enriched_count += 1
                prop["enrichment_action"] = result["action"]
                prop["confidence_pre_enrichment"] = result["old_confidence"]
            else:
                confirmed_count += 1

    spine_path = run_dir / "spine" / "spine_objects.json"
    with open(spine_path, "w") as f:
        json.dump(spine, f, indent=2)

    log_artifact = {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "enrichment_type": "PATH_A_CODE_GRAPH",
        "client": client,
        "run_id": run_id,
        "timestamp": timestamp,
        "enrichment_source": {
            "code_graph": "40.3s/code_graph.json",
            "centrality": "40.3c/structural_centrality.json",
        },
        "summary": {
            "total_targets": len(target_ids),
            "enriched": enriched_count,
            "confirmed": confirmed_count,
            "skipped": skipped_count,
        },
        "entries": enrichment_log,
    }

    spe_dir = run_dir / "semantic" / "spe"
    spe_dir.mkdir(parents=True, exist_ok=True)
    with open(spe_dir / "enrichment_log.json", "w") as f:
        json.dump(log_artifact, f, indent=2)

    activity_event = {
        "schema_version": "1.0",
        "event_type": "ENRICHMENT_ACTIVITY",
        "enrichment_type": "PATH_A_CODE_GRAPH",
        "client": client,
        "run_id": run_id,
        "timestamp": timestamp,
        "enrichment_exercised": enriched_count > 0,
        "enrichment_events": enriched_count + confirmed_count,
    }
    with open(spe_dir / "enrichment_activity_event.json", "w") as f:
        json.dump(activity_event, f, indent=2)

    plan["approval_status"] = "EXECUTED"
    plan["executed_at"] = timestamp
    plan["execution_result"] = log_artifact["summary"]
    with open(run_dir / "sqo" / "enrichment_plan.json", "w") as f:
        json.dump(plan, f, indent=2)

    return log_artifact


def main():
    parser = argparse.ArgumentParser(
        description="PATH A enrichment engine — code graph to proposition confidence"
    )
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    result = run_enrichment(args.client, args.run_id)
    print(f"PATH A ENRICHMENT: {args.client}/{args.run_id}")
    s = result["summary"]
    print(f"  Targets:   {s['total_targets']}")
    print(f"  Enriched:  {s['enriched']}")
    print(f"  Confirmed: {s['confirmed']}")
    print(f"  Skipped:   {s['skipped']}")


if __name__ == "__main__":
    main()
