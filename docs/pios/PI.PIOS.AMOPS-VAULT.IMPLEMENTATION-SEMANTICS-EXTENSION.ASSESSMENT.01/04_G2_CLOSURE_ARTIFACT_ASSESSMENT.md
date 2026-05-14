# G2 Closure Artifact Assessment

**Stream:** PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01

---

## 1. Current CLOSURE.md Requirements (CLAUDE.md §5.4)

The current CLOSURE.md format has 9 mandatory sections:

1. Status
2. Scope
3. Change log
4. Files impacted
5. Validation
6. Governance
7. Regression status
8. Artifacts
9. Ready state

For G1 streams, Section 10 (Architecture Memory Propagation) was added by AMOps.

For G2 streams, no additional sections exist. A G2 stream that creates a fully reusable engine closes with the same format as a G2 stream that fixes a CSS bug.

---

## 2. The Gap for G2 Implementation Streams

### What CLOSURE.md captures well:
- THAT code was created (Change log, Files impacted)
- THAT it passed validation (Validation)
- THAT it respects governance (Governance)
- THAT tests still pass (Regression status)

### What CLOSURE.md does not capture:
- HOW the code works (implementation semantics)
- WHAT it needs (input contracts)
- WHAT it produces (output contracts)
- WHERE it can be extended (extension points)
- WHICH parts are reusable vs client-specific (primitive inventory)
- WHICH constants are assumptions vs governance (calibration map)

---

## 3. Recommendation: Conditional Section 10 for G2 Implementation Streams

### Section Name
**Section 10: Implementation Semantics** (when applicable)

### Trigger Criteria

A G2 stream SHOULD include Section 10 when it creates code that meets ANY of:
- Exports functions intended for consumption by other modules or future streams
- Introduces configurable parameters or extension points
- Creates infrastructure intended for multi-client use
- Produces a new artifact type (e.g., `reconciliation_correspondence.v1.json`)

### Non-Triggering G2 Streams

Section 10 is NOT needed for:
- Bug fixes within existing modules
- CSS/UI refinements with no new logic
- Configuration or manifest changes
- Test improvements
- Documentation-only modifications
- Wiring existing components into new routes

### Format

Section 10 may be either:

**Option A: Inline** (for simple cases — ≤3 primitives, straightforward contracts)
```markdown
## 10. Implementation Semantics

### Primitives Introduced
| Primitive | Module | Reuse Status |
|-----------|--------|--------------|
| ... | ... | ... |

### Input Contracts
[brief description of expected input shapes]

### Output Contracts
[brief description of what is produced and where]

### Calibration Assumptions
[any constants that are tuned rather than governed]

### Extension Points
[where parameterization is possible]
```

**Option B: Companion artifact** (for complex cases — ≥4 primitives, multiple input types, calibration risks)
```markdown
## 10. Implementation Semantics

See: IMPLEMENTATION_SEMANTICS.md (companion artifact in this stream container)
```

The companion artifact follows the full format defined in [[02_IMPLEMENTATION_SEMANTIC_PERSISTENCE_MODEL]].

---

## 4. Impact on Existing CLAUDE.md

### Current §5.4
Defines Sections 1–9 for all streams.

### Current §16.4
Defines Section 10 for G1 streams (Architecture Memory Propagation).

### Proposed Change
Section 10 becomes a **conditional section** that serves different purposes:
- For G1 streams: Architecture Memory Propagation (existing, unchanged)
- For G2 implementation streams: Implementation Semantics (new, conditional)

These do not conflict because:
- G1 streams are architecture-mutating → Section 10 = architecture propagation
- G2 implementation streams do not mutate architecture → Section 10 = implementation semantics
- A stream cannot be both G1 and G2

---

## 5. What This Would Have Changed for the Compiler Stream

If Section 10 had existed when PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01 closed, its CLOSURE.md would have included:

```markdown
## 10. Implementation Semantics

See: IMPLEMENTATION_SEMANTICS.md

Primitives introduced: 6
- compileCorrespondence() — client-agnostic correspondence compiler
- assessConfidence() — graduated confidence assessment (calibration risk: thresholds)
- buildStructuralIndex() — dual-format topology indexer
- buildCrosswalkBridge() — crosswalk-to-lookup converter
- ReconciliationArtifactWriter — parameterized artifact persistence
- compile_blueedge_correspondence.js — BlueEdge-hardcoded orchestrator

Input contracts: 5 artifact types documented
Calibration assumptions: 3 confidence thresholds (0.90, 0.65, 0.50)
Extension points: threshold configuration, manifest-driven client selection
```

The subsequent generalization assessment would then have loaded IMPLEMENTATION_SEMANTICS.md and skipped ~80% of the code archaeology.

---

## 6. Governance Classification

This change is:
- **Lightweight**: adds one conditional section, not a new contract template
- **Backward-compatible**: no existing streams are invalidated
- **Thin-contract preserving**: does not change how contracts are written (ChatGPT model unchanged)
- **Detection-driven**: the trigger criteria are detectable from file_changes.json (new files in app/, lib/, scripts/ that export)
- **Progressive**: can start immediately without migrating existing streams
