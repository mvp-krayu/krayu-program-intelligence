# Obsidian-Style Vault Formatting Rules Recommendation

**Stream:** PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01

---

## 1. Current Formatting State

### Vault (docs/pios/vault/)
The vault uses Obsidian-style wikilinks consistently:
- `[[CLAUDE_RUNTIME_LOAD_PROTOCOL]]`
- `[[../01_FOUNDATIONAL_GOVERNANCE/GOVERNANCE_ORIGINS|Foundational Governance]]`
- `[[SEMANTIC_COLLISIONS]]`
- `[[DEPRECATED_TERMS]]`

This is correct. Vault pages cross-reference each other and create a navigable knowledge graph.

### Stream Containers (docs/pios/<STREAM-ID>/)
Stream container artifacts do NOT use wikilinks. They are isolated markdown reports with:
- Internal anchors (standard markdown headers)
- Inline code references (backtick-wrapped file paths)
- No cross-references to vault pages
- No cross-references to other stream containers
- No frontmatter metadata

This means stream container artifacts are **disconnected nodes** in the knowledge graph. A vault search for related implementation knowledge cannot find them. A stream assessment cannot discover related prior streams without manual lookup.

---

## 2. What's Missing

### 2.1 Wikilinks to Vault Concepts

Stream container artifacts reference vault concepts by name but not by link:

**Current (disconnected):**
```markdown
The compiler reads PATH A structural topology and PATH B semantic domains.
```

**Recommended (linked):**
```markdown
The compiler reads [[PATH A]] structural topology and [[PATH B]] semantic domains.
```

### 2.2 Cross-Stream References

Stream containers reference other streams by ID but not by link:

**Current:**
```markdown
As produced by PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
```

**Recommended:**
```markdown
As produced by [[PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01/CLOSURE|the reconciliation compiler stream]]
```

### 2.3 Frontmatter

Stream container artifacts have no machine-readable metadata:

**Recommended frontmatter for IMPLEMENTATION_SEMANTICS.md:**
```yaml
---
stream: PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
type: implementation-semantics
classification: G2
primitives:
  - compileCorrespondence
  - assessConfidence
  - buildStructuralIndex
  - buildCrosswalkBridge
  - ReconciliationArtifactWriter
related_concepts:
  - PATH A
  - PATH B
  - Reconciliation
  - Crosswalk
  - HYDRATED
---
```

---

## 3. Recommended Formatting Rules

### Rule 1: Vault Concept Links

When a stream container artifact references a locked term (per [[TERMINOLOGY_LOCK]]), it SHOULD use a wikilink:
- `[[PATH A]]`, `[[PATH B]]`, `[[HYDRATED]]`, `[[SQO]]`, `[[Crosswalk]]`

This makes vault search discover stream container artifacts that consume vault concepts.

### Rule 2: Cross-Stream Links

When referencing another stream's output, use a wikilink to the specific artifact:
- `[[PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01/CLOSURE]]`
- `[[PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/03_REUSABLE_RECONCILIATION_PRIMITIVES]]`

This creates a lineage graph across streams.

### Rule 3: Frontmatter for Implementation Semantics

IMPLEMENTATION_SEMANTICS.md files SHOULD include YAML frontmatter with:
- `stream`: stream ID
- `type`: `implementation-semantics`
- `classification`: G1/G2/G3
- `primitives`: list of reusable function/module names
- `related_concepts`: list of vault concepts consumed

### Rule 4: Code File References

References to code files SHOULD use a consistent format:
- `[[app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js|ReconciliationCorrespondenceCompiler]]`

This enables Obsidian graph view to show code ↔ documentation relationships.

### Rule 5: Do Not Over-Link

- Link vault concepts on FIRST USE in a section, not every occurrence
- Do not link common English words that happen to be vault terms
- Do not link within code blocks or inline code
- Do not create circular links (A→B→A)

---

## 4. What These Rules Do NOT Change

- Vault page formatting (already correct)
- CLOSURE.md format (governance sections remain unlinked — they are structured data)
- execution_report.md format (narrative sections can optionally link)
- validation_log.json (JSON, no linking)
- file_changes.json (JSON, no linking)

The formatting rules apply to:
- IMPLEMENTATION_SEMANTICS.md (new artifact)
- Assessment deliverables (e.g., 01_COMPILER_ARCHITECTURE_BOUNDARIES.md)
- Any narrative markdown in stream containers

---

## 5. Migration Cost

### Retroactive
Not recommended. Existing stream container artifacts work correctly. Retroactive linking adds effort without proportional benefit.

### Going Forward
Minimal additional effort — linking vault concepts during writing is a ~2-minute task per document. Frontmatter for implementation semantics is templatable.

---

## 6. Scope Clarification

These are **formatting recommendations**, not governance mandates. They improve discoverability and cross-reference quality but are not required for stream compliance. A stream that produces correct CLOSURE.md and execution_report.md is compliant regardless of whether it uses wikilinks.

The exception: IMPLEMENTATION_SEMANTICS.md frontmatter (Rule 3) SHOULD be mandatory for implementation-semantic artifacts, because frontmatter enables programmatic discovery of which streams introduced which primitives.
