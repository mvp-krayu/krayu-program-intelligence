# SQO Cockpit Product Boundary

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## 1. Product distinction

### LENS

Executive projection surface. Consumes PATH B-authorized projection objects. Answers: "What does the executive need to know and decide?"

- Renders governed projection objects
- PATH B owns projection authority
- Q-class gating controls what renders
- Executive register language
- No direct SQO artifact consumption

### SQO Cockpit

Semantic qualification operations workbench. Consumes SQO artifacts directly for onboarding, maturation, diagnosis, remediation, and progression planning. Answers: "How does a structurally valid client become semantically onboarded, qualified, and progressively projectable?"

- Reads SQO artifacts directly (read-only)
- Operational register language
- Surfaces debt, gaps, maturity dimensions, remediation pathways
- Guides source material intake and re-run preparation
- Prepares PATH B handoff packages
- Never emits directly into LENS

## 2. Mandatory distinction

LENS shows what is authorized for executive projection.
SQO Cockpit shows what must improve for semantic qualification.

These are different audiences, different registers, different artifacts, different governance boundaries.

## 3. Consumption boundary

```
SQO Cockpit reads:
  artifacts/sqo/<client>/<run_id>/*.v1.json
  (read-only, no mutation)

SQO Cockpit does NOT:
  - import from LENS page code
  - import from flagshipBinding
  - import from PATH B resolver
  - emit projection objects
  - modify Lane A / Lane D / DPSIG

LENS reads:
  PATH B governed projection objects
  (via flagshipBinding / BlueEdgePayloadResolver)

LENS does NOT:
  - import SQO modules
  - read SQO artifacts
  - render SQO-derived interpretation
```

## 4. Shared infrastructure

Both surfaces share:
- Manifest registry (`lib/lens-v2/manifests/`) for client/run validation
- `SemanticArtifactLoader` for governed file I/O
- SQO backend engines (state detection, debt, maturity) produce artifacts consumed by both paths — but only through their respective consumption models

## 5. Future bridge: PATH B qualification envelope

When SQO-derived information needs to appear in LENS:

1. SQO Cockpit operator prepares a PATH B handoff package
2. PATH B qualification envelope builder reads SQO artifacts
3. PATH B transforms them into a governed projection object
4. LENS renders the projection object

The SQO Cockpit facilitates this handoff but never bypasses it.
