# Missing Artifact Log
## PI.LENS.BLUEEDGE-EVIDENCE-CHAIN-MANIFEST.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Summary

7 of 33 mapped artifacts are ABSENT from k-pi-core.

5 are classified as CRITICAL — their absence means the BlueEdge evidence chain has broken links that cannot be bridged by existing artifacts.

---

## Absent Artifacts

### MA-01 — sha256_manifest

| Field | Value |
|-------|-------|
| Stage | SOURCE |
| Path | clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/manifests/fastapi-backend.manifest.sha256 |
| Source | SOURCE_MANIFEST |
| Criticality | LOW |
| Reason | BlueEdge has no in-repo SHA256 manifest — the archive is external. This is by design, not a gap. |
| Reconstructible | N/A — not applicable to BlueEdge pipeline |

---

### MA-02 — canonical_repo (extracted source tree)

| Field | Value |
|-------|-------|
| Stage | INTAKE |
| Path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo |
| Source | SOURCE_MANIFEST (extracted_path) |
| Criticality | CRITICAL |
| Reason | Directory does not exist in k-pi-core. Extraction from external archive was never committed. |
| Reconstructible | Only if external archive is re-extracted — archive is external and SHA256-identified only |
| Downstream blocked | structure_40x_directory (MA-03), dom_path_domain_layer (MA-05) |

---

### MA-03 — structure_40x_directory (structural scanner output)

| Field | Value |
|-------|-------|
| Stage | STRUCTURE |
| Path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/structure |
| Source | SOURCE_MANIFEST (structure_path) |
| Criticality | CRITICAL |
| Reason | 40.x structural scanner was never run against BlueEdge source — 40.2/40.3/40.4 subdirectories do not exist |
| Reconstructible | Only if canonical_repo (MA-02) is available and 40.x scanner is re-executed |
| Downstream blocked | dom_path_domain_layer (MA-05) was bypassed — canonical_topology was derived from absent dom file |

---

### MA-04 — ceu_grounding_registry_directory

| Field | Value |
|-------|-------|
| Stage | CEU |
| Path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/ceu_grounding |
| Source | SOURCE_MANIFEST (ceu_grounding_path) |
| Criticality | LOW |
| Reason | CEU grounding registry directory does not exist — however, grounding_state_v3.json (UUID_RUN) is present and captures all CEU outputs |
| Reconstructible | Not required — grounding_state_v3.json is the authoritative CEU output |

---

### MA-05 — dom_path_domain_layer

| Field | Value |
|-------|-------|
| Stage | DOM |
| Path | docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json |
| Source | DOCS_PSEE (dom_layer_path) |
| Criticality | CRITICAL |
| Reason | Directory PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01 does not exist in docs/psee. File is the 13-domain PATH_EVIDENCE_ONLY DOM layer that was the upstream source for canonical_topology.json |
| Reconstructible | NO — requires structural scanner output (MA-03) which itself requires canonical_repo (MA-02) |
| Downstream impact | canonical_topology.json (vault) exists but its upstream derivation path is broken; values cannot be independently verified |

---

### MA-06 — fastapi_conformance_precomputed_directory

| Field | Value |
|-------|-------|
| Stage | BINDING |
| Path | docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed |
| Source | DOCS_PSEE (fastapi_conformance_path) |
| Criticality | CRITICAL |
| Reason | Directory PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01 does not exist in docs/psee. This directory contained pre-computed signals and binding artifacts consumed during binding_envelope.json production. |
| Reconstructible | NO — precomputed by a separate FastAPI conformance pipeline whose inputs are not in k-pi-core |
| Downstream impact | signal_registry.json values and binding_envelope.json cannot be independently re-derived; both exist as terminal facts without upstream derivation |

---

### MA-07 — structure_40x_directory (second reference)

*Note: MA-03 and MA-07 reference the same absent path from different perspectives — already counted once under MA-03.*

---

## Chain Break Analysis

```
[External Archive] ──present (external)──▶ [canonical_repo] ──ABSENT (MA-02)──▶ CHAIN BREAK
                                                                                        │
                                                                        [structure] ──ABSENT (MA-03)
                                                                                        │
                                                                          [DOM layer] ──ABSENT (MA-05)
                                                                                        │
                                                                [fastapi_conformance] ──ABSENT (MA-06)
                                                                                        │
                                                         ┌──────────────────────────────┘
                                                         │  (chain resumes from pre-existing outputs)
                                                         ▼
                                            [binding_envelope.json] ──PRESENT (NAMED_RUN)
                                                         │
                                                         ▼
                                               [vault/] ──PRESENT (NAMED_RUN)
```

The chain has a single major break spanning 4 sequential absent stages (INTAKE → STRUCTURE → DOM → BINDING-UPSTREAM). All present artifacts are terminal outputs — they cannot be walked backward through the chain to the source archive using only in-repo artifacts.

---

## Criticality Classification

| ID | Stage | Criticality | Reconstructible |
|----|-------|-------------|-----------------|
| MA-01 | SOURCE | LOW | N/A |
| MA-02 | INTAKE | CRITICAL | External only |
| MA-03 | STRUCTURE | CRITICAL | Requires MA-02 |
| MA-04 | CEU | LOW | Not required |
| MA-05 | DOM | CRITICAL | Requires MA-03 |
| MA-06 | BINDING | CRITICAL | NO |

**Critical absent: 4**
**Non-critical absent: 2 (MA-01 design intent, MA-04 superseded by grounding_state_v3.json)**
