---
template: decision-append
use: append a new decision entry to 05_DECISIONS.md
governed_by: canonical/06_UPDATE_RULES
---

# Template — Decision Append

## Instructions

Append this block to `/docs/brain/canonical/05_DECISIONS.md`.

Rules:
- Do NOT alter existing DEC entries
- Assign the next sequential DEC-N identifier (check current highest before assigning)
- If this decision reverses a prior decision, set Status to REVERSAL and name the superseded DEC
- Complete all fields — no empty placeholders in committed files

---

## DEC-[N]

**Stream:** [STREAM_ID]
**Date:** [YYYY-MM-DD]
**Status:** ACTIVE

*(If reversing a prior decision: Status: REVERSAL — supersedes DEC-[prior N])*

**Decision:**
[State the design choice clearly in one or two sentences. What was decided?]

**Rationale:**
[Why this decision was made. What alternative was considered and rejected, and why.]

**Impact:**
[Which layers, nodes, claims, or stream capsules this decision governs or constrains.]
