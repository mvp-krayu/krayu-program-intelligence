# SQO Stage 3 Authority Boundary

## Stream: PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01

---

## 1. AI Proposes, Never Authorizes

The Semantic Derivation Compiler produces output with `review_status: "CANDIDATE"`. This status is immutable within the compiler — no code path can promote it.

Promotion sequence (external governance, NOT in compiler scope):
- CANDIDATE → DRAFT → REVIEWED → APPROVED → LOCKED
- Each transition requires explicit human action

The compiler writes to `clients/{client}/psee/runs/{run}/semantic/compiler/` — never to the canonical CSR path (`clients/{client}/semantic/client_semantic_registry.json`).

## 2. Stage 3 Authority Ceiling

Compiler output supports at most **L3 candidate authority** prior to reconciliation and review. This is encoded in `compiler_metadata.qualification_ceiling: "L3"`.

**DIRECT_EVIDENCE derivation confidence does NOT imply L5 authority.** L5 requires structural proof through crosswalk + reconciliation, which is post-compiler.

Two distinct confidence hierarchies — NEVER conflated:

| Hierarchy | Levels | Scope |
|---|---|---|
| Semantic derivation confidence | DIRECT_EVIDENCE / DERIVED / INFERRED | Per-element compiler output |
| SQO authority levels | L1 through L5 | Per-domain qualification state |

## 3. Review Corridor

Four trigger conditions generate mandatory review items:
1. Domain with ALL INFERRED classifications
2. Component count per domain exceeds 15
3. Multiple plausible groupings exist for a component
4. Overall DIRECT_EVIDENCE ratio below 50%

When any trigger fires, `review_queue.json` is populated and status is `REVIEW_REQUIRED`.

## 4. S1→S2 Dependency

S2 qualification requires:
- Reviewed CSR (promoted from CANDIDATE → REVIEWED minimum)
- Completed crosswalk
- Completed reconciliation

Compiler output alone CANNOT advance qualification state from S1 to S2. The compiler fills Stage 3 (Semantic Construction) — crosswalk (Stage 3→4 bridge) and reconciliation (Stage 4) are separate concerns.

## 5. Relation to Crosswalk and Reconciliation

| Stage | What | Compiler Role |
|---|---|---|
| Stage 3: Semantic Construction | Produce candidate CSR from evidence | **THIS** |
| Stage 3→4 Bridge: Crosswalk | Map semantic elements to structural elements | Not in scope |
| Stage 4: Reconciliation | Verify structural proof | Not in scope |
| Stage 5: Qualification | Advance authority state | Not in scope |

**Crosswalk remains the first authority-elevating bridge.** This preserves the SQO staircase — no shortcut from evidence to authority.

## 6. Why This is SQO Stage 3, Not Generic Semantic Tooling

The compiler is bounded to:
- Evidence-scoped derivation within the SQO qualification lifecycle
- Structured business process documents (HTML, structured text)
- Confidence-scored, review-gated, evidence-traced output

It is NOT:
- A universal NLP/semantic analysis tool
- A standalone document comprehension system
- An arbitrary text → ontology converter

Per SQO §4.3 anti-pattern correction: bounded compiler ≠ universal compiler.

## 7. BlueEdge is Certification Replay Corpus, Not Training Target

The BlueEdge certified CSR (17 domains, 42 capabilities, 89 components) is:
- A certified reference outcome for retroactive validation
- A regression comparison baseline
- Proof of reconstruction capability

It is NOT:
- A universal domain model
- A target topology for all clients
- A success constraint or forced ontology shape
- A generic domain cardinality expectation

**For new clients:** Domain count, capability count, component count, grounding ratio, review burden, and confidence distribution may all differ from BlueEdge. This is expected and correct.

The compiler's job is to produce evidence-backed candidate semantic structures with provenance, confidence, review obligations, SQO authority ceiling, and no self-authorization — not to reproduce any specific shape.

## 8. Compiler Input Boundary

The compiler consumes:
- Evidence documents (HTML)
- PATH A topology (canonical_topology.json) — optional

It must NOT read:
- Existing reconciliation outputs
- Qualification verdicts
- Runtime narrative artifacts (LENS projections, cockpit state)

Stage 3 must not leak Stage 4/5 authority backward.
