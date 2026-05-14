# Auto-Applied Corrections

**Stream:** PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01

---

## 1. Corrections Applied

### Correction A: CLAUDE.md §5.5 — Implementation-Semantic Artifact (CONDITIONAL)

**What:** Added §5.5 to CLAUDE.md defining the IMPLEMENTATION_SEMANTICS.md artifact as a conditional closure requirement for G2 streams that introduce reusable code primitives.

**Authority:** This stream is classified G1 (architecture-mutating). CLAUDE.md §1.2 establishes CONTRACT as primary authority, and this stream's contract explicitly authorizes "auto-apply corrections if they are clearly required under CLAUDE.md / AMOps authority."

**Scope of change:**
- New subsection §5.5 under Artifact Discipline
- Does not modify existing sections (§5.1–§5.4)
- Does not conflict with §16.4 (G1 streams use Section 10 for architecture propagation; G2 implementation streams use it for implementation semantics)
- Conditional: only triggers for streams that create reusable code primitives

**File:** CLAUDE.md (repo root)

### Correction B: Retroactive IMPLEMENTATION_SEMANTICS.md for Compiler Stream

**What:** Created `docs/pios/PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01/IMPLEMENTATION_SEMANTICS.md` — the implementation-semantic artifact that SHOULD have been produced at compiler stream closure.

**Authority:** The stream contract's observed issue states "Claude had to inspect implementation code to determine what parts of the reconciliation compiler are reusable." The correction directly addresses this by persisting the implementation semantics that were discovered during the generalization assessment.

**Scope of change:**
- One new file in an existing stream container
- No modifications to existing files in that stream container
- Content is derived from the generalization assessment's findings (already verified)

**File:** docs/pios/PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01/IMPLEMENTATION_SEMANTICS.md

---

## 2. Corrections Recommended (NOT Auto-Applied)

### Recommendation C: Obsidian-Style Formatting Guidelines

**What:** Adopt wikilinks and frontmatter in stream container narrative documents.

**Why NOT auto-applied:** This is a style recommendation, not a governance correction. It does not fix a broken process — it improves discoverability. Retroactive reformatting of existing documents is not cost-justified. Going-forward adoption is at the architect's discretion.

**Details:** See [[03_OBSIDIAN_STYLE_VAULT_FORMATTING_RULES]].

### Recommendation D: PIOS_CURRENT_CANONICAL_STATE.md Update

**What:** Update CLAUDE.md version reference from v2.4 to v3.0 (AMOps-Native) in the canonical state page. Also add "Reconciliation Correspondence Compiler" to the capabilities summary.

**Why NOT auto-applied:** Canonical state updates are governance-sensitive. The discrepancy was noted during preflight but is not blocking. This should be handled by a dedicated vault maintenance operation, not as a side-effect of this assessment stream.

### Recommendation E: Stream Container Cross-Referencing Convention

**What:** Establish a convention for cross-referencing between stream containers (e.g., when a generalization assessment references a compiler stream's artifacts).

**Why NOT auto-applied:** This is a process improvement, not a correction. No existing process is broken — the assessment succeeded. This improves efficiency for future similar workflows.

---

## 3. Corrections NOT Recommended

### NOT Recommended: New Vault Section for Implementation Memory

The vault should NOT grow a new numbered section (e.g., `13_IMPLEMENTATION_MEMORY/`). Implementation semantics are execution-level knowledge that belongs in stream containers, not in the architectural vault. Adding them to the vault would violate the principle that the vault is architecture memory, not implementation documentation.

### NOT Recommended: Mandatory Implementation Semantics for ALL G2 Streams

Most G2 streams do not create reusable code primitives. A bug fix, a UI refinement, or a configuration change does not warrant an implementation-semantic artifact. The trigger must remain conditional on "introduces reusable code primitives."

### NOT Recommended: Retroactive IMPLEMENTATION_SEMANTICS.md for ALL Past Streams

The compiler stream is the evidence case for this assessment. Creating retroactive artifacts for all prior implementation streams would be disproportionate effort. Going-forward compliance is sufficient.
