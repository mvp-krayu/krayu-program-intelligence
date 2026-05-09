# PROPAGATION STRUCTURE — FUTURE ROLE

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Scope:** What the previous full-width Propagation Structure Zone became and why.

---

## 1. The previous failure

Before this stream, the surface had a full-width "Propagation Structure" zone below the IntelligenceField. It rendered three weighted nodes (Origin / Pass-through / Receiver) with a propagation chain — exactly the same content as DENSE mode's spatial topology and BALANCED mode's three anchor flow.

This was redundancy. The same triad rendered twice on the same page.

---

## 2. The decision

The Propagation Structure Zone has been **demoted to a thin selected-path strip**:

```
SELECTED PATH    Primary Delivery → Coordination Layer → Secondary Delivery   ·   HIGH origin   ·   2 chains captured
```

- Single horizontal line.
- Text-only (no weighted nodes).
- Calm low-contrast register.
- Sits as a contextual breadcrumb between the IntelligenceField and the Evidence Layer.

The strip is **always visible** across all four lenses (it's contextual metadata, not lens-weighted) but it never competes with the center canvas.

---

## 3. Why a strip, not a removal

The strip is preserved (rather than removed entirely) because:

1. The propagation path is operationally meaningful — knowing which domains are in the trace matters.
2. The strip is *not redundant* with any actor — no actor renders the path text verbatim with chain count metadata.
3. The strip is calm enough that it does not pull focus from the center canvas.

If a future contract proposes removing the strip altogether, it must explicitly handle the operational need to see the selected propagation path in plain text.

---

## 4. The Propagation Path actor (D)

The strip is the rendering of the **Propagation Path** semantic actor (D · PP). Per `SEMANTIC_ACTOR_REGISTRY.md`:

- Data source: `trace_block.propagation_path`.
- Persona visibility: not lens-weighted; surfaces below the IntelligenceField.
- Rendering rule: thin horizontal strip with path text + origin tier + chain count.
- Forbidden: redrawing as a graph or weighted node row.

The strip honors the rendering rule.

---

## 5. What changed in source

```js
function StructuralTopologyZone({ evidenceBlocks, propagationChains }) {
  // Demoted to a thin selected-path strip.
  ...
  return (
    <div className="topology-strip" aria-label="Selected propagation path">
      <span className="topology-strip-label">SELECTED PATH</span>
      <span className="topology-strip-path">{primary.path.join(' → ')}</span>
      <span className="topology-strip-sep">·</span>
      <span className="topology-strip-tier">{primary.pressure_tier} origin</span>
      <span className="topology-strip-sep">·</span>
      <span className="topology-strip-meta">N chain(s) captured</span>
    </div>
  )
}
```

The function is preserved (so the v2-body composition does not change shape) but the implementation is now strip-class. The previous `DomainNode` and `PressureConnector` helpers are still defined in the file but no longer rendered (they remain available for any future feature that needs them; the dead code is small and harmless, and removing it would be premature).

---

## 6. Visual outcome

In every lens, the operator now sees the selected propagation path as a single calm strip instead of a competing triad of weighted nodes. The strip provides:

- The path text (e.g. "Primary Delivery → Coordination Layer → Secondary Delivery").
- The origin pressure tier (color-coded text, not a node).
- The chain count (operational metadata).

This is what the contract specified for Propagation Structure.

---

## 7. Authority

The strip-class rendering is authoritative for the Propagation Structure Zone going forward. Restoring full-width weighted nodes is forbidden unless an explicit override contract is issued.

---

**End of Propagation Structure future role.**
