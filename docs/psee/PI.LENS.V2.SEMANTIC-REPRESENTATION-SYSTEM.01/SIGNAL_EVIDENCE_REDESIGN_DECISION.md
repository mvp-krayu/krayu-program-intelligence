# SIGNAL EVIDENCE — REDESIGN DECISION

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Scope:** Decision and implementation for the previously-crushed Signal Evidence layer.

---

## 1. The previous failure

Before this stream, the surface had a full-width row of three evidence cards below the Propagation Structure Zone:

- Primary Delivery card with evidence description.
- Coordination Layer card with evidence description.
- Secondary Delivery card with evidence description.

The cards repeated the same Primary/Coordination/Secondary triad already rendered semantically by every lens's center canvas. They sat at the bottom of the page, were typographically smaller than the canvas, and read as "crushed footer cards" — visible but not legible at scan distance.

This was the second redundancy on the surface (the first was the Propagation Structure Zone).

---

## 2. The decision

**Decision: gate the Evidence Layer to INVESTIGATION mode only.**

In BALANCED, DENSE, and BOARDROOM the evidence layer is hidden. In INVESTIGATION it is preserved as the contextual descent zone.

Rationale:

- BALANCED is the executive register; the per-block evidence cards belong to a deeper analyst read, not to consequence-first reading.
- DENSE renders structural topology + cluster concentration + absorption — covering the same ground at the *structural* register; the per-block evidence cards would be redundant.
- BOARDROOM is projection-grade; per-block evidence cards are antithetical to the minimal-chrome contract.
- INVESTIGATION is the analyst register; the per-block evidence cards are contextually appropriate as a descent zone.

---

## 3. Why not a complete redesign

Two alternatives were considered:

### Alternative A — redesign as a contextual evidence drawer (collapsed by default)

A drawer affordance in the support rail with an "expand evidence detail" toggle.

**Rejected** because:
- Adds a new interaction pattern (toggle) that contradicts the executive cognition contract (no clicking required).
- The Signal Stack actor in INVESTIGATION already surfaces signal-level evidence with full text — a domain-level drawer would create a third redundancy.

### Alternative B — replace with a single contextual band per density

A new band that adapts content per lens.

**Rejected** because:
- The Evidence Layer's existing components are well-shaped for the analyst register. Removing them in INVESTIGATION would lose useful descent content.
- Adapting per lens introduces complexity without clear benefit; the lens-gating approach is simpler and honest.

---

## 4. The implementation

```jsx
{/* Evidence Layer is gated to INVESTIGATION mode only — in BALANCED, DENSE,
    and BOARDROOM the per-block evidence cards repeated content already
    represented as semantic actors in the center canvas, and read as crushed
    footer cards. INVESTIGATION mode keeps the contextual evidence drawer. */}
{densityClass === 'INVESTIGATION_DENSE' && !boardroomMode && (
  <EvidenceDepthLayer
    evidenceBlocks={FLAGSHIP_REAL_REPORT.evidence_blocks}
    densityClass={densityClass}
  />
)}
```

The `EvidenceDepthLayer` and `EvidenceBlock` components are preserved unchanged. The change is a single conditional render in the v2-body composition.

---

## 5. Per-lens behavior

| Lens          | Evidence Layer visible | Why                                                                  |
|---------------|:----------------------:|----------------------------------------------------------------------|
| BALANCED       |          —             | Executive register; covered by Resolution Boundary actor.            |
| DENSE          |          —             | Structural register; covered by Semantic Topology + Absorption Load.  |
| INVESTIGATION  |          ✓             | Analyst register; supplements Signal Stack with domain-level context. |
| BOARDROOM      |          —             | Projection register; per-block detail antithetical to minimal chrome. |

---

## 6. The companion: Signal Stack actor

The crushed-card problem in non-INVESTIGATION lenses is also addressed by the **Signal Stack** actor (K · SS) which lives inside INVESTIGATION's center canvas. The Signal Stack flattens `signal_cards` into individual signal rows — surfacing per-signal evidence text at full readable size, with confidence rows.

So the analyst now has two complementary actors in INVESTIGATION:

1. **Signal Stack (in canvas)** — signal-level evidence: each individual PSIG with pressure, evidence text, confidence.
2. **Evidence Layer (below IntelligenceField)** — domain-level evidence: each block with `evidence_description` summary.

Together they cover signal + domain. In other lenses, neither is shown — the canvas covers the appropriate register.

---

## 7. The crushed-label problem

The previous "crushed labels" symptom was a function of:

- Small typography in tight footer cards.
- Repetition pulling visual energy from the canvas.
- No semantic anchor differentiating the cards from the canvas content above.

By gating the layer to INVESTIGATION only:

- The label crushing problem disappears in BALANCED / DENSE / BOARDROOM (cards are not rendered).
- In INVESTIGATION, the cards now coexist with the Signal Stack which is the dominant evidence representation; the cards become a calm domain-level supplement.

The crushed-card syndrome is resolved in three lenses by absence and resolved in the fourth by deliberate downgrade to "supplement" status.

---

## 8. Future iterations

If a future contract proposes restoring the Evidence Layer to all lenses, the proposal must:

1. Specify a different visual treatment that does not regress to "crushed footer cards."
2. Justify why per-block evidence is needed in lenses where actor coverage already exists.
3. Demonstrate non-redundancy with the Signal Stack actor.
4. Pass the doctrine's anti-dashboard floor and component-repetition rules.

Until such a contract issues, the lens-gated approach holds.

---

## 9. Authority

This decision is authoritative for the Signal Evidence layer's visibility contract.

---

**End of Signal Evidence redesign decision.**
