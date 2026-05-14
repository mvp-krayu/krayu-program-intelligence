# MODE BEHAVIOR MATRIX

**Stream:** PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01
**Scope:** What each lens shows in the Representation Field, what it does not show, and how the surrounding surface adapts.

---

## 1. Field-by-field matrix

### 1.1 BALANCED — Executive Consequence Field

| Element                             | Content                                                                              |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Mode tag                            | "Executive lens — CEO · consequence-first read"                                      |
| Calm consequence statement          | "Pressure originates upstream and is being absorbed through the coordination layer; secondary delivery remains within bounds, advisory-qualified." |
| Anchor 1 — SOURCE PRESSURE          | Origin domain (Primary Delivery) · pressure label (High Execution Pressure) · HIGH glow |
| Anchor 2 — COORDINATION ABSORPTION  | Pass-through domain (Coordination Layer) · "Conducting · not generating" · ELEVATED glow |
| Anchor 3 — SECONDARY IMPACT         | Receiver domain (Secondary Delivery) · pressure label (Moderate Pressure) · MODERATE glow |
| Vertical rail                       | Pressure-graded gradient (red → amber → yellow)                                      |
| Compact evidence-state              | Readiness state · grounding label · domain / cluster counts · qualifier chip if active |

**Forbidden in this field:** dense node graph, evidence list, mini cards, metric tables, KPI widgets, charts.

### 1.2 DENSE — Structural Topology Field

| Element                             | Content                                                                              |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Mode tag                            | "Structural lens — CTO · structural cause and propagation"                            |
| Topology step 1 (ORIGIN)            | Pressure-tier dot + glow · role label · domain alias · pressure label                |
| Topology step 2 (PASS-THROUGH)      | Pressure-tier dot + glow · role label · domain alias · pressure label                |
| Topology step 3 (RECEIVER)          | Pressure-tier dot + glow · role label · domain alias · pressure label · advisory flag if Q-01 |
| Edges                               | Vertical connector between adjacent steps, gradient-coloured by upstream tier        |
| Dense note                          | "Coordination layer is conducting upstream pressure rather than generating it — consistent with organizational stress migration, not isolated incident." |
| Compact evidence-state              | Same as BALANCED                                                                      |

**Forbidden in this field:** force-directed graph, many-node visualization, network spaghetti, tiny labels, old static topology copy, graph-explorer behavior.

### 1.3 INVESTIGATION — Evidence Trace Field

| Element                             | Content                                                                              |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Mode tag                            | "Evidence lens — Analyst · evidence trace and confidence"                            |
| Trace band 1 — Observed pressure    | Domain alias · evidence_text from origin signal_card · grounding label · advisory flag if partial |
| Trace band 2 — Propagation absorption | Domain alias · evidence_description from pass-through · grounding label             |
| Trace band 3 — Qualified receiver state | Domain alias · evidence_description from receiver · grounding label · "advisory bound" if Q-01 |
| Tier color rail                     | Left border per band, color = pressure tier                                          |
| Compact evidence-state              | Same as BALANCED                                                                      |

**Forbidden in this field:** raw JSON, table grids, long paragraphs, topology jargon, technical dependency syntax.

### 1.4 BOARDROOM — Atmospheric Field

| Element                             | Content                                                                              |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Mode tag                            | "Projection lens — Boardroom — minimal chrome" (centered)                            |
| Boardroom mark                      | Glow halo + ring at state color                                                      |
| Boardroom statement                 | "<Readiness state>. Pressure is propagating through coordination — advisory-bounded at the secondary receiver." |
| Line accent                         | Subtle horizontal line (gradient-faded at edges)                                     |
| Scope footer                        | Single coverage line ("Partial Coverage" etc), uppercase tracked                     |

**Forbidden in this field:** dense evidence, topology detail, small labels, analyst controls, KPI tiles.

---

## 2. Surrounding-surface behavior matrix

| Aspect                                  | BALANCED | DENSE | INVESTIGATION | BOARDROOM |
|-----------------------------------------|:--------:|:-----:|:-------------:|:---------:|
| Authority band visible                  |    ✓     |   ✓   |       ✓       |     ✓     |
| Declaration zone (large state phrase)   |    ✓     |   ✓   |       ✓       |     ✓     |
| Qualifier mandate band (when active)    |    ✓     |   ✓   |       ✓       |     ✓     |
| Executive Assessment narrative          |    ✓     |   ✓   |       ✓       |     ✓     |
| Why-this-matters block                  |    ✓     |   ✓   |       ✓       |     ✓     |
| Structural Context block                |    —     |   ✓   |       ✓       |     —     |
| Right column = Representation Field     |    ✓     |   ✓   |       ✓       |     ✓     |
| Right column padding / breathing room    |  base    | base  |     base      |   wider   |
| Narrative left padding                  |  base    | base  |     base      |   wider   |
| Propagation Structure Zone (below)      |    ✓     |   ✓   |       ✓       |     ✓     |
| Evidence Layer (below)                  | trimmed  | full  |     full      |   full    |
| Governance Ribbon                       |    ✓     |   ✓   |       ✓       |     ✓     |

The Structural Context block is hidden in BALANCED and BOARDROOM to maintain the executive register. Evidence layer remains visible in BOARDROOM but is not visually re-skinned in this iteration (recorded as residual visual risk).

---

## 3. State preservation across modes

Switching between modes must NEVER:

- mutate evidence semantics
- alter `renderState`
- alter `qualifier_class`
- hide critical advisory state
- bypass governance ribbon
- introduce inconsistent narrative

Switching between modes MAY:

- change visual composition of the right column
- show / hide the Structural Context block
- re-pace padding and breathing
- change accent emphasis
- update the persona-line microcopy

Mode switching is a presentation operation only. Underlying truth is invariant.

---

## 4. Default-state contract

The default mode on initial render is `densityClass = 'EXECUTIVE_DENSE'`, `boardroomMode = false`. This default is inherited from the prior iteration and is not changed by this contract.

The lens-button strip starts with DENSE active. The persona line reads "Structural lens · CTO · structural cause and propagation" on first paint.

---

## 5. Mode-button styling contract

The lens-button strip refinements applied in this iteration:

- Border color lifted from `#232d42` to `#2a334a` for stronger inactive contrast.
- Inactive label color lifted from `#3a4560` to `#7a85a3` (much more readable).
- Active state preserves `var(--state-bg)` background + `var(--state-color)` foreground.
- Active state weight increased to 600.
- BOARDROOM joined the radio-group (no longer a separate trailing toggle button).
- Hover state added: subtle background lift + foreground lift.
- Focus-visible outline added for keyboard navigation.
- Persona line below the strip provides live persona context.

---

**End of mode behavior matrix.**
