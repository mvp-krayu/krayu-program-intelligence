#!/usr/bin/env python3
"""
extract_perm_entities.py
Stream 40.3 — PiOS Reverse Engineering Engine

Purpose:
    Read the 40.2 normalized_evidence_map.md and extract the entity classes
    that PERM operates on. Produces a structured summary of what the reconstruction
    corpus should contain, serving as a deterministic record of the extraction logic.

Input:
    docs/pios/40.2/normalized_evidence_map.md

Output:
    Printed extraction summary. No files are written.
    This script documents and validates the input entity set — it does not
    regenerate the reconstruction artifacts (which require PERM judgment).

Gap declaration:
    Full regeneration of reconstruction prose artifacts (entity_catalog.md,
    capability_map.md, etc.) requires PERM-governed judgment applied to the
    extracted entities. This script replicates the deterministic extraction step
    only. The content generation step is not fully script-replicable — a PERM
    execution instance (human or agent) is required.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
EVIDENCE_MAP = REPO_ROOT / "docs/pios/40.2/normalized_evidence_map.md"

# Expected entity counts from INT-03 / 40.3 corpus
EXPECTED = {
    "components": 3,
    "modules": 10,
    "discipline_streams": 14,
    "ckr_constructs": 34,
    "configurations": 3,
    "scripts": 1,
    "architectural_layers": 3,
    "governance_constructs": 9,
    "case_studies": 1,
    "research_artifacts": 1,
}

EXPECTED_TOTAL = sum(EXPECTED.values())  # 79


def load_evidence_map():
    if not EVIDENCE_MAP.exists():
        print(f"ERROR: evidence map not found at {EVIDENCE_MAP}")
        sys.exit(1)
    return EVIDENCE_MAP.read_text(encoding="utf-8")


def extract_components(text):
    """Extract component names from §1 of normalized_evidence_map.md."""
    components = []
    pattern = re.compile(r"^\*\*Name:\*\*\s+(.+)$", re.MULTILINE)
    # §1 covers lines up to ## 2.
    section = text.split("## 2. Modules")[0]
    for m in pattern.finditer(section):
        components.append(m.group(1).strip())
    return components


def extract_modules(text):
    """Extract module names from §2 (40.0 through 40.9)."""
    modules = []
    pattern = re.compile(r"^\*\*Name:\*\*\s+(Stream 40\.\d[^ \n]*[^\n]*)$", re.MULTILINE)
    section_match = re.search(r"## 2\. Modules(.*?)## 3\.", text, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        for m in pattern.finditer(section):
            modules.append(m.group(1).strip())
    return modules


def extract_ckr_constructs(text):
    """Extract CKR ID/Name pairs from §3."""
    constructs = []
    section_match = re.search(r"## 3\. Analytical Constructs(.*?)## 4\.", text, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        pattern = re.compile(r"\|\s*(CKR-\d+)\s*\|\s*([^|]+)\|", re.MULTILINE)
        for m in pattern.finditer(section):
            ckr_id = m.group(1).strip()
            name = m.group(2).strip()
            if ckr_id and name and name != "Name":
                constructs.append((ckr_id, name))
    return constructs


def extract_configurations(text):
    """Extract configuration entries from §4."""
    configs = []
    section_match = re.search(r"## 4\. Configurations(.*?)## 5\.", text, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        pattern = re.compile(r"^\*\*Name:\*\*\s+(.+)$", re.MULTILINE)
        for m in pattern.finditer(section):
            configs.append(m.group(1).strip())
    return configs


def extract_architectural_layers(text):
    """Extract three-layer model entries from §7."""
    layers = []
    section_match = re.search(r"## 7\. Architectural Layers(.*?)## 8\.", text, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        pattern = re.compile(r"\|\s*Layer \d\s*\|\s*([^|]+)\|", re.MULTILINE)
        for m in pattern.finditer(section):
            name = m.group(1).strip()
            if name and name != "Name":
                layers.append(name)
    return layers


def main():
    print("=" * 60)
    print("Stream 40.3 — PERM Entity Extraction")
    print(f"Input: {EVIDENCE_MAP.relative_to(REPO_ROOT)}")
    print("=" * 60)

    text = load_evidence_map()
    errors = []

    # Components
    components = extract_components(text)
    status = "OK" if len(components) == EXPECTED["components"] else "MISMATCH"
    if status == "MISMATCH":
        errors.append(f"components: expected {EXPECTED['components']}, found {len(components)}")
    print(f"\n[{status}] Components ({len(components)}/{EXPECTED['components']}):")
    for c in components:
        print(f"       {c}")

    # Modules
    modules = extract_modules(text)
    status = "OK" if len(modules) == EXPECTED["modules"] else "MISMATCH"
    if status == "MISMATCH":
        errors.append(f"modules: expected {EXPECTED['modules']}, found {len(modules)}")
    print(f"\n[{status}] Modules ({len(modules)}/{EXPECTED['modules']}):")
    for m in modules:
        print(f"       {m}")

    # CKR constructs
    ckr = extract_ckr_constructs(text)
    status = "OK" if len(ckr) == EXPECTED["ckr_constructs"] else "MISMATCH"
    if status == "MISMATCH":
        errors.append(f"CKR constructs: expected {EXPECTED['ckr_constructs']}, found {len(ckr)}")
    print(f"\n[{status}] CKR Constructs ({len(ckr)}/{EXPECTED['ckr_constructs']}):")
    for ckr_id, name in ckr:
        print(f"       {ckr_id}: {name}")

    # Configurations
    configs = extract_configurations(text)
    status = "OK" if len(configs) == EXPECTED["configurations"] else "MISMATCH"
    if status == "MISMATCH":
        errors.append(f"configurations: expected {EXPECTED['configurations']}, found {len(configs)}")
    print(f"\n[{status}] Configurations ({len(configs)}/{EXPECTED['configurations']}):")
    for c in configs:
        print(f"       {c}")

    # Architectural layers
    layers = extract_architectural_layers(text)
    status = "OK" if len(layers) == EXPECTED["architectural_layers"] else "MISMATCH"
    if status == "MISMATCH":
        errors.append(f"architectural layers: expected {EXPECTED['architectural_layers']}, found {len(layers)}")
    print(f"\n[{status}] Architectural Layers ({len(layers)}/{EXPECTED['architectural_layers']}):")
    for l in layers:
        print(f"       {l}")

    # Summary
    print("\n" + "=" * 60)
    print("EXTRACTION SUMMARY")
    print("=" * 60)
    total_extracted = len(components) + len(modules) + len(ckr) + len(configs) + len(layers)
    print(f"Extracted entity count (scriptable classes): {total_extracted}")
    print(f"Note: discipline_streams (14), scripts (1), governance_constructs (9),")
    print(f"      case_studies (1), research_artifacts (1) require manual enumeration")
    print(f"      from §2.11, §6, §9, §10, §11 — not extracted by this script.")
    print(f"Full entity_catalog.md total: {EXPECTED_TOTAL}")

    if errors:
        print(f"\nSTATUS: EXTRACTION MISMATCH")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print(f"\nSTATUS: EXTRACTION COMPLETE — all scriptable classes match expected counts")

    print("\nGAP DECLARATION:")
    print("  Regeneration of reconstruction prose artifacts requires a PERM")
    print("  execution instance. This script validates input entity extraction only.")


if __name__ == "__main__":
    main()
