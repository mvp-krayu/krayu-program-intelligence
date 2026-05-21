# Governed Learning Consumption Architecture

**Contract:** PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01  
**Status:** OPERATIONAL  
**Date:** 2026-05-21  

## 1. Purpose

The pipeline becomes learning-aware: it reads promoted learnings, records which influenced each run, and produces explainable activation manifests. It does NOT self-mutate.

## 2. Design Principle

```
PROMOTED LEARNING → CONSUMABLE POLICY / CAPABILITY SIGNAL →
PIPELINE DECLARES USAGE → REPLAY RECORDS ACTIVE LEARNING
```

NOT: learning event silently changes behavior.

## 3. Learning Event Lifecycle

```
PROPOSED → REVIEWED → PROMOTED → CONSUMABLE → SUPERSEDED
                    ↘ REJECTED
```

| State | Meaning | Who transitions |
|-------|---------|-----------------|
| PROPOSED | Captured from reconciliation friction, evidence gaps, adapter weaknesses, operator corrections | Pipeline / operator |
| REVIEWED | Operator has reviewed and validated the learning | Operator |
| PROMOTED | Accepted as governed learning — available for consumption | Operator |
| CONSUMABLE | Activated for pipeline consumption under declared governance | Operator |
| SUPERSEDED | Replaced by newer learning or rendered obsolete | Operator / pipeline |
| REJECTED | Reviewed and determined not actionable | Operator |

Every transition carries: actor_id, justification, timestamp, evidence_refs. Transitions are append-only.

## 4. Central Learning Registry

Location: `docs/governance/learning/learning_registry.json`

Contains:
- **Events**: Learning events ingested from specimen runs, enriched with capability_class and registry_metadata
- **Capability Classes**: Named categories mapping learnings to enrichment capabilities
- **Consumption Declarations**: Pipeline phases declare which capability classes they consume, under which governance level, with which replay guarantees
- **Ingestion Log**: Append-only record of event ingestion from specimens

## 5. Capability Classes

Learnings are classified into capability classes that map to enrichment capabilities:

| Class | Description | Target Capabilities |
|-------|-------------|---------------------|
| SEMANTIC_DERIVATION | CEU derivation, tier classification, authority patterns | tier_classifier, authority_pattern_detector, semantic_grounding_assistant |
| EVIDENCE_INTAKE | Evidence type coverage and intake scope | documentation_classifier, package_evidence_intake_adapter |
| CODE_GRAPH_ENRICHMENT | Code graph structural enrichment and centrality | scip_code_graph_enricher, centrality_analyzer |
| SPINE_MANAGEMENT | Spine object consistency and management | spine_object_validator, projection_fidelity_checker |
| GOVERNANCE_WORKFLOW | Governance process formalization | evidence_source_registry, governance_process_orchestrator |

Capability classes are extensible. Future marketplace capability modules register here.

## 6. Consumption Hooks

Pipeline phases declare consumption via `consumption_declarations`:

```json
{
  "consumer_id": "phase_03b_semantic_derivation",
  "consumer_type": "PIPELINE_PHASE",
  "capability_classes": ["SEMANTIC_DERIVATION"],
  "governance_level": "ADVISORY",
  "replay_guarantee": "DETERMINISTIC_ADVISORY"
}
```

**consumer_type** values:
- `PIPELINE_PHASE` — current pipeline phases
- `ENRICHMENT_AGENT` — future agentic orchestrator consumers
- `MARKETPLACE_CAPABILITY` — future marketplace module consumers

**governance_level** values:
- `ADVISORY` — learnings inform but do not mutate pipeline behavior
- `INFORMATIONAL` — learnings are logged but not consumed operationally
- `GOVERNED_MUTATION` — future: learnings may influence pipeline behavior under strict governance

## 7. Pipeline Integration

Two new phases in the pipeline orchestrator:

### Phase 0L — Learning Registry Load
- Loads the central registry
- Resolves consumable learnings per declared consumer
- Populates learning context for the run
- Non-blocking: if registry is empty or unavailable, run proceeds without learning awareness

### Phase 10L — Learning Activation Manifest
- Produces `governance/learning_activation_manifest.json` in the run directory
- Records which learnings were active, which consumers consumed them, under which governance level
- Provides explainability: every run can answer "which historical learnings influenced this result?"

## 8. Activation Manifest

Every pipeline run produces a manifest answering:

> "Which historical learnings influenced this run?"

```json
{
  "manifest_type": "LEARNING_ACTIVATION_MANIFEST",
  "activation_summary": {
    "total_activated": 3,
    "consumers_with_learnings": 2,
    "governance_model": "ADVISORY_NON_MUTATING"
  },
  "activated_events": [...],
  "consumer_activations": {
    "phase_03b_semantic_derivation": {
      "governance_level": "ADVISORY",
      "replay_guarantee": "DETERMINISTIC_ADVISORY",
      "learning_ids": ["LRNE-P7-0001", "LRNE-P7-0003"]
    }
  },
  "explainability": {
    "replay_contract": "Same registry state + same run inputs → same activation manifest"
  }
}
```

## 9. Replay Contract

- Same registry state + same run inputs → same activation manifest
- Governance model is ADVISORY_NON_MUTATING: learnings are recorded, not executed
- Future GOVERNED_MUTATION mode requires additional governance gates

## 10. Agentic Orchestration Plane (Future)

The architecture preserves slots for:

1. **Agentic orchestrators** may later: recommend enrichers, propose compiler improvements, detect adapter gaps, suggest evidence sources, route specimens to best enrichment path
2. **Marketplace capability modules** may register as consumers and proposers
3. Agents register as `consumer_type: "ENRICHMENT_AGENT"` with declared capability classes

Agents MUST NOT:
- Mutate canonical pipeline logic autonomously
- Promote learnings without governance
- Create hidden behavior drift
- Bypass replay contracts

## 11. Non-Goals (Current)

- Self-modifying pipeline behavior
- Autonomous learning promotion
- Agentic orchestration (future slots only)
- Marketplace capability execution
- GOVERNED_MUTATION governance level activation
