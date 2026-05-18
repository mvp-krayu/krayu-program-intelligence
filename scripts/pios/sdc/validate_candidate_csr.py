"""
Semantic Derivation Compiler — Candidate CSR Validator (V-1)
Schema + referential integrity + confidence bounds validation.
"""

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class ValidationCheck:
    name: str
    status: str  # PASS | FAIL
    detail: str = ""


@dataclass
class ValidationResult:
    checks: list[ValidationCheck] = field(default_factory=list)
    all_pass: bool = True

    def add(self, name: str, status: str, detail: str = ""):
        self.checks.append(ValidationCheck(name=name, status=status, detail=detail))
        if status == "FAIL":
            self.all_pass = False

    def to_dict(self) -> dict:
        return {
            "all_pass": self.all_pass,
            "total": len(self.checks),
            "passed": sum(1 for c in self.checks if c.status == "PASS"),
            "failed": sum(1 for c in self.checks if c.status == "FAIL"),
            "checks": [{"name": c.name, "status": c.status, "detail": c.detail}
                       for c in self.checks],
        }


def validate_candidate_csr(candidate: dict) -> ValidationResult:
    """Validate candidate CSR against schema and referential integrity."""
    v = ValidationResult()

    # Schema version
    if candidate.get("schema_version") == "1.0":
        v.add("schema_version", "PASS", "schema_version is 1.0")
    else:
        v.add("schema_version", "FAIL", f"Expected 1.0, got {candidate.get('schema_version')}")

    # Client ID
    if candidate.get("client_id"):
        v.add("client_id_present", "PASS")
    else:
        v.add("client_id_present", "FAIL", "Missing client_id")

    # Review status MUST be CANDIDATE
    review_status = candidate.get("metadata", {}).get("review_status")
    if review_status == "CANDIDATE":
        v.add("review_status_candidate", "PASS")
    else:
        v.add("review_status_candidate", "FAIL",
              f"Expected CANDIDATE, got {review_status}")

    # Compiler metadata
    cm = candidate.get("compiler_metadata", {})
    if cm.get("sqo_stage") == "S3_SEMANTIC_CONSTRUCTION":
        v.add("sqo_stage", "PASS")
    else:
        v.add("sqo_stage", "FAIL", f"Expected S3_SEMANTIC_CONSTRUCTION, got {cm.get('sqo_stage')}")

    if cm.get("qualification_ceiling") == "L3":
        v.add("qualification_ceiling", "PASS")
    else:
        v.add("qualification_ceiling", "FAIL",
              f"Expected L3, got {cm.get('qualification_ceiling')}")

    # Domains present
    domains = candidate.get("domains", [])
    if len(domains) > 0:
        v.add("domains_present", "PASS", f"{len(domains)} domains")
    else:
        v.add("domains_present", "FAIL", "No domains")

    # Capabilities present
    capabilities = candidate.get("capabilities", [])
    if len(capabilities) > 0:
        v.add("capabilities_present", "PASS", f"{len(capabilities)} capabilities")
    else:
        v.add("capabilities_present", "FAIL", "No capabilities")

    # Components present
    components = candidate.get("components", [])
    if len(components) > 0:
        v.add("components_present", "PASS", f"{len(components)} components")
    else:
        v.add("components_present", "FAIL", "No components")

    # Domain IDs unique
    domain_ids = [d["domain_id"] for d in domains]
    if len(domain_ids) == len(set(domain_ids)):
        v.add("domain_ids_unique", "PASS")
    else:
        v.add("domain_ids_unique", "FAIL", "Duplicate domain IDs")

    # Capability IDs unique
    cap_ids = [c["capability_id"] for c in capabilities]
    if len(cap_ids) == len(set(cap_ids)):
        v.add("capability_ids_unique", "PASS")
    else:
        v.add("capability_ids_unique", "FAIL", "Duplicate capability IDs")

    # Component IDs unique
    comp_ids = [c["component_id"] for c in components]
    if len(comp_ids) == len(set(comp_ids)):
        v.add("component_ids_unique", "PASS")
    else:
        v.add("component_ids_unique", "FAIL", "Duplicate component IDs")

    # Referential integrity: capability.domain_id → domain
    domain_id_set = set(domain_ids)
    bad_cap_refs = [c["capability_id"] for c in capabilities
                    if c.get("domain_id") and c["domain_id"] not in domain_id_set]
    if not bad_cap_refs:
        v.add("capability_domain_refs", "PASS")
    else:
        v.add("capability_domain_refs", "FAIL",
              f"Capabilities with invalid domain_id: {bad_cap_refs}")

    # Referential integrity: component.capability_id → capability
    cap_id_set = set(cap_ids)
    bad_comp_refs = [c["component_id"] for c in components
                     if c.get("capability_id") and c["capability_id"] not in cap_id_set]
    if not bad_comp_refs:
        v.add("component_capability_refs", "PASS")
    else:
        v.add("component_capability_refs", "FAIL",
              f"Components with invalid capability_id: {bad_comp_refs}")

    # Referential integrity: component.domain_id → domain
    bad_comp_domain = [c["component_id"] for c in components
                       if c.get("domain_id") and c["domain_id"] not in domain_id_set]
    if not bad_comp_domain:
        v.add("component_domain_refs", "PASS")
    else:
        v.add("component_domain_refs", "FAIL",
              f"Components with invalid domain_id: {bad_comp_domain}")

    # Confidence values valid
    valid_confidences = {"DIRECT_EVIDENCE", "DERIVED", "INFERRED"}
    bad_conf = []
    for c in components:
        if c.get("confidence") and c["confidence"] not in valid_confidences:
            bad_conf.append(c["component_id"])
    if not bad_conf:
        v.add("confidence_values_valid", "PASS")
    else:
        v.add("confidence_values_valid", "FAIL",
              f"Invalid confidence values: {bad_conf}")

    # Evidence refs present on all elements
    missing_refs = []
    for c in components:
        if not c.get("evidence_refs"):
            missing_refs.append(c["component_id"])
    if not missing_refs:
        v.add("evidence_refs_complete", "PASS", "All components have evidence_refs")
    else:
        v.add("evidence_refs_complete", "FAIL",
              f"{len(missing_refs)} components missing evidence_refs")

    # Domain types valid
    valid_types = {"FUNCTIONAL", "INFRASTRUCTURE", "OPERATIONAL", "CROSS-CUTTING", "INTEGRATION"}
    bad_types = [d["domain_id"] for d in domains
                 if d.get("type") and d["type"] not in valid_types]
    if not bad_types:
        v.add("domain_types_valid", "PASS")
    else:
        v.add("domain_types_valid", "FAIL",
              f"Invalid domain types: {bad_types}")

    # Evidence hashes present in compiler_metadata
    if cm.get("evidence_hashes"):
        v.add("evidence_hashes_present", "PASS")
    else:
        v.add("evidence_hashes_present", "FAIL", "No evidence_hashes in compiler_metadata")

    return v


def validate_derivation_report(report: dict) -> ValidationResult:
    """Validate derivation_report.json structure."""
    v = ValidationResult()

    if report.get("compiler_version"):
        v.add("compiler_version_present", "PASS")
    else:
        v.add("compiler_version_present", "FAIL")

    elements = report.get("per_element_derivation", [])
    if elements:
        v.add("per_element_present", "PASS", f"{len(elements)} elements")
    else:
        v.add("per_element_present", "FAIL", "No per-element derivation data")

    missing_chain = [e["element_id"] for e in elements if not e.get("derivation_chain")]
    if not missing_chain:
        v.add("derivation_chains_complete", "PASS")
    else:
        v.add("derivation_chains_complete", "FAIL",
              f"{len(missing_chain)} elements missing derivation_chain")

    if report.get("evidence_hashes"):
        v.add("evidence_hashes_present", "PASS")
    else:
        v.add("evidence_hashes_present", "FAIL")

    return v


def validate_review_queue(queue: dict) -> ValidationResult:
    """Validate review_queue.json structure."""
    v = ValidationResult()

    if "review_required" in queue:
        v.add("review_required_field", "PASS")
    else:
        v.add("review_required_field", "FAIL")

    if "items" in queue:
        v.add("items_field", "PASS")
    else:
        v.add("items_field", "FAIL")

    for item in queue.get("items", []):
        if not item.get("trigger"):
            v.add(f"item_trigger_{item.get('domain_id', '?')}", "FAIL", "Missing trigger")
        if not item.get("suggested_action"):
            v.add(f"item_action_{item.get('domain_id', '?')}", "FAIL", "Missing suggested_action")

    if v.all_pass:
        v.add("review_queue_structure", "PASS")

    return v


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: validate_candidate_csr.py <path-to-candidate_csr.json>")
        sys.exit(1)

    path = Path(sys.argv[1])
    with open(path) as f:
        candidate = json.load(f)

    result = validate_candidate_csr(candidate)
    for check in result.checks:
        status = "PASS" if check.status == "PASS" else "FAIL"
        detail = f" — {check.detail}" if check.detail else ""
        print(f"  [{status}] {check.name}{detail}")

    print(f"\n{'ALL PASS' if result.all_pass else 'VALIDATION FAILED'}")
    sys.exit(0 if result.all_pass else 1)
