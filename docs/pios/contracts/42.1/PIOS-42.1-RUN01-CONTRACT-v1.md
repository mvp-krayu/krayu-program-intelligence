# PIOS-42.1-RUN01-CONTRACT-v1
## ExecLens Query Execution Layer

**contract_id:** PIOS-42.1-RUN01-CONTRACT-v1
**stream_reference:** Stream 42.1 — ExecLens Query Execution Layer
**program:** Krayu — Program Intelligence (PiOS)
**run_reference:** run_01_blueedge
**status:** EXECUTED
**execution_mode:** deterministic / evidence-first / query-driven
**handover_to:** 42.2 — ExecLens Narrative Rendering Layer
**date:** 2026-03-20

---

## Objective

Implement the deterministic ExecLens query execution entry point that traverses
the locked PiOS 41.x foundation using the fixed path:

QUERY → SIGNAL → EVIDENCE → NAVIGATION → OUTPUT

No semantic recomputation. No signal inference. No free-text narrative generation.

---

## Scripts Produced

| Script | Location |
|---|---|
| run_execlens_query.py | scripts/pios/42.1/run_execlens_query.py |
| validate_query_execution.py | scripts/pios/42.1/validate_query_execution.py |

---

## Input Boundary

| Artifact | Path | Role |
|---|---|---|
| query_signal_map.json | docs/pios/41.5/query_signal_map.json | Query → signal binding |
| signal_registry.json | docs/pios/41.4/signal_registry.json | Signal → evidence metadata |
| evidence_mapping_index.json | docs/pios/41.4/evidence_mapping_index.json | Evidence chain binding |
| query_response_templates.md | docs/pios/41.5/query_response_templates.md | Template rendering source |
| PIE vault | docs/pios/41.2/pie_vault/ | Navigation link resolution |

---

## Traversal Path

```
query_id
  → query_signal_map.json        [R1: query resolution]
  → signal_registry.json         [R2-R3: signal binding + resolution]
  → evidence_mapping_index.json  [R4: evidence binding]
  → docs/pios/41.2/pie_vault/    [R5: navigation binding]
  → query_response_templates.md  [R6: template rendering]
  → stdout                       [R8: output]
```

---

## Governance

- All 41.x inputs are read-only and immutable
- No canonical artifacts created or modified under docs/pios/41.x/
- Execution output is stdout only (no persisted result files)
- Any missing required binding stops execution immediately (G4: fail closed)
