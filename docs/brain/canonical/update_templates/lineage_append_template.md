---
template: lineage-append
use: record that a stream touched or changed a canonical node
governed_by: canonical/06_UPDATE_RULES
---

# Template — Lineage Append

## Instructions

Use this template to record lineage in any canonical node.

Rules:
- If the node has no `## Lineage` section, create one at the very bottom of the file
- If a `## Lineage` section already exists, append a new row to the table
- Do NOT alter any existing lineage rows
- One row per stream per node — do not batch multiple changes into one row
- Change type must be one of: AMENDMENT / EXTENSION / CORRECTION / TOUCH

**Change type definitions:**
- AMENDMENT — existing content was changed (prior content superseded)
- EXTENSION — new section or content was added; nothing existing was altered
- CORRECTION — a factual or semantic error was corrected
- TOUCH — stream is recorded here for traceability; no content was changed

---

## Lineage

| Stream | Date | Change type | Summary |
|---|---|---|---|
| [STREAM_ID] | [YYYY-MM-DD] | [AMENDMENT / EXTENSION / CORRECTION / TOUCH] | [One sentence: what changed, or why this stream is recorded at this node] |
