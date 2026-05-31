# LENS Non-Regression Matrix

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31

---

## 1. PURPOSE

Maps each phase's impact on all 8 existing LENS consumption surfaces. Proves no regression through Phases 1-5 (additive), and controlled regression-tested migration in Phase 6.

---

## 2. EXISTING LENS CONSUMPTION SURFACES

### 2.1 Persona Projection Surfaces

| Surface | Location | Current Consumption Path | Function |
|---------|----------|------------------------|----------|
| BOARDROOM | LENS v2 persona zone | `forBoardroom()` → ConsequenceCompiler.js:770 | Executive consequence qualification — compiled projection, posture cards, narrative |
| BALANCED | LENS v2 persona zone | `forBalanced()` → ConsequenceCompiler.js:977 | Governed operational briefing — emergence orchestration, reinforcement flow |
| DENSE | LENS v2 persona zone | Direct fullReport consumption + topology | Structural behavior interrogation — zone navigation, full topology |
| OPERATOR | LENS v2 persona zone | `forOperator()` → ConsequenceCompiler.js:1084 | Engineering evidence inspection — raw evidence, 4-decimal signals, governance lifecycle |
| INVESTIGATION | LENS v2 persona zone | `forInvestigation()` → ConsequenceCompiler.js:1113 | Evidence qualification — verification protocol (constitutional, no certified implementation) |

### 2.2 Structural Rendering Surfaces

| Surface | Location | Current Consumption Path | Function |
|---------|----------|------------------------|----------|
| IntelligenceField | `IntelligenceField.jsx` | Direct pressure_zone_state + signal data | Pressure zone glyph rendering — visual cognition substrate |
| StructuralTopologyZone | `StructuralTopologyZone.jsx` | Direct topology data + overlay conditions | Interactive SVG topology — primary cognition instrument |
| InvestigationVerifier | `InvestigationVerifier.js` | Direct pipeline artifacts | Evidence verification protocol — PASS/FAIL assertions |

---

## 3. PER-PHASE IMPACT MATRIX

### Phase 1 — PICR (Cognition Formation Runtime)

| Surface | Impact | Detail |
|---------|--------|--------|
| BOARDROOM | NONE | PICR is additive. forBoardroom() continues to consume fullReport directly. |
| BALANCED | NONE | forBalanced() continues unchanged. |
| DENSE | NONE | Direct fullReport consumption continues. |
| OPERATOR | NONE | forOperator() continues unchanged. |
| INVESTIGATION | NONE | forInvestigation() continues unchanged. |
| IntelligenceField | NONE | Consumes pressure_zone_state directly, unrelated to PICR. |
| StructuralTopologyZone | NONE | Consumes topology data directly, unrelated to PICR. |
| InvestigationVerifier | NONE | Consumes pipeline artifacts directly, unrelated to PICR. |

**Phase 1 verdict:** Zero impact on all 8 surfaces. PICR is a new parallel path, not a modification.

### Phase 2 — PICP (Cognition Package)

| Surface | Impact | Detail |
|---------|--------|--------|
| BOARDROOM | NONE | PICP wraps PICR output. No existing path changes. |
| BALANCED | NONE | Same. |
| DENSE | NONE | Same. |
| OPERATOR | NONE | Same. |
| INVESTIGATION | NONE | Same. |
| IntelligenceField | NONE | Unrelated to PICP. |
| StructuralTopologyZone | NONE | Unrelated to PICP. |
| InvestigationVerifier | NONE | Unrelated to PICP. |

**Phase 2 verdict:** Zero impact. PICP is a new artifact, no existing consumption path changes.

### Phase 3 — PRE (Consumer Projection Engine)

| Surface | Impact | Detail |
|---------|--------|--------|
| BOARDROOM | NONE | PRE is instantiated but does not replace existing paths yet. |
| BALANCED | NONE | Same. |
| DENSE | NONE | Same. |
| OPERATOR | NONE | Same. |
| INVESTIGATION | NONE | Same. |
| IntelligenceField | NONE | Unrelated to PRE. |
| StructuralTopologyZone | NONE | Unrelated to PRE. |
| InvestigationVerifier | NONE | Unrelated to PRE. |

**Phase 3 verdict:** Zero impact. PRE exists but is consumed only by new consumers (Phase 4+).

### Phase 4 — First Consumer Proof (EIR)

| Surface | Impact | Detail |
|---------|--------|--------|
| BOARDROOM | NONE | EIR is a new consumer. Does not touch LENS paths. |
| BALANCED | NONE | Same. |
| DENSE | NONE | Same. |
| OPERATOR | NONE | Same. |
| INVESTIGATION | NONE | Same. |
| IntelligenceField | NONE | Unrelated. |
| StructuralTopologyZone | NONE | Unrelated. |
| InvestigationVerifier | NONE | Unrelated. |

**Phase 4 verdict:** Zero impact. EIR is an entirely new consumer path.

### Phase 5 — Graphics and Topology as PRE-Consumable Assets

| Surface | Impact | Detail |
|---------|--------|--------|
| BOARDROOM | NONE | Asset pipeline is additive. |
| BALANCED | NONE | Same. |
| DENSE | NONE | Same. |
| OPERATOR | NONE | Same. |
| INVESTIGATION | NONE | Same. |
| IntelligenceField | NONE | IntelligenceField is read for static asset generation but not modified. |
| StructuralTopologyZone | NONE | Topology SVG export is read for static rendering but interactive component is unchanged. |
| InvestigationVerifier | NONE | Unrelated. |

**Phase 5 verdict:** Zero impact. Static asset generation reads from existing components but does not modify them.

### Phase 6 — LENS as Reference Consumer #2 (Architecture Validation)

| Surface | Impact | Detail | Regression Test |
|---------|--------|--------|-----------------|
| BOARDROOM | **RE-ROUTE** | forBoardroom() re-routed to consume PICP through PRE with BOARDROOM ProjectionConfig | Snapshot before/after → diff must be zero |
| BALANCED | **RE-ROUTE** | forBalanced() re-routed to consume PICP through PRE with BALANCED ProjectionConfig | Snapshot before/after → diff must be zero |
| DENSE | **RE-ROUTE** | Direct fullReport consumption re-routed through PICP/PRE with DENSE ProjectionConfig | Snapshot before/after → diff must be zero |
| OPERATOR | **RE-ROUTE** | forOperator() re-routed to consume PICP through PRE with OPERATOR ProjectionConfig | Snapshot before/after → diff must be zero |
| INVESTIGATION | **RE-ROUTE** | forInvestigation() re-routed through PICP/PRE with INVESTIGATION ProjectionConfig | Snapshot before/after → diff must be zero |
| IntelligenceField | NONE | Consumes pressure_zone_state directly. Not re-routed through PICP/PRE. | — |
| StructuralTopologyZone | NONE | Consumes topology data directly. Not re-routed through PICP/PRE. | — |
| InvestigationVerifier | NONE | Consumes pipeline artifacts directly. Not re-routed through PICP/PRE. | — |

**Phase 6 verdict:** 5 surfaces RE-ROUTED (persona projections). 3 surfaces UNCHANGED (structural rendering). All re-routed surfaces must pass regression test: rendering output identical before and after.

---

## 4. REGRESSION TEST PROTOCOL (Phase 6)

### Pre-Condition

Before any Phase 6 work begins:
1. Capture full rendering snapshot of each persona mode on the GENESIS specimen (run_blueedge_genesis_e2e_03)
2. Store snapshots as regression baselines
3. Include: rendered HTML structure, data values, section content, signal values, posture labels

### Execution

For each persona (BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION):
1. Create persona-specific ProjectionConfig
2. Wire persona consumption path: fullReport → PICP → PRE → persona zone
3. Capture post-migration rendering snapshot
4. Diff against pre-migration baseline

### Pass Criteria

| Check | Criterion |
|-------|-----------|
| Structural HTML identical | Section structure, heading hierarchy, zone composition unchanged |
| Data values identical | All signal values, posture labels, domain counts, severity levels unchanged |
| Narrative content equivalent | Governed narrative text may differ in whitespace/formatting but semantic content identical |
| Governance metadata present | S-level, Q-class, confidence envelope, disclosure markers present |
| No missing sections | Every section in pre-migration snapshot exists in post-migration |
| No new sections | No unexpected sections added by PRE that were not in pre-migration |

### Fail Handling

If any persona fails the regression test:
1. **Investigate root cause** — is the diff a genuine regression or an existing inconsistency exposed by formalization?
2. **If regression:** Fix the PRE/PICP path to match pre-migration output
3. **If inconsistency:** Document the inconsistency, decide whether to preserve or fix, record decision in execution report
4. **Never silently accept rendering differences** — every diff is either a regression to fix or an inconsistency to document

---

## 5. SUMMARY

| Phase | Surfaces Impacted | Risk Level |
|-------|------------------|------------|
| Phase 1 | 0/8 | NONE |
| Phase 2 | 0/8 | NONE |
| Phase 3 | 0/8 | NONE |
| Phase 4 | 0/8 | NONE |
| Phase 5 | 0/8 | NONE |
| Phase 6 | 5/8 (persona re-routing) | MEDIUM — mitigated by regression test protocol |

**Phases 1-5 are entirely ADDITIVE.** No existing LENS surface is modified.

**Phase 6 is the ONLY phase that touches existing surfaces.** All 5 persona projection surfaces are re-routed through PICP/PRE. Output must be identical — regression-tested.

**3 structural rendering surfaces (IntelligenceField, StructuralTopologyZone, InvestigationVerifier) are NEVER re-routed.** They consume structural data directly and are not part of the PICP/PRE consumption chain. They remain unchanged across all 6 phases.
