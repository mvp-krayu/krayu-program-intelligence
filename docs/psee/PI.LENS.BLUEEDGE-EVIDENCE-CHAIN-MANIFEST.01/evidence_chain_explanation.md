# Evidence Chain Explanation
## PI.LENS.BLUEEDGE-EVIDENCE-CHAIN-MANIFEST.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Overview

The BlueEdge canonical baseline is composed of artifacts from **three distinct artifact roots** across **two pipeline runs** (one named-client run, one UUID-client run) and **one external source**.

The chain is **not producible from a single pipeline run** under the current generic pipeline model.

---

## Artifact Root 1: Named Baseline Run

**Path:** `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/`
**Produced by:** `PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01` (generic orchestrator, BlueEdge-specific fixup)

Contains the final vault, signal projections, zone state, binding, and 75.x/41.x outputs. This is the authoritative output layer.

15 files across 4 subdirectories: `41.x/`, `75.x/`, `binding/`, `vault/`

**Notable:** The `binding/binding_envelope.json` in this run was produced by the FastAPI conformance pipeline (`PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`), not by generic Phase 5. Its schema is pre-generic (`bindings/domain_telemetry/pressure_zone_designations`).

---

## Artifact Root 2: UUID Integrated Run

**Path:** `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/`
**Produced by:** `PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01` (BlueEdge-specific multi-contract pipeline)

Contains the grounding state, integration validation, decision state, CEU maps, and native (pre-conformance) signal/zone artifacts. This is the source-of-truth layer that feeds the named run.

12 files: `grounding_state_v3.json`, `integration_validation.json`, `decision_state.json`, `ceu_registry_dynamic.json`, `ceu_node_map.json`, `ceu_zone_map.json`, `condition_correlation_state.json`, `pressure_zone_state.json`, `signal_projection.json`, `pressure_zone_projection.json`, `pipeline_execution_trace.json`, `execution_report.md`

**Notable:** Several artifacts in this run have native BlueEdge schemas (CEU-based zone types, COND-XX namespace) that were reformatted into FastAPI-compatible schemas before being promoted to the named run.

---

## Artifact Root 3: External Archive (Source)

**Path:** `/Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar`
**Status:** PRESENT but external to k-pi-core

The original BlueEdge source archive. Not committed to k-pi-core. SHA256 is recorded in source_manifest but the archive itself is external.

---

## Chain Flow (as declared, not as executable)

```
[External Archive]
        │
        ▼
[Intake] canonical_repo → ABSENT
        │
        ▼
[Structure] 40.x scanner → ABSENT
        │
        ▼ (bypassed — used dom_path_domain_layer.json instead)
[DOM] dom_path_domain_layer.json → ABSENT
        │
        ▼
[CEU] grounding_state_v3.json → PRESENT (UUID_RUN)
[CEU] ceu maps → PRESENT (UUID_RUN)
        │
        ▼
[FastAPI Conformance] precomputed signals/binding → ABSENT
        │
        ▼
[Binding] binding_envelope.json → PRESENT (NAMED_RUN, pre-generic schema)
        │
        ▼
[75.x/41.x] condition/zone/signal artifacts → PRESENT (both NAMED_RUN + UUID_RUN)
        │
        ▼
[Integration] integration_validation.json → PRESENT (UUID_RUN)
        │
        ▼
[Vault] 9 artifacts → PRESENT (NAMED_RUN)
        │
        ▼
[Decision] decision_state.json → PRESENT (UUID_RUN only)
```

**Key observation:** The middle of the chain (DOM layer, structure, fastapi_conformance precomputed, canonical_repo) is absent from k-pi-core. The chain has broken links between source and output.

---

## Dual-Run Dependency

Multiple artifacts appear in both runs with different schemas:

| Concept | Named Run (output) | UUID Run (source) |
|---------|-------------------|-------------------|
| Condition correlation | FastAPI-compatible COND-PSIG-XXX | Native COND-XX |
| Pressure zone state | FastAPI-compatible DOMAIN_ZONE | Native CEU-based zones |
| Signal projection | FastAPI-compatible (active_conditions_in_scope) | Native format |
| Zone projection | FastAPI-compatible | Native format |

The named run artifacts are reformatted versions of the UUID run artifacts. Both exist independently. Neither is a copy of the other — they represent the same data in different schemas.

---

## What Is and Is Not Reconstructible

**Reconstructible from existing repo artifacts (no new computation):**
- gauge_state.json (deterministic from grounding_state_v3.json: ratio=1.0 → 60/100 CONDITIONAL)
- coverage_state.json (deterministic from grounding_state_v3.json)
- reconstruction_state.json (deterministic from grounding_state_v3.json)

**Not reconstructible without absent artifacts:**
- canonical_topology.json (requires dom_path_domain_layer.json → ABSENT)
- signal_registry.json values (requires fastapi_conformance precomputed → ABSENT)
- binding_envelope.json (requires fastapi_conformance precomputed → ABSENT)
- All 40.x structural artifacts (requires 40.x scanner output → ABSENT)
- canonical_repo (requires archive extraction → external)
