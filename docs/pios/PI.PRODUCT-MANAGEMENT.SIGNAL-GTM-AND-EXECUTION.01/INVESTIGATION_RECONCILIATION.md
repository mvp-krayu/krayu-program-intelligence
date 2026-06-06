# Investigation Reconciliation

> **Problem:** The architecture review established INVESTIGATION as a protocol (action within OPERATOR), not a peer persona. The SKU model reintroduced "LENS INVESTIGATION" as a fifth cognitive mode. This creates inconsistency.

---

## Current Architectural State

**Source:** PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01 (locked 2026-05-29)

- INVESTIGATION_DENSE was assessed and found to be functionally OPERATOR (Verdict A)
- OPERATOR was recognized as an explicit persona
- True INVESTIGATION was deferred to post-Program 1 (Evidence Chain Structuring)
- INVESTIGATION is constitutionally specified but has NO certified implementation

**Vault canonical state (PIOS_CURRENT_CANONICAL_STATE.md):**

> "INVESTIGATION (constitutional — no certified implementation yet, requires Program 1)"

**5-persona model (locked 2026-05-29):**

> BOARDROOM, EXECUTIVE_BALANCED, EXECUTIVE_DENSE, OPERATOR, INVESTIGATION

INVESTIGATION is listed as a persona in the canonical 5-persona model, but with the caveat "constitutional — no certified implementation yet."

---

## The Inconsistency

The architecture says TWO things simultaneously:

1. INVESTIGATION is a **constitutionally defined persona** in the 5-persona model
2. INVESTIGATION has **no certified implementation** — what currently exists under that name is actually OPERATOR capability

The SKU model surfaces "LENS INVESTIGATION" as if it were an operational cognitive mode equivalent to BOARDROOM or DENSE. But in implementation reality, INVESTIGATION is:

- A projection config that exists (`projection/configs/investigation.js`)
- A mode that renders verification panels, pass/fail assertions, compilation chain
- Functionally a specialized sub-mode of OPERATOR evidence inspection
- NOT a distinct cognitive altitude in the way BOARDROOM → BALANCED → DENSE → OPERATOR are

---

## Options

### Option A: INVESTIGATION remains protocol — SKU model adjusted

INVESTIGATION is removed from the SKU model as a "cognitive mode" alongside the other four. Instead:

- 4 cognitive modes: BOARDROOM, BALANCED, DENSE, OPERATOR
- INVESTIGATION is a **protocol capability** within OPERATOR mode
- SKU model says "OPERATOR (with Investigation Protocol)" instead of listing 5 modes
- SA-DD and higher tiers get "OPERATOR with Investigation Protocol"
- The 5th persona slot remains constitutionally reserved for true INVESTIGATION (post-Program 1)

**Impact on SKU model:** Replace "5 cognitive modes" with "4 cognitive modes + Investigation Protocol." The customer sees: "OPERATOR mode includes structural verification and evidence qualification capabilities."

**Pros:** Architecturally honest. No overclaim. Clean distinction between what's operational and what's constitutional-but-unimplemented.

**Cons:** Loses the clean "5 personas" narrative. The customer might ask "what's the fifth?"

### Option B: INVESTIGATION formally restored as surface/persona

INVESTIGATION is treated as a full peer persona in the SKU model. The architectural caveat ("no certified implementation") is an implementation gap, not a product decision. The projection config exists. The mode renders. It works.

**Impact on SKU model:** Keep "5 cognitive modes" as-is.

**Pros:** Clean narrative. "Five cognitive modes for five audiences."

**Cons:** Overclaims. The current INVESTIGATION surface is functionally OPERATOR with verification labeling. Calling it a distinct "cognitive mode" implies a cognitive altitude that doesn't architecturally exist yet. The architecture review explicitly resolved this — reversing it creates a product-architecture conflict.

---

## Decision: Option A — INVESTIGATION remains protocol

**Reasoning:**

1. **The architecture review was correct.** INVESTIGATION_DENSE was functionally OPERATOR. The persona recognition (2026-05-29) confirmed this. Reversing that finding for SKU convenience creates a product-architecture disconnect that will surface when a customer asks "how is INVESTIGATION different from OPERATOR?"

2. **Commercially, 4 modes + Investigation Protocol is actually stronger.** It positions Investigation as a specialized capability (premium feel) rather than just "the fifth mode" (commoditized feel). "OPERATOR mode with Investigation Protocol" sounds like a governed, enterprise-grade capability. "Investigation mode" sounds like another tab.

3. **The true INVESTIGATION persona (post-Program 1) becomes a future product differentiator.** When true INVESTIGATION ships — compilation chain verification, evidence completeness certification, governed replay — it becomes a genuine new capability announcement. If we already claimed "INVESTIGATION" as a persona, the launch has no impact.

4. **Honest positioning builds trust.** If a PE due diligence lead asks "what does Investigation mode do versus Operator?" and the honest answer is "they're the same thing with different labels," we lose credibility. If the answer is "OPERATOR gives you full evidence depth, and within OPERATOR you have the Investigation Protocol for structural verification and qualification," that's precise and credible.

### SKU Model Impact

Replace in all customer-facing material:

| Before | After |
|--------|-------|
| "5 cognitive modes" | "4 cognitive modes" |
| "BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION" | "BOARDROOM, BALANCED, DENSE, OPERATOR" |
| "LENS INVESTIGATION" as a mode | "Investigation Protocol" as a capability within OPERATOR |

The Investigation Protocol capability includes:
- Compilation chain verification panels
- Evidence completeness assessment
- Pass/fail per qualification target
- Governed evidence replay

This capability is included in SA-DD and higher SKUs as part of OPERATOR access.

---

## LOCKED

INVESTIGATION = protocol capability within OPERATOR, not a peer persona.

4 cognitive modes. Investigation Protocol is an OPERATOR capability.

SKU model will be updated accordingly.
