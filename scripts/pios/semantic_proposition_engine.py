#!/usr/bin/env python3
"""
Semantic Proposition Engine (SPE) — Orchestrator
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Top-level entry point for governed semantic proposition derivation.
Parallel to scripts/pios/semantic_derivation_compiler.py (SDC for BlueEdge).

Exit codes: 0=COMPLETE, 1=FAIL, 2=INPUT_INSUFFICIENT, 3=NO_PROPOSITIONS, 4=AI_UNAVAILABLE
"""

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPTS_DIR = Path(__file__).resolve().parent

sys.path.insert(0, str(REPO_ROOT))


def parse_args():
    p = argparse.ArgumentParser(description="Semantic Proposition Engine")
    p.add_argument("--client", required=True, help="Client ID (e.g. netbox)")
    p.add_argument("--run", required=True, help="Run ID")
    p.add_argument("--enable-semantic-derivation", action="store_true",
                   help="Enable AI-assisted INFERRED tier")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    client = args.client
    run_id = args.run

    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    print(f"SPE: {client}/{run_id}")
    print(f"  run_dir: {run_dir}")

    # Phase 1: Load inputs
    print("\n── Phase 1: Input Loading ──")
    from scripts.pios.spe.input_loader import load_inputs, InputLoadError
    try:
        bundle = load_inputs(run_dir)
    except InputLoadError as e:
        print(f"  INPUT ERROR: {e}")
        return 2

    print(f"  input_hash: {bundle.input_hash[:16]}...")
    print(f"  confirmed CEUs: {len(bundle.confirmed_ceus)}")
    print(f"  hero moments: {len(bundle.hero_moments)}")
    print(f"  centrality entries: {len(bundle.centrality_ranking)}")
    print(f"  code graph relationships: {len(bundle.code_graph_relationships)}")
    print(f"  topology clusters: {len(bundle.topology_clusters)}")

    # Phase 2: Derivation
    print("\n── Phase 2: Deterministic Derivation ──")
    from scripts.pios.spe.derivation_engine import derive_all
    result = derive_all(bundle)
    print(f"  propositions: {len(result.propositions)}")
    print(f"  lineage events: {len(result.lineage_events)}")
    print(f"  derivation_hash: {result.derivation_hash[:16]}...")

    if not result.propositions:
        print("  NO PROPOSITIONS — derivation produced empty result")
        return 3

    # Phase 3a: Confidence scoring
    print("\n── Phase 3a: Confidence Scoring ──")
    from scripts.pios.spe.confidence_engine import score_propositions
    confidence_report = score_propositions(result)
    print(f"  mean confidence: {confidence_report['mean_confidence']}")
    print(f"  distribution: {confidence_report['confidence_distribution']}")

    # Phase 3a.5: INFERRED tier (optional)
    learning_influence_summary = {"active_events": len(bundle.learning_events), "influenced_derivations": 0}
    if args.enable_semantic_derivation:
        print("\n── Phase 3a.5: INFERRED Tier (AI-Gated) ──")
        from scripts.pios.spe.inferred_proposer import propose_inferred
        prop_counter = [len(result.propositions)]
        lineage_counter = [len(result.lineage_events)]
        inferred_props, inferred_lineage, ai_ok = propose_inferred(
            result.propositions, result.specimen_id, result.run_id,
            prop_counter, lineage_counter,
        )
        if inferred_props:
            result.propositions.extend(inferred_props)
            result.lineage_events.extend(inferred_lineage)
            from scripts.pios.spe.confidence_engine import score_propositions as rescore
            confidence_report = rescore(result)
            print(f"  +{len(inferred_props)} INFERRED propositions")
        elif not ai_ok:
            print("  INFERRED tier unavailable — continuing with deterministic only")
        else:
            print("  No valid INFERRED propositions produced")

    # Phase 3b: Learning events
    print("\n── Phase 3b: Learning Event Emission ──")
    from scripts.pios.spe.learning_emitter import emit_learning_events
    learning_events = emit_learning_events(
        result, bundle.hero_moments, bundle.confirmed_ceus,
    )
    result.learning_events = learning_events
    print(f"  learning events: {len(learning_events)}")

    # Phase 3c: Review queue
    print("\n── Phase 3c: Review Queue ──")
    from scripts.pios.spe.review_queue_emitter import emit_review_queue
    review_queue = emit_review_queue(result, bundle.confirmed_ceus)
    print(f"  review items: {review_queue['total_items']}")
    print(f"  triggers: {review_queue.get('trigger_summary', {})}")

    # Phase 4: Output
    print("\n── Phase 4: Output Emission ──")
    from scripts.pios.spe.output_emitter import emit_outputs
    output_summary = emit_outputs(
        run_dir, result, confidence_report, review_queue,
        learning_events, learning_influence_summary,
    )
    print(f"  files written: {len(output_summary['files_written'])}")
    for f in output_summary["files_written"]:
        print(f"    {f}")

    # Summary
    print(f"\n{'═'*60}")
    print(f"  SPE COMPLETE: {len(result.propositions)} propositions")
    print(f"  derivation_hash: {result.derivation_hash[:16]}...")
    print(f"  input_hash: {bundle.input_hash[:16]}...")
    print(f"  review queue: {review_queue['total_items']} items")
    print(f"  learning events: {len(learning_events)}")
    print(f"{'═'*60}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
