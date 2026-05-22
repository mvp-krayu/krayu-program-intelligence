# Implementation Semantics — PI.GENESIS.GEN-1.CHRONICLE-EVENT-MODEL.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| ChronicleEmitter | scripts/pios/chronicle/emitter.py | Inline chronicle event emission during pipeline execution | REUSABLE — consumed by run_client_pipeline.py, extensible by GEN-2/3/4 |

## 2. Input Contracts

| Input | Shape | Source |
|-------|-------|--------|
| client_id | str | Pipeline args (--client) |
| run_id | str | Pipeline args (--run-id) |
| run_dir | Path | Computed: REPO_ROOT / clients / {client} / psee / runs / {run_id} |
| phase_name | str | Pipeline phase tuple labels (e.g., "Phase 1  — Source Boundary") |

## 3. Output Contracts

| Output | Path | Format |
|--------|------|--------|
| chronicle_events.jsonl | {run_dir}/chronicle/chronicle_events.jsonl | Append-only JSONL, one event per line |
| CHRONICLE_MANIFEST.json | {run_dir}/chronicle/CHRONICLE_MANIFEST.json | JSON, runtime-accumulating |
| Checkpoint files | {run_dir}/chronicle/checkpoints/checkpoint_{NN}_{slug}.json | JSON, FROZEN |

### Event Schema (chronicle_events.jsonl)

```json
{
  "event_id": "CE-{client}-{run}-{sequence:04d}",
  "event_type": "{event_type}",
  "timestamp": "{utc_iso_ms}",
  "semantic_phase": "{DISCOVERY|EMERGENCE|FORMATION|...}",
  "description": "{what happened}",
  "evidence_refs": ["{refs}"],
  "replay_safe": true,
  "detail": { "{event-type-specific fields}" }
}
```

### Manifest Schema (CHRONICLE_MANIFEST.json)

```json
{
  "schema_version": "2.0",
  "chronicle_id": "{client}-{run}-genesis",
  "corridor_type": "FULL_COGNITIVE_GENESIS",
  "status": "IN_PROGRESS | COMPLETE | INCOMPLETE",
  "events_emitted": 0,
  "checkpoints_frozen": 0,
  "semantic_phases_reached": [],
  "pipeline_phases": {}
}
```

## 4. Calibration Assumptions

| Constant | Value | Governed? |
|----------|-------|-----------|
| SEMANTIC_PHASE_MAP | 17-entry phase→semantic mapping | YES — reflects genesis semantic rhythm |
| PHASE_INDEX_MAP | 17-entry phase→index mapping | YES — matches pipeline phase order |
| PHASE_SLUG_MAP | 17-entry phase→slug mapping | YES — used for checkpoint filenames |
| schema_version | "2.0" | YES — distinguishes from BlueEdge RC chronicle v1.0 |

## 5. Extension Points

| Extension | How | Expected Consumer |
|-----------|-----|-------------------|
| emit_custom() | Pass any event_type/semantic_phase/description | GEN-2 (hero_moment_emergence), GEN-3 (ai_intervention), GEN-4 (learning_event) |
| state_snapshot in freeze_checkpoint() | Pass phase-specific dict | Any phase that wants enriched checkpoint data |
| New emit_* methods | Add to ChronicleEmitter class | Future GEN stages add domain-specific emitters |

## 6. Module Responsibility Map

| File | Owns |
|------|------|
| scripts/pios/chronicle/__init__.py | Package export (ChronicleEmitter) |
| scripts/pios/chronicle/emitter.py | All chronicle event emission, checkpoint freeze, manifest accumulation |
| scripts/pios/run_client_pipeline.py | Pipeline integration (_init_chronicle, phase loop hooks, enriched events) |
