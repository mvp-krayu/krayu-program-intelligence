#!/usr/bin/env python3
"""
constitutional_replay_anchor.py
Contract: PI.SQO.CONSTITUTIONAL-REPLAY-ANCHOR.01

Constitutional semantic adequacy check before S-level advancement.
Compares candidate qualification corpus against reference specimen
qualification evidence. Blocks advancement when dimensional distance
is too high.

This is NOT parity enforcement. It is constitutional semantic
adequacy checking — ensuring the candidate corpus is in the same
semantic neighborhood as a known-good qualification.

Usage:
    python3 scripts/pios/constitutional_replay_anchor.py \
        --client blueedge \
        --run-id run_blueedge_genesis_e2e_03 \
        --target S1

RULE: Must run BEFORE promotion evaluation.
RULE: CONSTITUTIONAL_DISTANCE_TOO_HIGH blocks advancement automatically.
RULE: Reference specimen is loaded, not hardcoded thresholds.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.SQO.CONSTITUTIONAL-REPLAY-ANCHOR.01"

REFERENCE_SPECIMEN = "netbox"
REFERENCE_RUN = "run_github_netbox_20260520_134600"


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_reference_dimensions() -> Optional[dict]:
    """Load qualification dimensions from reference specimen."""
    ref_dir = REPO_ROOT / "clients" / REFERENCE_SPECIMEN / "psee" / "runs" / REFERENCE_RUN

    spe_report = load_json(ref_dir / "semantic" / "spe" / "spe_derivation_report.json")
    review_obligations = load_json(ref_dir / "sqo" / "review_obligations.json")
    promotion_state = load_json(ref_dir / "sqo" / "promotion_state.json")

    if not spe_report:
        return None

    conf_report = spe_report.get("confidence_report", {})
    class_dist = conf_report.get("class_distribution", {})
    tier_dist = conf_report.get("tier_distribution", {})

    review_summary = {}
    if promotion_state:
        lanes = promotion_state.get("lanes", {})
        review_lane = lanes.get("review_queue", {})
        review_summary = review_lane.get("review_summary", {})

    s2_checkpoint = promotion_state.get("s2_checkpoint", {}) if promotion_state else {}
    corpus_snapshot = s2_checkpoint.get("corpus_snapshot", {})

    return {
        "specimen_id": REFERENCE_SPECIMEN,
        "run_id": REFERENCE_RUN,
        "proposition_count": spe_report.get("proposition_count", 0),
        "class_count": len(class_dist),
        "class_distribution": class_dist,
        "tier_count": len(tier_dist),
        "tier_distribution": tier_dist,
        "mean_confidence": conf_report.get("mean_confidence", 0),
        "min_confidence": conf_report.get("min_confidence", 0),
        "max_confidence": conf_report.get("max_confidence", 0),
        "confidence_variance": conf_report.get("max_confidence", 0) - conf_report.get("min_confidence", 0),
        "review_obligations": review_obligations.get("total_obligations", 0) if review_obligations else 0,
        "governance_friction": {
            "rejected_classes": review_summary.get("rejected", 0),
            "arbitrated": review_summary.get("accepted_via_arbitration", 0),
            "total_governance_events": review_summary.get("governance_events", 0),
        },
        "rejected_classes": corpus_snapshot.get("rejected_classes", []),
        "governance_streams": len(
            promotion_state.get("promotion_lineage", {})
            .get("transitions", [{}])[-1]
            .get("governance_lineage", [])
        ) if promotion_state else 0,
    }


def load_candidate_dimensions(client: str, run_id: str) -> dict:
    """Load qualification dimensions from candidate specimen."""
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id

    spe_report = load_json(run_dir / "semantic" / "spe" / "spe_derivation_report.json")
    propositions = load_json(run_dir / "semantic" / "spe" / "semantic_propositions.json")
    review_state = load_json(run_dir / "semantic" / "spe" / "proposition_review_state.json")
    recon_state = load_json(run_dir / "ceu" / "reconciliation_state.json")
    spine = load_json(run_dir / "spine" / "spine_objects.json")
    promotion_state = load_json(run_dir / "sqo" / "promotion_state.json")
    review_obligations = load_json(run_dir / "sqo" / "review_obligations.json")
    qualification_blockers = load_json(run_dir / "sqo" / "qualification_blockers.json")
    revalidation = load_json(run_dir / "sqo" / "revalidation_result.json")

    props = []
    if propositions:
        props = propositions.get("propositions", [])

    class_dist = {}
    tier_dist = {}
    confidences = []
    for p in props:
        cls = p.get("proposition_class", "UNKNOWN")
        class_dist[cls] = class_dist.get(cls, 0) + 1
        tier = p.get("derivation_tier", "UNKNOWN")
        tier_dist[tier] = tier_dist.get(tier, 0) + 1
        confidences.append(p.get("confidence", 0))

    mean_conf = sum(confidences) / len(confidences) if confidences else 0
    min_conf = min(confidences) if confidences else 0
    max_conf = max(confidences) if confidences else 0

    # Count governance friction from review state
    dispositions = review_state.get("dispositions", {}) if review_state else {}
    rejected_count = sum(1 for d in dispositions.values() if d.get("disposition") == "REJECTED")
    contested_count = sum(1 for d in dispositions.values() if d.get("disposition") == "CONTESTED")
    arbitrated_count = sum(1 for d in dispositions.values() if d.get("disposition") == "ARBITRATED")

    # Count governance events from event logs
    governance_event_count = 0
    event_log_paths = [
        run_dir / "ceu" / "reconciliation_event_log.jsonl",
        run_dir / "semantic" / "spe" / "proposition_review_event_log.jsonl",
        run_dir / "sqo" / "promotion_event_log.jsonl",
        run_dir / "sqo" / "revalidation_event_log.jsonl",
    ]
    for elp in event_log_paths:
        if elp.exists():
            with open(elp, encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        governance_event_count += 1

    # Enrichment: check for enrichment_activity_event.json (SQO execution graph signal)
    enrichment_present = False
    enrichment_event = run_dir / "semantic" / "spe" / "enrichment_activity_event.json"
    if enrichment_event.exists():
        with open(enrichment_event) as f:
            event = json.load(f)
        enrichment_present = event.get("enrichment_exercised", False)
    if not enrichment_present:
        enrichment_dir = run_dir / "enrichment"
        if enrichment_dir.exists():
            enrichment_present = any(enrichment_dir.iterdir())

    return {
        "specimen_id": client,
        "run_id": run_id,
        "proposition_count": len(props),
        "class_count": len(class_dist),
        "class_distribution": class_dist,
        "tier_count": len(tier_dist),
        "tier_distribution": tier_dist,
        "mean_confidence": round(mean_conf, 4),
        "min_confidence": round(min_conf, 4),
        "max_confidence": round(max_conf, 4),
        "confidence_variance": round(max_conf - min_conf, 4),
        "review_obligations": review_obligations.get("total_obligations", 0) if review_obligations else 0,
        "governance_friction": {
            "rejected_count": rejected_count,
            "contested_count": contested_count,
            "arbitrated_count": arbitrated_count,
            "total_governance_events": governance_event_count,
        },
        "enrichment_present": enrichment_present,
        "qualification_blockers_present": qualification_blockers is not None,
        "revalidation_checks": revalidation.get("total_checks", 0) if revalidation else 0,
    }


def compute_dimensional_assessment(ref: dict, cand: dict, target: str) -> dict:
    """
    Compute constitutional dimensional distance.

    Each dimension produces a ratio and a verdict.
    The overall assessment blocks if critical dimensions fail.
    """
    dimensions = []

    # D1: Proposition count magnitude
    ref_count = ref["proposition_count"]
    cand_count = cand["proposition_count"]
    ratio = cand_count / ref_count if ref_count > 0 else 0
    # Below 20% of reference = critically thin
    dimensions.append({
        "dimension": "proposition_count",
        "reference": ref_count,
        "candidate": cand_count,
        "ratio": round(ratio, 3),
        "threshold": 0.20,
        "verdict": "PASS" if ratio >= 0.20 else "FAIL",
        "severity": "CRITICAL",
    })

    # D2: Proposition class diversity
    ref_classes = ref["class_count"]
    cand_classes = cand["class_count"]
    ratio = cand_classes / ref_classes if ref_classes > 0 else 0
    # Below 33% class diversity = critically narrow
    dimensions.append({
        "dimension": "class_diversity",
        "reference": ref_classes,
        "candidate": cand_classes,
        "ratio": round(ratio, 3),
        "threshold": 0.33,
        "verdict": "PASS" if ratio >= 0.33 else "FAIL",
        "severity": "CRITICAL",
    })

    # D3: Review obligation presence
    ref_obligations = ref["review_obligations"]
    cand_obligations = cand["review_obligations"]
    has_obligations = cand_obligations > 0
    dimensions.append({
        "dimension": "review_obligations",
        "reference": ref_obligations,
        "candidate": cand_obligations,
        "ratio": cand_obligations / ref_obligations if ref_obligations > 0 else 0,
        "threshold": ">=1",
        "verdict": "PASS" if has_obligations else "FAIL",
        "severity": "CRITICAL" if target == "S2" else "HIGH",
    })

    # D4: Governance friction
    ref_friction = ref["governance_friction"]
    cand_friction = cand["governance_friction"]
    ref_friction_total = ref_friction.get("rejected_classes", 0) + ref_friction.get("arbitrated", 0)
    cand_friction_total = (cand_friction.get("rejected_count", 0)
                           + cand_friction.get("contested_count", 0)
                           + cand_friction.get("arbitrated_count", 0))
    has_friction = cand_friction_total > 0
    dimensions.append({
        "dimension": "governance_friction",
        "reference": ref_friction_total,
        "candidate": cand_friction_total,
        "ratio": None,
        "threshold": ">=1 friction event",
        "verdict": "PASS" if has_friction else "FAIL",
        "severity": "CRITICAL" if target == "S2" else "HIGH",
    })

    # D5: Confidence distribution (variance > 0 = real distribution, not flat)
    ref_var = ref["confidence_variance"]
    cand_var = cand["confidence_variance"]
    has_variance = cand_var > 0.05
    dimensions.append({
        "dimension": "confidence_distribution",
        "reference": round(ref_var, 3),
        "candidate": round(cand_var, 3),
        "ratio": None,
        "threshold": ">0.05 variance",
        "verdict": "PASS" if has_variance else "FAIL",
        "severity": "HIGH",
    })

    # D6: Semantic breadth (tier diversity)
    ref_tiers = ref["tier_count"]
    cand_tiers = cand["tier_count"]
    ratio = cand_tiers / ref_tiers if ref_tiers > 0 else 0
    dimensions.append({
        "dimension": "tier_diversity",
        "reference": ref_tiers,
        "candidate": cand_tiers,
        "ratio": round(ratio, 3),
        "threshold": 0.50,
        "verdict": "PASS" if ratio >= 0.50 else "FAIL",
        "severity": "HIGH",
    })

    # D7: Governance event density
    ref_events = ref["governance_friction"].get("total_governance_events", 0)
    cand_events = cand["governance_friction"].get("total_governance_events", 0)
    ratio = cand_events / ref_events if ref_events > 0 else 0
    dimensions.append({
        "dimension": "governance_event_density",
        "reference": ref_events,
        "candidate": cand_events,
        "ratio": round(ratio, 3),
        "threshold": 0.20,
        "verdict": "PASS" if ratio >= 0.20 else "FAIL",
        "severity": "MEDIUM",
    })

    # D8: Enrichment activity (required for S2, recommended for S1)
    enrichment = cand.get("enrichment_present", False)
    dimensions.append({
        "dimension": "enrichment_activity",
        "reference": True,
        "candidate": enrichment,
        "ratio": None,
        "threshold": "present",
        "verdict": "PASS" if enrichment else "FAIL",
        "severity": "CRITICAL" if target == "S2" else "MEDIUM",
    })

    # Compute overall verdict
    critical_fails = [d for d in dimensions if d["verdict"] == "FAIL" and d["severity"] == "CRITICAL"]
    high_fails = [d for d in dimensions if d["verdict"] == "FAIL" and d["severity"] == "HIGH"]
    medium_fails = [d for d in dimensions if d["verdict"] == "FAIL" and d["severity"] == "MEDIUM"]
    total_pass = sum(1 for d in dimensions if d["verdict"] == "PASS")
    total_fail = sum(1 for d in dimensions if d["verdict"] == "FAIL")

    if critical_fails:
        overall = "CONSTITUTIONAL_DISTANCE_TOO_HIGH"
        block = True
        reason = f"{len(critical_fails)} CRITICAL dimension(s) failed: {[d['dimension'] for d in critical_fails]}"
    elif len(high_fails) >= 2:
        overall = "CONSTITUTIONAL_DISTANCE_HIGH"
        block = True
        reason = f"{len(high_fails)} HIGH dimension(s) failed: {[d['dimension'] for d in high_fails]}"
    elif high_fails:
        overall = "CONSTITUTIONAL_DISTANCE_ELEVATED"
        block = False
        reason = f"1 HIGH dimension failed: {high_fails[0]['dimension']} — operator override permitted"
    else:
        overall = "CONSTITUTIONAL_DISTANCE_ACCEPTABLE"
        block = False
        reason = f"{total_pass}/{len(dimensions)} dimensions pass"

    return {
        "overall_verdict": overall,
        "advancement_blocked": block,
        "reason": reason,
        "target_level": target,
        "dimensions": dimensions,
        "summary": {
            "total": len(dimensions),
            "passed": total_pass,
            "failed": total_fail,
            "critical_fails": len(critical_fails),
            "high_fails": len(high_fails),
            "medium_fails": len(medium_fails),
        },
    }


def run_anchor(client: str, run_id: str, target: str) -> dict:
    ref = load_reference_dimensions()
    if ref is None:
        return {
            "contract_id": CONTRACT_ID,
            "status": "REFERENCE_UNAVAILABLE",
            "advancement_blocked": True,
            "reason": f"Reference specimen {REFERENCE_SPECIMEN}/{REFERENCE_RUN} not available",
            "generated_at": now_iso(),
        }

    cand = load_candidate_dimensions(client, run_id)
    assessment = compute_dimensional_assessment(ref, cand, target)

    result = {
        "contract_id": CONTRACT_ID,
        "candidate": {"specimen_id": client, "run_id": run_id},
        "reference": {"specimen_id": ref["specimen_id"], "run_id": ref["run_id"]},
        "target_level": target,
        "reference_dimensions": ref,
        "candidate_dimensions": cand,
        "assessment": assessment,
        "status": assessment["overall_verdict"],
        "advancement_blocked": assessment["advancement_blocked"],
        "generated_at": now_iso(),
    }

    sqo_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "sqo"
    save_json(sqo_dir / "constitutional_replay_anchor.json", result)

    return result


def main() -> int:
    p = argparse.ArgumentParser(description="Constitutional replay anchor — semantic adequacy check")
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    p.add_argument("--target", required=True, choices=["S1", "S2"])
    args = p.parse_args()

    print(f"CONSTITUTIONAL REPLAY ANCHOR: {args.client}/{args.run_id} → {args.target}")
    print(f"  Reference: {REFERENCE_SPECIMEN}/{REFERENCE_RUN}")
    print()

    result = run_anchor(args.client, args.run_id, args.target)

    if result.get("status") == "REFERENCE_UNAVAILABLE":
        print(f"  BLOCKED: {result['reason']}")
        return 1

    assessment = result["assessment"]
    ref = result["reference_dimensions"]
    cand = result["candidate_dimensions"]

    print(f"  {'Dimension':<30s}  {'Ref':>6s}  {'Cand':>6s}  {'Ratio':>6s}  {'Verdict':<8s}  Severity")
    print(f"  {'─' * 30}  {'─' * 6}  {'─' * 6}  {'─' * 6}  {'─' * 8}  {'─' * 8}")
    for d in assessment["dimensions"]:
        ref_val = str(d["reference"])[:6]
        cand_val = str(d["candidate"])[:6]
        ratio_str = f"{d['ratio']:.3f}" if d["ratio"] is not None else "—"
        marker = "██" if d["verdict"] == "FAIL" else "  "
        print(f"  {d['dimension']:<30s}  {ref_val:>6s}  {cand_val:>6s}  {ratio_str:>6s}  {d['verdict']:<8s}  {d['severity']:<8s} {marker}")

    print()
    s = assessment["summary"]
    print(f"  Result: {s['passed']}/{s['total']} PASS, {s['failed']} FAIL")
    print(f"    CRITICAL: {s['critical_fails']}, HIGH: {s['high_fails']}, MEDIUM: {s['medium_fails']}")
    print()
    print(f"  Verdict: {assessment['overall_verdict']}")
    print(f"  Reason: {assessment['reason']}")
    print(f"  Advancement blocked: {assessment['advancement_blocked']}")
    print()
    print(f"  constitutional_replay_anchor.json written")

    return 1 if assessment["advancement_blocked"] else 0


if __name__ == "__main__":
    sys.exit(main())
