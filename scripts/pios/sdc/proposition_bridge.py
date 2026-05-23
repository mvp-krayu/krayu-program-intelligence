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


def resolve_paths(base, client, run_id, sdc_run=None):
    """Resolve input/output paths. SDC artifacts may come from a prior validation run."""
    client_dir = os.path.join(base, "clients", client)
    run_dir = os.path.join(client_dir, "psee", "runs", run_id)

    sdc_source = sdc_run or run_id
    sdc_dir = os.path.join(client_dir, "psee", "runs", sdc_source, "semantic", "compiler")

    canonical_csr = os.path.join(client_dir, "semantic", "client_semantic_registry.json")
    candidate_csr = os.path.join(sdc_dir, "candidate_csr.json")
    derivation_report = os.path.join(sdc_dir, "derivation_report.json")
    review_queue = os.path.join(sdc_dir, "review_queue.json")
    topology = os.path.join(run_dir, "semantic", "topology", "semantic_topology_model.json")
    claims_dir = os.path.join(client_dir, "vaults", "run_01_authoritative", "claims")
    output = os.path.join(run_dir, "semantic", "spe", "semantic_propositions.json")

    return {
        "canonical_csr": canonical_csr,
        "candidate_csr": candidate_csr,
        "derivation_report": derivation_report,
        "review_queue": review_queue,
        "topology": topology,
        "claims_dir": claims_dir,
        "output": output,
        "sdc_source": sdc_source,
    }


def main():
    import argparse
    p = argparse.ArgumentParser(description="PATH B proposition bridge: SDC/CSR → SPE-format propositions")
    p.add_argument("--client", required=True, help="Client ID (e.g. blueedge)")
    p.add_argument("--run-id", required=True, help="Target run ID")
    p.add_argument("--sdc-run", help="SDC validation run to source candidate_csr/derivation_report from (defaults to --run-id)")
    p.add_argument("--output", help="Override output path (defaults to run's semantic/spe/semantic_propositions.json)")
    args = p.parse_args()

    base = os.environ.get("REPO_ROOT", os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
    paths = resolve_paths(base, args.client, args.run_id, args.sdc_run)

    if args.output:
        paths["output"] = args.output

    for name in ("canonical_csr", "candidate_csr", "derivation_report", "review_queue", "topology"):
        if not os.path.exists(paths[name]):
            print(f"FAIL: {name} not found: {paths[name]}")
            sys.exit(1)

    if not os.path.isdir(paths["claims_dir"]):
        print(f"WARNING: claims_dir not found: {paths['claims_dir']} — vault claim propositions will be empty")
        vault_claims = []
    else:
        vault_claims = load_vault_claims(paths["claims_dir"])

    canonical_csr = load_json(paths["canonical_csr"])
    candidate_csr = load_json(paths["candidate_csr"])
    derivation_report = load_json(paths["derivation_report"])
    review_queue = load_json(paths["review_queue"])
    topology_model = load_json(paths["topology"])

    specimen_id = args.client
    run_id = args.run_id
    idx = 1

    print(f"PATH B PROPOSITION BRIDGE: {specimen_id}/{run_id}")
    if paths["sdc_source"] != run_id:
        print(f"  SDC source: {paths['sdc_source']}")
    print()

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
        "bridge_version": "1.1.0",
        "bridge_contract": "PI.SQO.PATH-B-PROPOSITION-BRIDGE.01",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_artifacts": {
            "canonical_csr": paths["canonical_csr"],
            "candidate_csr": paths["candidate_csr"],
            "derivation_report": paths["derivation_report"],
            "review_queue": paths["review_queue"],
            "topology_model": paths["topology"],
            "vault_claims_dir": paths["claims_dir"],
            "sdc_source_run": paths["sdc_source"],
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

    os.makedirs(os.path.dirname(paths["output"]), exist_ok=True)
    with open(paths["output"], "w") as f:
        json.dump(output, f, indent=2)

    print(f"  DOMAIN_EVIDENCE_GROUNDING: {len(domain_props)}")
    print(f"  CAPABILITY_EVIDENCE:       {len(cap_props)}")
    print(f"  VAULT_CLAIM_STRUCTURAL:    {len(claim_props)}")
    print(f"  CROSS_DOMAIN_EVIDENCE:     {len(cross_props)}")
    print(f"  ─────────────────────────")
    print(f"  Total propositions:        {len(all_props)}")
    print(f"  DIRECT_EVIDENCE:           {sum(1 for p in all_props if p['derivation_tier'] == 'DIRECT_EVIDENCE')}")
    print(f"  DERIVED:                   {sum(1 for p in all_props if p['derivation_tier'] == 'DERIVED')}")
    mean_conf = sum(p["confidence"] for p in all_props) / len(all_props) if all_props else 0
    print(f"  Mean confidence:           {mean_conf:.3f}")
    print(f"  Output: {paths['output']}")


if __name__ == "__main__":
    main()
