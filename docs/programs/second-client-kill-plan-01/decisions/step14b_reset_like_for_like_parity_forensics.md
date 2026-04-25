# STEP 14B-RESET — Like-for-Like Deliverable Parity Forensics

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14B-RESET
**Date:** 2026-04-25
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Like-for-like parity forensics executed. All 12 questions answered from canonical artifact evidence. Parity gap fully characterized. No fabrication. No projection.

---

## Q1 — BlueEdge Tier-1 Deliverable Definition

**Source authority:** `scripts/pios/lens_report_generator.py` default path (`tier1=True`, no `--legacy` flag)

**Execution path:**
```
_configure_runtime() → generate_tier1_reports() + generate_tier2_reports()
reads CANONICAL_PKG_DIR → calls Node.js subprocess → produces HTML reports
```

**Output artifacts:**
- `{TIER1_REPORTS_DIR}/lens_report.html` — full LENS Tier-1 HTML report
- `{TIER2_REPORTS_DIR}/lens_tier2.html` — Tier-2 workspace report
- `graph_state.json` produced by Node.js subprocess (`export_graph_state.mjs`)

**BlueEdge canonical run:** `run_authoritative_recomputed_01`
**CANONICAL_PKG_DIR:** `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/`

---

## Q2 — BlueEdge Tier-2 Deliverable Definition

**Primary surface:** `app/gauge-product/pages/tier2/workspace.js`

**Runtime dependencies:**
| Asset | Path | Source |
|-------|------|--------|
| vault_index.json | `public/vault/blueedge/run_authoritative_recomputed_01/vault_index.json` | `vault_export.py` |
| graph_state.json | `clients/blueedge/reports/tier2/graph_state.json` | `export_graph_state.mjs` |
| zones API | `/api/zones` → `tier2_data.py` | `tier2_query_engine.py` |

**vault_index.json schema (BlueEdge actual):**
```json
{
  "run_id": "run_authoritative_recomputed_01",
  "signals": [
    { "id": "SIG-001", "label": "...", "claim_id": "CLM-20", ... },
    { "id": "SIG-002", ... }, { "id": "SIG-003", ... },
    { "id": "SIG-004", ... }, { "id": "SIG-005", ... }
  ],
  "artifacts": [...],
  "nodes": [...],
  "zones": [...]
}
```

**Graph nodes (graph_state.json):** 18 nodes total
- 1 ZONE hub
- 5 SIGNAL nodes (SIG-001..005)
- 5 CLAIM nodes (CLM-20..24, signal-mapped)
- 7 ARTIFACT nodes

---

## Q3 — Second-Client Tier-1 Actual Output

**Execution path used:** `--legacy` path (STEP 13C/13D-G authorization)

**Command:**
```bash
python3 scripts/pios/lens_report_generator.py \
  --legacy \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10 \
  --output /tmp/lens_structural_slice_test.html
```

**Output:** `/tmp/lens_structural_slice_test.html` — 31K HTML, exit 0, no exceptions

**Content verified:**
- CLM-09 score: `Proven: 60/100` (×3 instances)
- CLM-25: placeholder rendered (`Conceptual coherence not yet evaluated`)
- SIG-* content: ABSENT
- BlueEdge content: ABSENT
- Signal narrative: ABSENT

**Classification:** STRUCTURAL SLICE — DEGRADED MODE — DEMO-READY

**Gap vs. BlueEdge Tier-1:** BlueEdge uses default path through `generate_tier1_reports()` + full CANONICAL_PKG_DIR. Second-client uses legacy HTML path. Output is structurally valid but architecturally divergent — not a like-for-like equivalent of the BlueEdge default path.

---

## Q4 — Second-Client Tier-2 Actual Output

**Status: NO TIER-2 SURFACE EXISTS for second client.**

| Tier-2 Asset | BlueEdge Status | Second-Client Status |
|--------------|-----------------|----------------------|
| vault_index.json | EXISTS at `public/vault/blueedge/.../vault_index.json` | ABSENT — `public/vault/<uuid>/` does not exist |
| graph_state.json | EXISTS at `clients/blueedge/reports/tier2/graph_state.json` (18 nodes) | ABSENT — no graph_state.json for second client |
| workspace.js page | FUNCTIONAL — reads vault from public path | NON-FUNCTIONAL — `NEXT_PUBLIC_VAULT_CLIENT` not set; public vault absent |
| zones API | FUNCTIONAL — returns BlueEdge ZONE-1..ZONE-4 | DEFECTIVE — always returns BlueEdge defaults (no --client passthrough) |
| VaultGraph.js | FUNCTIONAL — renders 18-node graph | NOT RENDERED — no vault_index.json to supply |

---

## Q5 — BlueEdge vs. Second-Client Topology Comparison

| Dimension | BlueEdge | Second-Client | Delta |
|-----------|----------|---------------|-------|
| Domains | 17 | 5 | −12 |
| Nodes (topology) | 42 | 30 | −12 |
| Components | 89 | 10 | −79 |
| Signals | 5 (SIG-001..005) | 0 (NOT_EVALUATED) | −5 |
| Zones (LENS) | 4 (ZONE-1..4) | 2 active (ZONE-2, ZONE-3 partially) | −2 fully active |
| ZONE-2 fragments | Full tier | 15 active fragments | Partial |
| Graph nodes | 18 | 0 (no graph) | −18 |

**Source for BlueEdge topology:** `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/canonical_topology.json`
**Source for second-client topology:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/canonical_topology.json`

---

## Q6 — Topology Count Verification

**BlueEdge:** 17 domains, 42 nodes, 89 components — confirmed from `step14a_blueedge_reconciliation_forensics.md` artifact inventory.

**Second-client:** 5 domains, 30 nodes, 10 components — confirmed from `step14a_blueedge_reconciliation_forensics.md` artifact inventory.

**This is NOT a defect.** Different clients have different structural footprints. The second-client topology is smaller and correctly characterized. The product surface must adapt to client reality, not pad to BlueEdge scale.

---

## Q7 — Signal Count and State

| Signal Dimension | BlueEdge | Second-Client |
|-----------------|----------|---------------|
| Total signals | 5 | 0 |
| Emission state | ACTIVE | NOT_EVALUATED |
| SIG-001 | EXISTS (`claim_id: CLM-20`) | ABSENT |
| SIG-002 | EXISTS (`claim_id: CLM-21`) | ABSENT |
| SIG-003 | EXISTS (`claim_id: CLM-22`) | ABSENT |
| SIG-004 | EXISTS (`claim_id: CLM-23`) | ABSENT |
| SIG-005 | EXISTS (`claim_id: CLM-24`) | ABSENT |
| signal_registry.json | `signals: [5 entries]` | `signals: []` |
| PiOS authority | 40.5, 40.6, 40.7 | 41.x — NOT YET RUN |

**Source files:**
- BlueEdge: `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/signal_registry.json`
- Second-client: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/signal_registry.json`

---

## Q8 — Signal Derivation Authority

**Finding: BlueEdge signals are STRUCTURAL INTELLIGENCE — not runtime telemetry.**

All 5 BlueEdge signals have `runtime_required: false` in `signal_registry.json`. They were derived from:
- PiOS 40.5 — structural intelligence layer
- PiOS 40.6 — signal derivation
- PiOS 40.7 — signal validation and registry assembly

These signals reflect static code-analysis findings about the OSS FastAPI codebase — they are NOT generated from live system telemetry, log ingestion, or runtime monitoring. `runtime_required: false` is the authoritative marker.

**Implication for second client:** The equivalent work is PiOS 41.x (second-client intelligence evaluation). PiOS 41.x was NOT RUN. Therefore `signals: []` and `emission_state: NOT_EVALUATED` are correct — they accurately represent the state of evidence, not a failure of runtime.

**emit_signals_empty.py output is evidence-correct.**

---

## Q9 — Graph State Node Count

**BlueEdge graph_state.json:** 18 nodes, 17 links
- Confirmed by direct file inspection: `clients/blueedge/reports/tier2/graph_state.json`
- Node composition: 1 ZONE + 5 SIGNAL + 5 CLAIM + 7 ARTIFACT

**Second-client:** 0 nodes — no graph_state.json exists.

**Note on prior error:** During STEP 14A execution, an Explore agent reported "88 nodes." This was incorrect. Direct inspection of the file confirmed 18 nodes. STEP 14A governance trace records the correct count (18). No artifact was written with the incorrect figure.

---

## Q10 — emit_signals_empty.py Validity Assessment

**VERDICT: VALID**

`emit_signals_empty.py` (stream PSEE.SECOND-CLIENT.GAUGE.EMIT.SIGNALS.EMPTY.01) produces:
```json
{
  "signals": [],
  "emission_state": "NOT_EVALUATED",
  "total_signals": 0
}
```

This is evidence-first correct representation because:
1. PiOS 41.x (second-client signal evaluation) was NOT run
2. No signal intelligence exists in the evidence base
3. `NOT_EVALUATED` is the accurate state label — not `EMPTY_BY_EVIDENCE` (which was the prior incorrect classification corrected in STEP 10G-R)
4. No fabrication of signals occurred
5. `runtime_required: false` on BlueEdge signals demonstrates signals are structural — could theoretically be derived — but the derivation work (PiOS 41.x) is required first

**The file correctly documents its own incompleteness.** It does not block the structural surface. It accurately gates the intelligence surface.

---

## Q11 — Where We Missed the Boat (STEP 10–14 Analysis)

**Primary miss: PiOS 41.x never scoped or run.**

The BlueEdge intelligence pipeline ran as:
```
PiOS 40.5 → 40.6 → 40.7 → signal_registry.json (5 signals) → vault_export.py → vault_index.json → graph_state.json → Tier-2 workspace
```

For second-client, STEP 10 built the structural layer correctly but the equivalent intelligence pipeline was never issued:
```
PiOS 41.x → signal_registry.json (0 signals, NOT_EVALUATED) → VAULT EXPORT BLOCKED
```

**Secondary miss: vault_export.py validate_export() defect.**

`vault_export.py:validate_export()` requires `len(vi['signals']) > 0`. This means:
- Even if PiOS 41.x were run and produced 1+ signals, `validate_export()` would pass
- But with 0 signals, vault export is blocked
- vault_index.json cannot be automatically produced for second client via normal pipeline

**STEP 10H builder defect (additional miss):** `build_evidence_vault.py` generated CLM-20..24 with BlueEdge signal names and `status=ACTIVE`, `lens_admissible=YES`. This was a FAIL-STOP. Builder has no NOT_EVALUATED suppression path. This defect was caught and blocked — not committed to canonical evidence.

**The structural layer (STEP 10A–10F) is correct.** The intelligence layer (PiOS 41.x) was never scoped. This is the root divergence.

---

## Q12 — Recovery Path

**Two paths exist:**

### PATH A — Full Parity (Requires new contract)
1. Issue PiOS 41.x contract for second client (equivalent of 40.5/40.6/40.7)
2. Derive structural intelligence signals from second-client OSS FastAPI codebase
3. Populate `signal_registry.json` with 1+ signals
4. Fix `validate_export()` to support 0-signal case OR run with signals present
5. Run `vault_export.py` → produces `vault_index.json`
6. Apply STEP 14B 4-edit code fix to `lens_report_generator.py`
7. Run `export_graph_state.mjs --client <uuid> --run-id run_01_oss_fastapi` → produces `graph_state.json`
8. Set `NEXT_PUBLIC_VAULT_CLIENT` and `NEXT_PUBLIC_VAULT_RUN_ID` in env
9. Tier-2 workspace becomes functional

### PATH B — Structural-Only Surface (Executable now)
1. Manually construct `vault_index.json` per STEP 14B schema (signals: [])
2. Apply STEP 14B 4-edit code fix to `lens_report_generator.py`
3. Run `export_graph_state.mjs` with manual vault_index → produces graph with 0 signal nodes
4. Tier-2 workspace renders structural-only graph (no signal tier)
5. LENS page sections A (hero band) active; B/C/D suppressed pending signal layer
6. Signal surface explicitly NOT_EVALUATED — shown in UI, not silently absent

**Recommended:** PATH B for immediate demo parity. PATH A for full product parity (requires PiOS 41.x contract).

---

## Parity Matrix Summary

| Surface | BlueEdge | Second-Client | Gap |
|---------|----------|---------------|-----|
| LENS page — hero band | CLM-09/10/12 + signal count | CLM-09/10/12 (no signal count) | Signal tier absent |
| LENS page — CLM-25 | Verdict shown | Placeholder (GAP_01_RESOLVED=false) | Predicate gap |
| Legacy HTML report | Full claim set | CLM-09/10/12/25-placeholder | Partial (structural only) |
| Tier-2 workspace | FUNCTIONAL | NON-FUNCTIONAL | No vault_index/graph_state |
| Vault graph | 18 nodes | 0 nodes | No graph for second client |
| Signal registry | 5 signals ACTIVE | 0 signals NOT_EVALUATED | PiOS 41.x not run |
| zones API | BlueEdge ZONE-1..4 | Returns BlueEdge (defect) | No --client passthrough |

---

## 4-BRAIN Assessment

### CANONICAL

BlueEdge signals are derived from PiOS 40.5/40.6/40.7 structural intelligence — `runtime_required: false`. Second-client `signal_registry.json` correctly reflects `NOT_EVALUATED` state. `emit_signals_empty.py` is evidence-correct. No fabrication in any artifact. STEP 10H FAIL-STOP was correctly enforced. No BlueEdge signal names contaminated the second-client canonical record.

### CODE

`validate_export()` requires `len(signals) > 0` — confirmed blocker for vault_index automated creation. `export_graph_state.mjs` CLI supports `--client` and `--run-id` but `lens_report_generator.py` subprocess at line 3728 does not pass them (GAP-CODE-01). `zones.js` API calls `tier2_query_engine.py` without `--client`/`--run-id` — always returns BlueEdge zones (GAP-CODE-02). Both are documented code defects, not evidence defects.

### PRODUCT

Second-client product surface is STRUCTURAL SLICE — DEGRADED MODE. Hero band functional. Signal tier absent. Tier-2 workspace non-functional. This is accurately characterized. PATH B recovery is achievable without PiOS 41.x by constructing minimal vault_index with signals:[]. Signal absence must be explicit in UI (NOT_EVALUATED label), not silent.

### PUBLISH

No BlueEdge content in any second-client surface. No fabricated signals. No signal narrative in legacy report. All gaps documented. Nothing publishable or client-presentable at Tier-2 level until PATH A or PATH B executed. Structural HTML report is the current demo-safe artifact.

---

## Remaining Gaps (Inherited + Identified This Step)

| Gap ID | Description | Blocker For | Recovery |
|--------|-------------|-------------|----------|
| GAP-SIGNAL-01 | PiOS 41.x not run — 0 signals, NOT_EVALUATED | Signal tier, Tier-2 workspace full parity | Issue PiOS 41.x contract |
| GAP-VAULT-01 | validate_export() requires signals > 0 | Automated vault_index creation | Fix validate_export() OR run with signals |
| GAP-CODE-01 | lens_report_generator.py subprocess missing --client/--run-id | graph_state.json for second client | 4-edit fix (STEP 14B) |
| GAP-CODE-02 | zones.js API always returns BlueEdge zones | Second-client workspace zone rendering | Pass --client/--run-id through zones API |
| GAP-01 | CONCEPT-06 NOT_EVALUATED predicate | CLM-25 verdict surface | concepts.json update + GAP_01_RESOLVED=true |
| DQGAP-01 | CLM-19 fragment: value.narrative = "## Source Fields" | CLM-19 render quality | Fragment re-evaluation |
| R-05 | 11 structural claims with no LENS components | Full structural tier | Component authoring (CLM-01/03/11/13/14/15/16/17/18/19/27) |
