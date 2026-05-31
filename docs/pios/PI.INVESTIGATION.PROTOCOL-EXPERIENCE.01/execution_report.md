# Execution Report — PI.INVESTIGATION.PROTOCOL-EXPERIENCE.01

## Stream Classification: G2 — Architecture-Consuming

## Pre-Flight

| Check | Status |
|-------|--------|
| Branch | feature/runtime-demo ✓ |
| Inputs present | InvestigationVerifier.js (PI.PERSONA.INVESTIGATION-VERIFICATION-ENGINE.01) ✓ |
| Dependencies | ConsequenceCompiler, InvestigationVerifier, SoftwareIntelligenceField ✓ |
| Validators | Build + visual verification ✓ |

## Scope

Implement the INVESTIGATION verification corridor experience invoked from OPERATOR. INVESTIGATION is NOT a selectable persona surface — it is a governed verification protocol (ACTION, not DESTINATION). Constitutional decision: four selectable surfaces (BOARDROOM / BALANCED / DENSE / OPERATOR). INVESTIGATION is invoked from OPERATOR and returns to OPERATOR.

## Execution Summary

### Entry Model

- "VERIFY" button added to SoftwareIntelligenceOperatorView header
- Gated on `verificationTargetReady` (consequenceResult with consequences, synthesisResult, and fullReport must all exist)
- Disabled when no valid verification target
- Visible only when SW-Intel is active in OPERATOR mode

### Corridor Model

- createPortal modal overlay (same pattern as TopologyModal)
- Fixed overlay with backdrop blur, z-index 9000
- Escape key dismisses
- 5 verification steps rendered as sequential cards with verdict badges
- Replay card shows determinism verification result
- Overall verdict card anchors the corridor (VERIFIED / PARTIALLY_VERIFIED / VERIFICATION_FAILED / CANNOT_INVESTIGATE)
- All verdicts use semantic CSS classes (`data-verdict` attribute selectors), no hardcoded hex in JSX

### Persistence Model

- Module-level `_verificationCache` preserves results across component remounts (persona switches cause IntelligenceField remount)
- useState initializes from cache on mount
- Verification badge in SW-Intel Operator View header shows cached result
- Badge is clickable to reopen corridor without re-computation

### Verdict Visual Model

- VERIFIED: green accent (via `data-verdict="VERIFIED"`)
- PARTIALLY_VERIFIED: yellow accent (via `data-verdict="PARTIALLY_VERIFIED"`)
- VERIFICATION_FAILED: red accent (via `data-verdict="VERIFICATION_FAILED"`)
- CANNOT_INVESTIGATE: muted (via `data-verdict="CANNOT_INVESTIGATE"`)

### Return Model

- Close button (✕) or Escape key closes corridor
- Returns to OPERATOR with verification badge persisted
- Badge survives persona round-trips (OPERATOR → DENSE → OPERATOR)

## Boundary Compliance

| Boundary | Status |
|----------|--------|
| No INVESTIGATION selector entry | ✓ — no persona added |
| No INVESTIGATION route | ✓ — no route created |
| No INVESTIGATION tab | ✓ — no tab added |
| No compiler semantic change | ✓ — InvestigationVerifier and ConsequenceCompiler read-only |
| No BOARDROOM changes | ✓ |
| No BALANCED changes | ✓ |
| No DENSE changes | ✓ |
| Semantic verdict classes | ✓ — all verdicts via data-verdict attribute selectors |
| Target-gated entry | ✓ — VERIFY button disabled without valid consequenceResult |

## Verification

| Check | Result |
|-------|--------|
| `npx next build` | PASS |
| OPERATOR → SW-Intel ON → VERIFY button visible | PASS |
| Click VERIFY → corridor opens with VERIFIED verdict | PASS |
| 5/5 steps PASS, replay MATCH | PASS |
| Escape → corridor closes | PASS |
| Badge persists: "Verified" with data-verdict="VERIFIED" | PASS |
| Badge click → corridor reopens (no re-computation) | PASS |
| Persona round-trip (OPERATOR→DENSE→OPERATOR) → badge persists | PASS |
| BOARDROOM → no VERIFY button, no badge | PASS |
| BALANCED → no VERIFY button, no badge | PASS |
| DENSE → no VERIFY button, no badge | PASS |
| No console errors | PASS |

## Baseline

- Commit: 7224d8e (pre-stream baseline)
- Branch: feature/runtime-demo
