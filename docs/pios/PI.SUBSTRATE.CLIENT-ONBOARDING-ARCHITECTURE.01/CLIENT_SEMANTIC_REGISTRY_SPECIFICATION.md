# Client Semantic Registry (CSR) Specification

**Stream:** PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01
**Maturity:** SPECIFIED_NOT_IMPLEMENTED
**Purpose:** Canonical semantic authority source for per-client DOMAIN models. The PATH B equivalent of the CEU registry for PATH A.

---

## 1. Concept

The CSR is the canonical semantic authority source for a client's DOMAIN model. It defines the business domains, capabilities, and components that constitute a client's semantic topology. Semantic topology artifacts (`semantic_topology_model.json`) are generated FROM the CSR. The CSR is the ontology; the topology model is a derived artifact.

**Critical distinction — two separate operations:**

| Operation | Nature | Who | Duration | Maturity |
|---|---|---|---|---|
| **Semantic Ontology Authoring** (CSR construction) | Human/governed process | Advisory team + client | Days–weeks | SPECIFIED_NOT_IMPLEMENTED |
| **Semantic Topology Generation** (from CSR) | Deterministic computation | Automated | Seconds | OPERATIONAL (BlueEdge), SPECIFIED_NOT_IMPLEMENTED (generic) |

The CSR concept is decoupled from any specific generation tool. The current BlueEdge implementation uses `build_semantic_layer.py` with Python literals. Future implementations may use a different generator. The CSR schema is the stable interface; the generator is an implementation detail.

---

## 2. JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["schema_version", "client_id", "domains", "capabilities", "components", "metadata"],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "client_id": {
      "type": "string",
      "description": "Unique client identifier matching client.yaml"
    },
    "domains": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["domain_id", "name", "type"],
        "properties": {
          "domain_id": { "type": "string", "pattern": "^DOMAIN-[0-9]+$" },
          "name": { "type": "string" },
          "type": {
            "type": "string",
            "description": "Semantic classification. Suggested taxonomy: FUNCTIONAL, INFRASTRUCTURE, CROSS-CUTTING, OPERATIONAL, INTEGRATION. Taxonomy is client-extensible, not globally locked."
          },
          "grounding": {
            "type": "string",
            "enum": ["GROUNDED", "WEAKLY_GROUNDED", "UNGROUNDED"],
            "description": "Evidence grounding status. Computed during authoring, refined during crosswalk."
          },
          "description": { "type": "string" }
        }
      },
      "minItems": 1
    },
    "capabilities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["capability_id", "name", "domain_id", "type"],
        "properties": {
          "capability_id": { "type": "string", "pattern": "^CAP-[0-9]+$" },
          "name": { "type": "string" },
          "domain_id": { "type": "string", "pattern": "^DOMAIN-[0-9]+$" },
          "type": {
            "type": "string",
            "description": "Capability classification. Suggested taxonomy: CORE, SUPPORTING, ENABLING, INFRASTRUCTURE. Client-extensible."
          },
          "weakly_grounded": { "type": "boolean", "default": false }
        }
      }
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["component_id", "name", "capability_id"],
        "properties": {
          "component_id": { "type": "string", "pattern": "^COMP-[0-9]+$" },
          "name": { "type": "string" },
          "capability_id": { "type": "string", "pattern": "^CAP-[0-9]+$" },
          "cross_domain": {
            "type": ["string", "null"],
            "description": "If this component cross-cuts into another DOM, specify the DOM ID. Null if no cross-domain relationship."
          },
          "weakly_grounded": { "type": "boolean", "default": false }
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["authored_by", "authored_date", "version"],
      "properties": {
        "authored_by": { "type": "string", "description": "Advisory team identifier or individual" },
        "authored_date": { "type": "string", "format": "date" },
        "version": { "type": "string", "description": "Semantic version of this CSR instance" },
        "evidence_basis": { "type": "string", "description": "Source evidence reference (archive SHA-256, repository commit, etc.)" },
        "review_status": {
          "type": "string",
          "enum": ["DRAFT", "REVIEWED", "APPROVED", "LOCKED"],
          "description": "Governance gate status"
        },
        "notes": { "type": "string" }
      }
    }
  }
}
```

---

## 3. Location Convention

```
clients/{client_id}/semantic/client_semantic_registry.json
```

This follows the existing per-client directory pattern:
- `clients/{client_id}/client.yaml` — client configuration
- `clients/{client_id}/sources/` — source evidence
- `clients/{client_id}/psee/runs/` — pipeline run outputs
- `clients/{client_id}/semantic/` — NEW: semantic authority (CSR)

---

## 4. Relationship to Current Implementation

The CSR becomes the canonical semantic authority source from which `semantic_topology_model.json` artifacts are generated.

**Current state (BlueEdge):** `build_semantic_layer.py` contains 17/42/89 as Python literals (lines 39-196). The script reads these literals and generates `semantic_topology_model.json`. There is no separate authority source — the script IS the authority.

**Target state:** `build_semantic_layer.py` (or a future generator) reads from `client_semantic_registry.json` and generates `semantic_topology_model.json`. The CSR is the authority; the script is one possible generator.

**BlueEdge retroactive extraction:** The first CSR instance is created by extracting the 17/42/89 from `build_semantic_layer.py` into `clients/blueedge/semantic/client_semantic_registry.json`. This is a mechanical extraction, not a re-authoring.

**Generator decoupling:** The CSR concept is NOT coupled to `build_semantic_layer.py`. Future implementations may use a different language, a different generation approach, or a configuration-driven pipeline. The CSR JSON schema is the stable contract.

---

## 5. CEU Analogy and Disanalogy

### Analogy (structural role matches)

| Property | CEU Registry | Client Semantic Registry |
|---|---|---|
| Structural role | Per-client authority source for PATH A grounding | Per-client authority source for PATH B DOMAINs |
| Location | Registry file consumed by grounding engine | Registry file consumed by topology generator |
| Pipeline position | Input to CEU grounding stage | Input to semantic topology generation stage |
| Versioning | Registry versions tracked | CSR versions tracked |
| Client isolation | Each client has own registry | Each client has own CSR |

### Disanalogy (construction method diverges)

| Property | CEU Registry | Client Semantic Registry |
|---|---|---|
| **Construction method** | Deterministic from evidence. Structural patterns match CEU definitions automatically. | **Human judgment required.** Advisory team identifies DOMAINs from evidence analysis. |
| **Automation** | Fully automated. `ceu_grounding.py` runs without human intervention. | Authoring requires human expertise. Generation from CSR is automated. |
| **Time to produce** | Seconds (automated scan) | Days to weeks (advisory engagement) |
| **Repeatability** | Same evidence → same CEU grounding (deterministic) | Same evidence → potentially different DOMAINs (judgment-dependent) |
| **Error mode** | False negatives (missed CEU patterns) | Misclassification (wrong domain boundaries) |
| **Evolution** | Registry evolves by adding CEU definitions | CSR evolves by re-authoring domains with client |

**Key insight:** CEU grounding is evidence-driven and deterministic. Semantic ontology authoring is judgment-driven and advisory. The CSR specification defines the schema and process for capturing this judgment in a governed, versionable format. It does NOT make the judgment automated.

---

## 6. Advisory Construction Protocol

### Step 1: Evidence Review

Advisory team reviews the client's source evidence (extracted structural topology, PATH A DOMs, source code organization). This provides the structural context for semantic domain identification.

**Input:** Completed PATH A (structural topology, DOMs, CEU grounding)
**Output:** Structural understanding sufficient for domain identification

### Step 2: Domain Identification

Advisory team identifies semantic business domains from evidence and client context. Each domain represents a coherent business function area.

**Governance:** No fixed count. No fixed names. No BlueEdge domain names as defaults.
**Output:** Draft `domains[]` array

### Step 3: Capability Classification

For each domain, advisory team identifies capabilities — functional groupings within the domain.

**Governance:** Capability types (CORE, SUPPORTING, ENABLING, INFRASTRUCTURE) are suggested taxonomy, not enforced.
**Output:** Draft `capabilities[]` array

### Step 4: Component Mapping

For each capability, advisory team maps structural components (modules, packages, services) from the source evidence.

**Governance:** Cross-domain relationships are explicitly marked.
**Output:** Draft `components[]` array

### Step 5: Review Gate

CSR draft undergoes formal review. Review checks:
- Domain boundaries are semantically coherent
- Capabilities are correctly classified
- Components map to evidence (structural nodes)
- Cross-domain relationships are justified
- No implicit BlueEdge assumptions

**Output:** CSR status → REVIEWED → APPROVED

### Step 6: Versioning and Lock

Approved CSR is versioned and committed. Subsequent changes require a new version and re-review.

**Output:** `client_semantic_registry.json` version 1.0, status LOCKED

---

## 7. BlueEdge-Specific Assumptions That MUST NOT Leak Into Generic CSR

The CSR schema and construction protocol MUST NOT embed:

| Assumption | Why It Must Not Leak |
|---|---|
| 17 DOMAINs as default or expected count | Client DOMAIN counts vary. Schema enforces `minItems: 1`, not a fixed count. |
| 42 capabilities as default count | Varies by client. |
| 89 components as default count | Varies by evidence size. |
| BlueEdge DOMAIN names (e.g., "Edge Data Acquisition") | These are BlueEdge's business domains. Other clients have entirely different business contexts. |
| DOM-09 irresolvability as expected pattern | A structural reality of BlueEdge's codebase. Other clients may have zero irresolvable DOMs. |
| 4/17 grounding ratio as benchmark | The ratio is an OUTPUT of the crosswalk process, not a quality target. |
| Q-02 as expected qualification | Q-class is computed from reconciliation data. New clients start at Q-00. |
| DOMAIN type taxonomy as universal | The suggested types (FUNCTIONAL, INFRASTRUCTURE, etc.) are BlueEdge-derived. They may generalize but MUST be validated against multiple clients first. |

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01 |
| Derived from | BLUEEDGE_CANONICAL_TRUTH_CERTIFICATION.md §B.6 (PATH B), §D (derivation boundary), PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01 (prior art) |
| Verification date | 2026-05-18 |
| Maturity | SPECIFIED_NOT_IMPLEMENTED |
