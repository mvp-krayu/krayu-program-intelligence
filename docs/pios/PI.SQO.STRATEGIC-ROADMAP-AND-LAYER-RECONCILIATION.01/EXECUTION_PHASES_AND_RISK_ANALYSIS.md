# Execution Phases and Risk Analysis

**Stream:** PI.SQO.STRATEGIC-ROADMAP-AND-LAYER-RECONCILIATION.01
**Status:** STRATEGIC ARTIFACT — NON-EXECUTABLE
**Date:** 2026-05-12

---

## 1. Phase Analysis

### Phase 1 — Reconciliation Stabilization (Current → +3 months)

**Objective:** Formalize what exists. Reduce architectural confusion. Make the implicit HYDRATED state explicit.

**Concrete deliverables:**

| # | Deliverable | Effort | Dependencies |
|---|---|---|---|
| 1.1 | HYDRATED state governance document (lock definition, transition gates) | 1 week | This stream's output |
| 1.2 | Layer responsibility matrix (formal module → layer mapping) | 1 week | This stream's output |
| 1.3 | Pre-rebase extractor deprecation markers | 1 day | None |
| 1.4 | SQO cockpit section audit (12 sections → identify overlap) | 1 week | None |
| 1.5 | Evidence source type registry (YAML schema for admissible evidence types) | 1 week | None |
| 1.6 | Shared semantic maturity indicator (read-only status shared between LENS and SQO) | 2 weeks | 1.2 |

**Risk assessment:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Governance document becomes shelfware | Medium | Low | Keep it actionable — 2 pages max, referenced by validators |
| Layer separation creates busywork refactoring | Medium | Medium | Define boundaries in documentation first. Refactor only when adding capability. |
| Cockpit section audit reveals structural problems | Low | Medium | Accept current structure as v1. Plan v2 when adding clients. |

**Phase 1 success criteria:**
- Layer boundaries documented and accepted
- HYDRATED formally named in governance
- No new conflation introduced
- Existing tests continue to pass

---

### Phase 2 — Hydrated Semantic Maturity (+3 → +6 months)

**Objective:** Maximize the operational value of HYDRATED state. Onboard additional clients. Expand semantic richness.

**Concrete deliverables:**

| # | Deliverable | Effort | Dependencies |
|---|---|---|---|
| 2.1 | Second client LENS v2 deployment (manifest + substrate) | 2 weeks | Client substrate available |
| 2.2 | FastAPI SQO S1→S2 progression | 3 weeks | FastAPI evidence remediation |
| 2.3 | Additional extraction patterns (PDF, structured data) | 2 weeks per type | Phase 1 evidence type registry |
| 2.4 | Crosswalk entity expansion (complete DOM-01→DOM-17 coverage) | 2 weeks | Operator domain knowledge |
| 2.5 | HYDRATED → RECONCILED gate implementation | 2 weeks | Phase 1 layer boundaries |
| 2.6 | Executive disclosure language refinement for Q-02/Q-03 | 1 week | None |

**Risk assessment:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Client substrate not available for second deployment | High | Medium | Use FastAPI as proof point, not a new client |
| Extraction patterns for PDF/structured data are fragile | Medium | Medium | Keep patterns simple. Fail-closed on unparseable evidence. |
| Crosswalk expansion requires domain expertise not available | Medium | High | Document gaps explicitly. UNMAPPED is honest and acceptable. |
| Governance disclosure language is rejected by stakeholders | Low | High | Test with real executive audience before locking |

**Phase 2 success criteria:**
- At least 2 clients operational on LENS v2 + SQO cockpit
- Crosswalk coverage ≥ 80% of semantic domain clusters
- Extraction supports at least 2 evidence source types
- HYDRATED → RECONCILED gate exists (even if no client has crossed it yet)

---

### Phase 3 — Deterministic Grounding Expansion (+6 → +12 months)

**Objective:** Build the correspondence bridge. Enable graduated trustworthiness.

**Concrete deliverables:**

| # | Deliverable | Effort | Dependencies |
|---|---|---|---|
| 3.1 | Crosswalk reconciliation compiler v1 | 4 weeks | Phase 2 crosswalk expansion |
| 3.2 | Graduated grounding model (5-level) | 3 weeks | Phase 1 layer boundaries |
| 3.3 | Vault binding automation for confirmed correspondences | 3 weeks | Vault infrastructure maturity |
| 3.4 | Per-domain evidence coverage reporting | 2 weeks | 3.1 |
| 3.5 | Q-class sub-classification for partial grounding | 2 weeks | 3.2 |

**Risk assessment:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| CLU/DOM/CAP registries incomplete for reconciliation | High | High | Build reconciliation to work with incomplete registries. Report gaps, don't block. |
| Vault infrastructure not mature enough for automation | Medium | Medium | Manual vault anchoring as fallback. Automation is optimization, not prerequisite. |
| Graduated grounding model adds complexity without value | Medium | Medium | Start with 3 levels (SEMANTIC_ONLY, PARTIAL, FULL) before expanding to 5. |
| Q-class sub-classification confuses executive audience | Medium | Low | Keep sub-classification internal. Executive surface shows Q-01/Q-02/Q-03/Q-04 only. |

**Phase 3 success criteria:**
- Reconciliation compiler produces per-domain correspondence report
- At least one domain cluster transitions from HYDRATED to RECONCILED via compiler output
- Graduated grounding model implemented and tested
- Evidence coverage gaps explicitly documented per client

---

### Phase 4 — Runtime Qualification Maturity (+12 → +18 months)

**Objective:** Mature SQO toward authority capability. Enable overlay proposal corridor.

**Concrete deliverables:**

| # | Deliverable | Effort | Dependencies |
|---|---|---|---|
| 4.1 | S3 authority chain implementation | 6 weeks | Phase 3 grounding maturity |
| 4.2 | Overlay proposal corridor | 4 weeks | Admissible candidate pool |
| 4.3 | Authority promotion protocol | 3 weeks | 4.1 |
| 4.4 | Multi-client qualification parity | Ongoing | Client engagement |
| 4.5 | Publication eligibility framework | 3 weeks | 4.3 |

**Risk assessment:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| S3 requirements unclear until real grounding achieved | High | High | Define S3 criteria now (Phase 1). Refine with real data (Phase 3). |
| Overlay proposal corridor adds governance friction without value | Medium | Medium | Make overlay proposal optional. HYDRATED rendering without overlays is valid. |
| Authority promotion protocol is too restrictive for real use | Medium | High | Design for "good enough" authority, not perfection. Authority with disclosure beats no authority. |

**Phase 4 success criteria:**
- At least one client at S3 or clear S3 pathway documented
- Overlay proposal corridor demonstrated for at least one admissible candidate set
- Authority promotion protocol defined and tested (even if no promotion executed yet)

---

### Phase 5 — Agentic Semantic Compilers (+18 → +36 months)

**Objective:** Introduce governed agentic capability where deterministic approaches are insufficient.

**This phase is RESEARCH territory. Estimates are speculative.**

**Key decisions required before Phase 5:**

| Decision | Options | Implication |
|---|---|---|
| 75.x interpretation stream activation | Activate / defer | Unlocks agentic operations. Requires governance amendment. |
| Agent execution model | Tool-use agents / fine-tuned models / hybrid | Determines infrastructure investment |
| Human-in-the-loop granularity | Per-decision / per-batch / per-domain | Determines operational cost |
| Audit trail standard | Full reasoning trace / decision summary / binary approve/reject | Determines storage and review cost |

**Risk assessment:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Agentic output treated as deterministic evidence | HIGH | CRITICAL | Governance architecture must enforce NON_AUTHORITATIVE marking. This is the single most important governance boundary in the system. |
| LLM capability shifts make current architecture assumptions obsolete | Medium | Medium | Design for pluggable agent backends. Don't hardcode model-specific behavior. |
| Agentic operations are too slow for operational use | Medium | Medium | Batch processing + caching. Agentic resolution is advisory, not blocking. |
| Governance overhead makes agentic operations uneconomical | Medium | High | Start with highest-value use case (domain label resolution). Prove ROI before expanding. |

---

### Phase 6 — Generalized SQO Operating Substrate (+36 months →)

**Objective:** Abstract SQO into an industry-agnostic qualification operating model.

**This phase is VISION territory. No concrete planning is warranted yet.**

**Key conditions for Phase 6:**
- Phase 4 complete for at least 3 clients in different domains
- Pattern extraction reveals genuine cross-domain commonalities (not premature abstraction)
- Commercial demand for SQO-as-a-service validated
- Engineering team capacity for multi-tenant architecture

**Anti-patterns to avoid:**
- Abstracting from one client (BlueEdge) and calling it "generalized"
- Building platform infrastructure before having platform customers
- Designing pluggable everything before knowing what needs to plug
- Treating Phase 6 as justification for Phase 1 over-engineering

---

## 2. Cross-Phase Risk Summary

### Critical Risks (System-Level)

| # | Risk | Phases Affected | Mitigation Strategy |
|---|---|---|---|
| CR-1 | Governance hardening destroys semantic usefulness | All | HYDRATED state is legitimate. Never gate rendering on EXACT. Disclosure-based rendering is the permanent operational model. |
| CR-2 | Duplicate extraction logic across corridors | 1-3 | Phase 1 layer separation. Single extraction entry point per evidence type. |
| CR-3 | Agentic output treated as deterministic evidence | 5-6 | Governance architecture must enforce separation. This is non-negotiable. |
| CR-4 | Premature abstraction delays real delivery | 3-6 | Solve for BlueEdge first. Generalize only from proven patterns across 3+ clients. |
| CR-5 | Artifact deletion during test execution (environmental) | All | Investigate external process deleting artifacts. Separate test data from ephemeral workspace. |
| CR-6 | SQO cockpit complexity grows without corresponding value | 2-4 | Audit cockpit sections (Phase 1.4). Consolidate before expanding. |

### Velocity vs. Governance Tradeoff

The system's current execution velocity is constrained by governance overhead. Each stream requires:
- Pre-flight verification
- Branch domain validation
- 8-item RETURN block
- CLOSURE.md
- Validation log
- File changes log
- Execution report
- Stream-specific tests

This governance is valuable for high-stakes operations (authority promotion, grounding mutation, publication). It is excessive for:
- CSS refinement
- Component display changes
- Additive-only rendering modifications
- Documentation/reporting

**Recommendation:** Define a governance tiering model:
- **Tier G1 (Full governance):** Operations that mutate evidence, grounding, authority, or publication state
- **Tier G2 (Standard governance):** New feature corridors, data shape changes, route binding changes
- **Tier G3 (Light governance):** Display-only changes, CSS, documentation, additive rendering

This reduces friction for low-risk operations without compromising governance for high-risk ones.

---

## 3. What Must Happen Next

The single most important near-term action is **Phase 1.1: Formally define and lock the HYDRATED state.**

This removes the largest source of architectural confusion: the system operates at HYDRATED but doesn't name it, which creates pressure to either over-govern (treating HYDRATED as deficient) or under-govern (treating HYDRATED as authoritative).

Once HYDRATED is formally named:
- LENS v2 rendering at Q-02/Q-03 is explicitly legitimate
- SQO S2 qualification becomes the expected HYDRATED operational state
- Crosswalk reconciliation has a clear starting point (HYDRATED) and target (RECONCILED)
- The governance model has a vocabulary for graduated trustworthiness
- The roadmap becomes executable because each phase has a named state transition to achieve

Everything else follows from this naming.
