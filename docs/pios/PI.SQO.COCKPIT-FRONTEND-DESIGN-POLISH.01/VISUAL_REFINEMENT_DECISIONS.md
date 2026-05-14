# Visual Refinement Decisions

## Decision 1: Typography Split

**Choice**: Use `var(--font-ui)` (system sans-serif) for description/body text;
preserve `var(--font-mono)` for data values, labels, and identifiers.

**Rationale**: Monospace fonts optimize for data density and alignment but
reduce readability in prose passages. Descriptions, narratives, and action
text benefit from proportional typography while technical identifiers (debt
IDs, S-states, pathway codes) retain monospace for precision.

## Decision 2: Elevation via Box-Shadow

**Choice**: Subtle `box-shadow: 0 1px 4px rgba(0,0,0,0.15)` on blocker
items and stage cluster cards, with hover amplification to `0 2px 8px`.

**Rationale**: The previous design relied solely on borders for visual
separation. On dark backgrounds, border-only cards feel flat. Subtle
shadow provides depth without violating the restrained aesthetic.

## Decision 3: Hero Blockage Inset Shadow

**Choice**: `box-shadow: inset 3px 0 0 var(--severity-color)` on blockage
cards instead of relying solely on background tint and border.

**Rationale**: The severity lane (left inset) creates a stronger visual
anchor for the blockage card while maintaining the restraint of the
overall design. Projection (red), expansion (blue), and remediation
(orange) severity lanes are immediately recognizable.

## Decision 4: Narrative Block Treatment

**Choice**: Background tint + left border + italic font-ui instead of
border-top separator + italic monospace.

**Rationale**: The narrative is interpretive context, not operational data.
A quotation-style treatment (left border, subtle background) visually
separates it from the data-driven hero metrics.

## Decision 5: Deferred Zone Quieter Treatment

**Choice**: Smaller title (11px), reduced font-weight (600 vs 700),
higher letter-spacing, subtler trigger hover.

**Rationale**: The contract requires deferred debt to be visually
quieter than active operational content. Reducing the title weight
and size relative to other section titles creates deliberate
information hierarchy: hero > blockers > operational > deferred.

## Decision 6: Navigation as Sticky Sidebar

**Choice**: `position: sticky; top: 0; align-self: flex-start` with
220px fixed width.

**Rationale**: The cockpit is long-form operational content. Navigation
must remain accessible during scrolling without consuming excessive
width. Sticky positioning keeps it visible without the z-index
complexity of fixed positioning.

## Decision 7: Section Title Consistency

**Choice**: All secondary section titles use `text-transform: uppercase;
letter-spacing: 0.06em; font-size: 13px`.

**Rationale**: Creates consistent visual cadence across zones. The hero
S-state (44px) anchors the hierarchy; section titles maintain a
uniform secondary prominence level without competing.

## Decision 8: Interaction Transitions

**Choice**: Global `transition: 0.15s ease` on all interactive elements
within `.sqo-cockpit`.

**Rationale**: Abrupt state changes feel unpolished. 150ms is fast
enough to feel responsive while eliminating visual jarring. Applied
universally for consistency rather than per-element to maintain
coherent interaction feel.
