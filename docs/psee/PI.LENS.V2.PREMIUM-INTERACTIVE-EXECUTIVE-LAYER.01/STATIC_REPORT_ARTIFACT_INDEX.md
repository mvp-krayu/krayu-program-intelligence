# STATIC REPORT ARTIFACT INDEX

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Scope:** Inventory of the four canonical static Tier-1 / Tier-2 report artifacts recognized by LENS V2.

---

## 1. Canonical artifact set

| Artifact id        | Tier      | Filename                                | Purpose                                                                |
|--------------------|-----------|-----------------------------------------|------------------------------------------------------------------------|
| decision-surface   | DECISION  | `lens_decision_surface.html`            | Executive decision surface — readiness, posture, qualifier             |
| tier1-narrative    | TIER-1    | `lens_tier1_narrative_brief.html`       | Tier-1 narrative brief — executive prose                               |
| tier1-evidence     | TIER-1    | `lens_tier1_evidence_brief.html`        | Tier-1 evidence brief — signals, clusters, pressure anchors            |
| tier2-diagnostic   | TIER-2    | `lens_tier2_diagnostic_narrative.html`  | Tier-2 diagnostic narrative — deeper structural / evidence trace       |

These four artifacts are the canonical sellable deliverables in the LENS report tier.

---

## 2. Where they live in the repo

The static reports are produced by upstream report generators and are stored under per-client / per-run paths:

```
clients/
├── blueedge/
│   └── reports/
│       ├── decision/lens_decision_surface.html
│       ├── tier1/lens_tier1_narrative_brief.html
│       ├── tier1/lens_tier1_evidence_brief.html
│       └── tier2/lens_tier2_diagnostic_narrative.html
├── fastapi/
│   ├── reports/
│   │   ├── tier1/lens_tier1_narrative_brief.html
│   │   └── tier1/lens_tier1_evidence_brief.html
│   ├── lens/current/
│   │   ├── decision/lens_decision_surface.html
│   │   └── tier1/...
│   └── psee/runs/run_<run_id>/reports/
│       ├── lens_decision_surface.html
│       ├── lens_tier1_narrative_brief.html
│       ├── lens_tier1_evidence_brief.html
│       └── lens_tier2_diagnostic_narrative.html
└── <other clients>/reports/...
```

Note: the precise directory tree varies per client. The future binding API specified in `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md` must handle this variance through a documented resolver.

---

## 3. Repository convention

The convention observed during this stream's inspection:

- Tier-1 artifacts → `clients/<client_id>/reports/tier1/<filename>` or `clients/<client_id>/lens/current/tier1/<filename>`.
- Tier-2 artifacts → `clients/<client_id>/reports/tier2/<filename>` or via `psee/runs/<run_id>/reports/<filename>`.
- Decision artifacts → `clients/<client_id>/reports/decision/<filename>` or `clients/<client_id>/lens/current/decision/<filename>`.

Some clients have both `reports/` (latest snapshot) and `psee/runs/<run_id>/reports/` (per-run history). The future binding must distinguish these.

---

## 4. What each artifact provides (operational)

### Decision Surface (`lens_decision_surface.html`)

- Readiness state at the top.
- Qualifier state (if any).
- Executive operating posture.
- Confidence boundary.
- Anchors a Tier-1 / Tier-2 deliverable to a single explicit decision summary.

### Tier-1 Narrative Brief (`lens_tier1_narrative_brief.html`)

- Executive narrative paragraph (the same executive_summary shape as in the LENS V2 fixture).
- Why-this-matters articulation.
- Structural summary.
- Optional resolution boundary text.

### Tier-1 Evidence Brief (`lens_tier1_evidence_brief.html`)

- Per-domain evidence blocks.
- Per-block signals (active PSIGs).
- Cluster concentration / topology scope.
- Pressure anchors per propagation role.

### Tier-2 Diagnostic Narrative (`lens_tier2_diagnostic_narrative.html`)

- Deeper diagnostic / forensic structure.
- Trace from observed pressure to qualified receiver state.
- Evidence refs and confidence boundary.
- Inference prohibition statements.

---

## 5. Mapping into LENS V2 semantic zones

| Static artifact            | Zones it covers                        |
|----------------------------|----------------------------------------|
| Decision Surface            | Z1 Executive Posture                   |
| Tier-1 Narrative Brief       | Z1 Posture · Z2 Resolution Boundary    |
| Tier-1 Evidence Brief        | Z3 Topology · Z4 Pressure Anchor · Z5 Signal Stack · Z6 Cluster Concentration |
| Tier-2 Diagnostic Narrative  | Z3 Topology · Z4 Pressure Anchor · Z5 Signal Stack · Z7 Evidence Trace · Z2 Resolution Boundary |

LENS V2 surfaces the same evidence ground interactively through these zones — but does not consume the report HTML body.

---

## 6. What this index is, and is not

**Is:**

- A canonical inventory of the four artifact files.
- A documented map of where they live in the repo.
- A documented mapping of which LENS V2 zones each artifact's evidence ground covers.

**Is not:**

- A loader.
- A live route to the files.
- A guarantee that every client/run has all four artifacts.
- A statement that LENS V2 reads these files (it does not).

The future binding (per `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md`) will turn the documented placeholder into a live access path.

---

## 7. Authority

This index is authoritative for the canonical artifact set and naming. Future report-generation contracts must conform to these filenames or explicitly amend this index.

---

**End of static report artifact index.**
