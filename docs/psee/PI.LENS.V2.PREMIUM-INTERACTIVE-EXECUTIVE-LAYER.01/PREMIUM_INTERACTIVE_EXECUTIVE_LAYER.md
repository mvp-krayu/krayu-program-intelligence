# PREMIUM INTERACTIVE EXECUTIVE LAYER — Positioning Document

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Status:** AUTHORITATIVE positioning for the LENS V2 surface relative to static reports.

---

## 0. The two-tier model

The Krayu LENS product is composed of two distinct, complementary tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   LENS V2 — Premium Interactive Executive Layer                        │
│   (this stream + parents)                                              │
│                                                                        │
│   - persona-weighted semantic representation                           │
│   - executive cognition lenses                                         │
│   - cinematic atmospheric surface                                      │
│   - interactive interrogation                                          │
│                                                                        │
└──────────────────────────┬─────────────────────────────────────────────┘
                           │ sits above (does not replace)
                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   Static Tier-1 / Tier-2 Report Artifacts                              │
│                                                                        │
│   - lens_decision_surface.html                                         │
│   - lens_tier1_narrative_brief.html                                    │
│   - lens_tier1_evidence_brief.html                                     │
│   - lens_tier2_diagnostic_narrative.html                               │
│                                                                        │
│   Sellable, generated, governance-compliant deliverables.              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

The two tiers are **connected**, not **collapsed**.

---

## 1. What LENS V2 IS

LENS V2 is the **premium interactive executive layer**.

- It is a cinematic operational intelligence surface.
- It uses persona-weighted lenses (BALANCED / DENSE / INVESTIGATION / BOARDROOM) that map to Executive / Structural / Evidence / Projection cognition.
- It surfaces semantic zones derived from the same evidence the static reports cover.
- It allows an executive operator to *interrogate* and *understand* the underlying assessment in a way the static reports cannot offer.
- It must remain coherent even when its content sources are not yet fully bound to a live client/run pipeline.

It belongs in the L7 executive realization layer per the cinematic doctrine.

---

## 2. What LENS V2 IS NOT

LENS V2 is **not**:

- A re-render of the static reports.
- A page that pastes static report HTML into panels.
- A page that scrapes static report prose into card grids.
- A page that pretends a live pipeline exists when it does not.
- A duplicate report viewer.
- A dashboard that competes with the report tier.

If a future contract proposes to inline static report HTML into LENS V2 panels, that proposal is non-compliant with this positioning. The static reports remain accessed through the **Report Pack** access layer (see `REPORT_PACK_INTEGRATION_MODEL.md`).

---

## 3. What the static report tier IS

The static reports remain the **commercially valid Tier-1 and Tier-2 deliverables**:

- `lens_decision_surface.html` — Decision Surface, the executive consequence summary.
- `lens_tier1_narrative_brief.html` — Tier-1 Narrative Brief.
- `lens_tier1_evidence_brief.html` — Tier-1 Evidence Brief (signals, clusters, pressure anchors).
- `lens_tier2_diagnostic_narrative.html` — Tier-2 Diagnostic Narrative (deeper trace).

These artifacts are produced by the upstream reporting pipeline (existing in the repo under `clients/<client>/reports/...`). They are governance-compliant and self-sufficient.

LENS V2 references them, surfaces them through the Report Pack, and uses their semantic zones as conceptual anchors — **but does not consume their HTML body as runtime content**.

---

## 4. The connection model

LENS V2 connects to the static reports through three layered seams:

### Seam A — Semantic zones

Each zone defined in `SEMANTIC_ZONE_INVENTORY.md` names the semantic objects that LENS V2's interactive panels are designed to surface. Those same semantic objects are present (in different visual form) inside the static reports. The connection is conceptual: same evidence ground, two presentations.

### Seam B — Report Pack access

LENS V2 exposes a calm Report Pack band that names the four canonical artifacts and provides access to them via a documented future-binding path (`/api/report-pack?...`). The Report Pack is not the main interface — it is a controlled artifact access layer at the bottom of the surface.

### Seam C — Future client/run binding

When a real client/run integration is implemented (see `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md`), the same upstream evidence will flow into both:

- the static report generator (producing the four HTML artifacts), and
- the LENS V2 semantic panel payloads (producing the persona-weighted interactive representation).

Until that binding exists, LENS V2 uses a single in-memory fixture (`flagship_real_report.fixture.js`) and the Report Pack entries are guarded placeholders.

---

## 5. Positioning vis-à-vis the cinematic doctrine package

This stream is fully consistent with the cinematic doctrine:

- `VISUAL_DIRECTION_DOCTRINE.md` — atmospheric, restrained, executive register.
- `EXECUTIVE_COGNITION_MODEL.md` — surface optimizes for executive scanning, not analyst exploration.
- `ANTI_DASHBOARD_ENFORCEMENT.md` — Report Pack is a single calm band, not a tile grid.
- `TOPOLOGY_REINTRODUCTION_GUARDRAIL.md` — DENSE topology is small, deliberate, and AI-enriched, not a graph explorer.

The Report Pack honors the anti-dashboard floor: four named artifacts in a row at low contrast, captioned "binding pending" — neither tile-grid nor metric panel.

---

## 6. Commercial positioning

Both tiers are sellable:

- **Tier-1 / Tier-2 reports** — sold as governed artifacts. Document-style. Auditable. Self-contained.
- **LENS V2 premium interactive layer** — sold as premium operational intelligence experience. Persona-weighted. Interactive. Memorable.

A Krayu engagement may include either or both, depending on the client. LENS V2 elevates the deliverable narrative; the static reports anchor the deliverable trust.

---

## 7. Path to live binding

The next stream in the LENS V2 program will most likely be the binding contract that connects upstream evidence to the LENS V2 semantic payloads. That contract should:

- introduce a `/api/report-pack?client=<id>&run=<id>&artifact=<id>` endpoint that resolves to a real file path under `clients/<id>/reports/...`.
- introduce a `/api/lens-payload?client=<id>&run=<id>` endpoint that returns the structured payload the LENS V2 representation panels consume (replacing the in-memory fixture).
- preserve the LENS V2 visual surface unchanged by the binding.
- preserve the four cinematic lenses and their semantic zone mapping.

See `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md` for the full specification.

---

## 8. What this stream changed in the runtime

Single source file modified: `app/execlens-demo/pages/lens-v2-flagship.js`.

Specific additions:

- Semantic zone chips inside each persona-weighted Representation Field (chip stripe under the persona tag).
- Cluster Concentration sub-panel in DENSE mode.
- Report Pack band (REPORT PACK label + four artifact entries with future-binding tooltips, marked aria-disabled "binding pending").
- CSS for zone chips, cluster concentration, and report pack.

No new files were added to the runtime. No new dependencies. No new packages. No new routes. No data invented. No fake pipeline binding.

---

## 9. Authority

This positioning document is authoritative for the relationship between LENS V2 and the static report artifacts. Future contracts that touch either tier MUST consult this document before drafting. If a future contract proposes to collapse the two tiers into a single rendering, the proposal must explicitly override this positioning and provide a governance rationale.

---

**End of premium interactive executive layer positioning document.**
