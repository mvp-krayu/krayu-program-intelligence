#!/usr/bin/env python3
"""
parity_check.py
PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1

Compares generated 41.1 artifacts against canonical docs/pios/41.1/ artifacts.

Checks structural equivalence for each of the 7 markdown files:
  - Entity ID presence (all DOMAIN-NN, CAP-NN, COMP-NN)
  - Section header presence
  - Key metadata tokens (artifact_id, counts, ratios, verdicts)
  - Directive IDs (SFD-01..SFD-10)
  - Manifest totals and node/link IDs

Reports EXACT_MATCH (all structural checks pass) or DIFF (with field-level detail).

Usage:
  python3 parity_check.py                                           # /tmp/pios_41_1_output vs docs/pios/41.1
  python3 parity_check.py --generated /tmp/pios_41_1_output
  python3 parity_check.py --generated /tmp/pios_41_1_output --canonical docs/pios/41.1
"""

import sys
import argparse
from pathlib import Path
from typing import Any
import re


# ---------------------------------------------------------------------------
# Expected structural constants
# ---------------------------------------------------------------------------

DOMAIN_IDS  = [f"DOMAIN-{str(i).zfill(2)}" for i in range(1, 18)]
CAP_IDS     = [f"CAP-{str(i).zfill(2)}" for i in range(1, 43)]
COMP_IDS    = [f"COMP-{str(i).zfill(2)}" for i in range(1, 90)]
NODE_DOM    = [d.replace("DOMAIN-", "N-DOM-") for d in DOMAIN_IDS]
NODE_CAP    = [c.replace("CAP-", "N-CAP-") for c in CAP_IDS]
DIRECTIVE_IDS = [f"SFD-{str(i).zfill(2)}" for i in range(1, 11)]

ARTIFACT_IDS = {
    "semantic_domain_model.md":        "PIOS-41.1-OUTPUT-01",
    "capability_map.md":               "PIOS-41.1-OUTPUT-02",
    "semantic_traceability_map.md":    "PIOS-41.1-OUTPUT-03",
    "semantic_elevation_report.md":    "PIOS-41.1-OUTPUT-04",
    "pie_render_manifest.md":          "PIOS-41.1-OUTPUT-05",
    "semantic_feedback_directives.md": "PIOS-41.1-OUTPUT-06",
    "executive_readability_map.md":    "PIOS-41.1-OUTPUT-07",
}

CONTRACT_ID   = "PIOS-41.1-RUN01-CONTRACT-v1"
RUN_REFERENCE = "run_03_blueedge_derivation_validation"


# ---------------------------------------------------------------------------
# DiffReport
# ---------------------------------------------------------------------------

class DiffReport:
    def __init__(self, file_name: str):
        self.file_name = file_name
        self.diffs: list[str] = []
        self.matches: list[str] = []

    def add_diff(self, field: str, generated: Any, canonical: Any):
        self.diffs.append(
            f"  DIFF  [{field}]\n"
            f"        generated : {_trunc(generated)}\n"
            f"        canonical : {_trunc(canonical)}"
        )

    def add_match(self, field: str):
        self.matches.append(f"  MATCH [{field}]")

    def is_exact_match(self) -> bool:
        return len(self.diffs) == 0

    def summary(self) -> str:
        status = "EXACT_MATCH" if self.is_exact_match() else "DIFF"
        return (
            f"{'='*60}\n"
            f"File: {self.file_name}\n"
            f"Status: {status}\n"
            f"Matches: {len(self.matches)}  |  Diffs: {len(self.diffs)}\n"
        )

    def detail(self, show_matches: bool = False) -> str:
        lines = [self.summary()]
        if self.diffs:
            lines.append("--- DIFFERENCES ---")
            lines.extend(self.diffs)
        if show_matches and self.matches:
            lines.append("--- MATCHES ---")
            lines.extend(self.matches)
        return "\n".join(lines)


def _trunc(val: Any, max_len: int = 120) -> str:
    s = repr(val)
    return s if len(s) <= max_len else s[:max_len] + "..."


# ---------------------------------------------------------------------------
# Comparison helpers
# ---------------------------------------------------------------------------

def _token_present(text: str, token: str) -> bool:
    return token in text


def _compare_token(report: DiffReport, field: str, gen_text: str, can_text: str, token: str):
    g = _token_present(gen_text, token)
    c = _token_present(can_text, token)
    if g and c:
        report.add_match(f"token present: '{token}'")
    elif g and not c:
        report.add_diff(field, "PRESENT in generated", "MISSING in canonical")
    elif not g and c:
        report.add_diff(field, "MISSING in generated", "PRESENT in canonical")
    else:
        report.add_diff(field, "MISSING in both", "MISSING in both")


def _compare_id_list(report: DiffReport, gen_text: str, can_text: str, ids: list, label: str):
    for eid in ids:
        g = eid in gen_text
        c = eid in can_text
        if g and c:
            report.add_match(f"{label}: '{eid}'")
        elif g and not c:
            report.add_diff(f"{label}: '{eid}'", "PRESENT", "MISSING in canonical")
        elif not g and c:
            report.add_diff(f"{label}: '{eid}'", "MISSING in generated", "PRESENT")
        else:
            report.add_diff(f"{label}: '{eid}'", "MISSING in both", "MISSING in both")


# ---------------------------------------------------------------------------
# File comparators
# ---------------------------------------------------------------------------

def compare_semantic_domain_model(gen: str, can: str) -> DiffReport:
    report = DiffReport("semantic_domain_model.md")

    # artifact_id, contract, run_reference
    for token in [ARTIFACT_IDS["semantic_domain_model.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # All domain IDs
    _compare_id_list(report, gen, can, DOMAIN_IDS, "domain_id")

    # Key section headers
    for section in ["## Domain Construction Rules Applied", "WEAKLY GROUNDED"]:
        _compare_token(report, f"section: '{section}'", gen, can, section)

    # Grounding values
    for token in ["GROUNDED", "WEAKLY GROUNDED", "FUNCTIONAL", "INFRASTRUCTURE",
                  "OPERATIONAL", "CROSS-CUTTING", "INTEGRATION"]:
        _compare_token(report, f"domain_type/grounding: '{token}'", gen, can, token)

    return report


def compare_capability_map(gen: str, can: str) -> DiffReport:
    report = DiffReport("capability_map.md")

    for token in [ARTIFACT_IDS["capability_map.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # All capability IDs
    _compare_id_list(report, gen, can, CAP_IDS, "capability_id")

    # Key section headers
    for section in ["## Capability Construction Rules Applied", "parent_domain",
                    "CORE", "SUPPORTING", "ENABLING", "INFRASTRUCTURE"]:
        _compare_token(report, f"token: '{section}'", gen, can, section)

    # Weakly grounded caps
    for cap_id in ["CAP-04", "CAP-06", "CAP-28"]:
        _compare_token(report, f"weakly_grounded_cap: '{cap_id}'", gen, can, cap_id)

    return report


def compare_semantic_traceability_map(gen: str, can: str) -> DiffReport:
    report = DiffReport("semantic_traceability_map.md")

    for token in [ARTIFACT_IDS["semantic_traceability_map.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # All component IDs
    _compare_id_list(report, gen, can, COMP_IDS, "component_id")

    # Traceability basis values
    for token in ["DIRECT_EVIDENCE", "DERIVED", "INFERRED",
                  "assigned_capability", "assigned_domain"]:
        _compare_token(report, f"token: '{token}'", gen, can, token)

    return report


def compare_elevation_report(gen: str, can: str) -> DiffReport:
    report = DiffReport("semantic_elevation_report.md")

    for token in [ARTIFACT_IDS["semantic_elevation_report.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # Counts and ratios
    for token in ["89", "42", "17", "89:42", "89:17", "42:17",
                  "2.12:1", "5.24:1", "2.47:1",
                  "**VERIFIED**",
                  "4 components, 3 capabilities, 2 domains",
                  "SC-01", "OtaModule",
                  "## 1. Input Structural Counts",
                  "## 2. Output Semantic Counts",
                  "## 3. Elevation Ratios",
                  "## 4. Coherence Assessment per Domain",
                  "## 5. Weak Grounding Inventory",
                  "## 6. Abstraction Quality Assessment",
                  "## 7. Semantic Conflicts Detected",
                  "## 8. Elevation Integrity Verdict",
                  "PASS — 17/17 domains",
                  "PASS — 42/42 capabilities",
                  "PASS — 89/89 components"]:
        _compare_token(report, f"token: '{token}'", gen, can, token)

    # Domain IDs in coherence table
    for dom_id in DOMAIN_IDS:
        _compare_token(report, f"domain_coherence: '{dom_id}'", gen, can, dom_id)

    return report


def compare_pie_manifest(gen: str, can: str) -> DiffReport:
    report = DiffReport("pie_render_manifest.md")

    for token in [ARTIFACT_IDS["pie_render_manifest.md"], CONTRACT_ID, RUN_REFERENCE,
                  "PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01"]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # Node counts
    for token in ["DOMAIN Nodes (17 nodes)", "CAPABILITY Nodes (42 nodes)",
                  "COMPONENT Nodes (89 nodes)"]:
        _compare_token(report, f"node_section: '{token}'", gen, can, token)

    # Totals
    for token in ["**Total nodes** | **148**", "**Total links** | **48**",
                  "manifest_integrity: COMPLETE"]:
        _compare_token(report, f"total: '{token}'", gen, can, token)

    # All domain node IDs
    _compare_id_list(report, gen, can, NODE_DOM, "domain_node")

    # All capability node IDs
    _compare_id_list(report, gen, can, NODE_CAP, "cap_node")

    # Link IDs
    for link in ["L-DOM-01", "L-DOM-10", "L-DOM-20", "L-CAP-01", "L-CAP-28"]:
        _compare_token(report, f"link_id: '{link}'", gen, can, link)

    # Rendering rules
    for rr in ["RR-01", "RR-02", "RR-03", "RR-04", "RR-05", "RR-06", "RR-07"]:
        _compare_token(report, f"rendering_rule: '{rr}'", gen, can, rr)

    return report


def compare_feedback_directives(gen: str, can: str) -> DiffReport:
    report = DiffReport("semantic_feedback_directives.md")

    for token in [ARTIFACT_IDS["semantic_feedback_directives.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # All directive IDs
    _compare_id_list(report, gen, can, DIRECTIVE_IDS, "directive_id")

    # Directive types
    for token in ["WEAK_GROUNDING_ALERT", "AMBIGUITY", "GAP", "ENRICHMENT_REQUEST"]:
        _compare_token(report, f"directive_type: '{token}'", gen, can, token)

    # Summary markers
    for token in ["**Total directives: 10**", "## Directive Summary",
                  "HIGH priority: 3", "MEDIUM priority: 3", "LOW priority: 4",
                  "## Constraint"]:
        _compare_token(report, f"summary_token: '{token}'", gen, can, token)

    return report


def compare_executive_readability_map(gen: str, can: str) -> DiffReport:
    report = DiffReport("executive_readability_map.md")

    for token in [ARTIFACT_IDS["executive_readability_map.md"], CONTRACT_ID, RUN_REFERENCE]:
        _compare_token(report, f"metadata: '{token}'", gen, can, token)

    # Key structural sections
    for section in ["## What BlueEdge Is (Platform-Level)",
                    "## The 17 Domains in Plain Language",
                    "### 1. Edge Data Acquisition",
                    "### 17. Extended Operations and Driver Services",
                    "**[EXECUTIVE VIEW — DERIVED FROM STRUCTURAL EVIDENCE]**",
                    "89 confirmed or architecture-declared components"]:
        _compare_token(report, f"section: '{section}'", gen, can, section)

    # Domain names present
    for name in ["Edge Data Acquisition", "Fleet Core Operations",
                 "Event-Driven Architecture", "EV and Electrification",
                 "Operational Engineering"]:
        _compare_token(report, f"domain_name: '{name}'", gen, can, name)

    # Key tokens present in both generated and canonical capability summary sections
    for token in ["## The 42 Capabilities in Summary",
                  "## Evidence Confidence Note",
                  "84.3%", "9.0%", "6.7%",
                  "SVG OTA Agent", "Apache Kafka", "Apache Flink", "S3/MinIO Object Storage"]:
        _compare_token(report, f"token: '{token}'", gen, can, token)

    return report


# ---------------------------------------------------------------------------
# Comparator registry
# ---------------------------------------------------------------------------

COMPARATORS = {
    "semantic_domain_model.md":        compare_semantic_domain_model,
    "capability_map.md":               compare_capability_map,
    "semantic_traceability_map.md":    compare_semantic_traceability_map,
    "semantic_elevation_report.md":    compare_elevation_report,
    "pie_render_manifest.md":          compare_pie_manifest,
    "semantic_feedback_directives.md": compare_feedback_directives,
    "executive_readability_map.md":    compare_executive_readability_map,
}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Compare generated 41.1 artifacts against canonical docs/pios/41.1/."
    )
    parser.add_argument(
        "--generated",
        default="/tmp/pios_41_1_output",
        help="Directory of generated artifacts (default: /tmp/pios_41_1_output)",
    )
    parser.add_argument(
        "--canonical",
        default="docs/pios/41.1",
        help="Directory of canonical artifacts (default: docs/pios/41.1)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show MATCH lines as well as DIFF lines.",
    )
    args = parser.parse_args()

    gen_dir = Path(args.generated)
    can_dir = Path(args.canonical)

    if not gen_dir.exists():
        print(f"ERROR: Generated directory not found: {gen_dir}")
        print("       Run build_semantic_layer.py first.")
        sys.exit(1)
    if not can_dir.exists():
        print(f"ERROR: Canonical directory not found: {can_dir}")
        sys.exit(1)

    print(f"Parity check")
    print(f"  Generated : {gen_dir}")
    print(f"  Canonical : {can_dir}")
    print()

    all_exact = True
    reports: list[DiffReport] = []

    for filename, comparator in COMPARATORS.items():
        gen_path = gen_dir / filename
        can_path = can_dir / filename

        if not gen_path.exists():
            print(f"MISSING generated: {gen_path}")
            all_exact = False
            continue
        if not can_path.exists():
            print(f"MISSING canonical: {can_path}")
            all_exact = False
            continue

        gen_text = gen_path.read_text(encoding="utf-8")
        can_text = can_path.read_text(encoding="utf-8")

        r = comparator(gen_text, can_text)
        reports.append(r)

    for r in reports:
        print(r.detail(show_matches=args.verbose))
        if not r.is_exact_match():
            all_exact = False

    print("=" * 60)
    if all_exact:
        print("PARITY CHECK RESULT: EXACT_MATCH")
        print("Generated artifacts are structurally equivalent to canonical.")
        print("Safe to promote to docs/pios/41.1/ if desired.")
        sys.exit(0)
    else:
        total_diffs = sum(len(r.diffs) for r in reports)
        print("PARITY CHECK RESULT: DIFF")
        print(f"{total_diffs} field-level difference(s) detected.")
        print("Review diffs before any canonical promotion.")
        sys.exit(1)


if __name__ == "__main__":
    main()
