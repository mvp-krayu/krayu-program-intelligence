# CE.4 — Dependency Propagation Rules

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** GOVERNANCE RULES
**Date:** 2026-04-03
**Evidence base:** `signal_computability_governance.md`, `signal_emission_contract_specification.md`, `pios/core/v0.1/engine/compute_signals.py`
**Authority:** CE.4

---

## 1. PURPOSE

This document defines the governed rules by which upstream signal state propagates to
downstream (derived) signals. It establishes how BLOCKED, PARTIAL, and COMPLETE upstream
states affect the emission state and payload of signals that depend on them.

These rules apply exclusively within the 40.5 signal computation layer. They govern
signal-to-signal dependencies only. Variable-to-signal dependencies are governed by
the computability model.

---

## 2. SCOPE OF DEPENDENCIES

The current PiOS v0.1 signal set contains two classes of signals:

**Primitive signals (SIG-001 through SIG-006):**
Compute directly from telemetry variables. No upstream signal dependencies.
Not subject to dependency propagation rules.

**Derived signals (SIG-007, SIG-008):**
Compute from outputs of primitive signals. Subject to dependency propagation rules.

| Derived signal | Upstream dependencies |
|---|---|
| SIG-007 (ESI) | SIG-002 (COMPLETE), SIG-005 (PARTIAL), SIG-006 (BLOCKED) |
| SIG-008 (RAG) | SIG-001 (PARTIAL), SIG-003 (BLOCKED), SIG-004 (COMPLETE) |

---

## 3. PROPAGATION RULES

### Rule DP-001 — BLOCKED upstream → component null, failure class F-3

**Rule:** If an upstream signal carries `state=BLOCKED`, any output component in the
derived signal that depends on that upstream signal MUST be emitted as null.
The derived signal's `partiality_reasons` for that component MUST include:
```
{
  "failure_class": "F-3",
  "upstream_signal": "<blocked_signal_id>",
  "cause": "<propagated from BLOCKED upstream signal>"
}
```

**Application:**
- SIG-007: SIG-006 is BLOCKED → `sig_006_stability_component` = null, failure_class=F-3
- SIG-008: SIG-003 is BLOCKED → `sig_003_change_concentration_component` = null, failure_class=F-3

**Derived signal state consequence:** If any component is null due to DP-001, the derived
signal emits PARTIAL (not BLOCKED), provided at least one output component is resolved.
If ALL components are null (all upstream signals BLOCKED), the derived signal emits BLOCKED.

---

### Rule DP-002 — PARTIAL upstream → component null for null upstream fields, failure class F-4

**Rule:** If an upstream signal carries `state=PARTIAL`, the derived signal MUST:
- Use the resolved upstream fields as normally specified
- Emit null for any derived component that depends on a null upstream output field
- Record `partiality_reasons` for each null component with failure_class=F-4

```
{
  "failure_class": "F-4",
  "upstream_signal": "<partial_signal_id>",
  "upstream_field": "<null_field_in_upstream_output>",
  "cause": "<null upstream field propagated>"
}
```

**Application:**
- SIG-007: SIG-005 is PARTIAL (`completion_factor=null`) → `sig_005_completion_factor_component` = null, failure_class=F-4
- SIG-008: SIG-001 is PARTIAL (`runtime_component=null`) — SIG-008 uses only `static_structural_ratio` from SIG-001.
  The null `runtime_component` of SIG-001 is NOT consumed by SIG-008 → no F-4 propagation for this case.

**Derived signal state consequence:** Same as DP-001 — null component → PARTIAL unless all
components are null.

---

### Rule DP-003 — COMPLETE upstream → no propagation

**Rule:** If an upstream signal carries `state=COMPLETE`, all its output fields are
resolved. The derived signal uses them normally. No null propagation. No partiality_reason
entry required for components derived from a COMPLETE upstream signal.

**Application:**
- SIG-007: SIG-002 is COMPLETE → `sig_002_dependency_load_component` = 0.773 (resolved, no entry needed)
- SIG-008: SIG-004 is COMPLETE → all four density components resolved (no entry needed)

---

### Rule DP-004 — All upstream COMPLETE → derived signal COMPLETE

**Rule:** A derived signal emits state=COMPLETE if and only if all upstream signals are
COMPLETE and all upstream output fields consumed by the derived signal are resolved.
No `partiality_reasons` field is emitted. The `traceability` field (where applicable) is emitted.

**Application:** No current derived signal satisfies this condition. SIG-007 requires
SIG-006 (BLOCKED); SIG-008 requires SIG-003 (BLOCKED). Neither can be COMPLETE.

---

### Rule DP-005 — All upstream BLOCKED → derived signal BLOCKED

**Rule:** A derived signal emits state=BLOCKED if ALL of the upstream signals it depends
on are BLOCKED and the derived signal cannot produce any resolved output component.

In this case, the derived signal MUST carry:
- `state=BLOCKED`
- `output=null`
- `blocking_class`: "F-3" (upstream blockage)
- `blocking_inputs`: array of upstream signal IDs
- `blocking_reason`: "All upstream dependencies are BLOCKED; no component resolvable"

**Application:** Not currently triggered for SIG-007 or SIG-008 because each has at
least one COMPLETE upstream dependency. If SIG-002 became BLOCKED, SIG-007 might
satisfy this condition.

---

### Rule DP-006 — Propagation depth limit

**Rule:** Dependency propagation is evaluated one level deep. A derived signal propagates
the state of its immediate upstream dependencies only. It does not propagate the upstream
signal's upstream dependencies transitively.

**Rationale:** The current PiOS v0.1 signal set has a maximum derived depth of 1 (primitive
→ derived). There are no derived-of-derived signals. This rule preserves that bound as a
governance constraint, not an incidental implementation fact.

**If derived-of-derived signals are introduced:** This rule must be revisited. Each level
of derivation requires explicit propagation rule evaluation. Transitive propagation without
explicit intermediate signal state inspection is prohibited.

---

### Rule DP-007 — Downstream consumption boundary

**Rule:** Dependency propagation rules govern signal-to-signal state within 40.5 only.
They do not define how 40.6 consumes PARTIAL or BLOCKED signals. 40.6 behavior is
exclusively governed by CE.2.

The 40.5 → 40.6 handoff delivers the emission packet as defined in
`signal_emission_contract_specification.md`. 40.6 consumes it via CE.2 binding rules
without knowledge of why a field is null.

---

## 4. PROPAGATION OUTCOME MATRIX

For SIG-007 and SIG-008 under current signal states:

### SIG-007 (ESI)

| Component | Upstream | Upstream state | Propagation rule | Component value |
|---|---|---|---|---|
| sig_002_dependency_load_component | SIG-002 | COMPLETE | DP-003 | 0.773 (resolved) |
| sig_005_completion_factor_component | SIG-005 | PARTIAL (completion_factor=null) | DP-002 | null (F-4) |
| sig_006_stability_component | SIG-006 | BLOCKED | DP-001 | null (F-3) |

SIG-007 emits: PARTIAL (1 resolved, 2 null)

### SIG-008 (RAG)

| Component | Upstream | Upstream state | Propagation rule | Component value |
|---|---|---|---|---|
| sig_001_coordination_pressure_component | SIG-001 | PARTIAL (static_structural_ratio=0.875) | DP-003 for resolved field | 0.875 (resolved) |
| sig_004_total_edge_density | SIG-004 | COMPLETE | DP-003 | 1.273 (resolved) |
| sig_004_containment_density | SIG-004 | COMPLETE | DP-003 | 0.545 (resolved) |
| sig_004_responsibility_density | SIG-004 | COMPLETE | DP-003 | 0.364 (resolved) |
| sig_004_module_density | SIG-004 | COMPLETE | DP-003 | 0.455 (resolved) |
| sig_003_change_concentration_component | SIG-003 | BLOCKED | DP-001 | null (F-3) |

SIG-008 emits: PARTIAL (5 resolved, 1 null)

---

## 5. PROPAGATION AND DOWNSTREAM 40.6 CONSISTENCY

CE.2 DEC-013 (`BR-NULL-SIGNAL-BLOCKED`) governs 40.6 handling of null signal outputs.
The propagation rules defined here do not conflict with CE.2 — they govern the 40.5
side of the same interface.

The specific downstream consequence of these propagation rules:
- `sig_006_stability_component` null in SIG-007 → 40.6 binding rule that references
  SIG-007 via this field applies `BR-NULL-SIGNAL-BLOCKED` → tier=BLOCKED
- `sig_003_change_concentration_component` null in SIG-008 → same treatment

This is consistent with the current CE.2-R01-MIX activation results (COND-005 and COND-006
in state BLOCKED, INTEL-005 and INTEL-006 in state `blocked`).

---

## 6. CONCLUSION

Seven propagation rules are defined (DP-001 through DP-007). The rules establish that:
- BLOCKED upstream propagates as F-3 (component null) to derived signals
- PARTIAL upstream propagates null fields as F-4 (component null) to derived signals
- COMPLETE upstream propagates resolved values with no null consequence
- A derived signal's emission state is PARTIAL (not BLOCKED) when at least one component is resolved
- Propagation is one level deep under current PiOS v0.1 architecture
- 40.6 behavior is not defined here — CE.2 governs the downstream side of the same null/resolved boundary
