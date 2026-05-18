# Implementation Semantics — PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| semantic_derivation_compiler | scripts/pios/semantic_derivation_compiler.py | CLI entry point — 7-phase compiler pipeline | MULTI-CLIENT |
| evidence_parser | scripts/pios/sdc/evidence_parser.py | HTML → structured intermediate representation | MULTI-CLIENT |
| domain_proposer | scripts/pios/sdc/domain_proposer.py | Component extraction + capability grouping + domain classification | MULTI-CLIENT |
| confidence_scorer | scripts/pios/sdc/confidence_scorer.py | Per-element confidence assignment | MULTI-CLIENT |
| review_queue_generator | scripts/pios/sdc/review_queue_generator.py | Review trigger detection → queue artifact | MULTI-CLIENT |
| candidate_csr_emitter | scripts/pios/sdc/candidate_csr_emitter.py | Format output as CSR-schema JSON with provenance | MULTI-CLIENT |
| llm_adapter | scripts/pios/sdc/llm_adapter.py | Provider-isolated LLM call boundary | MULTI-CLIENT |
| validate_candidate_csr | scripts/pios/sdc/validate_candidate_csr.py | Schema + referential integrity validation | MULTI-CLIENT |
| blueedge_retroactive_validation | scripts/pios/sdc/blueedge_retroactive_validation.py | BlueEdge-specific retroactive comparison | CLIENT-SPECIFIC |

## 2. Input Contracts

### semantic_derivation_compiler.py

| Input | Required | Path Pattern | Consumed Fields |
|---|---|---|---|
| Evidence files | YES | `--evidence-dir` (CLI) | HTML structure: sections, module cards, frontend pages, layers |
| PATH A topology | OPTIONAL | `clients/{client}/psee/runs/{run}/structure/40.4/canonical_topology.json` | nodes[].{cluster, label} |
| Client config | NO | (implicit from --client) | Client identifier for output paths |

### evidence_parser.py

| Input | Required | Source |
|---|---|---|
| HTML evidence files | YES | `--evidence-dir/*.html` |

### llm_adapter.py

| Input | Required | Source |
|---|---|---|
| ANTHROPIC_API_KEY | YES (for AI phases) | Environment variable |
| SDC_MODEL | OPTIONAL | Environment variable (default: claude-sonnet-4-20250514) |

## 3. Output Contracts

### semantic_derivation_compiler.py

| Output | Path | Schema |
|---|---|---|
| candidate_csr.json | `clients/{client}/psee/runs/{run}/semantic/compiler/candidate_csr.json` | CSR v1.0 with compiler extensions (confidence, evidence_refs, compiler_metadata) |
| derivation_report.json | `clients/{client}/psee/runs/{run}/semantic/compiler/derivation_report.json` | Per-element derivation chain, confidence distribution, evidence hashes |
| review_queue.json | `clients/{client}/psee/runs/{run}/semantic/compiler/review_queue.json` | Review items with 4 trigger conditions |
| rejection_report.json | `clients/{client}/psee/runs/{run}/semantic/compiler/rejection_report.json` | Emitted only when evidence gate rejects |

## 4. Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|---|---|---|
| COMPILER_VERSION | 1.0.0 | GOVERNED — increment on behavioral change |
| COMPILER_CONTRACT | PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01 | GOVERNED |
| Component overload threshold | 15 per domain | TUNED — D-3 spec point 7 |
| Direct evidence ratio threshold | 50% | TUNED — D-3 spec point 7 |
| Evidence excerpt cap | 200 characters | TUNED — prevents report explosion |
| LLM temperature | 0.0 | GOVERNED — structural reproducibility |
| Default model | claude-sonnet-4-20250514 | TUNED — override via SDC_MODEL env |

## 5. Extension Points

| Point | Description |
|---|---|
| --enable-semantic-derivation | Explicit opt-in for AI-assisted phases |
| --output-dir | Redirect output for isolated validation |
| SDC_MODEL env var | Override default LLM model |
| SDC_LLM_PROVIDER env var | Future: alternative LLM providers |
| Evidence format | Parser uses pattern-based extraction; new HTML structures require extraction strategy extension |
| _GROUP_NAME_TO_DOMAIN mapping | Deterministic domain classification from document groups |
| _NAME_ROOTS mapping | Signal 2 naming pattern grouping roots |
| _TECH_PATTERNS | Tier 2 technology extraction patterns |

## 6. Module Responsibility Map

| File | Owns |
|---|---|
| semantic_derivation_compiler.py | CLI, phase orchestration, failure classification, exit codes |
| sdc/evidence_parser.py | HTML parsing, intermediate representation, file hashing |
| sdc/domain_proposer.py | 3-tier extraction, 4-signal grouping, deterministic + AI domain classification |
| sdc/confidence_scorer.py | Per-element confidence walk, distribution computation |
| sdc/review_queue_generator.py | 4 trigger conditions, review item generation |
| sdc/candidate_csr_emitter.py | CSR formatting, provenance, all 4 output artifacts |
| sdc/llm_adapter.py | Provider-specific LLM calls — governance logic excluded |
| sdc/validate_candidate_csr.py | Schema validation, referential integrity, confidence bounds |
| sdc/blueedge_retroactive_validation.py | Governance checks + reconstruction recall vs BlueEdge certified CSR |

## 7. Shape Independence

The compiler does NOT target any specific domain/capability/component cardinality. BlueEdge's 17/42/89 is a certified reference outcome, not a universal model or forced ontology shape.

For new clients, the compiler may produce different counts across all dimensions. The governing constraint is evidence-backed provenance and SQO authority ceiling, not shape conformance.
