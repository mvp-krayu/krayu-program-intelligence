# Rendering Contract — 42.27

Stream: 42.27 — Projection-Driven Red Node Activation
Source: app/execlens-demo/components/TopologyPanel.js
Date: 2026-03-25

---

## Scope

This contract covers the projection-driven RED node rendering extension to the
42.7 structural topology hierarchy path only.

WOW chain path (`wow_chain === true`) is unchanged.
ENL/persona rendering is out of scope (ENL-010 — separate baseline).

---

## Emphasis Rendering Rules

### CSS Class Mapping

| emphasis value | CSS class | Visual |
|---|---|---|
| `high` | `topo-emphasis-red` | Red border (#ef4444), red background tint, red text (#fca5a5) |
| `medium` | (none — future stream) | No change |
| `low` | (none — future stream) | No change |
| `none` | (none) | No change |
| absent | treated as `none` | No change |

### Application Points

`topo-emphasis-red` is applied at all three hierarchy levels:
- `DomainBlock` — when `domain.emphasis === 'high'`
- `CapabilityGroup` — when `cap.emphasis === 'high'`
- `EntityChip` — when `entity.emphasis === 'high'`

### Coexistence Rules

- Emphasis class and highlight class are independent — a node may carry both
  `topo-cap-highlighted` (query highlight, yellow) and `topo-emphasis-red`
- Emphasis class does not override highlight; CSS specificity is equal; both
  classes apply simultaneously
- `!important` on both classes — no implicit precedence ordering defined here;
  coexistence behavior is visual only and governed downstream

### Source Constraint

- `emphasis` value read from adapter output only — no client-side computation
- `emphasis` value not modified by TopologyPanel.js
- No fallback emphasis value created if field is absent
- No emphasis value inferred from node position, domain membership, or UI state

---

## CSS Definition (globals.css)

```css
/* 42.27 — projection-driven red node activation */
.topo-emphasis-red {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  color: #fca5a5 !important;
}
```

Applied at end of globals.css following the 42.24/42.25 color parity block.

---

## Preserved Behaviors

- Full structural hierarchy rendering (domain → capability → component)
- Query highlight (blue/yellow/teal via 42.24/42.25 color classes)
- Obsidian vault link generation
- Unresolved entity warning icons
- Topology unavailable / loading / error states
- WOW chain render path (disabled via `false &&` — unchanged)
