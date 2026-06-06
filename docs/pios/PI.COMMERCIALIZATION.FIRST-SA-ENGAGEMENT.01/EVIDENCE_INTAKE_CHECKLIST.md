# Signäl Structural Assessment — Evidence Intake Checklist

> **Purpose:** This document defines what the customer provides before a Structural Assessment begins. A salesperson hands this to the customer after the engagement is confirmed. The customer prepares evidence independently using this checklist.

> **Timeline:** Evidence should be provided within 1-2 business days of engagement confirmation. Signäl begins structural analysis upon receipt.

---

## What We Need

Signäl reconstructs your program's structural topology from evidence you provide. We do not require access to your production environment, CI/CD pipeline, or internal systems. All analysis operates on a static evidence snapshot.

---

## Required Evidence

### 1. Repository Access (Read-Only)

| Item | Detail |
|------|--------|
| **What** | Read-only access to the source code repository (or repositories) that constitute the program under assessment |
| **Format** | Git clone URL with read-only credentials, OR a full repository archive (ZIP/tar.gz of the repository including `.git` history) |
| **Scope** | All source code, configuration files, and dependency manifests for the program. Include all repositories if the program spans multiple repositories. |
| **What we do NOT need** | Write access, CI/CD credentials, deployment keys, secrets, environment variables, production database access |

**Access options (in order of preference):**

1. **Temporary read-only deploy key** — added to the repository for the duration of the assessment, revoked after delivery
2. **Repository archive** — `git clone --mirror` export provided as a file transfer
3. **Read-only access token** — scoped to the specific repository/organization

### 2. Dependency Manifest

| Item | Detail |
|------|--------|
| **What** | The dependency declaration files for the program |
| **Examples** | `package.json` + `package-lock.json` (Node.js), `requirements.txt` + `Pipfile.lock` (Python), `pom.xml` / `build.gradle` (Java), `go.mod` (Go), `Gemfile.lock` (Ruby), `Cargo.toml` (Rust) |
| **Why** | Dependency structure is a primary input to structural topology reconstruction. Lock files provide the resolved dependency graph. |
| **Note** | These are typically included in the repository. If your dependency manifests are generated or stored separately, please provide them explicitly. |

### 3. Program Scope Definition

| Item | Detail |
|------|--------|
| **What** | A brief description of what constitutes "the program" — the bounded execution scope under assessment |
| **Format** | 1-2 paragraphs or a bullet list. No formal document required. |
| **Include** | What the program does (e.g., "payments platform," "customer portal," "data pipeline"). Which repositories are included. Approximate scale (number of services, rough codebase age, team size). |
| **Why** | Signäl determines structural boundaries from the evidence, but knowing the program's intended scope helps us verify that the topology we reconstruct matches the system you operate. |

---

## Recommended (Not Required)

These items improve assessment depth but are not blockers. Provide them if readily available.

### 4. Architectural Documentation

| Item | Detail |
|------|--------|
| **What** | Any existing documentation describing the intended architecture: system diagrams, service maps, domain boundaries, module ownership |
| **Format** | Whatever exists. Diagrams, wiki pages, architecture decision records, design documents. No specific format required. |
| **Why** | Comparing intended architecture to structural reality reveals boundary divergence — where the system has drifted from its design. This is one of the most valuable findings in a Structural Assessment. |
| **If unavailable** | The assessment proceeds without it. Structural topology is reconstructed from code evidence, not from documentation. |

### 5. Known Concerns

| Item | Detail |
|------|--------|
| **What** | Any structural concerns the team already suspects — areas that feel fragile, components that resist change, modules that accumulate bugs, regions that slow down development |
| **Format** | Informal. A few sentences or bullet points. |
| **Why** | We do not use this as input to the analysis. We use it as validation — if our structural findings independently confirm what the team already suspects, the assessment has immediate credibility. If our findings reveal something the team did NOT suspect, that is the highest-value discovery. |

---

## What We Do NOT Need

| Item | Why Not |
|------|---------|
| Production environment access | Analysis operates on static evidence, not live systems |
| Database access or data exports | Structural analysis examines code structure, not runtime data |
| CI/CD pipeline access | We do not execute the code or run builds |
| Secrets, API keys, credentials | Evidence intake is read-only source code analysis. Remove `.env` files or secrets from archives before sending. |
| Test results or coverage reports | Structural topology is derived from code structure, not test outcomes |
| Jira, Linear, or project management exports | Structural analysis is evidence-based, not process-based |

---

## Confidentiality

All evidence provided is treated as confidential. Signäl does not retain source code beyond the assessment engagement period. Repository access credentials are used solely for evidence intake and are revoked or destroyed upon assessment completion.

Confidentiality terms are defined in the engagement letter.

---

## Evidence Transfer

| Method | Detail |
|--------|--------|
| **Preferred** | Secure file transfer (customer's preferred method) or temporary repository access |
| **Accepted** | Encrypted archive via secure transfer, private repository clone URL |
| **Not accepted** | Unencrypted email attachments |

---

## After You Provide Evidence

| Step | Timeline |
|------|----------|
| Evidence receipt confirmation | Same day |
| Structural analysis begins | Day 1-2 |
| LENS access provisioned + Structural Assessment generated | Day 3-4 |
| Advisory session scheduled | Day 4-5 |

Total engagement: 3-5 business days from evidence receipt to advisory delivery.

---

## Questions?

Contact your Signäl engagement lead. If anything on this checklist is unclear or your environment has specific constraints (monorepo structure, generated code, multi-language codebase), let us know — we adapt the intake to your context.
