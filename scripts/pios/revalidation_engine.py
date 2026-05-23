#!/usr/bin/env python3
"""
revalidation_engine.py
Contract: PI.SQO.REVALIDATION-ENGINE.01

Deterministic multi-phase revalidation of reviewed semantic corpus.
Proves structural integrity, confidence realism, governance cleanliness,
and SQO consistency before promotion eligibility.

Usage:
    python3 scripts/pios/revalidation_engine.py \
        --client blueedge --run-id run_blueedge_genesis_e2e_03

RULE: Deterministic — same corpus → same validation result.
RULE: No operator decision. No AI inference.
RULE: Proposition review must be COMPLETE before running.
RULE: Append-only event log.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.SQO.REVALIDATION-ENGINE.01"

VALID_TIERS = {"DIRECT_EVIDENCE", "DERIVED", "INFERRED"}
VALID_DISPOSITIONS = {"ACCEPTED", "REJECTED", "CONTESTED", "ARBITRATED"}
VALID_CLASSES = {"TIER_GROUNDING", "DOMAIN_EVIDENCE_GROUNDING", "CAPABILITY_EVIDENCE",
                 "VAULT_CLAIM_STRUCTURAL", "CROSS_DOMAIN_EVIDENCE"}


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def append_event(path: Path, event: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def check(phase: int, num: int, name: str, condition: bool, detail: str = "") -> dict:
    return {
        "phase": phase,
        "check_number": num,
        "check": name,
        "result": "PASS" if condition else "FAIL",
        "detail": detail,
    }


def run_revalidation(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    sqo_dir = run_dir / "sqo"
    spe_dir = run_dir / "semantic" / "spe"
    ceu_dir = run_dir / "ceu"
    spine_dir = run_dir / "spine"

    checks = []
    check_num = 0

    # --- Phase 1: Input Gate Verification ---
    review_state = load_json(spe_dir / "proposition_review_state.json")
    recon_state = load_json(ceu_dir / "reconciliation_state.json")
    propositions = load_json(spe_dir / "semantic_propositions.json")
    spine = load_json(spine_dir / "spine_objects.json")
    promotion_state = load_json(sqo_dir / "promotion_state.json")

    check_num += 1
    checks.append(check(1, check_num, "proposition_review_state_exists",
                        review_state is not None, "proposition_review_state.json present"))

    check_num += 1
    review_complete = review_state is not None and review_state.get("status") == "COMPLETE"
    checks.append(check(1, check_num, "proposition_review_complete",
                        review_complete, f"status={review_state.get('status') if review_state else 'MISSING'}"))

    check_num += 1
    checks.append(check(1, check_num, "reconciliation_state_exists",
                        recon_state is not None, "reconciliation_state.json present"))

    check_num += 1
    recon_complete = recon_state is not None and recon_state.get("reconciliation_status") == "COMPLETE"
    checks.append(check(1, check_num, "reconciliation_complete",
                        recon_complete, f"status={recon_state.get('reconciliation_status') if recon_state else 'MISSING'}"))

    check_num += 1
    checks.append(check(1, check_num, "semantic_propositions_exists",
                        propositions is not None, "semantic_propositions.json present"))

    check_num += 1
    checks.append(check(1, check_num, "spine_objects_exists",
                        spine is not None, "spine_objects.json present"))

    check_num += 1
    checks.append(check(1, check_num, "promotion_state_exists",
                        promotion_state is not None, "promotion_state.json present"))

    if not review_complete:
        return _finalize(checks, "INPUT_GATE_BLOCKED", "proposition review not COMPLETE",
                         client, run_id, sqo_dir)

    # --- Phase 2: Proposition Integrity ---
    props = []
    if propositions:
        props = propositions.get("propositions", [])

    check_num += 1
    checks.append(check(2, check_num, "propositions_non_empty",
                        len(props) > 0, f"count={len(props)}"))

    all_have_ids = all(p.get("id") for p in props)
    check_num += 1
    checks.append(check(2, check_num, "all_propositions_have_ids",
                        all_have_ids, f"total={len(props)}"))

    unique_ids = len(set(p.get("id", "") for p in props)) == len(props)
    check_num += 1
    checks.append(check(2, check_num, "proposition_ids_unique",
                        unique_ids, f"total={len(props)}"))

    all_have_class = all(p.get("proposition_class") for p in props)
    check_num += 1
    checks.append(check(2, check_num, "all_propositions_classified",
                        all_have_class, ""))

    # --- Phase 3: Confidence Realism ---
    confidences = [p.get("confidence", 0) for p in props]

    check_num += 1
    all_in_range = all(0 <= c <= 1.0 for c in confidences)
    checks.append(check(3, check_num, "confidence_values_in_range",
                        all_in_range, f"range=[{min(confidences, default=0):.2f}, {max(confidences, default=0):.2f}]"))

    check_num += 1
    no_perfect = not any(c == 1.0 for c in confidences)
    checks.append(check(3, check_num, "no_perfect_confidence",
                        no_perfect, "no proposition claims 1.0 confidence"))

    check_num += 1
    mean_conf = sum(confidences) / len(confidences) if confidences else 0
    realistic_mean = 0.1 <= mean_conf <= 0.95
    checks.append(check(3, check_num, "mean_confidence_realistic",
                        realistic_mean, f"mean={mean_conf:.3f}"))

    # --- Phase 4: Derivation Tier Validity ---
    tiers = [p.get("derivation_tier") for p in props]

    check_num += 1
    all_valid_tiers = all(t in VALID_TIERS for t in tiers if t)
    checks.append(check(4, check_num, "all_tiers_valid",
                        all_valid_tiers, f"tiers={set(tiers)}"))

    check_num += 1
    all_have_tiers = all(t for t in tiers)
    checks.append(check(4, check_num, "all_propositions_have_tiers",
                        all_have_tiers, ""))

    # --- Phase 5: Disposition Completeness ---
    dispositions = review_state.get("dispositions", {}) if review_state else {}

    check_num += 1
    all_resolved = all(d.get("disposition") in VALID_DISPOSITIONS for d in dispositions.values())
    checks.append(check(5, check_num, "all_dispositions_terminal",
                        all_resolved, f"total={len(dispositions)}"))

    check_num += 1
    prop_ids = {p.get("id") for p in props}
    disp_ids = set(dispositions.keys())
    coverage = prop_ids <= disp_ids
    checks.append(check(5, check_num, "disposition_coverage",
                        coverage, f"propositions={len(prop_ids)}, dispositions={len(disp_ids)}"))

    accepted_count = sum(1 for d in dispositions.values() if d.get("disposition") == "ACCEPTED")
    check_num += 1
    checks.append(check(5, check_num, "at_least_one_accepted",
                        accepted_count > 0, f"accepted={accepted_count}"))

    # --- Phase 6: Reconciliation Cleanliness ---
    candidates = recon_state.get("candidates", {}) if recon_state else {}

    check_num += 1
    all_candidates_terminal = all(
        c.get("state") in {"CONFIRMED", "REJECTED", "MERGED"}
        for c in candidates.values()
    )
    checks.append(check(6, check_num, "all_candidates_terminal",
                        all_candidates_terminal, f"total={len(candidates)}"))

    confirmed_count = sum(1 for c in candidates.values() if c.get("state") == "CONFIRMED")
    check_num += 1
    checks.append(check(6, check_num, "at_least_one_confirmed_ceu",
                        confirmed_count > 0, f"confirmed={confirmed_count}"))

    # --- Phase 7: Spine Consistency ---
    spine_props = spine.get("objects", {}).get("semantic_propositions", []) if spine else []

    check_num += 1
    spine_prop_count_matches = len(spine_props) == len(props)
    checks.append(check(7, check_num, "spine_proposition_count_matches",
                        spine_prop_count_matches,
                        f"spine={len(spine_props)}, spe={len(props)}"))

    check_num += 1
    spine_has_specimen = spine.get("specimen_id") == client if spine else False
    checks.append(check(7, check_num, "spine_specimen_matches",
                        spine_has_specimen, f"specimen={spine.get('specimen_id') if spine else 'MISSING'}"))

    # --- Phase 8: SQO State Consistency ---
    check_num += 1
    promo_exists = promotion_state is not None
    checks.append(check(8, check_num, "promotion_state_consistent",
                        promo_exists, "promotion_state.json exists and readable"))

    if promotion_state:
        current_level = promotion_state.get("s_level", promotion_state.get("current_state", "?"))
        check_num += 1
        checks.append(check(8, check_num, "current_s_level_valid",
                            current_level in {"S0", "S1", "S2"},
                            f"current={current_level}"))

    return _finalize(checks, None, None, client, run_id, sqo_dir)


def _finalize(checks: list, forced_status: Optional[str], forced_reason: Optional[str],
              client: str, run_id: str, sqo_dir: Path) -> dict:
    passed = sum(1 for c in checks if c["result"] == "PASS")
    failed = sum(1 for c in checks if c["result"] == "FAIL")
    total = len(checks)

    if forced_status:
        status = forced_status
        reason = forced_reason
    elif failed == 0:
        status = "PASS"
        reason = f"All {total} checks passed"
    elif failed <= 2:
        status = "PARTIAL"
        reason = f"{failed}/{total} checks failed"
    else:
        status = "FAIL"
        reason = f"{failed}/{total} checks failed"

    failed_checks = [c for c in checks if c["result"] == "FAIL"]

    result = {
        "contract_id": CONTRACT_ID,
        "client_id": client,
        "run_id": run_id,
        "status": status,
        "reason": reason,
        "total_checks": total,
        "passed": passed,
        "failed": failed,
        "failed_checks": [c["check"] for c in failed_checks],
        "checks": checks,
        "generated_at": now_iso(),
    }

    result_path = sqo_dir / "revalidation_result.json"
    save_json(result_path, result)

    event_log = sqo_dir / "revalidation_event_log.jsonl"
    append_event(event_log, {
        "event_type": "revalidation_completed",
        "status": status,
        "total_checks": total,
        "passed": passed,
        "failed": failed,
        "timestamp": now_iso(),
    })

    return result


def main() -> int:
    p = argparse.ArgumentParser(description="Deterministic revalidation engine")
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    args = p.parse_args()

    print(f"REVALIDATION: {args.client}/{args.run_id}")
    print()

    result = run_revalidation(args.client, args.run_id)

    print(f"  Status: {result['status']}")
    print(f"  Checks: {result['passed']}/{result['total_checks']} PASS")
    if result["failed"] > 0:
        print(f"  Failed: {result['failed']}")
        for c in result["checks"]:
            if c["result"] == "FAIL":
                print(f"    FAIL: {c['check']} — {c.get('detail', '')}")
    print()
    print(f"  revalidation_result.json written")

    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
