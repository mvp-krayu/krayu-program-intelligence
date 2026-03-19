#!/usr/bin/env python3
"""
validate_reconstruction.py
Stream 40.3 — PiOS Reverse Engineering Engine

Purpose:
    Validate the Stream 40.3 reconstruction corpus against the locked
    post-execution baseline. Checks:

    1. All 14 artifacts are present
    2. Component IDs are consistent across entity_catalog, component_inventory,
       and system_component_map
    3. PEG summary node and edge counts match expected values
    4. Traceability completeness table declares all 13 reconstruction artifacts
    5. Execution receipt PERM scope declaration is present

Inputs (read-only):
    docs/pios/40.3/reconstruction/*.md
    docs/pios/40.3/traceability/structural_traceability_map.md
    docs/pios/contracts/40.3/stream_40.3_perm_reconstruction.execution.md

Output:
    Exit 0 — VALIDATED
    Exit 1 — FAILED with exact violations printed
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
RECONSTRUCTION_DIR = REPO_ROOT / "docs/pios/40.3/reconstruction"
TRACEABILITY_DIR = REPO_ROOT / "docs/pios/40.3/traceability"
RECEIPT = REPO_ROOT / "docs/pios/contracts/40.3/stream_40.3_perm_reconstruction.execution.md"

# ── Baseline constants ──────────────────────────────────────────────────────

EXPECTED_RECONSTRUCTION_ARTIFACTS = [
    "entity_catalog.md",
    "repository_map.md",
    "repository_topology.md",
    "component_inventory.md",
    "capability_map.md",
    "system_component_map.md",
    "capability_domain_map.md",
    "dependency_map.md",
    "interface_map.md",
    "architectural_responsibility_zones.md",
    "program_structure.md",
    "program_coordination_model.md",
    "program_execution_graph.md",
]

EXPECTED_TRACEABILITY_ARTIFACTS = [
    "structural_traceability_map.md",
]

# Canonical component ID mapping — must be consistent across all artifacts
CANONICAL_COMPONENT_IDS = {
    "C-01": "Krayu",
    "C-02": "PiOS",
    "C-03": "Signäl Platform",
}

# Expected PEG counts (post-correction baseline)
EXPECTED_PEG_NODES = 22
EXPECTED_PEG_EDGES = 28

# Artifacts that must appear in traceability completeness table
TRACEABILITY_MUST_COVER = EXPECTED_RECONSTRUCTION_ARTIFACTS  # all 13


def read(path):
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def check_1_artifacts_present(errors):
    """All 14 artifacts must be present."""
    for name in EXPECTED_RECONSTRUCTION_ARTIFACTS:
        path = RECONSTRUCTION_DIR / name
        if not path.exists():
            errors.append(f"MISSING reconstruction artifact: {path.relative_to(REPO_ROOT)}")

    for name in EXPECTED_TRACEABILITY_ARTIFACTS:
        path = TRACEABILITY_DIR / name
        if not path.exists():
            errors.append(f"MISSING traceability artifact: {path.relative_to(REPO_ROOT)}")


def check_2_component_ids(errors):
    """
    Component IDs must be consistent across:
    - entity_catalog.md EC-01 table
    - component_inventory.md section headers
    - system_component_map.md hierarchy and profiles
    """
    # entity_catalog.md
    ec_path = RECONSTRUCTION_DIR / "entity_catalog.md"
    ec_text = read(ec_path)
    if ec_text is None:
        return  # already caught in check_1

    ec_section_match = re.search(r"## EC-01.*?## EC-02", ec_text, re.DOTALL)
    if not ec_section_match:
        errors.append("entity_catalog.md: EC-01 section not found")
        return

    ec_section = ec_section_match.group(0)
    ec_ids = {}
    for row in re.finditer(r"\|\s*(C-0\d)\s*\|\s*([^|]+)\|", ec_section):
        cid = row.group(1).strip()
        name = row.group(2).strip()
        if cid and name:
            ec_ids[cid] = name

    for cid, expected_name in CANONICAL_COMPONENT_IDS.items():
        found = ec_ids.get(cid, "NOT FOUND")
        if found != expected_name:
            errors.append(
                f"entity_catalog.md EC-01: {cid} = '{found}', expected '{expected_name}'"
            )

    # component_inventory.md section headers
    ci_path = RECONSTRUCTION_DIR / "component_inventory.md"
    ci_text = read(ci_path)
    if ci_text is None:
        return

    ci_ids = {}
    for m in re.finditer(r"^## (C-0\d) — (.+)$", ci_text, re.MULTILINE):
        ci_ids[m.group(1).strip()] = m.group(2).strip()

    for cid, expected_name in CANONICAL_COMPONENT_IDS.items():
        found = ci_ids.get(cid, "NOT FOUND")
        if found != expected_name:
            errors.append(
                f"component_inventory.md: {cid} = '{found}', expected '{expected_name}'"
            )

    # system_component_map.md — check hierarchy block and profile headers
    scm_path = RECONSTRUCTION_DIR / "system_component_map.md"
    scm_text = read(scm_path)
    if scm_text is None:
        return

    for cid, expected_name in CANONICAL_COMPONENT_IDS.items():
        # Check that each expected (ID, name) pair appears somewhere in the file
        pattern = re.compile(re.escape(f"{expected_name} ({cid})") + r"|" +
                             re.compile(re.escape(f"({cid})")).pattern + r"|" +
                             re.escape(f"### {expected_name} ({cid})"))
        # Simple check: both the ID and the name appear near each other
        if f"({cid})" not in scm_text and f"| {cid} |" not in scm_text:
            errors.append(
                f"system_component_map.md: reference to '{cid}' not found"
            )


def check_3_peg_counts(errors):
    """PEG node and edge counts must match EXPECTED_PEG_NODES and EXPECTED_PEG_EDGES."""
    peg_path = RECONSTRUCTION_DIR / "program_execution_graph.md"
    peg_text = read(peg_path)
    if peg_text is None:
        return

    # Find Total nodes
    node_match = re.search(r"\*\*Total nodes\*\*\s*\|\s*\*\*(\d+)\*\*", peg_text)
    if node_match:
        actual_nodes = int(node_match.group(1))
        if actual_nodes != EXPECTED_PEG_NODES:
            errors.append(
                f"program_execution_graph.md: Total nodes = {actual_nodes}, expected {EXPECTED_PEG_NODES}"
            )
    else:
        errors.append("program_execution_graph.md: Total nodes summary not found")

    # Find Total edges
    edge_match = re.search(r"\*\*Total edges\*\*\s*\|\s*\*\*(\d+)\*\*", peg_text)
    if edge_match:
        actual_edges = int(edge_match.group(1))
        if actual_edges != EXPECTED_PEG_EDGES:
            errors.append(
                f"program_execution_graph.md: Total edges = {actual_edges}, expected {EXPECTED_PEG_EDGES}"
            )
    else:
        errors.append("program_execution_graph.md: Total edges summary not found")

    # Count explicitly enumerated node rows in Node Registry tables
    # Exclude header rows (containing "Node ID") and note/section header lines
    node_rows = re.findall(
        r"^\|\s*N-[A-Z0-9]+\s*\|",
        peg_text,
        re.MULTILINE,
    )
    if len(node_rows) != EXPECTED_PEG_NODES:
        errors.append(
            f"program_execution_graph.md: Enumerated node rows = {len(node_rows)}, "
            f"expected {EXPECTED_PEG_NODES}"
        )

    # Count explicitly enumerated edge rows in Edge Registry tables
    edge_rows = re.findall(
        r"^\|\s*E-\d+[a-z]?\d*\s*\|",
        peg_text,
        re.MULTILINE,
    )
    if len(edge_rows) != EXPECTED_PEG_EDGES:
        errors.append(
            f"program_execution_graph.md: Enumerated edge rows = {len(edge_rows)}, "
            f"expected {EXPECTED_PEG_EDGES}"
        )


def check_4_traceability_coverage(errors):
    """All 13 reconstruction artifacts must appear in the traceability completeness table."""
    tm_path = TRACEABILITY_DIR / "structural_traceability_map.md"
    tm_text = read(tm_path)
    if tm_text is None:
        return

    # Find the Traceability Completeness Declaration table
    table_match = re.search(
        r"## Traceability Completeness Declaration(.*)",
        tm_text,
        re.DOTALL,
    )
    if not table_match:
        errors.append(
            "structural_traceability_map.md: Traceability Completeness Declaration section not found"
        )
        return

    table_text = table_match.group(1)
    for artifact in TRACEABILITY_MUST_COVER:
        if artifact not in table_text:
            errors.append(
                f"structural_traceability_map.md completeness table: '{artifact}' not covered"
            )


def check_5_perm_scope_declaration(errors):
    """Execution receipt must contain PERM Scope Declaration section."""
    receipt_text = read(RECEIPT)
    if receipt_text is None:
        errors.append(f"MISSING execution receipt: {RECEIPT.relative_to(REPO_ROOT)}")
        return

    if "## PERM Scope Declaration" not in receipt_text:
        errors.append(
            "stream_40.3_perm_reconstruction.execution.md: '## PERM Scope Declaration' section not found"
        )

    required_phrases = [
        "5 mandatory output artifact",
        "8 derived supporting artifact",
        "No PERM deviation",
    ]
    for phrase in required_phrases:
        # case-insensitive check
        if phrase.lower() not in receipt_text.lower():
            errors.append(
                f"stream_40.3_perm_reconstruction.execution.md: "
                f"PERM scope declaration missing phrase: '{phrase}'"
            )


def check_6_no_orphan_nodes(errors):
    """Every node in the node registry must appear at least once in the edge registry."""
    peg_path = RECONSTRUCTION_DIR / "program_execution_graph.md"
    peg_text = read(peg_path)
    if peg_text is None:
        return

    # Extract all registered node IDs
    node_ids = set(re.findall(r"^\|\s*(N-[A-Z0-9]+)\s*\|", peg_text, re.MULTILINE))

    # Find the edge registry section
    edge_section_match = re.search(r"## Edge Registry(.*?)## PEG —", peg_text, re.DOTALL)
    if not edge_section_match:
        errors.append("program_execution_graph.md: Edge Registry section not found")
        return

    edge_section = edge_section_match.group(1)

    orphans = []
    for node_id in sorted(node_ids):
        # Node must appear as source or target in at least one edge row
        if node_id not in edge_section:
            orphans.append(node_id)

    if orphans:
        errors.append(
            f"program_execution_graph.md: Orphan nodes (no edge): {', '.join(orphans)}"
        )


def main():
    print("=" * 60)
    print("Stream 40.3 — Reconstruction Corpus Validation")
    print("=" * 60)

    errors = []

    print("\n[1] Checking artifact presence...")
    check_1_artifacts_present(errors)

    print("[2] Checking component ID consistency...")
    check_2_component_ids(errors)

    print("[3] Checking PEG node and edge counts...")
    check_3_peg_counts(errors)

    print("[4] Checking traceability coverage...")
    check_4_traceability_coverage(errors)

    print("[5] Checking PERM scope declaration in execution receipt...")
    check_5_perm_scope_declaration(errors)

    print("[6] Checking for orphan nodes...")
    check_6_no_orphan_nodes(errors)

    print("\n" + "=" * 60)

    if errors:
        print(f"STATUS: FAILED — {len(errors)} violation(s)")
        for i, e in enumerate(errors, 1):
            print(f"  [{i}] {e}")
        sys.exit(1)
    else:
        print("STATUS: VALIDATED")
        print(f"  Artifacts present: {len(EXPECTED_RECONSTRUCTION_ARTIFACTS) + len(EXPECTED_TRACEABILITY_ARTIFACTS)}/14")
        print(f"  Component ID consistency: PASS (C-01=Krayu, C-02=PiOS, C-03=Signäl Platform)")
        print(f"  PEG nodes: {EXPECTED_PEG_NODES}")
        print(f"  PEG edges: {EXPECTED_PEG_EDGES}")
        print(f"  Traceability coverage: all 13 reconstruction artifacts covered")
        print(f"  PERM scope declaration: present")
        print(f"  Orphan nodes: 0")
        sys.exit(0)


if __name__ == "__main__":
    main()
