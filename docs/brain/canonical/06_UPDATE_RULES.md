---
type: governance
brain: canonical
---

# Canonical Brain — Update Rules

## Principle

The canonical brain is always evaluated first. No other brain may be updated until the canonical impact of a stream is determined and settled.

Canonical is the authority layer. Amendments to canonical propagate to all downstream brains. Downstream brains never propagate back into canonical.

---

## When a Canonical Node Must Be Updated

| Condition | Action |
|---|---|
| Stream introduces a new execution layer or layer boundary | Create new stream capsule |
| Stream changes the defined input or output of an existing layer | Amend existing stream capsule |
| Stream adds a constraint that applies to all downstream layers | Add or amend invariant in 04_INVARIANTS.md |
| Stream documents a deliberate design choice or deviation | Append to 05_DECISIONS.md |
| Stream resolves a semantic inconsistency across layers | Amend the affected stream capsule(s) |
| Stream introduces new authority over a canonical concept | Add authority section to the owning stream capsule |
| Stream adds a new layer boundary contract | Extend PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01 or create new capsule |

If a stream produces none of the above, canonical requires no update. Record: `NOT IMPACTED — no update required`.

---

## Canonical Is Always Evaluated First

Before any code, product, or publish brain update:
1. Read the stream scope
2. Determine if canonical is IMPACTED or NOT IMPACTED
3. If IMPACTED: complete canonical updates and confirm links resolve
4. Only then proceed to the code brain

A downstream brain updated before canonical is settled is a governance violation.

---

## Stream Capsule: Create vs Amend

**Create a new stream capsule when:**
- A genuinely new execution layer is introduced with distinct inputs and outputs
- A new governed process cannot be absorbed into an existing capsule without contaminating its scope
- A new canonical boundary is being established for the first time

**Amend an existing stream capsule when:**
- A stream corrects or extends the definition of an already-defined layer
- A new input, output, or authority section is added to an existing layer
- A new constraint applies to an existing layer's behavior

**Append lineage only when:**
- A stream touched the layer but did not change its definition
- The stream's existence should be recorded for traceability without changing content

---

## Invariants: Add vs Amend vs Reference

**Add a new invariant when:**
- A stream establishes a constraint that has not previously been stated anywhere
- The constraint applies system-wide or to a specific layer boundary

**Amend an existing invariant when:**
- A stream corrects the statement of an invariant
- A stream expands the scope of an existing invariant to cover new layers

**Reference an existing invariant when:**
- A stream confirms that an existing invariant applies to new context
- No change to the invariant statement is needed

**Never duplicate invariants.** If INV-06 applies to new context, reference INV-06. Do not create INV-N+1 to restate the same constraint.

Use `invariant_amendment_template.md` for all invariant amendments.

---

## Decisions: Append vs Amend

**Append a new decision (DEC-N+1) when:**
- A new deliberate design choice has been made
- A prior decision is being reversed (record the reversal as a new decision referencing the original)
- A new constraint is the result of a deliberate trade-off

**Amend an existing decision when:**
- The decision statement contains a factual error
- The rationale must be corrected (not expanded — expansion is a new decision)

**Never silently delete a prior decision.** If a decision is reversed, the reversal is a new DEC entry that explicitly states which prior decision it supersedes.

Use `decision_append_template.md` for all new decisions.

---

## Recording Canonical Lineage

Every amendment to a canonical node must include a lineage record.

Lineage is appended to the `## Lineage` section at the bottom of the file.
If no `## Lineage` section exists, create one.
Lineage records are never removed.

Use `lineage_append_template.md` for all lineage entries.

Required fields per entry:
- Stream ID that caused the change
- Date of change
- Nature: AMENDMENT / EXTENSION / CORRECTION / TOUCH
- One-sentence summary of what changed

---

## No Downstream Authority Override

The following are forbidden in canonical update execution:

- Code brain observations do not amend canonical
- Product translations do not amend canonical
- Publish copy choices do not amend canonical
- If a downstream brain update reveals a canonical inconsistency, stop — update canonical first, then proceed downstream

---

## Templates

Located at `/docs/brain/canonical/update_templates/`:

| Template | Use |
|---|---|
| `stream_capsule_append_template.md` | Extend an existing stream capsule with a new section |
| `decision_append_template.md` | Append a new decision entry to 05_DECISIONS.md |
| `invariant_amendment_template.md` | Amend an existing invariant in 04_INVARIANTS.md |
| `lineage_append_template.md` | Record lineage in any canonical node |
