# Execution Report — PI.LENS.V2.PHASE4.READING-GUIDE-AND-TERM-DECODE.01

## Stream Classification: G2 (architecture-consuming)

## 1. Pre-flight

| Check | Result |
|-------|--------|
| Branch: work/lens-v2-productization | VERIFIED |
| CLAUDE.md loaded | YES |
| Inputs present (IntelligenceField, InvestigationTraceField, lens-v2-flagship.js) | YES |
| Prior stream dependency: PI.LENS.V2.PHASE3B.GOVERNANCE-VISIBILITY-RECALIBRATION.01 | COMPLETE |
| Build baseline clean | YES |

## 2. Objective

Restore self-explanatory quality from the Tier-2 Diagnostic into the Investigation View. Create a visible inline reading guide preamble with prose on pressure zones, compound zones, and attribution. Create contextual term decode via hover tooltips on structural terms within the investigation data.

## 3. Implementation

### 3.1 InvestigationReadingGuide.jsx — Inline Preamble + TermHint

**Reading Guide (visible inline preamble):**

Renders as ambient prose block at the top of InvestigationTraceField, before the evidence trace actor. Always visible — no toggle, no collapse. Typographically distinct from the data actors (sans-serif, blue left border, lighter background).

Four prose paragraphs covering:
1. Propagation roles and what they mean for pressure attribution
2. Pressure tiers — derived from structural computation, not subjective assessment
3. Compound zones — convergent pressure amplifying exposure non-linearly
4. Hint line directing analysts to dotted-underline terms for contextual decode

**Term Decode (contextual hover via TermHint component):**

`TermHint` wraps structural terms in the investigation data with dotted underlines. On hover, a tooltip appears with:
- Executive decode: plain-language meaning
- Technical decode: precise computational definition

12 terms decoded:
| Term | Category |
|------|----------|
| ORIGIN | Propagation role |
| PASS-THROUGH / PASS_THROUGH | Propagation role |
| RECEIVER | Propagation role |
| HIGH | Pressure tier |
| ELEVATED | Pressure tier |
| MODERATE | Pressure tier |
| LOW | Pressure tier |
| structurally backed | Grounding status |
| semantic-only | Grounding status |
| advisory bound | Qualifier mandate |
| Confidence | Evidence quality |

### 3.2 IntelligenceField.jsx — Integration

- Import: `InvestigationReadingGuide` (default) and `TermHint` (named)
- Reading guide rendered at top of `InvestigationTraceField` (after RepModeTag, before evidence trace)
- TermHint wrappers on signal stack terms: pressure_tier, Confidence label, advisory bound flag

### 3.3 CSS (lens-v2-flagship.js)

Reading guide preamble CSS:
- `.reading-guide-preamble`: Left-border accent, subtle blue tint background
- `.reading-guide-preamble-label`: 9px uppercase section label
- `.reading-guide-prose`: 12px sans-serif body text, distinct from monospace data
- `.reading-guide-prose--hint`: Italic hint line for decode instructions

Term hint tooltip CSS:
- `.term-hint`: Dotted underline, help cursor
- `.term-hint-popup`: Positioned tooltip with shadow, arrow indicator
- `.term-hint-popup-exec`: Executive decode (light text, sans-serif)
- `.term-hint-popup-tech`: Technical decode (dim monospace, border separator)

## 4. Design Decision — Initial vs Revised Approach

Initial implementation used expandable toggle buttons at the bottom of InvestigationTraceField. User feedback: "the screen is presenting so many chips now I just do not notice them." Toggle buttons blended into existing chip/button visual noise and were not discoverable.

Revised approach:
- Reading guide renders as visible inline prose — no discovery required
- Term decode activates contextually on the terms themselves — no separate panel
- Analyst immediately feels oriented on entering investigation view

## 5. What was NOT changed

- IntelligenceField: no BALANCED/DENSE/BOARDROOM rendering changes
- GenericSemanticPayloadResolver: no payload changes
- Signal computation: no changes
- Topology: no changes
- SQO routes: no changes
- Qualification engine: no changes
- Investigation resolver: no changes
- Existing payload fields: no mutations

## 6. Build Verification

```
npx next build — PASS
Routes verified:
  /lens-v2-flagship — PRESENT
  /lens/[client]/[run] — PRESENT
  /sqo/client/[client]/run/* — ALL PRESENT

JS bundle verification:
  reading-guide-preamble in bundle: CONFIRMED
  HOW TO READ THIS VIEW in bundle: CONFIRMED
  term-hint / term-hint-popup in bundle: CONFIRMED
  Old toggle UI removed: CONFIRMED (no reading-guide-toggle, no reading-guide-shell)

Zone coverage validation:
  EXECUTIVE_BALANCED: 9/9 — COMPLETE
  EXECUTIVE_DENSE: 9/9 — COMPLETE
  INVESTIGATION_DENSE: 9/9 — COMPLETE
  BOARDROOM: 9/9 — COMPLETE
```

## 7. Regression Assessment

- InvestigationReadingGuide: rewritten (same file, new approach). No other component files affected.
- IntelligenceField: 1 import changed (added TermHint), reading guide moved from bottom to top, 3 TermHint wrappers added to signal rows
- CSS: old toggle/section CSS replaced with preamble/tooltip CSS, same namespaces
- No changes to BALANCED, DENSE, or BOARDROOM rendering paths
