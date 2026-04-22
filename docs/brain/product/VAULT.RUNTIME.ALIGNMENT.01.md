# VAULT.RUNTIME.ALIGNMENT.01
# Product Brain Node — Vault ↔ Runtime Alignment Contract

- Stream: PRODUCTIZE.GAUGE.VAULT.RUNTIME.ALIGNMENT.01
- Authority: brain/product
- Status: DEFINED — NOT IMPLEMENTED
- Date: 2026-04-22

---

## PURPOSE

This node defines the alignment contract between the Tier-2 runtime layer (query engine + workspace) and Evidence Vault V3 (Obsidian-based structured evidence graph).

The contract ensures a single evidence truth across all surfaces. Neither layer owns truth — the canonical JSON files do.

---

## A. ENTITY MAPPING

| Runtime Object | Vault Node Type | Vault Pattern | Notes |
|---|---|---|---|
| zone (ZONE-NN) | No direct vault node | Derived from entity + gauge state | Zone is a derived diagnostic construct |
| domain (DOMAIN-XX) | Entity node | Entity Topology Nodes.md | Bidirectional read |
| capability (CAP-XX) | Entity node | Entity Structural Units.md | Bidirectional read |
| component | Entity node | Entity Structural Units.md | Bidirectional read |
| signal (SIG-XX) | Entity node | Entity Signals.md | Bidirectional read |
| evidence_basis (artifact refs) | Artifact node (ART-01..ART-07) | ART-04, ART-05 primarily | Runtime → vault read |
| WHY result | Claim nodes (CLM-XX) — partially | CLM-09, domain-level claims | Assembled at runtime; traceable to vault |
| EVIDENCE result | Artifact + entity nodes | ART-04, ART-05 | Runtime → vault read |

Zone nodes do not exist in the vault. Zones are derived constructs computed at query time from canonical_topology.json + gauge_state.json. The vault contains the source evidence from which zones are derived.

---

## B. EVIDENCE MODEL ALIGNMENT

| Runtime Source | Vault Node | Direction |
|---|---|---|
| signal_registry.json | ART-05 + Entity Signals | Projection — vault reflects canonical JSON |
| canonical_topology.json | ART-04 + Entity Topology Nodes | Projection — vault reflects canonical JSON |
| gauge_state.json | ART-01 + CLM-09 + related claims | Projection — vault reflects canonical JSON |

**Authority hierarchy (immutable):**
1. Canonical JSON files — AUTHORITATIVE (single source of truth)
2. Evidence Vault V3 — READ-ONLY projection organized over canonical JSON
3. Tier-2 Runtime — deterministic derivation over canonical JSON

The vault does not own truth. The vault organizes and proves truth for human navigation and audit.

---

## C. QUERY ↔ VAULT RELATION

### WHY mode
- Results assembled dynamically from canonical_topology.json + gauge_state.json
- Do NOT correspond to pre-existing claim nodes — assembled at query time
- Traceable to vault claims by field path: CLM-09 (score), domain-level scoring claims
- Status: RUNTIME-DERIVED, VAULT-TRACEABLE

### EVIDENCE mode
- signal_coverage entries correspond to Entity Signals nodes in vault
- trace_links reference evidence chains in ART-04/ART-05 nodes
- missing_evidence entries correspond to gaps — NOT represented as vault nodes
- Gaps are negative space, expressed only in EVIDENCE responses

### TRACE mode (future — deferred)
- Propagation paths would correspond to transformation nodes (TRN-01..TRN-06)
- Each TRN node = one step in the trace graph
- No vault mapping required until TRACE is implemented

---

## D. NAVIGATION LINK MODEL

**Entry points by runtime object:**

| Runtime Object | Vault Entry Point |
|---|---|
| zone | Entity Topology Nodes.md (zone's primary domain) |
| signal | Entity Signals.md → ART-05 |
| evidence_basis | ART-04 or ART-05 depending on artifact type |

**Link format:** ABSTRACT IDENTIFIERS resolved at navigation time.
- Runtime stores IDs (DOMAIN-XX, SIG-XX, ART-XX)
- Resolved to vault file paths via lookup at link time
- No hardcoded vault file paths in runtime code

---

## E. VAULT ROLE DEFINITION

**Vault is a PROJECTION LAYER — read-only.**

Rules:
- Vault does not define canonical values
- Vault does not compute scores, counts, or derivations
- Vault does not store zone constructs
- Vault organizes and proves values that exist in canonical JSON
- No logic is duplicated between vault and runtime
- Divergence cannot occur if both derive deterministically from same canonical JSON

---

## F. GOVERNANCE RULES

1. No runtime value without evidence origin — every WHY rationale factor traces to a canonical JSON field
2. No vault node without canonical source — every vault claim has a source_trace in canonical JSON
3. No divergence — vault and runtime derive from same inputs; same values guaranteed by determinism
4. All mappings deterministic — zone_id → domain → entity node mapping fixed by canonical_topology.json
5. Vault is CREATE-ONLY per run — nodes written once, never mutated
6. Runtime reads canonical JSON directly — does not read vault files at runtime
7. Vault is for human navigation and audit, not runtime computation

---

## G. FUTURE EXTENSIONS (NO IMPLEMENTATION)

**"Open in Evidence Vault":**
- Runtime ID → vault file path lookup table
- Entry: zone → domain entity node, signal → ART-05 + entity signal, evidence → ART-04/ART-05
- Requires: navigation helper resolving IDs to vault wikilinks or file paths

**Vault-driven investigation navigation:**
- Start from CLM-XX claim → find all zones that depend on that claim
- Requires: zone-to-claim dependency map
- Enabled when: TRACE mode implemented

**Vault as Tier-2 audit layer:**
- WHY result fields audited against vault source_trace for corresponding claim
- EVIDENCE result validated against ART-04 and ART-05 node content
- Requires: "Open in Evidence Vault" implemented first

---

## IMPLEMENTATION STATUS

| Component | Status |
|---|---|
| Alignment contract definition | DEFINED |
| Entity mapping | DEFINED |
| Evidence model alignment | DEFINED |
| Navigation link model | DEFINED |
| "Open in Evidence Vault" | NOT IMPLEMENTED |
| Vault-driven navigation | NOT IMPLEMENTED |
| Vault audit layer | NOT IMPLEMENTED |

---

## UPSTREAM AUTHORITY

- TIER2.RUNTIME.QUERY.ENGINE.01 — query engine definition
- TIER2.WORKSPACE.MODEL.01 — workspace model
- PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01 — vault builder spec
- PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01 — vault V2 architecture
- docs/brain/canonical/vault_runtime_alignment.md — canonical truth
