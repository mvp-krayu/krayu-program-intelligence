---
type: governance
brain: code
---

# Code Brain — Update Rules

## Principle

The code brain maps implementation. It records what the code does and traces it to canonical authority. It does not define canonical truth. A code brain update never creates new canonical meaning — it records what was built and how it connects to governed upstream layers.

Code brain updates are evaluated after canonical is settled.

---

## When the Code Brain Must Be Updated

| Condition | Action |
|---|---|
| New Python file, component, or script introduced | Create new code node |
| New function added to a tracked file | Extend existing code node |
| Existing function signature, inputs, or outputs changed | Amend existing code node |
| Consumes or produces mapping changed | Update affected function's flow mapping |
| Function removed | Remove from code node; record removal in Streams table |
| New static vs dynamic input distinction applies | Update Input Authority Classification table |
| governed_by reference changes | Update the mapping and append lineage |
| New execution path introduced (new route, endpoint, adapter) | Extend or create code node |

If a stream produces no implementation change, the code brain requires no update. Record: `NOT IMPACTED — no update required`.

---

## What Qualifies as Implementation Impact

Implementation impact is triggered by changes to:
- Python files in `scripts/pios/`
- Runtime adapter files in `app/`
- Report generation logic (`lens_report_generator.py` or equivalent)
- Consumes/produces chains for any tracked function
- Input classification (DYNAMIC vs STATIC)
- Route or endpoint structure

Implementation impact is NOT triggered by:
- Copy changes in commercial or brain documents
- Brain governance updates
- Canonical clarifications that do not change code behavior
- Publish or product reframings that do not alter what the code does

---

## When a New Code Node Is Required

Create a new code node when:
- A new file with tracked functions is introduced
- A new system component (adapter, surface, generator) is created with no existing node
- An existing code node would be contaminated by absorbing genuinely new scope

Do NOT create a new code node for a new function within an already-tracked file. Extend the existing node.

---

## Amending Functions and Components

When a function's implementation changes:
1. Update the Consumes, Governed by, and Produces fields for that function
2. Update the Flow mapping line
3. Record the change in the `## Streams That Modified This Node` table
4. Do not delete prior flow mappings — superseded flows are annotated inline, not removed

Format for annotating a superseded flow:
```
~~[prior flow line]~~ — superseded by STREAM [STREAM_ID] · [YYYY-MM-DD]
[new flow line]
```

---

## Consumes / Produces Update Rule

When updating a consumes or produces mapping:
- Label each input as DYNAMIC or STATIC in the Input Authority Classification table
- DYNAMIC: sourced from runtime payload / 40.x chain — authoritative for evidential outputs
- STATIC: sourced from a curated fixture — scaffold only, not source of truth
- Verify DYNAMIC inputs trace back to a 40.x stream output
- Verify STATIC inputs are identified as fixtures with no evidential authority
- The Input Authority Classification table must remain current after every update

---

## Code Never Defines Canonical Truth

The code brain records implementation. It does not:
- Assign layer ownership
- Define what a layer's output means
- State that a layer boundary exists or changes
- Create new invariants
- Assert that a function's behavior defines the product offer

If a code change reveals a canonical ambiguity, the code brain records the observation in a lineage note and the canonical brain is updated first in a separate step.

---

## Lineage Record

After any update to a code node, append to the `## Streams That Modified This Node` table:

| Stream | Change |
|---|---|
| [STREAM_ID] | [One sentence: what changed in the implementation] |
