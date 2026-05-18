#!/usr/bin/env python3
"""
semantic_derivation_compiler.py
Stream: PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01

Governed AI-assisted semantic reconstruction from evidence → candidate CSR.
SQO Stage 3: Semantic Construction.

AI proposes, never self-authorizes.
Output is ALWAYS review_status: "CANDIDATE".
Compiler may NEVER write to canonical CSR path.

Phases:
  P0: Evidence Gate      (deterministic — BEFORE any AI invocation)
  P1: Evidence Parse     (deterministic)
  P2: Component Extract  (tiered — deterministic first, AI for gaps)
  P3: Capability Group   (signal-ranked)
  P4: Domain Classify    (signal-ranked)
  P5: Confidence Score   (deterministic)
  P6: Review Queue Gen   (deterministic)

Failure Classes:
  EVIDENCE_INSUFFICIENT         — evidence gate rejects input
  STRUCTURAL_CONTEXT_MISSING    — canonical_topology.json absent or invalid
  PARSE_INCOMPLETE              — parser extracts zero components
  AI_PROVIDER_UNAVAILABLE       — LLM adapter cannot reach provider
  LOW_CONFIDENCE_CANDIDATE      — overall DIRECT_EVIDENCE ratio < 50%
  REVIEW_REQUIRED               — any review trigger fires
  SCHEMA_INVALID                — candidate CSR fails schema validation

Usage:
    python3 scripts/pios/semantic_derivation_compiler.py \\
        --client blueedge \\
        --run run_blueedge_sdc_validation_01 \\
        --evidence-dir clients/blueedge/sqo/evidence/blueedge_explicit_html_rebase_01 \\
        --enable-semantic-derivation

Exit codes:
    0 = COMPILATION_COMPLETE
    1 = FAIL_CLOSED
    2 = EVIDENCE_INSUFFICIENT or STRUCTURAL_CONTEXT_MISSING
    3 = PARSE_INCOMPLETE
    4 = AI_PROVIDER_UNAVAILABLE (partial output emitted)
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

sys.path.insert(0, str(REPO_ROOT))

from scripts.pios.sdc.evidence_parser import parse_evidence_directory, sha256_file
from scripts.pios.sdc.domain_proposer import propose_domains
from scripts.pios.sdc.confidence_scorer import score_confidence
from scripts.pios.sdc.review_queue_generator import generate_review_queue
from scripts.pios.sdc.candidate_csr_emitter import (
    emit_candidate_csr, emit_derivation_report,
    emit_review_queue, emit_rejection_report,
)
from scripts.pios.sdc.validate_candidate_csr import (
    validate_candidate_csr, validate_derivation_report, validate_review_queue,
)


def fail(stage: str, reason: str, code: int = 1):
    print(f"FAIL-CLOSED [{stage}]: {reason}", file=sys.stderr)
    sys.exit(code)


def load_json(path: Path, label: str):
    if not path.is_file():
        return None
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        fail(label, f"failed to parse {path}: {e}")


def main():
    ap = argparse.ArgumentParser(
        description="Semantic Derivation Compiler — SQO Stage 3"
    )
    ap.add_argument("--client", required=True, help="Client identifier")
    ap.add_argument("--run", required=True, help="Run identifier")
    ap.add_argument("--evidence-dir", required=True, type=Path,
                    help="Directory containing HTML evidence files")
    ap.add_argument("--output-dir", type=Path, default=None,
                    help="Override output directory")
    ap.add_argument("--enable-semantic-derivation", action="store_true",
                    help="Enable AI-assisted semantic derivation phases")
    args = ap.parse_args()

    client = args.client
    run_id = args.run
    evidence_dir = args.evidence_dir
    enable_ai = args.enable_semantic_derivation

    # Resolve paths
    if not evidence_dir.is_absolute():
        evidence_dir = REPO_ROOT / evidence_dir

    output_dir = args.output_dir
    if output_dir is None:
        output_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "semantic" / "compiler"
    elif not output_dir.is_absolute():
        output_dir = REPO_ROOT / output_dir

    canonical_csr_path = REPO_ROOT / "clients" / client / "semantic" / "client_semantic_registry.json"
    canonical_topology_path = (
        REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
        / "structure" / "40.4" / "canonical_topology.json"
    )

    print(f"Semantic Derivation Compiler v1.0.0")
    print(f"Client: {client}")
    print(f"Run: {run_id}")
    print(f"Evidence: {evidence_dir}")
    print(f"Output: {output_dir}")
    print(f"AI enabled: {enable_ai}")
    print()

    # -----------------------------------------------------------------------
    # P0: Evidence Gate (deterministic — BEFORE any AI invocation)
    # -----------------------------------------------------------------------
    print("P0: Evidence Gate...")

    if not evidence_dir.is_dir():
        emit_rejection_report(
            reason="EVIDENCE_INSUFFICIENT",
            evidence_inventory={"error": f"Directory not found: {evidence_dir}"},
            evidence_hashes={},
            guidance="Provide a directory containing HTML evidence files.",
            output_dir=output_dir,
        )
        fail("P0_EVIDENCE_GATE", f"Evidence directory not found: {evidence_dir}", code=2)

    html_files = sorted(evidence_dir.glob("*.html"))
    if not html_files:
        emit_rejection_report(
            reason="EVIDENCE_INSUFFICIENT",
            evidence_inventory={"files_found": 0, "directory": str(evidence_dir)},
            evidence_hashes={},
            guidance="Evidence directory must contain at least one HTML file with component/module structure.",
            output_dir=output_dir,
        )
        fail("P0_EVIDENCE_GATE", "No HTML files in evidence directory", code=2)

    evidence_hashes = {}
    for f in html_files:
        evidence_hashes[f.name] = sha256_file(f)

    # Check structural context (PATH A topology)
    canonical_topology = load_json(canonical_topology_path, "canonical_topology")
    # Structural context is RECOMMENDED, not required for basic compilation
    if canonical_topology:
        print(f"  Structural context: {canonical_topology_path.name} loaded")
    else:
        print(f"  Structural context: not found (proceeding without PATH A)")

    print(f"  Evidence files: {len(html_files)}")
    for name, h in evidence_hashes.items():
        print(f"    {name}: {h}")
    print("  P0: PASS")
    print()

    # -----------------------------------------------------------------------
    # P1: Evidence Parsing (deterministic)
    # -----------------------------------------------------------------------
    print("P1: Evidence Parsing...")

    parse_result = parse_evidence_directory(evidence_dir)

    if parse_result.status == "PARSE_INCOMPLETE":
        emit_rejection_report(
            reason="PARSE_INCOMPLETE",
            evidence_inventory={
                "files_scanned": len(html_files),
                "components_found": 0,
                "frontend_pages_found": 0,
            },
            evidence_hashes=evidence_hashes,
            guidance="Evidence files must contain structured HTML with module cards (.m/.mn/.md elements) or page listings (.pi/.pn elements).",
            output_dir=output_dir,
        )
        fail("P1_EVIDENCE_PARSE", "Parser extracted zero components", code=3)

    print(f"  Documents: {len(parse_result.documents)}")
    print(f"  Components: {parse_result.total_components}")
    print(f"  Frontend pages: {parse_result.total_frontend_pages}")
    print(f"  Groups: {parse_result.total_groups}")
    print(f"  Sections: {parse_result.total_sections}")
    print("  P1: PASS")
    print()

    # -----------------------------------------------------------------------
    # P2-P4: Component Extract + Capability Group + Domain Classify
    # -----------------------------------------------------------------------
    print("P2-P4: Component Extraction + Capability Grouping + Domain Classification...")

    proposal = propose_domains(
        parse_result,
        canonical_topology=canonical_topology,
        enable_ai=enable_ai,
    )

    print(f"  Components: {len(proposal.components)}")
    print(f"  Capabilities: {len(proposal.capabilities)}")
    print(f"  Domains: {len(proposal.domains)}")
    print(f"  AI phase completed: {proposal.ai_phase_completed}")
    if proposal.ai_provider_error:
        print(f"  AI provider error: {proposal.ai_provider_error}")
    print("  P2-P4: PASS")
    print()

    # Determine compiler status
    compiler_status = "COMPLETE"
    if enable_ai and not proposal.ai_phase_completed:
        compiler_status = "PARTIAL_DETERMINISTIC_ONLY"
        print(f"  WARNING: AI_PROVIDER_UNAVAILABLE — emitting partial deterministic output")

    # -----------------------------------------------------------------------
    # P5: Confidence Scoring (deterministic)
    # -----------------------------------------------------------------------
    print("P5: Confidence Scoring...")

    confidence_report = score_confidence(proposal)

    print(f"  Overall DIRECT_EVIDENCE ratio: {confidence_report.overall_direct_evidence_ratio:.1%}")
    print(f"  Distribution: {confidence_report.overall.to_dict()}")
    print(f"  Low confidence candidate: {confidence_report.low_confidence_candidate}")
    print("  P5: PASS")
    print()

    # -----------------------------------------------------------------------
    # P6: Review Queue Generation (deterministic)
    # -----------------------------------------------------------------------
    print("P6: Review Queue Generation...")

    review_queue = generate_review_queue(proposal, confidence_report)

    print(f"  Review required: {review_queue.review_required}")
    print(f"  Review items: {len(review_queue.items)}")
    print(f"  Triggers: {review_queue.trigger_summary}")
    print("  P6: PASS")
    print()

    # -----------------------------------------------------------------------
    # Emit outputs
    # -----------------------------------------------------------------------
    print("Emitting outputs...")

    candidate = emit_candidate_csr(
        proposal=proposal,
        confidence_report=confidence_report,
        client_id=client,
        run_id=run_id,
        evidence_hashes=evidence_hashes,
        output_dir=output_dir,
        compiler_status=compiler_status,
    )

    report = emit_derivation_report(
        proposal=proposal,
        confidence_report=confidence_report,
        evidence_hashes=evidence_hashes,
        output_dir=output_dir,
    )

    queue_data = emit_review_queue(
        review=review_queue,
        output_dir=output_dir,
    )

    print(f"  candidate_csr.json: {output_dir / 'candidate_csr.json'}")
    print(f"  derivation_report.json: {output_dir / 'derivation_report.json'}")
    print(f"  review_queue.json: {output_dir / 'review_queue.json'}")
    print()

    # -----------------------------------------------------------------------
    # Validation
    # -----------------------------------------------------------------------
    print("Validating outputs...")

    csr_validation = validate_candidate_csr(candidate)
    report_validation = validate_derivation_report(report)
    queue_validation = validate_review_queue(queue_data)

    all_pass = csr_validation.all_pass and report_validation.all_pass and queue_validation.all_pass

    print(f"  candidate_csr: {csr_validation.to_dict()['passed']}/{csr_validation.to_dict()['total']} PASS")
    print(f"  derivation_report: {report_validation.to_dict()['passed']}/{report_validation.to_dict()['total']} PASS")
    print(f"  review_queue: {queue_validation.to_dict()['passed']}/{queue_validation.to_dict()['total']} PASS")

    if not all_pass:
        print("\n  SCHEMA_INVALID — validation failures:")
        for v in [csr_validation, report_validation, queue_validation]:
            for check in v.checks:
                if check.status == "FAIL":
                    print(f"    FAIL: {check.name} — {check.detail}")

    print()

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    exit_code = 0
    status_label = "COMPILATION_COMPLETE"

    if not all_pass:
        exit_code = 1
        status_label = "SCHEMA_INVALID"
    elif compiler_status == "PARTIAL_DETERMINISTIC_ONLY":
        exit_code = 4
        status_label = "AI_PROVIDER_UNAVAILABLE"
    elif confidence_report.low_confidence_candidate:
        status_label = "LOW_CONFIDENCE_CANDIDATE"
    elif review_queue.review_required:
        status_label = "REVIEW_REQUIRED"

    print(f"Status: {status_label}")
    print(f"Compiler status: {compiler_status}")
    print(f"Domains: {len(proposal.domains)}")
    print(f"Capabilities: {len(proposal.capabilities)}")
    print(f"Components: {len(proposal.components)}")
    print(f"DIRECT_EVIDENCE ratio: {confidence_report.overall_direct_evidence_ratio:.1%}")
    print(f"Review items: {len(review_queue.items)}")
    print(f"Output: {output_dir}")

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
