---
title: Claim Index
node_type: index
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
claim_count: 27
---

## Overview

27 claim families derived from forensic inspection of 5 rendering surfaces and 72 surfaced value fields.

**Full specification:** `docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_claim_inventory_spec.md`

## Structural and Coverage Claims (CLM-01..CLM-07)

| claim_id | label | authoritative_value | traceability | ZONE-2 (LENS) |
|----------|-------|---------------------|-------------|----------------|
| CLM-01 | Coverage Completeness | 100.0% | FULLY TRACEABLE | YES — summary |
| CLM-02 | Structural Unit Count | 30/30 | FULLY TRACEABLE | SUMMARY ONLY — "30 core elements" |
| CLM-03 | Reconstruction State | PASS | FULLY TRACEABLE | YES — "structural consistency confirmed" |
| CLM-04 | Reconstruction Axis Results | 4×PASS | FULLY TRACEABLE | CONDITIONAL (CTO audience) |
| CLM-05 | Escalation Clearance | CLEAR | FULLY TRACEABLE | YES — "no blocking conditions found" |
| CLM-06 | Unknown-Space Count | 0 (caveat) | PARTIAL — minimum observable state | CONDITIONAL — caveat required |
| CLM-07 | Intake Completeness | COMPLETE | FULLY TRACEABLE | YES — "all source data received" |

## Assessment and Scoring Claims (CLM-08..CLM-13)

| claim_id | label | authoritative_value | traceability | ZONE-2 (LENS) |
|----------|-------|---------------------|-------------|----------------|
| CLM-08 | Heuristic Compliance | PASS | FULLY TRACEABLE | CONDITIONAL (CTO audience) |
| CLM-09 | Canonical Score | 60 | FULLY TRACEABLE | YES — "Proven Score: 60" |
| CLM-10 | Projected Score | 100 | FULLY TRACEABLE | YES — with execution caveat |
| CLM-11 | Score Band | CONDITIONAL | FULLY TRACEABLE | YES — "floor established, ceiling defined" |
| CLM-12 | Confidence Range | [60, 100] | FULLY TRACEABLE | YES — "score range confirmed" |
| CLM-13 | Execution Status | NOT_EVALUATED | FULLY TRACEABLE | YES — "execution layer pending" |

## Topology Claims (CLM-14..CLM-17)

| claim_id | label | authoritative_value | traceability | ZONE-2 (LENS) |
|----------|-------|---------------------|-------------|----------------|
| CLM-14 | Domain Count | 17 | FULLY TRACEABLE | YES |
| CLM-15 | Capability Count | 42 | FULLY TRACEABLE | YES |
| CLM-16 | Component Count | 89 | FULLY TRACEABLE | YES |
| CLM-17 | Cross-Domain Overlaps | 0 canonical / 2 envelope | PARTIAL — dual model scope | CONDITIONAL — scope must be stated |

## Signal Claims (CLM-18..CLM-24)

| claim_id | label | authoritative_value | traceability | ZONE-2 (LENS) |
|----------|-------|---------------------|-------------|----------------|
| CLM-18 | Signal Registry Total | 5 | FULLY TRACEABLE | YES |
| CLM-19 | Signal Confidence Distribution | STRONG:2, MODERATE:2, WEAK:1 | FULLY TRACEABLE | YES — with explanation |
| CLM-20 | SIG-001: Sensor Bridge Throughput | STRONG | FULLY TRACEABLE | YES — business_impact only |
| CLM-21 | SIG-002: Seven Unknown Dimensions | STRONG | FULLY TRACEABLE | YES — business_impact + risk |
| CLM-22 | SIG-003: Dependency Load 68% | MODERATE | FULLY TRACEABLE | YES — "15 of 22 connections load-bearing" |
| CLM-23 | SIG-004: Structural Volatility | MODERATE | FULLY TRACEABLE | YES — business_impact |
| CLM-24 | SIG-005: Coordination Pressure | WEAK | PARTIAL — runtime not evaluated | CONDITIONAL — WEAK caveat required |

## Executive Surface Claims (CLM-25..CLM-27)

| claim_id | label | authoritative_value | traceability | ZONE-2 (LENS) |
|----------|-------|---------------------|-------------|----------------|
| CLM-25 | Executive Three-Axis Verdict | STRUCTURE/COMPLEXITY/EXECUTION | CONDITIONAL — CONCEPT-06 gap | YES — primary LENS surface |
| CLM-26 | Business Ontology Phrase Set | 19 active concepts | FULLY TRACEABLE | YES — phrase output only |
| CLM-27 | Full Node Inventory | 148 nodes | FULLY TRACEABLE | ZONE-2: domain names only |

## Traceability Summary

| status | count |
|--------|-------|
| Fully traceable | 22 |
| Partial (documented caveat) | 3 (CLM-06, CLM-17, CLM-24) |
| Conditional (audience-gated or semantic gap) | 2 (CLM-04/08 audience; CLM-25 CONCEPT-06 gap) |
| **Total** | **27** |
