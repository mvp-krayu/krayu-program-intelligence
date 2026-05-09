# MODE DIFFERENTIATION MATRIX

**Stream:** PI.LENS.V2.SEMANTIC-CANVAS-LAYOUT-CORRECTION.01
**Scope:** What materially changes across the four lenses on the corrected surface.

---

## 1. Material differentiation principle

A lens whose only effect is changing labels or chrome is decorative. A lens whose effect changes *what the surface does* is operational. The four LENS V2 lenses must be operational, not decorative.

This document records, axis by axis, what materially changes when the operator switches lenses on the corrected surface.

---

## 2. Differentiation matrix

| Axis                              | BALANCED                                | DENSE                                              | INVESTIGATION                                  | BOARDROOM                                  |
|-----------------------------------|-----------------------------------------|----------------------------------------------------|------------------------------------------------|--------------------------------------------|
| Persona tag                       | Executive lens · CEO                    | Structural lens · CTO                              | Evidence lens · Analyst                        | Projection lens · Boardroom                |
| Zone chips                        | Z1 · Z2 · Z4                            | Z3 · Z4 · Z6                                       | Z7 · Z5 · Z2                                   | Z1 · Z2                                    |
| Center canvas type                | horizontal consequence path             | spatial topology with central absorber             | vertical trace bands                           | atmospheric projection mark                |
| Dominant visual mass              | three glow halo anchors + rail          | central PASS-THROUGH actor (coord. layer)          | three large content bands                      | 168px state ring + 320px halo              |
| Reading direction                 | left → right                            | left → center → right (spatial)                    | top → bottom                                   | center-out (radial)                        |
| Body content density              | light (3 short labels)                  | medium (3 nodes + dense note + cluster panel)      | high (3 evidence-text paragraphs)              | very light (1 sentence)                    |
| Evidence text usage               | none                                    | none on canvas (note prose only)                   | full `evidence_text` / `evidence_description`  | none                                       |
| Cluster concentration panel       | absent                                  | present (Z6)                                        | absent                                         | absent                                     |
| Q-01 advisory visibility          | qualifier mandate band + support rail   | mandate band + support rail + node-level "Q-01 advisory bound" caption | mandate band + per-band advisory flag + support rail | mandate band + support rail (compact)       |
| Left interpretation visibility    | summary + why                            | summary + why                                       | summary + why + structural context             | summary only                               |
| Structural Context block          | hidden                                  | hidden                                              | shown                                          | hidden                                     |
| Right rail content                | full (evidence + qualifier + reports)   | full                                               | full                                           | full                                       |
| Lower zones (Propagation / Evidence) | shown                                | shown                                              | shown (Evidence Layer expands per density)     | shown                                      |
| Background gradient (canvas)      | top + bottom radials                    | top + bottom radials                               | top + bottom radials                           | center radial in state-color                |
| Padding                           | base (56/56/64)                         | base                                               | base                                           | wider (72/64/80)                           |
| Atmospheric register              | calm executive                          | structural-operational                             | analyst                                        | projection-grade institutional             |

---

## 3. What does NOT change across lenses

These elements are **invariant** — they read the same in every lens because they are part of the surface's institutional trust contract:

- The authority band identity strip (LENS · v2 · Executive Operational Intelligence · Program identity).
- The 64px declaration zone with state-color emphasis.
- The qualifier mandate band's content when active.
- The compact evidence-state in the right rail.
- The Report Pack registry (four canonical artifacts).
- The governance ribbon at the bottom.
- The Propagation Structure Zone below the IntelligenceField.

If a future contract proposes letting any of these elements vary by lens, the proposal must explicitly justify why the institutional trust contract should bend.

---

## 4. The five-second material-differentiation test

After the operator switches lens, **within five seconds**, they should be able to point at the surface and say:

- BALANCED → "I see a consequence path."
- DENSE → "I see a structural composition with coordination at the center."
- INVESTIGATION → "I see evidence trace bands."
- BOARDROOM → "I see a single projection mark."

If a switch produces "looks the same to me," the differentiation has failed.

The captured screenshots in `screenshots/` confirm the test passes for all four switches.

---

## 5. Mode-specific behaviors below the IntelligenceField

The Propagation Structure Zone (below the IntelligenceField) and the Evidence Layer (below that) are full-width zones outside the three-column structure. They present the same content regardless of lens, but their density differs:

- BALANCED — Evidence Layer trims to 2 of 3 evidence blocks (per `densityClass !== 'EXECUTIVE_BALANCED'` rule), with a "+1 additional domain visible in Dense and Investigation views" caption.
- DENSE — Evidence Layer shows all three blocks.
- INVESTIGATION — Evidence Layer shows all three blocks.
- BOARDROOM — Evidence Layer shows 2 of 3 (per the prior iteration's behavior).

This density-based descent of supplementary content is preserved from prior iterations.

---

## 6. Persona-line microcopy under the lens controls

The persona-line microcopy under the lens-button strip in the authority band updates live with each switch (aria-live="polite"):

- BALANCED → "Executive lens · CEO · consequence-first read"
- DENSE → "Structural lens · CTO · structural cause and propagation"
- INVESTIGATION → "Evidence lens · Analyst · evidence trace and confidence"
- BOARDROOM → "Projection lens · Boardroom — minimal chrome"

This is the persona contract from `PERSONA_LENS_MAPPING.md` (predecessor stream), preserved unchanged.

---

## 7. Authority

This matrix is authoritative for the lens-by-lens differentiation contract. Future contracts that touch any lens MUST consult this matrix and update it explicitly if behaviors change.

---

**End of mode differentiation matrix.**
