# SEMANTIC FIELD ANTI-PATTERNS

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Scope:** What is forbidden in the semantic field composition.

---

## 1. The anti-pattern register

These are the patterns that the field model explicitly excludes. They are listed here so that future contracts can be evaluated against them.

---

## 2. Card / panel / dashboard anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Hard `border: 1px solid` on `.actor`                      | Reverts dissolved-card transition; reads as dashboard.     |
| Solid opaque background on `.actor`                       | Reverts dissolved-card transition.                         |
| `border-radius` ≥ 4px on `.actor`                         | Re-introduces card-corner aesthetic.                       |
| Equal-weight tile grid (3×3, 4×4, 4-up KPI)              | Anti-dashboard floor (zero regular grids).                 |
| KPI tile with up/down delta arrows                        | Dashboard signature.                                       |
| Sparkline / mini-chart cards                              | BI dashboard signature.                                    |
| Filter row across the top                                 | Analytics tooling signature.                               |
| Save / Share / Export buttons in the primary header       | Report builder signature.                                  |
| "+ Add widget" affordance                                 | Dashboard composition signature.                           |
| Donut / pie / dial without semantic content               | Decoration without operational meaning.                    |

---

## 3. Field-composition anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Field gradient with > 2 saturated hues simultaneously visible | Color-doctrine violation.                              |
| Field gradient amplitude > 0.15 opacity                   | Crosses from atmospheric to decorative.                    |
| Field gradient that animates (rotation / pulse)           | Motion competing with cognition.                           |
| Same field gradient across all four lenses                 | Eliminates mode signature.                                 |
| Atmospheric ring count > 3 around any single mark          | Cyberpunk regression.                                       |
| Use of glow blur radius > 24px on content elements         | Saturated visual register.                                 |
| Use of `mix-blend-mode` for visual style                   | Chart-library aesthetic.                                   |

---

## 4. Decoration anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Lens flares                                               | Sci-fi fantasy decoration.                                 |
| Particle effects                                          | Cyberpunk regression.                                      |
| Animated background gradient drift > 4s loops             | Motion competing with cognition.                           |
| Holographic shimmer / rainbow effects                     | Decorative futurism (visionOS avoid clause).               |
| Gradient borders with multi-hue mix                       | Chart-library register.                                    |
| 3D transforms (rotateX/Y, perspective)                    | Sci-fi gimmick UI.                                         |
| Logo / brand element on the executive surface              | Marketing register.                                        |
| Achievement / gamification badges                         | Productivity-app energy.                                   |
| "AI thinking" / "processing" loaders                      | Fake AI visual language.                                   |

---

## 5. Static report regression anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Inlining static report HTML body in any LENS V2 surface   | Regression to report-viewer behavior.                      |
| Scraping report prose into actor content                  | Static-prose injection (forbidden by all prior streams).   |
| Iframe-embedding report HTML in the canvas                 | Same as inlining.                                          |
| Re-implementing report tables as data grids               | Dashboard regression.                                      |
| "View report" affordance in the canvas                     | Conflates artifact tier with cognition tier.               |

The static reports are accessed only via the Report Pack in the support rail.

---

## 6. Triad-repetition anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Rendering Primary/Coordination/Secondary as the dominant content of any lens | Triad repetition was the original failure.    |
| Showing the propagation chain as weighted nodes anywhere except the demoted topology strip | Reverts the demotion decision.|
| Showing the same evidence_blocks triad as cards in multiple lenses | Cards-everywhere regression.                       |
| Repeating the same actor (other than the constant Report Pack) in multiple lenses without distinct rendering | Mode-differentiation collapse. |

---

## 7. Mode-differentiation anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| Same field gradient signature across modes                | Eliminates atmospheric differentiation.                    |
| Same actor composition across modes                       | Eliminates semantic differentiation.                       |
| Same interpretation tag label across modes                | Eliminates the mode-reactive interpretation companion.     |
| Same canvas envelope dimensions across modes              | Eliminates BOARDROOM's wider canvas register.              |

---

## 8. Live-binding fake-out anti-patterns

| Anti-pattern                                              | Why forbidden                                              |
|-----------------------------------------------------------|------------------------------------------------------------|
| "Live" / "real-time" labels in chrome                     | Implies binding that doesn't exist.                        |
| Ticker animations or pulse-on-update affordances           | Implies live data flow.                                    |
| "Last updated: <time>" / "fetched: <time>" timestamps      | Implies runtime fetch.                                     |
| Spinning loaders or "syncing..." labels                   | Implies async hydration.                                   |
| Per-client / per-run identifiers in the surface chrome     | Implies live multi-tenancy.                                |

The "binding pending — live client/run integration not yet active" caption is the only honest representation of binding state.

---

## 9. Anti-pattern detection workflow

Future contracts that propose visual additions to LENS V2 should be evaluated against this register:

1. List the proposed visual additions.
2. For each addition, check if it triggers any anti-pattern category above.
3. If yes — the addition is forbidden unless an explicit override contract is issued.
4. If no — the addition may proceed, subject to the rest of the doctrine.

A single anti-pattern hit blocks the addition.

---

## 10. Authority

This anti-pattern register is authoritative. Future contracts must consult this document before proposing any visual change that might trigger one of these patterns. The register may be extended (with explicit additions) but not relaxed.

---

**End of semantic field anti-patterns.**
