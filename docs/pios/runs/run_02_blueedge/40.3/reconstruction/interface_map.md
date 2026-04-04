# Interface Map
run_id: run_02_blueedge
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation
input: docs/pios/runs/run_02_blueedge/40.2/normalized_evidence_map.md

---

## Reconstruction Rule

Interface entries are recorded only where the 40.2 normalized evidence contains explicit statements about boundaries, handover points, integration contracts, or explicitly named integration artifacts. No interface is inferred from structural proximity.

Formal interface definition files (e.g., OpenAPI, schema files) were not present in the repository at INT-03 scan time. This is explicitly confirmed in normalized_evidence_map.md §5.

---

## Interface Presence Statement

> "No API schemas, OpenAPI specifications, or explicitly defined interface contracts were discovered in this repository."
> — normalized_evidence_map.md §5

This map records explicitly observable integration boundaries and handover contracts as stated in documentation artifacts.

---

## IF-01 — M-03 to M-04 Pipeline Interface

| Field | Value |
|---|---|
| Interface type | Artifact handover (pipeline stage boundary) |
| Producer | M-03 — PiOS Evidence Connectors Layer |
| Consumer | M-04 — PiOS Reverse Engineering Engine |
| Evidence source | normalized_evidence_map.md §2.3, §2.4 |

**Handover artifacts (explicitly named):**
- `evidence_surface_inventory.md`
- `normalized_evidence_map.md`

**Observable constraint:** M-04 accepts these two artifacts as its strict and sole inputs. No other inputs are permitted.

---

## IF-02 — M-04 to M-05 Pipeline Interface

| Field | Value |
|---|---|
| Interface type | Artifact handover (pipeline stage boundary) |
| Producer | M-04 — PiOS Reverse Engineering Engine |
| Consumer | M-05 — PiOS Telemetry Extraction Layer |
| Evidence source | normalized_evidence_map.md §2.4, §2.5 |

**Handover artifacts (explicitly named in M-04 structural hints):**
- `entity_catalog.md`
- `repository_map.md`
- `dependency_map.md`
- `interface_map.md`
- `program_execution_graph.md`

**Observable constraint:** M-05 accepts the reconstruction corpus and PEG as inputs.

---

## IF-03 — M-08 to Signäl Platform Interface

| Field | Value |
|---|---|
| Interface type | Intelligence output delivery |
| Producer | M-08 — PiOS Intelligence Synthesis Layer |
| Consumer | Signäl Platform (C-03) |
| Evidence source | normalized_evidence_map.md §1.2, §2.8 |

**Handover artifacts (explicitly named):**
- `program_intelligence_summary.md`
- `evidence_linked_intelligence_packet.md`
- `executive_interpretation_brief.md`
- `intelligence_lineage_map.md`

**Observable constraint:** Signäl Platform is explicitly named as outside PiOS scope. This interface is the only defined boundary between PiOS runtime outputs and the experience layer.

---

## IF-04 — M-10 to Stream 77 Interface

| Field | Value |
|---|---|
| Interface type | Feedback routing |
| Producer | M-10 — PiOS Feedback and Continuous Improvement Layer |
| Consumer | Stream 77 — Discipline Feedback Loop Registry |
| Evidence source | normalized_evidence_map.md §2.10 |

**Observable constraint:** M-10 routes improvements to Stream 77. Stream 77 is explicitly named as the receiving discipline construct.

---

## IF-05 — CI/CD Automation Interface

| Field | Value |
|---|---|
| Interface type | Script invocation (CI/CD) |
| Invoker | CF-03 — update-handbook-indexes.yml |
| Invoked | SC-01 — generate-stream-indexes.sh |
| Trigger | Push to `main` branch |
| Output target | `docs/handbook/handbook_stream_*_index.md` |
| Evidence source | normalized_evidence_map.md §4.1, §6.1 |

**Observable invocation pattern:**
```
GitHub Actions (push to main)
  → checkout (actions/checkout@v4)
  → chmod +x generate-stream-indexes.sh
  → ./generate-stream-indexes.sh
  → git add docs/handbook
  → git commit + push
  → actor: github-actions / actions@github.com
```

---

## IF-06 — M-07 to Stream 75.1 and 75.2 Model Interface

| Field | Value |
|---|---|
| Interface type | Model activation |
| Activator | M-07 — PiOS Condition and Diagnosis Activation Layer |
| Activated models | Stream 75.1 (Program Condition Model), Stream 75.2 (Program Diagnosis Model) |
| Evidence source | normalized_evidence_map.md §2.7 |

**Observable constraint:** M-07 activates these models but does not own them. Models are defined in Stream 75.1 and 75.2.

---

## IF-07 — M-06 to Stream 70 Signal Model Interface

| Field | Value |
|---|---|
| Interface type | Model application |
| Applicator | M-06 — PiOS Signal Computation Engine |
| Applied models | Stream 70 — Execution Signal Science |
| Evidence source | normalized_evidence_map.md §2.6 |

**Observable output signals:**
- Execution Stability Index (ESI) — CKR-014
- Risk Acceleration Gradient (RAG) — CKR-015

---

## Interface Summary

| ID | Type | Producer | Consumer |
|---|---|---|---|
| IF-01 | Artifact handover | M-03 | M-04 |
| IF-02 | Artifact handover | M-04 | M-05 |
| IF-03 | Intelligence output delivery | M-08 | Signäl Platform |
| IF-04 | Feedback routing | M-10 | Stream 77 |
| IF-05 | CI/CD script invocation | CF-03 | SC-01 → docs/handbook |
| IF-06 | Model activation | M-07 | Stream 75.1, 75.2 |
| IF-07 | Model application | M-06 | Stream 70 |

**Formal interface definition files:** 0 (confirmed absent — normalized_evidence_map.md §5)
