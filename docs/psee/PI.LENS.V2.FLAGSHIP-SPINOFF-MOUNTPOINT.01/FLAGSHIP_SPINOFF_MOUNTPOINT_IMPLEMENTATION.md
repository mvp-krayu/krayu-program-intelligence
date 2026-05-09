# LENS v2 Flagship — Spinoff Mountpoint Implementation

**Stream:** PI.LENS.V2.FLAGSHIP-SPINOFF-MOUNTPOINT.01  
**Branch:** work/lens-v2-productization  
**Status:** COMPLETE  
**Mode:** CREATE_ONLY + ISOLATED_RUNTIME_WIRING

---

## Purpose

This contract creates a non-destructive isolated spinoff mountpoint for the LENS v2 flagship experience inside the existing `app/execlens-demo` Next.js runtime.

The spinoff:
- does NOT modify `pages/index.js` (old ExecLens 42.x demo preserved)
- does NOT touch `app/gauge-product/` (LENS v1 preserved)
- creates one new page route only: `pages/lens-v2-flagship.js`

---

## Spinoff Route

| Property | Value |
|---|---|
| File | `app/execlens-demo/pages/lens-v2-flagship.js` |
| URL | `http://localhost:3000/lens-v2-flagship` |
| Runtime | Next.js 14 (Pages Router) |
| Start command | `cd app/execlens-demo && npm run dev` |
| Old root preserved | `http://localhost:3000/` — unchanged |

---

## Architecture

The spinoff page wires the full LENS v2 stack without introducing any new logic:

```
pages/lens-v2-flagship.js
  │
  ├── orchestrateFlagshipExperience()     ← flagshipOrchestration.js
  │     ├── adaptReport()                 ← adapters/index.js
  │     │     ├── validateReportObjectPipeline()  ← validation/index.js
  │     │     ├── adaptReadinessBadge()   ← adapters/ReadinessBadgeAdapter.js
  │     │     ├── adaptQualifierChip()    ← adapters/QualifierChipAdapter.js
  │     │     ├── adaptNarrative()        ← adapters/NarrativeAdapter.js
  │     │     └── ... full adapter chain
  │     ├── resolveRevealSequence()       ← MotionSemanticController.js
  │     ├── resolveMotionProfile()        ← MotionSemanticController.js
  │     └── resolveExperientialDensityLayout()  ← IntelligenceDensityOrchestrator.js
  │
  └── <LensV2FlagshipExperience />        ← flagship-experience/LensV2FlagshipExperience.jsx
        ├── <IntelligencePresenceLayer />
        ├── <OperationalGravitySystem />
        ├── <ExecutiveBoardroomMode />
        ├── <ExecutiveAttentionDirector />
        ├── <ExecutiveOperationalCanvas />
        ├── <IntelligenceRevealCinema />
        ├── <StructuralInvestigationFlow />
        └── <TopologySafeVisualRealization />
```

---

## Real Report Integration

The page uses `FLAGSHIP_REAL_REPORT` — a Q-01 multi-domain report with:
- 3 domains (Primary Delivery, Coordination Layer, Secondary Delivery)
- HIGH pressure origin in Primary Delivery
- Propagation into Coordination Layer (PASS_THROUGH, ELEVATED)
- Receiver pressure in Secondary Delivery (MODERATE, partial grounding)
- `renderState: EXECUTIVE_READY_WITH_QUALIFIER`
- `qualifier_class: Q-01` — qualifier notice globally visible and non-suppressable

---

## Client-Side Rendering Strategy

The flagship components are imported via `next/dynamic` with `ssr: false`. This:
- avoids SSR processing of the `'use client'` component tree (which is a no-op directive in Pages Router but cleaner to isolate)
- ensures the full flagship experience is mounted client-side with React hydration
- displays a lightweight loading state ("Initializing intelligence surface…") during mount

The orchestration (`orchestrateFlagshipExperience`) runs client-side via `useMemo`, triggered by:
- density class selection (EXECUTIVE_BALANCED / EXECUTIVE_DENSE / INVESTIGATION_DENSE)
- boardroom mode toggle
- investigation stage selection

All orchestration is deterministic — same input always produces same output.

---

## Interactive Controls

The page exposes three controls:
1. **Density switcher** — EXECUTIVE_BALANCED / EXECUTIVE_DENSE / INVESTIGATION_DENSE
2. **Boardroom mode toggle** — activates `ExecutiveBoardroomMode` wrapper
3. **Render state badge** — read-only display of current state (non-interactive)

Controls do not introduce free-form exploration, text input, AI calls, or prompt surfaces.

---

## Governance Invariants

All 11 governance invariants from `orchestrateFlagshipExperience` are displayed in the governance status strip at the bottom of the page:

- `topology_always_read_only: true`
- `qualifier_never_suppressed: true`
- `blocked_state_never_softened: true`
- `diagnostic_state_never_softened: true`
- `evidence_references_always_preserved: true`
- `no_ai_calls: true`
- `no_prompt_surfaces: true`
- `no_chatbot_ux: true`
- `no_animated_propagation: true`
- `no_topology_mutation: true`
- `no_semantic_mutation: true`

---

## Smoke Test

`flagship-experience/tests/flagshipSpinoffSmoke.test.js` — 33 tests, 6 suites:

| Suite | Tests |
|---|---|
| Module dependencies load | 6 |
| Orchestration produces correct state | 9 |
| Props are JSON-serializable | 6 |
| Density switching | 4 |
| Boardroom mode | 4 |
| Route isolation verification | 4 |

Result: 33/33 PASS

---

## Files Created

| File | Role |
|---|---|
| `app/execlens-demo/pages/lens-v2-flagship.js` | Spinoff route page |
| `flagship-experience/tests/flagshipSpinoffSmoke.test.js` | Route data layer smoke test |
| `docs/psee/.../FLAGSHIP_SPINOFF_MOUNTPOINT_IMPLEMENTATION.md` | This document |
| `docs/psee/.../FLAGSHIP_SPINOFF_MOUNTPOINT_VALIDATION.md` | Validation record |

## Files NOT Modified

| File | Status |
|---|---|
| `app/execlens-demo/pages/index.js` | UNTOUCHED |
| `app/gauge-product/**` | UNTOUCHED |
| All existing flagship components | UNTOUCHED |
| All existing adapters/validation | UNTOUCHED |
| All existing 42.x demo components | UNTOUCHED |
