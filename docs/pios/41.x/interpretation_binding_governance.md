# Interpretation Binding — Governance Document
## PI.41X.INTERPRETATION-BINDING.01

**Layer:** 41.x — Semantic Authority  
**Contract:** PI.41X.INTERPRETATION-BINDING.01  
**Date:** 2026-04-25  
**Branch:** work/psee-runtime  
**Status:** ACTIVE

---

## 1. Purpose

The Interpretation Binding connects structural constructs found in 41.x projection outputs to their governed behavioral meaning in the global Interpretation Registry.

Its purpose is to answer the question: *which INT-XXX registry entry applies to this zone, signal, or condition — and what does that entry say in each of its three interpretation layers?*

The binding does not alter, enrich, or rewrite any projection output. It attaches meaning by reference.

---

## 2. Binding Model

The binding layer sits between:

| Source | Content |
|---|---|
| 41.x projection outputs | Structural truth: zone_id, zone_class, signal_id, condition_id, attribution, activation state |
| Interpretation Registry (INT-XXX) | Governed behavioral meaning: behavioral_meaning, system_expression, business_expression |

The binding file records:
- which structural construct is being bound (`source_ref`)
- which registry entry provides the interpretation (`interpretation_ref`)
- a verbatim copy of the three interpretation layers at binding time (`attached_interpretation`)
- a trace linking the registry source and the projection source artifact (`trace`)
- invariant constraint flags confirming nothing was computed, inferred, or introduced (`constraints`)

---

## 3. What This Binding Does NOT Do

- It does not modify projection artifacts. Projection artifacts remain the authoritative structural source.
- It does not introduce new facts. `attached_interpretation` content is copied verbatim from the registry.
- It does not select a focus domain. `focus_domain_selected` status from the projection manifest is not altered.
- It does not rank or prioritize zones. No binding has higher or lower precedence than another.
- It does not assign severity. No severity label, urgency flag, or risk designation is present.
- It does not produce recommendations. No action directive or advisory is introduced.
- It does not infer future behavior. All content is limited to structural facts observable in the current run.
- It does not substitute for the registry. Consumers must treat the registry as the authoritative source; `attached_interpretation` content is a convenience copy for traceability.

---

## 4. Binding Types

### 4.1 Zone class bindings (BIND-001..003)

Each active pressure zone in the projection has a primary zone class binding. These bindings attach the INT-XXX entry for the zone's `zone_class` field (COMPOUND_ZONE → INT-007 for all three zones in this run).

### 4.2 Embedded pair rule bindings (BIND-004..012)

Each active zone's `embedded_pair_rules` list records which subordinate pressure class combinations are present within the compound zone. Each embedded pair rule class is bound to its corresponding INT-XXX entry. These bindings have `binding_context: "embedded_pair_rule"` to distinguish them from primary zone class bindings.

### 4.3 Signal bindings (BIND-013..016)

Each active signal in the projection (`PSIG-001`, `PSIG-002`, `PSIG-004`, `PSIG-006`) is bound to its corresponding signal INT-XXX entry. Signal bindings reference `signal_projection.json` as the source artifact.

### 4.4 Condition bindings (BIND-017..020)

Each active condition in the projection (`COND-PSIG-001-01`, `COND-PSIG-002-01`, `COND-PSIG-004-01`, `COND-PSIG-006-01`) is bound to its corresponding condition INT-XXX entry.

---

## 5. Binding Scope

| Binding range | Scope | Reusability |
|---|---|---|
| BIND-001..012 (zone bindings) | Run-instance-specific — zone_id references are specific to run_01_oss_fastapi | Zone_class and zone_class-only fields are global; zone_id is run-specific |
| BIND-013..016 (signal bindings) | Global — PSIG-NNN identifiers are stable across clients and runs | Fully reusable |
| BIND-017..020 (condition bindings) | Partially run-specific — condition_id suffix (-01) is run-specific; condition type (COND-PSIG-NNN) is global | Condition type is reusable; condition_id instance is run-specific |

---

## 6. Relation to the Interpretation Registry

The Interpretation Registry (INT-XXX entries) is the authoritative source of behavioral meaning. The binding file does not supersede or extend the registry.

If a registry entry is updated (via authorized contract and INT-XXX update process), the binding file must be updated to reference the new content. Until updated, `attached_interpretation` reflects the registry state at binding time.

The `interpretation_ref.registry_version` field records the registry version at the time of binding. Version drift — where the registry is updated but the binding is not — is detectable by comparing this value against the current registry `registry_version`.

---

## 7. Consumption Contract

### What consumers may do

- Read `attached_interpretation.behavioral_meaning` to present structural meaning in diagnostic contexts
- Read `attached_interpretation.system_expression` to present architectural descriptions in technical UI
- Read `attached_interpretation.business_expression` to present plain-language structural observations in reports or stakeholder surfaces
- Follow `trace.registry_path` to verify binding content against the authoritative source
- Use `binding_context` to distinguish primary zone class bindings from embedded pair rule bindings

### What consumers must not do

- Add severity, priority, or recommendations to `attached_interpretation` content at consumption time
- Treat a binding's presence as implying focus domain selection
- Substitute `attached_interpretation` for the registry entry if registry precision is required
- Suppress or filter bindings to create a selectively favorable interpretation

---

## 8. Extension Rules

To add a new binding:
1. Assign the next BIND-NNN ID (monotonically, never reused)
2. Confirm the referenced INT-XXX entry exists in the registry
3. Copy `attached_interpretation` verbatim from the registry entry
4. Set all five `constraints` fields to false
5. Set `trace.evidence_status` to `"registry_bound"`
6. Increment `total_bindings`

To update a binding:
- Allowed only if the referenced INT-XXX entry has been updated in the registry
- Update `interpretation_ref.registry_version` and `attached_interpretation` to match the new registry state
- Record in governance trace

To deprecate a binding:
- Do not delete. Add `"deprecated": true` and `"reason"` field to the binding entry
- Record in governance trace

---

## 9. Version 1.0 Coverage

| Binding type | Count | Coverage |
|---|---|---|
| Zone class (COMPOUND_ZONE) | 3 | PZ-001, PZ-002, PZ-003 |
| Embedded pair rule — COUPLING_ZONE | 3 | PZ-001, PZ-002, PZ-003 |
| Embedded pair rule — PROPAGATION_ZONE | 3 | PZ-001, PZ-002, PZ-003 |
| Embedded pair rule — RESPONSIBILITY_ZONE | 3 | PZ-001, PZ-002, PZ-003 |
| Signal | 4 | PSIG-001, PSIG-002, PSIG-004, PSIG-006 |
| Condition | 4 | COND-PSIG-001-01, COND-PSIG-002-01, COND-PSIG-004-01, COND-PSIG-006-01 |
| **Total** | **20** | |

Not covered in version 1.0:
- Zone classes not active in run_01_oss_fastapi (SURFACE_EXPOSURE_ZONE, COORDINATION_ZONE)
- Signals not activated in run_01_oss_fastapi (PSIG-003, PSIG-005)
- Composite entry binding (INT-020 is a placeholder; no aggregation logic defined)
- Focus domain interpretation (requires 75.x focus contract)
