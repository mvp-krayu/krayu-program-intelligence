# Signäl Structural Assessment — Deliverable Handoff Process

> **Purpose:** End-to-end operational process from evidence receipt to advisory delivery. No gaps. No undefined steps. A Signäl engagement lead follows this process for every SA engagement.

> **Product law:** A customer deliverable must be producible from runtime state through a governed export action. If a deliverable requires manual composition, the system has drifted from product into consultancy. This applies to every Signäl deliverable — Structural Assessment, Continuous Intelligence, Enterprise Intelligence, and future Domain Module outputs. The operator reviews and delivers the package. The operator does not compose, edit, suppress, or augment findings.

---

## Process Overview

```
EVIDENCE        STRUCTURAL       DELIVERABLE       ADVISORY
INTAKE          ANALYSIS         GENERATION        SESSION
Day 1           Day 2-3          Day 3-4           Day 4-5
│               │                │                 │
├─ Receive      ├─ Ingest        ├─ Provision      ├─ Schedule
├─ Validate     ├─ Pipeline      ├─ Generate       ├─ Walkthrough
├─ Confirm      ├─ Review        ├─ Deliver        ├─ Follow-up
└─ Scope        └─ QA            └─ Verify         └─ Handoff
```

---

## Phase 1: Evidence Intake (Day 1)

| Step | Action | Owner | Deliverable |
|------|--------|-------|-------------|
| 1.1 | Receive evidence from customer per Evidence Intake Checklist | Engagement Lead | Evidence archive or repository access confirmed |
| 1.2 | Validate evidence completeness: repository accessible, dependency manifests present, program scope defined | Engagement Lead | Completeness check (pass/fail) |
| 1.3 | If incomplete: notify customer within 4 hours with specific missing items | Engagement Lead | Gap notification to customer |
| 1.4 | Confirm evidence receipt to customer: "Evidence received. Structural analysis begins tomorrow." | Engagement Lead | Receipt confirmation email |
| 1.5 | Scope verification: confirm the evidence matches the program described in the engagement letter | Engagement Lead | Scope alignment confirmed |

**Exit criteria:** Complete evidence received, validated, confirmed. Customer knows analysis is starting.

---

## Phase 2: Structural Analysis (Day 2-3)

| Step | Action | Owner | Deliverable |
|------|--------|-------|-------------|
| 2.1 | Evidence ingestion: repository clone, dependency resolution, structural topology reconstruction | Engineering | Ingested evidence in pipeline |
| 2.2 | Pipeline execution: signal synthesis, consequence compilation, cognition ontology activation | Engineering | Full structural analysis complete |
| 2.3 | Quality review: verify topology completeness, finding coherence, severity classifications | Engineering | QA pass |
| 2.4 | If pipeline issues: resolve within analysis window. If resolution requires customer input (e.g., build configuration, monorepo structure), contact customer immediately. | Engineering | Issue resolution or customer contact |

**Exit criteria:** Structural analysis complete. Topology reconstructed. Findings generated. Ready for deliverable generation.

---

## Phase 3: Deliverable Generation (Day 3-4)

| Step | Action | Owner | Deliverable |
|------|--------|-------|-------------|
| 3.1 | LENS provisioning: create customer access credentials, configure program context, verify all cognitive modes render correctly | Engineering | LENS instance live with customer access |
| 3.2 | Assessment Package generation: single export action from LENS — "Export Structural Assessment." Runtime produces: Structural Verdict (executive conclusion), structural intelligence findings, Evidence Record, topology capture. **Not manually assembled. Not operator-composed. Runtime-generated.** | Engineering | Assessment Package (HTML) |
| 3.3 | Operator review: verify Assessment Package is complete, all chapters populated, all findings have 4 fields (observed/matters/operational/leadership), topology renders, governance boundaries disclosed. **Operator reviews. Operator does not edit findings, modify severity, or add conclusions.** | Engagement Lead | Review pass |
| 3.4 | Deliver LENS credentials to customer: access URL, login credentials, access duration, brief orientation ("start in BOARDROOM mode") | Engagement Lead | Credentials delivered |
| 3.5 | Deliver Assessment Package to customer: via secure transfer, with brief cover note ("Your Structural Assessment is ready. Advisory session to walk through findings is scheduled for [DATE].") | Engagement Lead | Package delivered |

**Exit criteria:** Customer has LENS access and Assessment Package. Advisory session is scheduled.

---

## Phase 4: Advisory Session (Day 4-5)

| Step | Action | Owner | Deliverable |
|------|--------|-------|-------------|
| 4.1 | Schedule advisory session: 60-90 minutes with customer's decision-maker(s). Calendar invite with agenda. | Engagement Lead | Session scheduled |
| 4.2 | Session preparation: review the runtime-generated findings, identify the 3-5 highest-impact findings to emphasize during walkthrough, prepare topology navigation sequence. **Preparation is presentation curation — not deliverable composition. The findings already exist. The operator selects emphasis, not content.** | Engagement Lead + Engineering | Prep complete |
| 4.3 | Advisory session delivery: Topology → findings → consequences → verdict. Use LENS live. Walk the structural map. Show where findings live. Explain what they mean for execution. | Engagement Lead + Engineering | Session delivered |
| 4.4 | Session documentation: note customer reactions, questions asked, findings that resonated, areas of surprise | Engagement Lead | Session notes |
| 4.5 | Follow-up: within 24 hours, send brief follow-up email summarizing key findings discussed and next steps (if any) | Engagement Lead | Follow-up sent |

**Advisory session structure:**

| Segment | Duration | Content |
|---------|----------|---------|
| Opening | 5 min | "Here's what we assessed and how" |
| Topology walkthrough | 15-20 min | Live LENS: structural map, pressure zones, domain boundaries |
| Key findings | 20-30 min | Top 3-5 findings: what we observed, why it matters, operational consequence |
| Structural Verdict | 10-15 min | Executive conclusion: posture, ceiling, convergence patterns |
| Discussion | 15-20 min | Customer questions, areas of recognition, areas of surprise |
| Close | 5 min | Next steps, SC conversation if appropriate |

---

## Phase 5: Engagement Close

| Step | Action | Owner | Deliverable |
|------|--------|-------|-------------|
| 5.1 | Verify all deliverables received: LENS access confirmed, Assessment Package confirmed, advisory session completed | Engagement Lead | Delivery verification |
| 5.2 | Customer satisfaction check: brief informal check — did the assessment meet expectations? Any gaps? | Engagement Lead | Feedback captured |
| 5.3 | SC conversation (if appropriate): "You've seen one snapshot. Want to track how your structural posture evolves? Your SA fee applies as credit toward annual subscription." | Engagement Lead | SC interest noted or declined |
| 5.4 | Access management: note LENS access expiry date. Set reminder for credential revocation. | Operations | Access tracked |
| 5.5 | Evidence retention: per engagement letter terms, schedule evidence destruction after retention period | Operations | Retention scheduled |
| 5.6 | Internal debrief: what worked, what didn't, what the customer valued most, what to adjust for next engagement | Engagement Lead | Debrief notes |

---

## Timing Commitments

| Commitment | SLA |
|-----------|-----|
| Evidence receipt confirmation | Same business day |
| Evidence completeness notification (if gaps) | Within 4 hours of receipt |
| Analysis start | Next business day after evidence receipt |
| LENS access + Assessment Package delivery | Within 3-4 business days of evidence receipt |
| Advisory session | Within 5 business days of evidence receipt |
| Post-session follow-up | Within 24 hours of advisory session |

---

## Exception Handling

| Situation | Response |
|-----------|----------|
| Customer evidence is incomplete | Notify within 4 hours. Provide specific missing items list. Timeline pauses until complete evidence received. |
| Pipeline encounters unexpected codebase structure | Engineering resolves. If customer input needed (e.g., monorepo layout, build system), contact same day. Timeline may extend by 1 day. |
| Customer requests to add a second program mid-engagement | Separate engagement. Scope the second program independently. Do not expand the current SA scope. |
| Customer requests findings modification | Decline. The Structural Verdict is governed. Same evidence produces the same findings. Explain that this protects the assessment's credibility. |
| Advisory session needs to be rescheduled | Accommodate within the access window. LENS access remains active. |
| Customer wants raw data export | Explain governed evidence model (D4). Offer Evidence Record as the governed artifact. Raw data export is not the product. |
| Operator wants to add findings not produced by the pipeline | **Stop.** This is the product/consultancy boundary. If a finding is not in the runtime output, it does not exist in the Assessment Package. If the operator believes a finding is missing, the correct action is to improve the pipeline — not to manually insert a conclusion. |
| Operator wants to edit finding severity or wording | **Stop.** Same evidence produces the same findings. If severity is wrong, the pipeline classification needs correction — not a per-engagement manual override. |
| Operator wants to suppress or remove a finding | **Stop.** Operator may not suppress, remove, or hide runtime-generated findings from the Assessment Package. A finding that is "technically correct but not useful for this client" still belongs in the package. Presentation emphasis during the advisory session may vary. Package contents may not. Suppression destroys reproducibility and provenance — the two most defensible properties of the system. |
