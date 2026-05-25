#!/usr/bin/env python3
"""
Artifact integrity verification for governed PI runtime artifacts.

Computes SHA-256 hashes for all governed artifacts in a run directory,
stores them in an artifact_hash_manifest.json, and verifies integrity
on subsequent loads by recomputing and comparing.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P0)
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

GOVERNED_ARTIFACT_PATTERNS = {
    "structural": [
        "structure/40.4/canonical_topology.json",
        "structure/40.3s/code_graph.json",
        "structure/40.3c/structural_centrality.json",
        "structure/40.2r/filtered_inventory.json",
        "structure/40.3r/filtered_topology.json",
    ],
    "semantic": [
        "semantic/spe/semantic_propositions.json",
        "semantic/spe/spe_derivation_report.json",
        "semantic/spe/proposition_review_state.json",
        "semantic/spe/proposition_review_event_log.jsonl",
        "semantic/spe/review_obligations.json",
        "semantic/spe/enrichment_log.json",
        "semantic/spe/enrichment_activity_event.json",
        "semantic/spe/enrichment_summary.json",
        "semantic/spe/debt_reassessment.json",
    ],
    "sqo": [
        "sqo/promotion_state.json",
        "sqo/promotion_event_log.jsonl",
        "sqo/revalidation_result.json",
        "sqo/revalidation_event_log.jsonl",
        "sqo/constitutional_replay_anchor.json",
        "sqo/qualification_blockers.json",
        "sqo/review_obligations.json",
    ],
    "ceu": [
        "ceu/reconciliation_state.json",
        "ceu/reconciliation_event_log.jsonl",
        "ceu/reconciliation_obligations.json",
        "ceu/candidate_registry.json",
        "ceu/evidence_anchors.json",
    ],
    "spine": [
        "spine/spine_objects.json",
    ],
    "convergence": [
        "convergence/convergence_observations.json",
    ],
    "chronicle": [
        "chronicle/CHRONICLE_MANIFEST.json",
        "chronicle/chronicle_events.jsonl",
        "chronicle/chronicle_certification.json",
    ],
    "learning": [
        "learning_events.jsonl",
    ],
}

IMMUTABLE_CLASSES = {
    "structural",
    "chronicle",
}

MANIFEST_FILENAME = "artifact_hash_manifest.json"


def compute_file_hash(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def discover_governed_artifacts(run_dir: Path) -> list[dict]:
    artifacts = []
    for artifact_class, patterns in GOVERNED_ARTIFACT_PATTERNS.items():
        for pattern in patterns:
            path = run_dir / pattern
            if path.exists():
                artifacts.append({
                    "relative_path": pattern,
                    "artifact_class": artifact_class,
                    "immutable": artifact_class in IMMUTABLE_CLASSES,
                })
    checkpoint_dir = run_dir / "chronicle" / "checkpoints"
    if checkpoint_dir.exists():
        for cp in sorted(checkpoint_dir.glob("checkpoint_*.json")):
            rel = str(cp.relative_to(run_dir))
            artifacts.append({
                "relative_path": rel,
                "artifact_class": "chronicle",
                "immutable": True,
            })
    return artifacts


def build_hash_manifest(run_dir: Path) -> dict:
    run_dir = Path(run_dir)
    artifacts = discover_governed_artifacts(run_dir)
    entries = []
    for artifact in artifacts:
        path = run_dir / artifact["relative_path"]
        file_hash = compute_file_hash(path)
        entries.append({
            "relative_path": artifact["relative_path"],
            "artifact_class": artifact["artifact_class"],
            "immutable": artifact["immutable"],
            "sha256": file_hash,
            "size_bytes": path.stat().st_size,
            "hashed_at": datetime.now(timezone.utc).isoformat(),
        })
    manifest = {
        "manifest_version": "1.0",
        "run_directory": str(run_dir),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "artifact_count": len(entries),
        "artifacts": entries,
    }
    manifest_path = run_dir / MANIFEST_FILENAME
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    return manifest


def verify_hash_manifest(run_dir: Path, strict: bool = False) -> dict:
    run_dir = Path(run_dir)
    manifest_path = run_dir / MANIFEST_FILENAME
    if not manifest_path.exists():
        return {
            "status": "NO_MANIFEST",
            "message": f"No {MANIFEST_FILENAME} found in {run_dir}",
            "passed": 0,
            "failed": 0,
            "missing": 0,
        }
    with open(manifest_path) as f:
        manifest = json.load(f)

    results = []
    passed = 0
    failed = 0
    missing = 0
    tampered = []

    for entry in manifest["artifacts"]:
        path = run_dir / entry["relative_path"]
        if not path.exists():
            results.append({
                "relative_path": entry["relative_path"],
                "status": "MISSING",
                "expected_hash": entry["sha256"],
            })
            missing += 1
            continue

        current_hash = compute_file_hash(path)
        if current_hash == entry["sha256"]:
            results.append({
                "relative_path": entry["relative_path"],
                "status": "INTACT",
            })
            passed += 1
        else:
            is_immutable = entry.get("immutable", False)
            status = "TAMPERED_IMMUTABLE" if is_immutable else "MODIFIED"
            results.append({
                "relative_path": entry["relative_path"],
                "status": status,
                "expected_hash": entry["sha256"],
                "current_hash": current_hash,
                "immutable": is_immutable,
            })
            failed += 1
            if is_immutable:
                tampered.append(entry["relative_path"])

    immutable_violation = len(tampered) > 0
    overall = "FAIL" if (immutable_violation or (strict and failed > 0)) else "PASS"

    return {
        "status": overall,
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "manifest_created_at": manifest.get("created_at"),
        "passed": passed,
        "failed": failed,
        "missing": missing,
        "total": len(manifest["artifacts"]),
        "immutable_violations": tampered,
        "results": results,
    }


def verify_single_artifact(run_dir: Path, relative_path: str) -> dict:
    run_dir = Path(run_dir)
    manifest_path = run_dir / MANIFEST_FILENAME
    if not manifest_path.exists():
        return {"status": "NO_MANIFEST"}
    with open(manifest_path) as f:
        manifest = json.load(f)

    entry = next(
        (a for a in manifest["artifacts"] if a["relative_path"] == relative_path),
        None,
    )
    if entry is None:
        return {"status": "NOT_IN_MANIFEST", "relative_path": relative_path}

    path = run_dir / relative_path
    if not path.exists():
        return {"status": "MISSING", "relative_path": relative_path}

    current_hash = compute_file_hash(path)
    if current_hash == entry["sha256"]:
        return {"status": "INTACT", "relative_path": relative_path}
    else:
        return {
            "status": "TAMPERED_IMMUTABLE" if entry.get("immutable") else "MODIFIED",
            "relative_path": relative_path,
            "expected_hash": entry["sha256"],
            "current_hash": current_hash,
        }


def main():
    parser = argparse.ArgumentParser(
        description="Governed artifact integrity verification"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    build_parser = subparsers.add_parser("build", help="Build hash manifest for a run")
    build_parser.add_argument("run_dir", help="Path to run directory")

    verify_parser = subparsers.add_parser("verify", help="Verify hash manifest")
    verify_parser.add_argument("run_dir", help="Path to run directory")
    verify_parser.add_argument("--strict", action="store_true",
                               help="Fail on any modification, not just immutable violations")

    args = parser.parse_args()

    if args.command == "build":
        run_dir = Path(args.run_dir)
        if not run_dir.exists():
            print(f"FAIL: Run directory does not exist: {run_dir}", file=sys.stderr)
            sys.exit(1)
        manifest = build_hash_manifest(run_dir)
        print(f"Built hash manifest: {manifest['artifact_count']} artifacts")
        print(f"  Written to: {run_dir / MANIFEST_FILENAME}")
        sys.exit(0)

    elif args.command == "verify":
        run_dir = Path(args.run_dir)
        result = verify_hash_manifest(run_dir, strict=args.strict)
        print(f"Verification: {result['status']}")
        print(f"  Passed: {result['passed']}")
        print(f"  Failed: {result['failed']}")
        print(f"  Missing: {result['missing']}")
        if result.get("immutable_violations"):
            print(f"  IMMUTABLE VIOLATIONS:")
            for path in result["immutable_violations"]:
                print(f"    - {path}")
        sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
