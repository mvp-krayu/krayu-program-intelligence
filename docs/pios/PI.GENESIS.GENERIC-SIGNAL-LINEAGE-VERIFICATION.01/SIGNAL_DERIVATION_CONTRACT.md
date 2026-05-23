# Signal Derivation Contract

> **Formal contract defining which artifact feeds which signal family, at which abstraction level, with which thresholds.**
> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01
> **Classification:** G1 — architectural contract

---

## 1. Scope

This contract governs the derivation of all xxSIG signal families within the Program Intelligence pipeline. It defines:
- What each signal family reads as input
- What it produces as output
- What thresholds govern activation
- What is NOT permitted

---

## 2. Signal Derivation Rules

### Rule SD-01: Single Source of Truth

Each signal family MUST derive from exactly ONE primary artifact. Multiple auxiliary inputs are permitted, but the primary structural input is singular and canonical.

| Family | Primary Artifact | Auxiliary Inputs |
|--------|-----------------|------------------|
| PSIG | binding/binding_envelope.json | None |
| DPSIG | structure/40.4/canonical_topology.json | None (binding_envelope reserved for future classes) |
| BSIG | binding/binding_envelope.json | structure/40.2/structural_node_inventory.json (for coverage denominator) |
| ISIG | structure/40.3s/code_graph.json | None |
| CSIG | structure/40.3c/structural_centrality.json | None |
| ESIG | binding/binding_envelope.json (pre vs post enrichment delta) | structure/40.3s/code_graph.json (enrichment source identity) |

### Rule SD-02: Deterministic Computation

All signal values MUST be deterministically reproducible from the primary artifact. Same input → same output. No stochastic behavior, no randomness, no external state.

### Rule SD-03: Threshold Ownership

Signal thresholds are owned by the signal family's computation script. Thresholds are script-constants, not configuration. Changing a threshold requires a SCRIPT_VERSION increment and a new stream contract.

| Family | Threshold | Value | Owner Script |
|--------|-----------|-------|-------------|
| PSIG-001/002/004 | Activation threshold | 2.0 | compute_condition_correlation.py |
| PSIG-006 | Isolation threshold | > 0 (binary) | compute_condition_correlation.py |
| DPSIG-031 CPI HIGH | Cluster pressure | 5.0 | derive_relational_signals.py |
| DPSIG-031 CPI ELEVATED | Cluster pressure | 2.0 | derive_relational_signals.py |
| DPSIG-032 CFA DOMINANT | Cluster dominance | 0.60 | derive_relational_signals.py |
| DPSIG-032 CFA ASYMMETRIC | Cluster asymmetry | 0.35 | derive_relational_signals.py |

### Rule SD-04: No Cross-Family Dependency

Signal families MUST NOT consume outputs of other signal families as input. PSIG does not read DPSIG. DPSIG does not read PSIG. Each family derives independently from structural artifacts.

**Exception:** Pressure zones consume PSIG conditions — but pressure zones are a PSIG-internal concept (computed by `compute_pressure_zones.py`), not a separate signal family.

### Rule SD-05: Enrichment is Additive

When 40.3s enrichment adds IMPORTS_ACROSS edges to the binding envelope, this is ADDITIVE enrichment — it adds edges to the existing topology. Enrichment MUST NOT:
- Remove existing edges
- Modify existing node attributes that affect signal computation
- Change the binding's node/edge schema
- Make PSIG computation dependent on enrichment presence (absent enrichment → fewer edges, not failure)

### Rule SD-06: Level 1 / Level 2 Separation

Level 1 (file-level) and Level 2 (binding topology) signal values are NOT equivalent even when they measure related phenomena. A specimen's PSIG values will differ depending on whether Level 1 enrichment is present. This is expected behavior, not a bug.

### Rule SD-07: Module-Specific Availability

Software Module families (ISIG, CSIG, ESIG) MUST degrade gracefully when their source artifacts are absent. PATH B specimens have no 40.3s or 40.3c — the signal computation must return null/absent, not fail.

### Rule SD-08: Signal Authority Ceiling

All computed signal values carry authority ceiling: **PROVISIONAL_CKR_CANDIDATE**. Signal values are structural measurements, not executive recommendations. They describe what IS, not what should be done. Interpretive projection of signal meaning is governed by 75.x authority.

---

## 3. Output Contracts

### PSIG Output (Phase 6+7)

```
75.x/condition_correlation_state.json:
  - nodes[]: per-node conditions with ratio, status (HIGH/NORMAL/ACTIVATED/NOT)
  - entity_activation_count per node
  - PSIG attribution (primary/secondary roles)

75.x/pressure_candidate_state.json:
  - candidates[]: entities with activation_count >= 2
  - signal_value = max(ratio) across activated conditions

75.x/pressure_zone_state.json:
  - zones[]: zone_id, zone_type (DOMAIN_ZONE/ENTITY_ZONE), zone_class
  - member_entities, aggregated_conditions, condition_count

41.x/signal_projection.json:
  - active_conditions_in_scope[]: full attribution chain per condition
  - combination_signature, activation model
  - signal authority: PROVISIONAL_CKR_CANDIDATE

41.x/pressure_zone_projection.json:
  - zone_projection[]: projected zones with attribution profiles
```

### DPSIG Output

```
artifacts/dpsig/<client>/<run>/dpsig_signal_set.json:
  - signal_entries[]: per-signal with derivation_trace, topology_dependencies
  - normalization_basis: cluster metrics
  - derivation_context: input artifact hashes
```

### Vault Signal Registry (Phase 8a)

```
vault/signal_registry.json:
  - signals[]: signal_id, label, population_type, value, activation_state
  - Source traceability: binding_envelope.json → signal_id → signal_projection.json
  - GR-01 guardrail annotations
```

---

## 4. Prohibitions

### PR-01: No Synthetic Signal Fabrication
Signal values MUST NOT be fabricated, interpolated, or estimated. If the source artifact is absent, the signal is absent.

### PR-02: No Cross-Specimen Signal Comparison Without Population Reference
Signal values are run-relative. PSIG-001=5.663 in one specimen and PSIG-001=4.0 in another does NOT mean the first has more coupling. Different populations produce different baselines.

### PR-03: No Signal Value as Recommendation
Signal values describe structural state. They MUST NOT be projected as action recommendations ("reduce coupling") without explicit 75.x interpretive authority.

### PR-04: No Shortcut Normalization
Pre-computed conformance artifacts (SIGNAL_SHORTCUT_RETAINED) and generic corridor computations produce different values from different evidence sources. They MUST NOT be treated as equivalent baselines. A transition from shortcut to generic requires explicit baseline establishment.

---

## 5. Future Evolution

New signal families MUST:
1. Be registered in [[SIGNAL_FAMILY_TAXONOMY]]
2. Declare their primary artifact (Rule SD-01)
3. Declare their derivation level (Level 1, Level 2, or topology-level)
4. Declare their module classification (generic GENESIS or software module)
5. Declare their thresholds (Rule SD-03)
6. Pass a determinism test (same input → same output)
7. Not violate any existing prohibition

New DPSIG classes (1-3, 5-8) are pre-authorized by the existing `derive_relational_signals.py` class architecture but MUST still meet all 7 requirements above when implemented.
