#!/usr/bin/env python3
"""
build_evidence_vault.py — Deterministic PiOS Evidence Vault Generator
Stream: PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01

Reads source artifacts from a client/run package and emits a complete
Obsidian evidence vault instance. Fails closed on missing required artifacts.

Usage:
    python scripts/psee/build_evidence_vault.py \
        --client blueedge \
        --run run_authoritative_recomputed_01 \
        --output-dir clients/blueedge/vaults/run_01_authoritative_generated

Optional:
    --client-name "BlueEdge Fleet Management Platform"
    --signal-registry path/to/signal_registry.json
    --binding-envelope path/to/binding_envelope.json
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

STREAM_ID = "PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01"
VAULT_SCHEMA = "PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01"

REQUIRED_PACKAGE_ARTIFACTS = [
    "gauge_state.json",
    "coverage_state.json",
    "reconstruction_state.json",
    "canonical_topology.json",
    "signal_registry.json",
]


# ─── Data Model ───────────────────────────────────────────────────────────────

@dataclass
class SignalData:
    signal_id: str
    title: str
    statement: str
    evidence_confidence: str
    business_impact: str
    risk: str
    domain_name: str
    capability_name: str
    component_names: List[str]
    source_refs: List[str]


@dataclass
class VaultModel:
    run_id: str
    client_id: str
    client_name: str

    # DIM-01 Coverage
    coverage_percent: float
    required_units: int
    admissible_units: int

    # DIM-02 Reconstruction
    reconstruction_state: str
    axis_results: Dict[str, str]
    reconstruction_points: int

    # DIM-03 Escalation Clearance
    escalation_clearance: str

    # DIM-04 Unknown Space
    unknown_space_count: int
    unknown_space_caveat: str

    # DIM-05 Intake Completeness
    intake_completeness: str

    # DIM-06 Heuristic Compliance
    heuristic_compliance: str

    # Execution state
    execution_status: str
    execution_layer_evaluated: bool
    execution_mode: str
    terminal_state_basis: str

    # Score
    score_canonical: int
    score_projected: int
    score_band_label: str
    score_derivation: str
    completion_points: int
    coverage_points: int

    # Confidence
    confidence_lower: int
    confidence_upper: int
    confidence_status: str

    # Topology
    domain_count: int
    capability_count: int
    component_count: int
    total_nodes: int
    domain_names: List[str]
    canonical_cross_domain_overlaps: int

    # Signals
    total_signals: int
    signals: List[SignalData]
    signal_confidence_dist: Dict[str, int]

    # Optional: envelope
    has_envelope: bool = False
    envelope_overlap_count: int = 0
    envelope_usp_count: int = 0
    envelope_node_count: int = 0

    # Optional: admissibility
    has_admissibility: bool = False
    admissibility_admitted: int = 0
    admissibility_excluded: int = 0

    @property
    def structure_verdict(self) -> str:
        if self.coverage_percent == 100.0 and self.reconstruction_state == "PASS":
            return "STRONG"
        if self.coverage_percent >= 90.0 and self.reconstruction_state == "PASS":
            return "MODERATE"
        return "WEAK"

    @property
    def complexity_verdict(self) -> str:
        if self.canonical_cross_domain_overlaps == 0:
            return "LOW"
        if self.canonical_cross_domain_overlaps <= 2:
            return "MODERATE"
        return "HIGH"

    @property
    def execution_verdict(self) -> str:
        if self.execution_status == "NOT_EVALUATED":
            return "UNKNOWN"
        return "VERIFIED"

    @property
    def executive_verdict_str(self) -> str:
        return (f"STRUCTURE · {self.structure_verdict} / "
                f"COMPLEXITY · {self.complexity_verdict} / "
                f"EXECUTION · {self.execution_verdict}")

    def signal_by_id(self, sig_id: str) -> Optional[SignalData]:
        for s in self.signals:
            if s.signal_id == sig_id:
                return s
        return None


# ─── Artifact Loading ─────────────────────────────────────────────────────────

def load_json(path: Path) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"FAIL: Required artifact not found: {path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"FAIL: Invalid JSON in {path}: {e}", file=sys.stderr)
        sys.exit(1)


def try_load_json(path: Path) -> Optional[dict]:
    if not path or not path.exists():
        return None
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def find_admissibility_log(run_dir: Path) -> Optional[Path]:
    for candidate in [
        run_dir / "package" / "admissibility_log.json",
        run_dir / "ig" / "admissibility_log.json",
        run_dir / "admissibility_log.json",
    ]:
        if candidate.exists():
            return candidate
    return None


def build_vault_model(
    run_id: str,
    client_id: str,
    client_name: str,
    package_dir: Path,
    run_dir: Path,
    signal_registry_override: Optional[Path],
    binding_envelope_path: Optional[Path],
) -> VaultModel:
    for name in REQUIRED_PACKAGE_ARTIFACTS:
        if not (package_dir / name).exists():
            print(f"FAIL: Required artifact missing: {package_dir / name}", file=sys.stderr)
            sys.exit(1)

    gauge = load_json(package_dir / "gauge_state.json")
    load_json(package_dir / "coverage_state.json")   # verify loadable
    recon = load_json(package_dir / "reconstruction_state.json")
    topology = load_json(package_dir / "canonical_topology.json")

    if signal_registry_override and signal_registry_override.exists():
        signals_raw = load_json(signal_registry_override)
    else:
        signals_raw = load_json(package_dir / "signal_registry.json")

    adm = try_load_json(find_admissibility_log(run_dir))
    env = try_load_json(binding_envelope_path)

    state = gauge["state"]
    dims = gauge["dimensions"]
    score = gauge["score"]
    conf = gauge["confidence"]

    dim01 = dims["DIM-01"]
    dim02 = dims["DIM-02"]
    dim03 = dims["DIM-03"]
    dim04 = dims["DIM-04"]
    dim05 = dims["DIM-05"]
    dim06 = dims["DIM-06"]

    topo_counts = topology["counts"]
    domain_names = [d["domain_name"] for d in topology.get("domains", [])]
    canonical_overlaps = sum(
        1 for d in topology.get("domains", []) if d.get("cross_domain", False)
    )

    signals: List[SignalData] = []
    conf_dist: Dict[str, int] = {}
    for s in signals_raw.get("signals", []):
        signals.append(SignalData(
            signal_id=s["signal_id"],
            title=s["title"],
            statement=s.get("statement", ""),
            evidence_confidence=s.get("evidence_confidence", "UNKNOWN"),
            business_impact=s.get("business_impact", ""),
            risk=s.get("risk", ""),
            domain_name=s.get("domain_name", ""),
            capability_name=s.get("capability_name", ""),
            component_names=s.get("component_names", []),
            source_refs=s.get("source_refs", []),
        ))
        c = s.get("evidence_confidence", "UNKNOWN")
        conf_dist[c] = conf_dist.get(c, 0) + 1

    has_envelope = env is not None
    envelope_overlap_count = 0
    envelope_usp_count = 0
    envelope_node_count = 0
    if env:
        envelope_overlap_count = len([e for e in env.get("edges", []) if e.get("cross_domain")])
        envelope_usp_count = len(env.get("usp_records", []))
        envelope_node_count = len(env.get("nodes", []))

    has_adm = adm is not None
    adm_admitted = adm.get("summary", {}).get("admitted", 0) if adm else 0
    adm_excluded = adm.get("summary", {}).get("excluded", 0) if adm else 0

    # axis_results from recon artifact (authoritative) or gauge fallback
    axis_results = recon.get("axis_results", dim02.get("axis_results", {}))

    return VaultModel(
        run_id=run_id,
        client_id=client_id,
        client_name=client_name,
        coverage_percent=dim01["coverage_percent"],
        required_units=dim01["required_units"],
        admissible_units=dim01["admissible_units"],
        reconstruction_state=dim02["state"],
        axis_results=axis_results,
        reconstruction_points=dim02["reconstruction_points"],
        escalation_clearance=dim03["state_label"],
        unknown_space_count=dim04["total_count"],
        unknown_space_caveat=dim04.get("caveat", ""),
        intake_completeness=dim05["state"],
        heuristic_compliance=dim06["state"],
        execution_status=state["execution_status"],
        execution_layer_evaluated=state.get("execution_layer_evaluated", False),
        execution_mode=state.get("execution_mode", "STRUCTURAL_ONLY"),
        terminal_state_basis=state.get("terminal_state_basis", ""),
        score_canonical=score["canonical"],
        score_projected=score["projected"],
        score_band_label=score["band_label"],
        score_derivation=score["derivation"],
        completion_points=score["components"]["completion_points"],
        coverage_points=score["components"]["coverage_points"],
        confidence_lower=conf["lower"],
        confidence_upper=conf["upper"],
        confidence_status=conf["status"],
        domain_count=topo_counts["domains"],
        capability_count=topo_counts["capabilities"],
        component_count=topo_counts["components"],
        total_nodes=topo_counts["total_nodes"],
        domain_names=domain_names,
        canonical_cross_domain_overlaps=canonical_overlaps,
        total_signals=signals_raw["total_signals"],
        signals=signals,
        signal_confidence_dist=conf_dist,
        has_envelope=has_envelope,
        envelope_overlap_count=envelope_overlap_count,
        envelope_usp_count=envelope_usp_count,
        envelope_node_count=envelope_node_count,
        has_admissibility=has_adm,
        admissibility_admitted=adm_admitted,
        admissibility_excluded=adm_excluded,
    )


# ─── Template Helpers ─────────────────────────────────────────────────────────

def fm(**kwargs) -> str:
    lines = ["---"]
    for k, v in kwargs.items():
        lines.append(f"{k}: {v}")
    lines.append("---\n")
    return "\n".join(lines)


def wl(*titles) -> str:
    return " ".join(f"[[{t}]]" for t in titles)


def conf_dist_str(dist: Dict[str, int]) -> str:
    parts = []
    for c in ["STRONG", "MODERATE", "WEAK"]:
        if c in dist:
            parts.append(f"{c}:{dist[c]}")
    return ", ".join(parts)


def axis_table(results: Dict[str, str]) -> str:
    lines = ["| axis | result |", "|------|--------|"]
    for axis, result in results.items():
        lines.append(f"| {axis} | {result} |")
    return "\n".join(lines)


# ─── Root Nodes ───────────────────────────────────────────────────────────────

def gen_evidence_vault_root(m: VaultModel) -> str:
    return f"""{fm(title="EVIDENCE VAULT V2", node_type="root", client=m.client_id, status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Evidence Vault — {m.client_name}

**Run:** `{m.run_id}`
**Stream:** {VAULT_SCHEMA}

This vault is the evidence backbone for the {m.client_name} structural assessment.
Every number, verdict, and signal traces to a verified artifact in the locked baseline.

## Entry Point

→ [[VAULT ENTRY — {m.client_name}]]

## Structure

| section | purpose |
|---------|---------|
| `00 — Meta/` | Claim index, entity index, vault governance |
| `00 — Navigation/` | Guided paths: top claims, core artifacts, value creation |
| `claims/` | {27} governed claim nodes (CLM-01..CLM-27) |
| `entities/` | 7 entity families |
| `artifacts/` | 7 source artifact nodes |
| `transformations/` | 6 transformation nodes |
| `client-lineage/` | Full S0→S4→product evidence chain |
| `governance/` | Exposure zones, LENS admissibility, known gaps |

## Governing Principle

Not everything traceable should be client-visible.
Everything visible must be traceable.

**Authority:** {VAULT_SCHEMA}
"""


def gen_vault_entry(m: VaultModel) -> str:
    sig_dist = conf_dist_str(m.signal_confidence_dist)
    if m.total_signals > 0:
        signal_nav_block = (
            "**What the platform does not yet reveal:**\n"
            "→ [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]"
            " — the most commercially significant finding in this assessment\n\n"
            "**Key signal:**\n"
            "→ [[CLM-20 SIG-001 Sensor Bridge Throughput]]"
            " — data pathway throughput; runtime performance unknown"
        )
        unknown_nav_prefix = "[[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] → "
    else:
        signal_nav_block = (
            "**Signal layer:** NOT_EVALUATED"
            " — signal intelligence claims not generated pending PiOS 41.4 execution."
        )
        unknown_nav_prefix = ""
    return f"""{fm(title=f"VAULT ENTRY — {m.client_name}", node_type="entry", client=m.client_id, status="ACTIVE", stream_id=VAULT_SCHEMA)}
## What This Vault Is

This is the evidence vault for the {m.client_name} structural assessment. Every number, verdict, and signal in this vault traces backward to a specific artifact produced by the PiOS execution chain. Nothing is asserted without a traceable source.

## Assessment at a Glance

| property | value |
|----------|-------|
| Client | {m.client_name} |
| Authoritative run | `{m.run_id}` |
| Canonical score | **{m.score_canonical} / 100** (structural evidence proven) |
| Projected score | **{m.score_projected} / 100** (achievable upon execution assessment) |
| Structural coverage | {m.coverage_percent:.0f}% — {m.admissible_units} of {m.required_units} units admitted |
| Reconstruction | {m.reconstruction_state} — all four structural axes verified |
| Execution status | {m.execution_status} — runtime assessment pending |
| Signals | {m.total_signals} governed signals ({sig_dist}) |
| Executive verdict | {m.executive_verdict_str} |

## Start Here

**Evidence backbone:**
→ [[{m.client_name} — Evidence Path]] — the complete intake-to-product lineage

**Score:**
→ [[CLM-09 Proven Structural Score]] — {m.score_canonical} is the proven floor; how it was computed and what it means
→ [[CLM-10 Achievable Score Projected]] — {m.score_projected} is the ceiling when execution assessment runs

{signal_nav_block}

**Score computation chain:**
→ [[TRN-03 Score Computation]] — the exact arithmetic behind the {m.score_canonical}

**Primary artifact:**
→ [[ART-01 gauge_state.json]] — the single artifact from which GAUGE renders all assessment output

## Navigation by Purpose

**If you want to verify the score:**
[[CLM-09 Proven Structural Score]] → [[TRN-03 Score Computation]] → [[ART-01 gauge_state.json]]

**If you want to understand what is unknown:**
{unknown_nav_prefix}[[CLM-13 Execution Layer Status]] → [[CLM-06 Runtime Unknown-Space Count]]

**If you want to understand structural confidence:**
[[CLM-01 Structural Coverage Completeness]] → [[CLM-03 Structural Reconstruction Pass-Fail]] → [[CLM-25 Executive Three-Axis Verdict]]

**If you want to explore signals:**
[[ART-05 signal_registry.json]] → [[CLM-18 Governed Signal Count]] → [[CLM-19 Signal Evidence Quality Distribution]]

**If you want the full claim map:**
[[Claim Index]]

**If you want to understand what is and isn't client-visible:**
[[Vault Governance]] → [[LENS Admissibility]] → [[Known Gaps]]

## Value Creation Chain (summary)

```
Source artifacts ({m.client_name} bundle)
  → IG pipeline admits {m.admissible_units} structural units
  → Coverage: {m.coverage_percent:.0f}% → {m.coverage_points} structural points proven
  → Reconstruction: 4-axis {m.reconstruction_state} → {m.reconstruction_points} points proven
  → Topology: {m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components mapped
  → Signals: {m.total_signals} intelligence signals derived from evidence chain
  → Score: canonical={m.score_canonical} (proven) / projected={m.score_projected} (achievable)
  → Executive verdict: STRUCTURE={m.structure_verdict} / COMPLEXITY={m.complexity_verdict} / EXECUTION={m.execution_verdict}
```

→ Full guided chain: [[Value Creation Path]]
→ All top claims by category: [[Top Claims]]
→ All core artifacts: [[Core Artifacts]]
"""


# ─── Meta Nodes ───────────────────────────────────────────────────────────────

CLAIM_DEFS = [
    ("CLM-01", "Structural Coverage Completeness", "metric"),
    ("CLM-02", "Structural Unit Count", "metric"),
    ("CLM-03", "Structural Reconstruction Pass-Fail", "verdict"),
    ("CLM-04", "Four-Axis Reconstruction Detail", "metric"),
    ("CLM-05", "Escalation Clearance", "verdict"),
    ("CLM-06", "Runtime Unknown-Space Count", "metric"),
    ("CLM-07", "Source Data Intake Complete", "verdict"),
    ("CLM-08", "Structural Patterns Conform", "verdict"),
    ("CLM-09", "Proven Structural Score", "metric"),
    ("CLM-10", "Achievable Score Projected", "metric"),
    ("CLM-11", "Score Band Classification", "classification"),
    ("CLM-12", "Score Confidence Range", "range"),
    ("CLM-13", "Execution Layer Status", "state"),
    ("CLM-14", "Structural Domain Count", "metric"),
    ("CLM-15", "Structural Capability Count", "metric"),
    ("CLM-16", "Structural Component Count", "metric"),
    ("CLM-17", "Cross-Domain Structural Overlaps", "metric"),
    ("CLM-18", "Governed Signal Count", "metric"),
    ("CLM-19", "Signal Evidence Quality Distribution", "distribution"),
    ("CLM-20", "SIG-001 Sensor Bridge Throughput", "signal"),
    ("CLM-21", "SIG-002 Platform Runtime State Seven Unknown Dimensions", "signal"),
    ("CLM-22", "SIG-003 Dependency Load 68 Percent", "signal"),
    ("CLM-23", "SIG-004 Structural Volatility Edge Density", "signal"),
    ("CLM-24", "SIG-005 Coordination Pressure Partial", "signal"),
    ("CLM-25", "Executive Three-Axis Verdict", "verdict"),
    ("CLM-26", "Executive Narrative Phrase Set", "set"),
    ("CLM-27", "Full Node Inventory 148 Nodes", "metric"),
]


def gen_claim_index(m: VaultModel) -> str:
    rows = []
    for cid, label, _ in CLAIM_DEFS:
        gen_fn = CLAIM_GENERATORS.get(cid)
        if gen_fn and gen_fn(m) is not None:
            rows.append(f"| [[{cid} {label}]] | FULL | ACTIVE |")
    claim_count = len(rows)
    table = "\n".join(rows)
    return f"""{fm(title="Claim Index", node_type="meta", stream_id=VAULT_SCHEMA)}
# Claim Index

All {claim_count} governed claims for run `{m.run_id}`.

| claim | traceability | status |
|-------|-------------|--------|
{table}
"""


def gen_entity_index(m: VaultModel) -> str:
    return f"""{fm(title="Entity Index", node_type="meta", stream_id=VAULT_SCHEMA)}
# Entity Index

Seven entity families present in this assessment.

| entity | node | count |
|--------|------|-------|
| Structural Units | [[ENT-structural-units]] | {m.admissible_units} |
| Topology Nodes | [[ENT-topology-nodes]] | {m.total_nodes} ({m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components) |
| Signals | [[ENT-signals]] | {m.total_signals} |
| Score Components | [[ENT-score-components]] | 3 |
| Dimensions | [[ENT-dimensions]] | 6 |
"""


def gen_vault_governance(m: VaultModel) -> str:
    return f"""{fm(title="Vault Governance", node_type="meta", stream_id=VAULT_SCHEMA)}
# Vault Governance

**Governing principle:** Not everything traceable should be client-visible. Everything visible must be traceable.

## Exposure Zones

| zone | id | audience |
|------|----|----------|
| Full Internal Trace Reality | ZONE-0 | Ground truth — not exposed |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, CTOs |
| Client Surface (LENS) | ZONE-2 | Client executives, decision-makers |
| Audit / Evidence Vault | ZONE-3 | Auditors, technical representatives |

→ [[Exposure Zones]] — full zone definitions
→ [[LENS Admissibility]] — 5 conditions for client surface admissibility
→ [[Known Gaps]] — documented gaps and risks

## GAUGE vs LENS Difference Model

The execution chain computes. GAUGE renders operator-facing truth. LENS renders client-safe explanation.

| GAUGE says | LENS says |
|-----------|-----------|
| `execution_status: {m.execution_status}` | "{m.execution_status_lens if hasattr(m, 'execution_status_lens') else 'Runtime execution assessment is pending'}" |
| `score.canonical: {m.score_canonical}, score.projected: {m.score_projected}` | "Proven foundation: {m.score_canonical}/100. Maximum achievable: {m.score_projected}/100 when execution assessment runs." |
| `confidence.lower: {m.confidence_lower}, confidence.upper: {m.confidence_upper}` | "Score confidence range: {m.confidence_lower} to {m.confidence_upper}. Floor is proven. Ceiling is achievable upon execution assessment." |

**Authority:** {VAULT_SCHEMA}
"""


# ─── Navigation Nodes ─────────────────────────────────────────────────────────

def gen_top_claims(m: VaultModel) -> str:
    sig_lines = []
    for s in m.signals:
        sig_lines.append(f"- [[CLM-{20 + m.signals.index(s):02d} {_sig_clm_label(s)}]] — {s.evidence_confidence}: {s.title[:60]}")
    sig_block = "\n".join(sig_lines)

    return f"""{fm(title="Top Claims", node_type="navigation", stream_id=VAULT_SCHEMA)}
# Top Claims

The highest-value claims by category.

## Score and Confidence

- [[CLM-09 Proven Structural Score]] — **{m.score_canonical}/100** proven structural floor
- [[CLM-10 Achievable Score Projected]] — **{m.score_projected}/100** achievable when execution runs
- [[CLM-12 Score Confidence Range]] — range [{m.confidence_lower}, {m.confidence_upper}]
- [[CLM-11 Score Band Classification]] — {m.score_band_label}

## Structural Truth

- [[CLM-01 Structural Coverage Completeness]] — {m.coverage_percent:.0f}% ({m.admissible_units}/{m.required_units} units)
- [[CLM-03 Structural Reconstruction Pass-Fail]] — {m.reconstruction_state} across all 4 axes
- [[CLM-13 Execution Layer Status]] — {m.execution_status}
- [[CLM-25 Executive Three-Axis Verdict]] — {m.executive_verdict_str}

## Signals

{sig_block}

## Executive Meaning

- [[CLM-25 Executive Three-Axis Verdict]] — the highest-level summary
- [[CLM-26 Executive Narrative Phrase Set]] — business-language phrase outputs
- [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] — what cannot be determined from structural analysis alone
"""


def _sig_clm_label(s: SignalData) -> str:
    mapping = {
        "SIG-001": "SIG-001 Sensor Bridge Throughput",
        "SIG-002": "SIG-002 Platform Runtime State Seven Unknown Dimensions",
        "SIG-003": "SIG-003 Dependency Load 68 Percent",
        "SIG-004": "SIG-004 Structural Volatility Edge Density",
        "SIG-005": "SIG-005 Coordination Pressure Partial",
    }
    return mapping.get(s.signal_id, s.signal_id)


def gen_core_artifacts(m: VaultModel) -> str:
    return f"""{fm(title="Core Artifacts", node_type="navigation", stream_id=VAULT_SCHEMA)}
# Core Artifacts

Seven source artifacts that ground all vault claims.

| artifact | role |
|----------|------|
| [[ART-01 gauge_state.json]] | Terminal execution chain output; primary GAUGE input |
| [[ART-02 coverage_state.json]] | Coverage computation result; DIM-01 source |
| [[ART-03 reconstruction_state.json]] | Reconstruction result; DIM-02 source |
| [[ART-04 canonical_topology.json]] | Topology map: {m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components |
| [[ART-05 signal_registry.json]] | {m.total_signals} governed intelligence signals |
| [[ART-06 binding_envelope.json]] | Binding envelope — cross-domain coverage model |
| [[ART-07 admissibility_log.json]] | IG admissibility decisions; {m.admissible_units} units admitted |

## Artifact → Score Chain

```
ART-07 admissibility_log  → ART-02 coverage_state  → coverage_points  ({m.coverage_points})
                          → ART-03 reconstruction   → reconstruction_points ({m.reconstruction_points})
execution_layer_evaluated → completion_points ({m.completion_points})
                                                    ─────────────────────
                                         canonical = {m.score_derivation} = {m.score_canonical}
ART-01 gauge_state.json ← all of the above
```
"""


def gen_value_creation_path(m: VaultModel) -> str:
    return f"""{fm(title="Value Creation Path", node_type="navigation", stream_id=VAULT_SCHEMA)}
# Value Creation Path — {m.client_name} Assessment

How raw structural evidence becomes a scored, signal-enriched, executive-readable assessment.

---

## Stage 1 — Evidence Intake

**What happens:** The source bundle is processed by the IG pipeline. Each artifact is classified, hashed, and scored for admissibility.

**What it proves:**
- {m.admissible_units} structural units admitted, {m.admissibility_excluded if m.has_admissibility else 0} excluded
- Complete intake — all source data received

**Key artifact:** [[ART-07 admissibility_log.json]]
**Key claims:** [[CLM-02 Structural Unit Count]], [[CLM-07 Source Data Intake Complete]]

---

## Stage 2 — Coverage and Reconstruction

**What happens:** Admitted units are checked for completeness (coverage) and structural coherence (reconstruction across four axes).

**What it proves:**
- Coverage: {m.admissible_units}/{m.required_units} = {m.coverage_percent:.1f}% — all required elements are present
- Reconstruction: four axes all {m.reconstruction_state} — the model is internally consistent and coherent

**Key artifacts:** [[ART-02 coverage_state.json]], [[ART-03 reconstruction_state.json]]
**Key claims:** [[CLM-01 Structural Coverage Completeness]], [[CLM-03 Structural Reconstruction Pass-Fail]], [[CLM-04 Four-Axis Reconstruction Detail]]

---

## Stage 3 — Topology Emission

**What happens:** The normalized structural output is translated into a navigable platform topology.

**What it proves:**
- {m.domain_count} functional domains identified
- {m.capability_count} capability surfaces mapped
- {m.component_count} structural components at leaf level
- {m.total_nodes} nodes total — {m.canonical_cross_domain_overlaps} cross-domain overlaps in canonical model

**Key artifact:** [[ART-04 canonical_topology.json]]
**Key claims:** [[CLM-14 Structural Domain Count]], [[CLM-15 Structural Capability Count]], [[CLM-16 Structural Component Count]]

---

## Stage 4 — Signal Emission

**What happens:** Structural evidence is traversed through a four-layer evidence chain to produce intelligence signals.

**What it produces:**
- {m.total_signals} governed intelligence signals
- Distribution: {conf_dist_str(m.signal_confidence_dist)}

**Key artifact:** [[ART-05 signal_registry.json]]
**Key claims:** [[CLM-18 Governed Signal Count]]{", [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]" if m.total_signals > 0 else ""}

---

## Stage 5 — Score Computation

**What happens:** Coverage points, reconstruction points, and completion points are summed to produce canonical and projected scores.

**What it proves:**
- Canonical score {m.score_canonical} = {m.score_derivation}
- Projected score {m.score_projected} = canonical {m.score_canonical} + COMPLETION_WEIGHT 40 (achievable when execution runs)

**Key transformation:** [[TRN-03 Score Computation]]
**Key artifact:** [[ART-01 gauge_state.json]]
**Key claims:** [[CLM-09 Proven Structural Score]], [[CLM-10 Achievable Score Projected]], [[CLM-12 Score Confidence Range]]

---

## Stage 6 — GAUGE Rendering

**What happens:** The execution chain's terminal artifact (`gauge_state.json`) is read by GAUGE's API layer. GAUGE does not recompute — it renders.

**What becomes visible:**
- Proven Score: {m.score_canonical} / Achievable: {m.score_projected} (StatusBand, ScoreGauge)
- Executive verdict: STRUCTURE={m.structure_verdict} / COMPLEXITY={m.complexity_verdict} / EXECUTION={m.execution_verdict}
- {m.total_signals} signals in SignalAvailability
- Full {m.total_nodes}-node topology in explorer

**Key claim:** [[CLM-25 Executive Three-Axis Verdict]]
**Full lineage:** [[{m.client_name} — Evidence Path]]

---

## The Chain in One View

```
Source bundle
  → Stage 1: {m.admissible_units} units admitted         → ART-07
  → Stage 2: {m.coverage_percent:.0f}% coverage, 4×{m.reconstruction_state}  → ART-02 + ART-03
  → Stage 3: {m.domain_count}/{m.capability_count}/{m.component_count} topology         → ART-04
  → Stage 4: {m.total_signals} signals                   → ART-05
  → Stage 5: score {m.score_canonical}/{m.score_projected}              → ART-01
  → Stage 6: GAUGE renders
              {m.score_canonical} proven / {m.score_projected} achievable
              STRUCTURE={m.structure_verdict} / COMPLEXITY={m.complexity_verdict} / EXECUTION={m.execution_verdict}
```
"""


# ─── Claim Node Generators ────────────────────────────────────────────────────

def _claim_fm(cid: str, label: str, ctype: str, zone: str = "ZONE-2", lens: str = "YES") -> str:
    return fm(
        node_class="claim",
        claim_id=cid,
        claim_label=label,
        claim_type=ctype,
        exposure=zone,
        lens_admissible=lens,
        status="ACTIVE",
        stream_id=VAULT_SCHEMA,
    )


def gen_clm_01(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-01", "Structural Coverage Completeness", "metric")}
## Explanation

{m.admissible_units} admitted artifacts were cross-referenced against the {m.required_units} required units declared in admissibility_log.json. All {m.required_units} are present. The coverage_percent={m.coverage_percent:.1f} is the first commercial claim — complete structural evidence. This value was emitted by the S1 pios coverage stage and is the authoritative basis for concept resolution on coverage and reconstruction.

## Authoritative Value

{m.coverage_percent:.1f}% ({m.admissible_units}/{m.required_units} units)

## Source Fields

- `gauge_state.json` → `dimensions.DIM-01.coverage_percent`
- `coverage_state.json` → `state=COMPUTED`, `coverage_percent={m.coverage_percent:.1f}`

## Upstream Artifacts

- [[ART-02 coverage_state.json]]
- [[ART-07 admissibility_log.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG.RUNTIME → S1 pios coverage stage

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Admissible as summary

## Traceability

- Status: FULL
- Caveats: None — coverage_state.json → admissibility_log.json → IG.RUNTIME

## Surfaces

- RuntimeIntelligence panel (`coverage_percent`)
- CONCEPT-01 resolution
- CONCEPT-02 resolution
"""


def gen_clm_02(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-02", "Structural Unit Count", "metric")}
## Explanation

{m.admissible_units} structural units were admitted through the IG pipeline with 0 excluded. Each unit represents an artifact in the source bundle that passed admissibility classification. The count of {m.admissible_units} is the denominator against which coverage is computed.

## Authoritative Value

{m.admissible_units}/{m.required_units}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-01.admissible_units`, `DIM-01.required_units`
- `admissibility_log.json` → `summary.admitted`

## Upstream Artifacts

- [[ART-07 admissibility_log.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG pipeline admissibility classification

## Exposure

- ZONE: ZONE-1 (count) / ZONE-2 (summary only — "{m.admissible_units} core structural elements")
- LENS admissible: YES (count only; individual unit names are ZONE-0/3)
- Reason: Individual file names are technical artifacts not meaningful to executives

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence panel
- CONCEPT-02 resolution
"""


def gen_clm_03(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-03", "Structural Reconstruction Pass-Fail", "verdict")}
## Explanation

The reconstruction state is determined by testing {m.admissible_units} admitted units across four structural axes. All four axes returned {m.reconstruction_state}. This means the structural model is internally consistent: all units are complete, properly linked, referentially intact, and layer-consistent. A single FAIL on any axis would produce an overall FAIL.

## Authoritative Value

{m.reconstruction_state}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-02.state`
- `reconstruction_state.json` → `state={m.reconstruction_state}`

## Upstream Artifacts

- [[ART-03 reconstruction_state.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG.RUNTIME structural reconstruction validation (S1)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "structural consistency confirmed"
- Reason: Audience-appropriate rephrasing required

## Traceability

- Status: FULL
- Caveats: None — all axis_results={m.reconstruction_state}

## Surfaces

- RuntimeIntelligence panel
- CONCEPT-03 resolution
"""


def gen_clm_04(m: VaultModel) -> str:
    axes_list = ", ".join(f"{ax}={res}" for ax, res in m.axis_results.items())
    return f"""{_claim_fm("CLM-04", "Four-Axis Reconstruction Detail", "metric", zone="ZONE-1")}
## Explanation

Reconstruction is evaluated across four axes. Each axis tests a distinct structural property of the admitted unit set. All four returned {m.reconstruction_state}: {axes_list}. The axis names are technical PSEE terms; for LENS audiences with CTO context, axis names plus verdicts may be shown.

## Authoritative Value

{axes_list}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-02.axis_results`
- `reconstruction_state.json` → `axis_results`

## Upstream Artifacts

- [[ART-03 reconstruction_state.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG.RUNTIME structural reconstruction validation (S1)

## Exposure

- ZONE: ZONE-1 (full axis table) / ZONE-2 conditional (CTO audience: axis names + verdicts)
- LENS admissible: CONDITIONAL (CTO) / NO (CEO)
- Reason: Axis names are technical — phrased narratively for non-technical LENS

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence axis table
- CONCEPT-03 resolution detail
"""


def gen_clm_05(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-05", "Escalation Clearance", "verdict")}
## Explanation

Escalation clearance is {m.escalation_clearance}. This is an S-13 invariant: the S-13 terminal state is unreachable if there are open escalations. Because the run reached S-13, escalation clearance is guaranteed at 100. This is a derived claim — there is no direct measurement of escalations; it is logically entailed by the terminal state.

## Authoritative Value

{m.escalation_clearance}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-03.state_label`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- S-13 terminal state invariant (S4)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "no blocking conditions found"
- Reason: Derivation rule (S-13 invariant) is ZONE-1 only

## Traceability

- Status: FULL
- Caveats: Derived claim — not directly measured; entailed by S-13 terminal state

## Surfaces

- RuntimeIntelligence panel
"""


def gen_clm_06(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-06", "Runtime Unknown-Space Count", "metric")}
## Explanation

The unknown-space count is {m.unknown_space_count}. Caveat: this reflects minimum observable state — `us_records` were not available in declared input artifacts. The count of 0 means no unknown-space records were observed, not that the space is proven zero. This distinction must accompany any LENS surface of this claim.

## Authoritative Value

{m.unknown_space_count} (minimum observable state — not proven zero)

## Source Fields

- `gauge_state.json` → `dimensions.DIM-04.total_count`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- DIM-04 minimum observable state projection (S4)

## Exposure

- ZONE: ZONE-2 (CONDITIONAL — caveat must be surfaced)
- LENS admissible: CONDITIONAL
- Reason: Caveat (minimum observable state, not proven zero) must accompany

## Traceability

- Status: PARTIAL
- Caveats: {m.unknown_space_caveat}

## Surfaces

- RuntimeIntelligence panel (with caveat)
"""


def gen_clm_07(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-07", "Source Data Intake Complete", "verdict")}
## Explanation

Intake completeness is {m.intake_completeness}. This is an S-13 invariant: PSEE.1 INV-04 guarantees all files are assigned when Phase 2 completes. Because the run reached S-13, all source data was received.

## Authoritative Value

{m.intake_completeness}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-05.state`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- S-13 terminal state invariant (S4)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "all source data received"
- Reason: Invariant derivation is ZONE-1 only

## Traceability

- Status: FULL
- Caveats: Derived claim — entailed by S-13 terminal state

## Surfaces

- RuntimeIntelligence panel
"""


def gen_clm_08(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-08", "Structural Patterns Conform", "verdict")}
## Explanation

Heuristic compliance is {m.heuristic_compliance}. This is an S-13 invariant: the PSEE engine cannot reach S-13 if a STOP-HEURISTIC event fired. Compliance means all structural patterns passed heuristic validation. For CTO audiences, this claim is surfaced as-is; for non-technical LENS it is rephrased as "structural patterns conform."

## Authoritative Value

{m.heuristic_compliance}

## Source Fields

- `gauge_state.json` → `dimensions.DIM-06.state`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- S-13 terminal state invariant (S4)

## Exposure

- ZONE: ZONE-1 (full) / ZONE-2 CONDITIONAL (CTO audience)
- LENS admissible: CONDITIONAL (audience: CTO per concepts.json)
- Reason: "Structural patterns conform" — CTO-only in concepts.json

## Traceability

- Status: FULL
- Caveats: Derived claim — entailed by S-13 terminal state

## Surfaces

- RuntimeIntelligence panel (CTO)
"""


def gen_clm_09(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-09", "Proven Structural Score", "metric")}
## Explanation

The canonical score is the proven floor. coverage_points={m.coverage_points} is derived as round({m.coverage_percent:.1f} × 0.35). reconstruction_points={m.reconstruction_points} is a categorical award for a PASS verdict. completion_points={m.completion_points} because the execution layer has not been evaluated (execution_layer_evaluated={m.execution_layer_evaluated}). The execution layer can award up to 40 additional points when run. Computed in S4 by the pios compute gauge stage.

## Authoritative Value

{m.score_canonical}

## Source Fields

- `gauge_state.json` → `score.canonical`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Primary commercial number

## Traceability

- Status: FULL
- Caveats: None — derivation: completion_points({m.completion_points}) + coverage_points({m.coverage_points}) + reconstruction_points({m.reconstruction_points}) = {m.score_canonical}

## Why It Matters

A score of {m.score_canonical} is the maximum provable from structural analysis alone. It means the entire structural evidence base is present, coherent, and verified. The {m.score_projected - m.score_canonical}-point gap is not a deficit; it is the execution assessment, which requires running the platform to measure. For a buyer or operator, {m.score_canonical} is the floor: a commitment backed by evidence that cannot be removed. It is not an estimate or a projection; it is a deterministic sum of verified structural facts.

## Surfaces

- StatusBand ("Proven Score: {m.score_canonical}")
- ScoreGauge proven chip
- CONCEPT-12 resolution
"""


def gen_clm_10(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-10", "Achievable Score Projected", "metric")}
## Explanation

The projected score is {m.score_projected}. It equals the canonical score ({m.score_canonical}) plus the COMPLETION_WEIGHT (40) that becomes available when the execution layer is evaluated. This is not a guarantee — it is the maximum achievable if execution completes to maximum structural state. The projection rule is PR-NOT-EVALUATED: execution not yet run.

## Authoritative Value

{m.score_projected} (achievable upon execution assessment)

## Source Fields

- `gauge_state.json` → `score.projected`
- `gauge_state.json` → `projection.rule=PR-NOT-EVALUATED`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4) — projection_logic_spec PR-NOT-EVALUATED

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "Achievable: {m.score_projected} if execution completes"
- Reason: Caveat (execution not yet run) must accompany LENS surface

## Traceability

- Status: FULL
- Caveats: Execution layer NOT evaluated — projection assumes maximum structural state

## Why It Matters

A projected score of {m.score_projected}/100 defines the ceiling of this assessment. It tells a buyer: the platform's structural foundation earns {m.score_canonical} today; the remaining 40 points are earned by running runtime execution assessment. This is not speculation — it is the mathematical upper bound given the scoring model. The {m.score_canonical}–{m.score_projected} range is the evidence-backed confidence interval: the floor is proven, the ceiling is achievable.

## Surfaces

- StatusBand ("Achievable: {m.score_projected}")
- ScoreGauge projected chip
- CONCEPT-13 resolution
"""


def gen_clm_11(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-11", "Score Band Classification", "classification")}
## Explanation

The score band is {m.score_band_label}. This band reflects the split execution state: the canonical score ({m.score_canonical}) is proven and the projected score ({m.score_projected}) is achievable, but the execution layer has not been evaluated. The band label in raw form is ZONE-1; for LENS, it is rendered as "floor established, ceiling defined."

## Authoritative Value

{m.score_band_label}

## Source Fields

- `gauge_state.json` → `score.band_label`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4)

## Exposure

- ZONE: ZONE-1 (raw label) / ZONE-2 (narrative: "floor established, ceiling defined")
- LENS admissible: YES (narrative form)
- Reason: Band label raw text is ZONE-1; narrative form for LENS

## Traceability

- Status: FULL
- Caveats: Band is {m.score_band_label} due to execution not evaluated

## Surfaces

- StatusBand component
"""


def gen_clm_12(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-12", "Score Confidence Range", "range")}
## Explanation

The confidence range is [{m.confidence_lower}, {m.confidence_upper}]. The lower bound ({m.confidence_lower}) is the proven canonical score. The upper bound ({m.confidence_upper}) is the projected score achievable when execution runs. The status `{m.confidence_status}` indicates the split: structural proof is complete; execution proof is pending. The range collapses to a single point when execution assessment runs.

## Authoritative Value

[{m.confidence_lower}, {m.confidence_upper}]

## Source Fields

- `gauge_state.json` → `confidence.lower`, `confidence.upper`, `confidence.status`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4) — confidence_and_variance_model

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "score range confirmed"
- Reason: Status value {m.confidence_status} is ZONE-1 only

## Traceability

- Status: FULL
- Caveats: Status `{m.confidence_status}` is internal — not for LENS surface

## Why It Matters

A confidence range of [{m.confidence_lower}, {m.confidence_upper}] is a precise, honest statement about the limits of structural assessment. The {m.confidence_lower} floor is backed by evidence that will not change. The {m.confidence_upper} ceiling is contingent on execution. For decision-making, this range tells buyers exactly what is known and what remains to be measured — neither overstating certainty nor understating the structural foundation.

## Surfaces

- StatusBand confidence display
- ScoreGauge range indicator
"""


def gen_clm_13(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-13", "Execution Layer Status", "state")}
## Explanation

The execution status is {m.execution_status}. The execution layer has not been evaluated: execution_layer_evaluated={m.execution_layer_evaluated}, execution_mode={m.execution_mode}. This means runtime behavior — backend performance, cache efficiency, event pipeline activity — cannot be determined from this run. The raw status string is ZONE-1; for LENS, it is rendered as "execution layer pending."

## Authoritative Value

{m.execution_status}

## Source Fields

- `gauge_state.json` → `state.execution_status`
- `gauge_state.json` → `state.execution_layer_evaluated`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge terminal state (S4)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "execution layer pending"
- Reason: Raw status string ZONE-1; narrative for LENS

## Traceability

- Status: FULL
- Caveats: None — directly observed from gauge_state.json

## Surfaces

- ExecutiveDecisionBlock EXECUTION verdict
- StatusBand execution indicator
"""


def gen_clm_14(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-14", "Structural Domain Count", "metric")}
## Explanation

The canonical topology contains {m.domain_count} functional domains. Domains are the highest-level structural groupings in the platform topology. Domain names are business-meaningful labels; component-level names are ZONE-0/3 only.

## Authoritative Value

{m.domain_count}

## Source Fields

- `canonical_topology.json` → `counts.domains`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — topology summary

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer domain list
"""


def gen_clm_15(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-15", "Structural Capability Count", "metric")}
## Explanation

The canonical topology contains {m.capability_count} capability surfaces — the mid-level structural groupings between domains and components.

## Authoritative Value

{m.capability_count}

## Source Fields

- `canonical_topology.json` → `counts.capabilities`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — topology summary

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer capability count
"""


def gen_clm_16(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-16", "Structural Component Count", "metric")}
## Explanation

The canonical topology contains {m.component_count} structural components at the leaf level. These are the most granular nodes in the topology map. Individual component names (e.g., specific module filenames) are ZONE-0/3 only; the count is ZONE-2 safe.

## Authoritative Value

{m.component_count}

## Source Fields

- `canonical_topology.json` → `counts.components`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — topology summary

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer component count
"""


def gen_clm_17(m: VaultModel) -> str:
    env_note = ""
    if m.has_envelope:
        env_note = f"\n\nBinding envelope model shows {m.envelope_overlap_count} cross-domain overlaps across {m.envelope_node_count} nodes with {m.envelope_usp_count} USP records. The canonical and envelope models are different scope/evidence layers, not contradictory data."

    return f"""{_claim_fm("CLM-17", "Cross-Domain Structural Overlaps", "metric")}
## Explanation

The canonical topology shows {m.canonical_cross_domain_overlaps} cross-domain overlaps. Cross-domain overlaps indicate structural nodes that participate in more than one domain boundary.{env_note}

## Authoritative Value

{m.canonical_cross_domain_overlaps} (canonical model){"" if not m.has_envelope else f" / {m.envelope_overlap_count} (binding envelope)"}

## Source Fields

- `canonical_topology.json` → domain records with `cross_domain=true`
{"- `binding_envelope.json` → cross-domain edges" if m.has_envelope else ""}

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]
{"- [[ART-06 binding_envelope.json]]" if m.has_envelope else ""}

## Transformation Chain

- S2 topology emission / S3 binding projection

## Exposure

- ZONE: ZONE-2 (canonical {m.canonical_cross_domain_overlaps}); CONDITIONAL for envelope model
- LENS admissible: YES (canonical); CONDITIONAL (envelope — requires explanation)
- Reason: If envelope overlaps are surfaced in LENS, must explain what they mean

## Traceability

- Status: FULL
- Caveats: None for canonical model

## Surfaces

- TopologyExplorer
"""


def gen_clm_18(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-18", "Governed Signal Count", "metric")}
## Explanation

The signal registry contains {m.total_signals} governed intelligence signals. Each signal has a complete four-layer evidence chain (condition → diagnosis → intelligence → signal). All {m.total_signals} signals are classified by evidence confidence.

## Authoritative Value

{m.total_signals}

## Source Fields

- `signal_registry.json` → `total_signals`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — count

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- SignalAvailability panel
"""


def gen_clm_19(m: VaultModel) -> str:
    dist_str = conf_dist_str(m.signal_confidence_dist)
    return f"""{_claim_fm("CLM-19", "Signal Evidence Quality Distribution", "distribution")}
## Explanation

Signal confidence distribution: {dist_str}. STRONG signals are fully computed from static evidence with complete four-layer chains. MODERATE signals are deterministic but pending activation (e.g., Stream 75.1 threshold activation). WEAK signals have a resolved static component but a blocked runtime component.

## Authoritative Value

{dist_str}

## Source Fields

- `signal_registry.json` → per-signal `evidence_confidence`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission — evidence_confidence classification

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — with explanation of confidence terminology
- Reason: Confidence terminology requires explanation for non-technical LENS

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- SignalAvailability confidence indicators
"""


def _gen_signal_claim(m: VaultModel, cid: str, label: str, sig_id: str) -> Optional[str]:
    s = m.signal_by_id(sig_id)
    if s is None:
        return None

    weak_note = ""
    if s.evidence_confidence == "WEAK":
        weak_note = "\n\n**WEAK confidence:** Must be surfaced with explicit caveat. May not be presented as a fully established claim."

    return f"""{_claim_fm(cid, label, "signal")}
## Explanation

Signal {s.signal_id}: {s.title}. Confidence: {s.evidence_confidence}. This signal was derived from the four-layer evidence chain (condition → diagnosis → intelligence → signal) and is grounded in the {s.domain_name} domain, capability: {s.capability_name}.{weak_note}

## Authoritative Value

{s.evidence_confidence} confidence

## Business Impact

{s.business_impact}

## Risk

{s.risk}

## Source Fields

- `signal_registry.json` → `signals[{sig_id}]`
- Source refs: {", ".join(f"`{r}`" for r in s.source_refs[:6])}{"..." if len(s.source_refs) > 6 else ""}

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission — four-layer chain: COND → DIAG → INTEL → SIG

## Exposure

- ZONE: ZONE-2 (business_impact + risk + evidence_confidence label)
- LENS admissible: {"CONDITIONAL — WEAK confidence must be surfaced" if s.evidence_confidence == "WEAK" else "YES"}
- Reason: statement and confidence_rationale are ZONE-1/3 only; business_impact and risk are ZONE-2

## Traceability

- Status: FULL
- Caveats: {"WEAK confidence — static component only; runtime component blocked" if s.evidence_confidence == "WEAK" else "None"}

## Surfaces

- SignalAvailability panel (title + business_impact + evidence_confidence)
"""


def gen_clm_20(m: VaultModel) -> str:
    s = m.signal_by_id("SIG-001")
    if s is None:
        return _gen_signal_claim(m, "CLM-20", "SIG-001 Sensor Bridge Throughput", "SIG-001")

    content = _gen_signal_claim(m, "CLM-20", "SIG-001 Sensor Bridge Throughput", "SIG-001")
    # Add Why It Matters
    why = f"""
## Why It Matters

{s.title} is the only confirmed data pathway for network security intelligence in this platform. The throughput ceiling is a static configuration constant — actual runtime performance is unknown. For a buyer, this signal defines both a known constraint (the declared ceiling) and an unknown risk (whether runtime performance matches configuration). It is the most concrete single-pathway measurement in this assessment.
"""
    return content + why


def gen_clm_21(m: VaultModel) -> str:
    s = m.signal_by_id("SIG-002")
    content = _gen_signal_claim(m, "CLM-21", "SIG-002 Platform Runtime State Seven Unknown Dimensions", "SIG-002")

    if s:
        why = f"""
## Why It Matters

{s.business_impact} This is the most commercially significant finding in this assessment: it defines the boundary of what structural analysis can and cannot determine. For a buyer, this signal is not a warning about platform quality — it is an accurate statement that {7} operational dimensions require runtime validation to assess. The structural foundation is solid ({m.score_canonical}/100 proven); what these unknowns represent is the gap between structural confidence and operational confidence.
"""
        return content + why
    return content


def gen_clm_22(m: VaultModel) -> str:
    s = m.signal_by_id("SIG-003")
    content = _gen_signal_claim(m, "CLM-22", "SIG-003 Dependency Load 68 Percent", "SIG-003")
    if s:
        why = f"""
## Why It Matters

{s.business_impact} A dependency load above 0.6 means most architectural connections are direct dependencies, not loose event-driven couplings. This is a structural fact about the platform's coupling topology — it informs change management, deployment risk, and incident blast radius calculations.
"""
        return content + why
    return content


def gen_clm_23(m: VaultModel) -> str:
    return _gen_signal_claim(m, "CLM-23", "SIG-004 Structural Volatility Edge Density", "SIG-004")


def gen_clm_24(m: VaultModel) -> str:
    return _gen_signal_claim(m, "CLM-24", "SIG-005 Coordination Pressure Partial", "SIG-005")


def gen_clm_25(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-25", "Executive Three-Axis Verdict", "verdict")}
## Explanation

The executive verdicts are Boolean aggregations of resolved concept predicates. STRUCTURE={m.structure_verdict} because coverage={m.coverage_percent:.0f}% and reconstruction={m.reconstruction_state}. COMPLEXITY={m.complexity_verdict} because canonical cross-domain overlaps={m.canonical_cross_domain_overlaps}. EXECUTION={m.execution_verdict} because execution_status={m.execution_status}.

**Known risk:** CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will not correctly match `NOT_EVALUATED` on Stream 10 schema. EXECUTION verdict may not correctly show UNKNOWN on the recomputed run. This is a production risk documented in [[Known Gaps]].

## Authoritative Value

STRUCTURE={m.structure_verdict}, COMPLEXITY={m.complexity_verdict}, EXECUTION={m.execution_verdict}

## Source Fields

- STRUCTURE: `gauge_state.json` → DIM-01.coverage_percent, DIM-02.state
- COMPLEXITY: `canonical_topology.json` → cross-domain overlap count
- EXECUTION: `gauge_state.json` → state.execution_status

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[CLM-03 Structural Reconstruction Pass-Fail]]
- [[CLM-09 Proven Structural Score]]
- [[CLM-13 Execution Layer Status]]

## Transformation Chain

- Concept predicates → resolver.js evaluation → three-axis verdict

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — primary LENS surface claim
- Reason: Highest-impact client-facing summary

## Traceability

- Status: FULL
- Caveats: CONCEPT-06 predicate mismatch — see [[Known Gaps]]

## Why It Matters

The three-axis verdict is the highest-level summary of the assessment state. STRUCTURE={m.structure_verdict} means the platform's structural evidence is complete, coherent, and verified — this backs the {m.score_canonical}-point floor. COMPLEXITY={m.complexity_verdict} means no structural overlaps or orphaned components were found, reducing integration risk. EXECUTION={m.execution_verdict} is the pending dimension: it does not mean the platform is problematic; it means the assessment is incomplete until runtime evaluation runs.

## Surfaces

- ExecutiveDecisionBlock in overview.js
- Known gap: CONCEPT-06 predicate mismatch on record
"""


def gen_clm_26(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-26", "Executive Narrative Phrase Set", "set")}
## Explanation

Business ontology phrases are GAUGE-rendered outputs. The GAUGE concept resolver evaluates predicate logic against live assessment data (gauge_state.json + canonical_topology.json) and resolves active concepts into business-language phrases. The phrase output is ZONE-2 safe; predicate logic and concept_ids are ZONE-1/3 only.

## Authoritative Value

Resolved phrase outputs from 19 active business concepts (GAUGE runtime)

## Source Fields

- `concepts.json` → predicate evaluation
- `phrases.json` → resolved phrase output
- `resolver.js` → concept resolution engine

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[ART-04 canonical_topology.json]]

## Transformation Chain

- concepts.json predicates → resolver.js evaluation → phrases.json phrase output (GAUGE render)

## Exposure

- ZONE: ZONE-1 (concept resolution detail) / ZONE-2 (phrase output only)
- LENS admissible: YES (phrase output only)
- Reason: Predicate logic and concept_ids are operator language

## Traceability

- Status: CONDITIONAL
- Caveats: Phrase output is GAUGE-rendered; not stored in execution chain artifacts

## Surfaces

- All GAUGE panels (phrases rendered by concept resolver)
"""


def gen_clm_27(m: VaultModel) -> str:
    return f"""{_claim_fm("CLM-27", "Full Node Inventory 148 Nodes", "metric")}
## Explanation

The canonical topology contains {m.total_nodes} total nodes: {m.domain_count} domains, {m.capability_count} capabilities, {m.component_count} components. For LENS audiences, domain names only are surfaced; component-level names are ZONE-0/3 only.

## Authoritative Value

{m.total_nodes} nodes ({m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components)

## Source Fields

- `canonical_topology.json` → `counts.total_nodes`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-1 (full node explorer) / ZONE-2 (domain names only)
- LENS admissible: YES (domain names) / CONDITIONAL (component names where client-recognizable)
- Reason: Component-level names may be too technical for non-CTO audiences

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer (full {m.total_nodes}-node graph)
- LENS: domain names only ({m.domain_count} domain names as named areas)
"""


CLAIM_GENERATORS = {
    "CLM-01": gen_clm_01, "CLM-02": gen_clm_02, "CLM-03": gen_clm_03,
    "CLM-04": gen_clm_04, "CLM-05": gen_clm_05, "CLM-06": gen_clm_06,
    "CLM-07": gen_clm_07, "CLM-08": gen_clm_08, "CLM-09": gen_clm_09,
    "CLM-10": gen_clm_10, "CLM-11": gen_clm_11, "CLM-12": gen_clm_12,
    "CLM-13": gen_clm_13, "CLM-14": gen_clm_14, "CLM-15": gen_clm_15,
    "CLM-16": gen_clm_16, "CLM-17": gen_clm_17, "CLM-18": gen_clm_18,
    "CLM-19": gen_clm_19, "CLM-20": gen_clm_20, "CLM-21": gen_clm_21,
    "CLM-22": gen_clm_22, "CLM-23": gen_clm_23, "CLM-24": gen_clm_24,
    "CLM-25": gen_clm_25, "CLM-26": gen_clm_26, "CLM-27": gen_clm_27,
}


# ─── Entity Nodes ─────────────────────────────────────────────────────────────

def gen_ent_structural_units(m: VaultModel) -> str:
    return f"""{fm(node_class="entity", entity_id="ENT-structural-units", entity_label="Structural Units", status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Entity: Structural Units

## Definition

Structural units (CEUs) are the fundamental evidence atoms of the PSEE system. Each unit is an artifact admitted by the IG pipeline and used as input to coverage and reconstruction computation.

## Count

{m.admissible_units} admitted / {m.required_units} required

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Count ({m.admissible_units}) + admissibility status |
| ZONE-2 | Count only ("{m.admissible_units} core structural elements") |
| ZONE-3 | Full list with individual unit names |

Individual unit file names are technical artifacts not meaningful to executives.

## Source Artifact

[[ART-07 admissibility_log.json]]

## Related Claims

[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-07 Source Data Intake Complete]]
"""


def gen_ent_topology_nodes(m: VaultModel) -> str:
    domain_list = "\n".join(f"- {dn}" for dn in m.domain_names[:20])
    return f"""{fm(node_class="entity", entity_id="ENT-topology-nodes", entity_label="Topology Nodes", status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Entity: Topology Nodes

## Definition

Topology nodes are the structural units of the emitted platform map. They include domains (highest level), capabilities (mid-level), and components (leaf level).

## Count

{m.total_nodes} nodes total: {m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components

## Domain Names

{domain_list}

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Full node explorer with IDs, names, depths |
| ZONE-2 | Domain names only ({m.domain_count} domain names as named areas) |
| ZONE-3 | Full node inventory |

Component-level names are too technical for non-CTO audiences; domain names are business-meaningful.

## Source Artifact

[[ART-04 canonical_topology.json]]

## Related Claims

[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-27 Full Node Inventory 148 Nodes]]
"""


def gen_ent_signals(m: VaultModel) -> str:
    sig_rows = []
    for s in m.signals:
        sig_rows.append(f"| {s.signal_id} | {s.title[:50]}... | {s.evidence_confidence} |")
    sig_table = "\n".join(sig_rows)

    return f"""{fm(node_class="entity", entity_id="ENT-signals", entity_label="Signals", status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Entity: Signals

## Definition

Intelligence signals are forward-looking findings derived from the four-layer evidence chain: condition → diagnosis → intelligence → signal. Each signal has a classified evidence confidence level.

## Registry

{m.total_signals} signals. Distribution: {conf_dist_str(m.signal_confidence_dist)}.

| signal | title | confidence |
|--------|-------|-----------|
{sig_table}

## Exposure Policy

| field | ZONE-1 | ZONE-2 | ZONE-3 |
|-------|--------|--------|--------|
| title | YES | YES | YES |
| statement | YES | NO | YES |
| business_impact | YES | YES | YES |
| risk | YES | YES | YES |
| evidence_confidence | YES | YES | YES |
| confidence_rationale | YES | NO | YES |
| source_refs | YES | NO | YES |

**Note:** `business_impact` and `risk` fields are ZONE-2 safe but not currently rendered in GAUGE UI — unrendered product value gap.

## Source Artifact

[[ART-05 signal_registry.json]]

## Related Claims

[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]]{" [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]" if m.total_signals > 0 else ""}
"""


def gen_ent_score_components(m: VaultModel) -> str:
    return f"""{fm(node_class="entity", entity_id="ENT-score-components", entity_label="Score Components", status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Entity: Score Components

## Definition

The canonical score is composed of three additive components. Each component is gated on specific evidence conditions.

## Components

| component | value | condition | weight |
|-----------|-------|-----------|--------|
| completion_points | {m.completion_points} | execution_layer_evaluated=True required | up to 40 |
| coverage_points | {m.coverage_points} | round(coverage_percent × 0.35) | max 35 |
| reconstruction_points | {m.reconstruction_points} | PASS → 25, otherwise 0 | max 25 |

**Derivation:** {m.score_derivation} = {m.score_canonical}

**Projected:** {m.score_canonical} + 40 (completion weight) = {m.score_projected}

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Full: completion/coverage/reconstruction points with derivation |
| ZONE-2 | Narrative: "structural evidence contributes {m.score_canonical} points; execution layer can add up to 40" |
| ZONE-3 | Full component breakdown |

## Source Artifact

[[ART-01 gauge_state.json]]

## Related Claims

[[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]]
"""


def gen_ent_dimensions(m: VaultModel) -> str:
    return f"""{fm(node_class="entity", entity_id="ENT-dimensions", entity_label="Dimensions", status="ACTIVE", stream_id=VAULT_SCHEMA)}
# Entity: Dimensions

## Definition

Six dimensions provide the structured evidence breakdown behind the canonical score and executive verdict.

## Dimension Summary

| id | label | value | source |
|----|-------|-------|--------|
| DIM-01 | Coverage | {m.coverage_percent:.1f}% ({m.admissible_units}/{m.required_units}) | coverage_state.json |
| DIM-02 | Reconstruction | {m.reconstruction_state} (4-axis) | reconstruction_state.json |
| DIM-03 | Escalation Clearance | {m.escalation_clearance} | S-13 invariant |
| DIM-04 | Unknown-Space | {m.unknown_space_count} (min observable) | DIM-04 projection |
| DIM-05 | Intake Completeness | {m.intake_completeness} | S-13 invariant |
| DIM-06 | Heuristic Compliance | {m.heuristic_compliance} | S-13 invariant |

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | All 6 dimensions with values |
| ZONE-2 | DIM-01/02/03 (summary); DIM-04/05/06 contextual |
| ZONE-3 | Full dimension detail |

**DIM-04 caveat:** total_count=0 is minimum observable state, not proven zero. Must accompany ZONE-2 surface.
**DIM-05/06:** Invariants — derived from S-13 terminal state, not directly measured.

## Source Artifact

[[ART-01 gauge_state.json]]

## Related Claims

[[CLM-01 Structural Coverage Completeness]] [[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-05 Escalation Clearance]] [[CLM-06 Runtime Unknown-Space Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-08 Structural Patterns Conform]]
"""


# ─── Artifact Nodes ───────────────────────────────────────────────────────────

def gen_art_01(m: VaultModel) -> str:
    return f"""{fm(node_class="artifact", artifact_id="ART-01", artifact_name="gauge_state.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Terminal output of the S0→S4 execution chain. The single artifact consumed by the GAUGE product surface (`/api/gauge`). Contains all dimensions, scores, execution state, confidence, and projection.

## Producing Step
`pios compute gauge` (S4) → `pios declare coherence` → `pios validate freshness`

## Consuming Steps
`/api/gauge` reads via GAUGE_PACKAGE_DIR environment variable → serves index.js, overview.js

## Structure Summary
Key fields: run_id, stream, state (execution_status, execution_layer_evaluated, execution_mode), dimensions (DIM-01..06), score (canonical, projected, components, band_label), projection (value, rule), confidence (lower, upper, status)

**This run:** schema_version={m.execution_status!r} variant — execution_status={m.execution_status}

## Claims Grounded
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]] [[CLM-05 Escalation Clearance]] [[CLM-06 Runtime Unknown-Space Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-08 Structural Patterns Conform]] [[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]] [[CLM-13 Execution Layer Status]] [[CLM-25 Executive Three-Axis Verdict]]

## Authoritative Path
`clients/{m.client_id}/psee/runs/{m.run_id}/package/gauge_state.json`

## Product Role
This is the artifact that powers the GAUGE product surface. The execution chain computes — this file is the terminal product of that computation. GAUGE renders by reading this single file through the GAUGE_PACKAGE_DIR binding. Every dimension panel, score display, confidence band, and executive verdict in the product traces to a field in gauge_state.json.
"""


def gen_art_02(m: VaultModel) -> str:
    return f"""{fm(node_class="artifact", artifact_id="ART-02", artifact_name="coverage_state.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Coverage computation result. Primary source for DIM-01. Produced by the S1 pios coverage stage.

## Producing Step
`pios coverage` (S1) via IG.RUNTIME admissibility computation

## Key Fields
- `coverage_percent`: {m.coverage_percent:.1f}
- `state`: COMPUTED
- `required_units`: {m.required_units}
- `admissible_units`: {m.admissible_units}

## Claims Grounded
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]]

## Authoritative Path
`clients/{m.client_id}/psee/runs/{m.run_id}/package/coverage_state.json`
"""


def gen_art_03(m: VaultModel) -> str:
    axes_str = ", ".join(f"{ax}={res}" for ax, res in m.axis_results.items())
    return f"""{fm(node_class="artifact", artifact_id="ART-03", artifact_name="reconstruction_state.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Reconstruction result. Primary source for DIM-02. Produced by the S1 pios reconstruction stage.

## Producing Step
`pios reconstruction` (S1) via IG.RUNTIME structural reconstruction validation

## Key Fields
- `state`: {m.reconstruction_state}
- `validated_units`: {m.admissible_units}
- `axis_results`: {axes_str}

## Claims Grounded
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]]

## Authoritative Path
`clients/{m.client_id}/psee/runs/{m.run_id}/package/reconstruction_state.json`
"""


def gen_art_04(m: VaultModel) -> str:
    return f"""{fm(node_class="artifact", artifact_id="ART-04", artifact_name="canonical_topology.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Canonical platform topology. Maps {m.total_nodes} nodes across {m.domain_count} domains, {m.capability_count} capabilities, {m.component_count} components.

## Producing Step
S2 topology emission (`emit_canonical_topology.py`)

## Key Fields
- `counts.domains`: {m.domain_count}
- `counts.capabilities`: {m.capability_count}
- `counts.components`: {m.component_count}
- `counts.total_nodes`: {m.total_nodes}
- `domains`: array of {m.domain_count} domain objects with domain_name, capability_ids, component_ids

## Claims Grounded
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-17 Cross-Domain Structural Overlaps]] [[CLM-27 Full Node Inventory 148 Nodes]]

## Authoritative Path
`clients/{m.client_id}/psee/runs/{m.run_id}/package/canonical_topology.json`
"""


def gen_art_05(m: VaultModel) -> str:
    sig_list = "\n".join(f"- {s.signal_id}: {s.title[:60]} ({s.evidence_confidence})" for s in m.signals)
    return f"""{fm(node_class="artifact", artifact_id="ART-05", artifact_name="signal_registry.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Registry of {m.total_signals} governed intelligence signals derived from the four-layer evidence chain.

## Producing Step
S3 signal emission

## Signal Summary

{sig_list}

## Claims Grounded
[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]]{" [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]" if m.total_signals > 0 else ""}

## Authoritative Path
`clients/{m.client_id}/psee/runs/{m.run_id}/package/signal_registry.json`

## Product Role
The signal registry is the source of all intelligence signals rendered in the GAUGE SignalAvailability panel. The `business_impact` and `risk` fields are ZONE-2 safe but currently not rendered in GAUGE UI — an unrendered product value gap.
"""


def gen_art_06(m: VaultModel) -> str:
    if m.has_envelope:
        detail = f"Contains {m.envelope_node_count} nodes, {m.envelope_overlap_count} cross-domain overlaps, {m.envelope_usp_count} USP records."
    else:
        detail = "Not loaded for this run. Specify `--binding-envelope` flag to include."

    return f"""{fm(node_class="artifact", artifact_id="ART-06", artifact_name="binding_envelope.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Binding envelope topology — a broader structural coverage model that may include cross-domain overlaps and unstructured source patterns (USP records) not present in the canonical model.

## Status for This Run

{detail}

## Relationship to Canonical Topology

The canonical topology (ART-04) and binding envelope are different scope/evidence layers, not contradictory data. The canonical model uses structural source authority; the envelope may include advisory boundary nodes.

## Claims Grounded
[[CLM-17 Cross-Domain Structural Overlaps]]
"""


def gen_art_07(m: VaultModel) -> str:
    if m.has_admissibility:
        detail = f"Admitted: {m.admissibility_admitted}, Excluded: {m.admissibility_excluded}"
    else:
        detail = f"Admissibility log not found in run package. Unit count ({m.admissible_units}) sourced from gauge_state.json DIM-01."

    return f"""{fm(node_class="artifact", artifact_id="ART-07", artifact_name="admissibility_log.json", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
IG pipeline admissibility decisions. Records which artifacts were admitted or excluded and why.

## Status for This Run

{detail}

## Key Fields
- `entries`: per-artifact decisions (ADMITTED / EXCLUDED)
- `summary.admitted`: {m.admissible_units}
- `summary.excluded`: {m.admissibility_excluded if m.has_admissibility else "N/A"}

## Claims Grounded
[[CLM-02 Structural Unit Count]] [[CLM-07 Source Data Intake Complete]]
"""


# ─── Transformation Nodes ─────────────────────────────────────────────────────

def gen_trn_01(m: VaultModel) -> str:
    return f"""{fm(node_class="transformation", transformation_id="TRN-01", transformation_name="Coverage Computation", stage="S1", command="pios coverage", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Computes coverage_percent from admitted units vs required units.

## Inputs
- [[ART-07 admissibility_log.json]] — admitted unit count
- evidence_boundary.json — required unit declaration

## Outputs
- [[ART-02 coverage_state.json]] — coverage_percent={m.coverage_percent:.1f}, state=COMPUTED

## Rules
- coverage_percent = admissible_units / required_units * 100 = {m.admissible_units} / {m.required_units} * 100 = {m.coverage_percent:.1f}
- coverage_points = round(coverage_percent × 0.35) = {m.coverage_points}

## Claims Produced
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]]
"""


def gen_trn_02(m: VaultModel) -> str:
    axes_str = " | ".join(f"{ax}={res}" for ax, res in m.axis_results.items())
    return f"""{fm(node_class="transformation", transformation_id="TRN-02", transformation_name="Reconstruction Computation", stage="S1", command="pios reconstruction", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Validates structural coherence of admitted units across four axes.

## Inputs
- [[ART-07 admissibility_log.json]] — admitted unit set
- normalized_intake_structure/ — layer_index, provenance_chain, source_profile

## Outputs
- [[ART-03 reconstruction_state.json]] — state={m.reconstruction_state}, axis_results

## Rules
- Four axes: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY
- All must PASS for overall PASS
- Result: {axes_str}
- reconstruction_points: PASS → {m.reconstruction_points}

## Claims Produced
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]]
"""


def gen_trn_03(m: VaultModel) -> str:
    return f"""{fm(node_class="transformation", transformation_id="TRN-03", transformation_name="Score Computation", stage="S4", command="pios compute gauge", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Computes canonical and projected scores from coverage, reconstruction, and execution state. Produces score fields in gauge_state.json.

## Inputs
- [[ART-02 coverage_state.json]] — coverage_percent → coverage_points; execution_layer_evaluated → completion gate
- [[ART-03 reconstruction_state.json]] — overall_result → reconstruction_points

## Outputs
- [[ART-01 gauge_state.json]] — score.canonical={m.score_canonical}, score.projected={m.score_projected}, score.components

## Rules
- completion_points: requires execution_layer_evaluated=True; if False → 0; if True → terminal state lookup
- coverage_points = round(coverage_percent × 0.35) = {m.coverage_points}
- reconstruction_points = PASS→{m.reconstruction_points}, otherwise→0
- canonical = sum(completion + coverage + reconstruction) = {m.score_derivation} = {m.score_canonical}
- projected = canonical + COMPLETION_WEIGHT(40) = {m.score_canonical}+40 = {m.score_projected} (when execution not evaluated)

## Claims Produced
[[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]]

## Product Role
Score computation is the transformation where structural evidence becomes a number. The execution chain runs this step — GAUGE renders the result. The arithmetic is deterministic and bounded: coverage contributes a maximum of 35 points, reconstruction contributes 25, execution contributes up to 40 when evaluated.
"""


def gen_trn_04(m: VaultModel) -> str:
    return f"""{fm(node_class="transformation", transformation_id="TRN-04", transformation_name="Topology Emission", stage="S2", command="pios emit topology", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Emits canonical platform topology from semantic layer data.

## Inputs
- build_semantic_layer.py embedded dicts (41.1 semantic layer)

## Outputs
- [[ART-04 canonical_topology.json]] — {m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components / {m.total_nodes} nodes

## Claims Produced
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-27 Full Node Inventory 148 Nodes]]
"""


def gen_trn_05(m: VaultModel) -> str:
    return f"""{fm(node_class="transformation", transformation_id="TRN-05", transformation_name="Signal Emission", stage="S3", command="pios emit signals", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Traverses the four-layer evidence chain (condition → diagnosis → intelligence → signal) to produce governed intelligence signals.

## Inputs
- 40.5 signal output set
- 40.6 condition output set
- 40.7 diagnosis + intelligence output sets

## Outputs
- [[ART-05 signal_registry.json]] — {m.total_signals} signals: {conf_dist_str(m.signal_confidence_dist)}

## Evidence Chain
```
COND-XXX → DIAG-XXX → INTEL-XXX → SIG-XXX
```
Each signal has a complete four-layer provenance chain.

## Claims Produced
[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]]{" [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]" if m.total_signals > 0 else ""}

## Product Role
Signal emission is the transformation where structural evidence becomes actionable intelligence. Each signal has a `business_impact` and `risk` field that is ZONE-2 safe and directly usable in LENS surface claims.
"""


def gen_trn_06(m: VaultModel) -> str:
    return f"""{fm(node_class="transformation", transformation_id="TRN-06", transformation_name="Concept Resolution", stage="S4", command="GAUGE resolver.js", status="ACTIVE", stream_id=VAULT_SCHEMA)}
## Purpose
Evaluates business concept predicates against live assessment data to produce executive narrative phrase outputs.

## Inputs
- [[ART-01 gauge_state.json]] — score, dimensions, execution state
- [[ART-04 canonical_topology.json]] — topology data
- concepts.json — 19 active concept predicate definitions
- phrases.json — phrase templates

## Outputs
- Resolved phrases for all active concepts
- Three-axis executive verdict (STRUCTURE / COMPLEXITY / EXECUTION)

## Known Gap
CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will not match `NOT_EVALUATED` on Stream 10 schema. EXECUTION verdict may render as VERIFIED rather than UNKNOWN for the recomputed run. See [[Known Gaps]].

## Claims Produced
[[CLM-25 Executive Three-Axis Verdict]] [[CLM-26 Executive Narrative Phrase Set]]
"""


# ─── Client Lineage Node ──────────────────────────────────────────────────────

def gen_client_lineage(m: VaultModel) -> str:
    return f"""{fm(title=f"{m.client_name} — Evidence Path", node_type="lineage", client=m.client_id, run_id=m.run_id, status="ACTIVE", stream_id=VAULT_SCHEMA)}
# {m.client_name} — Evidence Path

## Why This Page Matters

This page traces the complete path from raw source artifacts to GAUGE product surface. Every claim in this vault exists because of this chain. Understanding the chain means understanding which claims are proven, which are derived, and which are pending.

## Key Outcomes at a Glance

| stage | output | grounded claims |
|-------|--------|----------------|
| Evidence Intake | {m.admissible_units}/{m.required_units} units admitted | CLM-02, CLM-07 |
| Coverage | {m.coverage_percent:.0f}% | CLM-01 |
| Reconstruction | {m.reconstruction_state} (4 axes) | CLM-03, CLM-04 |
| Topology | {m.domain_count}/{m.capability_count}/{m.component_count} ({m.total_nodes} nodes) | CLM-14–16, CLM-27 |
| Signals | {m.total_signals} signals ({conf_dist_str(m.signal_confidence_dist)}) | {"CLM-18–24" if m.total_signals > 0 else "CLM-18–19"} |
| Score | {m.score_canonical}/{m.score_projected} | CLM-09, CLM-10 |
| Executive Verdict | {m.executive_verdict_str} | CLM-25 |

---

## S0 — Evidence Intake

**What:** Source bundle received, classified, and admitted by the IG pipeline.

**Artifacts produced:**
- `admissibility_log.json` → [[ART-07 admissibility_log.json]]

**Result:** {m.admissible_units} units admitted, 0 excluded

---

## S1 — Coverage and Reconstruction

**What:** Admitted units measured for completeness and structural coherence.

**Artifacts produced:**
- `coverage_state.json` → [[ART-02 coverage_state.json]]
- `reconstruction_state.json` → [[ART-03 reconstruction_state.json]]

**Result:** Coverage {m.coverage_percent:.0f}% / Reconstruction {m.reconstruction_state}

---

## S2 — Topology Emission

**What:** Semantic layer translated into navigable platform topology.

**Artifacts produced:**
- `canonical_topology.json` → [[ART-04 canonical_topology.json]]

**Result:** {m.domain_count} domains / {m.capability_count} capabilities / {m.component_count} components

---

## S3 — Signal Emission

**What:** Four-layer evidence chain traversed to produce intelligence signals.

**Artifacts produced:**
- `signal_registry.json` → [[ART-05 signal_registry.json]]

**Result:** {m.total_signals} signals — {conf_dist_str(m.signal_confidence_dist)}

{"**Most significant finding:** [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]" if m.total_signals > 0 else "**Signal layer:** NOT_EVALUATED — signal intelligence claims not generated."}

---

## S4 — Score Computation and GAUGE State

**What:** Score computed from coverage, reconstruction, and execution state. Terminal artifact produced.

**Artifacts produced:**
- `gauge_state.json` → [[ART-01 gauge_state.json]]

**Result:** canonical={m.score_canonical} / projected={m.score_projected} / execution={m.execution_status}

---

## Product Surface — GAUGE Rendering

**What:** GAUGE reads `gauge_state.json` via GAUGE_PACKAGE_DIR binding. Does not recompute. Renders.

**Product outputs:**
- StatusBand: {m.score_canonical} proven / {m.score_projected} achievable
- ExecutiveDecisionBlock: {m.executive_verdict_str}
- SignalAvailability: {m.total_signals} signals
- TopologyExplorer: {m.total_nodes} nodes

---

## Follow the Chain

```
Source bundle
  ↓ S0: IG admissibility
  ↓ S1: coverage + reconstruction
  ↓ S2: topology emission
  ↓ S3: signal emission
  ↓ S4: score computation → gauge_state.json
  ↓ GAUGE: render (does not recompute)
  ↓ LENS: explain (does not recompute)
```

Every claim in this vault follows this chain. No claim exists without a traceable step in this sequence.
"""


# ─── Governance Nodes ─────────────────────────────────────────────────────────

def gen_exposure_zones(m: VaultModel) -> str:
    return f"""{fm(title="Exposure Zones", node_type="governance", stream_id=VAULT_SCHEMA)}
# Exposure Zones

Four zones govern what information is exposed and to whom.

| zone | id | audience | definition |
|------|----|----------|-----------|
| Full Internal Trace Reality | ZONE-0 | System only | Everything the vault knows. Not exposed directly to any audience. Ground truth layer. |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, CTOs | Full dimension detail, axis results, raw scores, execution state. |
| Client Surface (LENS) | ZONE-2 | Client executives, decision-makers | Summary metrics, business_impact, narrative phrases, score range. No PSEE internals. |
| Audit / Evidence Vault | ZONE-3 | Auditors, client technical representatives | Full evidence chain, blocking conditions, traceability maps. |

## What Is "Too Raw" for ZONE-2

| raw information | reason not client-safe without treatment |
|-----------------|------------------------------------------|
| Individual CEU file names | Technical artifact filenames — confusing without context to executives |
| PSEE terminal state (S-13, S-T3) | Internal state machine labels — no client meaning |
| Reconstruction axis names verbatim | COMPLETENESS/STRUCTURAL_LINK/etc. have technical definitions differing from everyday usage |
| DIM-XX identifiers | Internal PSEE codes — replace with labels: "Coverage", "Reconstruction", etc. |
| confidence_rationale text | Contains INTEL/DIAG/COND/SIG IDs — technical provenance for operators only |

**Authority:** {VAULT_SCHEMA}
"""


def gen_known_gaps(m: VaultModel) -> str:
    gaps = []
    gaps.append(f"""### GAP-01 — CONCEPT-06 Semantic Gap

**Risk:** CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will NOT match Stream 10 schema where `execution_status = '{m.execution_status}'`. The EXECUTION verdict in overview.js may render as VERIFIED rather than UNKNOWN for the recomputed run — which would be **incorrect**.

**Impact:** Before LENS can safely surface the EXECUTION verdict against any Stream-10-schema run, the concept predicate must be updated to include `NOT_EVALUATED`.

**Status:** OPEN — documented. Production risk on record.
""")

    if m.execution_status == "NOT_EVALUATED":
        gaps.append("""### GAP-02 — Execution Layer Not Evaluated

**Risk:** Runtime execution assessment has not been run. All execution-dependent claims (CLM-13) are in NOT_EVALUATED state. Completion points = 0.

**Impact:** Score ceiling (100) is projected, not proven. Must accompany all score claims.

**Status:** KNOWN — by design. Run PSEE execution engine to resolve.
""")

    return f"""{fm(title="Known Gaps", node_type="governance", stream_id=VAULT_SCHEMA)}
# Known Gaps

Documented gaps, risks, and open conditions for run `{m.run_id}`.

{"".join(gaps)}

**Authority:** {VAULT_SCHEMA}
"""


def gen_lens_admissibility(m: VaultModel) -> str:
    clm24_row = "| CLM-24 SIG-005 | CONDITIONAL | WEAK confidence must be surfaced |\n" if m.total_signals > 0 else ""
    return f"""{fm(title="LENS Admissibility", node_type="governance", stream_id=VAULT_SCHEMA)}
# LENS Admissibility

## Five Conditions for ZONE-2 Admissibility

A claim must satisfy all five conditions to be LENS-admissible:

1. **Traceability:** The claim traces backward to a verified artifact in the locked baseline.
2. **Accuracy:** The claim does not overstate or understate the actual measured state.
3. **Audience-appropriateness:** The vocabulary is matched to the intended audience.
4. **Caveat completeness:** Any known limitations or partial-evidence conditions must accompany the claim.
5. **Source attribution:** For ZONE-3 access, the full evidence chain must be available.

A claim that satisfies 1–5 for ZONE-2 is LENS-admissible. A claim that satisfies only 1–3 but lacks required caveats is NOT LENS-admissible until caveats are present.

## Key Admissibility Decisions for This Run

| claim | lens_admissible | caveat required |
|-------|----------------|----------------|
| CLM-06 Unknown-Space Count | CONDITIONAL | "minimum observable state, not proven zero" |
| CLM-08 Heuristic Compliance | CONDITIONAL | CTO audience only |
| CLM-10 Projected Score | YES | "execution not yet run" must accompany |
{clm24_row}| CLM-25 Executive Verdict | YES | CONCEPT-06 gap must be fixed before LENS surface |

**Authority:** {VAULT_SCHEMA}
"""


# ─── Output Writing ────────────────────────────────────────────────────────────

def collect_nodes(m: VaultModel) -> List[tuple]:
    """
    Returns list of (relative_path, content) tuples for all vault nodes.
    relative_path is relative to the output_dir root.
    """
    client_name_safe = m.client_name.replace("/", "-")
    nodes = []

    # Root
    nodes.append(("EVIDENCE VAULT V2.md", gen_evidence_vault_root(m)))
    nodes.append((f"VAULT ENTRY \u2014 {client_name_safe}.md", gen_vault_entry(m)))

    # Meta
    nodes.append(("00 \u2014 Meta/Claim Index.md", gen_claim_index(m)))
    nodes.append(("00 \u2014 Meta/Entity Index.md", gen_entity_index(m)))
    nodes.append(("00 \u2014 Meta/Vault Governance.md", gen_vault_governance(m)))

    # Navigation
    nodes.append(("00 \u2014 Navigation/Top Claims.md", gen_top_claims(m)))
    nodes.append(("00 \u2014 Navigation/Core Artifacts.md", gen_core_artifacts(m)))
    nodes.append(("00 \u2014 Navigation/Value Creation Path.md", gen_value_creation_path(m)))

    # Claims
    for cid, label, _ in CLAIM_DEFS:
        filename = f"{cid} {label}.md"
        gen_fn = CLAIM_GENERATORS.get(cid)
        if gen_fn:
            content = gen_fn(m)
            if content is not None:
                nodes.append((f"claims/{filename}", content))

    # Entities
    nodes.append(("entities/ENT-structural-units.md", gen_ent_structural_units(m)))
    nodes.append(("entities/ENT-topology-nodes.md", gen_ent_topology_nodes(m)))
    nodes.append(("entities/ENT-signals.md", gen_ent_signals(m)))
    nodes.append(("entities/ENT-score-components.md", gen_ent_score_components(m)))
    nodes.append(("entities/ENT-dimensions.md", gen_ent_dimensions(m)))

    # Artifacts
    nodes.append(("artifacts/ART-01 gauge_state.json.md", gen_art_01(m)))
    nodes.append(("artifacts/ART-02 coverage_state.json.md", gen_art_02(m)))
    nodes.append(("artifacts/ART-03 reconstruction_state.json.md", gen_art_03(m)))
    nodes.append(("artifacts/ART-04 canonical_topology.json.md", gen_art_04(m)))
    nodes.append(("artifacts/ART-05 signal_registry.json.md", gen_art_05(m)))
    nodes.append(("artifacts/ART-06 binding_envelope.json.md", gen_art_06(m)))
    nodes.append(("artifacts/ART-07 admissibility_log.json.md", gen_art_07(m)))

    # Transformations
    nodes.append(("transformations/TRN-01 Coverage Computation.md", gen_trn_01(m)))
    nodes.append(("transformations/TRN-02 Reconstruction Computation.md", gen_trn_02(m)))
    nodes.append(("transformations/TRN-03 Score Computation.md", gen_trn_03(m)))
    nodes.append(("transformations/TRN-04 Topology Emission.md", gen_trn_04(m)))
    nodes.append(("transformations/TRN-05 Signal Emission.md", gen_trn_05(m)))
    nodes.append(("transformations/TRN-06 Concept Resolution.md", gen_trn_06(m)))

    # Client Lineage
    nodes.append((f"client-lineage/{client_name_safe} \u2014 Evidence Path.md", gen_client_lineage(m)))

    # Governance
    nodes.append(("governance/Exposure Zones.md", gen_exposure_zones(m)))
    nodes.append(("governance/Known Gaps.md", gen_known_gaps(m)))
    nodes.append(("governance/LENS Admissibility.md", gen_lens_admissibility(m)))

    return nodes


def write_vault(output_dir: Path, nodes: List[tuple]) -> List[str]:
    written = []
    for rel_path, content in nodes:
        full_path = output_dir / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        written.append(rel_path)
    return written


# ─── Link Validation ──────────────────────────────────────────────────────────

def validate_links(output_dir: Path, nodes: List[tuple]) -> List[str]:
    """
    Validates that all [[wikilinks]] in generated nodes resolve to a file
    in the vault. Returns list of broken link descriptions.
    """
    # Build set of known titles (filename without extension)
    known_titles = set()
    for rel_path, _ in nodes:
        title = Path(rel_path).stem
        known_titles.add(title)

    wikilink_re = re.compile(r'\[\[([^\]|#]+?)(?:\|[^\]]+)?\]\]')
    broken = []

    for rel_path, content in nodes:
        for match in wikilink_re.finditer(content):
            target = match.group(1).strip()
            if target not in known_titles:
                broken.append(f"{rel_path}: [[{target}]]")

    return broken


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Deterministic PiOS Evidence Vault Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--client", required=True, help="Client ID (e.g. blueedge)")
    parser.add_argument("--run", required=True, help="Run ID (e.g. run_authoritative_recomputed_01)")
    parser.add_argument("--output-dir", required=True, help="Output directory for generated vault")
    parser.add_argument("--client-name", default=None, help="Client display name (default: derived from client ID)")
    parser.add_argument("--signal-registry", default=None, help="Override path to signal_registry.json")
    parser.add_argument("--binding-envelope", default=None, help="Path to binding_envelope.json (optional)")
    parser.add_argument("--repo-root", default=None, help="Repository root (default: auto-detected)")
    parser.add_argument("--package-dir", default=None, help="Override package artifact directory (default: clients/<id>/psee/runs/<run>/package)")

    args = parser.parse_args()

    # Resolve repo root
    if args.repo_root:
        repo_root = Path(args.repo_root).resolve()
    else:
        # Walk up from script location to find repo root
        script_dir = Path(__file__).resolve().parent
        repo_root = script_dir.parent.parent  # scripts/psee/ -> scripts/ -> repo root
        if not (repo_root / "clients").exists():
            repo_root = Path.cwd()

    client_id = args.client
    run_id = args.run
    output_dir = Path(args.output_dir)
    if not output_dir.is_absolute():
        output_dir = repo_root / output_dir

    client_name = args.client_name or client_id.replace("-", " ").replace("_", " ").title()

    # Locate run package
    if args.package_dir:
        package_dir = Path(args.package_dir)
        if not package_dir.is_absolute():
            package_dir = repo_root / package_dir
        run_dir = package_dir.parent
    else:
        run_dir = repo_root / "clients" / client_id / "psee" / "runs" / run_id
        package_dir = run_dir / "package"

    if not run_dir.exists():
        print(f"FAIL: Run directory not found: {run_dir}", file=sys.stderr)
        sys.exit(1)

    if not package_dir.exists():
        print(f"FAIL: Package directory not found: {package_dir}", file=sys.stderr)
        sys.exit(1)

    # Protect reference vault
    ref_vault = repo_root / "clients" / client_id / "vaults" / "run_01_authoritative"
    if output_dir.resolve() == ref_vault.resolve():
        print(f"FAIL: output-dir matches reference vault — will not overwrite.", file=sys.stderr)
        sys.exit(1)

    signal_registry_path = Path(args.signal_registry) if args.signal_registry else None
    if signal_registry_path and not signal_registry_path.is_absolute():
        signal_registry_path = repo_root / signal_registry_path

    binding_envelope_path = Path(args.binding_envelope) if args.binding_envelope else None
    if binding_envelope_path and not binding_envelope_path.is_absolute():
        binding_envelope_path = repo_root / binding_envelope_path

    print(f"[{STREAM_ID}] Building vault")
    print(f"  client:     {client_id}")
    print(f"  run:        {run_id}")
    print(f"  package:    {package_dir}")
    print(f"  output:     {output_dir}")

    # Build data model
    model = build_vault_model(
        run_id=run_id,
        client_id=client_id,
        client_name=client_name,
        package_dir=package_dir,
        run_dir=run_dir,
        signal_registry_override=signal_registry_path,
        binding_envelope_path=binding_envelope_path,
    )

    print(f"\n[Model] score={model.score_canonical}/{model.score_projected}"
          f"  coverage={model.coverage_percent:.0f}%"
          f"  recon={model.reconstruction_state}"
          f"  signals={model.total_signals}"
          f"  nodes={model.total_nodes}")

    # Collect nodes
    nodes = collect_nodes(model)
    print(f"\n[Generate] {len(nodes)} nodes")

    # Validate links before writing
    broken = validate_links(output_dir, nodes)
    if broken:
        print(f"\n[WARN] {len(broken)} broken wikilinks detected:")
        for b in broken[:20]:
            print(f"  {b}")
        if len(broken) > 20:
            print(f"  ... and {len(broken) - 20} more")
    else:
        print("[Validate] All wikilinks resolve — OK")

    # Write
    written = write_vault(output_dir, nodes)
    print(f"\n[Write] {len(written)} files written to {output_dir}")

    # Summary
    print(f"\n[COMPLETE]")
    print(f"  vault:      {output_dir}")
    print(f"  nodes:      {len(written)}")
    print(f"  claims:     {len(CLAIM_DEFS)}")
    print(f"  broken links: {len(broken)}")
    print(f"  stream:     {STREAM_ID}")

    sys.exit(0 if not broken else 1)


if __name__ == "__main__":
    main()
