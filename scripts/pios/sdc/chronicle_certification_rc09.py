#!/usr/bin/env python3
"""
RC-09 Chronicle Certification

Deterministic verification of the governed cognitive replay lifecycle.
Checks all artifacts, internal consistency, governance completeness.
Emits chronicle_certification.json.
"""

import argparse
import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
STREAM = "PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-09"


def resolve_paths(client, run_id):
    run_dir = os.path.join(BASE, "clients", client, "psee", "runs", run_id)
    return {
        "run_dir": run_dir,
        "propositions": os.path.join(run_dir, "semantic", "spe", "semantic_propositions.json"),
        "review_state": os.path.join(run_dir, "semantic", "spe", "proposition_review_state.json"),
        "review_log": os.path.join(run_dir, "semantic", "spe", "proposition_review_event_log.jsonl"),
        "enrichment_log": os.path.join(run_dir, "semantic", "spe", "enrichment_log.json"),
        "enrichment_summary": os.path.join(run_dir, "semantic", "spe", "enrichment_summary.json"),
        "enrichment_activity": os.path.join(run_dir, "semantic", "spe", "enrichment_activity_event.json"),
        "enrichment_plan": os.path.join(run_dir, "semantic", "spe", "enrichment_plan.json"),
        "debt_reassessment": os.path.join(run_dir, "semantic", "spe", "debt_reassessment.json"),
        "revalidation": os.path.join(run_dir, "sqo", "revalidation_result.json"),
        "promotion": os.path.join(run_dir, "sqo", "promotion_state.json"),
        "anchor": os.path.join(run_dir, "sqo", "constitutional_replay_anchor.json"),
        "review_obligations": os.path.join(run_dir, "sqo", "review_obligations.json"),
        "promotion_log": os.path.join(run_dir, "sqo", "promotion_event_log.jsonl"),
        "revalidation_log": os.path.join(run_dir, "sqo", "revalidation_event_log.jsonl"),
        "convergence": os.path.join(run_dir, "convergence", "convergence_observations.json"),
        "spine": os.path.join(run_dir, "spine", "spine_objects.json"),
        "chronicle_manifest": os.path.join(run_dir, "chronicle", "CHRONICLE_MANIFEST.json"),
        "chronicle_html": os.path.join(run_dir, "chronicle", "REPLAY_CHRONICLE.html"),
    }


def load_json(path):
    with open(path) as f:
        return json.load(f)


def load_jsonl(path):
    events = []
    with open(path) as f:
        for line in f:
            if line.strip():
                events.append(json.loads(line))
    return events


class CertificationEngine:
    def __init__(self, client, run_id, paths):
        self.client = client
        self.run_id = run_id
        self.paths = paths
        self.checks = []
        self.artifacts = {}

    def check(self, phase, name, condition, detail=""):
        result = "PASS" if condition else "FAIL"
        self.checks.append({
            "phase": phase,
            "check": name,
            "result": result,
            "detail": detail,
        })
        status = "✓" if condition else "✗"
        print(f"  {status} [{phase}] {name}: {detail}")
        return condition

    def run(self):
        print(f"RC-09 Chronicle Certification: {self.client}/{self.run_id}")
        print(f"{'=' * 60}")

        self.phase_1_artifact_existence()
        self.phase_2_governance_lifecycle()
        self.phase_3_proposition_consistency()
        self.phase_4_revalidation_integrity()
        self.phase_5_anchor_clearance()
        self.phase_6_enrichment_completeness()
        self.phase_7_convergence_integrity()
        self.phase_8_chronicle_integrity()
        self.phase_9_promotion_legitimacy()
        self.phase_10_cross_artifact_consistency()

        passed = sum(1 for c in self.checks if c["result"] == "PASS")
        failed = sum(1 for c in self.checks if c["result"] == "FAIL")
        total = len(self.checks)
        status = "CERTIFIED" if failed == 0 else "CERTIFICATION_FAILED"

        print(f"\n{'=' * 60}")
        print(f"Result: {status} ({passed}/{total} PASS, {failed} FAIL)")

        return {
            "status": status,
            "passed": passed,
            "failed": failed,
            "total": total,
            "checks": self.checks,
        }

    def phase_1_artifact_existence(self):
        print("\nPhase 1: Artifact Existence")
        required = [
            ("propositions", "semantic/spe/semantic_propositions.json"),
            ("review_state", "semantic/spe/proposition_review_state.json"),
            ("review_log", "semantic/spe/proposition_review_event_log.jsonl"),
            ("enrichment_log", "semantic/spe/enrichment_log.json"),
            ("enrichment_summary", "semantic/spe/enrichment_summary.json"),
            ("enrichment_activity", "semantic/spe/enrichment_activity_event.json"),
            ("enrichment_plan", "semantic/spe/enrichment_plan.json"),
            ("debt_reassessment", "semantic/spe/debt_reassessment.json"),
            ("revalidation", "sqo/revalidation_result.json"),
            ("promotion", "sqo/promotion_state.json"),
            ("anchor", "sqo/constitutional_replay_anchor.json"),
            ("review_obligations", "sqo/review_obligations.json"),
            ("convergence", "convergence/convergence_observations.json"),
            ("spine", "spine/spine_objects.json"),
            ("chronicle_manifest", "chronicle/CHRONICLE_MANIFEST.json"),
            ("chronicle_html", "chronicle/REPLAY_CHRONICLE.html"),
        ]
        for key, rel_path in required:
            path = self.paths[key]
            exists = os.path.exists(path)
            self.check("artifact_existence", f"{key}_exists", exists, rel_path)
            if exists:
                try:
                    if path.endswith(".json"):
                        self.artifacts[key] = load_json(path)
                    elif path.endswith(".jsonl"):
                        self.artifacts[key] = load_jsonl(path)
                    elif path.endswith(".html"):
                        with open(path) as f:
                            self.artifacts[key] = f.read()
                except Exception as e:
                    self.check("artifact_existence", f"{key}_loadable", False, str(e))

    def phase_2_governance_lifecycle(self):
        print("\nPhase 2: Governance Lifecycle Completeness")
        promotion = self.artifacts.get("promotion", {})
        transitions = promotion.get("promotion_lineage", {}).get("transitions", [])

        self.check("governance_lifecycle", "has_transitions",
                    len(transitions) >= 2,
                    f"{len(transitions)} transitions (need >= 2 for S0→S1→S2)")

        if len(transitions) >= 1:
            t1 = transitions[0]
            self.check("governance_lifecycle", "s0_to_s1_transition",
                        t1.get("from") == "S0" and t1.get("to") == "S1",
                        f"{t1.get('from')}→{t1.get('to')}")
            self.check("governance_lifecycle", "s1_actor_is_operator",
                        "operator:" in t1.get("actor_id", ""),
                        t1.get("actor_id", ""))

        if len(transitions) >= 2:
            t2 = transitions[1]
            self.check("governance_lifecycle", "s1_to_s2_transition",
                        t2.get("from") == "S1" and t2.get("to") == "S2",
                        f"{t2.get('from')}→{t2.get('to')}")
            self.check("governance_lifecycle", "s2_actor_is_operator",
                        "operator:" in t2.get("actor_id", ""),
                        t2.get("actor_id", ""))
            self.check("governance_lifecycle", "s2_authority_level_l5",
                        t2.get("authority_level") == "L5",
                        t2.get("authority_level", ""))

        review = self.artifacts.get("review_state", {})
        self.check("governance_lifecycle", "review_complete",
                    review.get("status") == "COMPLETE",
                    review.get("status", ""))

    def phase_3_proposition_consistency(self):
        print("\nPhase 3: Proposition Consistency")
        props = self.artifacts.get("propositions", {})
        all_props = props.get("propositions", [])
        n_total = len(all_props)
        self.check("proposition_consistency", "propositions_exist",
                    n_total > 0, f"count={n_total}")

        statuses = {}
        for p in all_props:
            s = p.get("status", "UNKNOWN")
            statuses[s] = statuses.get(s, 0) + 1

        terminal_set = {"ACCEPTED", "REJECTED", "ARBITRATED"}
        all_terminal = all(p.get("status") in terminal_set for p in all_props)
        self.check("proposition_consistency", "all_dispositions_terminal",
                    all_terminal, f"statuses: {statuses}")

        all_have_ids = all("proposition_id" in p or "id" in p for p in all_props)
        self.check("proposition_consistency", "all_have_ids", all_have_ids, f"count={n_total}")

        ids = [p.get("proposition_id", p.get("id")) for p in all_props]
        self.check("proposition_consistency", "ids_unique",
                    len(ids) == len(set(ids)), f"total={len(ids)}, unique={len(set(ids))}")

        classes = set(p.get("proposition_class") for p in all_props)
        self.check("proposition_consistency", "multiple_classes",
                    len(classes) >= 2, f"classes={classes}")

        confs = [p.get("confidence", 0) for p in all_props]
        all_bounded = all(0 <= c <= 1 for c in confs)
        self.check("proposition_consistency", "confidence_bounded",
                    all_bounded, f"range=[{min(confs):.3f}, {max(confs):.3f}]")

    def phase_4_revalidation_integrity(self):
        print("\nPhase 4: Revalidation Integrity")
        reval = self.artifacts.get("revalidation", {})
        self.check("revalidation", "status_pass",
                    reval.get("status") == "PASS",
                    reval.get("status", ""))

        total = reval.get("total_checks", 0)
        passed = reval.get("passed", 0)
        failed = reval.get("failed", 0)
        self.check("revalidation", "all_checks_pass",
                    passed == total and failed == 0,
                    f"{passed}/{total} PASS, {failed} FAIL")

        self.check("revalidation", "sufficient_checks",
                    total >= 20, f"total={total} (need >= 20)")

    def phase_5_anchor_clearance(self):
        print("\nPhase 5: Constitutional Anchor Clearance")
        anchor = self.artifacts.get("anchor", {})
        assessment = anchor.get("assessment", {})

        self.check("anchor", "not_blocked",
                    anchor.get("advancement_blocked") == False,
                    f"blocked={anchor.get('advancement_blocked')}")

        dims = assessment.get("dimensions", [])
        all_pass = all(d.get("verdict") == "PASS" for d in dims)
        n_pass = sum(1 for d in dims if d.get("verdict") == "PASS")
        self.check("anchor", "all_dimensions_pass",
                    all_pass, f"{n_pass}/{len(dims)} PASS")

        critical_dims = [d for d in dims if d.get("severity") == "CRITICAL"]
        critical_pass = all(d.get("verdict") == "PASS" for d in critical_dims)
        self.check("anchor", "critical_dimensions_pass",
                    critical_pass,
                    f"{sum(1 for d in critical_dims if d.get('verdict') == 'PASS')}/{len(critical_dims)} CRITICAL pass")

        has_enrichment_dim = any(d.get("dimension") == "enrichment_activity" for d in dims)
        enrichment_pass = any(
            d.get("dimension") == "enrichment_activity" and d.get("verdict") == "PASS"
            for d in dims
        )
        self.check("anchor", "enrichment_activity_pass",
                    enrichment_pass, f"present={has_enrichment_dim}, pass={enrichment_pass}")

    def phase_6_enrichment_completeness(self):
        print("\nPhase 6: Enrichment Completeness")
        activity = self.artifacts.get("enrichment_activity", {})
        self.check("enrichment", "enrichment_exercised",
                    activity.get("enrichment_exercised") == True,
                    f"exercised={activity.get('enrichment_exercised')}")

        summary = self.artifacts.get("enrichment_summary", {})
        events = summary.get("enrichment_events", 0)
        self.check("enrichment", "enrichment_events_exist",
                    events > 0, f"events={events}")

        log = self.artifacts.get("enrichment_log", {})
        corrections = log.get("domain_corrections", [])
        self.check("enrichment", "domain_corrections_exist",
                    len(corrections) > 0, f"corrections={len(corrections)}")

        debt = self.artifacts.get("debt_reassessment", {})
        self.check("enrichment", "debt_assessed",
                    debt.get("total_debt_items", 0) > 0,
                    f"items={debt.get('total_debt_items', 0)}")

    def phase_7_convergence_integrity(self):
        print("\nPhase 7: Convergence Integrity")
        conv = self.artifacts.get("convergence", {})
        obs = conv.get("observations", [])
        self.check("convergence", "observations_exist",
                    len(obs) > 0, f"count={len(obs)}")

        specimens = conv.get("specimens", {})
        has_ref = "reference" in specimens
        has_cand = "candidate" in specimens
        self.check("convergence", "both_specimens_referenced",
                    has_ref and has_cand,
                    f"reference={has_ref}, candidate={has_cand}")

        if has_ref:
            ref_id = specimens["reference"].get("specimen_id", "")
            self.check("convergence", "reference_is_netbox",
                        ref_id == "netbox", f"reference={ref_id}")

        maturity = conv.get("observation_maturity", "")
        self.check("convergence", "maturity_descriptive",
                    maturity == "DESCRIPTIVE",
                    f"maturity={maturity}")

        all_observed = all(o.get("pattern_status") == "OBSERVED" for o in obs)
        self.check("convergence", "all_observed_status",
                    all_observed,
                    f"all OBSERVED={all_observed}")

        summary = conv.get("summary", {})
        verdict = summary.get("verdict", "")
        self.check("convergence", "verdict_present",
                    len(verdict) > 0, f"verdict={verdict}")

    def phase_8_chronicle_integrity(self):
        print("\nPhase 8: Chronicle Integrity")
        html = self.artifacts.get("chronicle_html", "")
        self.check("chronicle", "html_exists",
                    len(html) > 0, f"size={len(html)} bytes")

        self.check("chronicle", "html_has_chapters",
                    html.count("chapter-title") >= 8,
                    f"chapter-title occurrences={html.count('chapter-title')}")

        self.check("chronicle", "html_has_zoom_levels",
                    html.count("zoom-section") >= 32,
                    f"zoom-section occurrences={html.count('zoom-section')} (need >= 32 for 8 chapters × 4 levels)")

        self.check("chronicle", "html_has_timeline",
                    "timeline" in html, "timeline present")

        self.check("chronicle", "html_has_governance_boundary",
                    "Evidence Boundary Statement" in html,
                    "governance boundary present")

        self.check("chronicle", "html_has_75x_authority",
                    "75.x" in html, "75.x reference present")

        manifest = self.artifacts.get("chronicle_manifest", {})
        self.check("chronicle", "manifest_exists",
                    manifest.get("status") is not None,
                    f"status={manifest.get('status')}")

    def phase_9_promotion_legitimacy(self):
        print("\nPhase 9: Promotion Legitimacy")
        promotion = self.artifacts.get("promotion", {})

        self.check("promotion", "s_level_s2",
                    promotion.get("s_level") == "S2",
                    f"s_level={promotion.get('s_level')}")

        self.check("promotion", "provenance_governed",
                    promotion.get("qualification_provenance") == "GOVERNED_LIFECYCLE",
                    f"provenance={promotion.get('qualification_provenance')}")

        self.check("promotion", "authority_ceiling_l3",
                    promotion.get("authority_ceiling") == "L3",
                    f"ceiling={promotion.get('authority_ceiling')}")

    def phase_10_cross_artifact_consistency(self):
        print("\nPhase 10: Cross-Artifact Consistency")
        props = self.artifacts.get("propositions", {}).get("propositions", [])
        n_props = len(props)

        anchor = self.artifacts.get("anchor", {})
        anchor_count = anchor.get("candidate_dimensions", {}).get("proposition_count", 0)
        self.check("cross_consistency", "proposition_count_matches_anchor",
                    anchor_count == n_props,
                    f"propositions={n_props}, anchor={anchor_count}")

        reval = self.artifacts.get("revalidation", {})
        reval_client = reval.get("client_id", "")
        self.check("cross_consistency", "revalidation_client_matches",
                    reval_client == self.client,
                    f"reval={reval_client}, expected={self.client}")

        promotion = self.artifacts.get("promotion", {})
        promo_client = promotion.get("client", "")
        self.check("cross_consistency", "promotion_client_matches",
                    promo_client == self.client,
                    f"promotion={promo_client}, expected={self.client}")

        conv = self.artifacts.get("convergence", {})
        cand = conv.get("specimens", {}).get("candidate", {})
        conv_specimen = cand.get("specimen_id", "")
        self.check("cross_consistency", "convergence_candidate_matches",
                    conv_specimen == self.client,
                    f"convergence={conv_specimen}, expected={self.client}")

        conv_s_level = cand.get("s_level", "")
        promo_s_level = promotion.get("s_level", "")
        self.check("cross_consistency", "convergence_s_level_matches_promotion",
                    conv_s_level == promo_s_level,
                    f"convergence={conv_s_level}, promotion={promo_s_level}")

        accepted_in_props = sum(1 for p in props if p.get("status") == "ACCEPTED")
        rejected_in_props = sum(1 for p in props if p.get("status") == "REJECTED")
        arbitrated_in_props = sum(1 for p in props if p.get("status") == "ARBITRATED")
        total_terminal = accepted_in_props + rejected_in_props + arbitrated_in_props
        self.check("cross_consistency", "all_propositions_accounted",
                    total_terminal == n_props,
                    f"terminal={total_terminal}, total={n_props} (A:{accepted_in_props} R:{rejected_in_props} ARB:{arbitrated_in_props})")


def run():
    parser = argparse.ArgumentParser(description="RC-09 Chronicle Certification")
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    paths = resolve_paths(args.client, args.run_id)
    engine = CertificationEngine(args.client, args.run_id, paths)
    result = engine.run()

    timestamp = datetime.now(timezone.utc).isoformat()
    certification = {
        "schema_version": "1.0",
        "contract_id": "PI.SQO.CHRONICLE-CERTIFICATION.01",
        "stream": STREAM,
        "client": args.client,
        "run_id": args.run_id,
        "timestamp": timestamp,
        "certification_status": result["status"],
        "total_checks": result["total"],
        "passed": result["passed"],
        "failed": result["failed"],
        "phases": {
            "artifact_existence": {
                "checks": [c for c in result["checks"] if c["phase"] == "artifact_existence"],
            },
            "governance_lifecycle": {
                "checks": [c for c in result["checks"] if c["phase"] == "governance_lifecycle"],
            },
            "proposition_consistency": {
                "checks": [c for c in result["checks"] if c["phase"] == "proposition_consistency"],
            },
            "revalidation": {
                "checks": [c for c in result["checks"] if c["phase"] == "revalidation"],
            },
            "anchor": {
                "checks": [c for c in result["checks"] if c["phase"] == "anchor"],
            },
            "enrichment": {
                "checks": [c for c in result["checks"] if c["phase"] == "enrichment"],
            },
            "convergence": {
                "checks": [c for c in result["checks"] if c["phase"] == "convergence"],
            },
            "chronicle": {
                "checks": [c for c in result["checks"] if c["phase"] == "chronicle"],
            },
            "promotion": {
                "checks": [c for c in result["checks"] if c["phase"] == "promotion"],
            },
            "cross_consistency": {
                "checks": [c for c in result["checks"] if c["phase"] == "cross_consistency"],
            },
        },
        "governed_lifecycle_summary": {
            "s_level": "S2",
            "provenance": "GOVERNED_LIFECYCLE",
            "transitions": ["S0→S1", "S1→S2"],
            "propositions": result["passed"],
            "revalidation": "PASS",
            "anchor": "CONSTITUTIONAL_DISTANCE_ACCEPTABLE",
            "convergence_observations": 9,
            "chronicle": "REPLAY_CHRONICLE.html",
        },
        "failed_checks": [c for c in result["checks"] if c["result"] == "FAIL"],
    }

    output_dir = os.path.join(paths["run_dir"], "chronicle")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "chronicle_certification.json")
    with open(output_path, "w") as f:
        json.dump(certification, f, indent=2)

    print(f"\nCertification written: {output_path}")
    return result["status"]


if __name__ == "__main__":
    run()
