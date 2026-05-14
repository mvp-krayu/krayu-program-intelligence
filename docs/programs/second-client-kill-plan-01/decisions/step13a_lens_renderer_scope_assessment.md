# STEP 13A — LENS Structural Slice Renderer Scope Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 13A
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Assessment finished. Current LENS surfaces are partially usable for second-client as a STRUCTURAL SLICE / DEGRADED MODE only. Three static sections render BlueEdge-specific content. Report generator crashes on CLM-20 absent key. CLM-25 has no gate in current lens.js. Nine STEP 12 structural claims have no existing UI components.

---

## Existing Entry Points

### EP-1 — `app/gauge-product/pages/lens.js` (Next.js LENS page)

**Mode:** Live page. Fetches ZONE-2 projections from `/api/projection` at runtime.

**Hardcoded claim set:** `LENS_CLAIMS = ['CLM-09', 'CLM-20', 'CLM-25', 'CLM-12', 'CLM-10']`

**Data path:** `lens.js` → `fetchProjection(claimId)` → `GET /api/projection?claim_id=X&zone=ZONE-2&depth=L1` → `pages/api/projection.js` → reads `${PROJECTION_FRAGMENTS_DIR}/${claim_id}-ZONE-2-L1.json`

**Activation requirement:** `PROJECTION_FRAGMENTS_DIR` env variable must be set to the second-client fragment directory:
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/
```
No env file currently wires this. This is a configuration gap, not a code gap.

**CLM-20 handling:** `{p20 && !p20.error_type && <SignalCards payloads={[p20]} />}` — conditional render. When CLM-20 fragment is absent, projection API returns 404, `fetchProjection` returns `{error_type: 'FETCH_ERROR', ...}`, condition evaluates false → SignalCards band **silently omitted** (no blocked state shown, no placeholder). ✅ Correct behavior for second-client.

**CLM-25 handling:** `<ExecutiveStatusPanel payload={p25} />` rendered unconditionally in its band. **No gate check in current code.** If `PROJECTION_FRAGMENTS_DIR` points to second-client fragments, the CLM-25 fragment (sanitized narrative + BC-01 caveat) WILL load and render. There is no mechanism in the current lens.js to substitute the placeholder required by STEP 12 (GAP-01 gate). This is an unresolved gap.

---

### EP-2 — `scripts/pios/lens_report_generator.py` (HTML report generator)

**Mode:** CLI. Produces `clients/<client>/reports/lens_report_YYYYMMDD_HHMMSS.html` from ZONE-2 fragments.

**Default claim set:** `LENS_CLAIMS = ["CLM-25", "CLM-09", "CLM-20", "CLM-12", "CLM-10"]` — BlueEdge set.

**Default paths:** `FRAGMENTS_DIR` points to `clients/blueedge/vaults/run_01_authoritative/claims/fragments/`. Can be overridden via `_configure_runtime()` or `--fragments-dir` CLI argument.

**Configuration for second-client:**
```bash
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10
```

**BUT: `load_all_payloads()` is only a soft gate.** The hard block is in the composer functions:

| Function | Hardcoded reference | Behavior if CLM-20 absent from payloads |
|----------|--------------------|-----------------------------------------|
| `compose_executive_summary` (line 311) | `p20 = payloads["CLM-20"]` | `KeyError: 'CLM-20'` → crash |
| `compose_key_findings` (line 459) | `p = payloads["CLM-20"]` | `KeyError: 'CLM-20'` → crash |

Even if `--claims` excludes CLM-20, `load_all_payloads()` only iterates the supplied list — so `payloads` dict will not contain `"CLM-20"`. The composer functions use `payloads["CLM-20"]` (dict access, not `.get()`). This causes a `KeyError` crash at report generation time.

**NOT USABLE for second-client as-is.** Requires defensive `payloads.get("CLM-20")` and conditional rendering in `compose_executive_summary` and `compose_key_findings` before it can generate a second-client report.

---

### EP-3 — `app/gauge-product/pages/tier2/workspace.js` (Tier-2 workspace)

**Mode:** Investigation workspace. Loads vault index from `/vault/<client>/<run_id>/vault_index.json`. Requires `NEXT_PUBLIC_VAULT_CLIENT` and `NEXT_PUBLIC_VAULT_RUN_ID` env vars. Graph-driven WHY / EVIDENCE / TRACE modes.

**Assessment:** This is a governance investigation surface, not an executive LENS surface. It is not in scope for STEP 12 structural slice rendering. Its wiring to the second-client vault is a separate concern.

---

## 4-BRAIN Assessment

### CANONICAL

The STEP 12 activation contract defines 14 active claims and 1 gated claim. The existing lens.js LENS_CLAIMS list covers only 3 of those 14 active claims (CLM-09, CLM-10, CLM-12). The remaining 11 active claims from STEP 12 (CLM-01, CLM-03, CLM-11, CLM-13, CLM-14, CLM-15, CLM-16, CLM-17, CLM-18, CLM-19, CLM-27) have no existing LENS components that load or render them.

Fragment truth is preserved in all active claim files. No fabrication. CLM-19 DQGAP-01 anomaly (value.narrative = "## Source Fields") remains — CLM-19 slot cannot render real data.

### CODE

**Projection API (`api/projection.js`):** Works correctly for any ZONE-2 fragment file in `PROJECTION_FRAGMENTS_DIR`. No code change needed. Requires only `PROJECTION_FRAGMENTS_DIR` env variable to be set to second-client fragment path.

**`lens.js` — current render analysis:**

| Component | Claims consumed | Second-client fragment available | Renders correctly |
|-----------|----------------|----------------------------------|-------------------|
| `HeroBand` | CLM-09, CLM-10, CLM-12 | ✅ All present | ✅ YES |
| `CausalNarrative` | CLM-09 | ✅ Present | ✅ YES |
| `StabilityComposition` | allPayloads (non-error) | ✅ 3 of 5 claims available | ✅ PARTIAL (fewer data points) |
| `EvidenceDepthIndicator` | CLM-10 or CLM-09 | ✅ Present | ✅ YES |
| `RiskPanel` | allPayloads | ✅ 3 of 5 available | ✅ PARTIAL |
| `ExecutiveStatusPanel` | CLM-25 | ✅ Present, but GAP-01 gate required | ⚠ LOADS AND RENDERS — gate not enforced in code |
| `SignalCards` | CLM-20 | ❌ Absent → error_type | ✅ Silently omitted (correct) |
| `SystemIntelligenceOverview` | Static (no fragments) | N/A | ❌ Renders BlueEdge curated data |
| `ConnectedSystemView` | Static (no fragments) | N/A | ❌ Renders BlueEdge curated data |
| `FocusDomainPanel` | Static (no fragments) | N/A | ❌ Renders BlueEdge domain spotlight |
| `WhatYouUnlock` | Static | N/A | ✅ Generic — acceptable |
| `AdvancedAccessBlock` | Static | N/A | ✅ Generic — acceptable |

**STEP 12 structural claims with no existing component:**

CLM-01, CLM-03, CLM-11, CLM-13, CLM-14, CLM-15, CLM-16, CLM-17, CLM-18, CLM-19, CLM-27 — 11 claims, 0 existing LENS rendering components. Not rendered by any current surface.

**Report generator blocker:**
```python
# compose_executive_summary line 311 — HARD CRASH if CLM-20 absent
p20 = payloads["CLM-20"]   # KeyError

# compose_key_findings line 459 — HARD CRASH if CLM-20 absent
p = payloads["CLM-20"]     # KeyError
```
These are dict access operations (not `.get()`). Cannot be bypassed without code change.

### PRODUCT

**Current surface classification: STRUCTURAL SLICE / DEGRADED MODE**

If `PROJECTION_FRAGMENTS_DIR` is set to second-client fragments and lens.js is loaded:

**What the user sees:**
1. Hero band — proven score 60/100, achievable 100/100, range [60, 100] ✅
2. System Intelligence Overview — **BlueEdge 17-domain curated content** (wrong client) ⚠ DEGRADED
3. Connected System View — **BlueEdge graph data** (wrong client) ⚠ DEGRADED
4. Focus Domain Panel — **"Edge Data Acquisition" domain, BlueEdge-specific** ⚠ DEGRADED
5. Executive Status Panel — CLM-25 fragment renders (sanitized narrative, BC-01 caveat shown); GAP-01 gate NOT enforced ⚠ GATED IN CONTRACT, NOT IN CODE
6. Stability Composition — renders from 3 available payloads (CLM-09, CLM-10, CLM-12) ✅ PARTIAL
7. Evidence Depth Indicator — functional ✅
8. Causal Narrative — CLM-09 narrative ✅
9. Signal Cards — silently absent (correct) ✅
10. Risk Panel — functional with available payloads ✅
11. What You Unlock, Advanced Access — static, acceptable ✅

**What is NOT shown:**
- None of the 11 structural claims from STEP 12 (CLM-01, 03, 11, 13, 14, 15, 16, 17, 18, 19, 27)
- No SCORE STRIP as defined in STEP 12 (only hero band approximates CLM-09/10/12)
- No VERDICT PANEL (CLM-13/14/15)
- No STRUCTURAL VIEW (CLM-16/17/18 without components)
- No CONTEXT / BASELINE (CLM-01/03/27 without components)

**Product verdict:** Current surface is a 3-claim score band presentation (CLM-09/10/12) within a BlueEdge-branded shell. It is NOT a STRUCTURAL SLICE as defined by STEP 12. It is a score-only fragment display with structural contamination (wrong topology, wrong domain content).

### PUBLISH

**Not claimable as Tier-2.** The current surface, if activated, would:
1. Show BlueEdge topology for a different client — factually incorrect
2. Omit the 11 structural claims that constitute the Tier-2 diagnostic substance
3. Show CLM-25 without the contractual GAP-01 gate placeholder
4. Not be labeled or classified as a degraded/partial surface — would appear as a complete LENS output

No "diagnostic access complete" language may be used. The current surface is not presented as Tier-2 complete.

---

## Renderable Components (no code change required)

These components render correctly from second-client fragments once `PROJECTION_FRAGMENTS_DIR` is configured:

| Component | Claims | Fragment availability | Output correctness |
|-----------|--------|----------------------|--------------------|
| `HeroBand` | CLM-09, CLM-10, CLM-12 | ✅ | ✅ |
| `CausalNarrative` | CLM-09 | ✅ | ✅ |
| `EvidenceDepthIndicator` | CLM-10/CLM-09 | ✅ | ✅ |
| `StabilityComposition` | CLM-09, CLM-10, CLM-12 | ✅ (3 claims) | ✅ PARTIAL |
| `RiskPanel` | CLM-09, CLM-10, CLM-12 | ✅ (3 claims) | ✅ PARTIAL |
| `WhatYouUnlock` | Static | N/A | ✅ |
| `AdvancedAccessBlock` | Static | N/A | ✅ |

---

## Degraded Components

These components render but with incorrect BlueEdge-specific content. They MUST be replaced or suppressed for a correct second-client surface:

| Component | Problem | Impact |
|-----------|---------|--------|
| `SystemIntelligenceOverview` | Uses `curatedGraphData.js` — BlueEdge 17-domain curated static content | Shows wrong topology |
| `ConnectedSystemView` | Uses `curatedGraphData.js` — BlueEdge graph projection | Shows wrong system model |
| `FocusDomainPanel` | "Edge Data Acquisition" domain spotlight — BlueEdge-specific | Shows wrong domain focus |

---

## Blocked Components

These are blocked or require unresolved action before activation:

| Component | Claim | Status | Reason |
|-----------|-------|--------|--------|
| `ExecutiveStatusPanel` | CLM-25 | ⚠ Loads fragment; gate missing | GAP-01 not resolved; lens.js has no gate mechanism |
| `SignalCards` | CLM-20 | ✅ Correctly absent | CLM-20 fragment absent → error_type → conditional omit |
| STEP 12 SCORE STRIP | CLM-11 | No component | CLM-11 has no LENS renderer |
| STEP 12 VERDICT PANEL | CLM-13, 14, 15 | No component | No LENS components exist |
| STEP 12 STRUCTURAL VIEW | CLM-16, 17, 18, 19 | No component | No LENS components exist |
| STEP 12 CONTEXT / BASELINE | CLM-01, 03, 27 | No component | No LENS components exist |
| `lens_report_generator.py` | CLM-20 | ❌ Hard crash | `payloads["CLM-20"]` KeyError in two composer functions |

---

## Gaps Identified in This Assessment

| ID | Component | Description |
|----|-----------|-------------|
| RG-01 | `lens.js` | No CLM-25 gate mechanism — ExecutiveStatusPanel renders CLM-25 content unconditionally; GAP-01 gate requires code change to enforce placeholder |
| RG-02 | `lens.js` | `LENS_CLAIMS` hardcoded to 5 BlueEdge claims — does not include 11 structural claims from STEP 12 |
| RG-03 | Static sections (3 components) | `SystemIntelligenceOverview`, `ConnectedSystemView`, `FocusDomainPanel` use BlueEdge curated data — incorrect for second-client |
| RG-04 | STEP 12 components (11 claims) | No existing LENS UI components for CLM-01, 03, 11, 13, 14, 15, 16, 17, 18, 19, 27 |
| RG-05 | `lens_report_generator.py` | `compose_executive_summary` and `compose_key_findings` hardcode `payloads["CLM-20"]` — KeyError crash when CLM-20 absent |
| RG-06 | Configuration | `PROJECTION_FRAGMENTS_DIR` not set for second-client; no `.env.local` wired |

---

## Recommendation for STEP 13B

**STEP 13B — LENS Structural Slice: Minimal Renderer**

Mode: CODE CHANGE (scoped)

Scope must address in priority order:

**Priority 1 — Configuration (no code change):**
- Wire `PROJECTION_FRAGMENTS_DIR` to second-client fragment directory
- This enables HeroBand, CausalNarrative, EvidenceDepthIndicator, StabilityComposition, RiskPanel to render correctly

**Priority 2 — Required code changes to `lens.js` for correct second-client output:**
1. **CLM-25 gate** (RG-01): Add gate check before `ExecutiveStatusPanel` — if GAP-01 unresolved, render placeholder `"Conceptual coherence not yet evaluated"` instead of loading CLM-25 fragment
2. **Suppress degraded static sections** (RG-03): `SystemIntelligenceOverview`, `ConnectedSystemView`, `FocusDomainPanel` must not render for second-client — suppress or replace with client-appropriate content
3. **LENS_CLAIMS** (RG-02): Extend to include structural slice claims from STEP 12 as load targets

**Priority 3 — New structural components (RG-04):**
- Minimal structural summary components for VERDICT PANEL and CONTEXT / BASELINE claims
- These are new UI work; scope to be defined in STEP 13B

**Priority 4 — `lens_report_generator.py` fix (RG-05):**
- Change `payloads["CLM-20"]` → `payloads.get("CLM-20")` in `compose_executive_summary` and `compose_key_findings`
- Add conditional rendering guards for absent claims
- Allows HTML report generation for second-client

**Minimum viable structural slice (what STEP 13B can deliver):**
- Hero band with 4-claim score strip (CLM-09/10/11/12)
- CLM-25 gated slot with placeholder
- No signal section
- Suppressed BlueEdge static sections OR replaced with structural slice summary
- Explicit degraded-mode label: "STRUCTURAL ASSESSMENT — Partial surface"
