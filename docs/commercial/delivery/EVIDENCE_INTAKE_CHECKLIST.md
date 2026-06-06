# Signäl — Evidence Intake Checklist

> **Purpose:** This checklist defines what the customer provides for a Structural Assessment engagement. Hand this to the customer after engagement agreement. The customer can prepare evidence independently — no ambiguity about what is needed.

> **Applies to:** SA, SA-DD, SC (initial), SE (per-program)

---

## Overview

Signäl's structural intelligence is derived from your program's actual code structure — not from interviews, workshops, or self-reported status. We need read-only access to your codebase and supporting artifacts. Nothing more.

**Total customer effort:** 1-2 hours of preparation. One 30-minute intake session.

---

## Required Evidence

### 1. Source Code Repository (REQUIRED)

| Item | Detail |
|------|--------|
| **What** | Read-only access to the program's primary source code repository |
| **Format** | Git repository (GitHub, GitLab, Bitbucket, Azure DevOps, or self-hosted). Alternatively: repository archive (.zip / .tar.gz of the repository including .git history) |
| **Scope** | The main application repository. If the program spans multiple repositories, identify the primary repository and list additional repositories that may be in scope. |
| **Access method** | Option A: Read-only deploy key or access token (preferred — enables automated ingestion). Option B: Repository archive delivered via secure file transfer. |
| **Retention** | Signäl processes your code for structural analysis only. Source code is not retained after the engagement unless explicitly agreed. Evidence artifacts (topology, structural metrics) are retained for deliverable production. |

**What we extract:** File structure, import/dependency relationships, class and function definitions, module boundaries. We do NOT execute your code, access runtime environments, or read application data.

---

### 2. Dependency Manifest (REQUIRED)

| Item | Detail |
|------|--------|
| **What** | Package dependency files from the repository |
| **Format** | `package.json`, `requirements.txt`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, `Gemfile`, or equivalent for your technology stack |
| **Note** | These are typically already in the repository. If dependencies are managed outside the repository, please provide them separately. |

---

### 3. Architectural Context (RECOMMENDED)

| Item | Detail |
|------|--------|
| **What** | Any existing architectural documentation that describes intended domain boundaries, module ownership, or system decomposition |
| **Format** | Architecture diagrams, domain model documents, service boundary definitions, module ownership maps — any format |
| **Why** | Enables Signäl to compare structural reality against intended architecture. Without this, the assessment derives domain boundaries from structural evidence alone (which is still valid, but the comparison adds value). |
| **If unavailable** | Not a blocker. The assessment proceeds with structurally derived boundaries. Many customers find the structurally derived topology more accurate than their documented architecture. |

---

### 4. Program Context (RECOMMENDED)

| Item | Detail |
|------|--------|
| **What** | Brief description of the program: technology stack, team structure, approximate age, known architectural concerns |
| **Format** | Free text — email, document, or verbal during intake session |
| **Why** | Helps Signäl calibrate the advisory session. The structural analysis is evidence-driven and does not depend on this context, but the advisory conversation benefits from understanding your operational priorities. |

---

## Not Required

The following are explicitly NOT required:

| Item | Why Not Required |
|------|-----------------|
| Runtime environment access | Structural analysis operates on code topology, not runtime behavior |
| Database access | Not part of structural analysis |
| CI/CD pipeline access | Not required for structural topology derivation |
| Deployment credentials | Not required |
| Application data | Not accessed or analyzed |
| Jira / project management access | Not required for SA (may be relevant for future evidence sources) |
| Interviews or workshops | The intelligence is derived from evidence, not from conversations |

---

## Intake Process

| Step | Who | Duration | What Happens |
|------|-----|----------|-------------|
| 1. Customer receives this checklist | Customer | — | Customer reviews and prepares evidence |
| 2. Intake session | Customer + Signäl | 30 min | Walk through prepared evidence, confirm repository scope, establish access, clarify program context |
| 3. Access verification | Signäl | 15 min | Signäl confirms repository access works, dependency manifests are present, evidence is sufficient to proceed |
| 4. Confirmation | Signäl → Customer | — | Signäl confirms evidence intake is complete and structural analysis will begin |

---

## Confidentiality

All evidence provided is subject to the confidentiality terms in the engagement agreement. Signäl's structural analysis processes code topology — file structure, dependency relationships, module boundaries — not application logic, business data, or proprietary algorithms.

Source code access is used exclusively for structural topology extraction and is not retained after the engagement unless explicitly agreed in writing.

---

## Preparation Checklist

Before the intake session, please confirm:

- [ ] Primary repository identified and access prepared (deploy key, token, or archive)
- [ ] Dependency manifests available (usually already in repository)
- [ ] Architectural documentation gathered (if available — not required)
- [ ] Brief program description prepared (technology stack, team size, known concerns)
- [ ] Technical contact identified for access questions during analysis phase

---

## Questions?

Contact your Signäl representative. The intake process is designed to be lightweight — most customers complete preparation in under an hour.
