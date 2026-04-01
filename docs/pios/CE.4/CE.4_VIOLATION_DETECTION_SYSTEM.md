# CE.4 — Violation Detection System

**Stream:** CE.4 — Enforcement & Runtime Guard System
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.3_BOUNDARY_VIOLATION_RULES.md, CE.3_INTERFACE_VALIDATION_RULES.md

---

## 1. Detection Coverage

This document translates all CE.3 boundary violations (BV), forbidden flows (FF), and violation detection rules (VD) into deterministic detection mechanisms.

---

## 2. Boundary Violation Detection

| BV ID | Description | Detection Signal | Evaluation |
|---|---|---|---|
| BV-01 | 41.x accessing 40.4 directly | 41.x script reads docs/pios/40.4/ paths | File access audit: flag any 41.x import/read of 40.4 artifact |
| BV-02 | 42.x accessing 40.4 directly | 42.x script reads docs/pios/40.4/ paths | File access audit: flag any 42.x import/read of 40.4 artifact |
| BV-03 | 42.x accessing Core outputs directly | 42.x reads docs/pios/40.5/–40.11/ paths without L5 payload mediation | File access audit: flag direct Core output consumption by 42.x |
| BV-04 | Core accessing 41.x outputs | 40.5–40.11 script reads docs/pios/41.x/ paths | File access audit: flag any Core import of 41.x artifact |
| BV-05 | Core accessing 42.x behavior | 40.5–40.11 script imports or references 42.x / app/ paths | File access audit: flag any reference in Core scripts |
| BV-06 | 42.x feeding state back into Core | 42.x script writes to docs/pios/40.x/ paths | File write audit: flag any 42.x write to Core paths |
| BV-07 | 41.x feeding modified outputs back into Core | 41.x script writes to docs/pios/40.x/ paths | File write audit |
| BV-08 | 40.5 accessing 40.1–40.3 directly | Core scripts read docs/pios/40.1/–40.3/ | File access audit: flag direct pre-Core access |
| BV-09 | SSZ/SSI computation at L6 | `computeSSZ` or `computeSSI` present in app/ or scripts/pios/42.x/ | Text search: grep for computeSSZ, computeSSI outside 40.x scope |
| BV-10 | Semantic interpretation inside Core | Natural language generation, ranking, or causal inference in 40.5–40.11 outputs | Output inspection: check for non-structured prose in Core artifacts |
| BV-11 | Narrative text inside Core | Free-form narrative in any 40.5–40.11 output field | Field type check: all Core output fields must be typed (numeric, enum, boolean, structured) |
| BV-12 | Signal recomputation in 41.x or 42.x | NF-xx, PES-ESI-xx, ESI/RAG computation in non-40.5 scripts | Text search: grep for NF-0, PES-ESI, ESI =, RAG = outside scripts/pios/40.5/ |
| BV-13 | PARTIAL/UNDEFINED flags stripped | Downstream artifact missing flags present in esi_manifest.json | Flag propagation check: compare flags from esi_manifest.json against derivative artifacts |
| BV-14 | Presentation replacing UNDEFINED with synthetic value | 42.x renders UNDEFINED as 0, empty, or unlabeled placeholder | Output inspection: UNDEFINED must appear as declared state in rendered output |
| BV-15 | Contract prose acting as architecture authority | New layer ownership or derivation behavior defined inside contract prose | Governance review: contracts must reference canonical-layer-model.md, not redefine it |

---

## 3. Forbidden Flow Detection

| FF ID | Forbidden Flow | Detection Signal | Evaluation |
|---|---|---|---|
| FF-01 | Raw 40.4 telemetry → 41.x | 41.x file references docs/pios/40.4/ | File access audit |
| FF-02 | Raw 40.4 telemetry → 42.x | 42.x file references docs/pios/40.4/ | File access audit |
| FF-03 | Core ESI/RAG → 42.x without L5 mediation | 42.x reads esi_manifest.json directly | File access audit: esi_manifest.json must not be read by 42.x |
| FF-04 | 42.x rendered state → Core | 42.x writes to docs/pios/40.x/ | File write audit |
| FF-05 | 41.x modifies 40.7 diagnosis artifact | SHA-256 of 40.7 output changes after 41.x runs | Hash check: re-verify 40.7 output hash post-41.x execution |
| FF-06 | Demo sequencing generates new signals | L7 demo scripts produce ESI/RAG/condition values | Text search: grep for signal-like values in docs/pios/51.x/ or demo scripts |
| FF-07 | L8 contracts define derivation behavior | Contract prose contains NF/PES/ESI computation formulas | Content inspection: contracts reference derivation specs, never define them |
| FF-08 | L5 assembly introduces signals without L3 provenance | ESI/RAG value in L5 payload not traceable to esi_manifest.json run_id | Provenance check: every signal in L5 payload must carry run_id traceable to Core |

---

## 4. Violation Detection Rule Implementation

| VD ID | Check | Implementation |
|---|---|---|
| VD-01 | 40.4 access outside Core | Static scan: grep for docs/pios/40.4 in scripts/pios/41.x, scripts/pios/42.x, app/ |
| VD-02 | Signal values without Core provenance | JSON field check: every ESI/RAG/PES value in downstream artifacts must carry matching run_id from esi_manifest.json |
| VD-03 | PARTIAL/UNDEFINED flags absent in downstream | Compare flags: load esi_manifest.json UNDEFINED/PARTIAL fields; verify all present in derivative artifacts |
| VD-04 | SSZ/SSI outside L3 | Static scan: grep -r "computeSSZ\|computeSSI\|ssz\." outside scripts/pios/40.x/ |
| VD-05 | Core output artifacts modified post-production | Hash check: SHA-256 of docs/pios/40.16/baseline/*.json must match identity lock |
| VD-06 | Semantic interpretation inside Core | Output field type audit: 40.5–40.10 output fields must be typed (float/null/enum/bool/count/string-id); no prose |
| VD-07 | Reverse flow from 42.x to Core | File write audit: no write events to docs/pios/40.x/ from scripts/pios/42.x/ or app/ |
| VD-08 | Input contract hash mismatch | SHA-256 verification: validate_input_contract.py result must be PASS |
| VD-09 | Run ID absent or inconsistent | String match: extract run_id from all Core artifacts in a run; assert all equal |
| VD-10 | DRIFT-001 active in production paths | Execution audit: verify computeSSZ() in utils/ssz.js is not called in canonical pipeline path |

---

## 5. Detection Scope Matrix

| Violation Category | Detection Method | Timing |
|---|---|---|
| File access boundary violations | Static analysis (grep/path audit) | Pre-execution or CI |
| Output field violations | Schema validation at layer handoff | Intra-Core (Phase 2) |
| Hash integrity violations | SHA-256 comparison | Pre-execution (Phase 1) + Post-Core (Phase 3) |
| Flag propagation violations | Field presence comparison | Post-Core (Phase 3) |
| Run ID consistency violations | String equality across artifacts | Post-Core (Phase 3) |
| Reverse flow violations | File write path audit | Intra- and post-execution |
| DRIFT-001 | Text search + execution trace | Pre-execution or CI |
