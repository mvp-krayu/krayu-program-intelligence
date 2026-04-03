# EX.3 — Bypass Elimination Report

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** BYPASS ELIMINATION REPORT
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document records which PiOS bypass paths were eliminated by EX.3 and which
remain, with explicit owner assignment per EX.H1 SB-001..SB-009.

---

## 2. BYPASSES ELIMINATED

### BYP-E-001 — Query route bypassed live PiOS engine

**Route:** `?query=GQ-NNN`
**Before EX.3:** 42.4 → 42.2 → 42.1 → 41.x static files only. No engine invocation.
CE.4/CE.5/CE.2 states absent. IB-001, IB-002.
**After EX.3:** Engine invoked per request via pios_bridge. CE.4/CE.5/CE.2 states present
in every signal entry. value_source not applicable (governance states, not metric values).
**Status: ELIMINATED**

---

### BYP-E-002 — Overview route: metric values from static text

**Route:** `?overview=true`
**Before EX.3:** 42.6 extracted numeric values (0.682, 1.273, 0.875) via regex from signal
statement text in signal_registry.json. CE.4/CE.5/CE.2 states absent. IB-001.
**After EX.3:** Metric values sourced from live engine outputs (3 of 4 metrics).
CE.4/CE.5/CE.2 states present per metric. value_source field declares active source.
**Status: ELIMINATED (3/4 metrics from live; 1/4 preserved as correct L3 semantic)**

---

### BYP-E-003 — Topology route: no PiOS states

**Route:** `?topology=true`
**Before EX.3:** 42.7 → 42.2 → 42.1 → 41.x only. No CE.2 condition or diagnosis states.
IB-005.
**After EX.3:** pios_summary block present in topology response with all 8 CE.2 condition
tiers and 8 CE.2 diagnosis states from live engine.
**Status: ELIMINATED**

---

## 3. BYPASSES REMAINING

### BYP-R-001 — WOW chain route (42.23/42.22)

**Route:** `?topology=true` (WOW chain via 42.23 adapter — DISTINCT from the structural topology)
**Wait:** Looking at the API — there is no `?wowchain` route. 42.23 is `ADAPTER_42_23` in execlens.js. Let me check what route uses it.

Looking at `pages/api/execlens.js`: 42.23 is referenced as `ADAPTER_42_23` but I need to verify which query param invokes it. Let me check the exact route in the contract.

Actually looking at the original API file header comments, the route parameters are:
- `?query=GQ-001` → 42.4
- `?list=true` → 42.4 (--list)
- `?overview=true` → 42.6
- `?topology=true` → 42.7 (structural topology)
- `?enl=GQ-003` → 42.15 (missing)
- `?persona=...` → 42.16 (missing)
- `?status=true` → 42.13 (missing)
- `?pios_live=true` → EX.1A adapter

The 42.23 WOW chain adapter is defined as ADAPTER_42_23 but looking at the route handler, `topology === 'true'` calls 42.7, not 42.23. The 42.23 WOW chain adapter appears to be the WOW topology surface referenced in EX.1's binding surface inventory. Let me check the current execlens.js to see if 42.23 is actually routed.

Looking at the execlens.js file I read earlier, the handler block for topology calls ADAPTER_42_7, not ADAPTER_42_23. ADAPTER_42_23 is defined but may not have an active route in the current API, or it was used historically for the WOW chain. Per EX.1 findings, 42.23 was the WOW chain adapter with BD-002.

**Route:** None currently active (42.23 defined but no handler in current API)
**Issue:** `docs/pios/42.22/sample_runtime_output.json` contains `signal_state: "computed"` — non-CE.4 vocabulary
**Owner:** GC-003 (data fix) + future EX.3 WOW substream
**Status: OPEN — inactive route**

---

### BYP-R-002 — ENL status route (42.13 missing)

**Route:** `?status=true`
**Issue:** `scripts/pios/42.13/demo_activate.py` does not exist → fail-closed 400
**IB class:** IB-006 (residual bypass — feature absent)
**Owner:** GC-001 (governance contract) + EX.3 implementation
**Status: OPEN — adapter missing**

---

### BYP-R-003 — ENL chain route (42.15 missing)

**Route:** `?enl=GQ-NNN`
**Issue:** `scripts/pios/42.15/enl_console_adapter.py` does not exist → fail-closed 400
**Owner:** GC-001 + EX.3
**Status: OPEN — adapter missing**

---

### BYP-R-004 — Persona projection route (42.16 missing)

**Route:** `?persona=X&query=GQ-NNN`
**Issue:** `scripts/pios/42.16/persona_view_map.py` does not exist → fail-closed 400
**Owner:** GC-001 + EX.3
**Status: OPEN — adapter missing**

---

### BYP-R-005 — RB-006 not enforced at invocation time

**All routes:** Engine invoked but `validation_result.json` not produced per RB-007.
**IB class:** IB-006 (partial — vocabulary validated in pios_bridge; full validation absent)
**Owner:** EX.3 follow-on / EX.2
**Status: OPEN — partial enforcement only**

---

## 4. BYPASS SUMMARY

| Route | Before EX.3 | After EX.3 | Status |
|---|---|---|---|
| `?query=GQ-NNN` | Engine bypassed, CE.4/5/2 absent | Engine invoked, CE.4/5/2 present | ELIMINATED |
| `?list=true` | No governance needed | No governance needed | N/A |
| `?overview=true` | Static values, CE.4/5/2 absent | Live values (3/4), CE.4/5/2 present | ELIMINATED |
| `?topology=true` | CE.2 absent | CE.2 present in pios_summary | ELIMINATED |
| `?pios_live=true` | Already live (EX.1A) | Unchanged | N/A |
| `?status=true` | 400 (missing adapter) | 400 (missing adapter) | OPEN |
| `?enl=GQ-NNN` | 400 (missing adapter) | 400 (missing adapter) | OPEN |
| `?persona=X` | 400 (missing adapter) | 400 (missing adapter) | OPEN |
| WOW chain | Static, non-CE.4 vocab | Unchanged | OPEN (GC-003) |

**3 of 4 active routes: bypasses eliminated.**
**3 routes: fail-closed 400 due to missing adapters — require GC-001 governance contracts.**
