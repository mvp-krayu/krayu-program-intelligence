# PI Co-Pilot — Implementation Architecture

> **Date:** 2026-06-02
> **Source:** Frozen baselines + codebase scan
> **Purpose:** Map the frozen PI Co-Pilot conceptual model onto the existing codebase. Implementation leverage discovery, not architecture reopening.
> **North Star:** Operator Amplification. Every implementation decision is evaluated against: does this make the operator more capable? Not: does this generate an artifact? Not: does this answer a question? The operator enters with intent. The Co-Pilot contributes knowledge, context, and transformation. The outcome is: amplified operator.

---

## 0. CODEBASE REALITY

### What Exists

| Asset | Status | Reusable? |
|-------|--------|-----------|
| `resolveFlagshipBinding()` — server-side data resolution | OPERATIONAL | YES — fullReport, synthesisResult, consequenceResult, persona projections |
| `forBoardroom()` / `forBalanced()` / `forOperator()` — persona projections | OPERATIONAL | YES — pre-synthesized consumption surfaces (~7-11 KB each) |
| `SignalSynthesisEngine.synthesize()` — condition compilation | OPERATIONAL | YES — deterministic conditions from signals |
| `ConsequenceCompiler.compile()` — consequence compilation | OPERATIONAL | YES — consequences from conditions |
| `InterrogationTrailBuilder.buildTrailHTML()` — governed evidence record | OPERATIONAL | YES — artifact generation pattern |
| `GoverningNarrativeComposer.composeGoverningNarrative()` — spine narrative | OPERATIONAL | YES — governed narrative composition |
| `ClientScopedSectionResolver` — client isolation gate | OPERATIONAL | YES — workspace token pattern |
| `sdc/llm_adapter.py` — Anthropic SDK adapter (Python) | OPERATIONAL | PATTERN — provider isolation, structured prompts, graceful degradation |
| Next.js AI SDK / streaming infrastructure | DOES NOT EXIST | Greenfield |
| Chat/conversation API routes | DOES NOT EXIST | Greenfield |
| Frontend AI dependencies | DOES NOT EXIST | Greenfield — `@ai-sdk/anthropic` or direct SDK |
| `/copilot` routes | DOES NOT EXIST | Clean — no conflicts |

### What the Scan Revealed

**Level 0 context (doctrine + commercial + vault):** ~300-360K tokens total. Does NOT fit in a single context window. Needs selective retrieval.

**Level 1/2 context (specimen + verdict):** ~26K tokens (stripped fullReport + persona projections). Fits easily.

**LENS governance:** Explicitly forbids AI/chat/prompt surfaces (governance fixtures). Co-Pilot MUST be a separate surface.

**Key insight:** The context assembly problem is primarily a Level 0 problem. Level 1/2 data is compact and already well-structured by the existing resolver pipeline.

---

## 1. CONTEXT ASSEMBLY ARCHITECTURE

### The Strategic Center

Context assembly is the differentiator. The PI Co-Pilot does not win on chat UX, LLM provider selection, or prompt templates. It wins on **PIOperationalContext** — the assembled operational context that pre-loads governed knowledge before any question is asked.

The quality of PIOperationalContext determines whether the operator receives generic AI output or structurally-grounded governed intelligence. Every implementation decision in this section should be evaluated against: **does this improve the quality of assembled context?**

### The Problem

The PI Knowledge Graph has 7 domains. At Level 0, the doctrine/commercial/vault corpus is ~360K tokens — too large for any single context window (~128-200K). The Co-Pilot needs a tiered context strategy.

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  PIOperationalContext                      │
│                                                           │
│  TIER 1 — ALWAYS LOADED (~25-30K tokens)                 │
│  ├── System prompt (governance, prohibitions, mode)       │
│  ├── PI identity summary (condensed canonical state)      │
│  ├── Commercial authority index (COMMERCIAL_AUTHORITY.md) │
│  ├── Product language decisions                           │
│  ├── Offer catalog summary                                │
│  └── Context level indicator + available knowledge        │
│                                                           │
│  TIER 2 — CONTEXT-LEVEL-DEPENDENT (~20-30K tokens)       │
│  ├── Level 0: (nothing additional)                        │
│  ├── Level 1: stripped fullReport (~20K tokens)            │
│  ├── Level 2: + persona projections (forBoardroom,        │
│  │            forBalanced — ~5K tokens)                    │
│  └── Level 3: + prior artifact summaries                  │
│                                                           │
│  TIER 3 — RETRIEVED ON DEMAND (~30-60K tokens budget)    │
│  ├── Topic-specific vault pages                           │
│  ├── Deep commercial packaging (SA, SA-DD specifics)      │
│  ├── Governance doctrine (specific sections)              │
│  ├── Framework files (pyramid, maturity model, etc.)      │
│  └── Specimen-specific deep data (topology, signals)      │
│                                                           │
│  RESERVED — CONVERSATION (~30-60K tokens)                │
│  └── Conversation history + current transformation        │
└──────────────────────────────────────────────────────────┘
```

### Tier 1: Always-Loaded Context (~25-30K tokens)

A **condensed PI identity document** must be authored — NOT the full PIOS_CURRENT_CANONICAL_STATE.md (100K chars / ~25K tokens alone), but a Co-Pilot-specific boot document (~8-10K tokens) covering:

- What Program Intelligence is (definition, not history)
- The product hierarchy (PI → GEIOS → PiOS → LENS → SQO → Marketplace)
- The 4 SKUs and what each includes
- The governance model (13 prohibitions, 3-tier authority)
- Competitive positioning summary
- Key terminology (condensed from TERMINOLOGY_LOCK.md)

Plus the system prompt embedding:
- Current context level (L0/L1/L2/L3)
- Available knowledge domains
- Active mode (transformation type)
- Target audience
- Constitutional prohibitions
- Evidence-compatibility requirements

### Tier 2: Context-Level Data

| Level | Additional Data | Source | Tokens |
|-------|----------------|--------|--------|
| 0 | None | — | 0 |
| 1 | `fullReport` (stripped of `structural_enrichment`, `source_artifacts`) | `resolveSemanticPayload()` | ~20K |
| 2 | + `forBoardroom()` + `forBalanced()` persona projections | `ConsequenceCompiler` | ~5K |
| 3 | + Prior artifact summaries (titles, audiences, timestamps) | Session state | ~2-5K |

### Tier 3: Retrieved Context

Tier 3 retrieval is a **replaceable strategy**, not the architecture. The PI Knowledge Graph defines the knowledge domains. The retrieval strategy determines how knowledge is selected from those domains for a given operator intent. Future retrieval strategies must be replaceable without changing the Co-Pilot architecture.

```
PI Knowledge Graph (ARCHITECTURE — 7 domains, fixed)
        ↓
Retrieval Strategy (IMPLEMENTATION — replaceable)
        ↓
PIOperationalContext (ARCHITECTURE — assembled context)
```

**Retrieval Strategy v1 — Topic Router:**
- Classify the operator's intent into ~15-20 topic categories
- Each category maps to a curated file list (3-8 files per category)
- Load the relevant files into context
- Pro: No embedding infrastructure. Predictable. Auditable. Con: Requires manual topic→file mapping. Misses edge cases.

**Future Retrieval Strategy — Chunk + Embed (RAG):**
- Pre-chunk the ~176 doctrine files into ~500-token chunks
- Embed with a small model (or Anthropic's embedding endpoint)
- Retrieve top-K chunks per query
- Pro: Works for any query. Con: Requires embedding infrastructure.

**Decision:** Start with Topic Router (v1). Evolve to RAG if topic routing proves insufficient. The retrieval strategy is behind the `PIContextAssembler` interface — swapping strategies does not change the Co-Pilot architecture.

### Topic Router Categories (Draft)

| Category | Files Loaded |
|----------|-------------|
| PI Definition / Identity | canonical_state (condensed), pyramid, three_layer_model |
| Commercial / Offers | SA_PACKAGING, SA_DD_PACKAGING, OFFER_CATALOG, SKU_MODEL |
| Competitive Positioning | COMMERCIAL_CONTRAST, pyramid (competitive section) |
| Governance / Prohibitions | Q02_GOVERNANCE, reference_boundary_contract, 75.x sections |
| SQO / Qualification | SQO_EXECUTION_GRAPH, qualification sections |
| Cognition Architecture | COGNITION_ANATOMY, PICP constitution |
| Marketplace / Modules | MARKETPLACE_ARCHITECTURE, SW-Intel constitutional definition |
| Delivery Process | ENGAGEMENT_LETTER, EVIDENCE_INTAKE, HANDOFF_PROCESS |
| Pricing / Packaging | SA/SA-DD packaging, SKU model |
| Runtime Architecture | pios_runtime_architecture, pipeline spec |
| Signal Intelligence | Signal family taxonomy, signal ontology |
| Evidence / Grounding | PATH_A, PATH_B, evidence corridors |
| Investor / Strategic | Executive overview, architecture overview, EIR |
| Topology / Structure | (specimen-specific — requires Level 1+) |
| Verdict / Posture | (specimen-specific — requires Level 2+) |

### Context Assembly Implementation

```
PIContextAssembler
├── assembleTier1()          → static boot context
├── assembleTier2(level)     → level-dependent runtime data
├── routeToTopic(intent)     → topic classification
├── retrieveForTopic(topic)  → file loading + truncation
└── assemble(level, intent)  → complete PIOperationalContext
```

**File:** `app/execlens-demo/lib/copilot/PIContextAssembler.js` (~200-300 LOC)

**Dependencies:**
- `resolveFlagshipBinding()` for Level 1/2 data
- Filesystem access for doctrine files (server-side only)
- Topic router mapping (static config, ~50 LOC)

---

## 2. KNOWLEDGE GRAPH ACCESS LAYER

### Architecture

The PI Knowledge Graph is not a database — it is a collection of governed markdown files (doctrine), runtime resolver outputs (specimen/verdict), and session artifacts (publishing). The access layer must unify these sources.

```
PIKnowledgeGraph
├── doctrine/     → file-based markdown (static, ~176 files)
├── commercial/   → file-based markdown (static, ~15 files)
├── runtime/      → resolver outputs (dynamic per client/run)
├── vault/        → file-based markdown (static, ~104 files)
├── specimen/     → resolveSemanticPayload() output (dynamic)
├── verdict/      → persona projections + governed narrative (dynamic)
└── publishing/   → session artifact store (ephemeral)
```

### Implementation

```
PIKnowledgeGraphAccess
├── loadDoctrineFile(path)        → read + cache markdown
├── loadCommercialFile(path)      → read + cache markdown
├── loadVaultPage(section, page)  → read + cache markdown
├── resolveSpecimen(client, run)  → calls resolveFlagshipBinding()
├── resolveVerdict(client, run)   → calls forBoardroom/forBalanced
├── listPublishedArtifacts()      → session artifact index
└── getContextLevel()             → L0/L1/L2/L3 determination
```

**File:** `app/execlens-demo/lib/copilot/PIKnowledgeGraphAccess.js` (~150-200 LOC)

**Context level determination:**
- No `client`/`run` params → Level 0
- `client`/`run` params + valid manifest → Level 1
- Level 1 + `governed_narrative` present → Level 2
- Level 2 + prior artifacts in session → Level 3

---

## 3. TRANSFORMATION PIPELINE

### Architecture

The transformation pipeline converts operator intent into governed output through a structured prompt assembly → LLM call → post-validation chain.

```
OPERATOR INPUT
    ├── intent (what transformation)
    ├── audience (who consumes output)
    └── context (conversation + knowledge level)
            ↓
    PROMPT ASSEMBLY
    ├── system prompt (governance + prohibitions + mode)
    ├── context injection (Tier 1 + Tier 2 + Tier 3)
    ├── conversation history
    └── current request
            ↓
    LLM CALL (Anthropic Claude)
    ├── streaming response
    ├── temperature: 0.0 for factual, 0.3 for narrative
    └── model: claude-sonnet-4-20250514 (configurable)
            ↓
    POST-VALIDATION
    ├── prohibition check (13 absolute prohibitions)
    ├── evidence compatibility check
    ├── context-honesty check (no hallucinated context)
    └── disclosure wrapping (if interpretive content)
            ↓
    GOVERNED OUTPUT
    └── consumption artifact
```

### Prompt Construction

Each transformation type has a prompt template. The system prompt is assembled from:

1. **Constitutional preamble** — PI Co-Pilot identity, operator amplification purpose, governance boundaries
2. **Prohibition block** — 13 absolute prohibitions (always present, verbatim)
3. **Context level disclosure** — what knowledge is available, what is not
4. **Mode instruction** — transformation-type-specific guidance
5. **Audience specification** — who will consume the output, what language/depth

### Mode-Specific Prompt Templates

| Mode | Prompt Focus | Temperature |
|------|-------------|-------------|
| Query | Answer from available knowledge, cite sources | 0.0 |
| Explore | Navigate connections, surface related concepts | 0.0 |
| Explain | Depth-appropriate explanation, no jargon escalation | 0.1 |
| Compare | Structured comparison with evidence per dimension | 0.0 |
| Curate | Audience-adapted artifact, open format catalog | 0.2 |
| Challenge | Stress-test with evidence, handle objections | 0.1 |
| Visualize | Describe visual representation, reference topology | 0.0 |
| Package | Format specification, multi-format output | 0.1 |
| Position | Commercial framing, category authority | 0.2 |

### Post-Validation — Governance Layer

The ProhibitionValidator is the first Co-Pilot governance boundary. It is a **first-class governance component**, not a utility. Future constitutional evolution will expand this layer. It must be treated with the same architectural gravity as SQO qualification gates and 75.x authority enforcement — not buried as helper code.

A governance layer that checks LLM output against constitutional prohibitions:

```
ProhibitionValidator
├── checkTeamBehavior(output)        → reject if infers team dynamics
├── checkOrgIntent(output)           → reject if infers organizational intent
├── checkHumanMotive(output)         → reject if infers human motive
├── checkCulturalDiagnosis(output)   → reject if cultural assessment
├── checkPersonnelAttribution(output) → reject if attributes to personnel
├── checkRemediation(output)         → reject if "you should" / ranked actions
├── checkContextHonesty(output)      → reject if claims knowledge beyond context level
└── validate(output, contextLevel)   → PASS / VIOLATION + specific prohibition
```

**File:** `app/execlens-demo/lib/copilot/ProhibitionValidator.js` (~100-150 LOC)

### Implementation

**File:** `app/execlens-demo/lib/copilot/TransformationPipeline.js` (~300-400 LOC)

```
TransformationPipeline
├── assemblePrompt(mode, audience, context, history)
├── callLLM(prompt)                  → streaming Anthropic API call
├── validateOutput(output, context)  → prohibition check
├── wrapDisclosure(output, context)  → add context-level disclosure
└── transform(intent, audience, context) → governed artifact
```

---

## 4. SESSION STATE MODEL

### Architecture

The Co-Pilot maintains session state across a conversation. State is ephemeral (browser session), not persisted to disk.

**MVP SIMPLIFICATION — NOT DOCTRINE.** Session-only state is an acceptable starting point. The long-term direction for the PI Co-Pilot — consistent with the Program Intelligence ecosystem's accumulation orientation — includes: artifact lineage, operator chronicle, cross-session memory, replay, and accumulation. The ephemeral model must not become the architectural ceiling.

```
CopilotSession
├── contextLevel        → L0 / L1 / L2 / L3
├── client              → null (L0) or client ID
├── runId               → null (L0) or run ID
├── conversationHistory → array of { role, content, mode, timestamp }
├── activeMode          → current transformation type
├── targetAudience      → current audience specification
├── producedArtifacts   → array of { title, content, audience, mode, timestamp }
├── loadedContext       → cache of retrieved Tier 3 files (avoid re-retrieval)
└── contextSnapshot     → assembled PIOperationalContext for current level
```

### State Transitions

```
PAGE LOAD
├── determine context level from route params
├── assemble Tier 1 + Tier 2 context
└── initialize session

OPERATOR INPUT
├── classify intent → mode + audience
├── route to topic → retrieve Tier 3 if needed
├── append to conversation history
├── execute transformation pipeline
├── append result to history + producedArtifacts (if Curate)
└── update session state

CONTEXT LEVEL CHANGE
├── re-assemble Tier 2 context
├── update contextSnapshot
├── preserve conversation history
└── disclose context change to operator
```

### Implementation

**Client-side:** React state in the Co-Pilot page component. `useState` for session, `useReducer` for complex state transitions.

**Server-side:** API route receives conversation history + context per request. Stateless — the client sends full context each call.

**File:** `app/execlens-demo/lib/copilot/CopilotSessionState.js` (~100-150 LOC)

---

## 5. MODE ORCHESTRATION

### Architecture

The operator thinks in **intent + audience + context** — not "which mode am I in?" Modes are internal orchestration constructs that shape how the transformation pipeline processes a request. They are not the operator's mental model.

The operator's experience is:
- State intent ("Generate a category positioning brief for a PE audience")
- The system resolves how to serve that intent

Modes are implementation conveniences for routing intent to the correct prompt template, temperature, and context requirements. They must never become UI prisons that force the operator to classify their own intent before receiving help.

### Mode Resolution (MVP)

For MVP, the UI exposes mode selection as a lightweight affordance — not a gate. The operator can optionally select a mode to guide the system, but the default path is intent-first:

```
OPERATOR INTENT
        ↓
MODE RESOLUTION (internal)
├── Inferred from intent keywords (MVP: lightweight regex)
├── Overridable by explicit selection
├── Default: Query (if ambiguous)
        ↓
TRANSFORMATION PIPELINE
```

Nine internal modes grouped by tier:

```
UNDERSTAND          CURATE              PUBLISH
├── Query           ├── Compare         ├── Visualize
├── Explore         ├── Curate          ├── Package
└── Explain         ├── Challenge       └── Position
```

Each resolved mode:
1. Sets `activeMode` in session state
2. Adjusts the system prompt template
3. May trigger additional context retrieval (e.g., Compare loads competitive positioning files)
4. Adjusts temperature and output format expectations

### Mode Inference Evolution

Start with lightweight intent classification (regex + keyword matching). Evolve to LLM-based classification if needed. The operator should never be blocked by mode selection — if intent is clear, the system serves it.

### Implementation

**File:** `app/execlens-demo/lib/copilot/ModeOrchestrator.js` (~150-200 LOC)

```
ModeOrchestrator
├── MODES                          → mode definitions with prompt templates
├── selectMode(modeId)             → explicit selection
├── inferMode(input)               → future: intent classification
├── getPromptTemplate(mode)        → mode-specific system prompt section
├── getTemperature(mode)           → mode-specific temperature
└── getContextRequirements(mode)   → additional context needed per mode
```

---

## 6. ARTIFACT GENERATION ARCHITECTURE

### Architecture

Curate and Package modes produce consumption artifacts. The artifact catalog is **open** — the system generates whatever the operator requests, not a fixed set.

### Artifact Lifecycle

```
OPERATOR REQUEST
    "Generate a category positioning brief for a PE audience"
            ↓
MODE RESOLUTION
    mode: Curate
    audience: PE partner
    format: brief (narrative)
            ↓
CONTEXT ASSEMBLY
    Tier 1 (boot) + Tier 3 (competitive positioning, pyramid, commercial contrast)
            ↓
TRANSFORMATION
    LLM generates governed artifact with evidence tracing
            ↓
POST-VALIDATION
    Prohibition check + context-honesty check
            ↓
ARTIFACT OUTPUT
    ├── rendered in output panel
    ├── copy-to-clipboard
    ├── stored in session producedArtifacts[]
    └── available for Level 3 context (artifact refinement)
```

### Artifact Properties

Every produced artifact carries metadata:

```
{
  title: "Category Positioning Brief",
  audience: "PE partner",
  mode: "curate",
  contextLevel: 0,
  sourceDomains: ["doctrine", "commercial"],
  timestamp: "2026-06-02T...",
  content: "...",
  disclosures: ["Level 0 context — no specimen-specific data"],
  governanceStatus: "PASS"
}
```

### Open Catalog — Constitutional Invariant

The artifact catalog is **open**. The transformation catalog is **open**. Both must remain open. This is not a suggestion — it is a constitutional property of the Co-Pilot architecture. Any implementation that hardcodes artifact types (Board Summary, IC Brief, CTO Summary, Acquisition Memo) as product features has violated this invariant. Those are examples of what the operator might request, not a fixed inventory.

The operator should be able to request — without architectural change:
- Proposal section, website narrative, workshop material, keynote outline
- Onboarding package, conference talk, investor note, category paper
- Any consumption artifact that the available knowledge can support

The LLM receives:
- The operator's intent (what to produce)
- The audience specification (who consumes it)
- The available knowledge (assembled context)
- The governance boundaries (what is permitted)

It produces whatever the operator requests. The system validates governance compliance, not format compliance.

### Implementation

Artifact generation is a specialization of the Transformation Pipeline — no separate module needed. The `TransformationPipeline.transform()` function handles all modes including Curate.

Artifact storage is in `CopilotSessionState.producedArtifacts[]`.

---

## 7. OPERATOR UX INTEGRATION

### Route Architecture

```
/copilot                           → Level 0 (no specimen)
/copilot/[client]/[run]            → Level 1/2 (specimen loaded)
```

Both routes render the same `CopilotPage` component. Context level is determined by route params.

**Files:**
- `app/execlens-demo/pages/copilot/index.js` → Level 0 entry
- `app/execlens-demo/pages/copilot/[client]/[run].js` → Level 1/2 entry

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  COPILOT HEADER                                         │
│  ├── PI Co-Pilot wordmark                               │
│  ├── Context Level indicator (L0 / L1 / L2 / L3)       │
│  ├── Client/Run binding (if Level 1+)                   │
│  └── → LENS link (if Level 1+)                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │                      │  │                          │ │
│  │   CONVERSATION       │  │   CONTEXT PANEL          │ │
│  │                      │  │                          │ │
│  │   Message history    │  │   Knowledge domains      │ │
│  │   with mode badges   │  │   available at current   │ │
│  │                      │  │   context level          │ │
│  │   Streaming output   │  │                          │ │
│  │                      │  │   Produced artifacts     │ │
│  │   Artifact rendering │  │   (Level 3 context)      │ │
│  │   with copy action   │  │                          │ │
│  │                      │  │   Active governance      │ │
│  │                      │  │   (prohibitions,         │ │
│  │                      │  │    authority level)       │ │
│  │                      │  │                          │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  INPUT BAR                                           ││
│  │  ├── Text input (operator intent)                    ││
│  │  ├── Audience selector (optional)                    ││
│  │  └── Send button                                     ││
│  └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Visual Identity

The Co-Pilot surface inherits the LENS v2 design system:
- Background: #0d0f14 (base), #141720 (panel)
- Text: #ccd6f6 (primary), #7a8aaa (dim)
- Accent: #4a9eff (blue)
- Monospace for data, system sans-serif for conversation
- No AI theater, no neon, no glow effects

But with its own character:
- Conversation-oriented layout (not structural exploration)
- Artifact output with clear boundaries (not inline text)
- Context level always visible (operator knows what knowledge is available)
- Mode badges on each message (operator knows what transformation was applied)

### Cross-Linking

- LENS header (`AuthorityBand`) gains a subtle Co-Pilot launch link
- Co-Pilot header links back to LENS for structural depth
- Both surfaces share the same `client`/`run` binding — switching between them preserves context

### LENS Governance Compliance

LENS v2 fixtures explicitly forbid: `chatbot`, `copilot`, `assistant`, `prompt_bar`, `chat_window`, `conversational_interface` patterns **within LENS**.

The Co-Pilot is a **separate surface** that does not violate LENS governance:
- Different route (`/copilot/...` not `/lens/...`)
- Different page component
- Different UX model (transformation-oriented, not structural exploration)
- Shared data infrastructure only

---

## 8. IMPLEMENTATION SEQUENCE

### Phase 1 — Foundation (~400 LOC)

| Component | LOC | File |
|-----------|-----|------|
| PIKnowledgeGraphAccess | ~150 | lib/copilot/PIKnowledgeGraphAccess.js |
| PIContextAssembler (Tier 1 + 2 only) | ~150 | lib/copilot/PIContextAssembler.js |
| Condensed PI boot document | ~80 | lib/copilot/pi-boot-context.md |
| Topic router config | ~50 | lib/copilot/topic-router.js |

**Deliverable:** Context assembly works. `assembleTier1()` and `assembleTier2(level)` produce correct context objects. No LLM calls yet.

### Phase 2 — Transformation Pipeline (~500 LOC)

| Component | LOC | File |
|-----------|-----|------|
| TransformationPipeline | ~300 | lib/copilot/TransformationPipeline.js |
| ProhibitionValidator | ~100 | lib/copilot/ProhibitionValidator.js |
| ModeOrchestrator | ~100 | lib/copilot/ModeOrchestrator.js |
| API route (chat endpoint) | ~80 | pages/api/copilot/transform.js |

**Dependencies:** `@ai-sdk/anthropic` or `anthropic` JS SDK added to package.json. `ANTHROPIC_API_KEY` in `.env.local`.

**Deliverable:** API route accepts `{ message, mode, audience, contextLevel, client?, run?, history }`, returns streaming governed response.

### Phase 3 — Operator Surface (~600 LOC)

| Component | LOC | File |
|-----------|-----|------|
| CopilotPage (shared component) | ~300 | components/copilot/CopilotPage.jsx |
| CopilotHeader | ~80 | components/copilot/CopilotHeader.jsx |
| ConversationPanel | ~100 | components/copilot/ConversationPanel.jsx |
| ContextPanel | ~60 | components/copilot/ContextPanel.jsx |
| InputBar | ~60 | components/copilot/InputBar.jsx |
| Route: /copilot | ~30 | pages/copilot/index.js |
| Route: /copilot/[client]/[run] | ~40 | pages/copilot/[client]/[run].js |

**Deliverable:** Operator can access `/copilot`, ask questions, receive governed responses. Level 0 context (doctrine/commercial) works end-to-end.

### Phase 4 — Level 1/2 + Tier 3 Retrieval (~300 LOC)

| Component | LOC | File |
|-----------|-----|------|
| Tier 3 topic retrieval | ~100 | lib/copilot/PIContextAssembler.js (extend) |
| Level 1/2 context wiring | ~100 | lib/copilot/PIKnowledgeGraphAccess.js (extend) |
| LENS cross-link | ~50 | components/copilot/CopilotHeader.jsx (extend) |
| AuthorityBand Co-Pilot link | ~50 | lens-v2-flagship.js (minimal addition) |

**Deliverable:** Operator can access `/copilot/blueedge/run_blueedge_genesis_e2e_03`, ask specimen-specific questions, receive governed responses grounded in BlueEdge data.

### Phase 5 — Curate + Artifacts (~200 LOC)

| Component | LOC | File |
|-----------|-----|------|
| Artifact output rendering | ~100 | components/copilot/ArtifactOutput.jsx |
| Session artifact store | ~50 | lib/copilot/CopilotSessionState.js |
| Copy-to-clipboard | ~30 | components/copilot/ArtifactOutput.jsx |
| Level 3 context injection | ~20 | lib/copilot/PIContextAssembler.js (extend) |

**Deliverable:** Operator can curate consumption artifacts. Artifacts render with metadata, copy action, and feed back as Level 3 context.

### Total Estimated LOC

| Phase | LOC | Cumulative |
|-------|-----|-----------|
| Phase 1 — Foundation | ~400 | 400 |
| Phase 2 — Pipeline | ~500 | 900 |
| Phase 3 — Surface | ~600 | 1,500 |
| Phase 4 — Level 1/2 | ~300 | 1,800 |
| Phase 5 — Curate | ~200 | 2,000 |

~2,000 LOC total for a fully operational PI Co-Pilot at Level 0-3 with all 9 transformation types.

---

## 9. RISK AREAS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Tier 3 retrieval accuracy** | Wrong topic → wrong context → wrong answer | Start with explicit topic router. 20 categories cover 90%+ of intents. Add embedding later if needed. |
| **Condensed boot document drift** | Boot doc becomes stale as vault evolves | Boot doc must be re-derived when canonical state changes. Include in AMOps lifecycle. |
| **Prohibition false positives** | Post-validation rejects legitimate output | Start with keyword heuristics. Refine with operator feedback. Never silently suppress — show violation to operator. |
| **Context window pressure at Level 2** | Boot (~25K) + fullReport (~20K) + projections (~5K) + Tier 3 (~40K) + history (~20K) = ~110K | Fits in 128K. Monitor and truncate conversation history if needed. |
| **Artifact quality** | Open catalog means variable output quality | No mitigation except operator review. The operator IS the quality gate. |
| **LENS governance compliance** | Co-Pilot accidentally bleeds into LENS surfaces | Separate route, separate component tree, separate API routes. No shared components that could inject AI into LENS. |

---

## 10. ARCHITECTURAL PROTECTIONS

Seven protections that must survive implementation. Violation of any protection is an implementation error, not a design choice.

| # | Protection | What It Prevents |
|---|-----------|-----------------|
| 1 | **Retrieval strategy is replaceable** | Topic Router becoming the Knowledge Graph. The router is Retrieval Strategy v1 behind the PIContextAssembler interface. Future strategies (RAG, hybrid, semantic search) must be swappable without architectural change. |
| 2 | **Context assembly is the product** | Treating chat/LLM/prompt templates as the differentiator. PIOperationalContext is the moat — the quality of assembled governed context determines Co-Pilot value. |
| 3 | **Modes are internal orchestration** | Mode selection becoming a UI prison. The operator thinks in intent + audience + context, not "which mode am I in?" Modes resolve internally from operator intent. |
| 4 | **Session state is MVP simplification** | Ephemeral-only state becoming doctrine. The PI ecosystem is accumulation-oriented. Long-term: artifact lineage, operator chronicle, cross-session memory, replay. |
| 5 | **Artifact catalog is open** | Hardcoding artifact types as product features. Board Summary / IC Brief / CTO Summary are examples. The operator may request any consumption artifact without architectural change. |
| 6 | **ProhibitionValidator is governance** | Treating governance enforcement as utility code. This is the first Co-Pilot governance boundary — a first-class component with constitutional standing, not helper code. |
| 7 | **Operator Amplification is the north star** | Measuring success by artifact output or question answering. The destination is amplified operator capability, not transformation for its own sake. |

### Implementation Review Criteria

Every implementation review should assess:

1. **Context quality** — Is the assembled PIOperationalContext high-fidelity? Does the operator receive structurally-grounded intelligence or generic AI output?
2. **Retrieval quality** — Does Tier 3 retrieval return the right knowledge for the operator's intent?
3. **Governance enforcement** — Are the 13 absolute prohibitions enforced? Is the ProhibitionValidator operating as a governance boundary?
4. **Operator amplification** — Does the implementation make the operator more capable? Or does it merely answer questions?
5. **Reuse of existing runtime assets** — Is the existing resolver pipeline (`resolveFlagshipBinding`, `forBoardroom`, `ConsequenceCompiler`, etc.) being leveraged, not rebuilt?

---

## 11. WHAT THIS DOES NOT COVER

- **Workspace token middleware for customer access** — defined in ENABLEMENT_PLAN §5, separate from Co-Pilot
- **SA-DD hosting infrastructure** — VM, domain, TLS, reverse proxy — separate workstream
- **Publish tier implementation** (Visualize, Package) — depends on PRE asset pipeline
- **Multi-format output** (PDF, deck) — future capability
- **Persistent artifact storage** — future, MVP is session-ephemeral (see Protection #4)
- **Authentication / RBAC** — Co-Pilot inherits operator access, no additional auth in MVP
- **Accumulation / replay / operator chronicle** — long-term direction, not MVP scope (see Protection #4)
