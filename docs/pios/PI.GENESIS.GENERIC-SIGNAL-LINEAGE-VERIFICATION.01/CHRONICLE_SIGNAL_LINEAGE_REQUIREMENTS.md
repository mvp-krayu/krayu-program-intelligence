# Chronicle Signal Lineage Requirements

> **Defines how signal families become Chronicle-visible lineage objects.**
> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01

---

## Purpose

Signals must be traceable through the Chronicle as governed lineage objects. When an audience descends into signal depth within a Chronicle chapter, they must be able to trace: which structural artifact produced the signal, which pipeline phase derived it, and what its activation state means.

This document specifies the lineage contract for signal visibility in the Chronicle runtime.

---

## Signal Lineage Object Contract

Every signal family that reaches Chronicle visibility MUST produce a signal lineage record:

```json
{
  "lineage_type": "signal_derivation",
  "signal_family": "<PSIG|DPSIG|BSIG|ISIG|CSIG|ESIG>",
  "signal_id": "<signal identifier>",
  "source_artifact": "<path to primary artifact>",
  "source_artifact_hash": "<SHA-256 of primary artifact at derivation time>",
  "derivation_phase": "<pipeline phase that produced the signal>",
  "derivation_level": "<Level 1 | Level 2 | Topology>",
  "derivation_script": "<script path>",
  "status": "<IMPLEMENTED | PARTIAL | NEW | CONCEPT>",
  "classification": "<GENERIC_GENESIS | SOFTWARE_MODULE>",
  "activation_state": "<signal activation state>",
  "signal_value": "<numeric value or null>",
  "threshold": "<activation threshold>",
  "downstream_projection_eligibility": {
    "vault_signal_registry": true,
    "lens_tier1": true,
    "lens_tier2": true,
    "boardroom": true,
    "dpsig_sidecar": false
  },
  "chronicle_semantic_phase": "<FORMATION | STABILIZATION | PROJECTION>",
  "chronicle_checkpoint_ref": "<checkpoint_id where signal was first derived>"
}
```

---

## Signal Emergence in Chronicle Semantic Phases

Signals emerge at specific points in the Chronicle's semantic rhythm:

| Semantic Phase | Signal Events |
|---------------|---------------|
| DISCOVERY | No signals — raw intake only |
| EMERGENCE | 40.4 becomes available → DPSIG derivable |
| FORMATION | Binding envelope constructed → PSIG derivable. 40.3s/40.3c available → ISIG/CSIG derivable (if PATH A) |
| TENSION | Governance challenges may affect binding → signal values may shift if binding is modified |
| STRENGTHENING | Enrichment events (40.3s → binding) → ESIG observable. Signal values may change post-enrichment |
| STABILIZATION | Deterministic revalidation → signal values frozen for this checkpoint |
| QUALIFICATION | S-state advancement → signals are part of qualification evidence |
| CONVERGENCE | Cross-specimen signal comparison → DPSIG convergence observable |
| PROJECTION | Signals project to executive surfaces → LENS/BOARDROOM consumption confirmed |

---

## Chronicle Event Types for Signals

The following chronicle event types are required for signal lineage:

### signal_derivation_event
Emitted when a signal family is computed for the first time in a run.

```json
{
  "event_type": "signal_derivation",
  "signal_family": "PSIG",
  "signal_count": 4,
  "source_artifact": "binding/binding_envelope.json",
  "derivation_phase": "phase_06_and_07_e2e",
  "semantic_phase": "FORMATION",
  "activated_signals": ["PSIG-001", "PSIG-002"],
  "dormant_signals": ["PSIG-004", "PSIG-006"]
}
```

### signal_enrichment_event
Emitted when 40.3s enrichment modifies the binding and thus changes potential signal values.

```json
{
  "event_type": "signal_enrichment",
  "enrichment_source": "40.3s/code_graph.json",
  "edges_added": 4,
  "edges_before": 29,
  "edges_after": 33,
  "enrichment_lift": 0.138,
  "affected_signal_families": ["PSIG"],
  "semantic_phase": "STRENGTHENING"
}
```

### signal_projection_event
Emitted when signals are projected to executive surfaces.

```json
{
  "event_type": "signal_projection",
  "projection_target": "vault/signal_registry.json",
  "signals_projected": ["PSIG-001", "PSIG-002", "PSIG-004", "PSIG-006"],
  "projection_authority": "PROVISIONAL_CKR_CANDIDATE",
  "semantic_phase": "PROJECTION"
}
```

---

## Chronicle Zoom Depth for Signals

Within the Chronicle Z1-Z5 zoom architecture, signals are visible at:

| Zoom Level | Signal Visibility |
|------------|------------------|
| Z1 — Executive Understanding | Signal activation summary: "2 of 4 structural pressure signals activated" |
| Z2 — Semantic Interpretation | Which signals activated, what they mean: "coupling pressure HIGH in backend_app_root" |
| Z3 — Governance Detail | Signal derivation events, enrichment events, threshold decisions |
| Z4 — Structural Proof | Full signal lineage record, artifact hashes, computation trace |
| Z5 — Raw Evidence | Source artifacts, binding envelope topology, 40.3s relationships |

---

## Signal Family Chronicle Status Index

| Family | Level | Status | Chronicle Visibility | Notes |
|--------|-------|--------|---------------------|-------|
| PSIG | Level 2 | IMPLEMENTED | FULL — all chronicle events emittable | Generic corridor: Phase 6+7 on binding envelope. Certified NET IMPROVEMENT |
| DPSIG | Topology | IMPLEMENTED | FULL — all chronicle events emittable | Independent derivation from 40.4. CFA corrected to ASYMMETRIC |
| BSIG | Level 2 | NEW | NOT YET — no computation to emit from | Binding metadata available; no computation pipeline |
| ISIG | Level 1 | **OPERATIONAL** (ISIG-001, ISIG-002) | READY — derive_import_signals.py emits isig_signal_set.json | PSIG-004 LOST_READ resolved. BlueEdge IHP=35.3 HIGH, IFA=22.3 HIGH. Chronicle events emittable when pipeline-integrated |
| CSIG | Level 1 | PARTIAL | NOT YET — raw data in 40.3c, no named signal emit | CSIG-001/002/003 computable from centrality metrics |
| ESIG | Level 1→2 | NEW | NOT YET — enrichment delta observable but not emitted | Phase 5 enrichment step has the delta |
| ESI | Cross-run | CONCEPT | NOT ELIGIBLE — no implementation | |
| RAG | Cross-registry | CONCEPT | NOT ELIGIBLE — no implementation | |

---

## Integration with GEN-1 Chronicle Event Model

The signal lineage events defined above extend the GEN-1 ChronicleEmitter with 3 new methods:

- `emit_signal_derivation(family, signal_count, source_artifact, activated, dormant)`
- `emit_signal_enrichment(enrichment_source, edges_added, edges_before, edges_after, affected_families)`
- `emit_signal_projection(projection_target, signals_projected, projection_authority)`

These methods follow the existing GEN-1 pattern: append-only JSONL, semantic phase tagging, graceful degradation (pipeline unchanged if chronicle unavailable).

---

## What This Document Does NOT Authorize

- Implementation of ISIG/CSIG/BSIG/ESIG computation — canonicalization only
- Modification of existing ChronicleEmitter code — specification only
- Signal value fabrication for chronicle demonstration purposes
- Chronicle chapter content that references unimplemented signals as if they exist
