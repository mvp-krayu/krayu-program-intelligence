#!/usr/bin/env python3
"""
compute_zone_projection.py
Stage S08_41X — Step 2
Contract: PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01

Pure projection layer: reads 75.x outputs; projects zone state into 41.x format;
writes pressure_zone_projection.json and projection_manifest.json.
NO recomputation of signals.

Usage:
    python3 scripts/pios/41x/compute_zone_projection.py --run-dir <path> [--input-dir <path>] [--output-dir <path>]
"""

import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from psee_json import psee_dumps, THRESHOLD_41X

SCHEMA_VERSION = "1.0"
PROJECTION_STAGE = "41.x"
SOURCE_STAGE = "75.x"
PROJECTION_CONTRACT = "PI.41X.PRESSURE-ZONE.PROJECTION.01"
GENERATED_AT = "2026-04-25"


def parse_args():
    run_dir = None
    input_dir = None
    output_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--input-dir" and i + 1 < len(args):
            input_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--output-dir" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_dir, input_dir, output_dir


def load_json(path: Path) -> dict:
    if not path.exists():
        print(f"MISSING: {path}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_zone_projection(pzs: dict) -> dict:
    run_id = pzs["run_id"]
    client_id = pzs["client_id"]
    zones = pzs.get("zones", [])
    blind_spots = pzs.get("structural_blind_spot_entities", [])

    zone_projection = []
    for z in zones:
        zone_id = z["zone_id"]
        zone_type = z["zone_type"]
        zone_class = z["zone_class"]
        anchor_id = z["anchor_id"]
        anchor_name = z.get("anchor_name")
        condition_count = z["condition_count"]
        max_act = z["max_activation_count"]
        aggr_conds = z["aggregated_conditions"]
        embedded_pair_rules = z.get("embedded_pair_rules", [])
        member_entities = z.get("member_entities", [])
        cand_ids = [m["candidate_id"] for m in member_entities]

        # Conditions as condition IDs
        condition_ids = [f"COND-{sig}-01" for sig in aggr_conds]
        signal_ids = aggr_conds

        # Attribution profile: "primary" if any member has primary role, else "secondary"
        cond_sources = z.get("condition_sources", [])
        has_primary = any(cs.get("attribution_role") == "primary" for cs in cond_sources)
        attribution_profile = "primary" if has_primary else "secondary"

        # member_entity_ids (CEU first, then domain)
        ceu_ids = [m["entity_id"] for m in member_entities if m["entity_type"] == "CEU"]
        dom_ids_mem = [m["entity_id"] for m in member_entities if m["entity_type"] == "DOMAIN"]
        member_entity_ids = ceu_ids + dom_ids_mem

        # candidate_ids: CEU first, then domain (preserving member order)
        ceu_cand_ids = [m["candidate_id"] for m in member_entities if m["entity_type"] == "CEU"]
        dom_cand_ids = [m["candidate_id"] for m in member_entities if m["entity_type"] == "DOMAIN"]
        candidate_ids_out = ceu_cand_ids + dom_cand_ids

        zone_projection.append({
            "zone_id": zone_id,
            "zone_type": zone_type,
            "zone_class": zone_class,
            "anchor_id": anchor_id,
            "anchor_name": anchor_name,
            "condition_count": condition_count,
            "max_activation_count": max_act,
            "conditions": condition_ids,
            "signals": signal_ids,
            "attribution_profile": attribution_profile,
            "member_entity_ids": member_entity_ids,
            "candidate_ids": candidate_ids_out,
            "embedded_pair_rules": embedded_pair_rules,
        })

    return {
        "schema_version": SCHEMA_VERSION,
        "projection_stage": PROJECTION_STAGE,
        "source_stage": SOURCE_STAGE,
        "source_contract": pzs["source_contract"],
        "projection_contract": PROJECTION_CONTRACT,
        "run_id": run_id,
        "client_id": client_id,
        "generated_at": GENERATED_AT,
        "total_zones": len(zones),
        "zone_projection": zone_projection,
        "structural_blind_spot_entity_count": len(blind_spots),
        "structural_blind_spot_signal": "PSIG-006",
        "focus_domain_selected": False,
        "ranking_applied": False,
        "interpretation_applied": False,
        "projection_prohibited_assumptions": [
            "this projection does not select a focus domain",
            "this projection does not rank zones",
            "this projection does not introduce new signals or IDs",
            "this projection does not recompute conditions",
            "this projection does not override 75.x authority",
        ],
    }


def build_projection_manifest(
    run_id: str,
    client_id: str,
    pzs_source_contract: str,
    ccs_source_contract: str,
) -> dict:
    return {
        "schema_version": "1.0",
        "projection_stage": PROJECTION_STAGE,
        "source_stage": SOURCE_STAGE,
        "projection_contract": PROJECTION_CONTRACT,
        "run_id": run_id,
        "client_id": client_id,
        "generated_at": GENERATED_AT,
        "artifacts": [
            {
                "filename": "pressure_zone_projection.json",
                "description": "Normalized flat-schema projection of 75.x pressure zone designations",
                "source": "pressure_zone_state.json",
                "source_contract": pzs_source_contract,
            },
            {
                "filename": "signal_projection.json",
                "description": "41.x-normalized signal condition projection from 75.x correlation state",
                "source": "condition_correlation_state.json",
                "source_contract": ccs_source_contract,
            },
            {
                "filename": "projection_manifest.json",
                "description": "Manifest for this 41.x projection package",
                "source": "75x_runtime_manifest.json",
                "source_contract": PROJECTION_CONTRACT,
            },
        ],
        "source_artifacts": [
            "75.x/pressure_zone_state.json",
            "75.x/pressure_candidate_state.json",
            "75.x/condition_correlation_state.json",
            "75.x/75x_runtime_manifest.json",
        ],
        "reinjection_analysis": {
            "nearest_consumer_zone": {
                "path": "app/gauge-product/pages/api/zones.js",
                "entry_point": "zones.js:25",
                "invokes": "scripts/pios/tier2_query_engine.py --list-zones",
                "contract": "TIER2.RUNTIME.QUERY.ENGINE.01",
                "status": "AVAILABLE — pressure_zone_projection.json not yet wired; requires tier2_query_engine.py extension",
            },
            "nearest_consumer_signal": {
                "path": "app/gauge-product/pages/api/signals.js",
                "entry_point": "signals.js:35",
                "reads": "docs/pios/41.4/signal_registry.json",
                "contract": "GAUGE.RUNTIME.SIGNAL.VISIBILITY.01",
                "status": "AVAILABLE — signal_projection.json is a parallel artifact; does not replace signal_registry.json",
            },
            "direct_consumer_pressure_zone_projection": "NONE — no existing code path reads pressure_zone_projection.json by name",
            "safe_to_proceed": True,
            "blockers": [],
        },
        "projection_status": "PROJECTION_PACKAGE_READY",
        "focus_domain_selected": False,
        "ranking_applied": False,
        "downstream_ready_for": [
            "tier2_query_engine.py extension",
            "41.x semantic shaping",
            "agentic AI read-only consumption",
        ],
    }


def main():
    run_dir, input_dir, output_dir = parse_args()
    if run_dir is None:
        print("Usage: compute_zone_projection.py --run-dir <path> [--input-dir <path>] [--output-dir <path>]")
        sys.exit(1)
    run_dir = run_dir.resolve()
    if input_dir is None:
        input_dir = run_dir
    if output_dir is None:
        output_dir = run_dir
    input_dir = input_dir.resolve()
    output_dir = output_dir.resolve()

    print(f"[S08_41X.2] compute_zone_projection")
    print(f"  run_dir:    {run_dir}")
    print(f"  input_dir:  {input_dir}")
    print(f"  output_dir: {output_dir}")

    pzs = load_json(input_dir / "75.x" / "pressure_zone_state.json")
    ccs = load_json(input_dir / "75.x" / "condition_correlation_state.json")

    run_id = pzs["run_id"]
    client_id = pzs["client_id"]

    zone_proj = build_zone_projection(pzs)
    manifest = build_projection_manifest(
        run_id, client_id,
        pzs["source_contract"],
        ccs["source_contract"],
    )

    out_dir_41 = output_dir / "41.x"
    out_dir_41.mkdir(parents=True, exist_ok=True)

    pzp_path = out_dir_41 / "pressure_zone_projection.json"
    with open(pzp_path, "w", encoding="utf-8") as f:
        f.write(psee_dumps(zone_proj, threshold=THRESHOLD_41X))
    print(f"  Written: {pzp_path}")

    manifest_path = out_dir_41 / "projection_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"  Written: {manifest_path}")

    print(f"  Zones projected: {zone_proj['total_zones']}")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()
