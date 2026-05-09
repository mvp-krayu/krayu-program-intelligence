# LENS v2 Flagship — Experience Elevation Visual Doctrine

**Stream:** PI.LENS.V2.FLAGSHIP-EXPERIENCE-ELEVATION.01  
**Branch:** work/lens-v2-productization  
**Status:** AUTHORITATIVE

---

## Doctrine Purpose

This document defines the visual authority principles that govern the LENS v2 flagship experience.  
These principles are not stylistic preferences — they are binding design invariants.

---

## I. State Primacy

The renderState is the single most important piece of information in the experience.

**Rule:** The readiness state declaration must be dominant over every other element in the viewport.  
**Implementation:** 44px bold uppercase, state-reactive color (`--state-color`), uncompressed vertical space above it.

State color hierarchy:
- `EXECUTIVE_READY` → Green (`#64ffda`) — full confidence
- `EXECUTIVE_READY_WITH_QUALIFIER` → Amber (`#e6b800`) — qualified confidence
- `DIAGNOSTIC_ONLY` → Orange (`#ff9e4a`) — advisory only
- `BLOCKED` → Red (`#ff6b6b`) — escalation required

---

## II. Qualifier Non-Suppressability

A qualifier is not a warning. It is a mandate.

**Rule:** When `qualifier_notice_visible === true`, the QualifierMandate band MUST render at full width, full prominence, immediately below the declaration zone. It cannot be collapsed, hidden, or styled below visual threshold.

**Implementation:** Full-width amber band with amber border above and below. Qualifier class shown as a labeled chip. Non-negotiable visual weight.

---

## III. Information Architecture

The LENS v2 flagship experience has a defined reading sequence:

1. **State** (what is the readiness verdict?)
2. **Qualifier** (is there an advisory constraint?)
3. **Intelligence** (why is this the verdict?)
4. **Topology** (how did pressure flow?)
5. **Evidence** (what is the underlying signal?)

Every visual decision must reinforce this hierarchy. Elements closer to the top carry more visual authority.

---

## IV. Atmospheric Depth

The background is not neutral. It is atmospheric.

**Rule:** The primary canvas is `#0d0f14`. The authority band and signal column use `#080a0f` — one step deeper. Evidence blocks use `#080a0f`. This layering creates perceived depth without literal 3D.

Surface levels:
- `#080a0f` — deep authority (bands, signal zone, evidence cells)
- `#0d0f14` — primary canvas
- `#141720` — raised card surfaces (not used in elevation design — reserved for future density modes)

---

## V. Typography Scale

Type scale is not decorative. It is semantic.

| Element | Size | Weight | Contrast |
|---|---|---|---|
| Readiness declaration | 44px | 700 | Full (`#ccd6f6` / state color) |
| Executive summary | 15px | 400 | Full (`#ccd6f6`) |
| Why statement | 13px | 400 | Reduced (`#7a8aaa`) |
| Structural findings | 11px | 400 | Dim (`#4a5570`) |
| Domain node name | 12px | 600 | Full (`#ccd6f6`) |
| Evidence description | 11px | 400 | Dim (`#4a5570`) |
| Section labels | 7–8px | 400 | Ghost (`#1e2332` / `#2a2f40`) |
| Governance ribbon | 7px | 400 | Ghost (`#1a1e2b`) |

Section labels are intentionally ghosted — they are navigational, not informational.

---

## VI. Color Temperature

Color carries meaning, not branding.

- **Blue** (`#4a9eff`) — neutral/unknown state accent
- **Green** (`#64ffda`) — ready, confirmed, passing
- **Amber** (`#e6b800`) — qualified, partial, advisory
- **Orange** (`#ff9e4a`) — diagnostic, elevated, marginal
- **Red** (`#ff6b6b`) — blocked, failed, escalation required

These colors MUST NOT be inverted, softened, or used decoratively outside their semantic domain.

---

## VII. Pressure Visualization

Pressure tiers are not labels. They are operational signals.

Each pressure tier has a fixed color, symbol, and visual weight:

| Tier | Color | Symbol | Weight |
|---|---|---|---|
| HIGH | `#ff6b6b` | ▲ | Maximum — border, text, symbol all colored |
| ELEVATED | `#ff9e4a` | △ | High — same as HIGH treatment |
| MODERATE | `#ffd700` | ◇ | Medium — amber treatment |
| LOW | `#64ffda` | ○ | Low — green treatment |

Propagation role coloring:
- ORIGIN → Red (pressure source)
- PASS_THROUGH → Orange (pressure conductor)
- RECEIVER → Amber (pressure destination)

---

## VIII. Animation Governance

**Rule:** Entrance animations are UI choreography only. They MUST NOT simulate propagation flow.

Permitted:
- Opacity fade-in (`v2Appear`)
- Vertical translate + fade (`v2Enter`) — always from bottom to resting position
- Color transitions on state change (`transition: color 0.4s`)

Forbidden:
- Left-to-right sequential node activation (simulates propagation)
- Animated connectors between domain nodes
- Any animation that implies causal flow between topology elements

**Rationale:** VIS-PROP-02 — no animated propagation. The topology visualization is a read-only structural display, not a causal simulation.

---

## IX. Control Minimalism

Controls must not compete with intelligence.

**Rule:** All interactive controls live in the authority band (sticky top). The canvas body contains only governed intelligence output. No inline controls, no floating overlays.

Control philosophy:
- Density switcher: ultra-compact, segment group, 8px labels
- Boardroom toggle: minimal, state-reactive border only
- No sliders, no dropdowns, no free-text input, no search

---

## X. Governance Ribbon

The governance ribbon is evidence, not UI.

**Rule:** The governance ribbon must be the lowest-prominence element in the surface. It confirms invariants; it does not advertise them. 7px text, near-invisible pass states, visible only on failure.

When all invariants pass, the ribbon is nearly invisible. This is the correct behavior — it means the surface is operating correctly. Governance is not a feature. It is a constraint.
