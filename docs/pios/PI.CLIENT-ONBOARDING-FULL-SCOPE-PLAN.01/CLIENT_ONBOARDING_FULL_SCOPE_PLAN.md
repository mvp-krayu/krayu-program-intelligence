# Client Onboarding — Full Scope Plan

**Artifact:** PI.CLIENT-ONBOARDING-FULL-SCOPE-PLAN.01
**Status:** PRODUCT SCOPE — design, not implementation
**Date:** 2026-06-12
**Spine:** PI.CLIENT-ONBOARDING-CONTRACT.01
**Rule:** Full commercial onboarding scope from website landing to pipeline activation. No code. No pipeline run. No narrowing to a first chunk.

---

## 1. Public Entry Point

**Positioning.** Program Intelligence is governed operational cognition over a codebase — an evidence-backed structural intelligence assessment, not a scanner or a linter. The public surface sells an *assessment*, advisory-led.

**Call to action.** "Request a Structural Intelligence Assessment." Secondary: "See a sample assessment" (BlueEdge/StackStorm anonymized walkthrough).

**The offer.** A governed assessment of a codebase's structure, concentration, coupling, exposure, and execution-blindness — delivered as an executive synthesis plus a findings inventory with explicit evidence basis.

**Client expectation, stated plainly.**
- What PI analyzes: code structure, dependency topology, domain concentration, structural/operational divergence, exposure surfaces.
- What PI does NOT claim without matching evidence: complete runtime truth, temporal motion/trend, delivery forecasting, prediction.
- Evidence-level honesty: "Your result is bounded by the evidence you provide. Code alone yields structural intelligence. Runtime evidence unlocks runtime claims. We never show you a claim our evidence cannot support."

**Trust / confidentiality language.** Read-only access. No code execution. Per-client isolation. NDA before ingestion. Deletion on request.

**Route into private onboarding.** CTA → intake form → private onboarding link issued per engagement (the client's working surface through the lifecycle).

---

## 2. Commercial Intake Flow

Onboarding UI screens (progressive, one decision per step):

| Screen | Fields |
|---|---|
| Organization | org name, domain, industry (optional) |
| Contact identity | name, email, role; verified email |
| Engagement type | one-off assessment / advisory engagement / recurring (future) |
| Source type | public repo URL · private repo + token · archive upload (ZIP/TAR) |
| Optional evidence | architecture docs · runtime logs · telemetry · deployment data · incidents · GitHub history · Jira/delivery |
| Runtime evidence availability | yes/no/later — drives projection authority preview |
| Temporal evidence availability | yes/no/later — drives motion-claim availability |
| PMO/delivery evidence availability | yes/no/later |
| Intended audience | board / CTO / architect / operator / mixed |
| Urgency / purpose | due diligence · modernization planning · risk review · architecture audit |

The flow ends at the acceptance layer (§3). Each evidence toggle live-updates a **projection authority preview** (§5) so the client sees, before committing, what their evidence selection will and will not unlock.

---

## 3. Commercial Acceptance Layer

Must be accepted before `INGESTION_STARTED`:

- **Terms & Conditions** — engagement scope, deliverables, liability bounds
- **NDA / confidentiality** — mutual; source confidential
- **Data retention** — window, deletion-on-request, archive disposition
- **Source handling** — per-client isolation, storage location, no third-party sharing
- **Authorized-use declaration** — client owns or is licensed to analyze the code
- **Read-only guarantee** — PI requests no write access, no production credentials
- **No-code-execution guarantee** — PI performs static + provided-evidence analysis only
- **Analysis limitations** — explicit acknowledgement of §5/§7 bounds
- **Projection authority limitations** — client acknowledges results are gated by evidence (S/E/P)
- **Acceptance record / audit trail** — signed, timestamped, bound to engagement, immutable

No acceptance → no ingestion. Hard gate.

---

## 4. Client-Facing Lifecycle State Machine

```
REQUESTED → TERMS_ACCEPTED → INPUT_RECEIVED → ACCESS_VALIDATED
   → INGESTION_STARTED → (INGESTION_FAILED ⇄ retry)
   → COGNITION_RUNNING → QUALIFICATION_COMPLETE
   → REPORT_READY → ADVISORY_REVIEW → CLOSED
```

| State | Client label | Explanation | Internal trigger | Allowed transitions | Failure branch | Retry | Client can | Operator can |
|---|---|---|---|---|---|---|---|---|
| REQUESTED | "Assessment requested" | Intake submitted | Intake form complete | →TERMS_ACCEPTED | — | — | edit details | review/accept engagement |
| TERMS_ACCEPTED | "Terms accepted" | Commercial acceptance recorded | AcceptanceRecord signed | →INPUT_RECEIVED | — | — | provide source | issue onboarding link |
| INPUT_RECEIVED | "Source received" | Source provided | URL/token/archive submitted | →ACCESS_VALIDATED | — | re-submit | inspect input |
| ACCESS_VALIDATED | "Access confirmed" | Source reachable + integrity verified | clone ok / SHA256 ok | →INGESTION_STARTED | →INGESTION_FAILED | re-issue token / re-upload | validate manually |
| INGESTION_STARTED | "Reading your source" | Extraction + import graph | orchestrator Phase 1–2 begin | →COGNITION_RUNNING | →INGESTION_FAILED | restart from manifest | restart/override |
| INGESTION_FAILED | "Could not read source" | Client-safe reason (§10) | extraction/import error | →INPUT_RECEIVED (retry) / CLOSED | — | fix input, retry | diagnose, advise |
| COGNITION_RUNNING | "Analyzing structure" | Signals→conditions→semantics | orchestrator Phase 3.x–41.x | →QUALIFICATION_COMPLETE | →INGESTION_FAILED (hard) | — | watch progress | monitor |
| QUALIFICATION_COMPLETE | "Assessment qualified" | S-level + projection authority set | SQO promotion settles | →REPORT_READY | — | view qualification | review S-level |
| REPORT_READY | "Report ready" | Deliverable package assembled | AssessmentPackageBuilder done | →ADVISORY_REVIEW | — | download package | release package |
| ADVISORY_REVIEW | "Advisory session" | LENS walkthrough / Q&A | advisory scheduled | →CLOSED | — | explore LENS, ask | run advisory |
| CLOSED | "Engagement complete" | Delivered; retention clock starts | operator closes | (retention → deletion) | — | request deletion | archive/delete |

---

## 5. State-of-the-Art Onboarding UI

Feels like Stripe / Vercel / Linear / enterprise security onboarding — a premium intelligence cockpit, not a form.

- **Onboarding cockpit** — single surface; the engagement's home through all states.
- **Progress rail** — the 11-state lifecycle as a vertical rail with current position, completed checks, next action.
- **Evidence readiness cards** — one card per evidence class (code/runtime/temporal/delivery): present / absent / "provide to unlock X."
- **Access validation card** — live: clone reachable, integrity verified (SHA256), read-only confirmed.
- **Projection authority preview** — *before* ingestion, shows the S/E/P ceiling this evidence selection will reach and what claims it permits ("Code-only → structural intelligence, P1; add runtime → operational claims, P2").
- **Bounded-result explanation** — when evidence is absent, an honest "here is what you will and will not receive" panel, never a silent gap.
- **Secure source intake panel** — token entry (masked, scoped, revocable) or drag-drop archive with integrity readout.
- **Status timeline** — timestamped event log of the engagement, client-readable.
- **Next-action prompts** — the cockpit always shows the single next thing (accept terms / provide token / review report).
- **Client-safe failure explanations** — failures render as guidance, never stack traces.
- **Advisory package preview** — a contents manifest of the deliverable before download.
- **LENS walkthrough invitation** — "Explore your assessment live" → launches the four-persona LENS surface on the client's run.

---

## 6. Source Intake Architecture

| Mode | Mechanism |
|---|---|
| Public GitHub URL | clone by URL, no credentials |
| Private GitHub read-only token | client-issued, single-repo scope, revocable, never persisted beyond engagement |
| Uploaded ZIP/TAR | client upload; SHA256 integrity verification before intake |
| GitHub App (future) | installed read-only app; finer scope, revocable |

**Integrity.** Every source produces a SHA256 recorded in the source manifest (current contract: `PI.LENS.SOURCE-INTAKE.GENERIC.01`, `source_manifest.json` with `sha256`). **Client isolation.** One storage namespace per client UUID (current: `clients/<uuid>/`). **Storage.** Archive retained in `clients/<client>/archives/`; extraction under the run. **Retention lifecycle.** Window set at acceptance; deletion-on-request; archive disposition recorded. **Deletion.** Removes archive, extracted source, and derived PII; retains anonymized governance lineage only if contractually permitted.

---

## 7. Evidence Contract

**Required:** exactly one code source.
**Optional:** everything that raises evidence capability.

| Evidence class | Unlocks | Claims permitted | Blocked if absent | S/E/P effect |
|---|---|---|---|---|
| Code source (required) | structural cognition | topology, concentration, coupling, divergence, exposure | — | E-STRUCTURAL → P1 |
| Architecture docs | semantic naming | business-labeled domains | richer naming only | enrich, no P change |
| Runtime logs / telemetry | runtime evidence | execution paths, runtime choke points, real operational center | runtime claims withheld | E-RUNTIME → P2 |
| Deployment data | deployment topology | SPOF, blast radius | deployment claims withheld | contributes E-RUNTIME |
| Incidents | (future motion) | recurrence, MTTR | motion claims withheld | future |
| GitHub history | (future temporal) | trend, velocity, churn | trend/motion withheld | future |
| Jira / delivery | (future delivery) | flow, capacity, commitment | PMO claims withheld | future |

The preview (§5) renders this table live as the client toggles evidence. Honest degradation is contractual: absent evidence → bounded result, not failure.

---

## 8. Pipeline Activation Contract

The PI pipeline must NOT start before ALL of:

1. Client record exists
2. Commercial acceptance recorded (AcceptanceRecord signed)
3. Source input received
4. Access validated (reachable + SHA256 verified)
5. Source manifest created
6. Client isolation prepared (namespace)
7. Run ID created
8. Evidence boundary locked (which evidence classes are in scope — fixes the projection ceiling)

Then the activation maps to internal stages:

```
client onboarding
  → source manifest          (source_manifest.json)
  → canonical repo/archive   (extract tar → canonical_repo)        [§16 UNVERIFIED for fresh run]
  → ingestion                (intake)
  → import graph             (ISIG, orchestrator Phase 3.8)
  → evidence blocks          (40.x structural)
  → signals                  (PSIG/DPSIG, Phase 3.x)
  → semantics/topology       (41.x)
  → SQO qualification        (S0→S1→S2→S3; S/E/P authority)
  → Answer Objects           (LENS layer; specimen-agnostic, verified)
  → SynthesisContext         (intent synthesis)
  → LENS binding             (flagshipBinding + generic resolver)
  → report/advisory package  (AssessmentPackageBuilder)
```

Evidence boundary lock (gate 8) is the constitutional tie to AQ-001/S-E-P: the projection ceiling is fixed at activation by what evidence is in scope, so no later stage can over-claim.

---

## 9. Admin / Operator Console

Internal operator view:

- **Client list** — all engagements, current onboarding state, age
- **Onboarding state** — per engagement, with timeline
- **Source validation status** — clone/upload + SHA256 result
- **Run status** — orchestrator phase, pass/fail per phase
- **Failure reason** — internal error + the client-safe message that was shown
- **Retry controls** — re-validate access, restart ingestion, restart from manifest
- **Evidence completeness** — which evidence classes present; resulting ceiling
- **Qualification status** — S-level, projection authority, what it permits
- **Artifact availability** — which run artifacts exist (intake, structure, signals, semantic, SQO, binding, vault)
- **LENS readiness** — does the run bind and render
- **Deliverable readiness** — is the package assembled
- **Manual override rules** — operator may force-advance only with recorded justification; overrides are audited and cannot raise projection authority above evidence
- **Audit log** — every state change, acceptance, override, access event

---

## 10. Failure and Degradation Design

| Failure | Internal error | Client-safe message | Retry action | Operator action | Pause or bounded |
|---|---|---|---|---|---|
| Repo access fails | clone auth/network error | "Access could not be validated — re-issue read-only token or upload an archive." | re-submit access | inspect token scope | PAUSE |
| Bad token | 401/403 | "The access token was rejected. Please issue a read-only token scoped to this repository." | new token | guide scope | PAUSE |
| Archive corruption | SHA256 mismatch / untar fail | "The uploaded archive could not be verified. Please re-upload." | re-upload | verify integrity | PAUSE |
| Unsupported language | parser coverage gap | "Primary language [X] is not yet fully supported; structural depth will be limited." | proceed bounded / decline | confirm scope | BOUNDED |
| Import graph failure | extraction error | "Dependency structure could not be extracted; assessment cannot proceed beyond intake." | fix source, retry | diagnose | PAUSE (cannot proceed) |
| Runtime evidence absent | no runtime layers | "No runtime evidence provided — findings are structural; runtime claims are withheld." | optional: add evidence | none needed | BOUNDED (normal) |
| Temporal evidence absent | no temporal substrate | "No temporal evidence — trend/motion analysis unavailable; point-in-time assessment delivered." | optional: add later | none needed | BOUNDED (normal) |
| Qualification capped S0/S1 | governance gates unmet | "Assessment is advisory-grade; findings carry advisory weight. Governance requires [X]." | optional: deepen | review gates | BOUNDED |
| Missing LENS artifact | binding gap | INTERNAL only — never delivered broken | — | hold, fix, re-bind | PAUSE (internal) |
| Pipeline crash | unhandled exception | "Analysis was interrupted. Our team has been notified." | operator restart | restart, root-cause | PAUSE |
| Incomplete source | partial tree | "Provided source is partial; analysis bounded to received scope. [what's missing]" | provide full source | confirm scope | BOUNDED |

Governing rule: **bounded result** (runtime/temporal/qualification limits → honest narrower deliverable) vs **pause** (access/integrity/import/internal → cannot proceed). The first is contracted-normal; the second halts with a client-safe explanation. Never a silent engineering fallback.

---

## 11. Deliverable Packaging

Client receives one coherent package:

- Onboarding confirmation (states traversed, inputs accepted, access method, integrity hashes)
- Evidence intake summary (ingested artifacts, evidence layers present, ceiling reached)
- Qualification status (S-level, projection authority, what it permits/withholds)
- Structural intelligence report (topology, concentration, divergence, exposure)
- Executive synthesis (audience-calibrated per §2 intended audience)
- Findings inventory (each finding with evidence basis)
- Evidence appendix (traceable substrate references)
- Advisory session output (resolved investigations, answered questions)
- LENS walkthrough link (live four-persona exploration of the run)
- **Limitations / bounded-claims page** (explicit list of what was NOT claimed and why — the honest-degradation record)

Existing anchor: `AssessmentPackageBuilder` (structural assessment export, evidence record) — to be assembled into this single package.

---

## 12. Data Model

| Entity | Purpose | Key fields | Lifecycle | Relationships | Audit |
|---|---|---|---|---|---|
| **Client** | the customer org | id (UUID), name, domain, isolation_namespace | created→active→closed | 1—N Engagement | creation, deletion |
| **Engagement** | one assessment | id, client_id, type, intended_audience, urgency | REQUESTED→CLOSED | N—1 Client; 1—1 AcceptanceRecord; 1—N SourceInput; 1—1 PipelineRun | full state log |
| **AcceptanceRecord** | commercial acceptance | id, engagement_id, terms_version, nda, retention, signatures, timestamp | signed (immutable) | 1—1 Engagement | immutable, signed |
| **SourceInput** | what client provided | id, engagement_id, type(url/token/archive), ref, received_at | received→validated→failed | N—1 Engagement; 1—1 SourceManifest | access events |
| **SourceManifest** | normalized source descriptor | source_id, archive_type, archive_path, sha256, intake_contract, extracted_path | created (immutable) | 1—1 SourceInput | integrity hash |
| **EvidencePackage** | optional evidence set | id, engagement_id, classes_present[], boundary_locked | assembled→locked | N—1 Engagement | boundary lock |
| **PipelineRun** | one orchestrator run | run_id, engagement_id, phase_status[], started, ended | created→running→complete/failed | 1—1 Engagement; 1—1 ArtifactManifest | per-phase log |
| **OnboardingState** | client-facing state | engagement_id, state, entered_at | transitions per §4 | N—1 Engagement | every transition |
| **PipelineState** | internal stage state | run_id, stage, status | per stage | N—1 PipelineRun | every stage |
| **QualificationState** | SQO position | run_id, s_level, e_capability, p_authority, provenance | S0→S3 | 1—1 PipelineRun | promotion lineage |
| **ArtifactManifest** | produced artifacts + hashes | run_id, artifacts[]{path, sha256} | grows per phase | 1—1 PipelineRun | hashes |
| **DeliverablePackage** | client package | id, engagement_id, contents[], released_at | assembled→released | 1—1 Engagement | release event |
| **AdvisorySession** | walkthrough/Q&A | id, engagement_id, investigations[], notes | scheduled→complete | N—1 Engagement | session log |

---

## 13. Security / Compliance Baseline

Commercial minimum:

- **Read-only source access** — no write scope ever requested
- **No production credentials** — never requested, never accepted
- **No code execution** — static + provided-evidence only
- **Per-client isolation** — storage namespaced by client UUID; no cross-client read paths
- **Token handling** — masked input, single-repo scope, revocable, never persisted beyond engagement, never logged in clear
- **Archive handling** — integrity-verified (SHA256), isolated, retention-bound
- **Retention / deletion** — window at acceptance; deletion-on-request; verified removal of source + derived PII
- **Audit log** — immutable record of state changes, acceptance, access, overrides
- **Operator access control** — role-gated console; overrides require recorded justification and cannot raise projection authority above evidence
- **Client data boundaries** — deliverables contain no other client's data; anonymized samples only with consent

---

## 14. Product Architecture

```
PUBLIC SITE                 marketing + assessment offer + sample walkthrough
   │ CTA
PRIVATE ONBOARDING PORTAL   the client cockpit (§5); lifecycle, evidence, intake, status, deliverables
   │
ADMIN CONSOLE               operator view (§9)
   │
┌──────────────── services ────────────────┐
│ Contract Acceptance Service   acceptance records, terms versioning, audit
│ Source Intake Service         clone/token/upload, SHA256, manifest, isolation, retention
│ Pipeline Orchestration Service  wraps run_client_pipeline.py; activation gates (§8); phase status
│ Artifact Registry             ArtifactManifest, hashes, availability
│ Status Event Bus              state transitions → portal + console + notifications
│ Notification Layer            client + operator events (email/in-app)
│ LENS Launch Handoff           binds a completed run into the four-persona LENS surface
└────────────────────────────────────────────┘
```

Frontend: public site (static/marketing), private portal (authenticated, per-engagement), admin console (role-gated). Backend: the seven services. The existing cognition pipeline sits behind Pipeline Orchestration Service; the existing LENS flagship is reached via LENS Launch Handoff.

---

## 15. Implementation Roadmap (scope preserved, sequenced)

| Phase | Goal | Resolves |
|---|---|---|
| **Phase 0 — Fresh NetBox raw-ingestion proof** | Run orchestrator for NetBox with a fresh run-id; confirm it builds from `netbox-64d3b11.tar` upward WITHOUT reading `run_github_netbox_20260520_134600`. | The one UNVERIFIED row in the contract; proves the cognition factory ingests from raw |
| **Phase 1 — Manual-assisted onboarding** | Operator onboards a client per the contract using admin/manual controls; states tracked, acceptance recorded, deliverable assembled by hand | §4, §9 (manual), §11 |
| **Phase 2 — Client portal MVP** | Client submits source, accepts terms, sees lifecycle status | §2, §3, §4 (client-facing), §5 (core) |
| **Phase 3 — Private repo / token flow** | Secure self-serve private-repo access | §6 token mode, §13 token handling |
| **Phase 4 — Deliverable package automation** | Client receives coherent assessment package automatically | §11, AssessmentPackageBuilder assembly |
| **Phase 5 — Premium onboarding UI polish** | State-of-the-art UX + advisory walkthrough | §5 full, LENS handoff |
| **Phase 6 — Motion substrate (later)** | GitHub/Jira/temporal evidence optional extension | unblocks temporal (PI.TEMPORAL-COGNITION.01 substrate dependency) |

Phase 0 is the gate. Nothing commercial is real until the factory provably ingests from raw for a fresh client.

---

## 16. Gap Audit — Full Scope vs Current Repo

| Scope item | Status |
|---|---|
| Public entry point / site | **MISSING** |
| Commercial intake flow (screens) | **MISSING** |
| Commercial acceptance layer | **MISSING** |
| Client-facing lifecycle state machine | **MISSING** (internal SQO states exist; not client-mapped) |
| SOTA onboarding UI / cockpit | **MISSING** |
| Source intake — archive + SHA256 | **SUPPORTED** (`source_manifest.json`, GITHUB_CLONE tar) |
| Source intake — public URL clone | **PARTIAL** (archive pre-cloned by operator; no in-product clone) |
| Source intake — private token flow | **MISSING** |
| Source intake — client isolation | **SUPPORTED** (per-UUID namespaces under `clients/`) |
| Evidence contract — honest gating | **SUPPORTED — strength** (S/E/P + AQ-001 mechanize limits) |
| Evidence preview UI | **MISSING** |
| Pipeline activation gates (1–8) | **PARTIAL** (orchestrator has source-boundary + manifest; full 8-gate precondition set not enforced as one contract) |
| Raw ingestion executability (fresh run) | **UNVERIFIED** (Phase 0 resolves) |
| Cognition pipeline (ingestion→projection) | **SUPPORTED** (verified on BlueEdge/StackStorm this session; NetBox has runs) |
| SQO qualification | **SUPPORTED** |
| Answer Objects (specimen-agnostic) | **SUPPORTED** (verified cross-specimen) |
| SynthesisContext / intent synthesis | **SUPPORTED** |
| LENS binding + four-persona advisory | **SUPPORTED** (verified live) |
| Admin/operator console | **MISSING** (orchestrator is CLI; no console) |
| Failure → client-safe translation | **MISSING** (fails closed with engineering errors) |
| Bounded-result degradation | **SUPPORTED** (P-level capping) |
| Deliverable packaging (assembled) | **PARTIAL** (`AssessmentPackageBuilder` + exports exist; not one package) |
| Data model (entities) | **PARTIAL** (Client/Run/Manifest/Qualification exist as artifacts; Engagement/Acceptance/OnboardingState/DeliverablePackage/AdvisorySession not modeled) |
| Security baseline — read-only/no-exec/isolation | **SUPPORTED** (by construction) |
| Security — token handling, retention/deletion, audit log | **MISSING** (no token flow, no retention lifecycle, no acceptance audit) |
| Product architecture services | **MISSING** (no acceptance/intake/orchestration services or event bus; orchestrator is a script) |

**Honest summary.** The **cognition factory and advisory surface are SUPPORTED** — the hard intelligence work exists and is verified across specimens, with honest degradation mechanized (a genuine commercial strength). **Everything that wraps it into a client product is MISSING**: entry point, acceptance, client lifecycle, portal, console, token flow, failure translation, packaged deliverables, retention/audit, and the service architecture. One capability is **UNVERIFIED** (fresh raw ingestion) and is the Phase 0 gate.

PI has built the engine and the cockpit instrument; it has not built the dealership, the keys, or the paperwork. The plan above is the dealership.

---

## 17. Decision Point

This is the full scope. Nothing here is built beyond what §16 marks SUPPORTED/PARTIAL. The recommended first move is **Phase 0** — the single test that converts the UNVERIFIED row into a yes/no and proves the factory ingests from raw for a fresh client. Everything commercial depends on that gate.

Do not build until the phase is chosen. The scope is now explicit; the build decision is yours.
