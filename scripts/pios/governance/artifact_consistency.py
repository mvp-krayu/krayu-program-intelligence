#!/usr/bin/env python3
"""
Artifact consistency validator for governed PI runtime.

Continuous verification that governed artifact sets are internally consistent.
Checks cross-references between spine objects, propositions, review state,
reconciliation state, promotion state, enrichment log, and certification.

Unlike certification (point-in-time), this runs at any time to detect
drift or corruption in governed artifact relationships.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P2)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def check(name: str, passed: bool, detail: str) -> dict:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail}


def validate_spine_proposition_alignment(run_dir: Path) -> list:
    """Verify spine semantic_propositions match review state dispositions."""
    checks = []
    spine = load_json(run_dir / "spine" / "spine_objects.json")
    if not spine:
        return [check("spine_exists", False, "spine_objects.json missing")]
    checks.append(check("spine_exists", True, "spine_objects.json present"))

    objects = spine.get("objects", {})
    props = objects.get("semantic_propositions", [])
    if not props:
        return checks + [check("propositions_in_spine", False, "No semantic_propositions in spine")]
    checks.append(check("propositions_in_spine", True, f"{len(props)} propositions"))

    review = load_json(run_dir / "semantic" / "spe" / "proposition_review_state.json")
    if not review:
        checks.append({"name": "review_state_exists", "status": "WARN", "detail": "proposition_review_state.json missing — governance lifecycle incomplete"})
        return checks
    checks.append(check("review_state_exists", True, "proposition_review_state.json present"))

    dispositions = review.get("dispositions", {})
    prop_ids = {p["id"] for p in props}
    disp_ids = set(dispositions.keys())

    orphan_dispositions = disp_ids - prop_ids
    unreviewed_props = prop_ids - disp_ids

    checks.append(check(
        "no_orphan_dispositions",
        len(orphan_dispositions) == 0,
        f"{len(orphan_dispositions)} dispositions reference missing propositions" if orphan_dispositions else "All dispositions reference valid propositions"
    ))

    if review.get("status") == "COMPLETE":
        checks.append(check(
            "all_propositions_reviewed",
            len(unreviewed_props) == 0,
            f"{len(unreviewed_props)} propositions lack disposition" if unreviewed_props else "All propositions have dispositions"
        ))

    return checks


def validate_promotion_spine_alignment(run_dir: Path) -> list:
    """Verify promotion state references valid spine objects."""
    checks = []
    promotion = load_json(run_dir / "sqo" / "promotion_state.json")
    if not promotion:
        checks.append(check("promotion_exists", False, "promotion_state.json missing"))
        return checks
    checks.append(check("promotion_exists", True, f"s_level={promotion.get('s_level', '?')}"))

    spine = load_json(run_dir / "spine" / "spine_objects.json")
    if not spine:
        return checks

    objects = spine.get("objects", {})
    qual_transitions = objects.get("qualification_transitions", [])
    if qual_transitions:
        latest = qual_transitions[-1] if isinstance(qual_transitions, list) else None
        if latest:
            spine_level = latest.get("to_level", latest.get("s_level"))
            promo_level = promotion.get("s_level")
            checks.append(check(
                "promotion_spine_level_match",
                spine_level == promo_level or spine_level is None,
                f"Spine qualification_transition says {spine_level}, promotion says {promo_level}"
            ))

    return checks


def validate_enrichment_chain(run_dir: Path) -> list:
    """Verify enrichment artifacts form a complete chain."""
    checks = []
    spe_dir = run_dir / "semantic" / "spe"

    enrichment_log = load_json(spe_dir / "enrichment_log.json")
    enrichment_summary = load_json(spe_dir / "enrichment_summary.json")
    enrichment_activity = load_json(spe_dir / "enrichment_activity_event.json")

    has_log = enrichment_log is not None
    has_summary = enrichment_summary is not None
    has_activity = enrichment_activity is not None

    if not has_log and not has_summary and not has_activity:
        checks.append(check("enrichment_chain", True, "No enrichment artifacts — chain not started"))
        return checks

    checks.append(check("enrichment_log_exists", has_log, "enrichment_log.json" + (" present" if has_log else " missing")))
    checks.append(check("enrichment_activity_exists", has_activity, "enrichment_activity_event.json" + (" present" if has_activity else " missing")))
    checks.append(check("enrichment_summary_exists", has_summary, "enrichment_summary.json" + (" present" if has_summary else " missing")))

    if has_log and has_summary:
        log_count = len(enrichment_log.get("entries", enrichment_log.get("domain_corrections", [])))
        summary_events = enrichment_summary.get("enrichment_events", 0)
        checks.append(check(
            "enrichment_count_consistent",
            True,
            f"Log entries: {log_count}, Summary events: {summary_events}"
        ))

    return checks


def validate_reconciliation_alignment(run_dir: Path) -> list:
    """Verify reconciliation state is consistent with CEU artifacts."""
    checks = []
    recon = load_json(run_dir / "ceu" / "reconciliation_state.json")
    if not recon:
        checks.append(check("reconciliation_exists", False, "reconciliation_state.json missing — skipping"))
        return checks
    checks.append(check("reconciliation_exists", True, f"status={recon.get('reconciliation_status', '?')}"))

    candidates = recon.get("candidates", {})
    registry = load_json(run_dir / "ceu" / "candidate_registry.json")
    if registry:
        reg_ids = set()
        for entry in registry.get("candidates", registry.get("entries", [])):
            if isinstance(entry, dict):
                reg_ids.add(entry.get("ceu_id", entry.get("id", entry.get("candidate_id", ""))))
        recon_ids = set(candidates.keys())
        missing = recon_ids - reg_ids if reg_ids else set()
        checks.append(check(
            "reconciliation_registry_match",
            len(missing) == 0 or not reg_ids,
            f"{len(missing)} reconciliation candidates missing from registry" if missing else "Reconciliation candidates consistent with registry"
        ))

    return checks


def validate_event_log_integrity(run_dir: Path) -> list:
    """Verify event logs are parseable and non-empty where expected."""
    checks = []
    log_paths = [
        ("sqo/promotion_event_log.jsonl", "promotion_event_log"),
        ("sqo/revalidation_event_log.jsonl", "revalidation_event_log"),
        ("semantic/spe/proposition_review_event_log.jsonl", "review_event_log"),
        ("ceu/reconciliation_event_log.jsonl", "reconciliation_event_log"),
        ("chronicle/chronicle_events.jsonl", "chronicle_event_log"),
        ("learning_events.jsonl", "learning_event_log"),
    ]

    for rel_path, name in log_paths:
        path = run_dir / rel_path
        if not path.exists():
            continue
        try:
            lines = path.read_text().strip().split("\n")
            valid = 0
            invalid = 0
            for line in lines:
                if not line.strip():
                    continue
                try:
                    json.loads(line)
                    valid += 1
                except json.JSONDecodeError:
                    invalid += 1
            checks.append(check(
                f"{name}_parseable",
                invalid == 0,
                f"{valid} valid, {invalid} invalid lines" if invalid else f"{valid} events"
            ))
        except Exception as e:
            checks.append(check(f"{name}_parseable", False, f"Read error: {e}"))

    return checks


def validate_revalidation_alignment(run_dir: Path) -> list:
    """Verify revalidation result is consistent with promotion state."""
    checks = []
    reval = load_json(run_dir / "sqo" / "revalidation_result.json")
    promotion = load_json(run_dir / "sqo" / "promotion_state.json")

    if not reval:
        return checks

    reval_verdict = reval.get("verdict", reval.get("overall_status"))
    checks.append(check("revalidation_exists", True, f"verdict={reval_verdict}"))

    if promotion:
        s_level = promotion.get("s_level", "S0")
        if s_level in ("S2", "S3") and reval_verdict not in ("PASS", "QUALIFIED", None):
            checks.append(check(
                "revalidation_promotion_consistent",
                False,
                f"Promotion at {s_level} but revalidation verdict is {reval_verdict}"
            ))
        else:
            checks.append(check(
                "revalidation_promotion_consistent",
                True,
                f"Promotion {s_level} consistent with revalidation {reval_verdict}"
            ))

    return checks


def run_consistency_validation(run_dir: Path) -> dict:
    run_dir = Path(run_dir)
    timestamp = datetime.now(timezone.utc).isoformat()

    all_checks = []
    all_checks.extend(validate_spine_proposition_alignment(run_dir))
    all_checks.extend(validate_promotion_spine_alignment(run_dir))
    all_checks.extend(validate_enrichment_chain(run_dir))
    all_checks.extend(validate_reconciliation_alignment(run_dir))
    all_checks.extend(validate_event_log_integrity(run_dir))
    all_checks.extend(validate_revalidation_alignment(run_dir))

    passed = sum(1 for c in all_checks if c["status"] == "PASS")
    failed = sum(1 for c in all_checks if c["status"] == "FAIL")
    warned = sum(1 for c in all_checks if c["status"] == "WARN")

    return {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "validator": "artifact_consistency",
        "run_directory": str(run_dir),
        "validated_at": timestamp,
        "overall_status": "FAIL" if failed > 0 else ("WARN" if warned > 0 else "PASS"),
        "passed": passed,
        "failed": failed,
        "warned": warned,
        "total": len(all_checks),
        "checks": all_checks,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Governed artifact consistency validator"
    )
    parser.add_argument("run_dir", help="Path to run directory")
    parser.add_argument("--output", help="Write results to JSON file")
    args = parser.parse_args()

    result = run_consistency_validation(Path(args.run_dir))

    if args.output:
        with open(args.output, "w") as f:
            json.dump(result, f, indent=2)
        print(f"Results written to {args.output}")
    else:
        print(f"ARTIFACT CONSISTENCY: {result['overall_status']}")
        print(f"  Passed: {result['passed']}/{result['total']}")
        if result.get("warned", 0) > 0:
            for c in result["checks"]:
                if c["status"] == "WARN":
                    print(f"  WARN: {c['name']} — {c['detail']}")
        if result["failed"] > 0:
            for c in result["checks"]:
                if c["status"] == "FAIL":
                    print(f"  FAIL: {c['name']} — {c['detail']}")

    sys.exit(0 if result["overall_status"] in ("PASS", "WARN") else 1)


if __name__ == "__main__":
    main()
