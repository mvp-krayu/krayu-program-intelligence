# Signäl Implementation Plan 2026

> **Authority:** This document defines every implementation item required to ship each tier. Every item has: priority, effort, dependency, owner category, and acceptance criteria. Implementation planning derives from SIGNAL_PRODUCT_PLAN_2026.md and PRODUCT_LADDER_GAP_MATRIX.md.

> **Scope:** Implementation work to make each SKU sellable. Not architecture work. Not feature exploration. Not platform evolution. Ship what exists, fill what's missing, package what's built.

---

## Priority Definitions

| Priority | Definition | Timeline | Gate |
|----------|-----------|----------|------|
| **P0** | Must complete before first SA sale | Week 1-2 | Blocks first revenue |
| **P1** | Must complete before SC/SA-DD sales | Month 1-3 | Blocks Tier 2 revenue |
| **P2** | Must complete before SE sales | Month 3-6 | Blocks Tier 3 revenue |
| **P3** | Roadmap — not blocking any current tier | 6+ months | Strategic evolution |

---

## P0 — First SA Sale (Target: 2 weeks)

### ~~P0-1: Score Projection to BOARDROOM~~ — DROPPED

| Field | Value |
|-------|-------|
| **Status** | **DROPPED** |
| **Reason** | Contradicts GTM Decision D9 (no numeric scores on BOARDROOM) and Product Language Decision D2 (governed ceiling posture with driver attribution replaces numeric score). The governed posture (PROCEED / INVESTIGATE / ESCALATE) with structural driver attribution IS the executive surface. |
| **Dropped** | 2026-06-02 |

### ~~P0-2: Assessment Package Export~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **What was built** | Full Assessment Package export: single "EXPORT STRUCTURAL ASSESSMENT" button producing self-contained governed HTML through the complete cognition pipeline (CIP → PICR → PICP → PRE → consumer output). Three-part document: Structural Verdict (chapters + findings), Structural Topology (embedded SVG), Evidence Record (posture + confidence + governance boundary). |
| **Files created** | `AssessmentPackageBuilder.js` (~1030 LOC), `PICRRuntime.js`, `PRECore.js` (3-zone projection), `ZoneA/B/C.js`, `ProjectionConfig.js`, 6 consumer configs, `LENSAdapter.js`, `ConsumerGenericityVerifier.js`, `EIRGroundingContext.js`, `ExecutiveIntelligenceSynthesis.js`, `EIRGraphics.js` |
| **Scope exceeded P0-2** | Original P0-2 was "verify Structural Verdict renders." Actual implementation built the full governed cognition pipeline (PICP, PRE, consumer architecture) and the Assessment Package as a governed export action — satisfying the first item of Stream B (Assessment Package ↔ LENS convergence). |
| **Completed** | 2026-06-01 |

### ~~P0-3: Evidence Intake Checklist~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **Artifact** | `docs/commercial/EVIDENCE_INTAKE_CHECKLIST.md` |
| **Contents** | Required evidence (repository access, dependency manifests), recommended evidence (architectural context, program context), explicit "not required" list, intake process steps, preparation checklist, confidentiality terms. A customer can prepare evidence independently. |
| **Completed** | 2026-06-02 |

### ~~P0-4: Engagement Letter Template~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **Artifact** | `docs/commercial/ENGAGEMENT_LETTER_TEMPLATE.md` |
| **Contents** | 10-section engagement agreement template: scope (in/out), deliverables (LENS + Assessment Package + Advisory Session), timeline (3-5 days), customer obligations, pricing placeholder, LENS access terms, confidentiality (mutual), methodology disclosure, limitation of liability placeholder, signature block. Customizable per customer. Aligned with SIGNAL_TIER1_COMMERCIAL_OFFER.md. |
| **Completed** | 2026-06-02 |

### ~~P0-5: Deliverable Handoff Process~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **Artifact** | `docs/commercial/DELIVERABLE_HANDOFF_PROCESS.md` |
| **Contents** | 5-phase end-to-end process: Evidence Intake → Structural Analysis → Deliverable Production → Advisory Session → Handoff. Per-phase steps with owner and gate criteria. SA-DD extensions noted. Advisory session guidelines (lead with topology, use LENS live, no remediation prescription, no personnel attribution). Handoff email template. Completion checklist. Escalation paths. D13 governance rule enforced (no manual deliverable modification). |
| **Completed** | 2026-06-02 |

### ~~P0-6: Product Language Decisions~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **Artifact** | `docs/commercial/PRODUCT_LANGUAGE_DECISIONS.md` |
| **Decisions** | All 5 resolved as Option B (update product language to match stronger implementation). D1: Domain/cluster topology sufficient. D2: Governed posture replaces numeric score (reinforces GTM D9). D3: Guided Structural Interrogation replaces Golden Query. D4: Governed evidence inspection replaces vault access. D5: Governed evidence trail replaces Claim+Derived+TraceDepth. Zero implementation work required — all 5 confirm current implementation is the correct product. |
| **Completed** | 2026-06-02 |

### P0 Summary

| ID | Item | Status | Completed |
|----|------|--------|-----------|
| ~~P0-1~~ | Score projection to BOARDROOM | **DROPPED** (contradicts D9) | 2026-06-02 |
| ~~P0-2~~ | Assessment Package export | **COMPLETE** | 2026-06-01 |
| ~~P0-3~~ | Evidence intake checklist | **COMPLETE** | 2026-06-02 |
| ~~P0-4~~ | Engagement letter template | **COMPLETE** | 2026-06-02 |
| ~~P0-5~~ | Deliverable handoff process | **COMPLETE** | 2026-06-02 |
| ~~P0-6~~ | Product language decisions | **COMPLETE** | 2026-06-02 |

**P0 GATE: CLEARED.** All items complete or formally dropped. No remaining blockers to first SA sale.

```
P0-1 ──── DROPPED (D9)
P0-2 ──── COMPLETE (2026-06-01)
P0-3 ──── COMPLETE (2026-06-02)     ──→ P0 GATE CLEARED
P0-4 ──── COMPLETE (2026-06-02)     ──→ FIRST SA SALE UNBLOCKED
P0-5 ──── COMPLETE (2026-06-02)
P0-6 ──── COMPLETE (2026-06-02)
```

---

## P1 — SC and SA-DD Sales (Target: 90 days)

### ~~P1-1: SA-DD Packaging~~ — COMPLETE

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE** |
| **Artifact** | `docs/commercial/SA_DD_PACKAGING.md` |
| **Contents** | Full SA-DD commercial packaging: investment committee framing (how to present Structural Verdict to IC), deal-timeline SLA (5-day guaranteed, 3-day expedited option), per-target pricing model (single/multi-target/portfolio), investigation trail appendix format (self-contained HTML, IC package integration), engagement letter SA-DD modifications (scope/deliverables/timeline/LENS access), DD-specific objection handling, commercial motion (upsell paths to SC/SE). |
| **Acceptance** | A PE firm receives materials that feel like deal-grade intelligence, not a tech assessment. IC framing section provides the exact presentation structure. Investigation Trail is positioned as the structural equivalent of DDQ responses. |
| **Completed** | 2026-06-02 |

### P1-2: Multi-Run Posture Tracking

| Field | Value |
|-------|-------|
| **What** | Enable posture comparison across multiple assessment runs for the same program. Minimum: posture trend (S-level, structural conditions count, severity distribution) across runs with timestamp. |
| **Why** | SC's core value proposition is "track how your structural posture evolves." Without multi-run comparison, SC is just repeated SA. |
| **Files** | Backend: run comparison data model, posture delta computation. Frontend: posture trend visualization in LENS. |
| **Effort** | 3-4 days |
| **Dependencies** | None (pipeline already supports multiple runs per client) |
| **Owner** | Engineering |
| **Acceptance** | Customer can see posture at run N vs run N-1. Trend direction is clear (improving/stable/degrading). Minimum 3 data points visualized. |

### P1-3: L2/L3 Trace Depth Filter

| Field | Value |
|-------|-------|
| **What** | Add interactive trace depth filter to OPERATOR mode evidence panel. Allow filtering findings by L1 (raw evidence), L2 (structural derivation), L3 (operational consequence). |
| **Why** | Taxonomy exists (`SoftwareIntelligenceProjectionAdapter.js:31`). Labels render. No interactive filter. SC/SA-DD customers in OPERATOR mode need to drill by derivation level. |
| **Files** | `IntelligenceField.jsx` — OPERATOR mode evidence panel. Filter UI + filtering logic. |
| **Effort** | 1 week |
| **Dependencies** | None |
| **Owner** | Engineering |
| **Acceptance** | OPERATOR mode shows L1/L2/L3 filter. Selecting a level filters displayed findings to that derivation depth. All levels show correct content. |

### P1-4: Subscription Access Model

| Field | Value |
|-------|-------|
| **What** | Infrastructure for SC subscription management: access provisioning (create/revoke/renew), license state tracking, assessment run quotas (or unlimited), renewal notification. |
| **Why** | SA is per-engagement (create access, deliver, done). SC is ongoing — access must persist, be manageable, and be renewable. |
| **Files** | New subsystem: subscription management. Scope depends on scale — could be as simple as a managed access spreadsheet for first 5 customers, or a lightweight admin panel. |
| **Effort** | 2-3 weeks (lightweight version for first customers) |
| **Dependencies** | P0-5 (deliverable handoff process) |
| **Owner** | Engineering / Operations |
| **Acceptance** | A SC customer has persistent LENS access that can be provisioned, tracked, and renewed. At minimum: manual process documented and operational. |

### P1-5: Quarterly Advisory Template

| Field | Value |
|-------|-------|
| **What** | Template for SC quarterly advisory sessions: posture comparison format (run N vs N-1), trend analysis structure, structural evolution narrative, decision support framework. |
| **Why** | SC includes quarterly advisory. The advisory must be structured, repeatable, and value-additive — not an ad-hoc conversation. |
| **Files** | New: `docs/commercial/QUARTERLY_ADVISORY_TEMPLATE.md` |
| **Effort** | 1 day |
| **Dependencies** | P1-2 (multi-run tracking must exist to compare posture across quarters) |
| **Owner** | Product / Advisory |
| **Acceptance** | Template enables a structured 60-minute advisory session. Customer leaves with: posture delta, trend assessment, and structural recommendations for the next quarter. |

### P1 Summary

| ID | Item | Effort | Owner | Depends On |
|----|------|--------|-------|------------|
| ~~P1-1~~ | SA-DD packaging | **COMPLETE** | Product/Commercial | P0-4 ✓ |
| P1-2 | Multi-run posture tracking | 3-4 days | Engineering | — |
| P1-3 | L2/L3 trace depth filter | 1 week | Engineering | — |
| P1-4 | Subscription access model | 2-3 weeks | Engineering/Ops | P0-5 |
| P1-5 | Quarterly advisory template | 1 day | Product/Advisory | P1-2 |

**Total P1: ~5 weeks.** P1-1 can ship independently (enables SA-DD immediately). P1-2 and P1-3 are parallel. P1-4 is the longest pole. P1-5 follows P1-2.

```
P1-1 ──────────────────────────────────→ SA-DD SELLABLE
P1-2 ───┬──→ P1-5 ────────────────────┐
P1-3 ───┘                             ├──→ SC SELLABLE
P1-4 ─────────────────────────────────┘
```

---

## P2 — SE Sales (Target: 6 months)

### P2-1: Centralized RBAC

| Field | Value |
|-------|-------|
| **What** | Formalize the 5-role model (VIEWER, ANALYST, OPERATOR, ADMINISTRATOR, AUTHORITY) as centralized enforcement. Currently: role-based behavior is per-adapter conditional throughout the codebase (`DisclosureSequencingContract.js`, `SurfaceModeResolver.js`, per-component checks`). |
| **Why** | Enterprise customers require role-based access control as organizational infrastructure. The current implicit model works for single-operator use; it does not scale to multi-stakeholder enterprise deployment. |
| **Files** | New: RBAC middleware/service. Updates: all adapter conditionals unified to RBAC lookups. |
| **Effort** | 2-3 weeks |
| **Dependencies** | P1-4 (subscription model provides user/access foundation) |
| **Owner** | Engineering |
| **Acceptance** | Roles assigned per user. Each role sees appropriate depth and has appropriate action authority. Role enforcement is centralized, not per-component. Admin can assign/modify roles. |

### P2-2: Multi-Program Foundation

| Field | Value |
|-------|-------|
| **What** | Data model and UI for structural intelligence across multiple programs within a single enterprise instance. Cross-program dependency visibility. Portfolio-level structural posture. |
| **Why** | SE customers have multiple programs. The value of enterprise intelligence is portfolio visibility — "which programs have structural risk, and how do their structures interact." |
| **Files** | Backend: multi-program data model, portfolio posture aggregation. Frontend: program selector, portfolio view. |
| **Effort** | 4-6 weeks |
| **Dependencies** | P2-1 (RBAC must exist for multi-program access control) |
| **Owner** | Engineering |
| **Acceptance** | At least 2 programs assessable through single instance. Portfolio-level posture visible. Cross-program navigation functional. |

### P2-3: Enterprise Onboarding

| Field | Value |
|-------|-------|
| **What** | Enterprise deployment model: how SE is deployed (hosted/on-premise/hybrid), data residency requirements, integration architecture (SSO, API access), security model. |
| **Why** | Enterprise customers have deployment requirements that advisory-grade engagements don't. Data residency, SSO integration, and security review are table stakes. |
| **Files** | New: `docs/commercial/ENTERPRISE_ONBOARDING.md`, deployment architecture specification |
| **Effort** | 2-3 weeks |
| **Dependencies** | P2-1 (RBAC), P2-2 (multi-program) |
| **Owner** | Engineering / Operations |
| **Acceptance** | An enterprise customer can complete security review, deploy the platform, integrate SSO, and onboard multiple programs. Process is documented and repeatable. |

### P2-4: Enterprise SLA

| Field | Value |
|-------|-------|
| **What** | SLA terms: uptime commitment, support tiers (response times), escalation process, dedicated advisory allocation. |
| **Why** | Enterprise customers buying multi-year platform licenses expect defined service levels. |
| **Files** | New: `docs/commercial/ENTERPRISE_SLA.md` |
| **Effort** | 1 week |
| **Dependencies** | None |
| **Owner** | Commercial / Operations |
| **Acceptance** | SLA is defined, reviewed by legal, and ready to append to enterprise agreements. |

### P2 Summary

| ID | Item | Effort | Owner | Depends On |
|----|------|--------|-------|------------|
| P2-1 | Centralized RBAC | 2-3 weeks | Engineering | P1-4 |
| P2-2 | Multi-program foundation | 4-6 weeks | Engineering | P2-1 |
| P2-3 | Enterprise onboarding | 2-3 weeks | Engineering/Ops | P2-1, P2-2 |
| P2-4 | Enterprise SLA | 1 week | Commercial/Ops | — |

**Total P2: ~10-12 weeks.** P2-1 → P2-2 → P2-3 is the critical path (8-12 weeks serial). P2-4 is parallel.

```
P2-4 ──────────────────────────────────────────────┐
P2-1 ──→ P2-2 ──────────────→ P2-3 ──────────────┤──→ SE SELLABLE
                                                    │
```

---

## P3 — Roadmap (Not Blocking Any Tier)

| ID | Item | Description | Trigger |
|----|------|-------------|---------|
| P3-1 | Domain module marketplace | Module registration, activation, billing infrastructure. Enables M&A Intelligence, Portfolio Intelligence, PM Intelligence modules. | When SE has first customer and module demand is validated |
| P3-2 | Capability-level topology | Drill-down from domain/cluster to capability level within LENS v2 topology. Port from legacy or rebuild. | If D1 decision is revisited based on customer feedback |
| P3-3 | Full posture delta dashboard | Rich run-over-run comparison UI. Side-by-side Structural Verdict diff. Finding-level delta tracking. | After SC has 3+ customers and multi-run usage patterns are understood |
| P3-4 | Domain-scoped golden query | Program-level synthesis with domain scoping. Enhanced investigation for specific structural regions. | If D3 decision is revisited based on customer feedback |
| P3-5 | API access | Programmatic access to structural intelligence for CI/CD integration, custom reporting, third-party tool integration. | When enterprise customers request integration |

---

## Implementation Gantt

```
WEEK    1   2   3   4   5   6   7   8   9  10  11  12  ···  24
        │   │   │   │   │   │   │   │   │   │   │   │       │
P0 ─────┤===│   │   │   │   │   │   │   │   │   │   │       │
        │ ▲ │   │   │   │   │   │   │   │   │   │   │       │
        │ SA│   │   │   │   │   │   │   │   │   │   │       │
P1-1 ───│───┤=  │   │   │   │   │   │   │   │   │   │       │
        │   │ ▲ │   │   │   │   │   │   │   │   │   │       │
        │   │SADD   │   │   │   │   │   │   │   │   │       │
P1-2 ───│───┤===│   │   │   │   │   │   │   │   │   │       │
P1-3 ───│───┤===│===│   │   │   │   │   │   │   │   │       │
P1-4 ───│───┤===│===│===│===│===│   │   │   │   │   │       │
P1-5 ───│───│───│───┤=  │   │   │   │   │   │   │   │       │
        │   │   │   │   │ ▲ │   │   │   │   │   │   │       │
        │   │   │   │   │ SC│   │   │   │   │   │   │       │
P2-1 ───│───│───│───│───│===│===│===│   │   │   │   │       │
P2-2 ───│───│───│───│───│───│───│───│===│===│===│===│===│···│
P2-3 ───│───│───│───│───│───│───│───│───│───│───│───│===│···│===│
P2-4 ───│───│───│───│───│───│───│───│===│   │   │   │   │   │
        │   │   │   │   │   │   │   │   │   │   │   │       │ ▲
        │   │   │   │   │   │   │   │   │   │   │   │       │ SE
```

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| First SA customer requires capability not in P0 | Delays first revenue | Medium | P0 is minimal. Anything beyond P0 is a customization, not a gap. Set expectations during sales: "what you see in the demo is what ships." |
| Subscription infrastructure (P1-4) takes longer than estimated | Delays SC sales | Medium | Lightweight first: manual provisioning for first 3-5 SC customers. Build automation based on observed operational patterns. |
| RBAC centralization (P2-1) breaks existing per-adapter behavior | Regression in LENS persona gating | Medium | Regression test: all 4 cognitive modes must render identically before and after RBAC migration. Per-adapter conditionals become RBAC lookups, not logic changes. |
| Multi-program (P2-2) requires data model changes that affect single-program | Regression in SA/SC | Low | Multi-program is additive. Single-program is the degenerate case of multi-program (N=1). Design multi-program so single-program requires zero changes. |
| Customer rejects governed ceiling posture, demands numeric score | Product language mismatch | Low | Governed ceiling with driver attribution IS more valuable. If numeric score is demanded, derive one from existing substrate (readiness_summary.score exists). |

---

## Owner Categories

| Category | Scope | Typical Items |
|----------|-------|---------------|
| **Engineering** | Code changes, feature implementation, infrastructure | P0-1, P0-2, P1-2, P1-3, P1-4, P2-1, P2-2 |
| **Product** | Product decisions, language, templates, positioning | P0-3, P0-6, P1-1, P1-5 |
| **Commercial** | Engagement letters, pricing, SLA, sales materials | P0-4, P1-1, P2-4 |
| **Operations** | Delivery process, provisioning, support | P0-5, P1-4, P2-3 |

---

## Cross-References

| Document | Relationship |
|----------|-------------|
| SIGNAL_PRODUCT_PLAN_2026.md | Product requirements driving this implementation plan |
| PRODUCT_LADDER_GAP_MATRIX.md | Implementation reality assessment informing effort estimates |
| SIGNAL_SKU_MODEL_2026.md | SKU composition defining what each tier must deliver |
| SIGNAL_OFFER_CATALOG_2026.md | Customer-facing promises that implementation must fulfill |
