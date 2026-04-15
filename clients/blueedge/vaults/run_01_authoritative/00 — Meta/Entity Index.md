---
title: Entity Index
node_type: index
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
entity_family_count: 7
---

## Overview

7 entity families enumerated from forensic inspection of GAUGE source artifacts.

**Full specification:** `docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/evidence_vault_v2_architecture.md`

## Entity Families

| family | count | canonical source | ZONE-1 (GAUGE) | ZONE-2 (LENS) |
|--------|-------|-----------------|----------------|----------------|
| Structural Units (CEUs) | 30 | coverage_state.json; admissibility_log.json | Count + admissibility status | Count only — "30 core structural elements" |
| Topology Nodes | 148 canonical / 45 binding | canonical_topology.json; binding_envelope.json | Full node explorer with IDs, names, depths | Domain names only (17 domain names) |
| Signals | 5 | signal_registry.json (docs/pios/41.4/) | Full: title, statement, confidence, rationale, source_refs | title + business_impact + risk + confidence class |
| Business Concepts | 19 active + 3 deferred | concepts.json | Full predicate evaluation detail | Resolved phrase output only |
| Reconstruction Axes | 4 | axis_results in gauge_state.json | Full axis names and pass/fail | CONDITIONAL — CTO audience: axis names + verdicts |
| Score Components | 3 | score.components in gauge_state.json | Full: completion/coverage/reconstruction points | Narrative: "structural evidence contributes 60 points" |
| Dimensions | 6 (DIM-01..DIM-06) | gauge_state.json | Full: all 6 dimensions with values | CONDITIONAL: DIM-01/02/03 summary; DIM-04/05/06 contextual |

## Structural Units (30 CEUs)

- Admissible: 30
- Required: 30
- Coverage: 100.0%
- Source: `clients/blueedge/psee/runs/run_authoritative_recomputed_01/`
- Individual names: ZONE-0/3 only (technical artifact filenames)

## Topology Nodes

**Canonical (platform topology):**
- Domains: 17
- Capabilities: 42
- Components: 89
- Total: 148
- Overlaps: 0
- Source: `canonical_topology.json`

**Binding envelope (client-specific — BlueEdge):**
- Nodes: 45
- Edges: 62
- Signals: 5
- Overlaps: 2 (OVL-01, OVL-02)
- Unknown-space records: 3
- Source: `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json`

**Note:** These are different scopes — not contradictory data. Canonical = pure platform topology. Binding envelope = client-specific subset.

## Signals (5)

| signal_id | title | confidence | domain |
|-----------|-------|-----------|--------|
| SIG-001 | Sensor Bridge Throughput | STRONG | [from signal_registry.json] |
| SIG-002 | Seven Unknown Dimensions | STRONG | [from signal_registry.json] |
| SIG-003 | Dependency Load 68% | MODERATE | [from signal_registry.json] |
| SIG-004 | Structural Volatility | MODERATE | [from signal_registry.json] |
| SIG-005 | Coordination Pressure | WEAK | [from signal_registry.json] |

**Note — SIG-005:** WEAK confidence. Static component only — runtime validation not yet complete. LENS surface must include explicit confidence caveat.

## Business Concepts (19 active)

- Active: 19 (CONCEPT-01..CONCEPT-19 range; not all IDs consecutive)
- Deferred: 3 (CONCEPT-D01/D02/D03)
- Source: `app/gauge-product/lib/business-ontology/concepts.json`
- Evaluator: `app/gauge-product/lib/business-ontology/resolver.js`
- Phrase templates: `app/gauge-product/lib/business-ontology/phrases.json` (Version 1.2)

**Three-axis executive verdict:**
- STRUCTURE: CONCEPT-01 ∧ CONCEPT-03 ∧ CONCEPT-14
- COMPLEXITY: any of CONCEPT-08/09/16
- EXECUTION: CONCEPT-06 — **SEMANTIC GAP: predicate matches PHASE_1_ACTIVE only**

## Score Components (3)

| component | value | weight |
|-----------|-------|--------|
| completion_points | 0 | COMPLETION_WEIGHT = 40 |
| coverage_points | 35 | |
| reconstruction_points | 25 | |
| **canonical total** | **60** | |
| **projected total** | **100** | canonical + 40 |

## Dimensions (6)

| dimension | label | value (recomputed run) | ZONE-2 status |
|-----------|-------|----------------------|---------------|
| DIM-01 | Coverage | coverage_percent=100.0 | YES — summary |
| DIM-02 | Reconstruction | overall_result=PASS | YES — summary |
| DIM-03 | Escalation Clearance | CLEAR | YES — summary |
| DIM-04 | Unknown Space | total_count=0 (caveat) | CONDITIONAL — caveat required |
| DIM-05 | Intake State | COMPLETE | YES |
| DIM-06 | Heuristic Compliance | PASS | CONDITIONAL (CTO audience) |
