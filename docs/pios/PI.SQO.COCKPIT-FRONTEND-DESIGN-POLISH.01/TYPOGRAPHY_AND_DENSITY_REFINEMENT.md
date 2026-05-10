# Typography and Density Refinement

## Before

- All text: monospace (Courier New)
- Section titles: 14-16px, inconsistent treatment
- Labels: uniform 10px uppercase everywhere
- Body text: 11-12px monospace
- Hero S-state: 36px
- Padding: 20-24px horizontal, inconsistent
- Element spacing: tight, minimal breathing room

## After

### Typography

- Data values and identifiers: monospace (preserved)
- Descriptions and body text: system sans-serif (font-ui)
- Section titles: 13px uppercase, 0.06em letter-spacing (consistent)
- Labels: varied 9-11px based on hierarchy level
- Hero S-state: 44px with -0.02em letter-spacing
- Narrative text: sans-serif italic with background tint

### Density

- Horizontal padding: 32px (consistent across major zones)
- Hero padding: 36px top, 32px sides, 28px bottom
- Blocker items: 14px 18px internal padding
- Stage cluster: 18px 20px card padding
- Deferred triggers: 10px 14px
- Section title margins: 16-20px bottom (consistent)

### Visual Rhythm

- Zone transitions: subtle gradient separators (blocker zone)
- Consistent gap sizing: 4px (tight), 8px (compact), 16px (standard), 32px (wide)
- Progression section spacing: border-top with 24px padding-top
- Collapse zone section gaps: 4px (deliberate tightness for grouping)

## Design Rationale

Monospace fonts excel at data alignment and technical identification
but create visual fatigue in prose passages. The dual-font strategy:

1. Keeps monospace where precision matters (IDs, values, S-states)
2. Uses sans-serif where readability matters (descriptions, actions, narratives)
3. Maintains the technical operational feel while reducing cognitive load

The density changes follow a consistent 32px horizontal rhythm that
creates visual stability across all zones without wasting screen space.
