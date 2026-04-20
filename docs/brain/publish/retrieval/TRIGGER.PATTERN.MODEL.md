---
name: TRIGGER.PATTERN.MODEL
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# TRIGGER.PATTERN.MODEL

## Purpose

Define all observable signals that indicate a publish situation is active. Each trigger maps to a state label that determines which modules apply.

---

## A. Route-Level Signals

| ID | Signal | State Label |
|---|---|---|
| R-01 | Route exists on krayu.be but NOT in `route_source_map.yaml` | UNGOVERNED ROUTE |
| R-02 | Route in `route_source_map.yaml` with `verdict:allowed` but NOT in `pages/` | UNMIRRORED ROUTE |
| R-03 | Route in `pages/` with `publish_status:live` but NOT in sitemap | UNMAPPED ROUTE |
| R-04 | Route in sitemap but NOT in `pages/` | PHANTOM ROUTE |
| R-05 | Route in `route_source_map.yaml` with `verdict:blocked` | BLOCKED ROUTE |
| R-06 | Internal link in any `pages/` file targets a route with no corresponding `pages/` file | DANGLING LINK |

---

## B. Content Signals

| ID | Signal | State Label |
|---|---|---|
| C-01 | Prohibited terminology detected in a `pages/` file (translate, interpret as definition language, advisory in PI definition context) | SEMANTIC DRIFT |
| C-02 | Meta description, OG tags, or visible body content on krayu.be (Base44) does not match corresponding `pages/` content | SURFACE DESYNC |
| C-03 | Claim on a page cannot be traced to a CKR definition or CAT artifact | UNGROUNDED CLAIM |

---

## C. Pipeline Signals

| ID | Signal | State Label |
|---|---|---|
| P-01 | `additive_expansion` page shows `publish_status:preview-pending-publish` after a prior manual promotion to `live` | COMPILE REVERT |
| P-02 | A `pages/` file has been manually edited but its content would be overwritten by the next `build-mirror-from-snapshot.sh` run | NON-DURABLE EDIT |
| P-03 | A file exists in `pages/` with no corresponding entry in `route_source_map.yaml` | UNREGISTERED MIRROR PAGE |

---

## D. Graph Signals

| ID | Signal | State Label |
|---|---|---|
| G-01 | A `pages/` file receives zero inbound links from any other `pages/` file | ISOLATED PAGE |
| G-02 | An expansion or diagnostic page has no contextual link to `/program-intelligence/` | MISSING ROOT LINK |
| G-03 | An ESI or RAG page has no cross-link to its complementary construct | SIGNAL ISOLATION |

---

*TRIGGER.PATTERN.MODEL — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
