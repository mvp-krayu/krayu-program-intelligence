# Consumption Architecture Baseline

> **Frozen:** 2026-06-02
> **Authority:** PI.CONSUMPTION-AND-ACCESS-ARCHITECTURE.01 v1.0 (doctrine-down derivation)
> **Tag:** governed-cognition-consumption-architecture-baseline

---

## Purpose

This document captures the frozen consumption architecture — the governed system through which customers and operators interact with Program Intelligence. Derived from frozen commercial contracts (SA, SA-DD, SC, SE), constrained by the cognition chain (CIP → PICR → PICP → PRE → Consumer).

This is a baseline, not a living document. Future changes require a new stream.

---

## 1. TWO CONSUMPTION SURFACES

Program Intelligence has two consumption surfaces over the same governed intelligence:

| Surface | Who | Purpose |
|---------|-----|---------|
| **Customer Consumption Surface (LENS)** | Customer (buyer, deal team, IC members, board) | Experience structural reality through governed cognitive projection |
| **Operator Interaction Surface (PI Co-Pilot)** | Operator (advisor, founder, certified partner) | Interrogate the PI knowledge graph; produce consumption artifacts for delivery |

**Invariant:** Neither surface creates intelligence. The runtime creates intelligence. Both surfaces consume it.

---

## 2. CUSTOMER CONSUMPTION SURFACE — LENS

### What Each SKU Receives

| SKU | LENS Modes | Queries | Access Duration | Users | Delivery Model |
|-----|-----------|---------|----------------|-------|---------------|
| **SA** | BOARDROOM, BALANCED | — | Engagement period | Advisor-mediated | Screen-share or hosted |
| **SA-DD** | All 4 modes | 76+ in DENSE | 30 days | Up to 10 concurrent | Hosted, self-service |
| **SC** | All 4 modes | 76+ in DENSE | Annual (subscription) | Named users | Self-service, multi-run |
| **SE** | All 4 modes | 76+ in DENSE | License term | Role-based identity | Platform, multi-program |

### Assessment Package (All SKUs)

Every engagement produces governed artifacts the customer retains permanently:

- **Structural Verdict** — 9-chapter governed document (posture, topology, findings, operational ceiling, governance boundary)
- **Evidence Record** — self-contained HTML with posture, confidence envelope, investigation trail, governance boundary

### Customer LENS Route Model

```
SA:     /ws/{token}/lens               → BOARDROOM
        /ws/{token}/lens/balanced      → BALANCED
        /ws/{token}/export/*           → Structural Verdict, Evidence Record

SA-DD:  All SA routes
        /ws/{token}/lens/dense         → DENSE (76+ queries)
        /ws/{token}/lens/operator      → OPERATOR

SC:     All SA-DD routes
        /ws/{token}/runs               → Run comparison
        /ws/{token}/lens/{run_id}      → Per-run LENS

SE:     All SC routes
        /ws/{token}/sqo                → SQO Cockpit (role-gated)
        /ws/{token}/authority          → Authority Workflow (role-gated)
        /ws/{token}/programs           → Multi-program view
```

---

## 3. OPERATOR INTERACTION SURFACE — PI CO-PILOT

The PI Co-Pilot is the universal intelligence interaction surface for Program Intelligence. It interrogates the entire PI knowledge graph — doctrine, commercial, runtime, vault, specimen, verdict, and publishing assets.

The Co-Pilot is not architecturally dependent on any single artifact. It operates before a specimen exists (Level 0), during runtime (Level 1), after verdict generation (Level 2), and after consumption artifacts are produced (Level 3).

Full definition: PI_COPILOT_CONCEPTUAL_BASELINE.md

### Operator Routes

```
Level 0 (no specimen):  /copilot
Level 1/2 (specimen):   /lens/{client}/{run}/copilot
```

Customer LENS never exposes /copilot routes.

---

## 4. THREE-SURFACE ARCHITECTURE

```
┌──────────────────────────────────────────────────────┐
│                  PLATFORM SURFACE                     │
│                                                       │
│   CIP → PICR → PICP → PRE    Pipeline    SQO        │
│   Vault    Governance    Evidence    Streams           │
│                                                       │
│         ┌───────────────────────────────────┐         │
│         │        OPERATOR SURFACE           │         │
│         │                                   │         │
│         │   PI Co-Pilot                     │         │
│         │     (knowledge graph              │         │
│         │      interaction — produces       │         │
│         │      consumption artifacts)       │         │
│         │   Full LENS (all modes)           │         │
│         │   Pipeline + SQO visibility       │         │
│         │   Doctrine + Commercial context   │         │
│         │                                   │         │
│         │     ┌───────────────────────┐     │         │
│         │     │  CUSTOMER SURFACE     │     │         │
│         │     │                       │     │         │
│         │     │  LENS (SKU-gated)     │     │         │
│         │     │  Assessment Package   │     │         │
│         │     │  Evidence Record      │     │         │
│         │     │                       │     │         │
│         │     └───────────────────────┘     │         │
│         └───────────────────────────────────┘         │
└──────────────────────────────────────────────────────┘
```

**Nesting rule:** Customer ⊂ Operator ⊂ Platform (data access). No surface may access data from a surface that does not contain it.

---

## 5. CONSUMPTION MATURITY LEVELS

| Level | Name | Identity | Hosting | SKU | Gaps Required |
|-------|------|----------|---------|-----|---------------|
| **0** | Export Only | None | Operator-local | SA | None |
| **1** | Guided Access | Workspace token | Single hosted instance | SA-DD | PG-003 deferred |
| **2** | Self-Service | Named users | Persistent hosted workspace | SC | PG-001, PG-002, PG-003 |
| **3** | Platform | Role-based identity | Dedicated tenant | SE | PG-001–PG-005 |

Each level builds on the previous. No level requires the next.

**Evolution paths:**

```
Identity:  None → Workspace token → Named users → Role-based → Enterprise SSO
Hosting:   Operator-local → Single hosted → Multi-workspace → Dedicated tenant
Scope:     Single program → Multi-run → Multi-program → Cross-portfolio
```

---

## 6. HOSTING MATURITY MODEL

| Layer | SA-DD Hosting MVP | Full Customer Hosting (future) |
|-------|------------------|-------------------------------|
| **Workspace** | Token → client/run mapping | Lifecycle engine (CREATED → ARCHIVED) |
| **TLS** | Let's Encrypt | Managed with auto-renewal |
| **Proxy** | nginx or Caddy | Load-balanced, health-checked |
| **Runtime** | Single Next.js process (pm2) | Container orchestration |
| **Isolation** | URL routing + ClientScopedSectionResolver | Full tenant isolation |
| **Storage** | Local filesystem | Object storage with retention |
| **Identity** | Workspace token (shared) | Named users → RBAC → SSO |
| **RBAC** | None | 5 roles with enforcement |
| **Audit** | Request logging | Full trail with user attribution |
| **Retention** | Manual | Policy-driven with compliance |
| **Monitoring** | Process health | Application monitoring + alerting |

---

## 7. GOVERNANCE BOUNDARIES

### Boundary 1: Customer ↔ Operator

The customer never sees the Operator Surface. The operator always sees the Customer Surface.

- Assessment Package crosses: Operator → Customer (delivered)
- LENS credentials cross: Operator → Customer (provisioned)
- Advisory session: Operator ↔ Customer (live walkthrough)
- Co-Pilot output: NEVER crosses to customer

### Boundary 2: PI Co-Pilot ↔ Program Intelligence Truth

The Co-Pilot interrogates the knowledge graph. It never mutates Program Intelligence truth.

```
PI KNOWLEDGE GRAPH ──READ──→ CO-PILOT ──PRODUCES──→ CONSUMPTION ARTIFACTS
                                                            │
                                                     NEVER MUTATES
                                                            │
                                              Findings, verdicts, evidence,
                                              qualification, governance
```

### Boundary 3: Constitutional Prohibitions

Both surfaces operate under the same 13 absolute prohibitions (LENS 75.x):
- No team behavior, organizational intent, or human motive inference
- No cultural diagnosis, leadership quality, or management effectiveness assessment
- No personnel attribution, behavioral prediction, or organizational sentiment
- No causal attribution to humans
- No remediation prioritization, "you should" language, or ranked next actions

---

## 8. SKU READINESS

| SKU | Sellable? | Blocking Gaps | Consumption Level Required |
|-----|-----------|--------------|--------------------------|
| **SA** | YES | None | Level 0 (Export Only) |
| **SA-DD** | YES | None (PG-003 deferred) | Level 1 (Guided Access) |
| **SC** | NO | PG-001, PG-002, PG-003 | Level 2 (Self-Service) |
| **SE** | NO | PG-001–PG-005 | Level 3 (Platform) |

---

## Cross-References

- [[CONSUMPTION_AND_ACCESS_ARCHITECTURE]] — full architecture document (binding)
- [[PI_COPILOT_CONCEPTUAL_BASELINE]] — frozen PI Co-Pilot model
- [[PRODUCT_GAP_REGISTER]] — gap state
- [[SKU_MODEL]], [[OFFER_CATALOG]], [[SA_PACKAGING]], [[SA_DD_PACKAGING]] — frozen commercial contracts
