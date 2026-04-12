STRUCTURAL LABEL RESOLUTION CONTRACT
Contract ID: PSEE.STRUCTURAL.LABEL.RESOLUTION.01
Stream: PSEE.STRUCTURAL.LABEL.RESOLUTION.01
Layer: PiOS Core — Structural Normalization Extension (40.4.x)
Status: AUTHORITATIVE DEFINITION

---

## SECTION 1 — PURPOSE

This contract defines the lawful rules for resolving canonical structural identifiers into readable display labels within the PSEE pipeline. Label resolution is additive only — it produces a readable form of an identifier that is already present in the authoritative structure. It does not interpret, enrich, redefine, or replace canonical identity.

The purpose of resolved labels is to support readability in rendering contexts. Resolved labels are supplementary. Canonical identifiers remain primary structural truth at all times.

This contract governs:
- what transformations are admissible when producing a resolved label
- what structural classes those rules apply to
- how identity is preserved through resolution
- how ambiguity is handled without invention
- when resolution fails and must not produce output

---

## SECTION 2 — AUTHORITATIVE INPUTS

The following inputs are the sole authority for this contract. No other source may be consulted.

| # | Input | Role |
|---|---|---|
| 1 | Projection output v1.1 — PSEE.PROJECTION.LAYER.CONTRACT.V1.1 | Structural field definitions, node types, field identity rules |
| 2 | Projection output v2 — PSEE.PROJECTION.LAYER.CONTRACT.V2 | Additive element definitions, governed vocabularies (B-01, B-02, B-03) |
| 3 | Binding structure — GAUGE.RUNTIME.BINDING.01 | Binding target names, field exposure path, field identity mapping |
| 4 | Existing structural metadata already present in authoritative inputs | No external metadata; only what is explicitly present in inputs 1–3 |

The B-01 canonical node type vocabulary governs structural class identification: `binding_context`, `capability_surface`, `component_entity`.

---

## SECTION 3 — ADMISSIBLE SCOPE

Label resolution applies to canonical structural identifiers that appear in the following projection surface elements, accessed through the binding structure:

| Binding target | Applicable identifiers |
|---|---|
| `nodes` | per-node: `node_id`, `label`, `type` |
| `containmentTree` | parent node_id keys |
| `additionalParentRefs` | parent node_id keys |
| `overlapEdges` | `from_node`, `to_node` per edge record |
| `nodesByType` (PL4-C1) | type key values (B-01 governed set) |
| `filteredNodesByType` (PL4-C2) | node_id values within type-filtered subset |

Label resolution does not apply to:
- `summary{}` integer counts — no identifier to resolve
- `constraint_flags{}` — opaque passthrough; structural identity not governed at this layer
- `orphanSignals[]` — no governed node attachment; resolution scope undefined
- `signalsByNode` signal field values — signal field values are not structural identifiers; governed by B-02 as equality-check operands only
- PL4-C3, PL4-C4 boolean and count annotations — not identifiers
- PL4-C5 linkage reference values — structural pointers; must not be resolved into labels

---

## SECTION 4 — FORBIDDEN SOURCES

The following must not be used as any part of label derivation:

- Signal meaning, signal field values, computation_state values, signal thresholds
- Signal severity or nominal/non-nominal distinction
- Topology-derived conclusions (e.g., inferring domain from depth or overlap count)
- Behavioral or runtime state interpretation
- Health or status indicators
- Hand-authored UI copy not present in authoritative inputs
- Marketing language or product narrative
- External naming dictionaries or registries
- Inferred business intent not explicitly present in the identifier string or authoritative structural metadata
- Cross-node inference (resolving one node's label by reference to another node's label content)
- Signal presence or count data from `signals_by_node{}` or `nodes[].signals[]`

---

## SECTION 5 — DETERMINISTIC TRANSFORMATION GRAMMAR

### 5.1 Tokenization

Given a canonical identifier string, produce a token list by applying the applicable split rule(s) in order:

**Rule T-1: snake_case split**
Split on underscore character `_`. Remove empty tokens produced by leading, trailing, or consecutive underscores.
Example: `event_bus_core` → [`event`, `bus`, `core`]

**Rule T-2: kebab-case split**
Split on hyphen character `-`. Remove empty tokens produced by leading, trailing, or consecutive hyphens.
Example: `event-bus-core` → [`event`, `bus`, `core`]

**Rule T-3: PascalCase / camelCase split**
Insert a split boundary:
- before any uppercase letter that follows a lowercase letter
- before any uppercase letter that is followed by a lowercase letter and is itself preceded by one or more uppercase letters (handles sequences like `HTTPSClient` → `HTTPS`, `Client`)
Example: `FleetEventsModule` → [`Fleet`, `Events`, `Module`]
Example: `DockerComposeOrchestrator` → [`Docker`, `Compose`, `Orchestrator`]
Example: `HTTPSClient` → [`HTTPS`, `Client`]

**Rule T-4: Compound split**
When an identifier contains both `_` or `-` delimiters and camelCase/PascalCase segments, apply T-1 or T-2 first, then apply T-3 to each resulting token.
Example: `blueedge_platform` → [`blueedge`, `platform`] → (T-3 yields no splits on all-lowercase) → [`blueedge`, `platform`]

**Rule T-5: Numeric boundary split**
Split on transitions between letter and digit characters. This preserves numeric suffixes as discrete tokens.
Example: `node_v2_core` → [`node`, `v2`, `core`] → [`node`, `v`, `2`, `core`] — only letter-digit transitions that produce meaningful boundary separation apply; single-letter version prefixes (`v2`) are kept as one token if no letter-digit boundary applies within them.
Clarification: `v2` is a single token; `core2` splits to [`core`, `2`].

### 5.2 Token Normalization

After tokenization, apply the following normalizations to each token in order:

**Rule N-1: Product casing preservation**
If a token, after case-folding to lowercase, matches a product name whose canonical cased form is explicitly present (with that exact casing) in the authoritative inputs (inputs 1–3 of Section 2), the canonical cased form is used.
Example: `blueedge` → `BlueEdge` — only admissible if the string `BlueEdge` appears in its cased form in the authoritative structural inputs. If only `blueedge` (lowercase) appears, standard title casing (Rule N-2) applies and the output is `Blueedge`.

**Rule N-2: Title case**
If Rule N-1 does not apply, apply title case: capitalize the first character; lowercase remaining characters.
Example: `module` → `Module`, `events` → `Events`

**Rule N-3: Known structural abbreviation expansion**
A structural abbreviation may be expanded only when:
- the expansion is deterministic (one possible expansion given the token)
- the expansion is not interpretive (it does not add meaning not present in the token)
- the expanded form is explicitly listed in the Structural Abbreviation Register (Section 5.3)

If an abbreviation is not in the register, no expansion is permitted. The token is normalized under N-1 or N-2.

**Rule N-4: Punctuation removal**
Remove code-only separator characters that survive tokenization (e.g., a remaining `_` or `-` that did not act as a split delimiter). Do not remove characters that carry identity (e.g., dots in version strings if present as explicit token content).

### 5.3 Structural Abbreviation Register

This register is the exhaustive list of deterministic structural abbreviations admissible for expansion under Rule N-3. All other abbreviations must not be expanded.

| Abbreviation token | Expanded form | Condition for use |
|---|---|---|
| `cfg` | `Config` | Unconditional |
| `svc` | `Service` | Unconditional |
| `mgr` | `Manager` | Unconditional |
| `ctx` | `Context` | Unconditional |
| `idx` | `Index` | Unconditional |
| `auth` | `Auth` | No expansion — treat as proper token (short form is unambiguous) |
| `api` | `API` | Casing only — not an expansion |

Additions to this register require a governed revision to this contract. No addition may be made by inference or convenience.

### 5.4 Token Assembly

Join normalized tokens with a single space character. The result is the `resolved_label`.

**Rule A-1: Whitespace normalization**
Collapse any sequence of whitespace characters in the assembled string to a single space. Trim leading and trailing whitespace.

**Rule A-2: No word-form alteration**
Token word-form (noun, verb, gerund, plural) must not be altered beyond what mechanical splitting produces. `CacheLayer` → `Cache Layer` is admissible. `CacheLayer` → `Caching Layer` is not admissible unless the token `Caching` or equivalent gerund form is present in the source identifier or an explicit token-form mapping rule is added to the Structural Abbreviation Register.

**Rule A-3: No token merging**
Tokens must not be merged. A two-word label resulting from tokenization may not be collapsed to one word for aesthetic reasons.

### 5.5 Short Label Derivation

`short_label` is derived from `resolved_label` by applying one or more of the following reduction rules. No other transformation is admissible.

**Rule S-1: Terminal qualifier removal**
Remove a structurally non-identity-critical terminal word (e.g., `Module`, `Core`, `Service`, `Layer`) when:
- the remaining label uniquely identifies the element within its visible scope
- the removed word does not carry identity-differentiating information within that scope

**Rule S-2: Prefix reduction**
Remove a common leading organizational prefix shared across all siblings within the same visible scope, when its removal does not create ambiguity.

If neither reduction rule produces a unique, non-ambiguous result, `short_label` is omitted.

---

## SECTION 6 — RESOLUTION RULES BY STRUCTURAL CLASS

Structural classes are grounded in the B-01 canonical node type vocabulary: `binding_context`, `capability_surface`, `component_entity`. A fourth class, `container`, refers to nodes that appear as parent keys in `containmentTree` regardless of their B-01 type. These classes govern which resolution rules apply when type metadata is available.

### 6.1 Domain Resolution (`binding_context`)

A `binding_context` node is the structural class that establishes a binding region. Its label is resolved from its `label` field (passthrough from source via `nodes` binding target), applying the transformation grammar of Section 5 to the label field value.

If the `label` field is absent or equal to the `node_id`, resolution falls through to the `node_id` itself. The transformation grammar is applied to whichever value is used.

If neither `label` nor `node_id` yields a deterministic readable form under the grammar, the element is marked UNRESOLVED. No domain label may be invented.

### 6.2 Capability Resolution (`capability_surface`)

A `capability_surface` node represents a governed capability. Its label is resolved from its `label` field, with transformation grammar applied. The original naming intent of the identifier is preserved — no expansion beyond what the token itself supports is introduced.

Capability labels must not be upgraded into conceptual subsystem descriptions. `FleetEventsModule` → `Fleet Events Module` is admissible. `FleetEventsModule` → `Critical Event Processing Core` is not admissible.

### 6.3 Component Resolution (`component_entity`)

A `component_entity` node represents a structural component. Its label is resolved from its `label` field by lexical readability transformation only. No promotion to a higher conceptual level (e.g., "subsystem", "platform component") is permitted.

`DockerComposeOrchestrator` → `Docker Compose Orchestrator` is admissible. `DockerComposeOrchestrator` → `Container Orchestration Platform` is not admissible.

### 6.4 Container Resolution (structural containment nodes)

A container node is any node appearing as a parent key in `containmentTree`. Its type determines which rule above applies. If its type is ungoverned or absent, resolution falls through to the `label` field with the transformation grammar applied, without type-based rule application.

Container entities must not be interpreted as infrastructure elements beyond what their identifier tokens directly state. `DockerComposeOrchestrator` does not become `Infrastructure Orchestrator` — it resolves to `Docker Compose Orchestrator` by the PascalCase split rule alone.

### 6.5 Type Key Resolution (PL4-C1 — `nodesByType`)

The three B-01 governed type key values (`binding_context`, `capability_surface`, `component_entity`) may be resolved for display as follows, using the snake_case split rule and title case normalization only:

| Type key | Resolved display form |
|---|---|
| `binding_context` | `Binding Context` |
| `capability_surface` | `Capability Surface` |
| `component_entity` | `Component Entity` |

These resolved forms are rendering-layer display labels only. They must not replace the type key value in any data structure.

---

## SECTION 7 — IDENTITY PRESERVATION RULES

**IP-1:** `canonical_id` is the `node_id` value as present in the `nodes` binding target. It must be preserved unchanged in every resolution output record.

**IP-2:** Resolved labels are additive. They do not replace `canonical_id`. The output schema (Section 10) requires `canonical_id` as a mandatory field alongside `resolved_label`.

**IP-3:** `node.type` is preserved as received. Label resolution does not alter the type value.

**IP-4:** Parent/containment references (`canonical_parent`, `additional_parents[]`, `containmentTree` keys) are preserved unchanged. Label resolution does not rename, re-key, or alter these references.

**IP-5:** Overlap edge `from_node` and `to_node` references are preserved unchanged.

**IP-6:** No resolved label may be written back to any projection field or binding target. Resolution outputs are a separate additive layer.

---

## SECTION 8 — AMBIGUITY HANDLING RULES

**AM-1:** If two or more elements within the same visible scope would receive the same `resolved_label` by application of the transformation grammar, the situation is an ambiguity.

**AM-2:** When ambiguity is detected:
- `resolved_label` is kept as produced by the grammar — it is not altered to disambiguate
- `short_label` is omitted for all ambiguous members unless structural disambiguation is available (see AM-3)
- The ambiguity is recorded in the validation register

**AM-3:** Structural disambiguation is available when the `canonical_id` values of the ambiguous elements can be appended as a qualifier suffix in the form `resolved_label (canonical_id)` without introducing interpretation. This form is admissible as `resolved_label` when ambiguity would otherwise make the label functionally unresolvable within scope.

**AM-4:** Disambiguators must not be invented. A disambiguator may only be the `canonical_id` value or a structurally explicit qualifier already present in the authoritative inputs.

**AM-5:** Cross-scope ambiguity (two elements in different visible scopes resolving to the same label) is not a failure. Only within-scope ambiguity is governed by this section.

---

## SECTION 9 — SHORT LABEL ADMISSIBILITY RULES

**SH-1:** `short_label` is optional in all cases.

**SH-2:** `short_label` must be strictly derivable from `resolved_label` by the reduction rules defined in Section 5.5. It may not be independently authored.

**SH-3:** `short_label` must uniquely identify the element within its visible scope. If it does not, it must be omitted.

**SH-4:** `short_label` must not remove identity-critical words where collision risk appears. A word is identity-critical if its removal would produce a label identical to another element's label within the same visible scope.

**SH-5:** When `short_label` is omitted, the output record must still contain `canonical_id` and `resolved_label`. The schema does not fail for absent `short_label`.

---

## SECTION 10 — OUTPUT SCHEMA

### 10.1 Minimum required schema per resolved element

```json
{
  "canonical_id": "<node_id as received from binding target>",
  "resolved_label": "<deterministic readable form per Section 5>",
  "short_label": "<optional — omit field if not admissible>"
}
```

`short_label` key is omitted from the record entirely when not admissible. It is not set to null or empty string.

### 10.2 Extended schema (when type context is available)

```json
{
  "canonical_id": "<node_id>",
  "node_type": "<binding_context | capability_surface | component_entity | ungoverned>",
  "source_label": "<label field value as received>",
  "resolved_label": "<deterministic readable form>",
  "short_label": "<optional>",
  "resolution_status": "RESOLVED | UNRESOLVED | AMBIGUOUS"
}
```

`resolution_status`:
- `RESOLVED` — `resolved_label` produced deterministically from admissible sources
- `UNRESOLVED` — no admissible resolution path available; `resolved_label` field absent or equals `canonical_id`
- `AMBIGUOUS` — resolution produced a label identical to one or more sibling elements within scope; `short_label` omitted

### 10.3 Immutability guarantee

No field in the binding structure or projection output is modified by the resolution operation. The output schema records are a separate additive layer. The `nodes` binding target and all other binding targets remain structurally unchanged after resolution.

---

## SECTION 11 — TRACEABILITY REQUIREMENTS

**TR-1:** Every `resolved_label` must be reproducible from `canonical_id` alone (or `source_label` if used as the resolution input) by applying the transformation grammar of Section 5 without additional context.

**TR-2:** The transformation path from input token to resolved label must be stateable step-by-step using only rules from Section 5 without ambiguity.

**TR-3:** Any render-facing output using a `resolved_label` must retain the `canonical_id` as an accessible structural reference. The canonical ID must not become unrecoverable.

**TR-4:** If `source_label` differs from `canonical_id`, both must be preserved in the output record to maintain the full traceability chain: `canonical_id` → `source_label` → `resolved_label`.

**TR-5:** No resolution output may derive a label from a source that cannot be named. Every label must have a traceable source: either `canonical_id` or `source_label` from the `nodes` binding target.

---

## SECTION 12 — FAILURE MODE REGISTER

| Code | Name | Definition |
|---|---|---|
| SL-01 | Canonical ID lost or replaced | `canonical_id` is absent from the resolution output record, or the resolution process substituted a different value for it |
| SL-02 | Non-deterministic resolution | The same input token produces different `resolved_label` outputs depending on context, timing, or external state |
| SL-03 | Interpretation introduced | A resolved label contains meaning, claims, or conceptual content not directly derivable from the source token by the grammar rules of Section 5 |
| SL-04 | Label derived from signals | Any part of a resolved label was produced using signal field values, `computation_state` values, signal counts, or PL4-C3/C4 annotations |
| SL-05 | Ambiguity ungoverned | Two or more elements in the same visible scope received the same `resolved_label` and the ambiguity was not recorded; or a `short_label` was produced that creates ambiguity |
| SL-06 | Structural mutation introduced | Any binding target field value, node count, edge count, containment relationship, or array order was altered as a result of the resolution process |
| SL-07 | UI-dependent naming introduced | A resolved label was produced using hand-authored display text, marketing copy, or naming not derivable from the source identifier |
| SL-08 | Traceability broken | A resolved label cannot be traced back to its source token through the stated grammar rules; or `canonical_id` is inaccessible from a render-facing output |
| SL-09 | Invented domain label without structural source | A domain label was produced for a `binding_context` node where neither `label` field nor `node_id` yielded a deterministic resolution; the label was invented rather than marking the element UNRESOLVED |
| SL-10 | Short label collision or misleading compression | `short_label` was produced in a context where it is identical to another element's label within the same visible scope, or the reduction removed identity-critical words |

---

## SECTION 13 — VALIDATION CRITERIA

The following criteria must all pass for this contract to be admissible:

| # | Criterion |
|---|---|
| VC-01 | Every in-scope structural element has `canonical_id` preserved in resolution output |
| VC-02 | Every `resolved_label` is derivable from admissible sources only (Section 3, Section 4) |
| VC-03 | No `resolved_label` uses or references signal field values or signal semantics |
| VC-04 | No `resolved_label` contains inferred health, risk, importance, or severity language |
| VC-05 | Domain (`binding_context`) labels are sourced from `label` or `node_id` fields only, with grammar applied |
| VC-06 | Capability (`capability_surface`) labels preserve lexical intent of the identifier |
| VC-07 | Component (`component_entity`) labels preserve lexical intent of the identifier |
| VC-08 | Container labels preserve lexical intent of the identifier |
| VC-09 | `short_label` appears only where non-ambiguous within its visible scope |
| VC-10 | No node count changed by resolution |
| VC-11 | No containment or overlap structure changed by resolution |
| VC-12 | `canonical_id` remains displayable alongside `resolved_label` in render-facing outputs |
| VC-13 | Same input token yields same output label across repeated resolution executions |
| VC-14 | Unresolved cases are marked `UNRESOLVED` and not repaired by invention |
| VC-15 | Contract is non-interpretive: no resolved label requires external context to verify its derivation |

---

## SECTION 14 — FINAL ADMISSIBILITY STATEMENT

This contract is admissible as the authoritative structural label resolution definition for PSEE projection outputs and GAUGE runtime binding surfaces, subject to the following conditions:

1. The transformation grammar of Section 5 is applied in full, without selective omission of rules.
2. The Structural Abbreviation Register (Section 5.3) is treated as a closed set; no addition by convenience is permitted.
3. The product casing preservation rule (N-1) is applied only when the cased product name form is explicitly present in the authoritative inputs; if not present, standard title case (N-2) applies.
4. `CacheLayer` → `Caching Layer` is inadmissible under this contract because the gerund form `Caching` is not derivable from the token `Cache` by mechanical splitting alone. The admissible output is `Cache Layer`.
5. `DockerComposeOrchestrator` → `Docker Compose Orchestrator` is admissible. `DockerComposeOrchestrator` → `Docker Compose Orchestration` is inadmissible for the same reason as item 4 above; `Orchestrator` is the token present in source.
6. All failure modes SL-01 through SL-10 are enforceable against any execution of this contract.
7. Validation criteria VC-01 through VC-15 must pass before any output set is considered resolved.

This contract does not authorize any modification to projection outputs, binding structures, or consumption boundary rules.
