# Implementation-Semantic Gap Assessment

**Stream:** PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01

---

## 1. The Observed Gap

The reconciliation loop generalization assessment (PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01) required line-by-line code reverse engineering of 6 implementation files (~800 lines total) to determine:

- which functions are reusable vs client-specific
- what input schema contracts the compiler expects
- what confidence thresholds are calibration assumptions
- where the extension points are
- which modules own which responsibilities
- what dual-format support exists (vault `domains[]` vs 40.4 `clusters[]`)

All of this information was produced during the preceding compiler stream (PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01) but was lost at stream closure because no artifact persisted it.

---

## 2. What the Compiler Stream DID Persist

### CLOSURE.md (governance record)
- Status: COMPLETE
- Files created/modified: listed by name
- Validation checks: PASS/FAIL table
- Governance assertions: no mutation, no fabrication

### execution_report.md (narrative record)
- Pre-flight checks: listed
- Mutation log: file × action matrix
- Validation results: listed
- Confidence assessment logic: described narratively

### What these artifacts communicate:
- THAT the compiler was built
- THAT it passed validation
- THAT certain files were created/modified
- THAT the confidence model has 5 levels

### What these artifacts do NOT communicate:
- HOW the compiler works (input contracts, decision logic, output shape)
- WHICH parts are reusable vs client-bound
- WHAT happens when optional inputs are missing
- WHERE the extension points are
- WHICH constants are governance vs calibration assumptions
- HOW modules distribute responsibility

---

## 3. The Consequence

When PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01 was contracted, Claude had to:

1. Read `ReconciliationCorrespondenceCompiler.js` (416 lines) — discover `compileCorrespondence()` signature, `assessConfidence()` decision tree, `buildStructuralIndex()` dual-format handling
2. Read `ReconciliationArtifactWriter.js` (76 lines) — discover parameterized path pattern
3. Read `compile_blueedge_correspondence.js` (127 lines) — discover hardcoded CLIENT/RUN_ID constants
4. Read `GenericSemanticPayloadResolver.js` (integration section) — discover inline compilation pattern and format assumption
5. Read manifest files and registry — discover client binding mechanism
6. Read BlueEdge data files — understand actual schema shapes

Total: ~800 lines of code archaeology to recover implementation semantics that were known at compile time but not persisted.

---

## 4. Gap Taxonomy

| Category | Description | Impact |
|----------|-------------|--------|
| **Primitive inventory** | What reusable functions exist, their names, purposes, reuse status | HIGH — forces full code audit for reusability assessment |
| **Input schema contracts** | What shape must each artifact have? What fields are consumed? | HIGH — forces reading code to determine what data shapes work |
| **Calibration assumptions** | Which numeric constants are tuned vs governed | MEDIUM — forces reading code to distinguish governance from assumption |
| **Extension points** | Where parameterization is possible without code change | MEDIUM — forces reading code to find configurability |
| **Module responsibility map** | Which file owns which concern | LOW–MEDIUM — forces reading multiple files to reconstruct ownership |
| **Dual-format awareness** | That the same function handles two different data shapes | HIGH — this was discovered via a bug during implementation, and the fix was not documented |

---

## 5. Root Cause

The root cause is NOT a failure of AMOps. AMOps operates correctly for its designed purpose: architecture memory. The lifecycle (BOOTSTRAP → PREFLIGHT → EXECUTION → POST-FLIGHT → ENFORCEMENT) preserves architectural concepts, terminology, and canonical state.

The root cause is a **category gap**. AMOps and CLAUDE.md §5 define closure artifacts for:

- governance state (CLOSURE.md)
- execution narrative (execution_report.md)
- validation results (validation_log.json)
- file change tracking (file_changes.json)

But NOT for:

- **implementation semantics** — how the code works, what it needs, what it produces, what's configurable

The CLOSURE.md format (CLAUDE.md §5.4) has 9 sections. None of them require implementation-semantic content. A G2 stream that creates a reusable engine can close with a perfect CLOSURE.md that says nothing about how the engine works.

---

## 6. Why This Matters

Every time a G2 implementation stream creates reusable code primitives and closes without persisting implementation semantics:

1. **Future assessment streams** must reverse-engineer from code
2. **Future extension streams** must rediscover contracts from source
3. **Future multi-client streams** must re-audit for client-specific assumptions
4. **Context is consumed** on code reading that could have been loaded as pre-existing knowledge
5. **Risk of misunderstanding** increases — the next Claude session may misinterpret a calibration assumption as governance

The reconciliation compiler case is the proof: the assessment stream worked correctly, but it consumed ~40% of its execution budget on code archaeology that could have been a 3-minute artifact load.

---

## 7. What Is NOT the Problem

- **AMOps is not broken.** It does what it was designed to do (architecture memory).
- **CLOSURE.md is not wrong.** It captures what it was designed to capture (governance closure).
- **The compiler stream was not deficient.** It executed its contract correctly and closed properly.
- **The assessment stream was not inefficient.** It did what it had to do given the available artifacts.

The problem is a **missing artifact category** — not a failure of existing categories.
