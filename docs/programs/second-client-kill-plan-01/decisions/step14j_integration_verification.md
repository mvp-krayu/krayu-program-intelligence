# Governance Trace — STEP 14J Integration Verification
## PI.SECOND-CLIENT.STEP14J.INTEGRATION-VERIFICATION.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14J.INTEGRATION-VERIFICATION.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE — BLOCKING ISSUES IDENTIFIED

---

## Section 1 — Vault

| Check | Detail | Result |
|---|---|---|
| vault_index.json exists | `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` | PASS |
| signals = PSIG-XXX only | `{PSIG-001→CLM-20, PSIG-002→CLM-21, PSIG-004→CLM-22, PSIG-006→CLM-23, PSIG-003→CLM-24}` | PASS |
| No SIG-XXX keys | grep `^SIG-\d+$` on signal keys → 0 matches | PASS |
| PSIG-001→CLM-20→CLM-20.html | file exists at claims/CLM-20.html | PASS |
| PSIG-002→CLM-21→CLM-21.html | file exists | PASS |
| PSIG-004→CLM-22→CLM-22.html | file exists | PASS |
| PSIG-006→CLM-23→CLM-23.html | file exists | PASS |
| PSIG-003→CLM-24→CLM-24.html | file exists | PASS |
| HTTP access | `GET /vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` → HTTP 200 | PASS |

**Section 1 verdict: PASS** — 9/9 checks. All signal chains intact. Vault accessible.

---

## Section 2 — Graph

| Check | Detail | Result |
|---|---|---|
| graph_state.json exists | `clients/e65d2f0a.../reports/tier2/graph_state.json` | PASS |
| node count = 18 | confirmed | PASS |
| link count = 17 | confirmed | PASS |
| No legacy SIG-XXX node.id (`^SIG-\d+$`) | found: [] | PASS |
| ZONE-01 hub present | structural constant | PASS |
| 5 PSIG signal nodes | PSIG-001, PSIG-002, PSIG-003, PSIG-004, PSIG-006 | PASS |
| 5 CLM claim nodes | CLM-20, CLM-21, CLM-22, CLM-23, CLM-24 | PASS |
| 7 ART artifact nodes | ART-01..ART-07 | PASS |
| run_id = run_01_oss_fastapi | top-level field in graph_state.json | PASS |
| PSIG set vault == graph | {PSIG-001,002,003,004,006} in both | PASS |

**Section 2 verdict: PASS** — 10/10 checks. Graph structure consistent with vault.

---

## Section 3 — Report API

| Check | Request | Response | Result |
|---|---|---|---|
| 3A: narrative_brief (client-aware) | `?name=lens_tier1_narrative_brief.html&client=e65d2f0a...&runId=run_01_oss_fastapi` | HTTP 200 · 17121 bytes · title: `LENS Assessment — Narrative Brief` | PASS |
| 3B: evidence_brief (client-aware) | `?name=lens_tier1_evidence_brief.html&client=...` | HTTP 200 · 28437 bytes · title: `LENS Assessment — Structural Evidence Brief` | PASS |
| 3C: BlueEdge regression | no client param | HTTP 404 `REPORT_NOT_FOUND` (unchanged) | PASS |
| 3D: tier2 via client route (isolation) | `?name=lens_tier2_diagnostic_narrative.html&client=...` | HTTP 400 `INVALID_FILENAME` — blocked | PASS |
| 3E: missing file (valid path) | fake client UUID + valid filename | HTTP 404 `REPORT_NOT_FOUND` | PASS |
| 3F: path traversal | `client=../../etc` | HTTP 400 `INVALID_FILENAME` — blocked | PASS |

**Section 3 verdict: PASS** — 6/6 checks. API routing and isolation correct.

---

## Section 4 — Workspace

### API Layer (verified via HTTP)

| Check | Endpoint | Result | Detail |
|---|---|---|---|
| Zones load (second-client) | `GET /api/zones?client=e65d2f0a...&runId=run_01_oss_fastapi` | PASS | Returns PZ-001, PZ-002, PZ-003 with PSIG conditions |
| No BlueEdge vocabulary | zones API response | PASS | No BlueEdge terms, no DOMAIN-XX, no SIG-XXX |
| PSIG signals displayed | zones: combination_signature | PASS | `primary: PSIG-001|PSIG-002|PSIG-004` |
| WHY mode | `GET /api/query?zone_id=PZ-001&mode=WHY&...` | PASS | Returns structural scope: DOM-03 (backend_isolated), PSIG-001/002/004 conditions |
| EVIDENCE mode | `GET /api/query?zone_id=PZ-001&mode=EVIDENCE&...` | PASS | Returns PSIG-001/002/004/006 signal_coverage with values (9.43, 4.33, 0.20) |
| TRACE mode | `GET /api/query?zone_id=PZ-001&mode=TRACE&...` | PASS | Returns 3 PSIG-based trace paths (PSIG-001/002/004) |
| inference_prohibition | all query responses | PASS | `ACTIVE` on all results |

### Vault Link Resolution (BLOCKED)

| Check | State | Detail |
|---|---|---|
| `NEXT_PUBLIC_VAULT_CLIENT` env var | NOT SET | `workspace.js:26` reads `process.env.NEXT_PUBLIC_VAULT_CLIENT \|\| null` |
| `NEXT_PUBLIC_VAULT_RUN_ID` env var | NOT SET | `workspace.js:27` reads `process.env.NEXT_PUBLIC_VAULT_RUN_ID \|\| null` |
| `VAULT_INDEX_URL` | null | Computed as null when both env vars absent → workspace never fetches vault index |
| `vault_targets` in query API | KEY ABSENT | EVIDENCE and TRACE query responses do not include `vault_targets` key → `VaultLinks` component receives empty/null targets |
| Vault files accessible | YES | `GET /vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` → HTTP 200 |

Vault link resolution is NOT operational. Vault files exist and are HTTP-accessible, but the workspace cannot load the vault index (env vars not set) and the query API does not surface `vault_targets` references.

**Section 4 verdict: PARTIAL** — API layer (zones, WHY, EVIDENCE, TRACE modes) routes correctly to second-client with no BlueEdge contamination. Vault link resolution is non-operational due to two gaps: (1) missing env vars, (2) `vault_targets` absent from query API responses.

---

## Section 5 — Tier-1 Reports

### Structural Content Analysis

| Marker | narrative_brief | evidence_brief |
|---|---|---|
| Dependency load ratio 0.682 (SC) | YES | YES |
| `backend_isolated` domain (SC) | YES | YES |
| 7 unknown dimensions | YES | YES |
| Score = 60 | YES | YES |
| Different length from BlueEdge report | YES (17074 vs 18719) | YES (28404 vs 33268) |
| PSIG signal IDs in body | NO (signals described textually) | NO |
| SIG-001 legacy | NO | NO |

The reports use second-client structural values throughout. They are not copies of the BlueEdge reports.

### BlueEdge Contamination

Both reports contain 3 hardcoded BlueEdge references in the report template:

**narrative_brief — occurrences:**
1. `Client: <strong>BlueEdge Fleet Management Platform</strong>` (line 90) — client header
2. `Tier-1 Evidence Brief for the BlueEdge Fleet Management Platform.` (line 106) — section 01 body
3. `SAMPLE — BlueEdge data used for demonstration purposes.` (line 242) — footer

**evidence_brief — occurrences:**
1. `Client: <strong>BlueEdge Fleet Management Platform</strong>` — client header
2. `SAMPLE — BlueEdge data used for demonstration purposes.` — footer

Root cause: `lens_report_generator.py` template has `client_name` and footer text hardcoded to BlueEdge values. The second-client run did not override these template fields. The structural data is second-client specific, but the identity labels are BlueEdge.

**Section 5 verdict: FAIL** — BlueEdge contamination present in both tier-1 reports (client name + footer). Structural data is correct second-client content. Reports are NOT copies of BlueEdge.

---

## Section 6 — Cross-Consistency

| Check | Source A | Source B | Result |
|---|---|---|---|
| PSIG set: vault == graph | {001,002,003,004,006} | {001,002,003,004,006} | PASS |
| PSIG count: vault (5) == graph (5) | 5 | 5 | PASS |
| PSIG-003 (not activated) in vault + graph | CLM-24: NOT_ACTIVATED state | PSIG-003 node present | PASS — correctly tracked |
| PSIG-005 absent from vault + graph | not in vault signals | not in graph nodes | PASS — consistent with 41.x (not_activated list) |
| run_id match: 41.x == vault == graph | run_01_oss_fastapi | run_01_oss_fastapi | PASS |
| client_id match: 41.x == vault | e65d2f0a... | e65d2f0a... | PASS |
| Active PSIG (41.x) ⊆ vault signals | {001,002,004,006} | all 4 in vault | PASS |
| Zone PSIG (workspace API) | PSIG-001,002,004 (pressure candidates) | match 41.x primary combination | PASS |
| Dependency load 0.682 in reports | narrative + evidence brief | 41.x structural data | PASS |

**Section 6 verdict: PASS** — PSIG identity is consistent across vault, graph, workspace API, and report structural values. No cross-layer mismatch detected for data integrity. (Report client name contamination is a template issue, not a cross-layer data mismatch.)

---

## Blocking Issues

### BLOCKER-01: Tier-1 report client name contamination

**Location:** `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html`,
`clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html`

**Issue:** Both reports display `Client: BlueEdge Fleet Management Platform`. The body of
`narrative_brief` also references "BlueEdge Fleet Management Platform" in section text.
Footer: "SAMPLE — BlueEdge data used for demonstration purposes."

**Scope:** Template-level contamination only. Structural values (scores, domain names,
dependency ratios, signal descriptions) are second-client specific. Reports are not
copies of BlueEdge. Root cause is in `lens_report_generator.py` template rendering —
client name field not parameterized for non-BlueEdge clients.

**Verdict:** FAIL per fail-stop rule: "Any BlueEdge contamination"

---

### BLOCKER-02: Workspace vault link resolution not operational

**Location A:** `app/gauge-product/.env.local` (missing vars)

**Issue A:** `NEXT_PUBLIC_VAULT_CLIENT` and `NEXT_PUBLIC_VAULT_RUN_ID` not set. `workspace.js:28`
computes `VAULT_INDEX_URL = null`. Workspace never fetches vault index. All VaultLinks
render as disabled/absent.

**Location B:** Tier-2 query API (EVIDENCE + TRACE modes)

**Issue B:** EVIDENCE and TRACE query API responses for second-client do not include a
`vault_targets` key. `EvidenceResult` component passes `data.vault_targets` to
`VaultLinks` — with no key, targets are undefined → no links rendered.

**Scope:** Vault files and vault_index.json exist and are HTTP-accessible (200). The
gap is in workspace configuration and query API output, not in the vault files themselves.

**Verdict:** FAIL per fail-stop rule: "Any broken vault link"

---

## Final Verdict

**Classification: B — STRUCTURALLY CORRECT BUT NOT UNDERSTANDABLE**

The structural intelligence chain is intact and correct end-to-end:
- Vault: PSIG signals, CLM chains, HTML exports — all correct
- Graph: 18 nodes, 17 links, PSIG-based, no legacy contamination
- API: client-aware routing functional, isolation maintained, regression clean
- Workspace API layer: zones, WHY, EVIDENCE, TRACE all route to second-client data with no BlueEdge contamination
- Cross-consistency: PSIG IDs, run_id, client_id, structural values align across all layers

Blocking issues prevent full product coherence:
1. Tier-1 reports show wrong client identity (template contamination)
2. Vault links in workspace are non-operational (env config + query API gap)

These two issues must be resolved before classifying as A (COHERENT PRODUCT).

---

## Governance Confirmation

- No files modified (except this trace)
- No generation executed
- No patching performed
- All findings derive from: filesystem reads, HTTP API calls, JSON parsing of existing artifacts
- Stream: PI.SECOND-CLIENT.STEP14J.INTEGRATION-VERIFICATION.01
