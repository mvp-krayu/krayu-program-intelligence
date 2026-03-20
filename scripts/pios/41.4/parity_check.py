#!/usr/bin/env python3
"""
parity_check.py
PIOS-41.4-RUN01-ADDENDUM-SCRIPT-RECOVERY-v1

Compares generated 41.4 artifacts against canonical docs/pios/41.4/ artifacts.

Checks:
  - signal_registry.json: field-level comparison (signal count, IDs, titles,
    domain/capability/component mappings, confidence values)
  - evidence_mapping_index.json: evidence chain and semantic anchor comparison
  - executive_signal_report.md: structural section presence and signal count

Reports EXACT_MATCH or DIFF with field-level detail.

Usage:
  python3 parity_check.py                                   # compares /tmp/pios_41.4_output vs docs/pios/41.4/
  python3 parity_check.py --generated /tmp/pios_41.4_output
  python3 parity_check.py --generated /tmp/pios_41.4_output --canonical docs/pios/41.4
"""

import json
import sys
import argparse
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Diff utilities
# ---------------------------------------------------------------------------

class DiffReport:
    def __init__(self, file_name: str):
        self.file_name = file_name
        self.diffs: list[str] = []
        self.matches: list[str] = []

    def add_diff(self, field: str, generated: Any, canonical: Any):
        self.diffs.append(
            f"  DIFF  [{field}]\n"
            f"        generated : {_truncate(generated)}\n"
            f"        canonical : {_truncate(canonical)}"
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


def _truncate(val: Any, max_len: int = 120) -> str:
    s = repr(val)
    return s if len(s) <= max_len else s[:max_len] + "..."


# ---------------------------------------------------------------------------
# Signal registry comparison
# ---------------------------------------------------------------------------

SIGNAL_FIELDS_TO_CHECK = [
    "signal_id",
    "title",
    "domain_id",
    "domain_name",
    "capability_id",
    "capability_name",
    "component_ids",
    "component_names",
    "source_refs",
    "evidence_confidence",
    "business_impact",
    "risk",
]


def compare_signal_registries(generated: dict, canonical: dict) -> DiffReport:
    report = DiffReport("signal_registry.json")

    # Top-level metadata
    for field in ["registry_id", "contract_id", "run_reference", "generated_date", "total_signals"]:
        g_val = generated.get(field)
        c_val = canonical.get(field)
        if g_val == c_val:
            report.add_match(field)
        else:
            report.add_diff(field, g_val, c_val)

    # Build lookup maps keyed by signal_id
    gen_sigs = {s["signal_id"]: s for s in generated.get("signals", [])}
    can_sigs = {s["signal_id"]: s for s in canonical.get("signals", [])}

    all_ids = sorted(set(gen_sigs) | set(can_sigs))

    for sig_id in all_ids:
        if sig_id not in gen_sigs:
            report.add_diff(f"{sig_id} (presence)", "MISSING in generated", "PRESENT in canonical")
            continue
        if sig_id not in can_sigs:
            report.add_diff(f"{sig_id} (presence)", "PRESENT in generated", "MISSING in canonical")
            continue

        g = gen_sigs[sig_id]
        c = can_sigs[sig_id]

        for field in SIGNAL_FIELDS_TO_CHECK:
            g_val = g.get(field)
            c_val = c.get(field)
            # Normalise lists to sorted for comparison
            if isinstance(g_val, list):
                g_val = sorted(g_val)
            if isinstance(c_val, list):
                c_val = sorted(c_val)
            if g_val == c_val:
                report.add_match(f"{sig_id}.{field}")
            else:
                report.add_diff(f"{sig_id}.{field}", g_val, c_val)

    return report


# ---------------------------------------------------------------------------
# Evidence mapping index comparison
# ---------------------------------------------------------------------------

def compare_evidence_indices(generated: dict, canonical: dict) -> DiffReport:
    report = DiffReport("evidence_mapping_index.json")

    for field in ["mapping_id", "contract_id", "run_reference", "generated_date"]:
        g_val = generated.get(field)
        c_val = canonical.get(field)
        if g_val == c_val:
            report.add_match(field)
        else:
            report.add_diff(field, g_val, c_val)

    gen_sigs = {s["signal_id"]: s for s in generated.get("signals", [])}
    can_sigs = {s["signal_id"]: s for s in canonical.get("signals", [])}
    all_ids = sorted(set(gen_sigs) | set(can_sigs))

    for sig_id in all_ids:
        if sig_id not in gen_sigs:
            report.add_diff(f"{sig_id} (presence)", "MISSING", "PRESENT")
            continue
        if sig_id not in can_sigs:
            report.add_diff(f"{sig_id} (presence)", "PRESENT", "MISSING")
            continue

        g = gen_sigs[sig_id]
        c = can_sigs[sig_id]

        for field in ["source_layer", "source_file", "source_object_id",
                      "blocking_point", "temporal_reference", "evidence_chain"]:
            g_val = g.get(field)
            c_val = c.get(field)
            if g_val == c_val:
                report.add_match(f"{sig_id}.{field}")
            else:
                report.add_diff(f"{sig_id}.{field}", g_val, c_val)

        # Semantic anchor
        g_anchor = g.get("semantic_anchor", {})
        c_anchor = c.get("semantic_anchor", {})
        for af in ["domain_id", "domain_name", "capability_id", "capability_name"]:
            gv = g_anchor.get(af)
            cv = c_anchor.get(af)
            if gv == cv:
                report.add_match(f"{sig_id}.semantic_anchor.{af}")
            else:
                report.add_diff(f"{sig_id}.semantic_anchor.{af}", gv, cv)

        g_cids = sorted(g_anchor.get("component_ids", []))
        c_cids = sorted(c_anchor.get("component_ids", []))
        if g_cids == c_cids:
            report.add_match(f"{sig_id}.semantic_anchor.component_ids")
        else:
            report.add_diff(f"{sig_id}.semantic_anchor.component_ids", g_cids, c_cids)

    return report


# ---------------------------------------------------------------------------
# Executive report structural comparison
# ---------------------------------------------------------------------------

def compare_executive_reports(generated_text: str, canonical_text: str) -> DiffReport:
    report = DiffReport("executive_signal_report.md")

    EXPECTED_SECTIONS = [
        "# Program Intelligence — Executive Signal Report",
        "## Overview",
        "## Signal 01",
        "## Signal 02",
        "## Signal 03",
        "## Signal 04",
        "## Signal 05",
        "## Selection Rationale",
        "## Signal Coverage Map",
    ]

    EXPECTED_MARKERS = [
        "**Statement**",
        "**Why it matters**",
        "**Risk**",
        "**Evidence**",
        "**Semantic Mapping**",
        "**Evidence Confidence:**",
        "**Confidence Rationale:**",
    ]

    SIGNAL_METADATA = [
        ("SIG-001", "DOMAIN-01", "CAP-02", "STRONG"),
        ("SIG-002", "DOMAIN-10", "CAP-27", "STRONG"),
        ("SIG-003", "DOMAIN-11", "CAP-30", "MODERATE"),
        ("SIG-004", "DOMAIN-10", "CAP-29", "MODERATE"),
        ("SIG-005", "DOMAIN-16", "CAP-40", "WEAK"),
    ]

    # Section presence
    for section in EXPECTED_SECTIONS:
        g_has = section in generated_text
        c_has = section in canonical_text
        if g_has and c_has:
            report.add_match(f"section: '{section}'")
        elif g_has and not c_has:
            report.add_diff(f"section: '{section}'", "PRESENT", "MISSING in canonical")
        elif not g_has and c_has:
            report.add_diff(f"section: '{section}'", "MISSING in generated", "PRESENT")
        else:
            report.add_diff(f"section: '{section}'", "MISSING", "MISSING (both)")

    # Marker presence (check in generated only — structural template check)
    for marker in EXPECTED_MARKERS:
        g_count = generated_text.count(marker)
        c_count = canonical_text.count(marker)
        if g_count == c_count:
            report.add_match(f"marker count: '{marker}' ({g_count}x)")
        else:
            report.add_diff(f"marker count: '{marker}'", f"{g_count}x", f"{c_count}x")

    # Signal metadata presence
    for sig_id, domain, cap, conf in SIGNAL_METADATA:
        for token in [sig_id, domain, cap, conf]:
            g_has = token in generated_text
            c_has = token in canonical_text
            if g_has and c_has:
                report.add_match(f"token in report: '{token}'")
            elif g_has and not c_has:
                report.add_diff(f"token: '{token}'", "PRESENT", "MISSING in canonical")
            elif not g_has and c_has:
                report.add_diff(f"token: '{token}'", "MISSING in generated", "PRESENT")

    return report


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Compare generated 41.4 artifacts against canonical docs/pios/41.4/."
    )
    parser.add_argument(
        "--generated",
        default="/tmp/pios_41.4_output",
        help="Directory of generated artifacts (default: /tmp/pios_41.4_output)",
    )
    parser.add_argument(
        "--canonical",
        default="docs/pios/41.4",
        help="Directory of canonical artifacts (default: docs/pios/41.4)",
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
        print("       Run build_signals.py first.")
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

    # --- signal_registry.json ---
    gen_reg_path = gen_dir / "signal_registry.json"
    can_reg_path = can_dir / "signal_registry.json"
    if gen_reg_path.exists() and can_reg_path.exists():
        gen_reg = json.loads(gen_reg_path.read_text())
        can_reg = json.loads(can_reg_path.read_text())
        r = compare_signal_registries(gen_reg, can_reg)
        reports.append(r)
    else:
        missing = []
        if not gen_reg_path.exists():
            missing.append(f"MISSING generated: {gen_reg_path}")
        if not can_reg_path.exists():
            missing.append(f"MISSING canonical: {can_reg_path}")
        print("\n".join(missing))
        all_exact = False

    # --- evidence_mapping_index.json ---
    gen_idx_path = gen_dir / "evidence_mapping_index.json"
    can_idx_path = can_dir / "evidence_mapping_index.json"
    if gen_idx_path.exists() and can_idx_path.exists():
        gen_idx = json.loads(gen_idx_path.read_text())
        can_idx = json.loads(can_idx_path.read_text())
        r = compare_evidence_indices(gen_idx, can_idx)
        reports.append(r)
    else:
        missing = []
        if not gen_idx_path.exists():
            missing.append(f"MISSING generated: {gen_idx_path}")
        if not can_idx_path.exists():
            missing.append(f"MISSING canonical: {can_idx_path}")
        print("\n".join(missing))
        all_exact = False

    # --- executive_signal_report.md ---
    gen_rpt_path = gen_dir / "executive_signal_report.md"
    can_rpt_path = can_dir / "executive_signal_report.md"
    if gen_rpt_path.exists() and can_rpt_path.exists():
        gen_text = gen_rpt_path.read_text()
        can_text = can_rpt_path.read_text()
        r = compare_executive_reports(gen_text, can_text)
        reports.append(r)
    else:
        missing = []
        if not gen_rpt_path.exists():
            missing.append(f"MISSING generated: {gen_rpt_path}")
        if not can_rpt_path.exists():
            missing.append(f"MISSING canonical: {can_rpt_path}")
        print("\n".join(missing))
        all_exact = False

    # Print results
    for r in reports:
        print(r.detail(show_matches=args.verbose))
        if not r.is_exact_match():
            all_exact = False

    print("=" * 60)
    if all_exact:
        print("PARITY CHECK RESULT: EXACT_MATCH")
        print("Generated artifacts are structurally equivalent to canonical.")
        print("Safe to promote to docs/pios/41.4/ if desired.")
        sys.exit(0)
    else:
        total_diffs = sum(len(r.diffs) for r in reports)
        print("PARITY CHECK RESULT: DIFF")
        print(f"{total_diffs} field-level difference(s) detected.")
        print("Review diffs before any canonical promotion.")
        sys.exit(1)


if __name__ == "__main__":
    main()
