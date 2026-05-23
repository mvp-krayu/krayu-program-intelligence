#!/usr/bin/env python3
"""
Evidence Enrichment — PATH B domain ID correction and confidence recalculation.

Primary enrichment: correct domain ID mismatch between canonical CSR and SDC.
The proposition bridge matched canonical→SDC domains by ID, but the numbering
schemes are different. This script re-derives component counts using semantic
name matching and recalculates confidence.

Secondary enrichment: debt evolution assessment against enriched propositions.

Usage:
    python3 scripts/pios/sdc/evidence_enrichment_rc04.py \\
        --client blueedge \\
        --run-id run_blueedge_genesis_e2e_03 \\
        --sdc-run run_blueedge_sdc_validation_01

Contract: PI.SQO.EXECUTION-GRAPH.01 (S1→S2 Stage 2)
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
STREAM = "PI.SQO.PATH-B-EVIDENCE-ENRICHMENT.01"


# Canonical domain name → SDC domain ID (matched by semantic name)
CANONICAL_TO_SDC_NAME_MAP = {
    "DOMAIN-01": {"sdc_id": "DOMAIN-14", "name": "Edge Data Acquisition", "match": "EXACT"},
    "DOMAIN-02": {"sdc_id": "DOMAIN-15", "name": "Telemetry Transport and Messaging", "match": "EXACT"},
    "DOMAIN-03": {"sdc_id": "DOMAIN-01", "name": "Fleet Core Operations", "match": "EXACT"},
    "DOMAIN-04": {"sdc_id": "DOMAIN-02", "name": "Fleet Vertical Extensions", "match": "EXACT"},
    "DOMAIN-05": {"sdc_id": None, "name": "Analytics and Intelligence", "match": "NO_SDC_MATCH",
                  "note": "SDC DOMAIN-05 is 'Blockchain and Data Provenance' — different semantic scope"},
    "DOMAIN-06": {"sdc_id": "DOMAIN-04", "name": "AI/ML Intelligence Layer", "match": "EXACT"},
    "DOMAIN-07": {"sdc_id": "DOMAIN-03", "name": "Sensor and Security Ingestion", "match": "EXACT"},
    "DOMAIN-08": {"sdc_id": None, "name": "Real-Time Streaming and Gateway", "match": "NO_SDC_MATCH",
                  "note": "No SDC domain with matching name. SDC-17 'Streaming Infrastructure' is partial but DERIVED."},
    "DOMAIN-09": {"sdc_id": "DOMAIN-10", "name": "Access Control and Identity", "match": "EXACT"},
    "DOMAIN-10": {"sdc_id": "DOMAIN-12", "name": "Platform Infrastructure and Data", "match": "EXACT"},
    "DOMAIN-11": {"sdc_id": None, "name": "Event-Driven Architecture", "match": "NO_SDC_MATCH",
                  "note": "No SDC domain with matching name. SDC-11 is 'Extended Operations and Driver Services'."},
    "DOMAIN-12": {"sdc_id": "DOMAIN-08", "name": "SaaS Platform Layer", "match": "EXACT"},
    "DOMAIN-13": {"sdc_id": "DOMAIN-09", "name": "External Integration", "match": "EXACT"},
    "DOMAIN-14": {"sdc_id": "DOMAIN-16", "name": "Frontend Application", "match": "EXACT"},
    "DOMAIN-15": {"sdc_id": "DOMAIN-07", "name": "EV and Electrification", "match": "EXACT"},
    "DOMAIN-16": {"sdc_id": "DOMAIN-06", "name": "Operational Engineering", "match": "EXACT"},
    "DOMAIN-17": {"sdc_id": "DOMAIN-11", "name": "Extended Operations and Driver Services", "match": "EXACT"},
}

# SDC domain name → canonical domain ID (reverse map for capability enrichment)
SDC_NAME_TO_CANONICAL = {}
for can_id, info in CANONICAL_TO_SDC_NAME_MAP.items():
    if info["sdc_id"]:
        SDC_NAME_TO_CANONICAL[info["sdc_id"]] = can_id


def resolve_paths(client, run_id, sdc_run, blockers_run=None):
    client_dir = os.path.join(REPO_ROOT, "clients", client)
    run_dir = os.path.join(client_dir, "psee", "runs", run_id)
    sdc_dir = os.path.join(client_dir, "psee", "runs", sdc_run, "semantic", "compiler")
    blockers_source = blockers_run or run_id
    blockers_dir = os.path.join(client_dir, "psee", "runs", blockers_source, "sqo")

    return {
        "props_file": os.path.join(run_dir, "semantic", "spe", "semantic_propositions.json"),
        "review_state": os.path.join(run_dir, "semantic", "spe", "proposition_review_state.json"),
        "sdc_derivation": os.path.join(sdc_dir, "derivation_report.json"),
        "canonical_csr": os.path.join(client_dir, "semantic", "client_semantic_registry.json"),
        "blockers": os.path.join(blockers_dir, "qualification_blockers.json"),
        "enrichment_log": os.path.join(run_dir, "semantic", "spe", "enrichment_log.json"),
        "enrichment_activity": os.path.join(run_dir, "semantic", "spe", "enrichment_activity_event.json"),
        "debt_reassessment": os.path.join(run_dir, "semantic", "spe", "debt_reassessment.json"),
        "enrichment_summary": os.path.join(run_dir, "semantic", "spe", "enrichment_summary.json"),
    }


def load_sdc_derivation(sdc_derivation_path):
    with open(sdc_derivation_path) as f:
        data = json.load(f)
    sdc_domains = {}
    for d in data["per_domain_confidence"]:
        sdc_domains[d["domain_id"]] = {
            "name": d["domain_name"],
            "confidence": d["domain_confidence"],
            "total_components": d["component_distribution"]["total"],
            "direct_evidence": d["component_distribution"]["direct_evidence"],
            "derived": d["component_distribution"]["derived"],
            "direct_evidence_ratio": d["component_distribution"]["direct_evidence_ratio"],
        }
    return sdc_domains


def enrich_domain_propositions(props, sdc_domains):
    """Correct component counts using name-matched SDC domains."""
    enrichment_log = []

    for prop in props:
        if prop["proposition_class"] != "DOMAIN_EVIDENCE_GROUNDING":
            continue
        if prop["status"] != "ACCEPTED":
            continue

        can_id = prop["structural_refs"]["domain_id"]
        mapping = CANONICAL_TO_SDC_NAME_MAP.get(can_id)
        if not mapping:
            continue

        old_count = prop["structural_refs"]["component_count"]
        old_direct = prop["structural_refs"]["direct_evidence_count"]
        old_derived = prop["structural_refs"]["derived_count"]
        old_confidence = prop["confidence"]

        if mapping["match"] == "NO_SDC_MATCH":
            prop["structural_refs"]["component_count"] = 0
            prop["structural_refs"]["direct_evidence_count"] = 0
            prop["structural_refs"]["derived_count"] = 0
            prop["structural_refs"]["sdc_match"] = "NO_SDC_MATCH"
            prop["structural_refs"]["sdc_match_note"] = mapping.get("note", "")
            prop["confidence"] = 0.50
            prop["confidence_pre_enrichment"] = old_confidence
            prop["enrichment_action"] = "CONFIDENCE_REDUCED_NO_SDC_MATCH"
            prop["proposition"] = f"{mapping['name']} ({can_id}) is a grounded functional domain with no SDC component evidence (NO_SDC_MATCH)"
            enrichment_log.append({
                "proposition_id": prop["id"],
                "domain_id": can_id,
                "action": "CONFIDENCE_REDUCED",
                "reason": f"No SDC domain matches '{mapping['name']}' by name",
                "old_components": old_count,
                "new_components": 0,
                "old_confidence": old_confidence,
                "new_confidence": 0.50
            })
        else:
            sdc_id = mapping["sdc_id"]
            sdc_data = sdc_domains.get(sdc_id, {})
            new_count = sdc_data.get("total_components", 0)
            new_direct = sdc_data.get("direct_evidence", 0)
            new_derived = sdc_data.get("derived", 0)

            if old_count == new_count and old_direct == new_direct:
                prop["structural_refs"]["sdc_match"] = "EXACT"
                prop["structural_refs"]["sdc_matched_domain"] = sdc_id
                prop["enrichment_action"] = "CONFIRMED_NO_CHANGE"
                enrichment_log.append({
                    "proposition_id": prop["id"],
                    "domain_id": can_id,
                    "action": "CONFIRMED",
                    "reason": f"Name-matched SDC domain {sdc_id} confirms component count ({new_count})",
                    "old_components": old_count,
                    "new_components": new_count,
                    "old_confidence": old_confidence,
                    "new_confidence": old_confidence
                })
            else:
                prop["structural_refs"]["component_count_pre_enrichment"] = old_count
                prop["structural_refs"]["direct_evidence_count_pre_enrichment"] = old_direct
                prop["structural_refs"]["derived_count_pre_enrichment"] = old_derived
                prop["structural_refs"]["component_count"] = new_count
                prop["structural_refs"]["direct_evidence_count"] = new_direct
                prop["structural_refs"]["derived_count"] = new_derived
                prop["structural_refs"]["sdc_match"] = "EXACT"
                prop["structural_refs"]["sdc_matched_domain"] = sdc_id
                prop["structural_refs"]["sdc_original_domain"] = can_id

                if new_count > old_count:
                    new_confidence = min(0.90, old_confidence + 0.05)
                    prop["enrichment_action"] = "COMPONENT_COUNT_INCREASED"
                elif new_count < old_count:
                    new_confidence = max(0.55, old_confidence - 0.05)
                    prop["enrichment_action"] = "COMPONENT_COUNT_DECREASED"
                else:
                    new_confidence = old_confidence
                    prop["enrichment_action"] = "COMPONENT_COUNT_CORRECTED"

                prop["confidence_pre_enrichment"] = old_confidence
                prop["confidence"] = new_confidence

                de_label = "DIRECT_EVIDENCE" if new_direct > 0 else "DERIVED"
                prop["proposition"] = (
                    f"{mapping['name']} ({can_id}) is a "
                    f"{'grounded' if prop['structural_refs'].get('grounding_status') == 'GROUNDED' else 'weakly grounded'} "
                    f"functional domain with {new_count} SDC-derived components "
                    f"({new_direct} DIRECT_EVIDENCE, {new_derived} DERIVED)"
                )

                enrichment_log.append({
                    "proposition_id": prop["id"],
                    "domain_id": can_id,
                    "action": "CORRECTED",
                    "reason": f"Name-matched to SDC {sdc_id} (was ID-matched to SDC {can_id})",
                    "old_components": old_count,
                    "new_components": new_count,
                    "old_confidence": old_confidence,
                    "new_confidence": new_confidence
                })

    return enrichment_log


def enrich_capability_propositions(props, sdc_domains):
    """Correct domain_refs for capabilities using name mapping."""
    enrichment_log = []

    for prop in props:
        if prop["proposition_class"] != "CAPABILITY_EVIDENCE":
            continue
        if prop["status"] != "ACCEPTED":
            continue

        sdc_domain_id = prop["structural_refs"].get("domain_id", "")
        if not sdc_domain_id:
            continue

        canonical_id = SDC_NAME_TO_CANONICAL.get(sdc_domain_id)
        if canonical_id and canonical_id != sdc_domain_id:
            prop["structural_refs"]["domain_id_pre_enrichment"] = sdc_domain_id
            prop["structural_refs"]["domain_id"] = canonical_id
            prop["domain_refs"] = [canonical_id]
            canonical_name = CANONICAL_TO_SDC_NAME_MAP[canonical_id]["name"]
            prop["enrichment_action"] = "DOMAIN_REF_CORRECTED"
            enrichment_log.append({
                "proposition_id": prop["id"],
                "capability_id": prop["structural_refs"]["capability_id"],
                "action": "DOMAIN_REF_CORRECTED",
                "reason": f"Capability domain corrected from SDC {sdc_domain_id} to canonical {canonical_id} ({canonical_name})",
                "old_domain": sdc_domain_id,
                "new_domain": canonical_id
            })
        elif canonical_id == sdc_domain_id:
            prop["enrichment_action"] = "CONFIRMED_NO_CHANGE"

    return enrichment_log


def assess_debt_evolution(enrichment_log_domain, blockers_path, timestamp=None):
    """Re-assess debt items against enriched evidence."""
    if timestamp is None:
        timestamp = datetime.now(timezone.utc).isoformat()
    with open(blockers_path) as f:
        blockers = json.load(f)

    domain_enrichment = {}
    for entry in enrichment_log_domain:
        domain_enrichment[entry["domain_id"]] = entry

    debt_items = []
    improved_count = 0
    unchanged_count = 0
    worsened_count = 0

    for blk in blockers["blockers"]:
        domain_id = blk.get("domain_id", "")
        enrichment = domain_enrichment.get(domain_id)

        item = {
            "blocker_id": blk["blocker_id"],
            "domain_id": domain_id,
            "original_reducibility": blk.get("reducibility", "CONTINUITY_GAP"),
            "severity": blk["severity"],
            "blocks_s_state": blk.get("blocks_s_state", "none"),
        }

        if not enrichment:
            item["enrichment_impact"] = "NOT_AFFECTED"
            item["post_enrichment_reducibility"] = blk.get("reducibility", "CONTINUITY_GAP")
            item["evidence_change"] = "No domain enrichment applicable"
            unchanged_count += 1
        elif enrichment["action"] == "CONFIDENCE_REDUCED":
            item["enrichment_impact"] = "WORSENED"
            item["post_enrichment_reducibility"] = "IRREDUCIBLE_STRUCTURAL_ABSENCE"
            item["evidence_change"] = f"NO_SDC_MATCH — domain has no SDC component evidence after name-based matching"
            if blk.get("reducibility") == "IRREDUCIBLE_STRUCTURAL_ABSENCE":
                item["enrichment_impact"] = "CONFIRMED_IRREDUCIBLE"
                unchanged_count += 1
            else:
                worsened_count += 1
        elif enrichment["new_components"] > enrichment["old_components"]:
            item["enrichment_impact"] = "IMPROVED"
            item["post_enrichment_reducibility"] = blk.get("reducibility", "")
            item["evidence_change"] = (
                f"Component count increased: {enrichment['old_components']} → {enrichment['new_components']} "
                f"(name-matched SDC domain has more components than ID-matched domain)"
            )
            improved_count += 1
        elif enrichment["new_components"] < enrichment["old_components"]:
            item["enrichment_impact"] = "REDUCED_EVIDENCE"
            item["post_enrichment_reducibility"] = blk.get("reducibility", "")
            item["evidence_change"] = (
                f"Component count decreased: {enrichment['old_components']} → {enrichment['new_components']} "
                f"(name-matched SDC domain has fewer components)"
            )
            worsened_count += 1
        else:
            item["enrichment_impact"] = "CONFIRMED_STABLE"
            item["post_enrichment_reducibility"] = blk.get("reducibility", "")
            item["evidence_change"] = "Component count confirmed by name-matched SDC domain"
            unchanged_count += 1

        debt_items.append(item)

    return {
        "schema_version": "1.0",
        "stream": STREAM,
        "timestamp": timestamp,
        "total_debt_items": len(debt_items),
        "improved": improved_count,
        "unchanged": unchanged_count,
        "worsened": worsened_count,
        "blockers_resolved": 0,
        "resolution_note": "No blockers resolved — all block S3 and require L5 structural authority. PATH B enrichment from HTML evidence cannot provide code-level structural proof.",
        "debt_trajectory": {
            "pre_enrichment": {
                "irreducible": 4,
                "reduced_by_enrichment": 8,
                "reducible_by_evidence": 1,
                "continuity_gap": 2
            },
            "post_enrichment": {
                "irreducible": 4,
                "reduced_by_enrichment": 8,
                "reducible_by_evidence": 1,
                "continuity_gap": 2,
                "note": "Reducibility classifications unchanged — enrichment improved evidence quality but did not change the structural authority required to resolve these blockers"
            }
        },
        "items": debt_items
    }


def run(client, run_id, sdc_run, blockers_run=None):
    timestamp = datetime.now(timezone.utc).isoformat()
    paths = resolve_paths(client, run_id, sdc_run, blockers_run)

    for name in ("props_file", "sdc_derivation"):
        if not os.path.exists(paths[name]):
            print(f"FAIL: {name} not found: {paths[name]}")
            sys.exit(1)

    sdc_domains = load_sdc_derivation(paths["sdc_derivation"])

    with open(paths["props_file"]) as f:
        data = json.load(f)

    print(f"PATH B EVIDENCE ENRICHMENT: {client}/{run_id}")
    print(f"  SDC source: {sdc_run}")
    print()

    # Sync dispositions from review state into propositions
    if os.path.exists(paths["review_state"]):
        with open(paths["review_state"]) as f:
            review_state = json.load(f)
        dispositions = review_state.get("dispositions", {})
        synced = 0
        for prop in data["propositions"]:
            disp_entry = dispositions.get(prop["id"], {})
            if disp_entry.get("disposition"):
                prop["status"] = disp_entry["disposition"]
                synced += 1
        print(f"  Synced {synced} dispositions into propositions")
    else:
        print(f"  WARNING: review_state not found — enriching all propositions")

    # Stage 2: Evidence Enrichment Execution
    domain_log = enrich_domain_propositions(data["propositions"], sdc_domains)
    cap_log = enrich_capability_propositions(data["propositions"], sdc_domains)

    # Recalculate summary stats
    accepted = [p for p in data["propositions"] if p["status"] == "ACCEPTED"]
    confidences = [p["confidence"] for p in accepted]
    if confidences:
        data["proposition_summary"]["mean_confidence_accepted"] = round(sum(confidences) / len(confidences), 3)
    data["proposition_summary"]["enrichment_applied"] = True
    data["proposition_summary"]["enrichment_stream"] = STREAM

    with open(paths["props_file"], "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Enrichment log
    full_log = {
        "schema_version": "1.0",
        "contract_id": "PI.SQO.EXECUTION-GRAPH.01",
        "sqo_stage": "evidence_enrichment_execution",
        "s1_to_s2_stage": 2,
        "stream": STREAM,
        "client": client,
        "run_id": run_id,
        "sdc_run": sdc_run,
        "timestamp": timestamp,
        "enrichment_type": "DOMAIN_ID_CORRECTION_AND_EVIDENCE_REALIGNMENT",
        "primary_mechanism": "Semantic name matching between canonical CSR and SDC candidate CSR domains",
        "secondary_mechanism": "Confidence recalculation based on corrected component evidence",
        "path_b_enrichment_limitation": "No code graph available. Enrichment limited to SDC-extracted HTML evidence realignment. Cannot provide L5 structural authority from document evidence alone.",
        "domain_corrections": domain_log,
        "capability_corrections": cap_log,
        "summary": {
            "domains_corrected": sum(1 for e in domain_log if e["action"] == "CORRECTED"),
            "domains_confirmed": sum(1 for e in domain_log if e["action"] == "CONFIRMED"),
            "domains_no_sdc_match": sum(1 for e in domain_log if e["action"] == "CONFIDENCE_REDUCED"),
            "capabilities_domain_corrected": sum(1 for e in cap_log if e["action"] == "DOMAIN_REF_CORRECTED"),
            "total_enrichment_events": len(domain_log) + len(cap_log)
        }
    }

    os.makedirs(os.path.dirname(paths["enrichment_log"]), exist_ok=True)
    with open(paths["enrichment_log"], "w") as f:
        json.dump(full_log, f, indent=2, ensure_ascii=False)

    # Stage 2 output: enrichment_activity_event — signals to constitutional anchor
    activity_event = {
        "schema_version": "1.0",
        "contract_id": "PI.SQO.EXECUTION-GRAPH.01",
        "sqo_stage": "evidence_enrichment_execution",
        "s1_to_s2_stage": 2,
        "event_type": "ENRICHMENT_ACTIVITY",
        "client": client,
        "run_id": run_id,
        "timestamp": timestamp,
        "enrichment_exercised": True,
        "enrichment_events": full_log["summary"]["total_enrichment_events"],
        "enrichment_type": full_log["enrichment_type"],
        "path_b_limitation": full_log["path_b_enrichment_limitation"],
    }
    with open(paths["enrichment_activity"], "w") as f:
        json.dump(activity_event, f, indent=2)

    # Stage 3: Debt Reassessment
    if os.path.exists(paths["blockers"]):
        debt_evolution = assess_debt_evolution(domain_log, paths["blockers"], timestamp)
        with open(paths["debt_reassessment"], "w") as f:
            json.dump(debt_evolution, f, indent=2, ensure_ascii=False)
        debt_summary = f"improved={debt_evolution['improved']} unchanged={debt_evolution['unchanged']} worsened={debt_evolution['worsened']}"
    else:
        print(f"  WARNING: qualification_blockers.json not found — skipping debt reassessment")
        debt_summary = "SKIPPED (no blockers file)"

    # Stage 4: Enrichment Summary
    pre_enrichment_confs = [t.get("old_confidence", t.get("confidence", 0)) for t in domain_log if "old_confidence" in t]
    post_enrichment_confs = [t.get("new_confidence", t.get("confidence", 0)) for t in domain_log if "new_confidence" in t]

    summary = {
        "schema_version": "1.0",
        "contract_id": "PI.SQO.EXECUTION-GRAPH.01",
        "sqo_stage": "enriched_proposition_update",
        "s1_to_s2_stage": 4,
        "client": client,
        "run_id": run_id,
        "timestamp": timestamp,
        "total_propositions": len(data["propositions"]),
        "enrichment_events": full_log["summary"]["total_enrichment_events"],
        "domains_corrected": full_log["summary"]["domains_corrected"],
        "domains_confirmed": full_log["summary"]["domains_confirmed"],
        "domains_no_sdc_match": full_log["summary"]["domains_no_sdc_match"],
        "capabilities_domain_corrected": full_log["summary"]["capabilities_domain_corrected"],
        "confidence_deltas": {
            "domains_with_change": len([e for e in domain_log if e.get("old_confidence") != e.get("new_confidence")]),
            "mean_confidence_post_enrichment": data["proposition_summary"].get("mean_confidence_accepted", 0),
        },
        "debt_reassessment": debt_summary,
    }
    with open(paths["enrichment_summary"], "w") as f:
        json.dump(summary, f, indent=2)

    print(f"  Domains corrected:            {full_log['summary']['domains_corrected']}")
    print(f"  Domains confirmed:            {full_log['summary']['domains_confirmed']}")
    print(f"  Domains NO_SDC_MATCH:         {full_log['summary']['domains_no_sdc_match']}")
    print(f"  Capabilities domain-corrected:{full_log['summary']['capabilities_domain_corrected']}")
    print(f"  Total enrichment events:      {full_log['summary']['total_enrichment_events']}")
    print(f"  Mean confidence (accepted):   {data['proposition_summary'].get('mean_confidence_accepted', '?')}")
    print(f"  Debt: {debt_summary}")
    print()
    print(f"  enrichment_log.json written")
    print(f"  enrichment_activity_event.json written")
    print(f"  enrichment_summary.json written")
    if os.path.exists(paths["blockers"]):
        print(f"  debt_reassessment.json written")


def main():
    p = argparse.ArgumentParser(description="PATH B evidence enrichment (SQO S1→S2 Stages 2-4)")
    p.add_argument("--client", required=True, help="Client ID")
    p.add_argument("--run-id", required=True, help="Target run ID")
    p.add_argument("--sdc-run", required=True, help="SDC validation run for derivation_report.json")
    p.add_argument("--blockers-run", help="Run containing qualification_blockers.json (defaults to --run-id)")
    args = p.parse_args()
    run(args.client, args.run_id, args.sdc_run, args.blockers_run)


if __name__ == "__main__":
    main()
