# A.5C — CONTROL Shadow Remediation Record

Stream: A.5C | Remediation | Fail-Closed | Non-Destructive
Authority: A.5, A.5B, A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Execution date: 2026-03-28

---

## Baseline

| Field | Value |
|-------|-------|
| Runtime target commit | a5691c3 |
| Control.js commit before remediation | 4525ab3 |
| Control.js commit after remediation | (see below — this commit) |
| Branch | feature/51-9-runtime-convergence |

---

## Mismatches Addressed

### MM-001 — DEMO_EXIT openPanels reset

**File/branch location:** `Control.js`, `INTENT: DEMO_EXIT` handler, `partial` object construction (~line 323)

**Before:** `openPanels: ['situation']` was set in the partial delta, resetting panels to `['situation']` on every DEMO_EXIT.

**After:** Field removed from partial. `openPanels` falls through to `...currentSnapshot`, preserving the current value unchanged.

**Runtime behavior mirrored:** `handleDemoExit` in `index.js` (a5691c3) calls `setFreeMode(true)` and resets demo orchestration fields but does not call `setOpenPanels`. Panels remain as they were at the moment of exit.

---

### MM-002 / MM-003 — PERSONA_SELECT traversalHistory clear during demoActive

**File/branch location:** `Control.js`, `INTENT: PERSONA_SELECT` handler, `demoActive` conditional block (~line 384)

**Before:** `newTraversalHistory = []` was assigned inside the `if (demoActive)` block, clearing traversal history whenever persona changed during an active demo.

**After:** Line removed. `newTraversalHistory` retains its initial value of `traversalHistory` (unchanged). The `demoActive` block continues to reset `demoActive`, `demoStage`, `traversalNodeIndex`, `selectedFlow`, and `rawStepActive`, which mirror the combined runtime persona-change effect.

**Runtime behavior mirrored:** The persona change `useEffect` in `index.js` (a5691c3) resets `guidedStepIndex`, `rawStepActive`, and `demoComplete` but does NOT reset `traversalHistory`. `traversalHistory` is only reset by `handleDemoExit`, `handleStartDemo`, or auto-start.

**Note:** MM-002 (pre-declared) and MM-003 (unexpected) share the same root cause. Removing the single line resolves both.

---

## Runtime Files Changed

None. The following files were not modified:

- `app/execlens-demo/pages/index.js` — unchanged
- `app/execlens-demo/components/TraversalEngine.js` — unchanged
- `scripts/pios/A.5B/run_control_shadow_validation.mjs` — unchanged
- `docs/pios/contracts/A.5B/*` — unchanged (preserved as evidence baseline)

---

## CONTROL Function Signature

Unchanged. `CONTROL(intent, runtimeContext, currentSnapshot) → CONTROL_RESPONSE` shape is identical before and after remediation.

---

## Governance Lock Status

**A.6 remains BLOCKED.**

A.5C patches the divergences identified in A.5B but does not constitute a parity proof. A fresh execution of `scripts/pios/A.5B/run_control_shadow_validation.mjs` against the same runtime baseline (a5691c3) is required to confirm that MM-001 and MM-003 are resolved and no new mismatches were introduced.

---

## Next Allowed Step

**A.5B rerun only.** Run: `node scripts/pios/A.5B/run_control_shadow_validation.mjs`

A.6 remains blocked until that rerun produces a verdict of PASS with acceptable path coverage governance.
