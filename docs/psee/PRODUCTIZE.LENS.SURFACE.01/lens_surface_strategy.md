# LENS Surface Strategy
# PRODUCTIZE.LENS.SURFACE.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.SURFACE.01
- Date: 2026-04-15

---

## SECTION 1 — PURPOSE

Define the governed surface architecture that allows the PiOS evidence chain to project its outputs to three distinct audiences — operators, clients, and auditors — without collapsing the exposure boundaries that make the evidence trustworthy.

This document does not implement surfaces. It defines what must be built, in what order, with what constraints. It is the authority layer for all surface decisions downstream.

---

## SECTION 2 — LOCKED CONSTRAINTS

The following constraints are derived from inspected artifacts and are non-negotiable:

**From `evidence_vault_v2_architecture.md` §1:**
> Execution chain computes / GAUGE renders operator-facing truth / Vault anchors evidence and traceability / LENS renders client-safe explanation

This is the architectural formula. No surface decision may collapse these four roles.

**From `gauge_lens_exposure_governance.md` §1:**
> Not everything traceable should be client-visible. Everything visible must be traceable.

This governs all content decisions for LENS. It is not a preference.

**From `gauge_lens_exposure_governance.md` §9 (Governed Claim Formula):**
Every client-surfaced claim must satisfy: Traceability / Accuracy / Audience-appropriateness / Caveat completeness / Source attribution.

**From `governance/LENS Admissibility.md` (inspected):**
- `signal.statement` — ZONE-1/3 only. Too technical for ZONE-2.
- `confidence_rationale` — ZONE-1/3 only. Contains PSEE internals.
- `business_impact` and `risk` are ZONE-2 safe but NOT currently rendered in GAUGE UI — identified V2 gap.

**From `governance/Known Gaps.md` (generated vault):**
- CONCEPT-06 predicate uses `PHASE_1_ACTIVE`, will NOT match `NOT_EVALUATED`. EXECUTION verdict may render as VERIFIED incorrectly on recomputed run. Must be fixed before LENS can surface this verdict.

---

## SECTION 3 — SURFACE STACK DEFINITION

The system operates on four surfaces, two of which are active, one of which is a pre-existing design target, and one new:

| surface | audience | zone | status | location |
|---------|----------|------|--------|----------|
| GAUGE (index.js + topology.js) | Operator, CTO | ZONE-1 | ACTIVE | `app/gauge-product/pages/index.js` |
| Executive Overview (overview.js) | C-suite, executive | ZONE-1/2 mixed | ACTIVE (with gap) | `app/gauge-product/pages/overview.js` |
| LENS | Client executive, non-technical | ZONE-2 | DESIGN TARGET | not implemented |
| Audit Export | Auditor, client technical | ZONE-3 | NOT BUILT | not implemented |

**Critical distinction:** The current `overview.js` is NOT LENS. It is a mixed-zone surface — it renders GAUGE business ontology output without full ZONE-2 filtering. Specifically, CONCEPT-06 has a known predicate gap that may surface an incorrect EXECUTION verdict. Before `overview.js` can serve as LENS, the CONCEPT-06 predicate must be corrected.

---

## SECTION 4 — AUDIENCE SEPARATION

Three audiences are architecturally distinct. They must never be served from the same unfiltered surface.

| audience | characteristics | allowed content | forbidden content |
|----------|----------------|----------------|-------------------|
| **Operator / CTO** (ZONE-1) | Understands PSEE, PiOS, GAUGE | All 27 claims in full; DIM-XX IDs; axis names; execution state codes; confidence_rationale; source_refs | ZONE-0 raw computation internals |
| **Client Executive** (ZONE-2) | Non-technical; decision-maker | ZONE-2 admissible claim subset; narrative phrases; business_impact; risk; score range; three-axis verdict | signal.statement; DIM-XX codes; PSEE terminal states; CEU file names; projection rule codes; confidence_rationale |
| **Auditor / Technical Client** (ZONE-3) | Forensic verification; technical due diligence | Everything in ZONE-1 plus: evidence chain; blocking conditions; traceability maps; artifact paths | Nothing within scope of ZONE-3 |

These audiences must be served through separate entry points. A single URL that shows different things based on a persona toggle is acceptable only if the zone filter is enforced server-side, not client-side.

---

## SECTION 5 — ZONE MAPPING

| what | ZONE-0 | ZONE-1 | ZONE-2 | ZONE-3 |
|------|--------|--------|--------|--------|
| Raw artifact files (gauge_state.json, etc.) | YES | paths only | NO | paths + content |
| DIM-XX values (raw codes) | YES | YES | NO — use labels | YES |
| score.canonical / projected | YES | YES with derivation | YES — summary | YES |
| signal.statement | YES | YES | NO | YES |
| signal.business_impact | YES | YES | YES | YES |
| signal.risk | YES | YES | YES | YES |
| signal.confidence_rationale | YES | YES | NO | YES |
| signal.source_refs | YES | YES | NO | YES |
| axis_results verbatim | YES | YES | CONDITIONAL (CTO) | YES |
| confidence.status=SPLIT_EXECUTION... | YES | YES | NO — narrative only | YES |
| CEU file names | YES | YES | NO | YES |
| three-axis verdict | YES | YES | YES | YES |
| score range [60, 100] | YES | YES | YES | YES |
| execution status code | YES | YES | ZONE-2 narrative only | YES |

---

## SECTION 6 — RECOMMENDED TARGET ARCHITECTURE

Three surfaces to build, in priority order:

### Priority 1 — Fix GAUGE → LENS bridge (minimal scope)

**What:** Correct CONCEPT-06 predicate in `concepts.json` to match `NOT_EVALUATED`. This is the single blocking issue preventing `overview.js` from being a safe LENS surface.

**Why now:** The current overview.js may surface EXECUTION=VERIFIED on the recomputed run, which is incorrect. This is a governance violation, not a display bug.

**What this unlocks:** overview.js becomes a fully ZONE-2-safe executive surface without architecture changes.

### Priority 2 — GAUGE Click-Through Model (no new surfaces required)

**What:** Add click behavior to existing GAUGE panels that opens a ZONE-1 claim explanation panel (for operators) or a ZONE-2 narrative card (for LENS clients). Content is served from vault-generated markdown fragments.

**Why before LENS:** Establishes the interaction pattern and validates the content model before building a separate surface.

### Priority 3 — LENS v1 as governed projection of the vault

**What:** A dedicated client-facing page (or external URL) that projects ZONE-2 content. Not a new data source — a governed view of the same evidence.

**Recommended implementation path:** Static generated output from the vault builder (PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01), filtered to ZONE-2 nodes only, rendered as a client-safe HTML surface. Quartz serves as the optional rendering shell for internal/operator use; LENS uses a filtered subset.

### Priority 4 — Audit Export (ZONE-3)

**What:** A package (PDF or structured HTML) containing the full ZONE-3 evidence chain for a given client/run. Generated from vault nodes.

---

## SECTION 7 — WHAT LENS IS

LENS is the governed client-safe projection of the execution chain's outputs. It is defined by what it filters, not by what it adds.

LENS:
- Reads from the same evidence base as GAUGE
- Applies ZONE-2 exposure filter to every claim before rendering
- Renders vault-backed content in client-appropriate vocabulary
- Surfaces: score summary, three-axis verdict, signal business impacts, key unknowns, score range
- Does NOT render: raw dimension codes, PSEE internals, technical signal statements, CEU names

LENS does not recompute. It does not invent narrative. Every sentence it renders is traceable to a vault node that is traceable to an artifact that is traceable to an execution chain output.

---

## SECTION 8 — WHAT LENS IS NOT

| not this | why |
|----------|-----|
| A restatement of GAUGE with different CSS | GAUGE is ZONE-1; LENS enforces ZONE-2. They are different governance layers. |
| A marketing document | LENS content is evidence-backed. Every claim must satisfy the 5-condition admissibility standard. |
| Quartz | Quartz is a rendering shell. It has no exposure governance capability. Quartz cannot enforce ZONE-2 without pre-filtering. |
| A separate computation layer | LENS does not compute new values. It projects existing vault outputs through the exposure governance filter. |
| An audience toggle on GAUGE | Audience separation must be enforced structurally, not by a toggle that could be bypassed. |

---

## SECTION 9 — EXECUTIVE SURFACE DEFINITION

The executive surface is the entry point for CEO/CTO/buyer audiences. It is the highest-density information surface — maximum signal per word, minimum technical vocabulary.

**Required content (ZONE-2 enforced):**
1. Assessment identity: client name, run basis, date
2. Proven score: `60/100` with one-sentence explanation ("the maximum provable from structural evidence")
3. Achievable score: `100/100` with one-sentence caveat ("requires runtime execution assessment")
4. Three-axis verdict: STRUCTURE · STRONG / COMPLEXITY · LOW / EXECUTION · UNKNOWN
5. Key risk signal: SIG-002 framing ("seven operational dimensions require runtime assessment")
6. Top 2–3 signal impacts: business_impact text from STRONG-confidence signals
7. Score confidence range: "proven floor: 60 / achievable ceiling: 100"

**Forbidden from executive surface:**
- DIM-XX codes
- axis names without plain-language mapping
- confidence status codes
- PSEE stage names (S-13, S-T3)
- signal.statement text
- CEU file names

**Relation to existing surfaces:**
- The executive surface IS overview.js after CONCEPT-06 is fixed
- It becomes the LENS v1 entry point
- It is NOT a new surface — it is a governed, gap-corrected version of the current executive page

---

## SECTION 10 — RECOMMENDED NEXT-BUILD SEQUENCE

| step | action | scope | prerequisite |
|------|--------|-------|-------------|
| 1 | Fix CONCEPT-06 predicate in concepts.json | 1-line change in `app/gauge-product/lib/business-ontology/concepts.json` | None |
| 2 | Validate overview.js renders EXECUTION=UNKNOWN on recomputed run | GAUGE test | Step 1 |
| 3 | Define GAUGE click-through behavior per zone (this stream) | Design doc | None |
| 4 | Implement click-through for score zone (first zone) | GAUGE code | GAUGE click-through model |
| 5 | Implement click-through for signal zone | GAUGE code | Step 4 |
| 6 | Add business_impact + risk rendering to SignalAvailability | GAUGE code | None (data already present) |
| 7 | Build LENS v1 as filtered static vault export | Builder extension | LENS v1 content model |
| 8 | Quartz deployment for operator/audit surface | Quartz config | None (can proceed independently) |
| 9 | Audit export package | Builder extension | LENS v1 |

**Authority:** PRODUCTIZE.LENS.SURFACE.01
