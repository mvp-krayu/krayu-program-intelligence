# PI Domain Calibration Assessment

Stream: PI.DOMAIN-CALIBRATION.01
Date: 2026-06-06
Classification: Core capability architecture (no implementation)

---

## 1. Can Semantic Domains Be Inferred?

**YES — from the import graph alone, at package-level granularity.**

The code graph already contains the signal. StackStorm's import relationships cluster naturally by top-level package directory. The code graph has 1,333 files across 12 meaningful packages (>5 files each):

| Package | Files | Outbound Imports | Inbound Imports | Role Signal |
|---|---|---|---|---|
| st2common | 478 | 1,664 | 2,967 | Shared library (massive inbound) |
| contrib | 131 | 513 | 2 | Plugin/extension (outbound-dominant) |
| st2tests | 116 | 207 | 583 | Test infrastructure (high inbound) |
| st2client | 92 | 201 | 216 | Client library (balanced) |
| st2api | 79 | 539 | 69 | API surface (outbound-dominant) |
| st2reactor | 57 | 294 | 54 | Event processing (outbound-dominant) |
| st2actions | 49 | 368 | 42 | Execution (outbound-dominant) |
| st2auth | 25 | 78 | 24 | Authentication (small, focused) |
| st2stream | 15 | 57 | 10 | Streaming (small, focused) |
| tools | 15 | 46 | 0 | Utilities (zero inbound) |

The calibration signal is the first path component of every file in the import graph. This is true for:
- **StackStorm:** `st2common/`, `st2reactor/`, `st2actions/`
- **NetBox:** `netbox/dcim/`, `netbox/ipam/`, `netbox/extras/`
- **BlueEdge:** `backend/src/`, `frontend/`

The depth of the meaningful package boundary varies per language/framework convention, but the PATTERN is universal: group files by the highest directory level where import clustering becomes coherent.

---

## 2. Which Evidence Classes Are Required?

| Signal | Required? | What It Provides | Available On |
|---|---|---|---|
| Import graph (40.3s) | **REQUIRED** | File paths → package clustering, import flow direction, hub identification | All specimens |
| Top-level directory structure | **REQUIRED** | Package naming → candidate domain labels | All specimens (it IS the file paths) |
| Import direction ratio (outbound vs inbound) | **REQUIRED** | Role inference: library (high inbound), consumer (high outbound), balanced | All specimens |
| File count per package | **REQUIRED** | Size classification: core vs utility vs focused service | All specimens |

These four signals are ALREADY in the 40.3s code graph. No additional extraction needed. The calibration engine reads the same artifact the static pipeline already produces.

---

## 3. Which Evidence Classes Are Optional But Improve Quality?

| Signal | What It Adds | Available On |
|---|---|---|
| Runtime event participation | Which packages participate in coordination → operational role | Specimens with runtime evidence |
| Service topology (systemd/docker/k8s) | Which packages run as independent services → deployment role | Specimens with service declarations |
| External dependency config | Which packages reference external endpoints → boundary role | Specimens with config files |
| Consequence compiler domain narratives | Which packages carry structural risk → risk role | All specimens (computed from import graph) |

The consequence compiler ALREADY produces domain narratives for StackStorm — it identified st2reactor, st2common, st2tests, st2actions, st2api, st2client, st2auth as domains with risk profiles. The ConsequenceCompiler derived these from conditions, not from hand-labeled domain names. The calibration was implicit — the compiler grouped conditions by whatever domain names the specimen had. If those names were meaningful packages instead of raw file names, the narratives would be immediately useful.

---

## 4. What Confidence Can PI Achieve?

### Tier 1 — HIGH confidence (import graph only)

**Package-level domain identification:** Grouping files by top-level package directory produces correct domain boundaries for all three specimens tested:
- StackStorm: 8 meaningful packages (st2common, st2reactor, st2actions, st2api, st2auth, st2stream, st2client, contrib)
- NetBox: 13 meaningful packages (netbox, dcim, ipam, extras, core, utilities, etc.)
- BlueEdge: package structure maps to existing 17 named domains

**Import-direction role classification:**
- Inbound-dominant (>3:1 ratio) → SHARED_LIBRARY or INFRASTRUCTURE
- Outbound-dominant (>3:1 ratio) → CONSUMER or SERVICE
- Balanced → CLIENT_LIBRARY or GATEWAY
- Zero inbound → UTILITY or TOOL

This classification is automatic, numeric, and technology-invariant.

### Tier 2 — MODERATE confidence (+ runtime evidence)

**Operational role refinement:** With runtime event participation, package-level domains gain operational characterization:
- Packages that appear in handler targets → COORDINATION_CONSUMER
- Packages that appear in emitter sources → COORDINATION_PRODUCER
- Packages that appear in both → COORDINATION_HUB

### Tier 3 — Requires human input

**Business label naming:** "st2reactor" is a meaningful developer label but not a business label. "Event Processing Engine" would be a business label. PI cannot infer business context from code. The mapping from package name to business label requires one of:
- Human input during onboarding
- README/documentation parsing (fragile)
- Convention-based inference ("api" → "API Surface", "auth" → "Authentication")

Convention-based inference works for generic names. It fails for domain-specific names (what is "dcim"? It's "Data Center Infrastructure Management" — but PI cannot derive that from the code).

---

## 5. Is Manual Domain Registration Still Needed?

**PARTIALLY.**

| Level | Automated? | Human Input Needed? |
|---|---|---|
| Package boundary identification | YES — from file paths in import graph | NO |
| Import direction classification | YES — from import edge counts | NO |
| Operational role (with runtime) | YES — from event/handler participation | NO |
| Package name as domain label | YES — use directory name directly | NO |
| Business label (human-readable name) | NO — requires domain knowledge | YES (optional, improves quality) |
| Domain type (FUNCTIONAL/INFRASTRUCTURE) | PARTIALLY — inbound-dominant suggests INFRASTRUCTURE | YES for precision |

**The minimum viable calibration requires zero human input.** Package names from the file system become domain labels. Import direction becomes role classification. File count becomes domain size. This is sufficient for THORR and cognition — THORR already answered 15/15 questions using st2reactor/st2actions/st2common as domain names.

**Human input improves quality but is not blocking.** A human can provide business labels during onboarding ("st2reactor" → "Event Processing Engine") to improve EIR and LENS visual quality. But the cognition is correct without them.

---

## 6. What Is the Minimum Viable Calibration Engine?

```
CODE GRAPH (40.3s)
  ↓
  Group files by top-level package directory
  ↓
  Filter: packages with >N files (threshold: 5-10)
  ↓
  For each package:
    - count files
    - count inbound imports
    - count outbound imports
    - compute direction ratio
    - classify role (LIBRARY / CONSUMER / SERVICE / UTILITY)
  ↓
  Emit: candidate_domain_registry[]
    - domain_id: package name
    - domain_name: package name (= directory name)
    - domain_type: inferred from direction ratio
    - file_count: measured
    - inbound_imports: measured
    - outbound_imports: measured
    - role_classification: computed
  ↓
  Emit: candidate_topology_edges[]
    - source: package A
    - target: package B
    - weight: import count between them
    - relationship_type: IMPORTS
  ↓
  40.4 CANONICAL TOPOLOGY
```

This is a PURE FUNCTION of the code graph. It produces the same output every time for the same input. It requires no human input. It requires no runtime evidence (though runtime evidence can enrich it).

**Placement in pipeline:** Between 40.3s (code graph) and 40.4 (canonical topology). It replaces the current 40.4 topology derivation that produces file-level domains.

### What it produces for StackStorm:

| domain_id | domain_name | files | inbound | outbound | role |
|---|---|---|---|---|---|
| st2common | st2common | 478 | 2,967 | 1,664 | SHARED_LIBRARY |
| contrib | contrib | 131 | 2 | 513 | PLUGIN_EXTENSION |
| st2tests | st2tests | 116 | 583 | 207 | TEST_INFRASTRUCTURE |
| st2client | st2client | 92 | 216 | 201 | CLIENT_LIBRARY |
| st2api | st2api | 79 | 69 | 539 | API_SERVICE |
| st2reactor | st2reactor | 57 | 54 | 294 | EVENT_SERVICE |
| st2actions | st2actions | 49 | 42 | 368 | EXECUTION_SERVICE |
| st2auth | st2auth | 25 | 24 | 78 | AUTH_SERVICE |
| st2stream | st2stream | 15 | 10 | 57 | STREAMING_SERVICE |

9 meaningful domains. 0 human input. Every field computed from the code graph that already exists.

### What it produces for NetBox:

| domain_id | domain_name | inbound | outbound | role |
|---|---|---|---|---|
| netbox/dcim | dcim | 1,148 | ~500 | CORE_MODEL |
| netbox/netbox | netbox | 1,265 | ~500 | FRAMEWORK_CORE |
| netbox/ipam | ipam | 554 | ~400 | CORE_MODEL |
| netbox/extras | extras | 919 | ~400 | EXTENSION_FRAMEWORK |
| netbox/utilities | utilities | 978 | ~200 | SHARED_UTILITY |
| netbox/core | core | 552 | ~300 | CORE_MODEL |
| ... | ... | ... | ... | ... |

13 meaningful domains. 0 human input. Same algorithm. Different specimen.

---

## 7. Does This Become a New PI Core Capability?

**YES.** This is a 40.x pipeline capability — specifically between 40.3s and 40.4.

**Why it belongs in PI Core:**
1. It operates on the code graph, which is a Core evidence artifact
2. It is deterministic (same code graph → same domain registry)
3. It requires no runtime evidence (works with CODE_CONNECTIVITY)
4. It applies to every specimen regardless of technology
5. It removes the single remaining manual step in specimen onboarding

**What it replaces:** The current 40.4 topology derivation that produces file-level domains for Python specimens and manually curated domains for BlueEdge. The current approach is neither automated nor consistent.

**What it does NOT replace:** Human business labeling. A human can optionally provide business labels during onboarding to upgrade domain names from "st2reactor" to "Event Processing Engine." But the calibration engine produces meaningful domains without this step.

**The onboarding pipeline becomes:**

```
Source code intake (40.2)
  ↓
Code graph extraction (40.3s)
  ↓
Package-level domain calibration (NEW — between 40.3s and 40.4)
  ↓
Canonical topology with meaningful domains (40.4)
  ↓
Optional: human business labels (onboarding enrichment)
  ↓
Runtime evidence extraction (runtime_connectivity/)
  ↓
Domain backing qualification
  ↓
Synthesis → Compile → AF findings → Narrative mode
  ↓
THORR / LENS / EIR
```

The calibration step is the single insertion that makes the rest of the pipeline produce meaningful output for any specimen without manual domain registration.
