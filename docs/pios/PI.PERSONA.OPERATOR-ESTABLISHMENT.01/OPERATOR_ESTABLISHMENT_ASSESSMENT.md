# PI.PERSONA.OPERATOR-ESTABLISHMENT.01 — Assessment

## Purpose

Inventory of every runtime element that must change to establish OPERATOR as a first-class persona. Current INVESTIGATION_DENSE becomes OPERATOR. Zero behavior change. Zero capability loss.

---

## §1 — Runtime Impact Inventory

### 1.1 Density Class Constant

The core identifier is `INVESTIGATION_DENSE`. This appears in:

| Location | File | Line | Current Value |
|---|---|---|---|
| DENSITY_OPTIONS array | `pages/lens-v2-flagship.js` | 72 | `value: 'INVESTIGATION_DENSE'` |
| DENSITY_OPTIONS label | `pages/lens-v2-flagship.js` | 73 | `label: 'INVESTIGATION'` |
| DENSITY_OPTIONS aria | `pages/lens-v2-flagship.js` | 76 | `aria: 'Investigation — Analyst evidence trace...'` |
| AUDIENCE_TO_DENSITY_CLASS | `adapters/SurfaceModeResolver.js` | 28 | `ADVISORY: 'INVESTIGATION_DENSE'` |
| DENSITY_PANEL_DEFAULTS | `adapters/SurfaceModeResolver.js` | 43 | `INVESTIGATION_DENSE: { ... }` |
| EXPERIENTIAL_DENSITY_MAP | `components/.../IntelligenceDensityOrchestrator.js` | 50-51 | `INVESTIGATION_DENSE: { density_class: 'INVESTIGATION_DENSE' }` |
| density_token | `components/.../IntelligenceDensityOrchestrator.js` | 60 | `'density-investigation-dense'` |
| Motion profile | `components/.../MotionSemanticController.js` | 115, 119 | `INVESTIGATION_DENSE: { ... density_token: 'motion-density-investigation' }` |
| LENS_MODE_SEMANTICS | `components/.../IntelligenceField.jsx` | 35 | `INVESTIGATION_DENSE: ['evidenceTrace', ...]` |
| Mode semantics map | `components/.../IntelligenceField.jsx` | 241 | `INVESTIGATION_DENSE: { label: 'FORENSIC INTERPRETATION', ... }` |
| INVESTIGATION_DENSE queries | `components/.../IntelligenceField.jsx` | 3416 | `INVESTIGATION_DENSE: (fullReport) => { ... }` |
| Conditional branch | `components/.../IntelligenceField.jsx` | 4604 | `densityClass === 'INVESTIGATION_DENSE'` |
| RepresentationField | `components/.../IntelligenceField.jsx` | 8392 | `if (densityClass === 'INVESTIGATION_DENSE')` |
| isInvestigation | `components/.../IntelligenceField.jsx` | 8546 | `densityClass === 'INVESTIGATION_DENSE'` |
| Conditional | `components/.../IntelligenceField.jsx` | 8554 | `STRUCTURAL_ESCALATION_CONDITIONS.investigation(fullReport)` |
| isInvestigation | `components/.../ReconciliationAwarenessZone.jsx` | 298 | `densityClass === 'INVESTIGATION_DENSE'` |
| NarrativeDensityController comment | `components/.../NarrativeDensityController.js` | 24 | `'INVESTIGATION_DENSE'` (in JSDoc) |
| Disclosure shell | `pages/lens-v2-flagship.js` | 8422, 8425 | `data-persona="INVESTIGATION_DENSE"` |

**Rename:** `INVESTIGATION_DENSE` → `OPERATOR_DENSE`

### 1.2 State Variables

| Location | File | Line | Current Value |
|---|---|---|---|
| React state | `pages/lens-v2-flagship.js` | 239 | `const [investigationStage, setInvestigationStage] = useState('SUMMARY')` |
| Orchestration param | `pages/lens-v2-flagship.js` | 260 | `investigationStage,` |
| Dependency array | `pages/lens-v2-flagship.js` | 262 | `investigationStage` in useMemo deps |

**Rename:** `investigationStage` → `operatorStage`, `setInvestigationStage` → `setOperatorStage`

### 1.3 Stage Constants

| Location | File | Line | Current Value |
|---|---|---|---|
| Constant | `flagship-experience/flagshipOrchestration.js` | 90 | `const INVESTIGATION_STAGES = ['SUMMARY', 'EVIDENCE', ...]` |
| Export | `flagship-experience/flagshipOrchestration.js` | 251 | `INVESTIGATION_STAGES,` |
| Duplicate constant | `flagship-experience/StructuralInvestigationFlow.jsx` | 17 | `const INVESTIGATION_STAGES = [...]` |
| Resolver function | `flagship-experience/flagshipOrchestration.js` | 92 | `resolveInvestigationStage(stage)` |
| Resolver function | `flagship-experience/StructuralInvestigationFlow.jsx` | 19 | `resolveInvestigationStage(stage)` |
| Next stage | `flagship-experience/flagshipOrchestration.js` | 98 | `resolveNextStage()` uses INVESTIGATION_STAGES |
| Previous stage | `flagship-experience/flagshipOrchestration.js` | 104 | `resolvePreviousStage()` uses INVESTIGATION_STAGES |
| Orchestration | `flagship-experience/flagshipOrchestration.js` | 169 | `resolveInvestigationStage(investigationStage || 'SUMMARY')` |
| Resolved stage | `flagship-experience/LensV2FlagshipExperience.jsx` | 52 | `investigationStage || 'SUMMARY'` |

**Rename:** `INVESTIGATION_STAGES` → `OPERATOR_STAGES`, `resolveInvestigationStage` → `resolveOperatorStage`, `resolveNextStage/resolvePreviousStage` internal references

### 1.4 Forbidden Types

| Location | File | Line | Current Value |
|---|---|---|---|
| GovernanceGuard | `validation/GovernanceGuard.js` | 158 | `FORBIDDEN_ACTIVE_TYPES_PHASE2 = ['COPILOT_ENTRY', 'INVESTIGATION_ENTRY']` |

**Decision required:** Is `INVESTIGATION_ENTRY` the entry point for what becomes OPERATOR? If so, rename to `OPERATOR_ENTRY`. If it's future INVESTIGATION, keep as-is.

### 1.5 Transition Targets

| Location | File | Line | Current Value |
|---|---|---|---|
| Mode transition | `IntelligenceField.jsx` | 7290 | `target: 'INVESTIGATION_DENSE'` |
| Transition callback | `IntelligenceField.jsx` | 7324 | `onModeTransition('INVESTIGATION_DENSE', domainId)` |
| Button label | `IntelligenceField.jsx` | 7325 | `Open investigation workspace →` |

**Rename:** target → `'OPERATOR_DENSE'`, label → `'Open operator workspace →'`

---

## §2 — Rename Impact Inventory

### 2.1 Component Names (3)

| Current | Proposed | File |
|---|---|---|
| `StructuralInvestigationFlow` | `StructuralOperatorFlow` | `flagship-experience/StructuralInvestigationFlow.jsx` |
| `InvestigationTraceField` | `OperatorTraceField` | `components/.../IntelligenceField.jsx` (line 5956) |
| `InvestigationReadingGuide` | `OperatorReadingGuide` | `components/.../InvestigationReadingGuide.jsx` |

**File rename:** `InvestigationReadingGuide.jsx` → `OperatorReadingGuide.jsx`
**File rename:** `StructuralInvestigationFlow.jsx` → `StructuralOperatorFlow.jsx`

Note: `SoftwareIntelligenceInvestigationView` — this is the SW-INTEL view rendered inside the INVESTIGATION/OPERATOR persona. Keep name or rename to `SoftwareIntelligenceOperatorView`. Decision: rename for consistency.

### 2.2 CSS Classes (14 unique)

| Current | Proposed |
|---|---|
| `.investigation-topology-preview` | `.operator-topology-preview` |
| `.investigation-topology-hint` | `.operator-topology-hint` |
| `.actor--investigation-governance` | `.actor--operator-governance` |
| `.rep-field--investigation` | `.rep-field--operator` |
| `.sw-intel-view--investigation` | `.sw-intel-view--operator` |

CSS is in `pages/lens-v2-flagship.js` (lines 2065-2105, 6790, 7164, 8304, 10290).

### 2.3 Inline Class Names in JSX (5)

| File | Line | Current |
|---|---|---|
| `IntelligenceField.jsx` | 5985 | `className="rep-field rep-field--investigation"` |
| `IntelligenceField.jsx` | 6086 | `className="investigation-topology-preview"` |
| `IntelligenceField.jsx` | 6094 | `className="investigation-topology-hint"` |
| `IntelligenceField.jsx` | 6177 | `className="actor actor--investigation-governance"` |
| `SoftwareIntelligenceField.jsx` | 358 | `className="sw-intel-view sw-intel-view--investigation"` |

### 2.4 Compiler Exports

| Current | Proposed | File |
|---|---|---|
| `forInvestigation` | `forOperator` | `lib/.../ConsequenceCompiler.js` (line 813, 847) |
| `STRUCTURAL_ESCALATION_CONDITIONS.investigation` | `.operator` | `IntelligenceField.jsx` (line 361, 8554) |

---

## §3 — Labels and Display Text

| Location | Current Text | Proposed Text |
|---|---|---|
| DENSITY_OPTIONS label | `'INVESTIGATION'` | `'OPERATOR'` |
| DENSITY_OPTIONS persona_sub | `'Analyst · evidence trace and confidence'` | `'Operator · evidence inspection and confidence'` |
| DENSITY_OPTIONS aria | `'Investigation — Analyst evidence trace...'` | `'Operator — engineering evidence inspection...'` |
| CSS content | `'INVESTIGATION DEPTH'` | `'OPERATOR DEPTH'` |
| Descent card | `<div>INVESTIGATION</div>` | `<div>OPERATOR</div>` |
| Descent target | `<span>INVESTIGATION</span>` | `<span>OPERATOR</span>` |
| Descent text | `INVESTIGATION → derivation proof` | `OPERATOR → evidence inspection` |
| Transition button | `Open investigation workspace →` | `Open operator workspace →` |
| Reading guide aria | `Investigation reading guide` | `Operator reading guide` |
| Reading guide prose | `This investigation surface presents...` | `This operator surface presents...` |
| intelligence.js | `<span>INVESTIGATION</span>` (lines 58, 537) | `<span>OPERATOR</span>` |
| intelligence.js | `The structural investigation surface...` (lines 266, 524) | `The structural operator surface...` |
| Guidance label | `'Requires investigation'` | `'Requires operator inspection'` |
| Boundary text | `'Requires INVESTIGATION mode...'` (lines 384, 488) | `'Requires OPERATOR mode...'` |

**Note on "investigation" as general English word:** Line 579 says "the system recommends investigation before executive commitment" — this is the English word "investigation," not the persona name. **Keep as-is.**

Similarly, guided action `type: 'investigation'` (lines 1497, 1499, 1618, 1749, 1754, 1867, 1868, 2113) — these are action types, not persona references. These describe the nature of the action (it's an investigation action). **Decision required:** rename to `type: 'operator'` or keep? Recommendation: keep as `'investigation'` — this describes what the action IS (investigative), not which persona renders it.

---

## §4 — Test Impact Inventory

| File | Lines | Change Required |
|---|---|---|
| `adapters/tests/adapters.test.js` | 140-142 | Rename `INVESTIGATION_DENSE` in test name and assertion |
| `flagship-experience/tests/flagshipExperience.test.js` | 18, 213-214, 484-536, 649, 693, 704 | Rename `INVESTIGATION_STAGES` import, all density class values, stage references |
| `flagship-experience/tests/flagshipSpinoffSmoke.test.js` | 114-115, 174-176, 180 | Rename `investigationStage`, `INVESTIGATION_DENSE` |
| `flagship-experience/tests/balanced-projection-stress.test.js` | 236 | Rename `INVESTIGATION` in depth_target assertion |

### Fixture

| File | Change |
|---|---|
| `flagship-experience/fixtures/flagship_investigation_flow.fixture.js` | Rename: `FLAGSHIP_INVESTIGATION_FLOW_FIXTURE` → `FLAGSHIP_OPERATOR_FLOW_FIXTURE`, `investigation_stages` → `operator_stages`, `investigation_is_bounded` → `operator_is_bounded`, etc. |

**File rename:** `flagship_investigation_flow.fixture.js` → `flagship_operator_flow.fixture.js`

---

## §5 — Documentation Impact Inventory

| File | Change |
|---|---|
| `pages/intelligence.js` | Rename labels (lines 58, 266, 524, 537) |
| Comments in `ExecutiveOperationalCanvas.jsx` (line 11) | `investigation posture` → `operator posture` |
| Comments in `lens-v2-flagship.js` (lines 8207, 8283) | `investigation immersion` → `operator immersion` |
| JSDoc in `NarrativeDensityController.js` (line 24) | `INVESTIGATION_DENSE` → `OPERATOR_DENSE` |

---

## §6 — Vault Propagation Inventory

| Vault File | Change |
|---|---|
| `vault/00_START_HERE/OPERATIONAL_ONTOLOGY.md` (line 251-258) | Update from 4-persona with `INVESTIGATION_DENSE` to 5-persona with `OPERATOR_DENSE` |
| `vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md` (line 810) | Fix stale line: "5-persona ... INVESTIGATION [placeholder]" → remove placeholder reference |
| `vault/00_CANONICAL_AUTHORITY/BLUEEDGE_CANONICAL_TRUTH_CERTIFICATION.md` (line 189) | Update from 4 personas to 5 |
| `docs/governance/PROGRAM_INTELLIGENCE_EVOLUTION_MODEL.md` (line 209) | Add OPERATOR to persona enum |
| `docs/governance/GITHUB_FIRST_OPERATIONALIZATION_CORRECTION.md` (line 119) | Add OPERATOR to transition list |
| `docs/governance/MARKETPLACE_IMPLEMENTATION_LANE_DISCIPLINE.md` (lines 31, 54) | Update persona references |

**Note:** `TERMINOLOGY_LOCK.md` and `PIOS_CURRENT_CANONICAL_STATE.md` already have OPERATOR defined from PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01. The vault propagation here is about updating stale references in OTHER vault files.

---

## §7 — Risk Assessment

### 7.1 Risk: Behavioral Change

**NONE.** Every rename is a string substitution. No logic change. No conditional change. No new code paths. No removed code paths. The density class value changes from `INVESTIGATION_DENSE` to `OPERATOR_DENSE` — all comparisons, conditionals, and rendering gates remain identical.

### 7.2 Risk: Consumer Breakage

**LOW.** `forInvestigation` is exported from ConsequenceCompiler.js but currently has zero consumers (verified: no import found in any component). Renaming to `forOperator` is safe. However, if any external consumer references the old name, it would break.

**Mitigation:** Keep `forInvestigation` as a deprecated alias for one stream cycle:
```javascript
const forOperator = forInvestigation // rename function itself
module.exports = { forOperator, forInvestigation: forOperator, ... }
```
**Recommendation:** Don't bother. No consumer exists. Clean rename.

### 7.3 Risk: URL/Route Change

**NONE.** The density class is a state variable, not a URL parameter. No routes contain "investigation" in their path. The page is `/lens-v2-flagship?specimen=...` — density class is internal state only.

### 7.4 Risk: CSS Cascade Break

**LOW.** All CSS classes are renamed in lockstep — both the definition (in `lens-v2-flagship.js` styles) and the usage (in JSX className). No external stylesheet references these classes.

### 7.5 Risk: Test Failure

**EXPECTED.** Tests assert against `INVESTIGATION_DENSE` string values. All test assertions must be renamed in the same commit. Running tests after partial rename = guaranteed failure.

**Mitigation:** Single atomic commit with all renames.

### 7.6 Risk: Build Cache

**LOW.** `.next/` build cache will contain old compiled references. A clean build (`rm -rf .next && npx next build`) resolves this. Not a real risk.

---

## §8 — Estimated Implementation Size

### File Count

| Category | Files |
|---|---|
| Constants/logic | 7 source files |
| CSS | 1 file (lens-v2-flagship.js) |
| Tests | 4 test files |
| Fixtures | 1 fixture file |
| File renames | 2 files (InvestigationReadingGuide.jsx, StructuralInvestigationFlow.jsx) |
| Vault/docs | 6 documentation files |
| **Total** | **~21 files touched** |

### Rename Count

| Type | Count |
|---|---|
| `INVESTIGATION_DENSE` → `OPERATOR_DENSE` | ~35 occurrences |
| `investigationStage` → `operatorStage` | ~8 occurrences |
| `INVESTIGATION_STAGES` → `OPERATOR_STAGES` | ~15 occurrences |
| `resolveInvestigationStage` → `resolveOperatorStage` | ~6 occurrences |
| Component renames | ~8 occurrences |
| CSS class renames | ~14 occurrences |
| Label/text renames | ~15 occurrences |
| **Total renames** | **~100 string substitutions** |

### Implementation Estimate

**One atomic stream.** Mechanically a large find-and-replace, but requires precision — every rename must be in the same commit. Estimated size: **MEDIUM** (volume is high, complexity is low).

---

## §9 — Proposed Execution Stream

### Stream ID

`PI.PERSONA.OPERATOR-RUNTIME-ESTABLISHMENT.01`

### Classification

**G1 — Architecture-Mutating.** Introduces OPERATOR as a runtime persona constant, modifies vault entries.

### Execution Plan

1. Rename `INVESTIGATION_DENSE` → `OPERATOR_DENSE` across all source files
2. Rename `investigationStage` → `operatorStage` in flagship page
3. Rename `INVESTIGATION_STAGES` → `OPERATOR_STAGES` in orchestration
4. Rename `resolveInvestigationStage` → `resolveOperatorStage`
5. Rename component: `InvestigationTraceField` → `OperatorTraceField`
6. Rename component: `StructuralInvestigationFlow` → `StructuralOperatorFlow`
7. Rename component: `InvestigationReadingGuide` → `OperatorReadingGuide`
8. Rename component: `SoftwareIntelligenceInvestigationView` → `SoftwareIntelligenceOperatorView`
9. Rename file: `InvestigationReadingGuide.jsx` → `OperatorReadingGuide.jsx`
10. Rename file: `StructuralInvestigationFlow.jsx` → `StructuralOperatorFlow.jsx`
11. Rename file: `flagship_investigation_flow.fixture.js` → `flagship_operator_flow.fixture.js`
12. Rename export: `forInvestigation` → `forOperator`
13. Rename CSS classes: `investigation-*` → `operator-*`
14. Update labels: `'INVESTIGATION'` → `'OPERATOR'` in display text
15. Update aria labels
16. Update all test assertions
17. Update vault files (OPERATIONAL_ONTOLOGY, stale references)
18. Build verify
19. Test verify
20. Browser verify — all 4 personas render correctly

### Single Commit

All changes in ONE atomic commit. No intermediate states. No partial rename.

---

## §10 — The Most Important Question

**If we perform ONLY the OPERATOR establishment work, will the runtime remain functionally identical?**

### Answer: YES.

Current INVESTIGATION_DENSE becomes OPERATOR_DENSE. Every conditional, every rendering gate, every data flow, every CSS rule — all remain structurally identical. The only change is the string constant that identifies this persona.

**What changes:**
- The string `INVESTIGATION_DENSE` everywhere it appears
- Component names (internal, not API)
- CSS class names (internal, no external consumers)
- Display labels and aria text
- Test assertions
- One compiler export name

**What does NOT change:**
- Evidence trace rendering
- Signal audit rendering
- Topology rendering
- Guided queries (4 INVESTIGATION_DENSE queries become 4 OPERATOR_DENSE queries — same content)
- Governance guard behavior
- Disclosure shell depth behavior
- SW-Intel integration
- Consequence compilation
- Persona selection mechanics
- Data flow architecture
- Any user-visible behavior beyond label text

**Zero capability loss. Zero behavioral change. String substitution only.**
