# Signäl — Deliverable Handoff Process

> **Purpose:** End-to-end operational process from evidence intake to customer delivery. Every step is defined. No gaps. No undefined handoffs.

> **Applies to:** SA (primary), SA-DD (with extensions noted), SC (initial engagement)

---

## Process Overview

```
EVIDENCE INTAKE → STRUCTURAL ANALYSIS → DELIVERABLE PRODUCTION → ADVISORY SESSION → HANDOFF
     Day 1              Day 2-3               Day 3-4              Day 4-5         Day 5
```

---

## Phase 1: Evidence Intake (Day 1)

### Trigger
Engagement agreement signed. Customer has received Evidence Intake Checklist.

### Steps

| # | Action | Owner | Output |
|---|--------|-------|--------|
| 1.1 | Schedule intake session with customer (30 min) | Signäl Commercial | Calendar invite |
| 1.2 | Conduct intake session: confirm repository scope, establish access method, receive architectural context | Signäl Operator | Intake session notes |
| 1.3 | Verify repository access works (clone, read, dependency manifests present) | Signäl Operator | Access verification ✓ |
| 1.4 | Confirm evidence sufficiency — repository cloneable, dependency files present, file count within expected range | Signäl Operator | Evidence sufficiency confirmation |
| 1.5 | Send confirmation to customer: "Evidence intake complete. Structural analysis begins." | Signäl Operator | Customer notification |

### Gate
Evidence intake is COMPLETE when: repository is accessible, dependency manifests are present, and evidence sufficiency is confirmed. If evidence is insufficient (e.g., empty repository, no dependency files), escalate to customer before proceeding.

---

## Phase 2: Structural Analysis (Day 2-3)

### Trigger
Evidence intake confirmed complete.

### Steps

| # | Action | Owner | Output |
|---|--------|-------|--------|
| 2.1 | Run evidence ingestion pipeline — extract structural topology from repository | Signäl Operator | Raw topology: files, imports, classes, functions, dependency graph |
| 2.2 | Verify ingestion quality — file count, relationship count, domain detection within expected range for program size | Signäl Operator | Ingestion quality check ✓ |
| 2.3 | Run structural intelligence pipeline — signal synthesis, condition detection, convergence analysis | Signäl Operator | Structural signals, conditions, pressure zones |
| 2.4 | Execute governed semantic qualification — proposition generation, review (accept/reject), revalidation | Signäl Operator | Qualification state: S-Level, Q-Class, proposition outcomes |
| 2.5 | Verify pipeline completion — all qualification gates passed, no pipeline errors, findings generated | Signäl Operator | Pipeline completion check ✓ |

### Gate
Structural analysis is COMPLETE when: topology is extracted, signals are synthesized, qualification is executed, and pipeline completion is verified. If the pipeline produces unexpected results (zero findings, pipeline errors), investigate before proceeding to deliverable production.

---

## Phase 3: Deliverable Production (Day 3-4)

### Trigger
Structural analysis confirmed complete.

### Steps

| # | Action | Owner | Output |
|---|--------|-------|--------|
| 3.1 | Provision LENS access — create customer credentials, configure client/run, verify all cognitive modes render correctly | Signäl Operator | LENS access credentials + URL |
| 3.2 | Verify LENS rendering — BOARDROOM and BALANCED modes display findings, topology renders, Software Intelligence surfaces are populated | Signäl Operator | LENS rendering check ✓ |
| 3.3 | Generate Structural Assessment Package — click "EXPORT STRUCTURAL ASSESSMENT" in LENS | Signäl Operator | Self-contained HTML file: Structural Verdict + Structural Topology + Evidence Record |
| 3.4 | Verify Assessment Package — open exported HTML, confirm all chapters populated, all findings have 4 fields, topology renders, evidence record complete | Signäl Operator | Package quality check ✓ |
| 3.5 | Prepare advisory session — review findings, identify the 3-5 findings most likely to create customer recognition, prepare topology walkthrough path | Signäl Advisory | Advisory preparation notes |

### SA-DD Extensions

| # | Additional Action | Owner | Output |
|---|-------------------|-------|--------|
| 3.6 | Verify DENSE and OPERATOR modes render (SA-DD includes all 4 cognitive modes) | Signäl Operator | Full LENS verification ✓ |
| 3.7 | Verify Investigation Protocol — 36 governed queries accessible, evidence-traced answers render | Signäl Operator | Investigation verification ✓ |
| 3.8 | Frame Structural Verdict for investment committee consumption — confirm deal-relevant findings are prominent | Signäl Advisory | DD-specific advisory notes |

### Gate
Deliverable production is COMPLETE when: LENS access is provisioned and verified, Assessment Package is generated and verified, and advisory session is prepared. No deliverable reaches the customer without verification.

### Deliverable Governance Rule (D13)
All deliverables are runtime-generated through governed export actions. The operator verifies deliverables — the operator does not compose, edit, suppress, or augment findings. If a finding appears incorrect, the issue is in the pipeline, not in the deliverable. Escalate pipeline issues; do not manually fix deliverables.

---

## Phase 4: Advisory Session (Day 4-5)

### Trigger
All deliverables produced and verified. Customer stakeholders available.

### Steps

| # | Action | Owner | Duration | Output |
|---|--------|-------|----------|--------|
| 4.1 | Open with structural topology — show the customer their program's structural architecture | Signäl Advisory | 10-15 min | Customer sees their program's topology for the first time |
| 4.2 | Walk through top findings — 3-5 highest-impact findings, each with: what the structure shows, why it matters, operational implication | Signäl Advisory | 20-30 min | Customer recognizes structural conditions they've been experiencing |
| 4.3 | Present Structural Verdict — posture (PROCEED / INVESTIGATE / ESCALATE), qualification state, governance boundaries | Signäl Advisory | 10-15 min | Customer understands the governed conclusion |
| 4.4 | Q&A — answer customer questions using LENS to navigate structural evidence in real time | Signäl Advisory | 15-20 min | Customer questions addressed with structural evidence |
| 4.5 | Next steps — if customer interest in ongoing access, introduce Continuous Intelligence | Signäl Advisory | 5 min | Follow-up path established |

### Session Guidelines

- **Lead with topology, not findings.** The customer should see their program's structure before they hear about conditions within it.
- **Use LENS live.** Navigate the topology, click into findings, show evidence traces. The interactive experience is part of the value.
- **Do not prescribe remediation.** The Structural Verdict governs what can be said. Operational implications are stated. Specific remediation recommendations are out of scope (governed prohibition).
- **Do not attribute findings to individuals.** Structural conditions are structural, not personal.
- **Confirm recognition.** The strongest moment in the session is when the customer says "yes, we've been experiencing this." Structure the walkthrough to reach that moment.

---

## Phase 5: Handoff (Day 5)

### Trigger
Advisory session complete.

### Steps

| # | Action | Owner | Output |
|---|--------|-------|--------|
| 5.1 | Send deliverable package to customer: LENS access credentials, Assessment Package HTML, access duration and terms | Signäl Operator | Customer delivery email |
| 5.2 | Confirm customer received and can access all deliverables | Signäl Operator | Delivery confirmation ✓ |
| 5.3 | Log engagement completion: client, program, engagement reference, deliverables, dates, findings summary | Signäl Operations | Engagement record |
| 5.4 | Schedule follow-up (if customer expressed interest in SC/SE) — 2-4 weeks post-delivery | Signäl Commercial | Follow-up scheduled |

### Handoff Email Template

Subject: Signäl Structural Assessment — [PROGRAM NAME] — Deliverables

```
[CUSTOMER CONTACT],

Your Signäl Structural Assessment for [PROGRAM NAME] is complete.

DELIVERABLES:

1. LENS Access
   URL: [LENS URL]
   Credentials: [PROVIDED SEPARATELY / ATTACHED]
   Access Period: [START DATE] — [END DATE]
   Cognitive Modes: BOARDROOM, BALANCED

2. Structural Assessment Package
   [ATTACHED: structural-assessment-[client]-[run]-[date].html]
   Contains: Structural Verdict (9 chapters), Structural Topology, Evidence Record

3. Advisory Session Recording
   [IF RECORDED: link]

ACCESS NOTES:
- LENS access is active for [ACCESS PERIOD] days
- The Assessment Package is a self-contained document — no internet connection required
- All deliverables are subject to the confidentiality terms in our engagement agreement

If you have questions about the findings or would like to discuss ongoing structural intelligence
(Signäl Continuous Intelligence), please contact [SIGNÄL CONTACT].

Best regards,
[SIGNÄL REPRESENTATIVE]
Signäl — Structural Intelligence
```

---

## Engagement Completion Checklist

- [ ] Evidence intake session conducted
- [ ] Repository access verified
- [ ] Structural analysis pipeline completed without errors
- [ ] LENS access provisioned and verified (all cognitive modes render correctly)
- [ ] Assessment Package generated and verified (all chapters, all findings, topology, evidence record)
- [ ] Advisory session conducted
- [ ] Deliverables sent to customer
- [ ] Customer confirmed receipt
- [ ] Engagement record logged
- [ ] Follow-up scheduled (if applicable)

---

## Escalation Paths

| Issue | Escalation |
|-------|-----------|
| Customer cannot provide repository access | Work with customer IT. Offer archive-based alternative. If access cannot be established within 3 business days, pause engagement and notify commercial. |
| Pipeline produces zero findings | Investigate pipeline. Do NOT deliver an empty assessment. Escalate to engineering. |
| Pipeline error during analysis | Retry. If persistent, escalate to engineering with pipeline logs. Do not proceed to deliverable production with pipeline errors. |
| Customer disputes a finding | Findings are evidence-derived. Walk through evidence trace in LENS. If the evidence is incorrect, escalate to engineering (evidence quality issue). Do not suppress findings. |
| Customer requests deliverable modification | Deliverables are runtime-generated (D13). Operator does not modify findings. If the request is about framing or emphasis, address in the advisory conversation. |
