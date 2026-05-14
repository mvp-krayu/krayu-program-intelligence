# SQO Cockpit Information Architecture

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Top-level navigation

```
SQO COCKPIT
├── 1. Overview
├── 2. Debt
├── 3. Continuity
├── 4. Maturity
├── 5. Remediation
├── 6. Evidence
├── 7. Replay
├── 8. History
└── 9. Handoff
```

---

## Section 1: Overview

**Purpose:** Client/run qualification overview. Entry point showing current state, key metrics, and operational priorities.

**Source artifacts consumed:**
- `qualification_state.v1.json`
- `semantic_maturity_profile.v1.json`
- `semantic_debt_inventory.v1.json`
- `progression_readiness.v1.json`

**Key fields displayed:**
- S-state (S0/S1/S2/S3) with label
- Overall maturity score and classification
- Semantic gravity score and classification
- Qualification stability score and classification
- Total debt items / blocking count
- Progression readiness score and target S-state
- Primary remediation pathway

**User decisions supported:**
- What is this client's qualification status?
- What is the most important next action?
- Is this client improving or stalled?

**Governance constraints:**
- All values from SQO artifacts, not computed at render time
- S-state must use canonical labels
- No "percentage complete" framing

**Empty/degraded states:**
- No SQO artifacts → "Qualification data unavailable. Run SQO assessment."
- Partial artifacts → show available data, mark missing sections

**Forbidden UI behavior:**
- No AI-generated summary text
- No predictive projections
- No "health score" synthesis beyond documented metrics

---

## Section 2: Debt

**Purpose:** Semantic debt exploration and prioritization.

**Source artifacts consumed:**
- `semantic_debt_inventory.v1.json`

**Key fields displayed:**
- Debt items grouped by category (7 categories)
- Per-item: id, category, severity, description, blocks_s_state
- Per-item: remediation action, source_material_needed, enrichment_pathway
- Priority ordering with priority_score
- Summary: critical/high/medium-high/medium counts, blocking count

**User decisions supported:**
- Which debt items block S-state progression?
- What source material resolves the highest-priority debt?
- Which remediation pathway addresses the most debt?

**Governance constraints:**
- Debt items from artifact only — no fabricated debt
- Priority ordering deterministic from priority model
- No "technical debt" framing

**Empty/degraded states:**
- No debt inventory → "Debt assessment unavailable."
- Zero debt items → "No semantic debt detected. Qualification state clean."

**Forbidden UI behavior:**
- No debt suppression
- No "estimated time to resolve"
- No AI-suggested remediation beyond documented pathways

---

## Section 3: Continuity

**Purpose:** Semantic continuity assessment — crosswalk coverage, label fidelity, lineage strength.

**Source artifacts consumed:**
- `continuity_assessment.v1.json`

**Key fields displayed:**
- Overall continuity status (FULL/PARTIAL/NO_ASSESSMENT)
- Coverage ratio (entities / topology nodes)
- Label fidelity ratio (business-labeled / total entities)
- Lineage strength (grounded domains / total domains)
- Per-gap: type, description, structural reference, severity, remediation pathway

**User decisions supported:**
- Where are the continuity gaps?
- What domains lack structural grounding?
- What source material would improve coverage?

**Governance constraints:**
- All metrics from artifact, not computed
- No synthetic continuity claims

**Empty/degraded states:**
- No continuity assessment → "Continuity assessment unavailable. Crosswalk may be absent."
- NO_ASSESSMENT status → explicit display with explanation

**Forbidden UI behavior:**
- No "continuity score" beyond documented metrics
- No visual representations suggesting completeness when gaps exist

---

## Section 4: Maturity

**Purpose:** 8-dimension semantic maturity scoring with drill-down.

**Source artifacts consumed:**
- `semantic_maturity_profile.v1.json`
- `semantic_gravity_assessment.v1.json`
- `qualification_stability.v1.json`
- `maturity_dimension_breakdown.v1.json`

**Key fields displayed:**
- Overall maturity score and classification
- Per-dimension (D1-D8): score, classification, label
- Dimension summary: strong/stable/partial/low counts
- Semantic gravity: score, classification, description
- Qualification stability: score, classification, description
- Per-dimension breakdown: formula inputs, contributing factors

**User decisions supported:**
- Which maturity dimensions are weakest?
- What would improve a specific dimension?
- How stable is the current qualification?
- Is semantic gravity consolidating or fragmented?

**Governance constraints:**
- Scores from artifacts, not recomputed
- All 8 dimensions displayed — no selective omission
- No "percentage complete" framing
- Gravity/stability descriptions use canonical vocabulary

**Empty/degraded states:**
- No maturity profile → "Maturity scoring unavailable."
- Partial artifacts → show available dimensions, mark missing

**Forbidden UI behavior:**
- No "maturity trend" without historical data
- No comparison to industry benchmarks
- No predicted future maturity

---

## Section 5: Remediation

**Purpose:** Remediation pathway planning and source material guidance.

**Source artifacts consumed:**
- `semantic_debt_inventory.v1.json` (remediation fields)
- `progression_readiness.v1.json`

**Key fields displayed:**
- Active remediation pathways (R1/R2/R3/R4) with descriptions
- Per pathway: which debt items it resolves
- Source material requirements per pathway
- Expected maturity dimension impact per pathway
- Re-run preparation checklist
- S-state progression criteria

**User decisions supported:**
- Which pathway should be prioritized?
- What source material must the client provide?
- Is a pipeline re-run warranted?
- What are the success criteria for the next enrichment cycle?

**Governance constraints:**
- Pathways reference documented R1-R4 definitions
- Impact estimates state assumptions
- No guaranteed outcomes
- Source material guidance is specific, not "upload anything"

**Empty/degraded states:**
- No debt data → "Remediation planning unavailable."
- Zero blocking debt → "No blocking debt. Progression pathway clear."

**Forbidden UI behavior:**
- No AI-generated remediation plans
- No auto-generated source material
- No "estimated time to S3"

---

## Section 6: Evidence

**Purpose:** Evidence chain viewer — trace from qualification state back to source artifacts.

**Source artifacts consumed:**
- All SQO artifacts (read-only)
- Artifact provenance fields (input_hashes, source_commit)
- Maturity dimension breakdown (formula inputs)

**Key fields displayed:**
- Per evidence chain: source artifact → derived metric → qualification impact
- Provenance linkage: which artifact fields produced which scores
- Input hash verification status
- Source commit reference

**User decisions supported:**
- Where does this qualification score come from?
- Is the evidence chain complete?
- Are input artifacts still current?

**Governance constraints:**
- Evidence chains from artifact provenance, not reconstructed
- No interpretive summary of evidence

**Empty/degraded states:**
- No provenance data → "Evidence chain unavailable."

**Forbidden UI behavior:**
- No AI interpretation of evidence
- No "confidence" scoring of evidence chains

---

## Section 7: Replay

**Purpose:** Replay certification viewer — deterministic recomputation verification.

**Source artifacts consumed:**
- `qualification_state_replay_verification.v1.json`
- `debt_replay_verification.v1.json`
- `maturity_replay_verification.v1.json`
- `maturity_certification.v1.json`
- `debt_certification.v1.json`
- `qualification_state_certification.v1.json`

**Key fields displayed:**
- Per verification: input_integrity (PASS/FAIL), deterministic_recomputation (PASS/FAIL), output_hash (PASS/FAIL)
- Overall verdict per artifact type
- Certification cases and results
- Last replay timestamp

**User decisions supported:**
- Is the qualification state replay-safe?
- Did any replay check fail?
- Is governance certification current?

**Governance constraints:**
- Replay results from artifacts, not re-executed in UI
- Failed replay checks must be prominently displayed

**Empty/degraded states:**
- No replay artifacts → "Replay verification not available."
- Failed checks → explicit FAIL display with details

**Forbidden UI behavior:**
- No suppression of failed replay checks
- No "close enough" framing for near-failures

---

## Section 8: History

**Purpose:** Maturation history timeline — S-state transitions and enrichment events.

**Source artifacts consumed:**
- `qualification_history.v1.json`
- Historical maturity profiles (if multiple versions exist)

**Key fields displayed:**
- S-state transition timeline
- Enrichment events (source material additions, pipeline re-runs)
- Maturity score progression over time
- Debt reduction over enrichment cycles

**User decisions supported:**
- Is this client progressing?
- When did the last enrichment cycle occur?
- What changed between cycles?

**Governance constraints:**
- Timeline from historical artifacts only
- No projected future timeline
- No "estimated time to S3"

**Empty/degraded states:**
- No history → "No qualification history. First assessment."
- Single data point → show current state, no trajectory

**Forbidden UI behavior:**
- No AI-generated trend analysis
- No predictive trajectory curves
- No extrapolation from insufficient data

---

## Section 9: Handoff

**Purpose:** PATH B handoff readiness summary and package builder.

**Source artifacts consumed:**
- `qualification_state.v1.json`
- `semantic_maturity_profile.v1.json`
- `progression_readiness.v1.json`
- Certification artifacts
- Replay verification artifacts

**Key fields displayed:**
- Handoff readiness status (READY/BLOCKED)
- Minimum S-state requirement (S2+)
- Certification status (all certifications passing?)
- Replay verification status (all replays passing?)
- Blocking conditions (what prevents handoff)
- Handoff package contents preview
- Audit trail summary

**User decisions supported:**
- Is this client ready for PATH B handoff?
- What blocks the handoff?
- What is in the handoff package?

**Governance constraints:**
- Handoff readiness deterministic from artifact state
- Cannot override blocking conditions
- Package must include all required certifications

**Empty/degraded states:**
- S0/S1 → "Handoff not available. Minimum S2 required."
- Certification failing → "Handoff blocked: certification incomplete."

**Forbidden UI behavior:**
- No "force handoff" option
- No handoff without certification
- No direct emission into LENS
