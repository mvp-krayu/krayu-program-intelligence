# Crosswalk Auto-Derivation Specification

**Stream:** PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01
**Maturity:** SPECIFIED_NOT_IMPLEMENTED
**Purpose:** Algorithm interface for proposing DOM↔DOMAIN mappings once both structural (PATH A) and semantic (PATH B) registries exist for a client.

---

## 1. Concept

Once a client has both:
- PATH A completed: structural topology with DOMs (from structural scan + CEU grounding)
- PATH B completed: semantic topology with DOMAINs (from CSR + topology generation)

the crosswalk between them can be **partially auto-derived** by comparing structural membership and semantic classification.

The auto-derivation algorithm proposes DOM↔DOMAIN mappings with confidence scores. A human review gate accepts, rejects, or modifies proposals above a configurable confidence threshold.

---

## 2. Algorithm Interface

### Inputs

| Input | Source | Required |
|---|---|---|
| `canonical_topology.json` | PATH A output — structural DOMs with member nodes | YES |
| `semantic_topology_model.json` | PATH B output — DOMAINs with member components | YES |
| `client_semantic_registry.json` | CSR — component-to-capability-to-domain mapping | YES |
| `structural_node_inventory.json` | Raw structural scan — full node list | RECOMMENDED |
| `prior_crosswalk.json` | Previous crosswalk version (for delta-aware proposals) | OPTIONAL |

### Outputs

| Output | Format | Description |
|---|---|---|
| `crosswalk_proposals.json` | Array of proposals | Proposed DOM↔DOMAIN mappings with confidence |
| `irresolvable_candidates.json` | Array of DOM IDs | DOMs detected as potentially irresolvable (1:N mapping) |
| `coverage_report.json` | Summary | % of DOMs with proposals, % of DOMAINs mapped |

### Proposal Schema

```json
{
  "proposals": [
    {
      "dom_id": "DOM-XX",
      "dom_label": "string",
      "proposed_domain_id": "DOMAIN-YY",
      "proposed_domain_name": "string",
      "confidence": 0.0,
      "match_basis": "COMPONENT_OVERLAP | NAMING_SIMILARITY | STRUCTURAL_ADJACENCY | PRIOR_CROSSWALK",
      "evidence": {
        "shared_nodes": 0,
        "total_dom_nodes": 0,
        "overlap_ratio": 0.0,
        "naming_signals": []
      },
      "review_status": "PROPOSED | ACCEPTED | REJECTED | MODIFIED"
    }
  ]
}
```

### Confidence Scoring

| Confidence Range | Interpretation | Action |
|---|---|---|
| 0.90 – 1.00 | High confidence — strong structural overlap | Auto-accept with audit trail |
| 0.70 – 0.89 | Medium confidence — partial overlap | Present for human review |
| 0.50 – 0.69 | Low confidence — weak signal | Present for human review with warning |
| 0.00 – 0.49 | Very low confidence — minimal structural basis | Flag as likely incorrect |

Thresholds are configurable. The above ranges are initial suggestions calibrated against BlueEdge data (4 reconciled pairs had confidence 0.78–0.95). Different clients may require recalibration.

---

## 3. Human Review Gate

The auto-derivation algorithm is NOT a replacement for human judgment. It is a proposal engine that reduces the advisory team's search space.

### Review Process

1. Algorithm generates proposals for all DOMs
2. Proposals above `auto_accept_threshold` (default: 0.90) are pre-accepted pending audit
3. Proposals between `review_threshold` (default: 0.50) and `auto_accept_threshold` are presented for human review
4. Proposals below `review_threshold` are flagged as low-confidence
5. DOMs with no proposals above `review_threshold` are classified as requiring manual crosswalk
6. Human reviewer accepts, rejects, or modifies each proposal
7. Final crosswalk is constructed from accepted/modified proposals

### Review Gate Output

```json
{
  "review_summary": {
    "total_doms": 0,
    "auto_accepted": 0,
    "human_reviewed": 0,
    "manually_mapped": 0,
    "irresolvable": 0
  },
  "reviewer": "string",
  "review_date": "YYYY-MM-DD",
  "crosswalk_version": "string"
}
```

---

## 4. Irresolvability Detection

**Generalized from the DOM-09 pattern:** In BlueEdge, DOM-09 (backend_modules) contains 6 CEU nodes that map to 6+ distinct semantic DOMAINs. This makes a 1:1 DOM↔DOMAIN mapping structurally impossible.

### Detection Algorithm

A DOM is flagged as **potentially irresolvable** when:
1. The DOM contains member nodes that map to components in 3+ different DOMAINs (via CSR), AND
2. No single DOMAIN accounts for >60% of the DOM's component membership, AND
3. The DOM's structural boundary cannot be subdivided without breaking PATH A integrity

### Detection Output

```json
{
  "irresolvable_candidates": [
    {
      "dom_id": "DOM-XX",
      "dom_label": "string",
      "mapped_domain_count": 0,
      "domain_distribution": [
        { "domain_id": "DOMAIN-YY", "component_count": 0, "percentage": 0.0 }
      ],
      "recommendation": "MANUAL_REVIEW | ACCEPT_IRRESOLVABLE | SPLIT_DOM"
    }
  ]
}
```

### Handling Irresolvable DOMs

| Strategy | When to Use | Trade-off |
|---|---|---|
| Accept as irresolvable | DOM genuinely spans multiple business domains (DOM-09 pattern) | Crosswalk has a permanent gap; reconciliation at L1 |
| Split DOM | Structural boundary can be refined at A5b level | Requires PATH A re-derivation; increases DOM count |
| Map to dominant DOMAIN | One DOMAIN accounts for clear majority (>70%) | Lossy — minority components lose semantic attribution |

The choice is a human judgment call. The algorithm detects; the advisory team decides.

---

## 5. Reconciliation Input Readiness Check

After crosswalk is constructed, verify that all 5 reconciliation inputs are available:

| Input | Source | Readiness Check |
|---|---|---|
| Crosswalk | Crosswalk construction (this process) | File exists, schema valid |
| Semantic topology | CSR → topology generation | File exists, schema valid |
| Canonical topology | PATH A output | File exists, schema valid |
| Signal registry | Pipeline Phase 6-7 or pre-computed | File exists OR empty (signals optional) |
| Prior correspondence | Previous reconciliation run | File exists OR empty (first run) |

If all 5 inputs are ready → reconciliation can proceed (automated, seconds).
If any input is missing → reconciliation is blocked, report which input is absent.

---

## 6. compile_correspondence.js Parameterization

**Current state:** `scripts/reconciliation/compile_blueedge_correspondence.js` hardcodes `CLIENT = 'blueedge'` and `RUN_ID = 'run_blueedge_productized_01_fixed'` (D-01, D-02 from prior art).

**Target state:** Parameterized CLI:

```bash
node scripts/reconciliation/compile_correspondence.js \
  --client <client_id> \
  --run <run_id> \
  [--output-dir <path>]
```

**Changes required:**
1. Rename `compile_blueedge_correspondence.js` → `compile_correspondence.js`
2. Replace hardcoded CLIENT/RUN_ID with CLI arguments (argparse or process.argv)
3. Replace hardcoded path construction with template: `clients/{client}/psee/runs/{run}/`
4. Keep compiler_version metadata but replace 'BLUEEDGE' with `{client}` in version string (D-03)
5. Retain confidence thresholds as defaults with optional CLI overrides

**Effort:** MEDIUM — primarily mechanical refactoring. The compiler itself (ReconciliationCorrespondenceCompiler.js) is already client-agnostic.

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01 |
| Derived from | BLUEEDGE_CANONICAL_TRUTH_CERTIFICATION.md §B.7-B.8 (crosswalk/reconciliation), PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01 (prior art D-01 through D-06) |
| Verification date | 2026-05-18 |
| Maturity | SPECIFIED_NOT_IMPLEMENTED |
