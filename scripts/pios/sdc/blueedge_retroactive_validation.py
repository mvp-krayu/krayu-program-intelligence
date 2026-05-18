#!/usr/bin/env python3
"""
Semantic Derivation Compiler — BlueEdge Retroactive Validation (V-2)

Runs compiler against BlueEdge evidence, compares to existing 17/42/89 CSR.

BlueEdge serves as certification replay corpus, NOT training corpus.
The 17/42/89 shape is BlueEdge-specific certified reference — NOT a universal model,
target topology, or forced ontology shape.

Validation measures reconstruction capability:
  - Component extraction recall vs certified reference
  - Capability coverage vs certified reference
  - Domain coverage vs certified reference
  - Evidence governance (DIRECT_EVIDENCE ratio, trace completeness)

Hard governance checks (must pass):
  Evidence trace completeness   = 100%
  Component DIRECT_EVIDENCE     ≥ 80%

Reconstruction recall (reported, not forced):
  Component, capability, domain recall against BlueEdge certified shape.
  Deviations are expected — the compiler may find more or fewer elements.
  The certified CSR includes interpretive meta-components that the compiler
  correctly does not fabricate from evidence alone.
"""

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]


@dataclass
class RecallResult:
    metric: str
    target: float
    actual: float
    threshold_count: int
    actual_count: int
    total: int
    passed: bool
    matched: list[str] = field(default_factory=list)
    missed: list[str] = field(default_factory=list)


@dataclass
class RetroactiveValidation:
    governance_checks: list[RecallResult] = field(default_factory=list)
    reconstruction_recall: list[RecallResult] = field(default_factory=list)
    governance_pass: bool = True
    evidence_trace_complete: bool = True
    direct_evidence_ratio: float = 0.0

    def to_dict(self) -> dict:
        def _check_dict(c):
            return {
                "metric": c.metric,
                "target": c.target,
                "actual": round(c.actual, 4),
                "threshold_count": c.threshold_count,
                "actual_count": c.actual_count,
                "total": c.total,
                "passed": c.passed,
                "missed_count": len(c.missed),
                "missed": c.missed[:10],
            }
        return {
            "governance_pass": self.governance_pass,
            "evidence_trace_complete": self.evidence_trace_complete,
            "direct_evidence_ratio": round(self.direct_evidence_ratio, 4),
            "note": "BlueEdge is certification replay corpus, not training target. "
                    "17/42/89 is BlueEdge-specific — not a universal shape constraint.",
            "governance_checks": [_check_dict(c) for c in self.governance_checks],
            "reconstruction_recall": [_check_dict(c) for c in self.reconstruction_recall],
        }


def _normalize(name: str) -> str:
    """Normalize module/component name for fuzzy matching."""
    import re
    name = name.lower().strip()
    name = re.sub(r'\s*\(.*?\)', '', name)
    name = name.replace("module", "").replace("_", "").replace("-", "").replace(" ", "")
    name = name.replace("/", "").replace(".", "")
    return name


def _fuzzy_match(candidate_key: str, certified_key: str) -> bool:
    """Fuzzy name matching: exact, containment, or significant word overlap."""
    if candidate_key == certified_key:
        return True
    if candidate_key in certified_key or certified_key in candidate_key:
        return True
    # Word overlap
    cand_words = set(candidate_key.replace(".", " ").split())
    cert_words = set(certified_key.replace(".", " ").split())
    significant = cand_words & cert_words
    noise = {"and", "the", "of", "a", "&", ""}
    significant -= noise
    if len(significant) >= 1 and significant:
        return True
    return False


def _match_components(
    candidate_components: list[dict],
    certified_components: list[dict],
) -> RecallResult:
    """Match candidate components against certified CSR components.
    Uses fuzzy matching to handle name variations between compiler output
    and the certified CSR (which was human-authored)."""
    certified_names = {}
    for c in certified_components:
        key = _normalize(c["name"])
        certified_names[key] = c["name"]

    matched = []
    matched_certified_keys = set()

    for cc in candidate_components:
        cand_key = _normalize(cc["name"])
        for cert_key, cert_name in certified_names.items():
            if cert_key in matched_certified_keys:
                continue
            if _fuzzy_match(cand_key, cert_key):
                matched.append(cert_name)
                matched_certified_keys.add(cert_key)
                break

    missed = [name for key, name in certified_names.items()
              if key not in matched_certified_keys]

    total = len(certified_components)
    actual = len(matched) / total if total > 0 else 0.0

    return RecallResult(
        metric="component_extraction_recall",
        target=0.95,
        actual=actual,
        threshold_count=int(total * 0.95),
        actual_count=len(matched),
        total=total,
        passed=actual >= 0.95,
        matched=matched,
        missed=missed,
    )


def _match_capabilities(
    candidate_capabilities: list[dict],
    certified_capabilities: list[dict],
    candidate_components: list[dict],
    certified_components: list[dict],
) -> RecallResult:
    """Match by component coverage: what fraction of certified capabilities
    have their components represented in the candidate's capability structure.

    The compiler produces coarser capabilities (13 groups) while the certified CSR
    has 42 fine-grained capabilities. We measure whether the certified capability's
    components are covered, not whether names match 1:1.
    """
    # Build component name → capability_id mapping for candidate
    candidate_comp_caps = {}
    for cc in candidate_components:
        key = _normalize(cc["name"])
        candidate_comp_caps[key] = cc.get("capability_id", "")

    # Build set of candidate component keys for fuzzy matching
    candidate_keys = set(candidate_comp_caps.keys())

    # For each certified capability, check if its components exist in candidate
    matched = []
    missed = []

    for cert_cap in certified_capabilities:
        cert_cap_comps = [c for c in certified_components
                         if c.get("capability_id") == cert_cap["capability_id"]]
        if not cert_cap_comps:
            missed.append(cert_cap["name"])
            continue

        found_count = 0
        for comp in cert_cap_comps:
            cert_key = _normalize(comp["name"])
            if cert_key in candidate_keys:
                found_count += 1
            else:
                for cand_key in candidate_keys:
                    if _fuzzy_match(cand_key, cert_key):
                        found_count += 1
                        break

        # Capability is "covered" if ≥50% of its components were extracted
        if cert_cap_comps and found_count / len(cert_cap_comps) >= 0.50:
            matched.append(cert_cap["name"])
        else:
            missed.append(cert_cap["name"])

    total = len(certified_capabilities)
    actual = len(matched) / total if total > 0 else 0.0

    return RecallResult(
        metric="capability_recall",
        target=0.83,
        actual=actual,
        threshold_count=int(total * 0.83),
        actual_count=len(matched),
        total=total,
        passed=actual >= 0.83,
        matched=matched,
        missed=missed,
    )


def _match_domains(
    candidate_domains: list[dict],
    certified_domains: list[dict],
) -> RecallResult:
    """Match candidate domains against certified CSR domains."""
    certified_names = {}
    for d in certified_domains:
        key = _normalize(d["name"])
        certified_names[key] = d["name"]

    matched = []
    for cd in candidate_domains:
        key = _normalize(cd["name"])
        if key in certified_names:
            matched.append(certified_names[key])
            continue
        # Partial match
        for cert_key, cert_name in certified_names.items():
            if cert_key in key or key in cert_key:
                if cert_name not in matched:
                    matched.append(cert_name)
                    break
        # Word overlap match
        if cd["name"] not in [m for m in matched]:
            cd_words = set(cd["name"].lower().split())
            for cert_key, cert_name in certified_names.items():
                cert_words = set(cert_name.lower().split())
                overlap = cd_words & cert_words
                significant = overlap - {"and", "the", "of", "a", "&"}
                if len(significant) >= 2 and cert_name not in matched:
                    matched.append(cert_name)
                    break

    missed = [name for key, name in certified_names.items()
              if name not in matched]

    total = len(certified_domains)
    actual = len(matched) / total if total > 0 else 0.0

    return RecallResult(
        metric="domain_recall",
        target=0.82,
        actual=actual,
        threshold_count=int(total * 0.82),
        actual_count=len(matched),
        total=total,
        passed=actual >= 0.82,
        matched=matched,
        missed=missed,
    )


def validate_retroactive(
    candidate_path: Path,
    certified_csr_path: Path,
) -> RetroactiveValidation:
    """Run retroactive validation comparing candidate to certified CSR."""
    with open(candidate_path) as f:
        candidate = json.load(f)
    with open(certified_csr_path) as f:
        certified = json.load(f)

    result = RetroactiveValidation()
    components = candidate.get("components", [])

    # ===== GOVERNANCE CHECKS (hard pass/fail) =====

    # DIRECT_EVIDENCE ratio — compiler must produce evidence-backed output
    direct_count = sum(1 for c in components if c.get("confidence") == "DIRECT_EVIDENCE")
    total = len(components)
    de_ratio = direct_count / total if total > 0 else 0.0
    result.direct_evidence_ratio = de_ratio

    de_check = RecallResult(
        metric="component_direct_evidence_ratio",
        target=0.80,
        actual=de_ratio,
        threshold_count=int(total * 0.80),
        actual_count=direct_count,
        total=total,
        passed=de_ratio >= 0.80,
    )
    result.governance_checks.append(de_check)
    if not de_check.passed:
        result.governance_pass = False

    # Evidence trace completeness — every element must have evidence_refs
    missing_refs = [c["component_id"] for c in components if not c.get("evidence_refs")]
    result.evidence_trace_complete = len(missing_refs) == 0
    trace_check = RecallResult(
        metric="evidence_trace_completeness",
        target=1.0,
        actual=1.0 if not missing_refs else (total - len(missing_refs)) / total,
        threshold_count=total,
        actual_count=total - len(missing_refs),
        total=total,
        passed=len(missing_refs) == 0,
        missed=[f"Missing refs: {mid}" for mid in missing_refs[:5]],
    )
    result.governance_checks.append(trace_check)
    if not trace_check.passed:
        result.governance_pass = False

    # Review status must be CANDIDATE
    review_status = candidate.get("metadata", {}).get("review_status")
    review_check = RecallResult(
        metric="review_status_is_candidate",
        target=1.0,
        actual=1.0 if review_status == "CANDIDATE" else 0.0,
        threshold_count=1, actual_count=1 if review_status == "CANDIDATE" else 0,
        total=1, passed=review_status == "CANDIDATE",
    )
    result.governance_checks.append(review_check)
    if not review_check.passed:
        result.governance_pass = False

    # Qualification ceiling must be L3
    ceiling = candidate.get("compiler_metadata", {}).get("qualification_ceiling")
    ceiling_check = RecallResult(
        metric="qualification_ceiling_is_L3",
        target=1.0,
        actual=1.0 if ceiling == "L3" else 0.0,
        threshold_count=1, actual_count=1 if ceiling == "L3" else 0,
        total=1, passed=ceiling == "L3",
    )
    result.governance_checks.append(ceiling_check)
    if not ceiling_check.passed:
        result.governance_pass = False

    # ===== RECONSTRUCTION RECALL (reported, not forced) =====
    # BlueEdge 17/42/89 is the certified reference shape.
    # Deviations are expected — the compiler may find more or fewer elements.

    comp_result = _match_components(
        candidate.get("components", []),
        certified.get("components", []),
    )
    result.reconstruction_recall.append(comp_result)

    cap_result = _match_capabilities(
        candidate.get("capabilities", []),
        certified.get("capabilities", []),
        candidate.get("components", []),
        certified.get("components", []),
    )
    result.reconstruction_recall.append(cap_result)

    dom_result = _match_domains(
        candidate.get("domains", []),
        certified.get("domains", []),
    )
    result.reconstruction_recall.append(dom_result)

    return result


def main():
    candidate_path = (
        REPO_ROOT / "clients" / "blueedge" / "psee" / "runs"
        / "run_blueedge_sdc_validation_01" / "semantic" / "compiler"
        / "candidate_csr.json"
    )
    certified_csr_path = (
        REPO_ROOT / "clients" / "blueedge" / "semantic"
        / "client_semantic_registry.json"
    )

    if not candidate_path.is_file():
        print(f"FAIL: Candidate CSR not found: {candidate_path}", file=sys.stderr)
        print("Run the compiler first:", file=sys.stderr)
        print("  python3 scripts/pios/semantic_derivation_compiler.py \\", file=sys.stderr)
        print("    --client blueedge --run run_blueedge_sdc_validation_01 \\", file=sys.stderr)
        print("    --evidence-dir clients/blueedge/sqo/evidence/blueedge_explicit_html_rebase_01",
              file=sys.stderr)
        sys.exit(1)

    if not certified_csr_path.is_file():
        print(f"FAIL: Certified CSR not found: {certified_csr_path}", file=sys.stderr)
        sys.exit(1)

    print("BlueEdge Retroactive Validation")
    print(f"  Candidate: {candidate_path}")
    print(f"  Certified: {certified_csr_path}")
    print()

    result = validate_retroactive(candidate_path, certified_csr_path)

    print("=== GOVERNANCE CHECKS (hard pass/fail) ===")
    for check in result.governance_checks:
        status = "PASS" if check.passed else "FAIL"
        print(f"  [{status}] {check.metric}:")
        print(f"    Target: {check.target:.0%} ({check.threshold_count}/{check.total})")
        print(f"    Actual: {check.actual:.1%} ({check.actual_count}/{check.total})")
        if check.missed:
            print(f"    Missed ({len(check.missed)}): {', '.join(check.missed[:5])}")
        print()

    print("=== RECONSTRUCTION RECALL (reported, not forced) ===")
    print("  NOTE: 17/42/89 is BlueEdge-specific. Deviations are expected.")
    print()
    for check in result.reconstruction_recall:
        status = "PASS" if check.passed else "MISS"
        print(f"  [{status}] {check.metric}:")
        print(f"    Reference: {check.target:.0%} ({check.threshold_count}/{check.total})")
        print(f"    Actual: {check.actual:.1%} ({check.actual_count}/{check.total})")
        if check.missed:
            print(f"    Missed ({len(check.missed)}): {', '.join(check.missed[:5])}")
        print()

    status = "GOVERNANCE PASS" if result.governance_pass else "GOVERNANCE FAIL"
    print(f"Result: {status}")

    # Write validation result to output directory
    output_path = candidate_path.parent / "retroactive_validation.json"
    with open(output_path, "w") as f:
        json.dump(result.to_dict(), f, indent=2)
    print(f"Validation written to: {output_path}")

    sys.exit(0 if result.governance_pass else 1)


if __name__ == "__main__":
    main()
