# Projection Gap Analysis

**Date:** 2026-06-09
**Reference:** PI.PROJECTION.CONSTITUTION.01
**Method:** Cross-verification of all four LENS persona rendering implementations against constitutional contracts

---

## Root Cause

`CognitionSurfaceCard` is shared between DENSE and OPERATOR with no projection mode switch. Both personas render identical cognition surfaces. Until a `projectionMode` parameter exists, the constitution's §4 SW-INTEL projection matrix is aspirational.

The constitutional model evolved faster than the rendering runtime.

- Constitution says: DENSE = explain, OPERATOR = verify, BALANCED = interpret
- Codebase says: `renderSameThing() withDifferentLayouts()`

---

## Per-Persona Audit

### BOARDROOM — MOSTLY COMPLIANT

| Requirement | Status | Detail |
|-------------|--------|--------|
| Posture headline | ✓ | Conclusion surface rendering correct |
| Material/supporting findings | ✓ | Consequence themes separated |
| Dual-axis (structural + execution center) | ✓ | Both centers visible in RIGHT + topology |
| P-level as authority credit rating | ✓ | Authority bar with checkmarks |
| S-level hidden | ✓ | Removed from boardroom |
| No evidence inspection | ⚠ | SW-INTEL teaser leaks "N structural conditions detected" |
| No signal decomposition | ✓ | Clean |
| No governance lifecycle detail | ✓ | Clean |

### DENSE — PARTIAL COMPLIANCE

| Requirement | Status | Detail |
|-------------|--------|--------|
| Full topology | ✓ | Interactive with all zones |
| Signal families per-signal | ✓ | ISIG/DPSIG/PSIG/RSIG decomposition |
| Condition mechanics | ⚠ | Shows conditions but not formation chain |
| SW-INTEL: explain (origin → reinforce → widen → synthesize) | ❌ | **Renders same cards as OPERATOR** |
| Convergence synthesis narrative | ❌ | Not explicitly rendered |
| No executive summarization | ✓ | Clean |
| No verification workflows | ✓ | VERIFY button absent in DENSE |

### OPERATOR — CRITICAL GAPS

| Requirement | Status | Detail |
|-------------|--------|--------|
| Evidence chain | ✓ | 30 signals → 26 conditions → 11 elevated → 3 critical |
| RSIG first-class | ✓ | Z2 zone with consequence bridge |
| Propagation flow | ✓ | Origin/receiver/zone summary |
| Governance state | ✓ | Compact metrics + explicit asymmetry for StackStorm |
| Evidence lineage | ✓ | Hash chain rendering |
| Falsification per surface | ❌ | **Only hardcoded for EB/GD category surfaces** |
| Per-surface verification matrix | ❌ | Shows counts, not supports/challenges/confidence |
| SW-INTEL: verify (not explain) | ❌ | **Renders same cards as DENSE** |
| No narrative explanation | ✓ | Clean |

### BALANCED — CRITICAL GAPS

| Requirement | Status | Detail |
|-------------|--------|--------|
| Consequence dynamics | ✓ | Emergence orchestration, reinforcement flow |
| Governed interpretation calls | ❌ | **Not implemented — uses deterministic templates** |
| Authority gating on interpretations | ❌ | P-level does not gate interpretation availability |
| Disclosure wrapping on interpretive outputs | ❌ | Not visible |
| No freeform prompts | ✓ | Clean |
| No mechanical explanation (DENSE leakage) | ❌ | Orientation grid shows structural decomposition |

---

## Priority Order

| Priority | Item | Rationale |
|----------|------|-----------|
| **P0** | ProjectionMode separation (explain / verify / interpret) | Root cause of all drift. Until physically implemented, constitution is aspirational |
| **P0** | Falsification support per cognition surface | OPERATOR's defining feature. Verification without falsification = inspection |
| **P1** | BALANCED governed interpretation runtime | BALANCED's defining feature doesn't exist yet |
| **P1** | DENSE explanation chain (origin → reinforcement → widening → synthesis) | Without this, DENSE = "OPERATOR with more text" |
| **P2** | Verification matrix deepening (supports / challenges / confidence) | OPERATOR per-surface validation is shallow |
| **P2** | Governed interpretation authority gating | P-level determines BALANCED interpretation availability |
| **P3** | BOARDROOM SW-INTEL teaser leakage | Minor evidence language in conclusion surface |

---

## Implementation Guidance

The P0 fix is a mode parameter, not a component rewrite:

```
<CognitionSurfaceCard
  surface={s}
  projectionMode="explain"    // DENSE
  projectionMode="verify"     // OPERATOR
/>
```

The card already has all the data. The mode controls which sections render:

- `explain`: originating conditions, reinforcement narrative, consequence widening, synthesis
- `verify`: supporting evidence count, runtime correlation, governance status, confidence, falsification path

BALANCED does not use `CognitionSurfaceCard`. It uses governed interpretation calls that produce narrative output from fixed inputs.

---

## Constitutional Reference

This analysis is bound by PI.PROJECTION.CONSTITUTION.01 (§2.1–§2.4, §4, §6).

The test for contract compliance: can you state what each persona FORBIDS? If the rendering doesn't enforce the forbidden list, the contracts have collapsed into density levels.
