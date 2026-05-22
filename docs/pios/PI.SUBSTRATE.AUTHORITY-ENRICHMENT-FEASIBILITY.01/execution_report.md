# Execution Report — PI.SUBSTRATE.AUTHORITY-ENRICHMENT-FEASIBILITY.01

## Stream Classification: G2 — Architecture-Consuming

## Pre-flight

- Branch: `feature/PI.SUBSTRATE.AUTHORITY-ENRICHMENT-FEASIBILITY.01`
- Base: `main` @ 8d5ac03
- Inputs: NetBox canonical repo (896 Python files, excluding migrations)
- Dependencies: PI.SQO.SEMANTIC-GOVERNANCE-LOOP-VALIDATION.01 (merged — provides governance finding that AUTHORITY_TOPOLOGY is weakest class)
- §5.5: NOT required — feasibility assessment only, no new reusable primitives

## Scope

Bounded feasibility probe: can we extract inheritance/authority edges from NetBox's Python AST with enough fidelity to convert AUTHORITY_TOPOLOGY from formulaic DERIVED propositions into DIRECT_EVIDENCE-backed authority propositions?

## Primary Finding: PROCEED

AST-based authority extraction is **feasible, high-fidelity, and immediately actionable**.

## Evidence Summary

### Extraction Results

| Metric | Value |
|--------|-------|
| Files processed | 896 |
| Parse errors | 0 |
| Classes with inheritance | 4,561 |
| Authority inheritance edges | 1,494 |
| CEUs covered | 12 / 12 |
| Framework authority categories | 6 (MODEL, VIEW, FORM, SERIALIZER, FILTERSET, TABLE) |
| Multi-inheritance classes | 913 |
| Distinct mixin types | 20+ |

### Per-CEU Authority Edge Distribution

| CEU | Total Edges | Categories | Authority Pattern |
|-----|-------------|------------|-------------------|
| CEU-DCIM | 444 | 6 | FULL_STACK (VIEW-dominant: 303) |
| CEU-EXTRAS | 286 | 6 | FULL_STACK (VIEW-dominant: 126) |
| CEU-CIRCUITS | 136 | 6 | FULL_STACK (VIEW-dominant: 77) |
| CEU-NETBOX | 115 | 6 | FULL_STACK (MODEL-dominant: 49) |
| CEU-VPN | 105 | 6 | FULL_STACK (VIEW-dominant: 70) |
| CEU-VIRTUALIZATION | 82 | 6 | FULL_STACK (VIEW-dominant: 54) |
| CEU-USERS | 81 | 6 | FULL_STACK (VIEW-dominant: 41) |
| CEU-TENANCY | 70 | 6 | FULL_STACK (VIEW-dominant: 41) |
| CEU-CORE | 62 | 6 | FULL_STACK (VIEW-dominant: 28) |
| CEU-IPAM | 60 | 5 | MODEL-dominant (35, no VIEW) |
| CEU-WIRELESS | 28 | 4 | FULL_STACK (VIEW-dominant: 21) |
| CEU-UTILITIES | 25 | 3 | FORM-dominant (19, no VIEW) |

### Key Insights

**1. Categorized authority replaces raw counts.** The current AUTHORITY_TOPOLOGY propositions use a single metric: import-to-inheritance edge ratio from topology_report. AST extraction provides 6-dimensional authority categorization (MODEL, VIEW, FORM, SERIALIZER, FILTERSET, TABLE), enabling structurally richer propositions.

**2. Framework authority surfaces are Django-specific and extractable.** NetBox is a Django application with highly regular structure. Each CEU follows Django patterns (models → views → forms → serializers → filtersets → tables). This regularity makes AST extraction reliable.

**3. Authority carrier files are identifiable.** Top files: `dcim/views.py` (303 VIEW edges), `extras/views.py` (126), `circuits/views.py` (77). These are deterministic authority carriers — files whose structural role is to concentrate framework authority.

**4. Mixin propagation reveals cross-cutting authority.** 913 classes use multiple inheritance. Top mixins: OwnerMixin (87), ContactsMixin (50), GetRelatedModelsMixin (37). These create cross-CEU authority dependencies not visible in the import graph.

**5. Two CEUs lack current AUTHORITY_TOPOLOGY propositions.** CEU-EXTRAS (286 edges) and CEU-UTILITIES (25 edges) have authority edges but no current propositions — they were not included in SPE's authority topology derivation.

### Topology Report vs AST Extraction Comparison

| CEU | Topology Inheritance | AST Edges | Finding |
|-----|---------------------|-----------|---------|
| CEU-VPN | 2 | 105 | AST 52.5x richer |
| CEU-CIRCUITS | 10 | 136 | AST 13.6x richer |
| CEU-WIRELESS | 5 | 28 | AST 5.6x richer |
| CEU-VIRTUALIZATION | 18 | 82 | AST 4.6x richer |
| CEU-DCIM | 466 | 444 | Comparable |
| CEU-NETBOX | 1,727 | 115 | Topology richer* |

*CEU-NETBOX topology count includes transitive inheritance via `__init__.py` re-exports. AST extraction counts direct class declarations only, which is more precise for authority classification.

## Impact Assessment

### On AUTHORITY_TOPOLOGY (10 propositions, all DERIVED @ 0.704)

**Direct conversion possible.** AST extraction provides:
- Per-CEU framework authority composition (MODEL/VIEW/FORM/SERIALIZER/FILTERSET/TABLE counts)
- Authority carrier file identification
- Authority pattern classification (FULL_STACK, MODEL_DOMINANT, VIEW_DOMINANT)
- Mixin propagation topology

This replaces the current "import-to-inheritance ratio" derivation with categorized, structurally specific evidence. Propositions would shift from:
- "CEU-X exhibits dual structural authority: import-dominant (N inheritance, M import edges, Rx ratio)"
- → "CEU-X exhibits FULL_STACK framework authority: 51 MODEL, 303 VIEW, 34 FORM, 33 SERIALIZER, 18 FILTERSET, 5 TABLE — VIEW-dominant authority carrier at dcim/views.py (303 edges)"

Tier: DERIVED → DIRECT_EVIDENCE
Confidence: 0.704 uniform → variable per CEU (proportional to edge count and category coverage)

### On HERO_MOMENT_GROUNDING (6 propositions, all DERIVED/NOVEL @ 0.598)

**Partial impact.** Two hero moment propositions reference "dual authority topology" — the import vs inheritance graph divergence. Authority enrichment would:
- Confirm the dual-authority observation with categorized evidence
- Provide specific examples (CEU-DCIM VIEW-dominant vs CEU-IPAM MODEL-dominant)
- Enable reconciliation from NOVEL → ALIGNED for these propositions

The other 4 hero moment propositions (DCIM gravitational dominance, pipeline self-improvement, centrality patterns, coupling multipliers) are not affected — they derive from import-graph and centrality data, not inheritance.

### On CLUSTER_ARCHITECTURE (1 proposition, REJECTED)

**No direct impact.** Authority enrichment does not address cluster-level structural coverage. The singleton cluster proposition was rejected for insufficient class representation, not for lack of authority evidence.

## Recommendation: PROCEED

Build an authority enrichment pipeline that:
1. Runs the AST authority extractor on canonical_repo
2. Persists categorized authority edges as a structural artifact (`authority_edges.json`)
3. Feeds into SPE's AUTHORITY_TOPOLOGY deriver as DIRECT_EVIDENCE input
4. Produces per-CEU authority composition propositions at DIRECT_EVIDENCE tier

**Scope boundary:** This enrichment is NetBox-specific (Django framework patterns). The extractor should be parameterized for framework detection but should NOT attempt to be a general-purpose code graph engine. The probe script (`authority_probe.py`) is sufficient as a starting point — it extracts what's needed with zero complexity overhead.

**Not in scope:**
- Call graph extraction (not needed for authority topology)
- Symbol-level lineage (overkill for current proposition classes)
- SCIP integration (unnecessary for Python AST inheritance)
- General-purpose code graph engine

## Files Changed

| File | Action |
|------|--------|
| `clients/netbox/.../structural/authority_probe/authority_edge_extract.json` | Created — 1,494 authority edges, per-CEU summary |
| `clients/netbox/.../governance/learning_events.jsonl` | Modified — 2 LRNE events appended |
| `docs/pios/PI.SUBSTRATE.AUTHORITY-ENRICHMENT-FEASIBILITY.01/*` | Created — stream governance artifacts |

## Governance

- No data mutation beyond governed artifacts
- No computation on semantic propositions (assessment only)
- No S2 promotion
- No UI changes
- Feasibility finding persisted as learning lineage (LRNE events)
