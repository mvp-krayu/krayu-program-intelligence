# Client Onboarding Contract

**Artifact:** PI.CLIENT-ONBOARDING-CONTRACT.01
**Status:** CONTRACT DEFINED + GAP AUDIT
**Date:** 2026-06-12
**Purpose:** Define how a real client enters Program Intelligence from zero. This is the commercial and operational contract the platform must satisfy — not implementation discovery, not pipeline archaeology. The implementation conforms to this contract, not the reverse.

---

## 1. Client Entry Point

What the client sees first.

- **Advisory assessment page** (public) — explains what PI does: structural cognition and evidence-backed operational intelligence over a codebase.
- **Private onboarding link** — issued per engagement; the client's working surface through the lifecycle.
- **Intake form** — collects: organisation, contact, source type, scope, optional runtime/delivery evidence availability.

The entry point is advisory-led. PI is positioned as governed operational cognition, not a scanner. The first promise is an *assessment*, not a dashboard.

---

## 2. Commercial Acceptance

What the client must accept before analysis begins.

| Acceptance item | Requirement |
|---|---|
| Terms & Conditions | Engagement scope, deliverables, liability bounds |
| Confidentiality | Mutual NDA; source treated as confidential |
| Source handling | How source is stored, isolated per client, and for how long |
| Data retention | Retention window; deletion on request; archive disposition |
| Acceptable use | Authorized analysis of code the client owns or is licensed to analyze |
| Analysis limitations | Explicit acknowledgement of §5 (what PI does and does not promise) |

No ingestion begins before `TERMS_ACCEPTED`. Acceptance is recorded and bound to the engagement.

---

## 3. Input Contract

What the client can provide.

| Input | Status |
|---|---|
| GitHub repository URL (public) | REQUIRED (one source of code) |
| GitHub repository URL (private) + read-only token | REQUIRED ALTERNATIVE |
| Source-code archive (ZIP/TAR) | REQUIRED ALTERNATIVE |
| Architecture documents | OPTIONAL — enrich semantic naming |
| Runtime logs / telemetry | OPTIONAL — unlocks runtime evidence (P2+) |
| Incident / deployment data | OPTIONAL — future motion substrate |
| Jira / GitHub project data | OPTIONAL — future delivery substrate |

**Required:** exactly one code source (URL or archive). **Optional:** everything that raises evidence capability. The client is told plainly: more evidence → higher projection authority. Code-only is a valid, bounded engagement.

---

## 4. Access Contract

How PI accesses the material.

- **Public repo** — clone by URL, no credentials.
- **Private repo** — client-issued **read-only** token, scoped to the single repository, revocable, never stored beyond the engagement window.
- **Uploaded archive** — client uploads ZIP/TAR; PI verifies integrity (SHA256) before intake.
- **Read-only, always.** PI never requests write permission, never requests production credentials, never executes the client's code. Static + provided-evidence only.

The access contract is minimal-privilege by design and stated to the client as a guarantee.

---

## 5. Expectation Contract

What PI does and does not promise. Stated to the client before analysis.

**PI promises (code-only):**
- Structural cognition — topology, dependency structure, concentration, coupling
- Evidence-backed findings with explicit evidence basis
- Exposure mapping and execution-blindness indicators
- Governed posture with projection authority (what may be claimed at this evidence level)
- Executive synthesis across audiences

**PI explicitly does NOT promise unless the matching evidence is provided:**
- Complete runtime truth — requires runtime evidence (telemetry/event flow)
- Temporal motion ("is it accelerating/slipping") — requires temporal substrate (commit history / delivery streams)
- PMO forecasting — requires delivery-motion substrate
- Prediction — requires temporal substrate

This is a contractual strength, not a disclaimer: PI's projection authority (S/E/P) **enforces** these limits in the product. The client cannot be shown a runtime claim PI's evidence does not support. Honesty is mechanized.

---

## 6. Onboarding States (client-facing lifecycle)

```
REQUESTED → TERMS_ACCEPTED → INPUT_RECEIVED → ACCESS_VALIDATED
   → INGESTION_STARTED → (INGESTION_FAILED)
   → COGNITION_RUNNING → QUALIFICATION_COMPLETE
   → REPORT_READY → ADVISORY_REVIEW → CLOSED
```

Each state is client-visible with a plain-language status. `INGESTION_FAILED` is a terminal-or-retry branch with a client-safe explanation (§8).

---

## 7. Internal Pipeline Mapping

Each client-facing state maps to internal PI stages:

| Client state | Internal stage(s) |
|---|---|
| INPUT_RECEIVED | source manifest authored; archive registered |
| ACCESS_VALIDATED | Phase 1 Source Boundary (archive existence + SHA256) |
| INGESTION_STARTED | intake → canonical_repo extraction |
| COGNITION_RUNNING | import graph (ISIG) → evidence blocks → signals (PSIG/DPSIG) → semantic/topology (40.x/41.x) |
| QUALIFICATION_COMPLETE | SQO qualification (S0→S1→S2→S3); projection authority (S/E/P) |
| REPORT_READY | Answer Object production → SynthesisContext → LENS binding → assessment package |
| ADVISORY_REVIEW | LENS walkthrough / advisory session (Guide + chips + synthesis) |
| CLOSED | deliverables issued; retention clock starts |

Existing implementation anchors: `PI.LENS.SOURCE-INTAKE.GENERIC.01` (intake contract), `PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.E2E.01` / `run_client_pipeline.py` (orchestrator), SQO promotion lifecycle, `flagshipBinding` + generic semantic resolver (LENS), `AssessmentPackageBuilder` (deliverables).

---

## 8. Failure States and Honest Degradation

Every failure produces a **client-safe explanation**, never a silent engineering fallback.

| Failure | Client-safe outcome |
|---|---|
| Source incomplete | "Provided source is partial; analysis bounded to received scope. [what's missing]" |
| Repo access fails | "Access could not be validated; re-issue read-only token or upload archive." |
| Language unsupported | "Primary language [X] not yet supported; structural depth limited. Supported: [list]." |
| Runtime evidence absent | "No runtime evidence provided — findings are structural; runtime claims withheld (P-level capped)." — NOT a failure, a bounded result |
| Temporal evidence absent | "No temporal evidence — trend/motion analysis unavailable; point-in-time assessment delivered." |
| Import graph fails | "Dependency structure could not be extracted; assessment cannot proceed beyond intake. [reason]" — INGESTION_FAILED |
| Qualification remains S0/S1 | "Assessment is advisory-grade (not governed); findings carry advisory weight. Governance requires [what]." |
| LENS binding missing artifact | INTERNAL error — never shown as a client deliverable; engagement held, not delivered broken |

Distinction enforced: **bounded result** (runtime/temporal absent → honest narrower deliverable) vs **failure** (intake/import broke → cannot proceed). The first is normal and contracted; the second halts with explanation.

---

## 9. Deliverables

What the client receives:

- Onboarding confirmation (states traversed, inputs accepted, access method)
- Evidence intake summary (what was ingested, integrity verified, evidence layers present)
- Qualification status (S-level, projection authority, what it permits)
- Structural intelligence report (topology, concentration, divergence, exposure)
- Executive synthesis (audience-calibrated)
- Findings inventory (with evidence basis per finding)
- Evidence appendix (traceable substrate references)
- Advisory session output (investigation results, resolved questions)
- Optional LENS walkthrough (live four-persona exploration)

---

## 10. Commercial Readiness Gap — Repo Audited Against This Contract

The question is not "what scripts exist." It is: **can the current platform satisfy this onboarding contract?**

| Contract area | Status | Basis |
|---|---|---|
| §1 Client entry point (page/form/link) | **MISSING** | No client-facing intake surface; engagements are operator-initiated via CLI |
| §2 Commercial acceptance (T&C/NDA/retention) | **MISSING** | No acceptance layer in the platform |
| §3 Input contract — archive/clone | **SUPPORTED** | `client.yaml` + `source_manifest.json`; GITHUB_CLONE tar; SHA256 |
| §3 Input contract — required/optional formalized | **PARTIAL** | Manifest is hand-authored, not a contracted intake form |
| §4 Access — uploaded archive, read-only, integrity | **SUPPORTED** | Phase 1 Source Boundary verifies archive + SHA256; read-only by construction |
| §4 Access — private repo token flow | **MANUAL / MISSING** | Archive is pre-cloned by operator; no token-based self-serve clone |
| §5 Expectation contract (honest limits) | **SUPPORTED — strength** | S/E/P projection authority + AQ-001 mechanize honest degradation; runtime/temporal claims are gated, not promised |
| §6 Client-facing onboarding states | **MISSING** | Internal SQO states (S0–S3) exist but are not mapped to a client lifecycle (REQUESTED→CLOSED) |
| §7 Internal pipeline mapping — cognition stages | **SUPPORTED** | Orchestrator phases + cognition pipeline verified on 3 specimens (BlueEdge/StackStorm/NetBox have runs) |
| §7 Raw ingestion executability (fresh run, no reuse) | **UNVERIFIED** | Orchestrator exists; whether it GENERATES from raw tar vs VERIFIES pre-existing intake artifacts is not confirmed. Phase names ("Verification", "present") suggest verification. This is the first thing the INGESTION_STARTED→COGNITION_RUNNING transition must guarantee. **Not masked — flagged.** |
| §8 Failure → client-safe explanation | **MISSING** | Pipeline FAILS CLOSED (RULE-05) with engineering errors; no client-safe translation layer |
| §8 Bounded-result degradation (runtime/temporal absent) | **SUPPORTED** | P-level capping already produces bounded, honest results |
| §9 Deliverables — assessment/evidence/synthesis | **PARTIAL** | `AssessmentPackageBuilder`, structural assessment export, evidence record exist; not assembled as one client onboarding package |
| §9 Advisory / LENS walkthrough | **SUPPORTED** | Four-persona LENS + Guide + chips + synthesis, verified live this session |

### Verdict

**The cognition factory is real and operator-runnable. The client onboarding spine is largely absent.**

- **Strong today:** the cognition engine (ingestion-to-projection pipeline, multi-specimen), honest-degradation machinery (S/E/P + AQ-001), and the advisory surface (LENS four-persona + synthesis). These are the hard parts and they exist.
- **Missing for commercial onboarding:** client entry point, commercial acceptance, client-facing state lifecycle, failure→client-safe translation, packaged deliverable set, and self-serve private-repo access.
- **Must verify before claiming end-to-end onboarding:** that raw ingestion executes for a fresh run from the archive without reusing prior run artifacts (§7 UNVERIFIED — explicitly not masked).

PI can **analyze**. PI cannot yet **onboard a client self-serve**. The gap is not in cognition — it is in the commercial wrapper and one unverified ingestion guarantee. The next concrete validation is narrow and answerable: run the orchestrator for NetBox with a fresh run-id and confirm it builds from `netbox-64d3b11.tar` upward without reading `run_github_netbox_20260520_134600`. That single test resolves the one UNVERIFIED row and converts this audit into a yes/no onboarding-ready statement.
