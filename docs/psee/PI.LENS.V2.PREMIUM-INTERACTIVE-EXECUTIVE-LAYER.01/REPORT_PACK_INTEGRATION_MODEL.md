# REPORT PACK INTEGRATION MODEL

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Scope:** How the static Tier-1 / Tier-2 report artifacts are surfaced through LENS V2 as a controlled access layer.

---

## 1. Concept

The Report Pack is a **controlled artifact access layer** at the bottom of the LENS V2 surface. It:

- names the four canonical static report artifacts
- presents them as accessible deliverables
- carries a tier label per artifact (DECISION · TIER-1 · TIER-2)
- carries a binding state per artifact (PENDING · AVAILABLE)
- never replaces or competes with the LENS V2 interactive layer

The Report Pack is the visible seam that connects LENS V2 (interactive) to the static reports (artifact tier).

---

## 2. Visual contract

### Position
A single horizontal band placed in the page body **after** the EvidenceDepthLayer and **before** the GovernanceRibbon.

### Composition

```
[ REPORT PACK                      ]   [ DECISION       ]  [ TIER-1     ]  [ TIER-1     ]  [ TIER-2          ]
[ Official generated Tier-1 / ... ]    [ Decision       ]  [ Narrative  ]  [ Evidence   ]  [ Diagnostic      ]
                                       [ Surface        ]  [ Brief      ]  [ Brief      ]  [ Narrative       ]
                                       [ • binding      ]  [ • binding  ]  [ • binding  ]  [ • binding       ]
                                       [   pending      ]  [   pending  ]  [   pending  ]  [   pending       ]
```

- Left: REPORT PACK label + sub-line.
- Right: 4 artifact entries (1.4fr / 1fr / 1fr / 1.2fr grid; collapses to 2-col on narrow viewports).
- Each entry: tier label + name + binding state caption + state dot.

### Visual register
- Calm, low-contrast.
- Background `rgba(8,10,15,0.45→0.65)` gradient.
- Each artifact entry uses the same panel rhythm as the surrounding rep fields.
- `aria-disabled="true"` until binding is live.
- Hover lifts the border subtly; cursor remains `not-allowed` while binding is pending.

### Anti-pattern check
- **Not a tile grid.** Four entries in a row is the doctrine ceiling for grid-gravity, and the entries are not visually identical (the first has a wider column).
- **Not a dashboard.** No KPI numbers, no charts, no sparklines.
- **Not a sidebar.** Single horizontal band, not a left or right rail.

---

## 3. Artifact registry

The current registry is hard-coded in `app/execlens-demo/pages/lens-v2-flagship.js` as `REPORT_PACK_ARTIFACTS`:

```js
[
  { id: 'decision-surface',  tier: 'DECISION', name: 'Decision Surface',          file: 'lens_decision_surface.html'          },
  { id: 'tier1-narrative',   tier: 'TIER-1',   name: 'Tier-1 Narrative Brief',     file: 'lens_tier1_narrative_brief.html'     },
  { id: 'tier1-evidence',    tier: 'TIER-1',   name: 'Tier-1 Evidence Brief',      file: 'lens_tier1_evidence_brief.html'      },
  { id: 'tier2-diagnostic',  tier: 'TIER-2',   name: 'Tier-2 Diagnostic Narrative',file: 'lens_tier2_diagnostic_narrative.html'},
]
```

The `binding_path` for each is the future API path (see §4). The registry is the single source of truth for what the Report Pack surfaces.

---

## 4. Future binding path

Each artifact carries a `binding_path` of the form:

```
/api/report-pack?artifact=<id>&client=<client_id>&run=<run_id>
```

Examples (future):

```
/api/report-pack?artifact=decision-surface&client=blueedge&run=run_03
/api/report-pack?artifact=tier1-narrative&client=fastapi&run=run_02_oss_fastapi_pipeline
```

This API is **not implemented in this stream**. The contract explicitly forbids fake pipeline binding. The path is documented as a placeholder so a future binding stream can implement it without changing the visual surface.

The future API behavior (specified in `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md`):

- Resolves to a real file path under `clients/<client_id>/reports/<tier>/<file>`.
- Streams the static HTML to the browser (with `Content-Type: text/html`).
- Returns 404 with a structured JSON error when the artifact is not generated for the requested client/run.

---

## 5. Binding state machine

```
        ┌───────────┐
        │ PENDING   │ ← initial state for all entries
        └─────┬─────┘
              │ once future binding is implemented and the
              │ artifact is generated for the active client/run
              ▼
        ┌───────────┐
        │ AVAILABLE │
        └─────┬─────┘
              │ if the artifact becomes stale (run regenerated)
              ▼
        ┌───────────┐
        │ STALE     │ (future state — not yet modeled)
        └───────────┘
```

This stream implements PENDING only. AVAILABLE / STALE handling is deferred to the future binding contract.

---

## 6. Visual states (future)

When AVAILABLE, the entry should:

- remove `aria-disabled`
- become a clickable element with `cursor: pointer`
- replace "binding pending" with "open in new tab" or similar
- preserve the same tier / name / panel rhythm

When STALE, the entry should:

- show a warm tint on the state dot
- caption "regenerated upstream" or similar
- remain clickable but warn

These states are designed but not implemented.

---

## 7. Honest binding contract

The Report Pack must never imply an artifact is fetchable when it is not. Concretely:

- All entries are `aria-disabled="true"` while binding is PENDING.
- Tooltips state "binding pending" with the future binding path.
- No fake URL is rendered as if it were live.
- No artifact preview / thumbnail / size / generation timestamp is rendered, since none of these are bound yet.

This honesty is the contract: trust survives the absence of the binding because the absence is itself made visible.

---

## 8. Boundary with the LENS V2 interactive layer

The Report Pack is a **footer-class** element in the LENS V2 surface. It is:

- Not the dominant focal element (the declaration is).
- Not a navigation sidebar.
- Not a tab strip.
- Not a search.
- Not interactive while binding is PENDING.

It coexists with the LENS V2 lens controls (BALANCED / DENSE / INVESTIGATION / BOARDROOM). The Report Pack is the same in every lens — it is not lens-weighted. Its presence is constant; its content does not change with the active lens.

---

## 9. Relationship to commercial positioning

The Report Pack is the visible commercial bridge:

- Tier-1 / Tier-2 reports are the sellable, governance-compliant deliverables.
- LENS V2 is the premium interactive experience.
- The Report Pack expresses, on the LENS V2 surface, that the static deliverables are accessible from within the premium experience.

This communicates two product tiers in one band, without collapsing them.

---

## 10. Authority

This integration model is authoritative for any future change to the Report Pack. Changes must:

1. Preserve the calm, footer-class register.
2. Preserve the four-artifact registry (additions must be explicit).
3. Preserve honest binding-state visibility.
4. Preserve the anti-dashboard discipline.

If a future contract proposes promoting the Report Pack to a primary surface element, that proposal must explicitly override this model.

---

**End of report pack integration model.**
