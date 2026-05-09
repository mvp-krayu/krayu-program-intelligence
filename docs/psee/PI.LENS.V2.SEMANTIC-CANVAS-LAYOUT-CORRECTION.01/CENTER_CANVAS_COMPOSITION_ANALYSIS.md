# CENTER CANVAS COMPOSITION ANALYSIS

**Stream:** PI.LENS.V2.SEMANTIC-CANVAS-LAYOUT-CORRECTION.01
**Scope:** Per-mode analysis of the center canvas composition after the layout correction.

---

## 1. Canvas envelope

The center column of the IntelligenceField:

- Width fraction at 1440px viewport: ~56% of the IntelligenceField.
- Min height: 620px (680px in BOARDROOM).
- Max-width on the rep-field: 920px (centered within the column, leaving margins for breathing).
- Padding: 56px / 56px / 64px (top / sides / bottom). 72px / 64px / 80px in BOARDROOM.
- Background: dual radial gradient (state-color tint top, warm tint bottom) on graphite ground.

The envelope is large enough that mode-specific compositions can carry meaningful semantic actors without feeling cramped.

---

## 2. BALANCED canvas — Executive Consequence

### Composition

```
[ Persona tag: Executive lens · CEO · consequence-first read ]
[ Zone chips: Z1 EXECUTIVE POSTURE · Z2 RESOLUTION BOUNDARY · Z4 PRESSURE ANCHOR ]

  ┌───────────────────────────────────────────────────────────────┐
  │  Pressure originates upstream and is being absorbed through    │
  │  the coordination layer; secondary delivery remains within    │
  │  bounds, advisory-qualified.                                   │
  └───────────────────────────────────────────────────────────────┘

       ◉                           ◐                           ◎
   (HIGH glow)                (ELEVATED glow)              (MODERATE glow)
   ◐ red                       ◐ amber                      ◐ yellow
   ─────────  pressure-graded gradient rail  ───────────────►

   SOURCE PRESSURE             COORDINATION ABSORPTION         SECONDARY IMPACT
   Primary Delivery            Coordination Layer              Secondary Delivery
   High Execution Pressure     Conducting · not generating     Moderate Pressure
```

### Rationale

- The **horizontal flow** reads as a *consequence path* — pressure starts on the left, is absorbed in the middle, lands on the right.
- The **pressure-graded rail** runs above the labels and beneath the glow halos at ~50% canvas height, anchoring the path visually.
- Each anchor has a **36px glow halo** with a **12px solid tier dot** at center, giving each consequence stage clear pressure encoding.
- Typography is at 15px for names, 12px for state — readable at executive distance, calm without being faint.

### Forbidden patterns avoided

- No tile grid (anchors share a row but are not equal-weighted; flow direction encoded by the rail).
- No chart of any kind.
- No KPI numbers.
- No dial / donut / gauge.

### Failure modes monitored

- If the rail were too dim, the path would read as "three independent items." Solution: gradient rail at 0.85 opacity.
- If the anchors were equal in weight, this would regress toward a tile grid. Solution: distinct tier color per anchor (HIGH / ELEVATED / MODERATE) — visual differentiation prevents grid-gravity reading.

---

## 3. DENSE canvas — Semantic Topology

### Composition

```
[ Persona tag: Structural lens · CTO · structural cause and propagation ]
[ Zone chips: Z3 SEMANTIC TOPOLOGY · Z4 PRESSURE ANCHOR · Z6 CLUSTER CONCENTRATION ]

   ┌─────────┐         ┌──────────────────┐         ┌─────────┐
   │   ◉     │         │     ◐ Coordination│         │    ◎    │
   │   HIGH  │ ──────► │     Layer         │ ──────► │MODERATE │
   │  Glow   │         │  ELEVATED         │         │  Glow   │
   │         │         │                   │         │  Q-01   │
   │ Origin  │         │  Absorbing 68%    │         │Receiver │
   │ Primary │         │                   │         │Secondary│
   │Delivery │         │   PASS-THROUGH    │         │Delivery │
   └─────────┘         └──────────────────┘         └─────────┘

   [ dense note: Coordination layer is conducting upstream pressure ... ]
   [ Cluster Concentration: thin gradient bar + 47 clusters · 2 of 3 grounded ]
```

### Rationale

- The composition is **spatial, not vertical.** The three nodes occupy three columns.
- **Coordination Layer is visually dominant** — lifted background panel, 72×72 marker, 22×22 dot, 16px name. This communicates the structural insight directly: coordination is the absorbing actor.
- **Edges are gradient-faded horizontal lines** (pressure-tier color from origin to receiver) running through the middle of the row, encoding propagation direction.
- **Cluster concentration sub-panel** below the topology surfaces the Z6 zone as an explicit operational object.
- **Dense note** prose contextualizes the visual — "consistent with organizational stress migration."

### Forbidden patterns avoided

- No graph-explorer behavior (no pan, no zoom, no drag, no force-directed layout).
- No legacy static topology restoration.
- Three nodes, two edges — well within the doctrine's five-node ceiling.
- Zero edge crossings.
- No third-party graph library.

### Failure modes monitored

- If Coordination Layer were the same weight as Origin/Receiver, the structural insight would not surface. Solution: explicit visual lift (background, marker size, name size).
- If the edges were arrows in different colors, the composition would look tactical/military. Solution: gradient-faded horizontal lines (no arrowheads, no thick lines).

---

## 4. INVESTIGATION canvas — Evidence Trace

### Composition

```
[ Persona tag: Evidence lens · Analyst · evidence trace and confidence ]
[ Zone chips: Z7 EVIDENCE TRACE · Z5 SIGNAL STACK · Z2 RESOLUTION BOUNDARY ]

  ┌─ OBSERVED PRESSURE ──────────────────────────────── HIGH ──┐
  │ Primary Delivery                                            │
  │ 23 of 31 delivery clusters are operating above normal       │
  │ execution threshold...                                      │
  │ Confidence — Full Grounding                                 │
  └─────────────────────────────────────────────────────────────┘

  ┌─ PROPAGATION ABSORPTION ───────────────────── ELEVATED ──┐
  │ Coordination Layer                                        │
  │ Program coordination stream is fully grounded. Elevated   │
  │ pressure is confirmed as propagation absorption...        │
  │ Confidence — Full Grounding                               │
  └───────────────────────────────────────────────────────────┘

  ┌─ QUALIFIED RECEIVER STATE ──── MODERATE · advisory bound ─┐
  │ Secondary Delivery                                          │
  │ Secondary delivery signal is partially grounded. Moderate  │
  │ pressure is confirmed from available evidence...           │
  │ Confidence — Partial Grounding · advisory bound            │
  └────────────────────────────────────────────────────────────┘
```

### Rationale

- Three vertical bands stacked, each band carrying its own pressure-tier rail and content.
- Each band has a **head row** (label + domain), a **body** (evidence text), and a **confidence row** (grounding + advisory flag).
- The third band uses a **warm gradient background** to signal Q-01 partial grounding — the advisory state is felt, not just labelled.

### Forbidden patterns avoided

- No raw JSON, no table grids, no long unstructured paragraphs.
- No card grid (the bands are differentiated by tier rail and partial-state gradient).

### Failure modes monitored

- If all three bands looked identical, this would regress toward dashboard. Solution: tier-color rail + gradient on partial band.
- If evidence text were truncated, the analyst would not trust the surface. Solution: full evidence_text from upstream fixture, untruncated.

---

## 5. BOARDROOM canvas — Atmospheric Projection

### Composition

```
[ Persona tag (centered): Projection lens · Boardroom — minimal chrome ]
[ Zone chips (centered): Z1 EXECUTIVE POSTURE · Z2 CONFIDENCE BOUNDARY ]

                    ┌──────────────────────────┐
                    │                          │
                    │                          │
                    │       ╭──────────╮       │
                    │       │   ◯      │       │
                    │       │  state   │       │
                    │       │   ring   │       │
                    │       ╰──────────╯       │
                    │                          │
                    │       (320×320 area      │
                    │        with 168px ring   │
                    │        + 22px outer halo)│
                    │                          │
                    └──────────────────────────┘

   Operating posture. Pressure is propagating through coordination —
   advisory-bounded at the secondary receiver.

   ─── line accent (gradient-faded) ───

   PARTIAL COVERAGE
```

### Rationale

- The atmospheric mark is now **320×320 with a 168px ring** (up from 180×180 with 96px ring in the previous iteration).
- An **outer halo at -22px inset** adds a second concentric layer.
- The supportive sentence is **19px** (up from 16px), max-width 520px.
- Composition is centered horizontally and vertically in the canvas.

### Forbidden patterns avoided

- No analytical detail.
- No topology nodes.
- No card grids.
- No animation (no rotation, no pulsing).

### Failure modes monitored

- If the ring were too small, BOARDROOM would read as "reduced DENSE" rather than as projection-grade. Solution: large ring + outer halo.
- If the statement were too long, projector readability would suffer. Solution: max-width 520px, 19px size, 1.5 line-height.

---

## 6. Cross-mode invariants

The four mode canvases share:

- The same persona tag header (Lens label + sub-line + zone chips).
- The same canvas envelope (padding, max-width, gradient ground).
- The same render-state vocabulary and color tokens.
- The same support rail to the right.
- The same compressed interpretation companion to the left.

What they do *not* share is composition. Each mode's center canvas is a different visual answer to the same evidence ground.

---

## 7. Composition discipline

Every element on each canvas earns its place by:

- Encoding a semantic zone (per `SEMANTIC_ZONE_INVENTORY.md` from the predecessor stream).
- Carrying a tier color drawn from upstream evidence — never invented.
- Being either (a) text content drawn verbatim from the fixture or (b) authored prose that complements without paraphrasing static reports.
- Respecting the anti-dashboard floor (`ANTI_DASHBOARD_ENFORCEMENT.md`).
- Respecting the topology guardrail (`TOPOLOGY_REINTRODUCTION_GUARDRAIL.md`).

If a future contract proposes adding a new element to any canvas, the proposal must answer the same questions and document compliance.

---

**End of center canvas composition analysis.**
