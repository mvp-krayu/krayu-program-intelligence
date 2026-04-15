---
title: Protocols
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Index of governing protocols that define execution procedures for the GAUGE operational chain. All entries link by path only.

## Classification

canonical-doc

## Protocol Index

| protocol | path | governs |
|----------|------|---------|
| Fresh Run Bootstrap Protocol | `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/fresh_run_bootstrap_protocol.md` | S0 bootstrap; AC gate schema; engine_state.json initialization |
| Bootstrap Chain Authority | `docs/psee/BOOTSTRAP.CHAIN.AUTHORITY.01/bootstrap_chain_authority.md` | Bootstrap chain authority and ordering |

## Linked Contracts

See [[Contracts]] for contract index.

## Determinism / Constraint Notes

Protocols define how steps are executed and in what order. The AC (Artifact Completeness) gate conditions validated by `pios validate freshness` are defined in the bootstrap protocol.
