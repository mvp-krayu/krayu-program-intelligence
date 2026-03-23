# Stream 51.1S — Canonicalization Decision Record

Stream: 51.1S — Demo Artifact Canonicalization Decision
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Execution timestamp: 2026-03-23T16:00:00Z
Branch: feature/51-1s-demo-canonicalization
Execution version: 51.1S-v1
Status: COMPLETE

---

## Inspection Commands Executed

```
find docs/program-intelligence-demonstrations -maxdepth 1 -type f | sort
find docs/program-intelligence-demonstrations -mindepth 2 -type f | sort
find docs/program-intelligence-demonstrations -type d | sort
shasum -a 256 docs/program-intelligence-demonstrations/*.md
```

---

## On-Disk State: Flat Files (root level)

| File | SHA-256 | Status |
|---|---|---|
| docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md | 57dd6e070b60750795302eb094c522d2d30806b98067e7e21028329a2821222d | PRESENT |
| docs/program-intelligence-demonstrations/demonstration_signal_pipeline.md | 7d54fb021d4ec0397da22ef492ed33909ee1b0f1066b5ea4b238802cf8b7ca85 | PRESENT |
| docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md | 11b3562525fa96ebf11696693604a2d98ab4c99b093db39f3640a56935cb57ca | PRESENT |
| docs/program-intelligence-demonstrations/wow_30_day_demonstration.md | 6ee67de7c1ee0111ba8d7114d0212bb357fc8537cd9725e123745a104543a49a | PRESENT |

---

## On-Disk State: Structured Subdirectory Paths

| Path | Status |
|---|---|
| docs/program-intelligence-demonstrations/core/ | ABSENT — directory does not exist |
| docs/program-intelligence-demonstrations/investor/ | ABSENT — directory does not exist |
| docs/program-intelligence-demonstrations/killer-shots/ | ABSENT — directory does not exist |
| docs/program-intelligence-demonstrations/demo-model/ | ABSENT — directory does not exist |
| docs/program-intelligence-demonstrations/published/ | PRESENT — contains only .DS_Store (no .md files) |

---

## Decision

Outcome A: Flat demo files are the current canonical input authority.

Structured paths (core/, investor/, killer-shots/, demo-model/) do not exist on disk.
No structured files are present. No Outcome B evidence exists.

The four flat files at the root of docs/program-intelligence-demonstrations/ are the sole
present authoritative demo artifact set.

---

## Rationale

Disk evidence is unambiguous:
- 4 flat .md files present at root level — all readable
- 0 structured subdirectory files present — all required subdirectories absent
- Decision Rule: current disk evidence is authoritative
- Future desired structure is not current authority unless materialized on disk

No fail-closed trigger required. Outcome A is deterministic from disk state.

---

## Canonical Input Authority for Stream 51.2 (corrected)

| Canonical Path | Role in 51.2 |
|---|---|
| docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md | Master demo model / sequence authority |
| docs/program-intelligence-demonstrations/wow_30_day_demonstration.md | WOW script authority |
| docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md | Executive intelligence demonstration authority |
| docs/program-intelligence-demonstrations/demonstration_signal_pipeline.md | Signal pipeline demonstration authority |

51.2 must reference these 4 paths as authoritative inputs.
51.2 must NOT reference structured paths that do not exist on disk.

---

## Non-Canonical / Target-State Classification

| Path | Classification |
|---|---|
| docs/program-intelligence-demonstrations/core/demo_script_pack_v1.md | TARGET-STATE ONLY — does not exist |
| docs/program-intelligence-demonstrations/investor/investor_demo_variant.md | TARGET-STATE ONLY — does not exist |
| docs/program-intelligence-demonstrations/killer-shots/KS3_structural_stress.md | TARGET-STATE ONLY — does not exist |
| docs/program-intelligence-demonstrations/killer-shots/KS4_narrative.md | TARGET-STATE ONLY — does not exist |
| docs/program-intelligence-demonstrations/demo-model/demo_sequence.md | TARGET-STATE ONLY — does not exist |
| docs/program-intelligence-demonstrations/demo-model/narrative_rules.md | TARGET-STATE ONLY — does not exist |

These paths were referenced in the prior 51.2 stream contract. They are future desired structure
only. They are not current canonical authority. They may not be silently substituted.
