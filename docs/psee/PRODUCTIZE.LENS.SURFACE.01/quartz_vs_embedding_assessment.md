# Quartz vs Embedding Assessment
# PRODUCTIZE.LENS.SURFACE.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.SURFACE.01
- Date: 2026-04-15

---

## SECTION 1 — EVALUATION CRITERIA

Every pattern is evaluated against four constraints derived from the locked baseline:

| criterion | definition | fail condition |
|-----------|-----------|----------------|
| **C1 — Evidence-first integrity** | Content surfaced must trace to a verified vault artifact | Pattern allows unverified or invented content |
| **C2 — Exposure governance correctness** | ZONE-1 and ZONE-2 content must not appear on the same unfiltered surface | Pattern cannot enforce zone separation |
| **C3 — Client readability** | The client-facing output must be intelligible without PSEE knowledge | Pattern requires technical context to interpret |
| **C4 — Implementation realism** | The pattern must be buildable without redesigning the pipeline, vault, or GAUGE runtime | Pattern requires unauthorized scope changes |

---

## SECTION 2 — PATTERN A: EXTERNAL QUARTZ PUBLICATION

**Definition:** Deploy the vault (or a subset of it) as a Quartz static site. GAUGE links out to Quartz URLs for drill-down. Clients receive a Quartz URL for vault access.

### Quartz Strengths

| strength | evidence basis |
|----------|---------------|
| Renders Obsidian wikilinks natively | The generated vault uses standard Obsidian wikilink syntax — compatible out of the box |
| Built-in graph visualization | Provides an interactive node graph over vault structure without additional tooling |
| Static output — zero runtime dependencies | Deployable to any CDN; no database or server required |
| CI/CD compatible | Vault builder (PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01) produces input directly consumable by Quartz |
| No GAUGE code changes | Can be deployed independently; GAUGE links out rather than embedding |
| Handles multi-client vaults | Each client's `clients/<client>/vaults/<run_id>/` directory can be a separate Quartz site |

### Quartz Hard Limitations

| limitation | why it is hard | consequence |
|-----------|---------------|-------------|
| **No exposure zone filtering** | Quartz publishes all files in its input directory without distinction | Deploying the full vault to clients exposes ZONE-1 content (DIM-XX values, axis names, confidence_rationale) to ZONE-2 audiences |
| **Cannot enforce audience separation** | Quartz has no authentication or role-based rendering | Cannot give the same Quartz URL to both operators (ZONE-1) and clients (ZONE-2) |
| **Governance does not live in Quartz** | Quartz is a renderer, not a governance layer | Quartz itself cannot determine whether a given vault node is ZONE-2 admissible |
| **Requires pre-filtering for client use** | To safely use Quartz as a client surface, a pre-processing step must select only ZONE-2 nodes | This is not a Quartz feature — it must be built separately |
| **No live GAUGE data** | Quartz serves static files — it cannot fetch `/api/gauge` at render time | Score, signals, and topology data are only as fresh as the last vault build |
| **No click-back to GAUGE** | Static site cannot trigger GAUGE interactions | Cannot implement the click-through interaction model within Quartz |

### Pattern A Assessment

| criterion | result | notes |
|-----------|--------|-------|
| C1 — Evidence integrity | **PASS** | Content derives from vault nodes which trace to artifacts |
| C2 — Exposure governance | **FAIL** | Quartz cannot enforce ZONE-2 without external pre-filtering; unfiltered vault deployment is a governance violation |
| C3 — Client readability | CONDITIONAL | If pre-filtered to ZONE-2 nodes only, client-readable; without filtering, ZONE-1 technical content reaches clients |
| C4 — Implementation realism | **PASS** | Vault builder already produces compatible input; Quartz deployment is low-friction |

**Overall: FAIL for client-facing use. PASS for operator/audit internal use.**

---

## SECTION 3 — PATTERN B: EMBEDDED CONTENT INSIDE GAUGE

**Definition:** GAUGE panels link to or embed vault-derived content inline — claim explanation panels, artifact detail overlays, signal narratives — without leaving the GAUGE page.

### Embedding Strengths

| strength | evidence basis |
|----------|---------------|
| Enforces zone separation at serving time | GAUGE can determine whether the current user is an operator (serve ZONE-1) or client (serve ZONE-2) before rendering embedded content |
| Single interaction surface | No context switch; click drill-down stays within GAUGE |
| Live data + static evidence | GAUGE API data is live; vault content (transformation explanations, claims) is static — they compose naturally |
| No separate deployment | No external URL to manage; vault content served from same GAUGE process |
| Enables business_impact rendering | The signal `business_impact` and `risk` fields (currently not rendered — identified V2 gap) can be embedded in the existing SignalAvailability panel with minimal change |

### Embedding Hard Limitations

| limitation | why it is hard | consequence |
|-----------|---------------|-------------|
| **Requires GAUGE code changes** | Embedding panels require new components in `app/gauge-product/` | This is out of scope for the current design stream; becomes a required next-build item |
| **Vault content must be queryable by node ID** | GAUGE needs to fetch a specific claim node (e.g., CLM-09) by ID | Requires either a vault API or a pre-built index of node content |
| **No standalone client URL** | An embedded panel inside GAUGE is not a shareable link | Cannot send a client "here is the evidence for this score" as a standalone URL |
| **No graph visualization** | GAUGE has no built-in force-graph or wikilink graph; Quartz provides this natively | Embedded content loses the graph visualization benefit of Quartz |
| **Scope expansion risk** | "Just embed one claim panel" tends to expand into a full embedded vault renderer | Must be scoped strictly to avoid unauthorized architecture changes |

### Pattern B Assessment

| criterion | result | notes |
|-----------|--------|-------|
| C1 — Evidence integrity | **PASS** | Embedded content comes from vault nodes |
| C2 — Exposure governance | **PASS** | Zone filter is applied server-side before rendering to client |
| C3 — Client readability | **PASS** | Only ZONE-2 content reaches client view |
| C4 — Implementation realism | CONDITIONAL | Requires GAUGE code changes (out of current scope); medium complexity |

**Overall: PASS for all criteria; blocked by scope until next stream authorizes GAUGE code changes.**

---

## SECTION 4 — PATTERN C: API-BACKED VAULT PROJECTION

**Definition:** A standalone vault API service that accepts `{node_id, zone}` requests and returns rendered markdown content. GAUGE calls this API to populate click-through panels. A separate client-facing URL serves filtered ZONE-2 content from the same API.

### API-Backed Projection Strengths

| strength | evidence basis |
|----------|---------------|
| Cleanest zone enforcement | Zone is a first-class parameter; server determines what content to return per zone |
| Separates rendering from governance | Governance lives in the API, not in GAUGE or Quartz |
| Enables multiple consumers | GAUGE, LENS, audit export, Quartz all consume from the same vault API |
| Shareable LENS URLs | `/lens/<client>/<run_id>/claims/CLM-09` returns a ZONE-2 rendered node — a shareable client URL |
| Multi-client support | API handles `?client=blueedge&run=run_01` parameters naturally |

### API-Backed Projection Hard Limitations

| limitation | why it is hard | consequence |
|-----------|---------------|-------------|
| **Requires building a new service** | No vault API exists; must be built from scratch | Highest implementation complexity of the three patterns |
| **Requires deployment infrastructure** | Not a static deployment; requires a running server process | More ops surface than Quartz |
| **Overkill for v1** | For a single client with a single run, a static filtered build is simpler and sufficient | This pattern is the right long-term architecture but premature for LENS v1 |

### Pattern C Assessment

| criterion | result | notes |
|-----------|--------|-------|
| C1 — Evidence integrity | **PASS** | Content derives from vault nodes |
| C2 — Exposure governance | **PASS** | Zone filter is API-level |
| C3 — Client readability | **PASS** | Zone-2 endpoint serves only filtered content |
| C4 — Implementation realism | CONDITIONAL | High complexity; premature for v1 |

**Overall: PASS on governance; deferred to v2 for implementation.**

---

## SECTION 5 — GOVERNANCE IMPLICATIONS

**Quartz alone cannot perform governance.** This is the hard architectural boundary:

- Governance lives in the vault's exposure classification per node (frontmatter: `exposure: ZONE-2`, `lens_admissible: YES`)
- A system that enforces governance must read this classification and act on it
- Quartz renders markdown → HTML without reading or enforcing frontmatter classification
- Therefore: Quartz can serve as the rendering shell ONLY if a pre-filtering step (not Quartz) has already removed non-ZONE-2 nodes from its input

**Correct governance flow for Quartz LENS use:**
```
Vault (all nodes + zone classifications)
  → vault builder filtered export (ZONE-2 nodes only)
  → Quartz renders filtered subset
  → client receives only ZONE-2 content
```

The vault builder (PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01) can be extended with a `--zone-filter ZONE-2` flag that outputs only ZONE-2 nodes. This makes Quartz safe for client use — but it is the filter, not Quartz, that provides governance.

---

## SECTION 6 — DECISION TABLE

| pattern | C1 integrity | C2 governance | C3 readability | C4 realism | client-safe now? | operator-safe now? |
|---------|-------------|--------------|----------------|-----------|------------------|--------------------|
| A: Quartz (unfiltered) | PASS | **FAIL** | FAIL | PASS | NO | YES |
| A: Quartz (pre-filtered) | PASS | PASS | PASS | PASS | YES (with filter step) | YES |
| B: GAUGE embed | PASS | PASS | PASS | CONDITIONAL | NO (needs GAUGE code) | YES (with code) |
| C: Vault API | PASS | PASS | PASS | CONDITIONAL | YES (with new service) | YES |

---

## SECTION 7 — FINAL RECOMMENDATION

### Quartz: ADOPT AS INTERIM OPERATOR/AUDIT SURFACE

**Decision:** Adopt now for ZONE-1 (operator) and ZONE-3 (audit) internal use. Do NOT deploy unfiltered vault to clients.

**Rationale:**
1. The vault builder already produces Quartz-compatible input
2. Quartz provides graph visualization with zero additional tooling
3. For internal operator use, zone filtering is not required — operators can see all content
4. For client use, Quartz requires the vault builder's `--zone-filter ZONE-2` extension before deployment is safe

**What Quartz is NOT:** It is not a governance layer. It is not LENS. It is a rendering shell.

**What must be built before Quartz can serve clients:** A `--zone-filter ZONE-2` flag in the vault builder that outputs only frontmatter-classified ZONE-2 nodes.

---

### Embedding: ADOPT FOR GAUGE CLICK-THROUGH (next stream)

**Decision:** Pattern B (embedded content inside GAUGE) is the correct pattern for GAUGE click-through behavior. Prioritize for next stream that authorizes GAUGE code changes.

**v1 minimal implementation:** Vault-generated ZONE-1 claim fragments served as static files, fetched by GAUGE client-side on click. No new server required. Requires a claim fragment static export from the vault builder.

---

### API-Backed Projection: DEFERRED TO V2

**Decision:** Pattern C is the correct long-term architecture for multi-client, multi-run LENS deployment. Not for v1.

**Condition for activation:** When: (a) multiple clients exist, OR (b) LENS URLs must be shareable per claim. Until then, static filtered export is sufficient.

---

**Summary sentence:** Quartz is adopted as an operator shell; GAUGE embedding is the click-through path; API-backed projection is the V2 target. None of these three patterns requires or replaces vault governance — governance lives in the vault's frontmatter classification and the builder's filter logic.

**Authority:** PRODUCTIZE.LENS.SURFACE.01
