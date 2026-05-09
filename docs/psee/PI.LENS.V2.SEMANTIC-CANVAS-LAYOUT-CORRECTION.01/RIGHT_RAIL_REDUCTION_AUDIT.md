# RIGHT RAIL REDUCTION AUDIT

**Stream:** PI.LENS.V2.SEMANTIC-CANVAS-LAYOUT-CORRECTION.01
**Scope:** What was removed, kept, or relocated from the previous overloaded right rail.

---

## 1. The previous failure mode

In the predecessor stream (`PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01`), the right rail carried:

- The full `RepresentationField` for the active lens (BALANCED / DENSE / INVESTIGATION / BOARDROOM).
- The persona tag with zone chips.
- All three anchors / nodes / trace bands / atmospheric mark.
- The compact evidence-state at the bottom.
- The dense note (DENSE) and cluster concentration sub-panel (DENSE).

The right rail was simultaneously the **semantic representation surface** AND the **support content** for the page. This was the cramping the contract called out: too much packed into 380px, while the center went unused.

---

## 2. The reduction

The new right rail is a **support-only rail**. It carries:

- **Evidence state block** — readiness state + grounding label + domain / cluster counts.
- **Qualifier block** (when active) — qualifier class + "advisory bound" note.
- **Report Pack block** — REPORT PACK label + descriptor + four artifact items + "binding pending" caption.

That is the entire content of the new right rail. Everything else moved to the center canvas.

---

## 3. What moved to the center canvas

| Element                                                  | Previous location               | New location                  |
|----------------------------------------------------------|---------------------------------|-------------------------------|
| Persona tag (lens label + sub + zone chips)              | Right rail (top of rep-column)  | Center canvas (top of rep-field) |
| BALANCED 3 anchors + consequence statement               | Right rail (rep-column)         | Center canvas                 |
| DENSE 3 nodes + dense note + cluster concentration panel | Right rail (rep-column)         | Center canvas                 |
| INVESTIGATION 3 trace bands                              | Right rail (rep-column)         | Center canvas                 |
| BOARDROOM atmospheric mark + statement + scope           | Right rail (rep-column)         | Center canvas                 |
| Compact `RepEvidenceState` (was duplicated below rep field) | Right rail (footer of rep field) | Removed (folded into right-rail evidence-state block) |

This relocation eliminates duplication of the evidence-state block (it was in two places before) and lets the center hold the cognition surface.

---

## 4. What moved out of the bottom of v2-body

| Element                                  | Previous location                                      | New location                                  |
|------------------------------------------|--------------------------------------------------------|-----------------------------------------------|
| `ReportPackBand` (horizontal full-width) | After EvidenceLayer, before GovernanceRibbon            | Removed; folded into the right rail Report Pack block |

The horizontal Report Pack band is gone. Per the contract, this avoids visual interruption bands and prevents the report pack from feeling like admin/navigation.

---

## 5. Right rail visual contract

```
┌──────────────────────────┐  ← border-left
│                          │
│  EVIDENCE STATE          │
│  Executive Ready —       │
│  Qualified               │
│  Partial Coverage        │
│  3 domains · 47 clusters │
│                          │
├──────────────────────────┤  ← divider
│                          │
│  QUALIFIER               │
│  Q-01                    │
│  ADVISORY BOUND          │
│                          │
├──────────────────────────┤  ← divider, pushed to bottom by margin-top:auto
│                          │
│  REPORT PACK              │
│  Official Tier-1 / Tier-2│
│  deliverables            │
│                          │
│  [DECISION              ]│
│  [Decision Surface       ]│
│                          │
│  [TIER-1                 ]│
│  [Tier-1 Narrative Brief]│
│                          │
│  [TIER-1                 ]│
│  [Tier-1 Evidence Brief ]│
│                          │
│  [TIER-2                 ]│
│  [Tier-2 Diagnostic ...  ]│
│                          │
│  • binding pending —     │
│    live client/run       │
│    integration not yet   │
│    active                │
│                          │
└──────────────────────────┘
```

- 280px target width.
- Calm `rgba(8, 10, 15, 0.42)` background — slightly lifted from the canvas ground.
- Three blocks with horizontal-rule dividers.
- Report Pack pushed to the bottom via `margin-top: auto` so it acts as the rail's footer.
- All Report Pack items `aria-disabled="true"` while binding is PENDING.

---

## 6. Anti-dashboard floor verification

The right rail's Report Pack list of four items — could it read as a tile grid? Audit:

- Items are stacked vertically, not gridded horizontally.
- Items differ in displayed name length (so the rail is not a regular shape grid).
- The list is a single column — not 2x2 or 4x1 — so the grid-gravity rule is not triggered.
- Each item is small and calm, not a tile-class card.
- "binding pending" caption sits below all items as a single unit, not as a per-tile label.

The right rail honors the anti-dashboard floor.

---

## 7. Information density check

Total information density of the new right rail vs the previous overloaded rail:

| Metric                          | Before | After |
|---------------------------------|--------|-------|
| Number of distinct content blocks | ~6 (persona tag + 3 anchors/nodes/bands + dense-note + cluster + evidence-state + qualifier) | 3 (evidence + qualifier + report pack) |
| Vertical real estate            | ~720px on 1440x900 | ~620px |
| Horizontal real estate          | 380px               | 280px  |
| Content unique to lens           | yes (mode-specific)  | no (constant across lenses) |

The new rail is **calmer, narrower, less crowded, and constant across lenses** — exactly what a support rail should be.

---

## 8. What is intentionally absent from the right rail

- The mode-specific representation (now in center).
- Per-anchor / per-node / per-band content (now in center).
- The dense note (now in center).
- The cluster concentration sub-panel (now in center DENSE only).
- Persona tag and zone chips (now in center).
- The atmospheric mark (now in center BOARDROOM).

If a future contract proposes adding any of these back to the right rail, the proposal must explicitly override this audit and provide a rationale.

---

## 9. What is intentionally present in the right rail

- **Evidence state** — every lens reads this. It's the operational ground truth. It belongs always-visible on the right.
- **Qualifier state** — when active, this is the most consequential visible element on the surface. Always-visible on the right.
- **Report Pack** — the bridge to the static report tier. Calm, visible, footer-class.

Three blocks. No more. The rail is a support rail, not a side panel.

---

## 10. Authority

This audit is authoritative for the right-rail content contract. Any future change to the right rail must:

1. Stay within the three-block model unless an explicit override is documented.
2. Preserve the rail-as-support principle.
3. Preserve the constant-across-lenses property of the rail content.
4. Honor the anti-dashboard floor.

---

**End of right rail reduction audit.**
