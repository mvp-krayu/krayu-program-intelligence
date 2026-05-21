"""
SPE Output Emitter
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Writes derivation results to run directory:
- spine/spine_objects.json — appends semantic_propositions
- semantic/spe/proposition_derivation_lineage.json
- semantic/spe/proposition_review_queue.json
- semantic/spe/spe_derivation_report.json
- governance/learning_events.jsonl — appends new events
"""

import json
from datetime import datetime, timezone
from pathlib import Path

from .proposition_schema import DerivationResult


def emit_outputs(
    run_dir: Path,
    result: DerivationResult,
    confidence_report: dict,
    review_queue: dict,
    learning_events: list[dict],
    learning_influence_summary: dict,
) -> dict:
    run_dir = Path(run_dir)
    ts = datetime.now(timezone.utc).isoformat()
    files_written = []

    spine_path = run_dir / "spine" / "spine_objects.json"
    if spine_path.exists():
        with open(spine_path, encoding="utf-8") as f:
            spine = json.load(f)
    else:
        spine = {"objects": {}}

    spine_props = [p.to_dict() for p in result.propositions]
    spine["objects"]["semantic_propositions"] = spine_props

    summary = spine.get("summary", {})
    summary["semantic_propositions"] = len(spine_props)
    total = 0
    for key, val in spine.get("objects", {}).items():
        if isinstance(val, list):
            total += len(val)
    summary["total_objects"] = total
    spine["summary"] = summary
    spine["last_updated"] = ts

    spine_path.parent.mkdir(parents=True, exist_ok=True)
    with open(spine_path, "w", encoding="utf-8") as f:
        json.dump(spine, f, indent=2)
    files_written.append(str(spine_path.relative_to(run_dir)))

    spe_dir = run_dir / "semantic" / "spe"
    spe_dir.mkdir(parents=True, exist_ok=True)

    lineage_path = spe_dir / "proposition_derivation_lineage.json"
    lineage_data = {
        "contract_id": "PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01",
        "specimen_id": result.specimen_id,
        "run_id": result.run_id,
        "generated_at": ts,
        "input_hash": result.input_hash,
        "derivation_hash": result.derivation_hash,
        "total_events": len(result.lineage_events),
        "events": [e.to_dict() for e in result.lineage_events],
    }
    with open(lineage_path, "w", encoding="utf-8") as f:
        json.dump(lineage_data, f, indent=2)
    files_written.append(str(lineage_path.relative_to(run_dir)))

    review_path = spe_dir / "proposition_review_queue.json"
    with open(review_path, "w", encoding="utf-8") as f:
        json.dump(review_queue, f, indent=2)
    files_written.append(str(review_path.relative_to(run_dir)))

    report_path = spe_dir / "spe_derivation_report.json"
    report = {
        "contract_id": "PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01",
        "specimen_id": result.specimen_id,
        "run_id": result.run_id,
        "generated_at": ts,
        "input_hash": result.input_hash,
        "derivation_hash": result.derivation_hash,
        "proposition_count": len(result.propositions),
        "confidence_report": confidence_report,
        "review_queue_count": review_queue.get("total_items", 0),
        "learning_events_emitted": len(learning_events),
        "learning_influence_summary": learning_influence_summary,
        "class_summary": _class_summary(result),
    }
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    files_written.append(str(report_path.relative_to(run_dir)))

    if learning_events:
        le_path = run_dir / "governance" / "learning_events.jsonl"
        le_path.parent.mkdir(parents=True, exist_ok=True)
        with open(le_path, "a", encoding="utf-8") as f:
            for event in learning_events:
                f.write(json.dumps(event) + "\n")
        files_written.append(str(le_path.relative_to(run_dir)))

    return {
        "files_written": files_written,
        "proposition_count": len(result.propositions),
        "lineage_event_count": len(result.lineage_events),
        "review_queue_count": review_queue.get("total_items", 0),
        "learning_events_count": len(learning_events),
    }


def _class_summary(result: DerivationResult) -> dict:
    from collections import defaultdict
    summary = defaultdict(lambda: {"count": 0, "mean_confidence": 0.0, "propositions": []})
    for p in result.propositions:
        entry = summary[p.proposition_class]
        entry["count"] += 1
        entry["propositions"].append({"id": p.id, "confidence": p.confidence})
    for cls, entry in summary.items():
        confs = [pp["confidence"] for pp in entry["propositions"]]
        entry["mean_confidence"] = round(sum(confs) / len(confs), 3) if confs else 0.0
    return dict(summary)
