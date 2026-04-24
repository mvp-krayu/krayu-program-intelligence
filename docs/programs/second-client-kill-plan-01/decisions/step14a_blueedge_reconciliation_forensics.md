# STEP 14A — BlueEdge Reconciliation Forensics

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14A
**Date:** 2026-04-25
**Branch:** work/psee-runtime

---

## 1. Executive Verdict

**Acceptable baseline: YES — with explicit qualification**

The second-client structural slice is a defensible minimal baseline for demo purposes. It surfaces correct second-client claim data for CLM-09, CLM-10, CLM-12 via fragment-driven paths. No BlueEdge content leaks. No fabricated data. No crashes.

It is NOT a Tier-2 parity surface. Four structural capability layers are entirely absent: interactive topology graph, signal intelligence, connected system view, and three suppressed page sections. These absences are a combination of expected client-data differences (no signals) and NOT_IMPLEMENTED gaps (no public vault, no graph export wiring). Zero gaps were introduced by STEP 13C patches.

---

## 2. Artifact Parity Matrix

| BlueEdge Artifact | Second-Client Equivalent | Status | Gap Type | Notes |
|-------------------|--------------------------|--------|----------|-------|
| `clients/blueedge/psee/runs/run_01_authoritative/package/canonical_topology.json` (17 dom / 42 cap / 89 comp / 148 nodes) | `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/canonical_topology.json` (5 dom / 30 cap / 10 comp / 45 nodes) | PRESENT | EXPECTED_VARIANCE | Different client, different structural scale. Not a defect. |
| `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json` | `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/gauge_state.json` | PRESENT | PARITY | Both present with same schema. |
| `clients/blueedge/psee/runs/run_01_authoritative/package/signal_registry.json` | `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/signal_registry.json` | PRESENT | EXPECTED_VARIANCE | Second-client signal registry present but contains no active signals (OSS FastAPI client has no signal data). |
| `clients/blueedge/psee/runs/run_01_authoritative/package/coverage_state.json` | `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/coverage_state.json` | PRESENT | PARITY | Both present. |
| `clients/blueedge/psee/runs/run_01_authoritative/package/reconstruction_state.json` | `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/reconstruction_state.json` | PRESENT | PARITY | Both present. |
| `clients/blueedge/vaults/run_01_authoritative/` (Obsidian vault + plugins + 40 fragments) | `clients/e65d2f.../vaults/run_01_oss_fastapi/` (markdown vault, no .obsidian config, no fragments) | PARTIAL | NOT_IMPLEMENTED | Vault markdown content present. No Obsidian config (non-critical). Fragments stored at different path convention. |
| `clients/blueedge/vaults/run_01_authoritative/claims/fragments/` (40 files: 20 claims × 2 zones) | `clients/e65d2f.../fragments/run_01_oss_fastapi/` (30 files: 15 claims × 2 zones) | PARTIAL | EXPECTED_VARIANCE + NOT_IMPLEMENTED | Path convention diverged (top-level vs. inside vault). 15 claims covered. 5 signal claims (CLM-20–24) absent — correct, no signals. 6 structural claims (CLM-02/04/05/06/07/08) absent — same gap as BlueEdge. |
| `clients/blueedge/reports/` (8 HTML legacy reports + tier1 + tier2) | `clients/e65d2f.../reports/` | ABSENT | NOT_IMPLEMENTED | No reports directory. Report generation for second client defaults to BlueEdge path. Isolated `/tmp` output works (STEP 13D-G). |
| `clients/blueedge/reports/tier2/graph_state.json` (88 nodes, 62 links) | `clients/e65d2f.../reports/tier2/graph_state.json` | ABSENT | NOT_IMPLEMENTED | export_graph_state.mjs cannot run for second client (requires public vault). Interactive topology visualization blocked. |
| `app/gauge-product/public/vault/blueedge/run_01_authoritative_generated/` (vault_index.json + full static vault) | `app/gauge-product/public/vault/e65d2f.../` | ABSENT | NOT_IMPLEMENTED | No public vault for second client. Required by export_graph_state.mjs. Without it, tier2 graph export fails and diagnostic interactive surface is unreachable. |
| CLM-20 through CLM-24 fragments (SIG-001 through SIG-005 claims) | CLM-20 through CLM-24 fragments | ABSENT | EXPECTED_VARIANCE | OSS FastAPI client has no signal instrumentation. Signal claims correctly absent. CLM-20 guard in LENS/report handles this gracefully (STEP 13C). |
| CLM-02/04/05/06/07/08 fragments | CLM-02/04/05/06/07/08 fragments | ABSENT | PARITY | Also absent in BlueEdge reference. Not generated for either client. |
| BlueEdge LENS page — SystemIntelligenceOverview, ConnectedSystemView, FocusDomainPanel | Second-client LENS — same components | SUPPRESSED | NOT_IMPLEMENTED | Suppressed by STEP 13C R-03. Suppression is correct — no second-client topology/system intelligence wiring in place. Re-activation requires public vault + graph export + unsuppress. |
| BlueEdge LENS page — CLM-25 ExecutiveStatusPanel (EXECUTION verdict) | Second-client LENS — CLM-25 placeholder | GATED | EXPECTED_VARIANCE | Gated by GAP_01_RESOLVED=false. CLM-25 fragment present but CONCEPT-06 predicate mismatch blocks verdict. |

---

## 3. 4-BRAIN Gap Analysis

### CANONICAL

**What exists:**
- canonical_topology.json present (5/30/10/45) — valid, derived from binding_envelope.json
- gauge_state.json, coverage_state.json, reconstruction_state.json, signal_registry.json — all present
- 30 fragment files covering 15 claims (ZONE-1 + ZONE-2) — correct for structural slice
- Vault markdown (27 CLMs) — present, no Obsidian config

**What is absent:**
- CLM-20 through CLM-24 fragments (signal claims) — correct absence, no signal data for this client
- CLM-02/04/05/06/07/08 fragments — absent in both clients, not yet in scope
- graph_state.json — requires export step (see CODE)

**CANONICAL verdict:** Structural evidence is present and correct. Signal evidence correctly absent. No canonical defects introduced by today's work. Evidence floor is honest and complete for the available structural surface.

---

### CODE

**Five structural code gaps identified:**

**GAP-CODE-01 — export_graph_state.mjs subprocess not parameterized (DEFECT, pre-existing)**
- Location: `scripts/pios/lens_report_generator.py` line 3722
- `subprocess.run(["node", str(export_script)], check=True)` — no --client or --run-id arguments
- Result: Always generates BlueEdge graph_state.json regardless of `--client` arg passed to report generator
- Fix required: Pass `--client <client_uuid>` and `--run-id <run_id>` to subprocess

**GAP-CODE-02 — export_graph_state.mjs requires public vault (NOT_IMPLEMENTED)**
- Location: `scripts/pios/export_graph_state.mjs` lines 35-36 and input path logic
- Input: `app/gauge-product/public/vault/<client>/<run_id>/vault_index.json`
- Second client has NO public vault directory
- Fix required: Create public vault entry with vault_index.json for second client

**GAP-CODE-03 — FRAGMENTS_DIR path convention diverged (EXPECTED_VARIANCE, manageable)**
- Default path in report generator: `clients/<client>/vaults/<run_id>/claims/fragments/`
- Actual second-client path: `clients/<uuid>/fragments/<run_id>/`
- Runtime override via `--fragments-dir` works (confirmed STEP 13D-G)
- Fix required: `--fragments-dir` must always be passed explicitly for second client

**GAP-CODE-04 — projection_runtime.py signal registry fallback hardcodes BlueEdge run IDs (DEFECT, low-impact)**
- Location: `scripts/pios/projection_runtime.py` lines 340-342
- Fallback searches: `run_authoritative_recomputed_01` and `run_01_authoritative`
- Second client uses: `run_01_oss_fastapi`
- Impact: Signal registry lookup via fallback path would fail or return BlueEdge registry
- Mitigated: Fragment export invocations passed explicit parameters (not relying on fallback)

**GAP-CODE-05 — Tier2 report generation blocked for second client (NOT_IMPLEMENTED)**
- `generate_tier2_reports()` chains: load_canonical_topology → load_signal_registry → load_gauge_state → export_graph_state.mjs subprocess → build narrative
- All data sources resolve correctly for second client IF:
  a. CANONICAL_PKG_DIR overridden via `--client --run-id` (works)
  b. Subprocess passes `--client --run-id` (broken — GAP-CODE-01)
  c. Public vault exists (absent — GAP-CODE-02)
- Fix requires: GAP-CODE-01 + GAP-CODE-02

---

### PRODUCT

**Active second-client LENS surface (current state):**

| Layer | Component | State | Data |
|-------|-----------|-------|------|
| Hero band | CausalNarrative (CLM-09) | ACTIVE | Second-client score (60/100 Proven) |
| Hero band | StabilityComposition (CLM-12, CLM-10) | ACTIVE | Second-client scores |
| Hero band | EvidenceDepthIndicator (CLM-10) | ACTIVE | Second-client |
| Executive verdict | ExecutiveStatusPanel (CLM-25) | GATED | Placeholder: "Conceptual coherence not yet evaluated" |
| Signal layer | SignalCards (CLM-20) | ABSENT | No signal fragment — silent per guard |
| Section B | SystemIntelligenceOverview | SUPPRESSED | No second-client wiring |
| Section C | ConnectedSystemView | SUPPRESSED | No public vault / no graph state |
| Section D | FocusDomainPanel | SUPPRESSED | No signal data |
| Interactive graph | Topology visualization | ABSENT | No graph_state.json |
| Decision conditions | (CLM-dependent) | PARTIAL | Only claims with fragments active |

**Structural richness gap — BlueEdge vs. second-client product surface:**

| Dimension | BlueEdge | Second Client | Gap |
|-----------|----------|---------------|-----|
| Domains exposed | 17 | 5 | −12 (expected, client scale) |
| Capabilities exposed | 42 | 30 | −12 (expected, client scale) |
| Components exposed | 89 | 10 | −79 (expected, client scale) |
| Signal claims | 5 (CLM-20–24) | 0 | −5 (expected, no signal data) |
| Active LENS claims | 20 (40 fragments) | 15 (30 fragments) | −5 (signal gap) |
| Topology graph | YES (88 nodes) | NO | NOT_IMPLEMENTED |
| Tier-1 reports | YES (4 files) | NO (legacy only) | NOT_IMPLEMENTED |
| Tier-2 reports | YES (2 files) | NO | NOT_IMPLEMENTED |
| Public vault | YES | NO | NOT_IMPLEMENTED |
| Interactive diagnostic | YES | NO | NOT_IMPLEMENTED |
| LENS page sections active | 6 of 9 | 3 of 9 | −3 suppressed |

---

### PUBLISH

**Safe to show now:**
- LENS legacy report (`/tmp/lens_structural_slice_test.html`) — correct CLM-09/10/12 data, CLM-25 gated, no leakage
- LENS page hero band — CLM-09/10/12 second-client scores
- Structural slice classification "DEGRADED MODE — STRUCTURAL CLAIMS ONLY"
- Fragment count: 30 verified, 15 claims covered

**Weak (shows correct data but limited surface):**
- LENS page overall — 3 of 9 sections visible; many panels absent or gated
- CLM-25 placeholder — correct behavior but signals missing executive verdict
- Report narrative — correct text but no topology section for second client

**Misleading / DO NOT SHOW:**
- Any Tier-1 or Tier-2 report from `generate_tier1_reports()` / `generate_tier2_reports()` with second-client data — currently produces BlueEdge graph_state.json (GAP-CODE-01)
- Any reference to "17 domains, 42 capabilities, 89 components" for second client
- Any signal language — second client has no signal instrumentation

---

## 4. Mandatory Questions — Answers

**Q1. What did BlueEdge have that second-client now lacks?**

| Item | Type |
|------|------|
| 12 additional domains (17 vs 5) | EXPECTED_VARIANCE |
| 12 additional capabilities (42 vs 30) | EXPECTED_VARIANCE |
| 79 additional components (89 vs 10) | EXPECTED_VARIANCE |
| Signal claims CLM-20 through CLM-24 | EXPECTED_VARIANCE |
| graph_state.json | NOT_IMPLEMENTED |
| Public vault with vault_index.json | NOT_IMPLEMENTED |
| clients/<client>/reports/ directory | NOT_IMPLEMENTED |
| Tier-1 and Tier-2 HTML reports | NOT_IMPLEMENTED |
| Interactive topology visualization | NOT_IMPLEMENTED |
| SystemIntelligenceOverview (live) | NOT_IMPLEMENTED |
| ConnectedSystemView (live) | NOT_IMPLEMENTED |
| FocusDomainPanel (live) | NOT_IMPLEMENTED |

**Q2. Which missing elements are expected because client data differs?**

The topology scale difference (5/30/10 vs 17/42/89), the signal claim absence (CLM-20 through CLM-24), and the smaller fragment count are all EXPECTED_VARIANCE — the OSS FastAPI client has a different structural profile and no signal instrumentation. These are not regressions.

**Q3. Which missing elements are defects caused by today's patches?**

**NONE.** STEP 13C patches were additive guards only. They did not introduce any structural loss. All NOT_IMPLEMENTED gaps predate STEP 13C. All EXPECTED_VARIANCE gaps are correct by construction.

**Q4. Where did domains/capabilities/components disappear from the product surface?**

They were never on the second-client product surface. The LENS page does not consume topology counts directly (topology consumed only by compose_topology_view / compose_system_intelligence in report generator tier paths). The LENS page loads projection API claims, not topology JSON. Topology richness appears only in tier1/tier2 reports — which are NOT_IMPLEMENTED for second client.

**Q5. Does second-client canonical_topology.json contain enough structure?**

YES. `canonical_topology.json` is present at `clients/e65d2f.../psee/runs/run_01_oss_fastapi/package/` with 5 domains, 30 capabilities, 10 components, 45 total nodes. It is correctly derived from binding_envelope.json. Sufficient for structural tier surface; does not reach BlueEdge scale by design.

**Q6. Does vault preserve that structure?**

PARTIALLY. Vault has 27 CLM markdown files but no Obsidian config and no fragments subdir in vault (fragments live at separate top-level path). Structural claims in markdown form are present. Fragments accessed separately.

**Q7. Do fragments preserve that structure?**

YES for in-scope claims. 30 files covering 15 claims × 2 zones. All STEP 12 active structural claims have fragments. Signal claims absent by design. Fragment content confirmed correct (CLM-09 Proven: 60/100, CLM-25 present, etc.).

**Q8. Does LENS consume that structure?**

PARTIALLY. CLM-09, CLM-10, CLM-12 served via projection API → loaded by LENS page hero band. CLM-25 loaded but gated. CLM-20 absent → API returns 404 → LENS handles gracefully. Topology structure NOT consumed by LENS page directly. Suppressed sections cannot consume it.

**Q9. Is graph_state generated for second-client?**

NO. Absent. Requires public vault (missing) and export_graph_state.mjs subprocess fix (pre-existing defect).

**Q10. Is interactive diagnostic runtime wired to second-client?**

NO. ConnectedSystemView and SystemIntelligenceOverview are suppressed (STEP 13C R-03). Even without suppression, the underlying graph_state.json is absent. Interactive topology is not available for second client.

**Q11. Which pieces are required to restore a meaningful Tier-2 surface?**

In order:
1. Create `app/gauge-product/public/vault/<uuid>/<run_id>/vault_index.json` (enables export_graph_state.mjs)
2. Fix GAP-CODE-01: Pass `--client` and `--run-id` to export_graph_state.mjs subprocess in lens_report_generator.py
3. Run export_graph_state.mjs for second client → generates graph_state.json
4. Unsuppress R-03 sections in lens.js (ConnectedSystemView, SystemIntelligenceOverview, FocusDomainPanel)
5. Resolve GAP-01 (CONCEPT-06) → set GAP_01_RESOLVED=true → CLM-25 verdict surfaced
6. Fix GAP-CODE-04: Extend signal registry fallback to include `run_01_oss_fastapi`
7. Wire new LENS components for 11 deferred structural claims (R-05)

**Q12. Which current outputs are safe, weak, or unusable?**

| Output | Classification |
|--------|----------------|
| Legacy report `/tmp/lens_structural_slice_test.html` | SAFE |
| LENS page hero band (CLM-09/10/12) | SAFE |
| LENS page overall (3 of 9 sections) | WEAK |
| CLM-25 gated placeholder | SAFE |
| generate_tier1_reports() for second client | UNUSABLE (not exercised, BlueEdge-default paths) |
| generate_tier2_reports() for second client | UNUSABLE (subprocess hardcoded to BlueEdge, no public vault) |
| Interactive topology / graph_state | UNUSABLE (absent) |

---

## 5. Failure Chain — Where Richness Disappeared

```
Second-client PSEE run → canonical_topology.json (5/30/10) → package/ complete
                        ↓
                   Fragment export → 30 fragments (15 claims) — CORRECT
                        ↓
                   Public vault → NOT CREATED → export_graph_state.mjs BLOCKED
                        ↓
                   graph_state.json → ABSENT
                        ↓
                   lens_report_generator.py tier2 subprocess call → hardcoded blueedge → DEFECT
                        ↓
                   Tier-2 report generation → BLOCKED FOR SECOND CLIENT
                        ↓
                   ConnectedSystemView / SystemIntelligenceOverview → no data source → SUPPRESSED (R-03)
                        ↓
                   LENS interactive diagnostic → ABSENT

Separate chain:
                   Signal claims CLM-20–24 → no instrumentation → no fragments → CORRECTLY ABSENT
                        ↓
                   CLM-20 guard (STEP 13C) → silent fallback → SAFE
                        ↓
                   Signal layer absent → EXPECTED_VARIANCE

Separate chain:
                   CLM-25 fragment → PRESENT
                        ↓
                   CONCEPT-06 predicate mismatch → BC-01 caveat → GAP_01_RESOLVED=false
                        ↓
                   ExecutiveStatusPanel → placeholder → GATED (expected)
```

**Net richness loss on LENS page:**

| Layer lost | Cause | Type |
|------------|-------|------|
| Interactive topology graph | No public vault → no graph_state | NOT_IMPLEMENTED |
| System Intelligence section | No wiring, section suppressed | NOT_IMPLEMENTED |
| Connected System View | No graph_state, suppressed | NOT_IMPLEMENTED |
| Focus Domain (signal band) | No signals, suppressed | EXPECTED_VARIANCE |
| CLM-25 verdict | GAP-01 unresolved | EXPECTED_VARIANCE |
| Tier-1/Tier-2 full reports | Subprocess hardcoding + no public vault | DEFECT + NOT_IMPLEMENTED |

---

## 6. Recovery Roadmap

**Phase 1 — Enable graph export (unblocks Tier-2)**

1. Create `app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/vault_index.json`
   - Must contain: signals dict (empty for second client), artifacts dict (ART-01 through ART-07)
   - Authority: new contract required
2. Fix `scripts/pios/lens_report_generator.py` line 3722: pass `--client <uuid> --run-id <run_id>` to subprocess
   - Minimal code change, controlled scope
   - Authority: contract required

**Phase 2 — Generate graph_state for second client**

3. Run: `node scripts/pios/export_graph_state.mjs --client e65d2f... --run-id run_01_oss_fastapi --output /tmp/second_client_graph_state.json`
4. Validate output, then write to second-client reports path (or serve from /tmp for demo)

**Phase 3 — Unsuppress LENS sections (once data is ready)**

5. Remove R-03 suppressions in `lens.js` (ConnectedSystemView, SystemIntelligenceOverview, FocusDomainPanel)
   - Only after second-client graph_state.json is verified
   - Authority: contract required

**Phase 4 — Resolve GAP-01 (CLM-25 verdict)**

6. Update `concepts.json` CONCEPT-06 predicate to support `NOT_EVALUATED`
7. Set `GAP_01_RESOLVED = true` in both `lens.js` and `lens_report_generator.py`
8. Authority: separate contract required

**Phase 5 — Extend LENS claim coverage (R-05)**

9. Wire LENS components for 11 deferred structural claims (CLM-01/03/11/13/14/15/16/17/18/19/27)
   - Requires new LENS components or adapters
   - Authority: separate contract required

**Phase 6 — Fix signal registry fallback (low-priority)**

10. Extend `projection_runtime.py` fallback run ID list to include `run_01_oss_fastapi`
    - Low-impact: all second-client calls currently use explicit parameters

---

## 7. Stop/Go Decision

**CONTINUE FROM CURRENT STATE**

Rationale:
- No rollback of STEP 13C is warranted — patches introduced zero structural loss
- Current baseline is demo-ready as "STRUCTURAL SLICE — DEGRADED MODE"
- Recovery path is clear and ordered: Phase 1 (public vault + subprocess fix) unblocks all Tier-2 paths
- Phase 1 is a contained, low-risk change
- Rejecting current state would lose confirmed runtime validation work (STEP 13D-G, STEP 13E)

**Do NOT:**
- Roll back any part of STEP 13C
- Attempt tier1/tier2 report generation without first completing Phase 1
- Surface any BlueEdge topology counts as second-client data
