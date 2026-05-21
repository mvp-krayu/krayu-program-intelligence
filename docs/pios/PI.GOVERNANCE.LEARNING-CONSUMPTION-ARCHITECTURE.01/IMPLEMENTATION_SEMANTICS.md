# Implementation Semantics — PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| `transition_event()` | learning_lifecycle.py | Governed lifecycle state transition with append-only log | REUSABLE — any lifecycle-governed entity |
| `validate_transition()` | learning_lifecycle.py | State transition validation against VALID_TRANSITIONS | REUSABLE |
| `is_consumable()` | learning_lifecycle.py | Check if event is in CONSUMABLE state | REUSABLE |
| `load_learning_events()` | learning_lifecycle.py | Load JSONL learning events from specimen runs | REUSABLE |
| `load_registry()` | learning_registry.py | Load central learning registry | REUSABLE |
| `save_registry()` | learning_registry.py | Save registry with auto-updated metadata | REUSABLE |
| `ingest_from_specimen()` | learning_registry.py | Ingest specimen learning events into central registry | REUSABLE — any specimen |
| `register_capability_class()` | learning_registry.py | Register new capability class in registry | REUSABLE — marketplace modules |
| `declare_consumption()` | learning_registry.py | Register consumer with capability class declarations | REUSABLE — agents, marketplace |
| `resolve_consumable_for_consumer()` | learning_registry.py | Resolve applicable CONSUMABLE events for a declared consumer | REUSABLE |
| `produce_activation_manifest()` | learning_registry.py | Produce replay-safe activation manifest for a run | REUSABLE |
| `phase_0L_learning_load()` | run_client_pipeline.py | Pipeline learning registry load phase | PIPELINE-SPECIFIC |
| `phase_10L_learning_manifest()` | run_client_pipeline.py | Pipeline activation manifest production phase | PIPELINE-SPECIFIC |

## 2. Input Contracts

### learning_lifecycle.transition_event()
```
event: dict — must contain "lifecycle_state" field
target_state: str — must be in VALID_TRANSITIONS
actor_id: str — who is transitioning
justification: str — why
evidence_refs: list[str] | None — supporting evidence
```

### learning_registry.ingest_from_specimen()
```
registry: dict — loaded registry object
specimen_id: str — specimen identifier (e.g., "netbox")
run_id: str — run identifier
events_path: Path — path to learning_events.jsonl in specimen run
actor_id: str — who is ingesting
```

### learning_registry.resolve_consumable_for_consumer()
```
registry: dict — loaded registry object
consumer_id: str — must match a consumption_declaration consumer_id
```
Returns: list of events in CONSUMABLE state matching declared capability_classes.

### learning_registry.produce_activation_manifest()
```
registry: dict — loaded registry object
client_id: str — client identifier
run_id: str — run identifier
consumer_activations: dict[str, list] — consumer_id → list of activated events
```

## 3. Output Contracts

### Activation Manifest (learning_activation_manifest.json)
```
{
  "manifest_type": "LEARNING_ACTIVATION_MANIFEST",
  "schema_version": "1.0.0",
  "activation_summary": { total_activated, consumers_with_learnings, governance_model },
  "activated_events": [ { event_id, capability_class, lifecycle_state, ... } ],
  "consumer_activations": { consumer_id: { governance_level, replay_guarantee, learning_ids } },
  "explainability": { question, answer_source, replay_contract, governance_assertion }
}
```

### Registry (learning_registry.json)
```
{
  "registry_id": "LEARNING_REGISTRY_V1",
  "schema_version": "1.0.0",
  "capability_classes": { class_id: { description, target_capabilities, governance_level } },
  "consumption_declarations": [ { consumer_id, consumer_type, capability_classes, governance_level } ],
  "events": [ { event_id, lifecycle_state, capability_class, ... } ],
  "ingestion_log": [ { timestamp, specimen_id, ingested, skipped_duplicate } ]
}
```

## 4. Calibration Assumptions

| Parameter | Value | Governed/Tuned |
|-----------|-------|----------------|
| VALID_TRANSITIONS | 6-state graph | GOVERNED — lifecycle is architectural |
| CONSUMPTION_ELIGIBLE_STATES | {"CONSUMABLE"} | GOVERNED — only CONSUMABLE activates |
| governance_level default | "ADVISORY" | TUNED — future GOVERNED_MUTATION requires governance gate |
| replay_guarantee default | "DETERMINISTIC_ADVISORY" | GOVERNED — replay contract is architectural |
| _derive_capability_class mapping | 5 category→class pairs | TUNED — extensible as categories grow |

## 5. Extension Points

| Extension | Where | How |
|-----------|-------|-----|
| New capability class | `register_capability_class()` | Call with class_id, description, target_capabilities |
| New consumer type | `declare_consumption()` | Pass `consumer_type: "ENRICHMENT_AGENT"` or `"MARKETPLACE_CAPABILITY"` |
| New lifecycle state | `VALID_TRANSITIONS` in learning_lifecycle.py | Add state + valid transitions (G1 stream required) |
| New category → class mapping | `_derive_capability_class()` in learning_registry.py | Add mapping entry |
| Agentic consumer | `consumption_declarations` in registry | Register with `consumer_type: "ENRICHMENT_AGENT"` |
| Marketplace module | `capability_classes` in registry | Register module capabilities as target_capabilities |

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| `scripts/pios/learning/learning_lifecycle.py` | Lifecycle state machine, transition governance, event I/O |
| `scripts/pios/learning/learning_registry.py` | Central registry CRUD, capability classes, consumption declarations, activation manifests |
| `docs/governance/learning/learning_registry.json` | Registry data — events, classes, declarations, ingestion log |
| `docs/governance/learning/LEARNING_CONSUMPTION_ARCHITECTURE.md` | Architecture specification |
| `scripts/pios/run_client_pipeline.py` | Pipeline orchestration — Phase 0L load, Phase 10L manifest |
