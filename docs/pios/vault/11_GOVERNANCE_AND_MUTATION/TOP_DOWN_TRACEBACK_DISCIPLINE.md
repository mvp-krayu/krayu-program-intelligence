# Top-Down Traceback Discipline

> **Mandatory traceback protocol for validating executive projection claims against structural evidence.**

---

## 1. When Top-Down Traceback is Mandatory

Top-down traceback (starting from executive projection and walking backward through the chain to source evidence) is mandatory when:

| Situation | Why Mandatory |
|---|---|
| Debugging executive projection output | The projection is the final output — backward trace reveals where the chain breaks |
| Validating a new capability's integration | New capability must be traceable both forward and backward |
| Assessing architectural coherence | Top-down traceback reveals chain continuity or gaps |
| Any claim about "what LENS shows" | Every LENS output must trace to structural evidence |

## 2. The Traceback Protocol

For any executive projection claim, the traceback must cover all 7 layers:

```
Layer 1: LENS executive projection (what is rendered)
Layer 2: Zone derive function (what computes the rendered value)
Layer 3: GenericSemanticPayloadResolver (what loads and normalizes the data)
Layer 4: SemanticActorHydrator (what classifies grounding per domain)
Layer 5: semantic_topology_model + crosswalk + reconciliation
Layer 6: Binding envelope + canonical topology (structural proof)
Layer 7: Upstream evidence artifacts (what the claim rests on)
```

If ANY layer in the chain is missing documentation, the traceback is incomplete and must be flagged.

## 3. The Anti-Shortcut Rule

**Do NOT assume intermediate layers.**

The crosswalk/reconciliation gap arose because the chain was assumed to be:

```
structure → semantic topology → LENS
```

The actual chain is:

```
structure ──┐
            ├── crosswalk bridge ──→ reconciliation ──→ hydrator ──→ LENS
semantic ───┘
```

Skipping the crosswalk/reconciliation layers produced incorrect architectural understanding. The anti-shortcut rule: trace every link. Do not assume adjacency.

## 4. Traceback Verification Checklist

For each layer, verify:

| Layer | Verify |
|---|---|
| 1. LENS projection | Output matches what the zone derive function produces |
| 2. Zone derive | Function reads from resolved payload correctly |
| 3. Payload resolver | GenericSemanticPayloadResolver normalizes fullReport as expected |
| 4. Hydrator | SemanticActorHydrator computes grounding ratio from lineage_status |
| 5. Topology + crosswalk | semantic_topology_model matches 17 domains; crosswalk v2.0 maps DOM→DOMAIN; reconciliation compiler produces graduated confidence |
| 6. Binding + canonical | binding_envelope.json links CEU→DOM→nodes; canonical_topology.json contains structural proof |
| 7. Evidence | Source artifacts exist, SHA-256 verified |

## 5. Common Traceback Failure Modes

| Failure | Cause | Detection |
|---|---|---|
| Layer skipping | Assumed adjacency between non-adjacent layers | Traceback protocol catches missing layers |
| Stale vault assumption | Vault page says "NOT IMPLEMENTED" for implemented capability | Pre-investigation test catches this |
| Grounding confusion | 41.1 grounding (15/17) confused with reconciliation grounding (4/17) | Traceback distinguishes evidence-boundary vs crosswalk questions |
| DOM-09 assumption | Assumed DOM-09 maps cleanly to one semantic domain | Crosswalk v2.0 shows IRRESOLVABLE status |

## Cross-References

- [[../00_START_HERE/OPERATIONAL_ONTOLOGY]] — LENS traceback section (§6)
- [[../03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION]] — crosswalk and reconciliation detail
- [[ANTI_REDISCOVERY_DISCIPLINE]] — when forensics is allowed vs loading vault
- [[ONTOLOGY_DRIFT_DETECTION]] — detecting runtime/vault divergence

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.VAULT.OPERATIONAL-ONTOLOGY-CANONICALIZATION.01 |
| Creation commit | PENDING (this stream) |
| Derived from | PI.CANONICALIZATION.END-TO-END-LOCK.01 (FUTURE_GOVERNANCE_DISCIPLINE.md §3 — traceback discipline) |
| Last verified | 2026-05-17 |
