# Marketplace Architecture — Domain Cognition Module Pattern

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26

---

## 1. Marketplace is NOT Plugins

Marketplace is domain cognition modules attached to the PI Spine. Each module interprets PI cognition primitives through domain-specific operational semantics.

Plugins extend a platform with additional features. Domain cognition modules are fundamentally different: they provide the operational meaning that makes structural intelligence actionable in a specific domain. Without a domain module, PI Core produces structurally correct but operationally abstract intelligence. With a domain module, the same intelligence becomes domain-specific operational cognition.

The distinction matters because:
- **Plugins are optional.** The platform works without them. Domain cognition modules are NOT optional — without one, PI Core intelligence lacks operational meaning.
- **Plugins are additive.** They add features on top of a complete product. Domain cognition modules are NOT additive — they TRANSFORM existing features by permeating all strata with domain-specific semantics.
- **Plugins are isolated.** They operate in their own scope. Domain cognition modules PERMEATE — they are present in evidence interpretation, derivation, projection, persona rendering, and governance.

---

## 2. The Domain Cognition Module Pattern

Every domain cognition module follows the same architecture:

```
┌────────────────────────────────────────────────────────────┐
│                    PI CORE (~90%+)                         │
│                                                            │
│  Topology · Centrality · Signals · Pressure · SQO ·       │
│  Governance · Replay · Chronicle · Enrichment · Personas   │
│                                                            │
│  (domain-agnostic cognition primitives)                    │
└───────────────────────┬────────────────────────────────────┘
                        │ corridor reads
                ┌───────▼───────────────┐
                │  DOMAIN COGNITION     │
                │  MODULE (~9%)         │
                │                       │
                │  role_abstractions    │
                │  pressure_types       │
                │  execution_corridors  │
                │  operational_vocab    │
                │  attention_routing    │
                │                       │
                │  (domain-specific     │
                │   operational meaning)│
                └───────┬───────────────┘
                        │ projection produces
                ┌───────▼───────────────┐
                │  LENS PERSONA         │
                │  SURFACES             │
                │                       │
                │  (executive cognition │
                │   with domain-        │
                │   specific language)  │
                └───────────────────────┘
```

### Module Pattern Contract

Every domain cognition module MUST:

1. **Read PI Core corridor outputs.** The module consumes structural topology, centrality, signals, pressure, governance lifecycle, and enrichment intelligence. It never writes to PI Core artifacts.

2. **Produce domain-specific projection objects.** The module outputs a governed artifact (`<module_id>_module.json`) containing role abstractions, pressure interpretations, execution corridors, and operational vocabulary.

3. **Maintain bidirectional structural trace.** Every domain-specific abstraction traces to a PI Core structural entity. No orphaned abstractions.

4. **Permeate all strata.** The module provides domain-specific interpretation at every level: evidence (role seeds), derivation (pressure types), projection (domain objects), persona (operational language), governance (qualification semantics).

5. **Respect authority ceiling.** Module outputs inherit the authority ceiling of their PI Core inputs. No domain module can elevate authority beyond what PI Core evidence supports.

6. **Be replaceable.** Swapping the domain module changes the operational vocabulary without changing PI Core computation. The same PI Core output, interpreted through Infrastructure Intelligence instead of Software Intelligence, produces infrastructure-domain operational cognition.

---

## 3. Software Intelligence as First Module

Software Intelligence is the FIRST domain cognition module. It is the proof specimen for the pattern.

| Pattern Element | Software Intelligence Implementation |
|---|---|
| Domain | Software systems — codebases, repositories, deployment infrastructure |
| Evidence source | GitHub repositories, source archives, code-graph analysis |
| Role abstractions | Structural roles → software operational roles (orchestration hub, API boundary, data authority) |
| Pressure types | Deployment fragility, orchestration overload, integration saturation, test authority gap |
| Execution corridors | Delivery corridors, orchestration corridors, runtime dependency spines |
| Operational vocabulary | Backend, frontend, API, deployment, release, coordination, orchestration |
| Qualification semantics | Deployment readiness, operational maturity, governance enforcement density |

### What Makes Software Intelligence Canonical

Software Intelligence is not just "the first module." It establishes constitutional precedent:

1. **Cognition function taxonomy.** The 10 cognition functions (CF-01 through CF-10) define the pattern for how any domain module transforms PI Core primitives into operational meaning.

2. **Artifact contract.** The `software_intelligence_module.json` schema establishes the output contract pattern that all future modules follow.

3. **Corridor integration.** The SOFTWARE_INTELLIGENCE corridor evaluation pattern (artifact exists + trace complete + no orphans) establishes the activation model for all future domain corridors.

4. **Permeation model.** The 5-stratum permeation (evidence → derivation → projection → persona → governance) is the template for all future modules.

---

## 4. Future Domain Cognition Modules

Each module follows the same PI Core + domain interpretation architecture. The PI Core computation is identical — only the domain interpretation layer changes.

### Infrastructure Intelligence

**Domain:** Cloud infrastructure, network topology, deployment environments
**Role abstractions:** Compute spine, network boundary, storage authority, orchestration plane
**Pressure types:** Capacity saturation, failover fragility, network coupling, configuration drift
**Operational vocabulary:** Availability zone, load balancer, service mesh, container orchestration

### Cyber Intelligence

**Domain:** Security posture, threat surface, compliance governance
**Role abstractions:** Attack surface boundary, trust anchor, credential authority, audit corridor
**Pressure types:** Exposure concentration, authentication bottleneck, privilege escalation path, compliance gap
**Operational vocabulary:** Threat vector, security boundary, zero-trust zone, audit trail

### Regulatory Intelligence

**Domain:** Compliance frameworks, regulatory requirements, audit governance
**Role abstractions:** Compliance domain, control boundary, audit authority, evidence anchor
**Pressure types:** Control gap concentration, audit exposure, regulatory drift, evidence insufficiency
**Operational vocabulary:** Control objective, compliance framework, evidence package, audit finding

### Supply Chain Intelligence

**Domain:** Software supply chain, dependency governance, vendor risk
**Role abstractions:** Dependency authority, vendor boundary, license domain, update corridor
**Pressure types:** Dependency concentration, vendor lock-in, license conflict, update propagation risk
**Operational vocabulary:** Dependency tree, vendor assessment, license compliance, supply chain integrity

### Clinical Intelligence

**Domain:** Healthcare systems, clinical workflows, patient data governance
**Role abstractions:** Clinical domain, data authority, workflow corridor, compliance boundary
**Pressure types:** Clinical data concentration, workflow bottleneck, compliance gap, interoperability barrier
**Operational vocabulary:** Clinical pathway, data governance, HIPAA boundary, interoperability layer

### Financial Systems Intelligence

**Domain:** Financial technology, transaction processing, regulatory compliance
**Role abstractions:** Transaction authority, settlement corridor, compliance domain, risk boundary
**Pressure types:** Transaction concentration, settlement bottleneck, regulatory exposure, systemic coupling
**Operational vocabulary:** Transaction pipeline, settlement layer, regulatory perimeter, risk corridor

---

## 5. Module Registration Model

Module registration is the mechanism by which a domain cognition module declares itself to the PI Spine. Registration is constitutionally defined here; implementation is deferred to future streams.

### Registration Contract

```json
{
  "module_id": "software_intelligence",
  "module_version": "1.0",
  "corridor_model_version": "1.0",
  "domain": "software_systems",
  "cognition_functions": ["CF-01", "CF-02", "..."],
  "input_corridors": ["STRUCTURAL", "ENRICHMENT", "PRESSURE", "..."],
  "output_corridor": "SOFTWARE_INTELLIGENCE",
  "artifact_contract": "software_intelligence_module.json",
  "permeation_model": {
    "evidence": true,
    "derivation": true,
    "projection": true,
    "persona": true,
    "governance": true
  }
}
```

### Registration Rules

1. Only one domain module may be active per specimen at a time
2. Module version must be compatible with corridor model version
3. Module must declare all input corridors it consumes
4. Module must produce a single output artifact matching the declared contract
5. Module registration does not activate the module — corridor evaluation determines activation

---

## 6. Module Versioning

Domain modules are versioned in relation to the PI Core corridor model:

| Corridor Model Version | Module Compatibility |
|---|---|
| 1.0 (current — 9 corridors) | SW-Intel 1.0 |
| Future | Must declare compatibility |

**Versioning rules:**
1. PI Core corridor model changes may invalidate existing module versions
2. Module version bumps do not affect PI Core
3. Backward compatibility is not guaranteed across corridor model major versions
4. Module minor versions must be backward compatible with the same corridor model major version

---

## 7. Module Governance

Domain cognition modules that introduce new architectural concepts are G1-governed:

| Governance Aspect | Rule |
|---|---|
| Stream classification | G1 for constitutional definition or new concept introduction |
| Vault obligation | MANDATORY for G1 — new terms, boundary definitions, concept updates |
| Terminology lock | New domain-specific terms must be locked in TERMINOLOGY_LOCK.md |
| Corridor model | New corridors require Authority Corridor Model update |
| Persona consumption | New projection fields require persona consumption specification |
| §5.5 assessment | YES — domain modules define reusable concepts by definition |

Implementation streams that consume a constitutionally defined module are G2 — they use concepts without changing them.

---

## 8. Marketplace Strategic Alignment

This architectural definition respects the frozen commercial identity (PI.STRATEGIC-DIRECTION.MARKETPLACE-COMMERCIALIZATION-STRATEGY.01):

| Frozen Element | Alignment |
|---|---|
| Category: Program Intelligence | Domain modules are WITHIN Program Intelligence, not beside it |
| Wedge: Structural Execution Visibility | SW-Intel enriches the wedge with domain vocabulary, does not change it |
| Product family: Signäl | Domain modules are consumed BY Signäl packages, not alternatives to them |
| Tier 1A/1B packaging | Domain modules are implementation infrastructure, not product tiers |
| STATIC/TEMPORAL separation | Domain modules operate on STATIC capabilities today; TEMPORAL remains future |

Marketplace as an extension ecosystem (the prior definition) is refined: Marketplace is the governed ecosystem of domain cognition modules. "Semantic signal packs, industry overlays, governance templates, and integration adapters" are OUTPUTS of domain modules, not independent marketplace items.
