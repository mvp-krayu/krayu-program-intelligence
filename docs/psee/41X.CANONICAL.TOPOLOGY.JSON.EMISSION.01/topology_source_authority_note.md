# Topology Source Authority Note
# 41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01 — Deliverable 3

## Identity

- Contract: 41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT IMPLEMENTATION — NO SEMANTIC REDESIGN

---

## Purpose

This document establishes why `scripts/pios/41.1/build_semantic_layer.py` is the authoritative source for canonical topology JSON emission, and records the exact structured data found within it. It also documents all source limitations encountered during emission.

---

## Source Authority Declaration

### SA-1 — Primary Source

```
scripts/pios/41.1/build_semantic_layer.py
```

**Script identity:**

| field | value |
|-------|-------|
| CONTRACT_ID | PIOS-41.1-RUN01-CONTRACT-v1 |
| RUN_REFERENCE | run_03_blueedge_derivation_validation |
| DATE | 2026-03-20 |
| CANONICAL_PATH | docs/pios/41.1 |
| Total lines | 1168 |
| ADDENDUM label | PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1 |

### Why This Source Is Authoritative

1. **Structured Python dicts**: DOMAINS, CAPABILITIES, and COMPONENTS are defined as Python list-of-dict structures — machine-readable without parsing prose.
2. **Complete enumeration**: All 17 domains, 42 capabilities, and 89 components are present with unique identifiers.
3. **Hierarchy is explicit**: Each CAPABILITY entry contains a `domain` field referencing the owning DOMAIN id. Each COMPONENT entry contains a `cap` field referencing the owning CAPABILITY id. The full 3-level hierarchy is derivable without inference.
4. **Grounding flags encoded**: The `weak` boolean field in CAPABILITIES and COMPONENTS encodes the WEAKLY_GROUNDED designation directly in source.
5. **Cross-domain encoding**: The `cross` field in COMPONENTS encodes cross-domain secondary references (e.g., COMP-25's `cross = "DOM-01"`).
6. **Governed script**: The script was produced under contract PIOS-41.1-RUN01-CONTRACT-v1 and references run_03_blueedge_derivation_validation as its execution run. It is the only machine-readable governed artifact encoding the full 41.1 semantic topology.

### Why Alternative Sources Were Not Used

| alternative | reason not used |
|-------------|----------------|
| `docs/pios/41.2/pie_vault/` (148 MD files) | Human-navigable prose; not machine-readable JSON; `build_pie_vault.py` is copy-only from build_semantic_layer.py output |
| `docs/pios/41.1/*.md` semantic artifacts | Markdown prose; not structured source; derived output of build_semantic_layer.py, not input |
| BlueEdge snapshot workspace | Not present in k-pi-core repository; external read-only reference only |

---

## Exact Structures Found in Source

### DOMAINS — Python dict structure (lines 39–57)

Fields per entry: `id`, `name`, `type`, `grounding`

```
Total: 17 entries
id range: DOMAIN-01 through DOMAIN-17
type values observed: FUNCTIONAL, OPERATIONAL, INFRASTRUCTURE
grounding values: DIRECT_EVIDENCE, WEAKLY_GROUNDED
```

**WEAKLY_GROUNDED domains:**

| id | name |
|----|------|
| DOMAIN-02 | Telemetry & Observability |
| DOMAIN-10 | Test & Quality Assurance |

### CAPABILITIES — Python dict structure (lines 60–103)

Fields per entry: `id`, `name`, `domain`, `type`, `weak`

```
Total: 42 entries
id range: CAP-01 through CAP-42
domain field: references DOMAIN-NN id string
type values observed: FUNCTIONAL, OPERATIONAL, INFRASTRUCTURE
weak values: True (WEAKLY_GROUNDED), False (default)
```

**WEAKLY_GROUNDED capabilities (`weak: True`):**

| id | name | domain |
|----|------|--------|
| CAP-04 | Device Telemetry Processing | DOMAIN-02 |
| CAP-06 | Metrics & Alerting | DOMAIN-02 |
| CAP-28 | Test Execution & Coverage | DOMAIN-10 |

**Fields absent in source:**

| field | status | action taken |
|-------|--------|--------------|
| confidence | NOT PRESENT in CAPABILITIES dict | emitted as null per SA-4 |
| source_ref | NOT PRESENT in CAPABILITIES dict | emitted as null per SA-4 |
| evidence_refs | NOT PRESENT | emitted as [] per SA-4 |

### COMPONENTS — Python dict structure (lines 106–196)

Fields per entry: `id`, `name`, `cap`, `weak`, `cross`

```
Total: 89 entries
id range: COMP-01 through COMP-89
cap field: references CAP-NN id string
weak values: True (WEAKLY_GROUNDED), False (default)
cross values: string (secondary domain reference) or None
```

**WEAKLY_GROUNDED components (`weak: True`):**

| id | name | cap |
|----|------|-----|
| COMP-77 | AnalyticsProxy | CAP-04 |
| COMP-82 | MetricsExporter | CAP-06 |
| COMP-84 | TestSuiteRunner | CAP-28 |
| COMP-85 | CoverageCollector | CAP-28 |

**Cross-domain components:**

| id | name | cross value |
|----|------|------------|
| COMP-25 | OtaModule | DOM-01 |

Note: The `cross` value "DOM-01" is the exact string encoded in source. It is preserved as `cross_domain_ref: "DOM-01"` in canonical_topology.json per SA-3 (emit exactly as encoded; do not reformat).

**Fields absent in source:**

| field | status | action taken |
|-------|--------|--------------|
| confidence | NOT PRESENT in COMPONENTS dict | emitted as null per SA-4 |
| source_ref | NOT PRESENT (line-number traceability absent) | emitted as null per SA-4 |
| evidence_refs | NOT PRESENT | emitted as [] per SA-4 |

### DIRECTIVES — Python dict structure (lines 199–210)

10 entries (SFD-01 through SFD-10). Not included in canonical topology JSON — directives govern script behavior, not topology structure.

---

## Source Limitations

### L1 — No confidence values in structured source

The DOMAINS, CAPABILITIES, and COMPONENTS Python dicts do not contain a `confidence` field. The 41.1 semantic construction under run_03_bluededge_derivation_validation encoded confidence as prose in MD artifacts. Those artifacts are derived outputs, not structured source. Per SA-4, `confidence: null` was emitted.

### L2 — No component-level source file references

The COMPONENTS dict does not encode the originating source files (e.g., app.module.ts line numbers). These references are present in the `docs/pios/41.1/semantic_traceability_map.md` artifact but that file is prose-formatted and not a structured source. Per SA-4, `source_ref: null` was emitted.

### L3 — No component-to-component relationship data

`component_component` edges require a relationship_map.md artifact (Stage 3 output). That artifact is absent from both the BlueEdge snapshot and k-pi-core repository (confirmed in BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01). Per SA-4, `component_component: []` was emitted.

### L4 — cross field uses "DOM-01" not "DOMAIN-01"

The `cross` field for COMP-25 is "DOM-01" in the Python source. This differs from the canonical DOMAIN-NN id format. Per SA-3, the value was preserved exactly as encoded without reformatting. Consumers should be aware of this encoding difference.

---

## Source Authority — Final Assessment

| criterion | assessment |
|-----------|-----------|
| Structured, machine-readable | YES — Python dicts |
| Complete enumeration | YES — 17/42/89 fully present |
| Hierarchy derivable without inference | YES — domain and cap fields explicit |
| Grounding flags present | YES — weak boolean field |
| Cross-domain encoding present | YES — cross field |
| Confidence values present | NO — limitation L1 |
| Source file references present | NO — limitation L2 |
| Component-component relationships present | NO — limitation L3 |
| Governed under contract | YES — PIOS-41.1-RUN01-CONTRACT-v1 |

**Source authority verdict: AUTHORITATIVE WITH DOCUMENTED LIMITATIONS**

`build_semantic_layer.py` is the sole authoritative machine-readable source for canonical topology emission. Three fields (confidence, source_ref, component_component) are absent from the structured source and are emitted as null/[] with this documentation as the authority note.
