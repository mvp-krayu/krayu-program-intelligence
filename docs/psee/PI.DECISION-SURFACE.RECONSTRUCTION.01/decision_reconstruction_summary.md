# Decision Reconstruction Summary — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30  
**Verdict:** DECISION_RECONSTRUCTED

---

## What Changed in the Decision Surface

The Decision Surface was rebuilt from stale pre-semantic logic to full semantic/structural synthesis via four targeted patches to `_build_decision_surface()`:

### 1. Signal Separation Block (new)
Added `_ds_active_struct_sigs`, `_ds_baseline_sigs`, `_ds_na_sigs` separation at the top of the function. Active structural signals (RUN_RELATIVE_OUTLIER) are now separated from baseline signals (THEORETICAL_BASELINE). This feeds correct counts and IDs throughout the surface.

### 2. Structural Evidence Statement (rewritten per required pattern)
**Before:** "Structural evidence layer complete — 5/17 semantic domains backed."  
**After:** "Structural evidence is complete within the current evidence scope: 13 of 13 structural evidence groups are grounded. Semantic domain coverage is partial: 5 of 17 semantic domains have structural backing; 12 remain semantic-only."

### 3. Confirmed Section (rewritten)
**Before:** Contained "All domains are structurally grounded." / "No incomplete structural areas detected." (FORBIDDEN). Active signals not shown. PSIG-006 not mentioned.  
**After:** Required patterns applied — structural evidence groups count, semantic coverage partial statement, pressure zone with semantic label, active signal IDs, PSIG-006 as explicit baseline, zone identification.

### 4. Pressure Synthesis (rewritten for single-zone)
**Before:** "A single structural pressure pattern spans multiple domains." (incorrect for 1-zone case).  
**After:** Zone card showing: `PZ-001 — Platform Infrastructure and Data`, DOM backing, signals, zone class, confidence. Correct for N-zone generalization.

---

## How Decision Synthesizes Tier-1 and Tier-2

| Layer | Contribution |
|---|---|
| Tier-1 Evidence | Structural evidence group count (13), grounding state (13 grounded), signal activation state |
| Tier-1 Narrative | Evidence scope framing — posture driven by evidence boundary, not by risk label |
| Tier-2 Diagnostic | Zone detail — zone ID, semantic label, DOM backing, zone class, active conditions |
| Decision Surface | Synthesis — renders the boundary between what is known and what is not, at executive resolution |

The Decision Surface does not re-derive or modify any of these facts — it reads from the same artifact set and presents the bounded decision posture.

---

## DOMAIN/DOM Separation

- **DOMAIN (semantic)**: "Platform Infrastructure and Data" — primary display unit in all zone labels, hero text, zone card title
- **DOM (structural)**: "DOM-04 / backend_app_root" — appears only as backing/trace in "backed by DOM-04 / backend_app_root" and "DOM backing: DOM-04 / Platform Infrastructure and Data"
- No DOM entity used as a primary label anywhere in the reconstructed surface

---

## Active Zone and Signal State

- Zone: `PZ-001 — Platform Infrastructure and Data` (semantic label primary)
- Active structural signals: `PSIG-001 · PSIG-002 · PSIG-004` (3 signals, RUN_RELATIVE_OUTLIER)
- Baseline signal: `PSIG-006` — theoretical baseline condition, explicitly labeled as not an activated pressure signal
- Not activated (from artifact): PSIG-003, PSIG-005 (shown in gap items count)
- Zone class: COMPOUND_ZONE (language layer decoded: "Multiple structural pressures acting together")

---

## Is the Decision Surface Now Client-Agnostic?

**Yes — PSIG production path is fully client-agnostic.**

- All labels, counts, signal IDs, zone IDs resolved from artifacts
- Signal separation by `activation_method` field (not by ID)
- Client name via `_get_client_display_name()` lookup
- Zone semantic label via `_resolve_dom_to_semantic_context()` or `_build_semantic_report_context()`
- A second client with equivalent artifacts would produce a correctly labeled Decision Surface

---

## Remaining Warnings

**None.** DS-01 and DS-02 (from SWEEP contradiction register) are both resolved:
- DS-01 — "domains" terminology: RESOLVED — "structural evidence groups" used throughout
- DS-02 — PSIG-006 not as baseline: RESOLVED — PSIG-006 explicitly named as baseline signal

W-02 (non-PSIG legacy path hardcodes) remains deferred — does not affect Decision Surface or PSIG production path.

---

## Is the Report Family Ready for Final Product Validation?

**Yes — the four-report family is now consistent and ready.**

| Report | Status |
|---|---|
| Tier-1 Evidence Brief | ACCEPTED — PSIG-005 card added, all corrections applied |
| Tier-1 Narrative Brief | ACCEPTED — all corrections applied |
| Tier-2 Diagnostic Narrative | ACCEPTED — PSIG-006 section 04B added |
| Decision Surface | RECONSTRUCTED — semantic-first, artifact-driven, no stale language |

All core facts are aligned across all four reports. Inference prohibition active on all surfaces. No advisory content, causal claims, or remediation language.

Recommended next step: **PI.CLIENT-LANGUAGE-LAYER.FINAL-REPORT-FAMILY-VALIDATION.01**
