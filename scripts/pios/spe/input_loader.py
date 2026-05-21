"""
SPE Input Loader
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Loads all PATH A inputs from a run directory into a typed bundle.
Validates readiness and computes input_hash for replayability.
"""

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class SPEInputBundle:
    reconciliation_state: dict
    evidence_anchors: dict
    candidate_registry: dict
    derivation_lineage: dict
    structural_centrality: dict
    code_graph: dict
    canonical_topology: dict
    spine_objects: dict
    learning_events: list[dict] = field(default_factory=list)
    input_hash: str = ""
    run_dir: Path = field(default_factory=Path)

    @property
    def confirmed_ceus(self) -> dict:
        candidates = self.reconciliation_state.get("candidates", {})
        return {k: v for k, v in candidates.items() if v.get("state") == "CONFIRMED"}

    @property
    def hero_moments(self) -> list[dict]:
        objs = self.spine_objects.get("objects", {})
        return objs.get("hero_moments", [])

    @property
    def evidence_objects(self) -> list[dict]:
        objs = self.spine_objects.get("objects", {})
        return objs.get("evidence_objects", [])

    @property
    def replay_corridors(self) -> list[dict]:
        objs = self.spine_objects.get("objects", {})
        return objs.get("replay_corridors", [])

    @property
    def centrality_ranking(self) -> list[dict]:
        return self.structural_centrality.get("centrality_ranking", [])

    @property
    def candidate_list(self) -> list[dict]:
        return self.candidate_registry.get("candidates", [])

    @property
    def code_graph_relationships(self) -> list[dict]:
        return self.code_graph.get("relationships", [])

    @property
    def topology_clusters(self) -> list[dict]:
        return self.canonical_topology.get("clusters", [])


class InputLoadError(Exception):
    pass


REQUIRED_ARTIFACTS = {
    "reconciliation_state": "ceu/reconciliation_state.json",
    "evidence_anchors": "ceu/evidence_anchors.json",
    "candidate_registry": "ceu/candidate_registry.json",
    "derivation_lineage": "ceu/derivation_lineage.json",
    "structural_centrality": "structure/40.3c/structural_centrality.json",
    "code_graph": "structure/40.3s/code_graph.json",
    "canonical_topology": "structure/40.4/canonical_topology.json",
    "spine_objects": "spine/spine_objects.json",
}

OPTIONAL_ARTIFACTS = {
    "learning_events": "governance/learning_events.jsonl",
}


def _load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _load_jsonl(path: Path) -> list[dict]:
    events = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                events.append(json.loads(line))
    return events


def _compute_input_hash(artifacts: dict[str, Path]) -> str:
    hashes = []
    for name in sorted(artifacts.keys()):
        path = artifacts[name]
        content = path.read_bytes()
        h = hashlib.sha256(content).hexdigest()
        hashes.append(f"{name}:{h}")
    combined = "\n".join(hashes)
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()


def load_inputs(run_dir: Path, learning_context: Optional[dict] = None) -> SPEInputBundle:
    run_dir = Path(run_dir)
    if not run_dir.exists():
        raise InputLoadError(f"Run directory does not exist: {run_dir}")

    loaded = {}
    artifact_paths = {}

    for name, rel_path in REQUIRED_ARTIFACTS.items():
        full_path = run_dir / rel_path
        if not full_path.exists():
            raise InputLoadError(f"Required artifact missing: {rel_path}")
        loaded[name] = _load_json(full_path)
        artifact_paths[name] = full_path

    learning_events = []
    le_path = run_dir / OPTIONAL_ARTIFACTS["learning_events"]
    if le_path.exists():
        learning_events = _load_jsonl(le_path)

    input_hash = _compute_input_hash(artifact_paths)

    recon = loaded["reconciliation_state"]
    if recon.get("reconciliation_status") != "COMPLETE":
        raise InputLoadError(
            f"Reconciliation not COMPLETE: {recon.get('reconciliation_status')}"
        )

    centrality = loaded["structural_centrality"]
    if not centrality.get("centrality_ranking"):
        raise InputLoadError("Structural centrality has no ranking data")

    cg = loaded["code_graph"]
    if not cg.get("relationships"):
        raise InputLoadError("Code graph has no relationships")

    return SPEInputBundle(
        reconciliation_state=loaded["reconciliation_state"],
        evidence_anchors=loaded["evidence_anchors"],
        candidate_registry=loaded["candidate_registry"],
        derivation_lineage=loaded["derivation_lineage"],
        structural_centrality=loaded["structural_centrality"],
        code_graph=loaded["code_graph"],
        canonical_topology=loaded["canonical_topology"],
        spine_objects=loaded["spine_objects"],
        learning_events=learning_events,
        input_hash=input_hash,
        run_dir=run_dir,
    )
