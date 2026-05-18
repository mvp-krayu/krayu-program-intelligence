"""
Semantic Derivation Compiler — Candidate CSR Emitter (P-6)
Format output as CSR-schema JSON with provenance.

Output is ALWAYS review_status: "CANDIDATE".
Compiler may NEVER write to canonical CSR path.
Output path: clients/{client}/psee/runs/{run}/semantic/compiler/
"""

import hashlib
import json
from datetime import datetime, timezone
from dataclasses import asdict
from pathlib import Path
from typing import Optional

from .domain_proposer import ProposalResult
from .confidence_scorer import ConfidenceReport
from .review_queue_generator import ReviewQueue

COMPILER_VERSION = "1.0.0"
COMPILER_CONTRACT = "PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01"


def sha256_of(obj: object) -> str:
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:16]


def emit_candidate_csr(
    proposal: ProposalResult,
    confidence_report: ConfidenceReport,
    client_id: str,
    run_id: str,
    evidence_hashes: dict[str, str],
    output_dir: Path,
    compiler_status: str = "COMPLETE",
) -> dict:
    """
    Produce candidate_csr.json in CSR v1.0 schema with compiler extensions.
    Returns the candidate CSR dict.
    """
    domains = []
    for d in proposal.domains:
        domains.append({
            "domain_id": d.domain_id,
            "name": d.name,
            "type": d.domain_type,
            "grounding": "evidence_derived",
            "description": d.description or f"Derived domain: {d.name}",
            "confidence": d.confidence,
            "evidence_refs": d.evidence_refs,
        })

    capabilities = []
    for c in proposal.capabilities:
        capabilities.append({
            "capability_id": c.capability_id,
            "name": c.name,
            "domain_id": c.domain_id,
            "type": c.cap_type,
            "weakly_grounded": c.confidence == "INFERRED",
            "confidence": c.confidence,
            "evidence_refs": c.evidence_refs,
            "grouping_signal": c.grouping_signal,
        })

    components = []
    for comp in proposal.components:
        components.append({
            "component_id": comp.component_id,
            "name": comp.name,
            "description": comp.description,
            "capability_id": comp.capability_id,
            "domain_id": comp.domain_id,
            "confidence": comp.confidence,
            "evidence_refs": comp.evidence_refs,
            "source_tier": comp.source_tier,
            "cross_domain": comp.cross_domain,
        })

    candidate = {
        "schema_version": "1.0",
        "client_id": client_id,
        "domains": domains,
        "capabilities": capabilities,
        "components": components,
        "cluster_assignments": [],
        "edges": [],
        "lineage_overrides": [],
        "metadata": {
            "review_status": "CANDIDATE",
            "generated_by": "semantic_derivation_compiler",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
        "compiler_metadata": {
            "compiler_version": COMPILER_VERSION,
            "compiler_contract": COMPILER_CONTRACT,
            "compiler_status": compiler_status,
            "ai_phase_completed": proposal.ai_phase_completed,
            "evidence_hashes": evidence_hashes,
            "sqo_stage": "S3_SEMANTIC_CONSTRUCTION",
            "qualification_ceiling": "L3",
            "confidence_distribution": confidence_report.overall.to_dict(),
        },
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "candidate_csr.json"
    with open(output_path, "w") as f:
        json.dump(candidate, f, indent=2)

    return candidate


def emit_derivation_report(
    proposal: ProposalResult,
    confidence_report: ConfidenceReport,
    evidence_hashes: dict[str, str],
    output_dir: Path,
) -> dict:
    """Produce derivation_report.json — full evidence trail."""
    per_element = []
    for comp in proposal.components:
        per_element.append({
            "element_id": comp.component_id,
            "element_name": comp.name,
            "element_type": "component",
            "confidence": comp.confidence,
            "source_tier": comp.source_tier,
            "derivation_chain": comp.evidence_refs,
        })

    for cap in proposal.capabilities:
        per_element.append({
            "element_id": cap.capability_id,
            "element_name": cap.name,
            "element_type": "capability",
            "confidence": cap.confidence,
            "grouping_signal": cap.grouping_signal,
            "derivation_chain": cap.evidence_refs,
        })

    for domain in proposal.domains:
        per_element.append({
            "element_id": domain.domain_id,
            "element_name": domain.name,
            "element_type": "domain",
            "confidence": domain.confidence,
            "derivation_chain": domain.evidence_refs,
        })

    report = {
        "compiler_version": COMPILER_VERSION,
        "compiler_contract": COMPILER_CONTRACT,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "evidence_hashes": evidence_hashes,
        "confidence_distribution": confidence_report.overall.to_dict(),
        "per_domain_confidence": [d.to_dict() for d in confidence_report.per_domain],
        "derivation_log": proposal.derivation_log,
        "per_element_derivation": per_element,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    with open(output_dir / "derivation_report.json", "w") as f:
        json.dump(report, f, indent=2)

    return report


def emit_review_queue(
    review: ReviewQueue,
    output_dir: Path,
) -> dict:
    """Produce review_queue.json."""
    data = review.to_dict()
    data["compiler_version"] = COMPILER_VERSION
    data["generated_at"] = datetime.now(timezone.utc).isoformat()

    output_dir.mkdir(parents=True, exist_ok=True)
    with open(output_dir / "review_queue.json", "w") as f:
        json.dump(data, f, indent=2)

    return data


def emit_rejection_report(
    reason: str,
    evidence_inventory: dict,
    evidence_hashes: dict[str, str],
    guidance: str,
    output_dir: Path,
) -> dict:
    """Produce rejection_report.json when evidence gate rejects input."""
    report = {
        "compiler_version": COMPILER_VERSION,
        "compiler_contract": COMPILER_CONTRACT,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "rejection_reason": reason,
        "evidence_inventory": evidence_inventory,
        "evidence_hashes": evidence_hashes,
        "guidance": guidance,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    with open(output_dir / "rejection_report.json", "w") as f:
        json.dump(report, f, indent=2)

    return report
