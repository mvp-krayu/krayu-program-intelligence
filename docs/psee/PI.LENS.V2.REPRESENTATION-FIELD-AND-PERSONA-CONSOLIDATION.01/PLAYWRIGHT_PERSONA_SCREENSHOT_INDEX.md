# PLAYWRIGHT PERSONA SCREENSHOT INDEX

**Stream:** PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01
**Captured:** 2026-05-09
**Runtime URL inspected:** http://localhost:3002/lens-v2-flagship
**App:** app/execlens-demo
**Page:** app/execlens-demo/pages/lens-v2-flagship.js

---

## Capture model

For the four executive lenses (BALANCED / DENSE / INVESTIGATION / BOARDROOM) the Representation Field renders four distinct mode-specific compositions inside the right column of the IntelligenceField:

- BALANCED → BalancedConsequenceField (Executive / CEO consequence path)
- DENSE → DenseTopologyField (Structural / CTO source → pass-through → receiver)
- INVESTIGATION → InvestigationTraceField (Analyst evidence trace bands)
- BOARDROOM → BoardroomAtmosphericField (Projection-grade atmospheric mark)

Mandatory viewport: 1440 × 900. Additional viewports captured where feasible.

---

## Index

### BALANCED — Executive lens (CEO · consequence-first read)

| File                                                                                         | Viewport     | Type     |
|----------------------------------------------------------------------------------------------|--------------|----------|
| `screenshots/balanced_1440x900_viewport.png`                                                 | 1440 × 900   | viewport |
| `screenshots/balanced_1440x900_full.png`                                                     | 1440 × 900   | full     |

### DENSE — Structural lens (CTO · cause and propagation)

| File                                                                                         | Viewport     | Type     |
|----------------------------------------------------------------------------------------------|--------------|----------|
| `screenshots/dense_1440x900_viewport.png`                                                    | 1440 × 900   | viewport |
| `screenshots/dense_1440x900_full.png`                                                        | 1440 × 900   | full     |
| `screenshots/dense_1728x1117_viewport.png`                                                   | 1728 × 1117  | viewport |
| `screenshots/dense_1280x800_viewport.png`                                                    | 1280 × 800   | viewport |

### INVESTIGATION — Evidence lens (Analyst · trace and confidence)

| File                                                                                         | Viewport     | Type     |
|----------------------------------------------------------------------------------------------|--------------|----------|
| `screenshots/investigation_1440x900_viewport.png`                                            | 1440 × 900   | viewport |
| `screenshots/investigation_1440x900_full.png`                                                | 1440 × 900   | full     |

### BOARDROOM — Projection lens (minimal chrome)

| File                                                                                         | Viewport     | Type     |
|----------------------------------------------------------------------------------------------|--------------|----------|
| `screenshots/boardroom_1440x900_viewport.png`                                                | 1440 × 900   | viewport |
| `screenshots/boardroom_1440x900_full.png`                                                    | 1440 × 900   | full     |
| `screenshots/boardroom_2560x1440_viewport.png`                                               | 2560 × 1440  | viewport (projector) |

---

## Mode-by-mode read

### BALANCED

The right-column composition shows three vertical anchors connected by a soft pressure-graded rail:

```
Source pressure       ●  Primary Delivery       ▴ HIGH (red glow)
   │
Coordination absorption ●  Coordination Layer   ▴ ELEVATED (amber glow)
   │
Secondary impact      ●  Secondary Delivery     ◇ MODERATE (yellow glow)
```

The Executive Consequence Field reads as a calm consequence path. No card grid, no metric tiles, no graph playground.

### DENSE

The right-column composition shows three weighted nodes with pressure-tier color glow plus a propagation edge between them:

```
ORIGIN
  ⦿ Primary Delivery    HIGH execution pressure
  │
PASS-THROUGH
  ⦿ Coordination Layer  ELEVATED throughput pressure
  │
RECEIVER
  ⦿ Secondary Delivery  MODERATE pressure   (Q-01 advisory bound)
```

The Structural Topology Field reads as a small, deliberate cinematic structural map — not a graph explorer.

### INVESTIGATION

The right-column composition is a vertical stack of three trace bands with evidence text and confidence labels:

```
[Observed pressure] · Primary Delivery
  evidence_text...
  Confidence — Full Grounding

[Propagation absorption] · Coordination Layer
  evidence_description...
  Confidence — Full Grounding

[Qualified receiver state] · Secondary Delivery
  evidence_description...
  Confidence — Partial Grounding · advisory bound
```

The Evidence Trace Field reads as analyst-grade evidence pacing — not raw JSON, not tables, not topology jargon.

### BOARDROOM

The right-column composition collapses to a quiet projection mark:

```
                  ╭─── PROJECTION LENS ───╮
                  │                       │
                  │       ◯  glow         │
                  │                       │
                  │  Operating posture.   │
                  │  Pressure propagating │
                  │  through coord —      │
                  │  advisory-bounded.    │
                  │                       │
                  │   ─── line accent ─── │
                  │                       │
                  │   PARTIAL COVERAGE    │
                  ╰───────────────────────╯
```

The Boardroom Atmospheric Field reads as projection-grade — minimal chrome, declaration-supportive, calm at distance.

---

## Mode-control persona accessibility

The four mode buttons (BALANCED / DENSE / INVESTIGATION / BOARDROOM) are now `role="radio"` inside a `role="radiogroup"` aria-labeled "Executive lens". Each carries:

- `aria-label` extending the visible label with persona context (e.g., "Balanced — Executive (CEO) consequence lens").
- `title` attribute mapping the persona pair (e.g., "Executive lens — CEO · consequence-first read").
- A persistent persona line below the button strip (e.g., "Executive lens · CEO · consequence-first read") that updates as the active mode changes.

The visible labels are preserved per the contract no-baby-with-bathwater rule. Persona meaning is layered in via accessibility and microcopy.

---

## Total screenshots

11 PNG (4 viewport + 4 full at 1440×900 mandatory, plus 3 additional viewport captures: dense at 1728×1117 and 1280×800, boardroom at 2560×1440).

A second 2560×1440 boardroom full-page capture was not produced (single viewport capture sufficient at projector size to show atmospheric composition).

---

**End of index.**
