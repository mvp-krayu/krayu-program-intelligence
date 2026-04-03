# EX.1A — Remediation Boundary Statement

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** REMEDIATION BOUNDARY STATEMENT
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document formally declares the EX.1A scope boundary, the EX.2 and EX.3 deferrals,
and the binding remediation classification (BR-001..BR-008) outcome for all surfaces
identified during this stream.

---

## 2. EX.1A SCOPE STATEMENT

EX.1A is a **narrow corrective stream** within the EX.1 authority class. Its mandate is:

> Establish the minimum live engine binding path: one new adapter, one new API route.
> Do not redesign existing adapter contracts. Do not expand the demo surface.

This mandate was executed exactly as specified. No existing adapter was modified.
No existing route was changed. No adapter contract was redefined.

---

## 3. WHAT EX.1A DOES

| Action | Status |
|---|---|
| Create `scripts/pios/EX.1A/pios_live_adapter.py` | DONE |
| Add `ADAPTER_EX1A` constant to `pages/api/execlens.js` | DONE |
| Add `?pios_live=true` handler block to `pages/api/execlens.js` | DONE |
| Document 5 closed gaps (G-001..G-005) | DONE |
| Verify live engine produces PASS-matching EX.1 baseline | DONE |
| Produce 7 governance artifacts under `docs/pios/EX.1A/` | DONE |

---

## 4. WHAT EX.1A DOES NOT DO (EX.2/EX.3 DEFERRALS)

### Deferred to EX.2 (Debug/Trace Interface)

EX.2 is a read-only debug/trace interface stream. EX.1A does not implement:
- Any debug endpoint for inspecting internal engine run artifacts
- Any trace surface for live run introspection
- Any mechanism to expose individual run archive files via the API

These are EX.2 responsibilities by stream type definition (EX.H1_STREAM_DEFINITION.md).

### Deferred to EX.3 (System Bridge)

EX.3 is the integration stream for connecting live engine outputs into existing adapter
surfaces. EX.1A does not implement:

1. **Live state integration into 42.4 query surface** (G-007): Would require modifying
   the 42.4 adapter to join CE.4 signal states from live engine output with L3 query
   narratives. This is an adapter contract modification — EX.3 scope.

2. **Live state integration into 42.6 overview surface** (G-008): Would require modifying
   the overview adapter to source metrics from CE.4 states rather than regex extraction.
   This is an adapter contract modification — EX.3 scope.

3. **Live state integration into 42.7 topology surface** (G-009): Would require augmenting
   topology records with CE.2 condition tiers. This is an adapter contract modification
   — EX.3 scope.

4. **WOW surface vocabulary correction** (G-006): Requires GC-003 data change to update
   `docs/pios/42.22/sample_runtime_output.json`, then EX.3 adapter vocabulary validation.

5. **Missing adapter implementation** (G-010, G-011, G-012): 42.13, 42.15, 42.16 each
   require a GC-001 governance contract defining the feature before any GC-002 implementation.

6. **RB-006 full enforcement** (G-013): Running the EX.1 verifier within the API
   invocation path requires EX.3 integration work.

---

## 5. BR-001..BR-008 CLASSIFICATION OUTCOME

| Class | Description | Status |
|---|---|---|
| BR-001 | Static artifact dependency as truth source | PRESERVED for L3 surfaces (correct); NEW live surface adds engine path |
| BR-002 | Live engine invocation path absent | REMEDIATED — engine invoked per `?pios_live=true` request |
| BR-003 | Required adapter missing | UNCHANGED — 42.13, 42.15, 42.16 remain missing (EX.3) |
| BR-004 | CE.5 traceability surface missing in executable path | REMEDIATED — records in live adapter output |
| BR-005 | CE.2 propagation surface missing in executable path | REMEDIATED — condition + diagnosis states in live adapter output |
| BR-006 | Runtime bypasses governed execution after remediation | PARTIAL — existing surfaces (42.4/42.6/42.7/42.23) still bypass; `?pios_live=true` is the governed path |
| BR-007 | Fallback/synthetic substitution introduced | NOT TRIGGERED — no synthetic data, no fallback values introduced |
| BR-008 | Scope pressure toward EX.2 or EX.3 | BOUNDARY HELD — EX.2/EX.3 work explicitly deferred (this document) |

---

## 6. CERTIFICATION INTEGRITY ASSESSMENT

EX.1A makes GC-002 changes (new engine path). Per CE.11 Validation Trigger Model:
- GC-002 changes trigger VS-CE10C (re-run of EX.1-class verification)
- The live adapter invokes the certified engine without modification
- Engine commit `ed95c81` (EXECUTABLE-PROVEN baseline) is unchanged
- New run (`EX1A_verification_20260403`) confirms no regression

**Certification state remains: EXECUTABLE-PROVEN**

No governance changes, no engine changes, no data changes. The PiOS v0.4 certification
is unaffected by the additive EX.1A binding surface.

---

## 7. EX.3 STREAM READINESS

EX.3 (System Bridge) can proceed on all 8 remaining gaps (G-006..G-013).
Priority order per `adapter_gap_register.md`:

1. G-006 — WOW vocabulary fix (GC-003 first)
2. G-007 — Query surface live state integration
3. G-008 — Overview surface live state integration
4. G-009 — Topology surface condition tier augmentation
5. G-010..G-012 — Missing adapters (GC-001 governance contracts required first)
6. G-013 — RB-006 full enforcement in API path
