# Implementation Readiness Assessment

> **Date:** 2026-06-02
> **Source:** Frozen baselines — CONSUMPTION_ARCHITECTURE_BASELINE.md + PI_COPILOT_CONCEPTUAL_BASELINE.md
> **Purpose:** Translate frozen concepts into buildable workstreams. No new architecture. No conceptual reopening.

---

## 1. WHAT IS ALREADY SOLVED

These questions have definitive answers in the frozen baselines. They do not need further discussion.

| Question | Answer | Source |
|----------|--------|--------|
| What is the PI Co-Pilot? | Universal intelligence interaction surface for PI | PI_COPILOT_CONCEPTUAL_BASELINE §1 |
| What does it interrogate? | The full PI knowledge graph (7 domains) | PI_COPILOT_CONCEPTUAL_BASELINE §4 |
| How does context work? | Progressive — Level 0 through Level 3 | PI_COPILOT_CONCEPTUAL_BASELINE §2 |
| What are the interaction modes? | 9 modes across 3 tiers (Understand/Curate/Publish) | PI_COPILOT_CONCEPTUAL_BASELINE §3 |
| What is the consumption model? | 4 levels: Export Only → Guided Access → Self-Service → Platform | CONSUMPTION_ARCHITECTURE_BASELINE §5 |
| How are customers isolated? | Workspace-scoped tokens; ClientScopedSectionResolver | CONSUMPTION_ARCHITECTURE_BASELINE §6 |
| What are the governance rules? | 13 prohibitions + never creates intelligence + context-honest | PI_COPILOT_CONCEPTUAL_BASELINE §6 |
| What are the non-goals? | Not customer-facing, not consulting platform, not qualification engine | PI_COPILOT_CONCEPTUAL_BASELINE §7 |
| Is SA sellable? | YES — zero blockers, Level 0 | CONSUMPTION_ARCHITECTURE_BASELINE §8 |
| Is SA-DD sellable? | YES — zero blockers (PG-003 deferred), Level 1 | CONSUMPTION_ARCHITECTURE_BASELINE §8 |
| What does the SA delivery look like? | Playbook defined: pipeline → artifacts → screen-share → handoff | ENABLEMENT_PLAN §3.4 |
| What does SA-DD hosting require? | Token middleware + customer routes + nav shell + provisioning script | ENABLEMENT_PLAN §5 |

---

## 2. WHAT REMAINS CONCEPTUAL

These areas are defined in the baselines but not yet specified at implementation detail. They need design decisions before code.

### 2.1 Knowledge Graph Context Assembly

**Frozen concept:** The Co-Pilot pre-loads operational context from the PI knowledge graph before any interaction.

**Open implementation questions:**

| Question | Why It Matters |
|----------|---------------|
| How does Level 0 context get assembled? | Doctrine + Commercial + Vault are markdown files, not runtime objects. Need a loading/indexing strategy. |
| How does Level 1/2 context get assembled? | Specimen and verdict data exist as runtime objects (resolvers, fullReport, topology). Need to determine which resolvers feed the context assembler. |
| What is the context object shape? | `PIOperationalContext` is named but not schema-defined. Need field inventory per level. |
| How large is the context window? | Doctrine alone is substantial. Commercial packaging is multiple files. Need to determine what fits in a single LLM context vs what requires selective retrieval. |
| Does context assembly happen at page load or on demand? | Affects UX and latency. Pre-load = fast responses, larger initial payload. On-demand = slower first response, smaller footprint. |

**Readiness:** CONCEPTUAL — needs design pass before implementation.

### 2.2 Interaction Mode Engine

**Frozen concept:** 9 modes across 3 tiers, governed by 75.x prohibitions.

**Open implementation questions:**

| Question | Why It Matters |
|----------|---------------|
| How does mode detection work? | Does the operator explicitly select a mode, or is it inferred from input? |
| How are 75.x prohibitions enforced at the prompt level? | System prompt construction per mode. Need prompt templates. |
| How does Curate produce consumption artifacts? | Needs artifact templates (IC Brief, Board Summary, CTO Summary, etc.). Are these pre-defined templates or generated per query? |
| What is the response format? | Markdown? Structured sections? Evidence citations inline? |
| How does evidence compatibility checking work? | The Co-Pilot must verify its outputs are compatible with structural evidence. Is this a post-generation validation step or an in-prompt constraint? |

**Readiness:** CONCEPTUAL — needs design pass before implementation.

### 2.3 Co-Pilot Surface UX

**Frozen concept:** Operator-only LENS panel at `/copilot` (Level 0) and `/lens/{client}/{run}/copilot` (Level 1/2).

**Open implementation questions:**

| Question | Why It Matters |
|----------|---------------|
| Is this a full page or a panel within LENS? | Determines layout architecture. Full page = simpler. Panel = integrated but complex. |
| How does the context level indicator render? | The operator needs to know what knowledge is available. Visual design needed. |
| How do consumption artifacts render? | Copy-pasteable text? Downloadable documents? Inline preview? |
| How does mode selection work? | Dropdown? Tabs? Inferred from input? |
| How does the Co-Pilot relate to existing LENS navigation? | Does it replace the right panel? Add a new panel? Exist as a separate route? |

**Readiness:** CONCEPTUAL — needs UX design before implementation.

### 2.4 Consumption Artifact Templates

**Frozen concept:** Curate produces audience-specific consumption artifacts (IC Brief, Board Summary, CTO Summary, etc.).

**Open implementation questions:**

| Question | Why It Matters |
|----------|---------------|
| What artifacts are supported at MVP? | Full list is extensive. Need to scope MVP artifact types. |
| Are artifacts pre-defined templates or freeform? | Templates = consistent output, faster. Freeform = flexible, harder to quality-control. |
| How are artifacts stored? | Ephemeral (chat-like) or persistent (publishing layer)? |
| How does artifact versioning work? | Operator curates, refines, re-generates. Does each version persist? |

**Readiness:** CONCEPTUAL — needs design pass before implementation.

---

## 3. WHAT CAN BE BUILT IMMEDIATELY

These workstreams have sufficient definition to begin implementation without further conceptual work.

### 3.1 SA Delivery (Zero Code Required)

**What:** Execute the SA delivery playbook (ENABLEMENT_PLAN §3.4) using existing runtime.

**Prerequisites:** None. Runtime, pipeline, Assessment Package generation, LENS — all operational.

**Deliverable:** First SA engagement delivered end-to-end.

**Implementation effort:** 0 LOC. Operational execution only.

**Status:** READY NOW.

### 3.2 SA-DD Hosting MVP

**What:** Workspace token middleware, customer route subset, customer navigation shell, workspace provisioning script, hosting infrastructure.

**Prerequisites:** VM provisioned, domain registered, TLS configured.

**Deliverable:** Customer LENS access URL with 30-day token, all 4 modes, exports.

**Implementation effort:** ~550 LOC + infrastructure setup.

**Known implementation detail (from ENABLEMENT_PLAN §5):**

| Component | LOC | Dependencies |
|-----------|-----|-------------|
| Workspace Token Middleware | ~150 | None — pure middleware |
| Customer Route Subset | ~100 | Token middleware |
| Customer Navigation Shell | ~200 | Route subset |
| Workspace Provisioning Script | ~100 | Token middleware |
| Hosting Infrastructure | — | VM, domain, TLS, reverse proxy |

**Status:** READY TO BUILD. Full specification exists. No conceptual gaps.

### 3.3 PI Co-Pilot Level 0 (Doctrine + Commercial)

**What:** Co-Pilot surface that interrogates PI doctrine and commercial packaging. No specimen required.

**Prerequisites:** None for Level 0. LLM API access needed.

**Deliverable:** Operator can ask "What is PI?", "Compare to SonarQube", "Explain SA-DD", "What is the governance model?" — and receive governed answers grounded in PI knowledge.

**Implementation effort:** ~400 LOC (context loader + prompt construction + chat surface).

**Why this is buildable now:** Level 0 context is static files (doctrine, commercial packaging, vault). No runtime resolvers needed. No specimen data. The context assembly problem is simpler — load relevant markdown files into LLM context with appropriate system prompt.

**Status:** READY TO BUILD with one design decision — context loading strategy (§2.1).

---

## 4. WHAT REQUIRES DESIGN BEFORE BUILDING

### 4.1 PI Co-Pilot Level 1/2 (Specimen + Verdict)

**Depends on:** Context assembly design (§2.1), Mode engine design (§2.2), UX design (§2.3).

**Why it's not immediately buildable:** Level 1/2 context comes from runtime resolvers (GenericSemanticPayloadResolver, fullReport, topology data, SQO state). The context assembler must bridge between LENS runtime data and LLM prompt construction. That bridge is not yet designed.

**Risk area:** Context window size. A full verdict + topology + findings + commercial + doctrine may exceed LLM context limits. May need selective retrieval or context compression.

**Recommendation:** Design the `PIOperationalContext` schema first. Then implement Level 0, then extend to Level 1/2. The schema is the load-bearing decision.

### 4.2 Curate at Level 2+ (Verdict-Enriched Consumption Artifacts)

**Depends on:** Level 1/2 context assembly (§4.1), Mode engine design (§2.2).

**Clarification:** Curate exists at every context level — what changes is the source material. Level 0 Curate (doctrine/commercial/category) is buildable with Level 0 context. This section covers the Level 2+ Curate challenge: producing consumption artifacts from governed verdict data.

**Why Level 2+ Curate is not immediately buildable:** Verdict-enriched Curate must produce high-quality, audience-adapted consumption artifacts grounded in specific specimen evidence. This requires the Level 1/2 context bridge plus prompt engineering and quality validation. A poorly-executed verdict Curate undermines the Co-Pilot value proposition.

**Risk area:** Consumption artifact quality. "Generate an IC Brief from this verdict" must produce something an operator would actually use — not a generic summary.

**The artifact catalog is open.** IC Brief, Board Summary, CTO Summary are examples of consumption artifacts — not a fixed product inventory. The real capability is: take anything Program Intelligence knows, transform it into whatever consumption artifact is needed (memo, summary, briefing, website copy, proposal insert, RFP response, investment deck, conference talk, category narrative, infographic). The catalog grows with operational use.

### 4.3 Publish Tier (Visualize + Package)

**Depends on:** PRE asset pipeline (EIR roadmap Phase 5), Curate implementation.

**Why it's not immediately buildable:** Visualize requires static rendering of topology and pressure zone graphics. Package requires multi-format output (PDF, deck, memo). Both depend on upstream capabilities that don't exist yet.

**Recommendation:** Defer. Curate output is copy-pasteable in MVP. Publish becomes valuable after the asset pipeline exists.

---

## 5. DEPENDENCIES

```
SA DELIVERY (NOW)
    └── No dependencies. Operational execution.

SA-DD HOSTING MVP
    ├── VM + domain + TLS
    └── No code dependencies

PI CO-PILOT LEVEL 0
    ├── LLM API access
    └── Context loading strategy (design decision)

PI CO-PILOT LEVEL 1/2
    ├── PIOperationalContext schema (design)
    ├── Runtime resolver → context bridge (design)
    ├── Mode engine prompt templates (design)
    └── Level 0 implementation (verified working)

CURATE LEVEL 0 (doctrine/commercial/category)
    ├── Level 0 Co-Pilot (working)
    └── Curate exists at every level — Level 0 source material is doctrine/commercial

CURATE LEVEL 2+ (verdict-enriched)
    ├── Level 1/2 context (specimen/verdict loaded)
    └── Quality validation on BlueEdge

PUBLISH TIER
    ├── Curate (working)
    ├── PRE asset pipeline (EIR roadmap Phase 5)
    └── Multi-format output system (design)
```

---

## 6. RISK AREAS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Context window limits** | Full verdict + topology + doctrine may not fit in a single LLM context | Design selective retrieval or context compression. Test with BlueEdge data. |
| **Consumption artifact quality** | "Generate IC Brief" must be operator-usable, not generic | Design templates first. Validate on real specimen. Iterate before generalizing. |
| **Level 0 → Level 2 continuity** | If Level 0 and Level 2 feel like different tools, the progressive context promise fails | Design PIOperationalContext as a single progressive schema. Level 0 is a subset, not a different system. |
| **Mode detection accuracy** | If the engine misclassifies "compare" as "explain," output quality drops | Start with explicit mode selection (operator picks). Add inference later. |
| **Governance enforcement** | 13 prohibitions must hold across all modes and levels | Embed prohibitions in system prompt. Add post-generation validation for Curate output. |

---

## 7. RECOMMENDED BUILD SEQUENCE

```
PHASE 1 — IMMEDIATE (parallel tracks)
├── Track A: SA Delivery — execute playbook, deliver BlueEdge
├── Track B: SA-DD Hosting MVP — build token middleware + routes + shell
└── Track C: PIOperationalContext schema design — the load-bearing decision

PHASE 2 — CO-PILOT FOUNDATION + LEVEL 0 CURATE
├── PI Co-Pilot Level 0 — doctrine + commercial, chat surface
├── Level 0 Curate — category positioning, commercial narratives, doctrine explanation
├── Validate: "What is PI?", "Compare to SonarQube", "Generate a PE explanation"
├── Confirm context loading strategy works
└── Artifact catalog is OPEN — not fixed to IC Brief/Board Summary/CTO Summary

PHASE 3 — SPECIMEN CONTEXT
├── Extend PIOperationalContext to Level 1/2
├── Bridge runtime resolvers → context assembler
├── All modes gain specimen awareness (including Curate at Level 1)
└── Validate on BlueEdge specimen data

PHASE 4 — VERDICT-ENRICHED CURATE
├── Level 2 Curate — verdict-grounded consumption artifacts
├── Validate quality on BlueEdge verdict
├── Curate already works at L0/L1 — this phase adds verdict source material
└── Artifact catalog continues to grow with operational use

PHASE 5 — PUBLISH (DEFERRED)
├── Visualize — requires PRE asset pipeline
├── Package — requires multi-format output
└── Challenge — requires evidence-chain stress-testing
```

---

## 8. SUMMARY

| Category | Count | Status |
|----------|-------|--------|
| **Already solved** | 12 questions | Answered in frozen baselines |
| **Remains conceptual** | 4 areas | Need design decisions before code |
| **Buildable immediately** | 3 workstreams | SA delivery, SA-DD hosting, Co-Pilot Level 0 |
| **Requires design first** | 3 workstreams | Co-Pilot Level 1/2, Curate, Publish |
| **Risk areas** | 5 | Context limits, artifact quality, continuity, mode detection, governance |

The transition from "What is the PI Co-Pilot?" to "How do we build the PI Co-Pilot?" is complete.
