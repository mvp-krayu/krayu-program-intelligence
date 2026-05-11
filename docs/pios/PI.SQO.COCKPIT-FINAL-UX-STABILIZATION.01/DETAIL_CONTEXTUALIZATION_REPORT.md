# Detail Contextualization Report

## Problem

Detail pages (debt, continuity, maturity, progression, evidence, handoff) felt
like raw data dumps with no orientation for the operator.

## Solution

Added SECTION_CONTEXT map in SQOWorkspacePanel providing:
- **title**: Section display name
- **purpose**: What this page is for
- **focus**: What the operator should look at first
- **type**: Classification as "forensic detail" or "operational guidance"

## Section Contexts

| Section | Type | Purpose |
|---------|------|---------|
| Semantic Debt | operational guidance | Forensic qualification debt inspection |
| Continuity Assessment | forensic detail | Semantic continuity validation and crosswalk coverage |
| Maturity Profile | forensic detail | Structural maturity assessment across dimensions |
| Progression Readiness | operational guidance | State transition readiness and gate validation |
| Evidence & Replay | forensic detail | Evidence chain replay and artifact traceability |
| PATH B Handoff | operational guidance | PATH B handoff readiness and activation boundary |

## Visual Treatment

- Type badge: 9px uppercase monospace with border
- Title: 18px bold monospace
- Purpose: 13px sans-serif, dim color
- Focus: 12px sans-serif, muted color, italic
- Back button: "← Overview" in accent color

## Panel Components

All 6 section panel components remain UNMODIFIED.
Framing is added as a wrapper in SQOWorkspacePanel, not inside panels.
