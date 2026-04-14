#!/usr/bin/env python3
"""
emit_canonical_topology.py
STREAM: PSEE.FRESH.S2.S3.EMISSION.01

Freshly emit canonical_topology.json by loading embedded structured data
from scripts/pios/41.1/build_semantic_layer.py.

Source of truth: DOMAINS, CAPABILITIES, COMPONENTS dicts embedded in
build_semantic_layer.py (PIOS-41.1-RUN01-CONTRACT-v1).

Authority: SA-1 (build_semantic_layer.py is primary source),
           SA-3 (emit exactly as encoded),
           SA-4 (absent fields as null/[]).

Usage:
    emit_canonical_topology.py --output-path <file> --run-id <run_id>

Exit codes:
    0 = EMISSION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import hashlib
import importlib.util
import json
import os
import sys
from datetime import date

STREAM = "PSEE.FRESH.S2.S3.EMISSION.01"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SOURCE_SCRIPT = os.path.join(REPO_ROOT, "scripts", "pios", "41.1", "build_semantic_layer.py")


def fail(stage, reason):
    print(f"\nFAIL-CLOSED [{stage}]", file=sys.stderr)
    print(f"  reason: {reason}", file=sys.stderr)
    sys.exit(1)


def load_source_module():
    """Load build_semantic_layer.py as a module to access embedded data."""
    if not os.path.isfile(SOURCE_SCRIPT):
        fail("SOURCE_LOAD", f"source script not found: {SOURCE_SCRIPT}")
    spec = importlib.util.spec_from_file_location("build_semantic_layer", SOURCE_SCRIPT)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def build_topology(mod, run_id):
    """Derive canonical topology JSON from the loaded module's embedded data."""
    DOMAINS      = mod.DOMAINS
    CAPABILITIES = mod.CAPABILITIES
    COMPONENTS   = mod.COMPONENTS

    # Validate expected counts (parity guard)
    if len(DOMAINS) != 17:
        fail("PARITY", f"expected 17 domains, found {len(DOMAINS)}")
    if len(CAPABILITIES) != 42:
        fail("PARITY", f"expected 42 capabilities, found {len(CAPABILITIES)}")
    if len(COMPONENTS) != 89:
        fail("PARITY", f"expected 89 components, found {len(COMPONENTS)}")

    cap_by_id  = {c["id"]: c for c in CAPABILITIES}
    cap_to_dom = {c["id"]: c["domain"] for c in CAPABILITIES}

    # ── DOMAIN SECTION ────────────────────────────────────────────────────────
    dom_to_caps:   dict = {d["id"]: [] for d in DOMAINS}
    dom_to_comps:  dict = {d["id"]: [] for d in DOMAINS}
    for cap in CAPABILITIES:
        dom_to_caps[cap["domain"]].append(cap["id"])
    for comp in COMPONENTS:
        dom_id = cap_to_dom[comp["cap"]]
        dom_to_comps[dom_id].append(comp["id"])

    domains_out = []
    for d in DOMAINS:
        domains_out.append({
            "domain_id":    d["id"],
            "domain_name":  d["name"],
            "domain_type":  d["type"],
            "capability_ids":  dom_to_caps[d["id"]],
            "component_ids":   dom_to_comps[d["id"]],
            "grounding":    d["grounding"],
            "confidence":   None,   # SA-4: absent from source
            "cross_domain": False,
            "evidence_refs": [],
        })

    # ── CAPABILITY SECTION ────────────────────────────────────────────────────
    cap_to_comps: dict = {c["id"]: [] for c in CAPABILITIES}
    for comp in COMPONENTS:
        cap_to_comps[comp["cap"]].append(comp["id"])

    capabilities_out = []
    for c in CAPABILITIES:
        capabilities_out.append({
            "capability_id":   c["id"],
            "capability_name": c["name"],
            "domain_id":       c["domain"],
            "capability_type": c["type"],
            "weakly_grounded": c["weak"],
            "component_ids":   cap_to_comps[c["id"]],
            "confidence":      None,    # SA-4
            "source_ref":      None,    # SA-4
        })

    # ── COMPONENT SECTION ─────────────────────────────────────────────────────
    components_out = []
    for comp in COMPONENTS:
        c_obj = {
            "component_id":   comp["id"],
            "component_name": comp["name"],
            "capability_id":  comp["cap"],
            "domain_id":      cap_to_dom[comp["cap"]],
            "weakly_grounded": comp["weak"],
            "cross_domain_ref": comp["cross"],  # SA-3: emit exactly as encoded
            "confidence":     None,   # SA-4
            "source_ref":     None,   # SA-4
            "component_component": [],  # SA-4: source absent
        }
        components_out.append(c_obj)

    # ── EDGES ─────────────────────────────────────────────────────────────────
    domain_cap_edges = [
        {"from": cap["domain"], "to": cap["id"], "type": "DOMAIN_CAPABILITY"}
        for cap in CAPABILITIES
    ]
    cap_comp_edges = [
        {"from": comp["cap"], "to": comp["id"], "type": "CAPABILITY_COMPONENT"}
        for comp in COMPONENTS
    ]

    # ── DETERMINISM HASH ──────────────────────────────────────────────────────
    det_input = {
        "domain_ids": [d["id"] for d in DOMAINS],
        "cap_ids":    [c["id"] for c in CAPABILITIES],
        "comp_ids":   [c["id"] for c in COMPONENTS],
    }
    det_hash = hashlib.sha256(
        json.dumps(det_input, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()

    topology = {
        "artifact_id": "41X-CANONICAL-TOPOLOGY-JSON",
        "schema_version": "1.0",
        "emission_date": str(date.today()),
        "emission_run_id": run_id,
        "emission_stream": STREAM,
        "source_authority": {
            "script_path":    "scripts/pios/41.1/build_semantic_layer.py",
            "script_label":   "PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1",
            "source_type":    "STRUCTURED_SEMANTIC_EMITTER",
            "canonical_basis": "41.1 semantic layer",
            "run_reference":  mod.RUN_REFERENCE,
            "canonical_date": mod.DATE,
            "contract_id":    mod.CONTRACT_ID,
            "emission_script": "scripts/psee/emit_canonical_topology.py",
            "emission_note":   (
                "Freshly emitted for " + run_id + " by loading "
                "build_semantic_layer.py embedded dicts via importlib. "
                "Data provenance: run_reference=" + mod.RUN_REFERENCE + " "
                "(PIOS-41.1-RUN01-CONTRACT-v1). "
                "Execution: PSEE.FRESH.S2.S3.EMISSION.01."
            ),
        },
        "counts": {
            "domains":     len(domains_out),
            "capabilities": len(capabilities_out),
            "components":  len(components_out),
            "total_nodes": len(domains_out) + len(capabilities_out) + len(components_out),
        },
        "determinism_hash": det_hash,
        "domains":       domains_out,
        "capabilities":  capabilities_out,
        "components":    components_out,
        "edges": {
            "domain_capability":    domain_cap_edges,
            "capability_component": cap_comp_edges,
        },
    }
    return topology


def post_conditions(topology):
    """Verify parity counts before write."""
    counts = topology["counts"]
    assert counts["domains"]      == 17,  f"domain count {counts['domains']} != 17"
    assert counts["capabilities"] == 42,  f"capability count {counts['capabilities']} != 42"
    assert counts["components"]   == 89,  f"component count {counts['components']} != 89"
    assert counts["total_nodes"]  == 148, f"total_nodes {counts['total_nodes']} != 148"
    print(f"POST-CONDITIONS: PASS — 17 domains, 42 capabilities, 89 components, 148 total")


def main():
    parser = argparse.ArgumentParser(
        description="Emit canonical_topology.json — PSEE.FRESH.S2.S3.EMISSION.01"
    )
    parser.add_argument("--output-path", required=True,
                        help="Full path to write canonical_topology.json")
    parser.add_argument("--run-id", required=True,
                        help="Governed run_id for this emission")
    args = parser.parse_args()

    output_path = args.output_path
    run_id      = args.run_id

    print(f"=== emit_canonical_topology.py — {STREAM} ===")
    print(f"run_id:      {run_id}")
    print(f"output_path: {output_path}")
    print()

    # No-overwrite guard
    if os.path.exists(output_path):
        fail("EMIT", f"output already exists (no-overwrite): {output_path}")

    # Load source module
    print("--- Loading source module ---")
    mod = load_source_module()
    print(f"  source:   {SOURCE_SCRIPT}")
    print(f"  contract: {mod.CONTRACT_ID}")
    print(f"  run_ref:  {mod.RUN_REFERENCE}")
    print()

    # Build topology
    print("--- Building topology ---")
    topology = build_topology(mod, run_id)
    print(f"  domains:      {topology['counts']['domains']}")
    print(f"  capabilities: {topology['counts']['capabilities']}")
    print(f"  components:   {topology['counts']['components']}")
    print(f"  total_nodes:  {topology['counts']['total_nodes']}")
    print(f"  edges (D→C):  {len(topology['edges']['domain_capability'])}")
    print(f"  edges (C→C):  {len(topology['edges']['capability_component'])}")
    print(f"  det_hash:     {topology['determinism_hash'][:16]}...")
    print()

    # Post-conditions
    post_conditions(topology)
    print()

    # Emit
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(topology, f, indent=2, ensure_ascii=True)

    size = os.path.getsize(output_path)
    det_hash = hashlib.sha256(open(output_path, "rb").read()).hexdigest()
    print(f"--- Output ---")
    print(f"  WRITTEN: {output_path}")
    print(f"  size:    {size} bytes")
    print(f"  sha256:  {det_hash}")
    print()
    print("EMISSION_COMPLETE")
    print(f"  stream:  {STREAM}")
    print(f"  run_id:  {run_id}")
    print(f"  domains: 17 | capabilities: 42 | components: 89 | total: 148")
    sys.exit(0)


if __name__ == "__main__":
    main()
