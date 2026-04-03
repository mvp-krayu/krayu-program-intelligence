# EX.1A — Adapter Gap Register

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** ADAPTER GAP REGISTER
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document records the remaining adapter gaps after EX.1A remediation — gaps that
are within runtime scope but not remediable within EX.1A authority boundaries.

---

## 2. GAPS CLOSED BY EX.1A

| Gap | Description | Component | Status |
|---|---|---|---|
| G-001 | No live engine invocation path | `pios_live_adapter.py` + `?pios_live=true` | CLOSED |
| G-002 | CE.5 consumption records absent from API | Exposed via G-001 | CLOSED |
| G-003 | CE.5 traceability records absent from API | Exposed via G-001 | CLOSED |
| G-004 | CE.2 condition_coverage_state absent from API | Exposed via G-001 | CLOSED |
| G-005 | CE.2 diagnosis_activation_state absent from API | Exposed via G-001 | CLOSED |

---

## 3. GAPS REMAINING (NOT IN EX.1A SCOPE)

### G-006 — Non-CE.4 signal_state in WOW surface

**Adapter:** `scripts/pios/42.23/execlens_wowchain_adapter.py`
**Gap:** `signal_state: "computed"` in `docs/pios/42.22/sample_runtime_output.json` is
outside CE.4 vocabulary. 42.23 passes this through without validation.
**EX.1A status:** OUT OF SCOPE — requires GC-003 (update 42.22 source data) + EX.3
(adapter vocabulary validation)
**Owner stream:** GC-003 → EX.3
**BR class:** BR-001 (static artifact dependency), BD-002

---

### G-007 — CE.4/CE.5/CE.2 states absent from query surface (42.4 chain)

**Adapter:** `scripts/pios/42.4/execlens_adapter.py` → `42.2` → `42.1`
**Gap:** The query response surfaces L3 semantic narrative content only. CE.4 emission
state, CE.5 consumption state, and CE.2 propagation state for the governing signal of
the queried topic are absent from the query response.
**EX.1A status:** OUT OF SCOPE — integrating live engine states into the query response
requires redesigning the query adapter contract (EX.3 scope, SB-007 requirement)
**Owner stream:** EX.3
**BR class:** BR-001

---

### G-008 — CE.4/CE.5/CE.2 states absent from overview surface (42.6)

**Adapter:** `scripts/pios/42.6/execlens_overview_adapter.py`
**Gap:** The overview surface provides regex-extracted L3 metrics. CE.4 emission states
per signal are absent from the overview response.
**EX.1A status:** OUT OF SCOPE — integrating live states into 42.6 requires adapter
redesign (EX.3 scope)
**Owner stream:** EX.3
**BR class:** BR-001

---

### G-009 — CE.2 propagation states absent from topology surface (42.7)

**Adapter:** `scripts/pios/42.7/execlens_topology_adapter.py`
**Gap:** The topology surface provides component co-occurrence structure. CE.2
condition_coverage_state per component is absent from topology records.
**EX.1A status:** OUT OF SCOPE — augmenting topology with condition tiers requires
adapter redesign (EX.3 scope)
**Owner stream:** EX.3
**BR class:** BR-001

---

### G-010 — Missing adapters: demo_activate.py (42.13)

**Path:** `scripts/pios/42.13/demo_activate.py`
**Gap:** Adapter does not exist. `?status=true` route fails 400.
**EX.1A status:** OUT OF SCOPE — requires GC-001 governance contract defining "semantic
path status" in the governed model, then GC-002 implementation
**Owner stream:** EX.3 (with GC-001 prerequisite)
**BR class:** BR-003

---

### G-011 — Missing adapters: enl_console_adapter.py (42.15)

**Path:** `scripts/pios/42.15/enl_console_adapter.py`
**Gap:** Adapter does not exist. `?enl=GQ-NNN` route fails 400.
**EX.1A status:** OUT OF SCOPE — requires ENL chain governance contract (GC-001)
**Owner stream:** EX.3 (with GC-001 prerequisite)
**BR class:** BR-003

---

### G-012 — Missing adapters: persona_view_map.py (42.16)

**Path:** `scripts/pios/42.16/persona_view_map.py`
**Gap:** Adapter does not exist. `?persona=X&query=GQ-NNN` route fails 400.
**EX.1A status:** OUT OF SCOPE — requires persona view map governance contract (GC-001)
**Owner stream:** EX.3 (with GC-001 prerequisite)
**BR class:** BR-003

---

### G-013 — RB-006 runtime invocation validation not enforced

**Gap:** EX.H1 RB-006 requires programmatic compliance validation after every engine
invocation in a compliance-critical path. The EX.1A adapter invokes the engine and
validates vocabularies in-flight, but does not invoke the EX.1 verifier
(`scripts/pios/EX.1/runtime_binding_verifier.py`) to produce a `validation_result.json`
per RB-007.
**EX.1A status:** DEFERRED — full RB-006 enforcement integrated into the API path is
EX.3 scope. EX.1A in-flight vocabulary validation satisfies the spirit of RB-006 for
the live adapter's own outputs.
**Owner stream:** EX.3
**BR class:** BR-006 (runtime still bypasses full governed execution verification)

---

## 4. GAP REGISTER SUMMARY

| Gap | Description | Owner | Priority |
|---|---|---|---|
| G-001..G-005 | Live engine path + CE.4/CE.5/CE.2 exposure | CLOSED (EX.1A) | — |
| G-006 | WOW surface vocabulary mismatch | GC-003 → EX.3 | 1 |
| G-007 | Query surface: no CE.4/CE.5/CE.2 states | EX.3 | 2 |
| G-008 | Overview surface: no CE.4 states | EX.3 | 3 |
| G-009 | Topology surface: no CE.2 tiers | EX.3 | 4 |
| G-010 | 42.13 demo_activate missing | EX.3 + GC-001 | 5 |
| G-011 | 42.15 enl_console missing | EX.3 + GC-001 | 6 |
| G-012 | 42.16 persona_view missing | EX.3 + GC-001 | 7 |
| G-013 | RB-006 not enforced at runtime | EX.3 | 8 |
