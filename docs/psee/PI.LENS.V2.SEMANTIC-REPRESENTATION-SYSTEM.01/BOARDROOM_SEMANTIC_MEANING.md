# BOARDROOM SEMANTIC MEANING

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Scope:** What the BOARDROOM circle now means semantically.

---

## 1. The previous failure

Before this stream, BOARDROOM displayed a 168px state-color ring with a surrounding glow halo. The ring was visually striking but **semantically empty** — it was a decorative atmospheric mark.

When asked "what does the ring mean?", the only honest answer was "it represents the operational state's color register." That is decoration, not semantic representation.

The contract for this stream demanded the ring be given semantic meaning.

---

## 2. The decision

The BOARDROOM ring is now a **Confidence Envelope** — a visualization of the Confidence Boundary semantic actor (B · CB).

The ring is rendered with a CSS `conic-gradient` that splits the circle into two arcs:

- **Filled state-color arc** for the structurally-backed portion of the assessment (the grounded-domain ratio).
- **Yellow-tinted arc** for the advisory-bounded portion (the remaining ratio).

A donut mask creates the inner empty space; a center label shows the qualifier-class (e.g. "Q-01") with sub-label "qualified-ready."

Below the ring, a two-row readout makes the meaning explicit:

```
● 67% structurally backed
● 33% advisory bound
```

---

## 3. The semantic mapping

The ring represents:

- **The grounded-evidence boundary of the assessment** — what proportion of domains are structurally backed.
- **The advisory-bound boundary** — what proportion is partial-grounded and therefore advisory.
- **The qualifier-class anchor** — the central label states the qualifier in effect.
- **The decision posture** — the surrounding state-color binds the ring to the operational readiness state.

Together, these elements compose the Confidence Envelope: a single visual answer to the question "how confident is this assessment, and where are its boundaries?"

---

## 4. What the ring is NOT

The ring is no longer:

- A decorative atmospheric mark.
- A glow halo without semantic content.
- An indicator of "state color, period."
- A logo / brand element.

The ring **is** an operational reading of the assessment's confidence envelope. If the ring vanished, the BOARDROOM lens would lose its primary semantic anchor.

---

## 5. The implementation

```jsx
<div className="rep-board-mark"
     aria-label={`Confidence envelope: ${groundedPct}% structurally backed, ${advisoryPct}% advisory bound`}>
  <div className="rep-board-envelope">
    <div className="rep-board-envelope-arc"
         style={{
           background: `conic-gradient(
             var(--state-color) 0deg ${groundedPct * 3.6}deg,
             rgba(230,184,0,0.55) ${groundedPct * 3.6}deg 360deg
           )`,
         }} />
    <div className="rep-board-envelope-mask" />
    <div className="rep-board-envelope-center">
      <div className="rep-board-envelope-state">
        {chip.class_label || chip.qualifier_class || badge.state_label}
      </div>
      <div className="rep-board-envelope-sub">qualified-ready</div>
    </div>
  </div>
</div>
```

- The arc is a conic-gradient, computed from `grounded_domain_count / domain_count`.
- The mask is an inner circle that creates the donut shape.
- The center label is the qualifier-class chip (or the readiness state-label as fallback).

---

## 6. Boardroom composition with semantic meaning

The full BOARDROOM canvas now reads as:

```
DECISION POSTURE        ← label

╭─────────────────────╮
│   ╱blue arc 67%╲    │
│  ╱              ╲   │
│ │   ╭─────╮      │  │
│ │   │Q-01 │      │  │
│ │   ╰─────╯      │  │
│  ╲ ╱yellow arc╲ ╱   │
│   ╰╳ 33%      ╳╯    │
╰─────────────────────╯

● 67% structurally backed
● 33% advisory bound

Operating posture. Pressure is propagating through coordination —
advisory-bounded at the secondary receiver.

──── ────

PARTIAL COVERAGE
```

Every visual element on the canvas now has explicit semantic content. Nothing is decorative.

---

## 7. The boardroom test

A board-room observer projecting the BOARDROOM canvas should be able to read, at projection distance:

1. The dominant state phrase (declaration, above the IntelligenceField).
2. The label "DECISION POSTURE" above the ring.
3. The ring as a confidence envelope with two visible arc colors.
4. The qualifier-class label inside the ring.
5. The percent readout below the ring.
6. A single supportive sentence.
7. A scope label.

Every element answers a specific question:

- "What state are we in?" → state phrase.
- "Why this state?" → DECISION POSTURE label and ring.
- "How confident is this?" → ring proportions + readout.
- "What's the qualifier?" → ring center.
- "What does it mean?" → supportive sentence.
- "What's the scope?" → footer.

The ring is no longer atmospheric. It is the central semantic actor of the BOARDROOM lens.

---

## 8. Authority

This semantic mapping is authoritative for BOARDROOM. Future contracts that touch the ring must:

1. Preserve its role as Confidence Envelope (B · CB).
2. Preserve the two-arc grounded / advisory split.
3. Preserve the readout below the ring.
4. Preserve the qualifier-class label inside the ring.

Reverting the ring to a decorative mark is forbidden unless an explicit override contract is issued.

---

**End of BOARDROOM semantic meaning.**
