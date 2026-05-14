# STEP 13B — LENS Structural Slice Remediation Plan

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 13B
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Remediation plan defined. 5 items (R-01 through R-05). 2 files require code changes. 1 runtime config required. No new logic introduced. No new data invented.

---

## Target Post-Remediation State

**LENS Structural Slice (Degraded Mode, Stable)**

- Hero band renders second-client score data (CLM-09/10/12)
- BlueEdge static sections suppressed — no incorrect content displayed
- CLM-25 slot renders placeholder only (GAP-01 gate enforced in code)
- Signal section absent (no crash, no placeholder needed — already conditional)
- CLM-19 slot absent (DQGAP-01 unresolved — not rendered)
- Report generator produces valid HTML without crash for second-client claim set
- No full Tier-2 claim. Surface explicitly classified as structural slice / degraded mode.
- 11 structural claims (CLM-01/03/11/13/14/15/16/17/18/19/27) not rendered — deferred to future step

---

## NOT IN SCOPE

The following are explicitly excluded from this remediation:

- Signal layer (CLM-20..24): no fragments, no rendering, no placeholders for signal content
- CLM-25 activation: remains gated; GAP-01 not resolved in this step
- CLM-19 activation: DQGAP-01 not resolved; slot not rendered
- New UI components for STEP 12 structural claims: deferred (R-05)
- `api/projection.js`: no changes required
- Vault files: not touched
- Fragment files: not touched

---

## R-01 — Fragment Binding (Configuration, no code change)

**Classification:** config

**Problem:** `PROJECTION_FRAGMENTS_DIR` env variable is not set for second-client. The projection API (`pages/api/projection.js`, line 32) returns `PROJECTION_FRAGMENTS_DIR_NOT_CONFIGURED` (503) for all claim requests.

**Required action:** Create `app/gauge-product/.env.local` (or set in deployment environment):

```
PROJECTION_FRAGMENTS_DIR=<absolute-repo-root>/clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi
```

**No code change.** `projection.js` already reads this env variable at line 32 and handles it correctly. All 30 second-client ZONE-2 fragment files are present at that path.

**Effect:** `api/projection.js` serves CLM-09, CLM-10, CLM-12, CLM-25 correctly. CLM-20 returns 404 `PROJECTION_API_ERROR` (correct — triggers `!p20.error_type` guard in `lens.js`).

---

## R-02 — CLM-25 Gate (Guard)

**Classification:** guard

**Files impacted:**
1. `app/gauge-product/pages/lens.js`
2. `scripts/pios/lens_report_generator.py`

---

### R-02a — `lens.js`

**Problem:** `ExecutiveStatusPanel` at line 466 renders `payload={p25}` unconditionally. When `PROJECTION_FRAGMENTS_DIR` is set to second-client, the CLM-25 fragment loads and its content renders — violating the GAP-01 gate defined in STEP 12.

**Change 1 — Add gate constant** (after line 44, `LENS_CLAIMS` declaration):

```javascript
// Line 44 (existing):
const LENS_CLAIMS = ['CLM-09', 'CLM-20', 'CLM-25', 'CLM-12', 'CLM-10']

// Add after line 44:
const GAP_01_RESOLVED = false  // CLM-25 gate — set true only after CONCEPT-06 predicate fix
```

**Change 2 — Gate ExecutiveStatusPanel** (lines 463–472):

Current (lines 463–472):
```jsx
{/* Primary band — readiness verdict + confidence distribution + depth */}
<div className="lens-band lens-band-primary">
  <div className="lens-col lens-col-main">
    <ExecutiveStatusPanel payload={p25} />
  </div>
  <div className="lens-col lens-col-aside">
    <StabilityComposition payloads={allPayloads} />
    <EvidenceDepthIndicator payload={p10 || p09} onUnlock={showModal} hasAccess={hasAccess} />
  </div>
</div>
```

Target (lines 463–472):
```jsx
{/* Primary band — readiness verdict + confidence distribution + depth */}
<div className="lens-band lens-band-primary">
  <div className="lens-col lens-col-main">
    {GAP_01_RESOLVED && p25 && !p25.error_type
      ? <ExecutiveStatusPanel payload={p25} />
      : <div className="lens-gated-slot">Conceptual coherence not yet evaluated</div>
    }
  </div>
  <div className="lens-col lens-col-aside">
    <StabilityComposition payloads={allPayloads} />
    <EvidenceDepthIndicator payload={p10 || p09} onUnlock={showModal} hasAccess={hasAccess} />
  </div>
</div>
```

**Lines changed:** 466 (conditional replaces unconditional render). Lines 463–465, 467–472 unchanged.

---

### R-02b — `lens_report_generator.py`

**Problem:** `compose_key_findings` (line 401) renders the CLM-25 finding-card with the fragment's `value.narrative`. For second-client, this would print the sanitized three-axis verdict content, which is gated per STEP 12 until GAP-01 resolves.

**Change 1 — Add gate constant** (after line 45, `LENS_CLAIMS` declaration):

```python
# Line 45 (existing):
LENS_CLAIMS = ["CLM-25", "CLM-09", "CLM-20", "CLM-12", "CLM-10"]

# Add after line 45:
GAP_01_RESOLVED = False  # CLM-25 gate — set True only after CONCEPT-06 predicate fix
```

**Change 2 — Gate CLM-25 finding-card in `compose_key_findings`** (lines 400–427):

Current (lines 400–427):
```python
# --- CLM-25 ---
p = payloads["CLM-25"]
items.append(f"""
<div class="finding-card">
  ...renders p["evidence_class"], p.get("value", {}).get("narrative", "—"), p["claim_id"]...
</div>
""")
```

Target:
```python
# --- CLM-25 ---
if GAP_01_RESOLVED and payloads.get("CLM-25"):
    p = payloads["CLM-25"]
    items.append(f"""
<div class="finding-card">
  ...existing block unchanged...
</div>
""")
else:
    items.append("""
<div class="finding-card finding-card-gated">
  <div class="finding-header">
    <div class="finding-title">Executive Verdict</div>
  </div>
  <p class="finding-statement">
    Conceptual coherence not yet evaluated. Executive verdict pending configuration update.
  </p>
</div>
""")
```

**Note:** `compose_current_state` (lines 335–394) uses CLM-25 only for `execution_class` badge styling and the "B. Execution Readiness" card. The card text is hardcoded ("Execution readiness has not yet been evaluated...") — this text is factually correct for second-client and does NOT render the three-axis verdict content. No change required there.

---

## R-03 — Suppress BlueEdge Static Sections (Suppression)

**Classification:** suppression

**File:** `app/gauge-product/pages/lens.js`

**Problem:** Three static sections (lines 448–461) render BlueEdge-specific curated content — wrong topology, wrong domain focus, wrong system graph — for any non-BlueEdge client.

**Lines 448–461 current:**
```jsx
{/* Section B — System Intelligence Overview (static — curated 17-domain set) */}
<div className="lens-band">
  <SystemIntelligenceOverview />
</div>

{/* Section C — Connected System View (static — curated graph projection) */}
<div className="lens-band">
  <ConnectedSystemView />
</div>

{/* Section D — Focus Domain (static — Edge Data Acquisition spotlight) */}
<div className="lens-band">
  <FocusDomainPanel />
</div>
```

**Target (lines 448–461):**
```jsx
{/* Section B — System Intelligence Overview: suppressed — not available for this dataset */}
{null}

{/* Section C — Connected System View: suppressed — not available for this dataset */}
{null}

{/* Section D — Focus Domain: suppressed — not available for this dataset */}
{null}
```

**Suppression approach:** Replace each `<div className="lens-band">...</div>` block with `{null}`. No placeholder band rendered — no visual gap, no "Not available" text injected into the layout. The bands simply disappear.

**Import lines 36–38 (`SystemIntelligenceOverview`, `ConnectedSystemView`, `FocusDomainPanel`):** Imports can remain unused without runtime impact. Removing them is cleaner but not required for correctness.

---

## R-04 — Report Generator Crash Fix (Fix)

**Classification:** fix

**File:** `scripts/pios/lens_report_generator.py`

**Two crash locations:**

---

### R-04a — `compose_executive_summary`, line 310

**Current:**
```python
def compose_executive_summary(payloads: dict) -> str:
    p09 = payloads["CLM-09"]
    p10 = payloads["CLM-10"]
    p12 = payloads["CLM-12"]
    p25 = payloads["CLM-25"]
    p20 = payloads["CLM-20"]     # line 310 — KeyError when CLM-20 absent
```

**Root cause:** `p20` is assigned but never used to derive rendered values — the signal sentence (lines 325–326) is hardcoded text, not derived from `p20`. The variable is dead code relative to the output.

**Change 1 — Remove line 310:**
```python
# Remove entirely:
p20 = payloads["CLM-20"]
```

**Change 2 — Guard hardcoded signal sentence (lines 325–326):**

Current sentences list includes:
```python
"One critical operational signal has been identified — the security intelligence pathway has a "
"structurally confirmed capacity ceiling; live performance requires measurement to confirm it is being met.",
```

This sentence is BlueEdge-specific and factually incorrect for second-client (0 signals). It must be conditional:

Target:
```python
sentences = [
    f"The platform has achieved a proven structural score of <strong>{esc(score_proven)}</strong>, ...",
    "Structural integrity is confirmed: ...",
    f"The achievable score ceiling is <strong>{esc(score_achievable)}</strong>, ...",
    *(["One critical operational signal has been identified — the security intelligence pathway has a "
       "structurally confirmed capacity ceiling; live performance requires measurement to confirm it is being met."]
      if payloads.get("CLM-20") else []),
    "The current assessment posture is decision-ready on all structural dimensions. ...",
]
```

**Lines changed:** 310 (removed), 325–326 (conditional).

---

### R-04b — `compose_key_findings`, lines 458–494

**Current:**
```python
# --- CLM-20 ---
p = payloads["CLM-20"]    # line 459 — KeyError when CLM-20 absent
sig = p.get("signal", {})
items.append(f"""...""")
```

**Target:**
```python
# --- CLM-20 ---
if payloads.get("CLM-20"):
    p = payloads["CLM-20"]
    sig = p.get("signal", {})
    items.append(f"""...""")  # existing finding-card block unchanged
```

**Lines changed:** Wrap lines 458–494 in `if payloads.get("CLM-20"):`. No change to the finding-card content inside the guard.

---

### R-04c — Required CLI invocation for second-client

`load_all_payloads()` (line 151) iterates `LENS_CLAIMS` and fails closed if any claim is missing or returns error_type. CLM-20 is in the default `LENS_CLAIMS`. Even after fixing the composer functions, `load_all_payloads()` will call `_fail()` for CLM-20.

**Required:** Pass `--claims` to exclude CLM-20 when generating second-client report:

```bash
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10
```

This is a runtime invocation pattern, not a code change. The `_configure_runtime()` mechanism (line 84) already handles `--claims` override.

---

## R-05 — Missing Structural Components (Deferred, NOT IN SCOPE)

**Classification:** deferred

**Problem:** 11 claims from STEP 12 activation contract (CLM-01, CLM-03, CLM-11, CLM-13, CLM-14, CLM-15, CLM-16, CLM-17, CLM-18, CLM-19, CLM-27) have no existing LENS UI components or report composer functions.

**Decision:** NOT rendered in current surface. No placeholders introduced for these claims. The surface is explicitly a STRUCTURAL SLICE (DEGRADED MODE) — the absence of these claims is a known and stated condition, not a silent gap.

**Future step:** New LENS components for VERDICT PANEL, STRUCTURAL VIEW, and CONTEXT / BASELINE sections as defined in STEP 12 are deferred to a future stream step.

---

## 4-BRAIN Assessment

### CANONICAL

All remediations are evidence-faithful:
- R-02 gate ensures CLM-25 fragment content is not surfaced until GAP-01 resolves — no evidence fabricated, no fabricated gap
- R-03 suppression removes BlueEdge content that would be factually incorrect for second-client — surfaces only what is true for this client
- R-04 fix removes a hardcoded signal sentence that would assert a signal finding for a zero-signal client — correct
- R-05 deferral is accurate — 11 claims exist in the fragment directory but have no renderer; they are not lost, just not displayed

### CODE

**Exact touch points:**

| File | Lines | Change type | Description |
|------|-------|-------------|-------------|
| `app/gauge-product/pages/lens.js` | after line 44 | add constant | `GAP_01_RESOLVED = false` |
| `app/gauge-product/pages/lens.js` | 466 | guard | `ExecutiveStatusPanel` conditional on `GAP_01_RESOLVED` |
| `app/gauge-product/pages/lens.js` | 448–461 | suppression | Replace 3 static section bands with `{null}` |
| `scripts/pios/lens_report_generator.py` | after line 45 | add constant | `GAP_01_RESOLVED = False` |
| `scripts/pios/lens_report_generator.py` | 310 | remove | Delete `p20 = payloads["CLM-20"]` |
| `scripts/pios/lens_report_generator.py` | 325–326 | guard | Wrap signal sentence in `if payloads.get("CLM-20")` |
| `scripts/pios/lens_report_generator.py` | 458–494 | guard | Wrap CLM-20 finding block in `if payloads.get("CLM-20")` |
| `scripts/pios/lens_report_generator.py` | 400–427 | guard | Wrap CLM-25 finding-card in `if GAP_01_RESOLVED` |
| `app/gauge-product/.env.local` | (new file) | config | `PROJECTION_FRAGMENTS_DIR=<path>` |

**Total line changes:** ~15 lines across 2 source files + 1 new env file. No new functions. No redesign.

### PRODUCT

Post-remediation surface:

| Section | State | Claims |
|---------|-------|--------|
| Hero band | ✅ ACTIVE | CLM-09, CLM-10, CLM-12 |
| System Intelligence Overview | ✅ SUPPRESSED | (no band rendered) |
| Connected System View | ✅ SUPPRESSED | (no band rendered) |
| Focus Domain | ✅ SUPPRESSED | (no band rendered) |
| Executive Status | ✅ GATED | Placeholder: "Conceptual coherence not yet evaluated" |
| Stability Composition | ✅ PARTIAL | CLM-09, CLM-10, CLM-12 |
| Evidence Depth Indicator | ✅ ACTIVE | CLM-10 or CLM-09 |
| Causal Narrative | ✅ ACTIVE | CLM-09 |
| Signal Cards | ✅ ABSENT | CLM-20 not present — silently omitted (no change needed) |
| Risk Panel | ✅ PARTIAL | Available payloads |
| What You Unlock | ✅ STATIC | Generic |
| Advanced Access | ✅ STATIC | Generic |
| STEP 12 structural components | ⏸ DEFERRED | CLM-01/03/11/13/14/15/16/17/18/19/27 |

**HTML report post-remediation:** Generates without crash for `--claims CLM-09 CLM-25 CLM-12 CLM-10`. CLM-25 finding-card suppressed (GAP-01 gate). CLM-20 finding-card absent. Signal executive summary sentence absent. All other sections render from available payloads.

### PUBLISH

**No Tier-2 completion claim.** The surface produced by this remediation is classified as:
> "STRUCTURAL SLICE (DEGRADED MODE) — Executive score presentation and structural evidence summary. Eleven structural claims deferred. Executive verdict pending configuration update."

**Truthfulness checks:**
- Hero band values (60/100, 100/100, [60, 100]) are VERIFIED claims from fragment files — correct ✅
- Hardcoded signal sentence in executive summary removed — no false signal assertion ✅
- CLM-25 gated — no premature verdict exposure ✅
- BlueEdge topology suppressed — no factually wrong content displayed ✅

---

## Implementation Order for STEP 13C

If STEP 13C is authorized to implement this plan:

1. **R-01** — Create `.env.local` (config, no code review needed)
2. **R-04** — Fix `lens_report_generator.py` crash (2 functions, ~15 lines)
3. **R-03** — Suppress 3 static sections in `lens.js` (3 band replacements)
4. **R-02** — Add CLM-25 gate in `lens.js` + `lens_report_generator.py` (constant + conditional)
5. **R-05** — Explicitly logged as deferred (no action)

Each item is independently testable. R-01 has no dependencies. R-04 can be validated with a dry run against the second-client fragment directory.
