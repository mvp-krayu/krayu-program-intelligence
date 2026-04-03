# EX.1A — Static Dependency Isolation Report

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** STATIC DEPENDENCY ISOLATION REPORT
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document identifies every runtime surface that reads from static or pre-computed
L3 artifacts (as opposed to live engine output), maps the exact bypass path, and
classifies each surface against the EX.1A binding remediation classification frame
(BR-001..BR-008).

---

## 2. ADAPTER CHAIN TRACE

The runtime adapter chain is: `pages/api/execlens.js` → Python adapters via `execFile`.

### Surface S-01 — Main Query Adapter (42.4 chain)

**Files:** `scripts/pios/42.4/execlens_adapter.py` → `scripts/pios/42.2/execlens_nlp_bridge.py`
→ `scripts/pios/42.1/run_execlens_query.py`

**Static reads (via 42.1):**
- `docs/pios/41.4/signal_registry.json` — L3 signal registry
- `docs/pios/41.5/query_signal_map.json` — L3 query-to-signal map
- `docs/pios/41.4/evidence_mapping_index.json` — L3 evidence map
- `docs/pios/41.5/query_response_templates.md` — L3 narrative templates

**Classification:** BR-001 (static artifact dependency as truth source)
**Bypass path:** L3 semantic content (query narratives) — not CE.4/CE.5/CE.2 governed states
**EX.1A action:** NO CHANGE REQUIRED — S-01 operates at L3 scope. Its static reads are
correct per the reference_boundary_contract: L3 reads from L2 outputs (41.x static files).
L3 semantic content is not in scope for live engine binding.

---

### Surface S-02 — Overview Metrics Adapter (42.6)

**File:** `scripts/pios/42.6/execlens_overview_adapter.py`

**Static reads:**
- `docs/pios/41.4/signal_registry.json` — extracts metric numbers from signal statement text
  via regex pattern matching

**Classification:** BR-001 (static artifact dependency as truth source)
**Bypass path:** Metrics derived from narrative text, not from CE.4 emission states
**EX.1A action:** NO CHANGE REQUIRED — 42.6 provides L3 semantic overview metrics. The
signal registry text is its correct source. CE.4 governed states are a separate surface
(exposed via EX.1A live adapter, not a replacement of 42.6).

---

### Surface S-03 — Topology Adapter (42.7)

**File:** `scripts/pios/42.7/execlens_topology_adapter.py`

**Static reads:**
- `docs/pios/41.4/signal_registry.json` — derives topology via co-occurrence computation
  on `component_ids` fields

**Classification:** BR-001 (static artifact dependency as truth source)
**Bypass path:** Structural topology derived from L3 component mapping, not from CE.2 conditions
**EX.1A action:** NO CHANGE REQUIRED — Topology is an L3 structural visualization. The 41.4
signal registry is its correct source. This is not a CE.2 propagation surface.

---

### Surface S-04 — WOW Chain Adapter (42.23)

**File:** `scripts/pios/42.23/execlens_wowchain_adapter.py`

**Static reads:**
- `docs/pios/42.22/sample_runtime_output.json` — WOW chain binding data

**Classification:** BR-001 (static artifact dependency as truth source) + BD-002 defect
**Bypass path:** `signal_state: "computed"` in 42.22 source is outside CE.4 vocabulary;
42.23 passes it through without validation
**EX.1A action:** OUT OF SCOPE — BD-002 requires GC-003 (data change) + EX.3 (adapter
vocabulary validation). 42.23 is architecturally separate from the live engine path.

---

### Surface S-05 — ENL Status, ENL Chain, Persona Adapters (42.13, 42.15, 42.16)

**Files:** MISSING (adapter scripts do not exist on filesystem)

**Classification:** BR-003 (required adapter missing)
**Bypass path:** Fail-closed on 400 error — compliant behavior but feature absent
**EX.1A action:** OUT OF SCOPE — BD-005 requires 3 separate EX.3 stream instances,
each requiring a GC-001 governance contract before implementation.

---

### Surface S-06 — Live Engine Path (ABSENT before EX.1A)

**Classification:** BR-002 (live engine invocation path absent)
**Bypass path:** No path from any 42.x adapter to `pios/core/v0.1/engine/`
**EX.1A action:** REMEDIATED — `scripts/pios/EX.1A/pios_live_adapter.py` + `?pios_live=true`
route create the minimum conformant live binding path.

---

## 3. BYPASS MAP SUMMARY

| Surface | Static Source | CE.4 Absent | CE.5 Absent | CE.2 Absent | EX.1A Action |
|---|---|---|---|---|---|
| S-01 (42.4 chain) | 41.4/41.5 | YES | YES | YES | No change (L3 scope) |
| S-02 (42.6 overview) | 41.4 | YES | YES | YES | No change (L3 scope) |
| S-03 (42.7 topology) | 41.4 | YES | YES | YES | No change (L3 scope) |
| S-04 (42.23 WOW) | 42.22 | YES + BD-002 | YES | YES | GC-003 + EX.3 |
| S-05 (missing adapters) | N/A | N/A | N/A | N/A | EX.3 ×3 |
| S-06 (live engine) | NONE (absent) | YES | YES | YES | REMEDIATED (EX.1A) |

**EX.1A remediation scope:** S-06 only. S-01 through S-03 are architecturally correct L3
surfaces. S-04 and S-05 require subsequent streams.

---

## 4. ISOLATION CONCLUSION

The "static dependency" characterization in BD-001 is architecturally nuanced:

- S-01, S-02, S-03 are NOT defects — they are correct L3 reads from L2 static outputs.
  The defect is the **absence** of a live engine path, not the presence of 41.x reads.
- The sole remediation target in EX.1A scope is the absent live engine binding surface (S-06).

This distinction is preserved in the live binding design (see `live_binding_remediation_map.md`).
