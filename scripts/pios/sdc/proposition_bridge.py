#!/usr/bin/env python3
"""
Proposition Bridge: SDC output → SPE-format semantic_proposition spine objects.

Transforms BlueEdge PATH B evidence (SDC candidate_csr, vault claims, canonical CSR,
topology model) into governed semantic propositions for chronicle replay.

PATH B proposition classes (document-evidence derived):
- DOMAIN_EVIDENCE_GROUNDING: domain-level grounding from HTML evidence
- CAPABILITY_EVIDENCE: capability backed by document evidence
- VAULT_CLAIM_STRUCTURAL: vault claim with structural backing
- CROSS_DOMAIN_EVIDENCE: cross-domain relationship from document evidence
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(path):
    with open(path) as f:
        return json.load(f)


def load_vault_claims(claims_dir):
    claims = []
    for fname in sorted(os.listdir(claims_dir)):
        if not fname.startswith("CLM-") or not fname.endswith(".md"):
            continue
        fpath = os.path.join(claims_dir, fname)
        with open(fpath) as f:
            content = f.read()
        match = re.search(r"claim_id:\s*(\S+)", content)
        claim_id = match.group(1) if match else fname.split(" ")[0]
        match = re.search(r"claim_label:\s*(.+)", content)
        label = match.group(1).strip() if match else ""
        match = re.search(r"lens_admissible:\s*(\S+)", content)
        admissible = match.group(1) if match else "NO"
        match = re.search(r"claim_type:\s*(\S+)", content)
        claim_type = match.group(1) if match else "unknown"
        match = re.search(r"## Authoritative Value\s*\n+(.+?)(?:\n\n|\n##)", content, re.DOTALL)
        auth_value = match.group(1).strip() if match else ""
        match = re.search(r"## Traceability\s*\n+.*?Status:\s*(\S+)", content, re.DOTALL)
        traceability = match.group(1) if match else "UNKNOWN"
        claims.append({
            "claim_id": claim_id,
            "label": label,
            "claim_type": claim_type,
            "lens_admissible": admissible,
            "authoritative_value": auth_value,
            "traceability": traceability,
            "source_file": fname,
        })
    return claims


def make_proposition(idx, specimen_id, run_id, proposition_text, tier, confidence,
                     prop_class, evidence_anchors, structural_refs, rationale,
                     domain_refs=None, reconciliation_state="NOVEL"):
    return {
        "id": f"SP-{specimen_id}-{idx:04d}",
        "specimen_id": specimen_id,
        "run_id": run_id,
        "proposition": proposition_text,
        "derivation_tier": tier,
        "confidence": round(confidence, 3),
        "authority_ceiling": "L3",
        "evidence_anchors": evidence_anchors,
        "status": "CANDIDATE",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "proposition_class": prop_class,
        "ceu_refs": [],
        "domain_refs": domain_refs or [],
        "structural_refs": structural_refs,
        "hero_moment_refs": [],
        "replay_corridor_refs": [],
        "derivation_rationale": rationale,
        "reconciliation_state": reconciliation_state,
    }


def derive_domain_propositions(canonical_csr, candidate_csr, derivation_report, specimen_id, run_id, start_idx):
    propositions = []
    idx = start_idx
    per_domain = {d["domain_id"]: d for d in derivation_report.get("per_domain_confidence", [])}
    candidate_domains = {d["domain_id"]: d for d in candidate_csr.get("domains", [])}

    for domain in canonical_csr.get("domains", []):
        did = domain["domain_id"]
        name = domain.get("name", did)
        grounding = domain.get("grounding", "UNKNOWN")
        sdc_match = per_domain.get(did, {})
        comp_dist = sdc_match.get("component_distribution", {})
        direct = comp_dist.get("direct_evidence", 0)
        derived = comp_dist.get("derived", 0)
        total = comp_dist.get("total", direct + derived)
        dom_conf = sdc_match.get("domain_confidence", "UNKNOWN")

        if total > 0:
            confidence = 0.85 if dom_conf == "DIRECT_EVIDENCE" else 0.55
            tier = "DIRECT_EVIDENCE" if dom_conf == "DIRECT_EVIDENCE" else "DERIVED"
        elif grounding == "GROUNDED":
            confidence = 0.70
            tier = "DIRECT_EVIDENCE"
        else:
            confidence = 0.45
            tier = "DERIVED"

        evidence_refs = []
        cand = candidate_domains.get(did, {})
        for ref in cand.get("evidence_refs", []):
            if isinstance(ref, dict):
                evidence_refs.append(ref.get("source_file", "").split("/")[-1])
            else:
                evidence_refs.append(str(ref))

        prop_text = (
            f"{name} ({did}) is a {'grounded' if grounding == 'GROUNDED' else 'weakly grounded'} "
            f"functional domain with {total} SDC-derived components "
            f"({direct} DIRECT_EVIDENCE, {derived} DERIVED)"
        )

        propositions.append(make_proposition(
            idx=idx,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition_text=prop_text,
            tier=tier,
            confidence=confidence,
            prop_class="DOMAIN_EVIDENCE_GROUNDING",
            evidence_anchors=evidence_refs[:3],
            structural_refs={
                "domain_id": did,
                "domain_name": name,
                "grounding_status": grounding,
                "sdc_confidence": dom_conf,
                "component_count": total,
                "direct_evidence_count": direct,
                "derived_count": derived,
            },
            rationale=f"Domain grounding from canonical CSR ({grounding}) cross-referenced with SDC derivation ({dom_conf}, {total} components).",
            domain_refs=[did],
        ))
        idx += 1

    return propositions, idx


def derive_capability_propositions(candidate_csr, specimen_id, run_id, start_idx):
    propositions = []
    idx = start_idx

    for cap in candidate_csr.get("capabilities", []):
        cap_id = cap.get("capability_id", "")
        name = cap.get("name", cap_id)
        domain_id = cap.get("domain_id", "")
        confidence_str = cap.get("confidence", "DERIVED")
        cap_type = cap.get("type", "UNKNOWN")
        weakly = cap.get("weakly_grounded", False)

        if not domain_id:
            tier = "DERIVED"
            confidence = 0.50
        elif confidence_str == "DIRECT_EVIDENCE" and not weakly:
            tier = "DIRECT_EVIDENCE"
            confidence = 0.82
        elif confidence_str == "DIRECT_EVIDENCE" and weakly:
            tier = "DIRECT_EVIDENCE"
            confidence = 0.65
        else:
            tier = "DERIVED"
            confidence = 0.55

        comps_in_cap = [
            c for c in candidate_csr.get("components", [])
            if c.get("capability_id") == cap_id
        ]
        de_comps = sum(1 for c in comps_in_cap if c.get("confidence") == "DIRECT_EVIDENCE")

        evidence_refs = []
        for ref in cap.get("evidence_refs", []):
            if isinstance(ref, dict):
                src = ref.get("source_file", "").split("/")[-1]
                if src:
                    evidence_refs.append(src)

        prop_text = (
            f"Capability '{name}' ({cap_id}) in {domain_id or 'unassigned domain'} "
            f"is backed by {len(comps_in_cap)} components ({de_comps} DIRECT_EVIDENCE). "
            f"Type: {cap_type}."
        )

        propositions.append(make_proposition(
            idx=idx,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition_text=prop_text,
            tier=tier,
            confidence=confidence,
            prop_class="CAPABILITY_EVIDENCE",
            evidence_anchors=list(set(evidence_refs))[:3],
            structural_refs={
                "capability_id": cap_id,
                "capability_name": name,
                "domain_id": domain_id,
                "capability_type": cap_type,
                "component_count": len(comps_in_cap),
                "direct_evidence_components": de_comps,
                "weakly_grounded": weakly,
            },
            rationale=f"Capability derived from SDC section extraction. {len(comps_in_cap)} components, {de_comps} at DIRECT_EVIDENCE.",
            domain_refs=[domain_id] if domain_id else [],
        ))
        idx += 1

    return propositions, idx


def derive_vault_claim_propositions(claims, specimen_id, run_id, start_idx):
    propositions = []
    idx = start_idx

    for claim in claims:
        if claim["traceability"] != "FULL":
            continue
        if claim["lens_admissible"] not in ("YES", "CONDITIONAL"):
            continue

        label = claim["label"]
        auth_val = claim["authoritative_value"]
        if not auth_val:
            continue

        confidence = 0.80 if claim["lens_admissible"] == "YES" else 0.65
        tier = "DIRECT_EVIDENCE" if claim["lens_admissible"] == "YES" else "DERIVED"

        prop_text = (
            f"Vault claim {claim['claim_id']} '{label}' asserts: {auth_val}. "
            f"Traceability: {claim['traceability']}. LENS admissible: {claim['lens_admissible']}."
        )

        propositions.append(make_proposition(
            idx=idx,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition_text=prop_text,
            tier=tier,
            confidence=confidence,
            prop_class="VAULT_CLAIM_STRUCTURAL",
            evidence_anchors=[claim["source_file"]],
            structural_refs={
                "claim_id": claim["claim_id"],
                "claim_label": label,
                "claim_type": claim["claim_type"],
                "authoritative_value": auth_val,
                "traceability": claim["traceability"],
                "lens_admissible": claim["lens_admissible"],
            },
            rationale=f"Vault claim with full traceability and LENS admissibility. Structural backing from governed evidence vault.",
        ))
        idx += 1

    return propositions, idx


def derive_cross_domain_propositions(topology_model, review_queue, specimen_id, run_id, start_idx):
    propositions = []
    idx = start_idx

    for edge in topology_model.get("edges", []):
        source = edge.get("source_domain", edge.get("source", ""))
        target = edge.get("target_domain", edge.get("target", ""))
        edge_type = edge.get("relationship_type", edge.get("type", "UNKNOWN"))
        weight = edge.get("weight", 1)

        prop_text = (
            f"Cross-domain relationship: {source} → {target} ({edge_type}, weight: {weight}). "
            f"Topology edge from semantic topology model."
        )

        propositions.append(make_proposition(
            idx=idx,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition_text=prop_text,
            tier="DERIVED",
            confidence=0.60,
            prop_class="CROSS_DOMAIN_EVIDENCE",
            evidence_anchors=["semantic_topology_model.json"],
            structural_refs={
                "source_domain": source,
                "target_domain": target,
                "edge_type": edge_type,
                "weight": weight,
            },
            rationale=f"Cross-domain edge from semantic topology model. {edge_type} relationship with weight {weight}.",
            domain_refs=[source, target],
        ))
        idx += 1

    for item in review_queue.get("items", []):
        if item.get("trigger") != "AMBIGUOUS_GROUPING":
            continue
        desc = item.get("description", "")
        domain_id = item.get("domain_id", "")
        affected = item.get("affected_elements", [])

        prop_text = (
            f"Cross-domain ambiguity: {desc}. "
            f"Affected elements: {', '.join(affected[:4])}."
        )

        propositions.append(make_proposition(
            idx=idx,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition_text=prop_text,
            tier="DERIVED",
            confidence=0.50,
            prop_class="CROSS_DOMAIN_EVIDENCE",
            evidence_anchors=["review_queue.json"],
            structural_refs={
                "trigger": "AMBIGUOUS_GROUPING",
                "domain_id": domain_id,
                "description": desc,
                "affected_elements": affected,
            },
            rationale=f"SDC review queue flagged ambiguous cross-domain grouping. Requires operator review.",
            domain_refs=[domain_id] if domain_id else [],
        ))
        idx += 1

    return propositions, idx


def main():
    base = os.environ.get("REPO_ROOT", "/Users/khorrix/Projects/k-pi-core")

    canonical_csr_path = os.path.join(base, "clients/blueedge/semantic/client_semantic_registry.json")
    candidate_csr_path = os.path.join(base, "clients/blueedge/psee/runs/run_blueedge_sdc_validation_01/semantic/compiler/candidate_csr.json")
    derivation_report_path = os.path.join(base, "clients/blueedge/psee/runs/run_blueedge_sdc_validation_01/semantic/compiler/derivation_report.json")
    review_queue_path = os.path.join(base, "clients/blueedge/psee/runs/run_blueedge_sdc_validation_01/semantic/compiler/review_queue.json")
    topology_path = os.path.join(base, "clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json")
    claims_dir = os.path.join(base, "clients/blueedge/vaults/run_01_authoritative/claims")
    output_path = os.path.join(base, "clients/blueedge/chronicle/propositions/semantic_propositions.json")

    canonical_csr = load_json(canonical_csr_path)
    candidate_csr = load_json(candidate_csr_path)
    derivation_report = load_json(derivation_report_path)
    review_queue = load_json(review_queue_path)
    topology_model = load_json(topology_path)
    vault_claims = load_vault_claims(claims_dir)

    specimen_id = "blueedge"
    run_id = "run_blueedge_productized_01_fixed"
    idx = 1

    domain_props, idx = derive_domain_propositions(
        canonical_csr, candidate_csr, derivation_report, specimen_id, run_id, idx
    )
    cap_props, idx = derive_capability_propositions(
        candidate_csr, specimen_id, run_id, idx
    )
    claim_props, idx = derive_vault_claim_propositions(
        vault_claims, specimen_id, run_id, idx
    )
    cross_props, idx = derive_cross_domain_propositions(
        topology_model, review_queue, specimen_id, run_id, idx
    )

    all_props = domain_props + cap_props + claim_props + cross_props

    output = {
        "schema_version": "1.0",
        "specimen_id": specimen_id,
        "run_id": run_id,
        "derivation_path": "PATH_B",
        "bridge_version": "1.0.0",
        "bridge_contract": "PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-02",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_artifacts": {
            "canonical_csr": canonical_csr_path,
            "candidate_csr": candidate_csr_path,
            "derivation_report": derivation_report_path,
            "review_queue": review_queue_path,
            "topology_model": topology_path,
            "vault_claims_dir": claims_dir,
        },
        "proposition_summary": {
            "total": len(all_props),
            "by_class": {
                "DOMAIN_EVIDENCE_GROUNDING": len(domain_props),
                "CAPABILITY_EVIDENCE": len(cap_props),
                "VAULT_CLAIM_STRUCTURAL": len(claim_props),
                "CROSS_DOMAIN_EVIDENCE": len(cross_props),
            },
            "by_tier": {
                "DIRECT_EVIDENCE": sum(1 for p in all_props if p["derivation_tier"] == "DIRECT_EVIDENCE"),
                "DERIVED": sum(1 for p in all_props if p["derivation_tier"] == "DERIVED"),
                "INFERRED": sum(1 for p in all_props if p["derivation_tier"] == "INFERRED"),
            },
            "mean_confidence": round(sum(p["confidence"] for p in all_props) / len(all_props), 3) if all_props else 0,
            "all_status": "CANDIDATE",
            "authority_ceiling": "L3",
        },
        "propositions": all_props,
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Proposition bridge complete.")
    print(f"Total propositions: {len(all_props)}")
    print(f"  DOMAIN_EVIDENCE_GROUNDING: {len(domain_props)}")
    print(f"  CAPABILITY_EVIDENCE: {len(cap_props)}")
    print(f"  VAULT_CLAIM_STRUCTURAL: {len(claim_props)}")
    print(f"  CROSS_DOMAIN_EVIDENCE: {len(cross_props)}")
    print(f"  DIRECT_EVIDENCE: {sum(1 for p in all_props if p['derivation_tier'] == 'DIRECT_EVIDENCE')}")
    print(f"  DERIVED: {sum(1 for p in all_props if p['derivation_tier'] == 'DERIVED')}")
    mean_conf = sum(p["confidence"] for p in all_props) / len(all_props) if all_props else 0
    print(f"  Mean confidence: {mean_conf:.3f}")
    print(f"Output: {output_path}")


if __name__ == "__main__":
    main()
