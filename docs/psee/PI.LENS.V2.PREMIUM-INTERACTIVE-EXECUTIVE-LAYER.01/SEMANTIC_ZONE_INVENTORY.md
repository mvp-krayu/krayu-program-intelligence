# SEMANTIC ZONE INVENTORY

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Authority:** Canonical inventory of the eight semantic zones used by LENS V2.

---

## 0. Inventory shape

Each zone is a *semantic object family* — a grouping of structurally meaningful concepts that:

- exists in the upstream evidence,
- is visualized differently in the static Tier-1 / Tier-2 reports,
- is surfaced interactively in the LENS V2 representation field with persona-weighted emphasis.

Zones are identified by a stable Z-prefixed id. The id appears in the runtime as small chips inside each lens (see `MODE_BEHAVIOR_MATRIX.md` and on-screen captures).

---

## 1. Z1 — Executive Posture Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z1                                                                                     |
| zone_name                      | Executive Posture                                                                      |
| source artifact family         | Decision Surface · Tier-1 Narrative Brief                                              |
| semantic purpose               | decision posture · readiness state · qualifier state · confidence boundary · executive consequence |
| persona visibility (primary)   | BALANCED · BOARDROOM                                                                   |
| persona visibility (secondary) | INVESTIGATION (resolution boundary cue)                                                |
| rendering rule                 | AI-enriched executive representation; never copied report prose                         |
| forbidden                      | pasting Decision Surface paragraphs as panel content                                    |

### Visible signature in LENS V2

- Declaration zone (top of the page) carries the Z1 reading at maximum focal weight.
- BALANCED Representation Field opens with a calm consequence statement (Z1).
- BOARDROOM Representation Field collapses Z1 to an atmospheric mark + supporting sentence.

---

## 2. Z2 — Resolution Boundary Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z2                                                                                     |
| zone_name                      | Resolution Boundary                                                                    |
| source artifact family         | Tier-1 Narrative Brief · Decision Surface · Tier-2 Diagnostic Narrative                |
| semantic purpose               | what is known · what remains unknown · evidence boundary · execution-not-yet-validated · confidence limitation |
| persona visibility (primary)   | BALANCED · INVESTIGATION                                                               |
| persona visibility (secondary) | BOARDROOM (compact summary)                                                            |
| rendering rule                 | known/unknown boundary as a governed semantic object; not a "limitations" footer text  |
| forbidden                      | hiding known unknowns; over-claiming resolution                                         |

### Visible signature in LENS V2

- Qualifier mandate band states the resolution boundary above the IntelligenceField.
- BALANCED Z2 chip appears in the rep field tag stripe.
- Compact evidence-state block surfaces qualifier-in-effect at the bottom of the rep field.
- INVESTIGATION trace bands carry per-band confidence rows (this is the evidence-side of Z2).

---

## 3. Z3 — Semantic Topology Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z3                                                                                     |
| zone_name                      | Semantic Topology                                                                      |
| source artifact family         | Tier-1 Evidence Brief · Tier-2 Diagnostic Narrative                                    |
| semantic purpose               | semantic domains · structural backing · semantic-only areas · lineage state · domain relationships · topology representation |
| persona visibility (primary)   | DENSE · INVESTIGATION                                                                  |
| persona visibility (secondary) | (none)                                                                                 |
| rendering rule                 | AI-enriched semantic representation; not a paste of prior static topology              |
| forbidden                      | force-directed graph clutter; old topology panel restoration                           |

### Visible signature in LENS V2

- DENSE Representation Field renders three weighted nodes (ORIGIN / PASS-THROUGH / RECEIVER) connected by gradient edges.
- The lower Propagation Structure Zone is a horizontal pressure chain — also part of the Z3 family.
- See `TOPOLOGY_REINTRODUCTION_GUARDRAIL.md` (parent stream) for the binding rules on what may and may not be added to Z3.

---

## 4. Z4 — Pressure Anchor Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z4                                                                                     |
| zone_name                      | Pressure Anchor                                                                        |
| source artifact family         | Tier-1 Evidence Brief · Tier-2 Diagnostic Narrative                                    |
| semantic purpose               | PZ anchor · structural domain · primary pressure anchor · compound zone · affected domain · pressure state |
| persona visibility (primary)   | DENSE · INVESTIGATION                                                                  |
| persona visibility (secondary) | BALANCED (consequence-path summary)                                                    |
| rendering rule                 | pressure zone as an operational focal object; not a card list                          |
| forbidden                      | repeating the same pressure card across multiple zones                                  |

### Visible signature in LENS V2

- BALANCED rep field anchors (SOURCE PRESSURE / COORDINATION ABSORPTION / SECONDARY IMPACT) carry Z4 cues.
- DENSE rep field nodes carry tier glow (HIGH / ELEVATED / MODERATE) — the focal pressure state.
- Z4 chip appears in BALANCED, DENSE, and INVESTIGATION rep field tag stripes.

---

## 5. Z5 — Signal Stack Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z5                                                                                     |
| zone_name                      | Signal Stack                                                                           |
| source artifact family         | Tier-1 Evidence Brief · Tier-2 Diagnostic Narrative                                    |
| semantic purpose               | active PSIGs · inactive PSIGs · signal confidence · source attribution · pressure contribution |
| persona visibility (primary)   | INVESTIGATION · DENSE                                                                  |
| persona visibility (secondary) | (none)                                                                                 |
| rendering rule                 | signals grouped by semantic role; not isolated evidence cards                          |
| forbidden                      | repeating each signal as a separate card with same shape                               |

### Visible signature in LENS V2

- INVESTIGATION rep field trace bands group signals by role (Observed pressure / Propagation absorption / Qualified receiver state).
- The lower Evidence Layer composes a dominant signal block with two supporting blocks — Z5 dominance over repetition.

---

## 6. Z6 — Cluster Concentration Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z6                                                                                     |
| zone_name                      | Cluster Concentration                                                                  |
| source artifact family         | Tier-1 Evidence Brief · Tier-1 Narrative Brief                                         |
| semantic purpose               | cluster topology intelligence · dominant structural mass · concentration factor · structural center of gravity · topology salience |
| persona visibility (primary)   | DENSE · INVESTIGATION                                                                  |
| persona visibility (secondary) | (none)                                                                                 |
| rendering rule                 | semantic concentration panel; not a table copy                                         |
| forbidden                      | re-rendering raw cluster tables                                                        |

### Visible signature in LENS V2

- DENSE rep field includes a Cluster Concentration sub-panel (added in this iteration): a thin progress-bar showing grounded-domain ratio, plus operational caption "47 clusters monitored · 2 of 3 domains fully grounded."
- This is the only place Z6 surfaces interactively today.

---

## 7. Z7 — Evidence Trace Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z7                                                                                     |
| zone_name                      | Evidence Trace                                                                         |
| source artifact family         | Tier-1 Evidence Brief · Tier-2 Diagnostic Narrative                                    |
| semantic purpose               | traceability · evidence refs · confidence · qualifier source · inference prohibition · grounding state |
| persona visibility (primary)   | INVESTIGATION                                                                          |
| persona visibility (secondary) | (none)                                                                                 |
| rendering rule                 | expose evidence provenance and confidence boundary; not a raw report body              |
| forbidden                      | dumping JSON, full HTML body, or unstructured trace text                                |

### Visible signature in LENS V2

- INVESTIGATION rep field trace bands carry the evidence_text (drawn verbatim from `flagship_real_report.fixture.js`) plus confidence row with grounding label and "advisory bound" flag for partial grounding.

---

## 8. Z8 — Report Pack Access Zone

| Field                          | Value                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------|
| zone_id                        | Z8                                                                                     |
| zone_name                      | Report Pack Access                                                                     |
| source artifact family         | all four static reports                                                                |
| semantic purpose               | premium access to official generated report artifacts                                  |
| persona visibility (primary)   | All lenses (visible in BALANCED, DENSE, INVESTIGATION, BOARDROOM)                      |
| persona visibility (secondary) | n/a                                                                                    |
| rendering rule                 | controlled artifact access layer; not main interface                                   |
| forbidden                      | letting Report Pack dominate the surface                                               |

### Visible signature in LENS V2

- A single calm band near the bottom of the v2-body, before the GovernanceRibbon.
- "REPORT PACK" label + descriptor "Official generated Tier-1 / Tier-2 deliverables — interactive layer above static artifacts".
- Four artifact entries (Decision Surface · Tier-1 Narrative Brief · Tier-1 Evidence Brief · Tier-2 Diagnostic Narrative), each marked aria-disabled with "binding pending" caption and a tooltip carrying the future-binding path.

---

## 9. Quick zone roll-up

```
Z1  Executive Posture            (BALANCED, BOARDROOM, INVESTIGATION-secondary)
Z2  Resolution Boundary           (BALANCED, INVESTIGATION, BOARDROOM-summary)
Z3  Semantic Topology             (DENSE, INVESTIGATION)
Z4  Pressure Anchor               (DENSE, INVESTIGATION, BALANCED-summary)
Z5  Signal Stack                  (INVESTIGATION, DENSE)
Z6  Cluster Concentration         (DENSE, INVESTIGATION)
Z7  Evidence Trace                (INVESTIGATION)
Z8  Report Pack Access            (all lenses)
```

---

## 10. Authority

This inventory is authoritative for the LENS V2 semantic zone model. Future contracts that introduce a new zone must:

1. Assign a stable Z-prefixed id (next available is Z9).
2. Specify the source artifact family.
3. Specify the semantic purpose.
4. Specify the persona visibility primary / secondary.
5. Specify the rendering rule and forbidden behaviors.
6. Update this document.

Future contracts that propose collapsing or merging zones must explicitly override this inventory.

---

**End of semantic zone inventory.**
