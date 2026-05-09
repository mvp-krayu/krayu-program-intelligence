# EXECUTIVE COGNITION MODEL

**Stream:** PI.LENS.V2.VISUAL-DIRECTION-DOCTRINE.01
**Status:** AUTHORITATIVE
**Scope:** Reading model and cognitive contract for the LENS executive surface.

---

## 0. PURPOSE

This document specifies how the executive viewer reads the LENS surface, what they optimize for, what they reject, and how the surface must therefore be constructed.

It is the cognitive counterpart to `VISUAL_DIRECTION_DOCTRINE.md`. Where the doctrine defines visual outcome, this document defines reader behavior. A LENS surface is correctly designed if and only if it serves the reader specified here.

---

## 1. THE READER

The LENS reader is a senior operator. Concretely:

- Program leads, division presidents, COOs, transformation owners, and their direct strategic staff.
- They are accountable for outcomes that span quarters and millions of currency units.
- They have less than ten minutes to form an operating belief about what is happening.
- They are not the engineer who built the data pipeline.
- They are not the analyst who cuts dashboards.
- They are not the AI-curious enthusiast.
- They are the person who will be questioned by the board if the program slips.

The cognitive model is specifically calibrated for that reader.

---

## 2. WHAT EXECUTIVES OPTIMIZE FOR

In order of priority on first read:

1. **Structural comprehension** — "What is the program structurally?" "Where does it sit?"
2. **Pressure recognition** — "Where is something not right?"
3. **Narrative absorption** — "Tell me the story in three sentences."
4. **Evidence confidence** — "How sure should I be of this?"
5. **Strategic interpretation** — "What do I do with this in my next meeting?"
6. **Selective descent** — "On the one thing that worries me, give me the deeper view."

That is the *complete* list. Anything the surface offers that is not in service of this list is decoration or noise.

---

## 3. WHAT EXECUTIVES DO NOT OPTIMIZE FOR

The surface must **not** assume the reader will:

- inspect graph nodes individually
- click through filters to discover meaning
- compose queries
- interpret raw metrics
- traverse hierarchies recreationally
- explore "for fun"
- read documentation
- reason about implementation

If the only path to insight is through these behaviors, the surface has failed the executive cognition contract regardless of how technically capable it is.

---

## 4. SCANNING BEHAVIOR

Executives do not read top-to-bottom. They scan in a recognizable pattern:

1. **Top-left → top-right sweep** — capture identity, state, time.
2. **Center mass anchor** — land on the dominant declaration.
3. **Eye drop** — drop to the immediately-adjacent implication.
4. **Pressure scan** — peripheral check for warning state colors.
5. **Selective descent** — only into one or two zones.
6. **Exit** — the entire interaction is often under 90 seconds.

Implications for the surface:

- Identity, state, and time-of-truth must be in the top band, never below the fold.
- The dominant declaration must occupy center mass with overwhelming visual weight.
- The implication must be physically adjacent to the declaration, not on a separate panel.
- Pressure indicators (escalation, readiness change, propagation) must be peripherally legible — visible without focal effort.
- Descent paths must be obvious and singular per pressure point.

---

## 5. COGNITIVE BUDGET

An executive arriving at LENS has a budget of roughly:

- **5 seconds** to form a first impression of legitimacy.
- **30 seconds** to form a structural belief.
- **90 seconds** to form a directional decision.
- **5 minutes** to descend on any single zone of concern.
- **10 minutes** maximum before fatigue undermines retention.

The surface MUST deliver the first three milestones inside these budgets. Surfaces that defer the structural belief to "click around for a few minutes" violate the budget contract.

---

## 6. INFORMATION HIERARCHY (READER-FACING)

Mandatory order of revelation:

1. **Declaration** — what the system asserts right now, in one sentence.
2. **Executive implication** — what this means for the operator's program, in one or two sentences.
3. **Propagation** — how the assertion moves: source pressure → propagation path → consequence zone.
4. **Evidence confidence** — bounded confidence statement and evidence anchor.
5. **Structural cross-section** — relevant domains, nodes, signals, conditions.
6. **Deep diagnostics** — only for the operator who chooses descent.

Metrics, when present, appear no earlier than tier 3 and serve propagation, never substitute for it.

---

## 7. NARRATIVE CONTRACT

The executive expects the surface to *speak* as much as it shows.

Narrative requirements:

- Each major zone has a one-sentence narrative line at executive register.
- Lines name the program element, the operational state, and the consequence.
- Lines are operational, not topological. ("Commercial readiness is being undermined by an unresolved finance dependency" — not "node-3a is propagating pressure to node-7c at confidence 0.62".)
- Lines are calm. They never shout.
- Lines admit uncertainty by language, not by hiding it.

If the narrative reads like a system log or a topology dump, the cognition contract is broken.

---

## 8. CONFIDENCE AND UNCERTAINTY HANDLING

Executives are far more sensitive to over-stated confidence than to admitted uncertainty.

Required behaviors:

- Confidence is communicated as a bounded register: high / supported / partial / weak / unsupported. Numerical confidence may be shown but is never the only carrier.
- Uncertainty is visible. Hidden uncertainty is a failure even if the data is accurate, because the executive infers it later and loses trust in the surface.
- "We do not yet know" is a valid LENS state and must be designable. Empty states are first-class, not error states.
- Inference is always anchored to evidence. The reader can always trace from a stated implication back to at least one evidence reference.

---

## 9. ATTENTION ECONOMY

The executive's attention is the scarcest resource on the surface. Every visual element competes for it.

Rules:

- The dominant declaration owns ~60% of attention weight.
- Implication and propagation together own ~25%.
- All structural detail competes for the remaining ~15%.
- Anything outside this allocation is borrowing attention from the declaration and must justify the borrow.

Practical consequence: a metric tile that is 30% as visually heavy as the declaration is taking the executive's eye away from the declaration. That is almost always wrong.

---

## 10. WHAT MUST NEVER BE PRESENT IN AN EXECUTIVE SURFACE

These are hard rejects regardless of feature value:

- Floating chat assistants on the main reading surface.
- Onboarding overlays in production view.
- Marketing-style hero blocks.
- "What's new" callouts.
- Animated celebratory states.
- Achievement / gamification badges.
- Empty placeholder skeletons that persist past first paint.
- Generic "no data" illustrations.
- Branding banners that compete with the declaration.

Each of these silently re-encodes the surface as a SaaS product, which collapses executive trust in seconds.

---

## 11. DESCENT BEHAVIOR

When the executive does descend into a zone, their cognitive contract changes:

- They now expect *more* density, not less, in that single zone.
- They expect the descent to preserve the structural narrative, not abandon it for raw data.
- They expect to return to the overview without losing their place.
- They expect a clear "back to surface" affordance.
- They expect descent to terminate. Bottomless drill-down is a failure.

The descent zone may show metrics, evidence detail, and propagation chains. The overview may not.

---

## 12. EMOTIONAL CONTRACT

The reader's emotional state must remain inside this band at all times:

- focused, not anxious
- serious, not depressed
- alert, not adrenalized
- confident, not falsely-reassured

Visual systems that push the reader outside this band — flashing alerts, aggressive red palettes, panicked loading sequences — break the contract even if their information is accurate.

The surface speaks in the calm, low voice of an institutional briefing. It does not raise its voice. The pressure speaks for itself by *what is said*, not by *how loud the surface is*.

---

## 13. INSTITUTIONAL TRUST CONTRACT

LENS is being read by people who will use what they read to make decisions affecting jobs, capital, and reputation. This places trust at the center of the design contract.

Trust is built by:

- Visible evidence anchoring.
- Bounded confidence language.
- Consistent typography and rhythm across the surface.
- Absence of marketing register.
- Absence of decorative effects that read as "designed to impress."
- Empty / partial states that are honest, not papered over.

Trust is destroyed by:

- Synthetic-sounding narratives.
- Mismatched register between zones.
- Decorative animations.
- Hidden uncertainty.
- Surface elements that imply more authority than the system has earned.

Trust, once lost on this surface, is not recovered in the same session.

---

## 14. INTERACTION CONTRACT

The executive surface assumes:

- The reader will hover, never drag.
- The reader will click at most three times before exit.
- The reader will not scroll horizontally.
- The reader will scroll vertically only if the surface invites it with clear continuation cues.
- The reader expects keyboard shortcuts only if explicitly disclosed.
- The reader will not invoke a command palette unless the role demands it.

Any interaction beyond hover-to-reveal-detail and single-click descent must be justified. A LENS surface that requires the executive to drag, lasso, or compose is misdesigned for this reader, regardless of how powerful the interaction is.

---

## 15. PERFORMANCE EXPECTATION

Executive trust collapses if:

- First meaningful paint is over 1.2 seconds.
- The dominant declaration appears later than the structural detail (declaration must lead the paint, not trail it).
- Layout shifts after first paint.
- Hover reveals lag perceptibly.
- Descent transitions stutter.

Performance is part of the cognitive model, not a downstream concern.

---

## 16. FAILURE MODES TO TEST AGAINST

A LENS redesign must be specifically tested against these failure modes:

| Failure mode             | Symptom                                                            |
|--------------------------|--------------------------------------------------------------------|
| Dashboard collapse       | Reader names the surface "another analytics tool" within 10s.      |
| Topology jargon trap     | Reader reports "graph stuff" instead of operational meaning.       |
| Hidden anchor            | Reader cannot find where to look first within 5s.                  |
| Pressure invisibility    | Reader misses an active escalation on first scan.                  |
| Synthetic register       | Reader describes the language as "AI-sounding."                    |
| Confidence inflation     | Reader assigns more certainty to a claim than the evidence allows. |
| Descent frustration      | Reader descends and cannot find their way back.                    |

Each failure mode has a corresponding test in `VISUAL_EVALUATION_RUBRIC.md`.

---

## 17. CONTRACT WITH THE DOCTRINE

This cognition model and `VISUAL_DIRECTION_DOCTRINE.md` are paired. Either alone is incomplete:

- The doctrine without this model produces beautiful surfaces that no executive can read.
- This model without the doctrine produces readable surfaces that look generic.

A redesign passes only when both are satisfied.

---

**End of cognition model.**
