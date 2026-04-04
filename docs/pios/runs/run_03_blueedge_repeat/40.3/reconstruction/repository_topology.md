# Repository Topology
run_id: run_03_blueedge_repeat
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification
input: docs/pios/runs/run_03_blueedge_repeat/40.2/evidence_surface_inventory.md, docs/pios/runs/run_03_blueedge_repeat/40.2/normalized_evidence_map.md

---

## Topology Statement

The repository is structured into four distinct functional zones, observable from the directory layout and stream ownership mappings in the evidence. Zones are not inferred — they are explicitly defined in the governance artifacts captured in 40.2.

---

## Zone 1 — Discipline and Framework (docs/)

**Observable structure:**

```
docs/
├── governance/             ← Stream 00 — governance authority
├── handbook/               ← Compiled handbook (auto-generated indexes)
├── program-intelligence-discipline/   ← Stream 10
├── program-intelligence-framework/   ← Stream 20
│   ├── pios/               ← PiOS runtime framework specifications
│   └── drafts/             ← Draft artifacts (pre-formalization)
├── program-intelligence-commercialization/  ← Stream 30
├── program-intelligence-demonstrations/     ← Stream 50
├── program-intelligence-case-studies/       ← Stream 60
├── signal-science/         ← Stream 40 analytical artifacts
├── research/               ← Research artifacts (RSR series)
└── web-governance/         ← Web governance
```

**Observable relationship:** Each subdirectory maps to exactly one stream. Mapping is explicit in `docs/governance/governance_master_capsule.md` (captured in normalized_evidence_map.md §9).

---

## Zone 2 — Runtime Working Files (streams/)

**Observable structure:**

```
streams/
└── 40_Signal Execution Signal Infra/
    ├── 40.0_PiOSRuntimeLayerConceptualModel.md
    └── 40.0_PiOSRuntimeLayer/
        ├── 40.1_PiOSRuntimeArchitecture/
        ├── 40.2_PiOSEvidenceConnectors/
        ├── 40.3_PIOSReverseEngineering/
        ├── 40.4_PiOSTelementryExtraction/
        ├── 40.5_PiOSSignalComputation/
        ├── 40.6_PiOSConditionDiagnosisLayer/
        ├── 40.7_PiOSIntellignceSynthesisLayer/
        ├── 40.8_PiOSAgenticOrchestrationLayer/
        └── 40.9_PiOSFeedbackAndCI Layer/
```

**Observable relationship:** Each subdirectory contains one stream execution file. Directory numbering (40.1 through 40.9) corresponds directly to the PiOS runtime module sequence defined in the pipeline.

---

## Zone 3 — Automation (scripts/ + .github/)

**Observable structure:**

```
scripts/
└── generate-stream-indexes.sh   ← handbook index generator

.github/
└── workflows/
    └── update-handbook-indexes.yml   ← CI/CD automation
```

**Observable relationship:** `update-handbook-indexes.yml` invokes `generate-stream-indexes.sh`. Output targets `docs/handbook/handbook_stream_*_index.md` files. This creates an observable write dependency: automation zone → handbook zone.

---

## Zone 4 — PiOS Execution Outputs (docs/pios/)

**Observable structure:**

```
docs/pios/
├── 40.2/           ← 40.2 intake artifacts
├── 40.3/           ← 40.3 reconstruction artifacts (this execution)
└── contracts/      ← contract governance
    ├── 40.2/
    └── 40.3/
```

**Observable relationship:** PiOS execution outputs are segregated from discipline artifacts. This directory was not present at INT-03 scan time. It is excluded from the INT-03 baseline count.

---

## Inter-Zone Relationships (Observable)

| From | To | Relationship | Evidence Source |
|---|---|---|---|
| streams/40.x/ | docs/program-intelligence-framework/pios/ | Streams produce framework specs | normalized_evidence_map.md §2 |
| docs/governance/ | all docs/ subdirs | Governance authority over all stream artifacts | normalized_evidence_map.md §9 GC-01 |
| scripts/generate-stream-indexes.sh | docs/handbook/ | Writes auto-generated indexes | normalized_evidence_map.md §6.1 |
| .github/workflows/ | scripts/ | CI/CD invokes scripts | normalized_evidence_map.md §4.1 |
| docs/program-intelligence-discipline/ | all streams | Discipline defines analytical models | normalized_evidence_map.md §2.11 |
| docs/signal-science/ | docs/program-intelligence-framework/ | Signal science informs framework | normalized_evidence_map.md §2.11 DS-08 |

---

## Topology Notes

- `working-state/` directory: present, no files. Not assigned to a zone.
- `docs/program-intelligence-framework/drafts/`: 9 pre-formalization artifacts; contained within the Stream 20 zone but structurally distinct.
- Binary/system files (.DS_Store, .zip): present across zones; not functional topology elements.
