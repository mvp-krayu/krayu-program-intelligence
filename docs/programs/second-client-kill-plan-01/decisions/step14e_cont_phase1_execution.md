# STEP 14E-CONT — Phase 1 Execution Trace (Post-Isolation Fix)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14E-CONT
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `docs/programs/second-client-kill-plan-01/decisions/step14d_staged_recovery_plan.md`
**Precondition:** Isolation implemented via `--deliverable tier1` selector (commit 05e11f4)

---

## Status

**FAIL-STOP** — Generator exited with code 1. `StopIteration` at `lens_report_generator.py:2222`. New code defect discovered during Phase 1 execution: `FOCUS_DOMAIN = "DOMAIN-10"` hardcoded; second-client topology uses `DOM-01..DOM-05`. This gap was not in STEP 14D. No Phase 1 artifacts produced. No BlueEdge paths modified.

---

## STEP 14D References Used

- Section 3 PHASE 1 — inputs, required script, exit condition
- Section 5 CANONICAL — authoritative artifacts (all 3 confirmed present)
- Section 5 CODE — tier2 isolation via `--deliverable tier1` (STOP condition cleared)
- Section 6 PHASE 1 — GO condition evaluated, prior STOP condition cleared
- Section 7 — Phase 1 parity milestone (not met)

---

## Pre-Run Gate Check (STEP 14D Section 6 PHASE 1)

### GO Condition

| File | Path | Result |
|------|------|--------|
| canonical_topology.json | `clients/e65d2f0a.../package/canonical_topology.json` | EXISTS ✓ |
| signal_registry.json | `clients/e65d2f0a.../package/signal_registry.json` | EXISTS ✓ |
| gauge_state.json | `clients/e65d2f0a.../package/gauge_state.json` | EXISTS ✓ |

**GO condition: MET**

### STOP Condition

Prior STOP condition from STEP 14E: "Tier2 subprocess behavior UNKNOWN — execution contract must specify isolation method before run."

**CLEARED** — `--deliverable tier1` selector (commit 05e11f4) routes `main()` exclusively to `generate_tier1_reports()`. `generate_tier2_reports()` is not called. Tier-2 subprocess cannot execute.

**STOP condition (prior): CLEARED**

---

## Command Executed

```bash
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --deliverable tier1
```

---

## Execution Result

**Exit code: 1**

```
Traceback (most recent call last):
  File "scripts/pios/lens_report_generator.py", line 3866, in <module>
    main(tier1=not args.legacy, output_path=args.output, output_dir=args.output_dir,
  File "scripts/pios/lens_report_generator.py", line 3790, in main
    generate_tier1_reports(output_dir=output_dir)
  File "scripts/pios/lens_report_generator.py", line 2700, in generate_tier1_reports
    html = builder(topology, signals, gauge, publish_safe=pub_safe)
  File "scripts/pios/lens_report_generator.py", line 2222, in _build_tier1_evidence_brief
    focus_domain = next(d for d in domains if d["domain_id"] == FOCUS_DOMAIN)
StopIteration
```

**Call chain:** `main()` → `generate_tier1_reports()` → `_build_tier1_evidence_brief()` → line 2222

**Tier-2 isolation confirmed:** `generate_tier2_reports()` was NOT reached. No subprocess executed. No BlueEdge paths modified.

---

## Root Cause Analysis

### Defect Location

`scripts/pios/lens_report_generator.py:2105` and `:2222`

### Code (verbatim)

Line 2105 (inside `_build_tier1_evidence_brief()`):
```python
FOCUS_DOMAIN = "DOMAIN-10"
```

Line 2222:
```python
focus_domain = next(d for d in domains if d["domain_id"] == FOCUS_DOMAIN)
```

### Failure Mechanism

`next()` with no default argument raises `StopIteration` when the generator is exhausted (no match found).

`FOCUS_DOMAIN = "DOMAIN-10"` is hardcoded. It matches BlueEdge domain naming (`DOMAIN-XX`).

Second-client canonical_topology.json domain IDs:
```
DOM-01
DOM-02
DOM-03
DOM-04
DOM-05
```

Second-client uses `DOM-XX` naming convention, not `DOMAIN-XX`. No domain matches `"DOMAIN-10"`. `next()` raises `StopIteration`.

### Classification

**GAP-CODE-03** (new — not in STEP 14D)
- Stage: S-13/S-14
- Script: `scripts/pios/lens_report_generator.py:2105,2222`
- Root cause: `FOCUS_DOMAIN = "DOMAIN-10"` hardcoded for BlueEdge 17-domain topology; no fallback when domain absent
- Affects: `_build_tier1_evidence_brief()` → blocks EXEC generation; same function called for publish variant
- Blocking for: EXEC HTML, LENS HTML (co-produced in same `generate_tier1_reports()` call)

### Secondary hardcoding risk (not yet tested)

Line 2090:
```python
client_name = "Client Environment" if publish_safe else "BlueEdge Fleet Management Platform"
```
When `publish_safe=False`, this renders "BlueEdge Fleet Management Platform" for all clients. This is a cosmetic defect — will NOT crash but produces incorrect client identification in the internal (non-publish) report. Noted for resolution alongside GAP-CODE-03.

---

## Artifacts Produced

**None.** Generator crashed before writing any output file.

| Expected Artifact | Path | Status |
|-------------------|------|--------|
| EXEC HTML | `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` | ABSENT |
| LENS HTML | `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html` | ABSENT |
| EXEC pub | `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_evidence_brief_pub.html` | ABSENT |
| LENS pub | `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_narrative_brief_pub.html` | ABSENT |

---

## 4-BRAIN Execution Summary (from STEP 14D Phase 1 context)

### CANONICAL (STEP 14D Section 5)

All 3 authoritative artifacts confirmed present and unmodified:
- `canonical_topology.json` ✓ — 5 domains: DOM-01..DOM-05
- `signal_registry.json` ✓ — signals: [], NOT_EVALUATED
- `gauge_state.json` ✓

No canonical mutation. Evidence base unchanged.

### CODE (STEP 14D Section 5)

Known defects from STEP 14D: GAP-CODE-01 (subprocess), GAP-VAULT-01 (validate_export), GAP-CODE-02 (zones API).

**New defect discovered during Phase 1 execution:**

| ID | Location | Defect | Impact |
|----|----------|--------|--------|
| GAP-CODE-03 | `lens_report_generator.py:2105,2222` | `FOCUS_DOMAIN = "DOMAIN-10"` hardcoded; `next()` no default | Blocks EXEC + LENS generation for any client without DOMAIN-10 |

`--deliverable tier1` selector functioned correctly: tier2 was NOT invoked. The isolation fix (commit 05e11f4) is confirmed effective. The crash occurred within `generate_tier1_reports()`, not in the tier2 path.

### PRODUCT (STEP 14D Section 5)

Phase 1 deliverables remain absent. Phase 1 exit condition NOT met. GAP-CODE-03 is the blocking condition.

### PUBLISH (STEP 14D Section 5)

No new publishable artifacts. Legacy report (`/tmp/lens_structural_slice_test.html`, STEP 13D-G) remains the only second-client safe-to-show surface.

---

## Validation Against STEP 14D GO / STOP Gates

| Gate | Condition | Result |
|------|-----------|--------|
| PHASE 1 GO | All 3 package files exist | MET |
| PHASE 1 STOP (prior) | Tier2 subprocess isolation not specified | CLEARED (--deliverable tier1) |
| PHASE 1 STOP (new) | GAP-CODE-03 blocks `generate_tier1_reports()` | TRIGGERED |

---

## Phase 1 Exit Condition Result

**NOT MET.**

STEP 14D Section 3 PHASE 1 exit condition:
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_evidence_brief.html  EXISTS
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_narrative_brief.html  EXISTS
```

Neither file was produced. Generator exited with code 1 before writing any file.

---

## Required Fix for GAP-CODE-03

**File:** `scripts/pios/lens_report_generator.py`
**Locations:**

1. **Line 2222** — `next()` must not raise on missing domain:
   ```python
   # current (crashes):
   focus_domain = next(d for d in domains if d["domain_id"] == FOCUS_DOMAIN)
   
   # required:
   focus_domain = next((d for d in domains if d["domain_id"] == FOCUS_DOMAIN), None)
   ```
   Lines 2223-2224 must then guard against `focus_domain is None`:
   ```python
   focus_caps  = len(focus_domain.get("capability_ids", [])) if focus_domain else 0
   focus_comps = len(focus_domain.get("component_ids", []))  if focus_domain else 0
   ```

2. **Line 2090** — `client_name` hardcodes "BlueEdge Fleet Management Platform" when not `publish_safe`. This should use a neutral or topology-derived name for non-BlueEdge clients. Exact fix requires knowing the intended fallback value (not specified in STEP 14D).

---

## Next Phase Readiness

Phase 1 is NOT complete. GAP-CODE-03 must be resolved before Phase 1 can pass.

| Phase | Status | Blocker |
|-------|--------|---------|
| PHASE 1 | BLOCKED | GAP-CODE-03 — `FOCUS_DOMAIN` hardcoded, `next()` no default |
| PHASE 2 | BLOCKED | Awaits PHASE 1 |
| PHASE 3 | BLOCKED | Awaits PHASE 2 |
| PHASE 4 | BLOCKED | Awaits PHASES 1+2+3 |
| PHASE 5 | BLOCKED | PiOS 41.x not contracted |

---

## Gap Register Update

STEP 14D gap register updated with new finding:

| Gap ID | Stage | Description | Blocker For | Recovery |
|--------|-------|-------------|-------------|----------|
| GAP-CODE-03 | S-13, S-14 | `FOCUS_DOMAIN = "DOMAIN-10"` hardcoded in `_build_tier1_evidence_brief()` line 2105; `next()` at line 2222 has no default; second-client uses `DOM-XX` not `DOMAIN-XX` | EXEC + LENS generation | Add `, None` default to `next()`; guard lines 2223-2224 against None |
