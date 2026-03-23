# Stream 51.1S — Input Authority Matrix

Stream: 51.1S — Demo Artifact Canonicalization Decision
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Branch: feature/51-1s-demo-canonicalization

---

## Authority Decision

Outcome A: Flat files are current canonical authority.

---

## Full Authority Matrix

| Path | Classification | SHA-256 | Present on Disk |
|---|---|---|---|
| docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md | CANONICAL | 11b3562525fa96ebf11696693604a2d98ab4c99b093db39f3640a56935cb57ca | YES |
| docs/program-intelligence-demonstrations/wow_30_day_demonstration.md | CANONICAL | 6ee67de7c1ee0111ba8d7114d0212bb357fc8537cd9725e123745a104543a49a | YES |
| docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md | CANONICAL | 57dd6e070b60750795302eb094c522d2d30806b98067e7e21028329a2821222d | YES |
| docs/program-intelligence-demonstrations/demonstration_signal_pipeline.md | CANONICAL | 7d54fb021d4ec0397da22ef492ed33909ee1b0f1066b5ea4b238802cf8b7ca85 | YES |
| docs/program-intelligence-demonstrations/published/ | NON-CANONICAL | — | YES (empty — .DS_Store only) |
| docs/program-intelligence-demonstrations/core/ | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/investor/ | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/killer-shots/ | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/demo-model/ | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/core/demo_script_pack_v1.md | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/investor/investor_demo_variant.md | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/killer-shots/KS3_structural_stress.md | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/killer-shots/KS4_narrative.md | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/demo-model/demo_sequence.md | TARGET-STATE ONLY | — | NO |
| docs/program-intelligence-demonstrations/demo-model/narrative_rules.md | TARGET-STATE ONLY | — | NO |

---

## Classification Definitions

| Classification | Meaning |
|---|---|
| CANONICAL | Authoritative current input. 51.2 must reference this file. |
| NON-CANONICAL | Present on disk but not a governing input. No content authority. |
| TARGET-STATE ONLY | Does not exist on disk. Represents future desired structure only. May not be referenced as current input. |
| MISSING | Expected to exist but absent. Triggers fail-closed if mandatory. |

---

## Downstream 51.2 Input Binding

51.2 MUST use the following as its authoritative demo inputs:

1. docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md
   SHA-256: 11b3562525fa96ebf11696693604a2d98ab4c99b093db39f3640a56935cb57ca

2. docs/program-intelligence-demonstrations/wow_30_day_demonstration.md
   SHA-256: 6ee67de7c1ee0111ba8d7114d0212bb357fc8537cd9725e123745a104543a49a

3. docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md
   SHA-256: 57dd6e070b60750795302eb094c522d2d30806b98067e7e21028329a2821222d

4. docs/program-intelligence-demonstrations/demonstration_signal_pipeline.md
   SHA-256: 7d54fb021d4ec0397da22ef492ed33909ee1b0f1066b5ea4b238802cf8b7ca85

51.2 MUST NOT silently substitute any TARGET-STATE ONLY path for a CANONICAL path.
51.2 MUST NOT treat published/ as a canonical input source.

---

## Mixed-Authority Prevention Rule

The following substitutions are explicitly prohibited:

| Prohibited Substitution | Reason |
|---|---|
| core/demo_script_pack_v1.md ← program_intelligence_demonstration_model.md | silent substitution — different paths, different structural role |
| killer-shots/KS3_structural_stress.md ← wow_30_day_demonstration.md | silent substitution — does not exist, cannot be assumed equivalent |
| demo-model/narrative_rules.md ← any flat file | no on-disk equivalent — remains target-state only |

Mixed-authority state is not permitted. Outcome A is the singular governing decision.
