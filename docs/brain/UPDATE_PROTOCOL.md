---
type: governance
brain: all
---

# Brain Update Protocol

## Purpose

This protocol governs how the 4-brain system is updated after each stream execution. It defines when updates are required, which brains are affected, in what order updates are applied, and what validation must pass before a brain update is considered closed.

The brain must remain:
- consistent with canonical authority
- traceable to the streams that shaped it
- free of cross-layer contamination
- incrementally maintainable without rewriting prior truth

---

## Update Trigger Conditions

A brain update is required when any of the following occur after a stream closes:

| Trigger | Brain(s) Affected |
|---|---|
| New stream capsule produced | Canonical |
| Existing layer boundary redefined | Canonical |
| Invariant added, amended, or deprecated | Canonical |
| Decision added, amended, or reversed | Canonical |
| New function, file, or execution path introduced | Code |
| Existing function signature or flow changed | Code |
| Consumes/produces mapping changed | Code |
| New product capability or constraint added | Product |
| Existing product claim requires correction | Product |
| Product tier structure changed | Product |
| Engagement model changed | Product |
| New public-facing claim introduced | Publish |
| CTA or conversion path changed | Publish |
| Audience targeting changed | Publish |
| Controlled claim grounding changed | Publish |

If a stream produces none of the above, the brain requires no update. This determination must be recorded explicitly as part of stream closure.

---

## Brain Impact Assessment

Before executing any brain update, the stream executor must:

1. Read the closing stream's scope and output artifacts
2. For each of the four brains, determine: does this stream affect it?
3. Record the impact decision for each brain:
   - `IMPACTED — update required`
   - `NOT IMPACTED — no update required`
4. Proceed to update in canonical-first order

Assessment is not optional. A stream that affects the brain without a recorded impact assessment is a governance violation.

---

## Update Order

Updates must be executed in this order:

```
Canonical → Code → Product → Publish
```

**Rationale:**
- Canonical defines truth. All other brains derive from it.
- Code maps what was built. Product claims derive from what code implements.
- Product translates capability into offer. Publish projects only what product grounded.

A lower brain must not be updated before the brain above it is settled. If a downstream update reveals a conflict with an upstream brain, stop and resolve the upstream layer first before continuing.

Unless a stream explicitly determines a lower brain is unaffected, evaluation proceeds top-down.

---

## The 7-Step Update Lifecycle

**STEP 1 — Stream closes**
The stream produces its defined output artifacts and reaches COMPLETE status.

**STEP 2 — Brain impact assessment performed**
Executor evaluates each of the four brains against the stream's scope. Determines IMPACTED or NOT IMPACTED for each.

**STEP 3 — Affected brains identified**
Impact decisions recorded. At least one brain must be impacted for a brain update stream to proceed.

**STEP 4 — Update order executed**
Updates applied in sequence: Canonical → Code → Product → Publish. Each brain update confirmed before proceeding to the next.

**STEP 5 — Links checked**
All wiki-links in modified files verified to resolve. No broken forward or backward links.

**STEP 6 — No-orphan / no-contamination validation**
No new node exists without inbound and outbound links. No lower brain asserts authority that belongs to a higher brain.

**STEP 7 — Brain update closure confirmed**
All pre-closure validation checks pass. Stream is marked brain-updated.

---

## CREATE_ONLY Evolution Rule

Existing brain nodes are never silently overwritten.

All evolution uses one of four forms:

| Form | Definition | When to Use |
|---|---|---|
| **Extend** | Append a new section to an existing node without altering existing content | Additive change; existing content remains valid |
| **Amend** | Change existing content with explicit lineage record (stream ID + nature of change) | Correction required; prior content is superseded |
| **New node** | Create a new file | Genuinely new scope; contamination risk if appended |
| **Lineage append** | Record that a stream touched a node without changing its content | Traceability only; no content change |

Silent in-place semantic replacement is forbidden. If content changes, the change must be attributable to a named stream ID recorded in the node's lineage section.

---

## Amend vs Extend vs New Node

**Amend an existing node when:**
- The existing content contains an error that the stream has corrected
- A section's meaning must change because upstream canonical changed
- A controlled claim is being corrected, not expanded

**Extend an existing node when:**
- New information is additive and compatible with existing content
- A new section can be appended without disturbing current sections
- A stream adds a new sub-capability, constraint, input, or mapping

**Create a new node when:**
- The addition represents a new conceptual entity not covered by any existing node
- Appending to an existing node would contaminate its stated scope
- A new stream capsule, product component, or publish surface has been introduced

**Default rule:** When in doubt, prefer extend. Reserve new nodes for genuinely new scope. Amend only when correction is required.

---

## Orphan Prevention Rule

Every new node added to any brain must:
- Link to at least one node in the brain above it (or within the same brain)
- Be referenced by at least one node that will consume it

Before a new node is committed, verify:
- It carries at least one `derived_from`, `governed_by`, `implements`, or `expressed_as` link
- It is reachable from the brain's index file (`00_HOME.md` or `01_*`)

A node with no inbound and no outbound links is a governance violation.

---

## Link Maintenance Rule

After any brain update:
- All `[[wiki-links]]` in modified files must resolve to existing files
- Any node removed must have its links removed or redirected
- Forward links from canonical must continue to reach code/product/publish destinations
- No link may reference a node that no longer exists

Link integrity check is mandatory pre-closure validation.

---

## Pre-Closure Validation

A brain update is not closed until all of the following pass:

- [ ] Impact assessment recorded for all four brains
- [ ] Update order respected (canonical settled before code, code before product, product before publish)
- [ ] All modified files: existing content unchanged unless amendment rule was explicitly invoked
- [ ] All new files: link integrity satisfied, no orphan nodes
- [ ] All amended files: stream ID recorded in lineage section
- [ ] Controlled claims in publish brain still trace to product and canonical
- [ ] No file created outside `/docs/brain/`
- [ ] No cross-layer contamination (code does not assert canonical; product does not assert code behavior; publish does not assert product truth)

---

## Per-Brain Update Rules

Each brain has its own update rules file:

- Canonical: [[canonical/06_UPDATE_RULES]]
- Code: [[code/02_UPDATE_RULES]]
- Product: [[product/02_UPDATE_RULES]]
- Publish: [[publish/02_UPDATE_RULES]]

Those files govern the mechanics of updates within each brain.
This file governs the protocol that crosses all four.
