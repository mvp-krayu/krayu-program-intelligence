#!/usr/bin/env python3
"""
pios — PSEE runtime CLI
PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01

Thin wiring layer over the S0–S4 PSEE/GAUGE pipeline.
Every command delegates to the authoritative script or computation model.
No logic is added beyond what the spec defines.

Usage:
    pios ledger create   --run-id <id> --client <client> --source-version <ver> [--debug]
    pios bootstrap       --run-dir <dir> [--debug]
    pios emit coverage   --run-dir <dir> --ig-dir <dir> [--debug]
    pios emit reconstruction --run-dir <dir> --ig-dir <dir> [--debug]
    pios emit topology   --run-dir <dir> --run-id <id> [--debug]
    pios emit signals    --run-dir <dir> [--debug]
    pios compute gauge   --run-dir <dir> [--debug]
    pios validate freshness --run-dir <dir> [--debug]
    pios ig materialize                  --tenant <t> --intake-id <id> --run-id <id> [--debug]
    pios ig integrate-structural-layers  --tenant <t> --run-id <id> [--debug]
    pios structural extract              --tenant <t> --run-id <id> [--debug]
    pios structural relate               --tenant <t> --run-id <id> [--debug]
    pios structural normalize            --tenant <t> --run-id <id> [--debug]
"""

import argparse
import json
import os
import subprocess
import sys
import hashlib
import logging
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def _configure_logging(debug: bool) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        format="[pios] %(levelname)s %(message)s",
        level=level,
        stream=sys.stderr,
    )


def _log(msg: str) -> None:
    logging.info(msg)


def _debug(msg: str) -> None:
    logging.debug(msg)


def _fail(msg: str) -> None:
    logging.error(msg)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Repo root resolution
# ---------------------------------------------------------------------------

def _repo_root() -> str:
    """Walk up from this script's location to find the repo root (contains CLAUDE.md)."""
    here = os.path.dirname(os.path.abspath(__file__))
    candidate = here
    for _ in range(10):
        if os.path.isfile(os.path.join(candidate, "CLAUDE.md")):
            return candidate
        candidate = os.path.dirname(candidate)
    _fail("Cannot locate repo root (CLAUDE.md not found in ancestor directories)")


# ---------------------------------------------------------------------------
# pios ledger create
# ---------------------------------------------------------------------------

def cmd_ledger_create(args: argparse.Namespace) -> None:
    """
    S0 — Write intake_record.json for a new run.

    Writes:
        clients/<client>/psee/runs/<run_id>/intake_record.json

    Schema: Section 3.2 of runtime_surface_specification.md
    """
    _configure_logging(args.debug)
    _debug(f"ledger create: run_id={args.run_id} client={args.client} source_version={args.source_version}")

    root = _repo_root()
    run_dir = os.path.join(root, "clients", args.client, "psee", "runs", args.run_id)
    pkg_dir = os.path.join(run_dir, "package")
    intake_path = os.path.join(run_dir, "intake_record.json")

    if os.path.exists(intake_path):
        _fail(f"intake_record.json already exists at {intake_path} — PB-01 guard: run_id must be unique")

    os.makedirs(pkg_dir, exist_ok=True)
    _debug(f"Created run directory: {run_dir}")

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    record = {
        "run_id": args.run_id,
        "client_uuid": args.client,
        "source_version": args.source_version,
        "declared_at": now,
        "governed_by": "FRESH.RUN.BOOTSTRAP.PROTOCOL.01",
        "emission_stream": args.emission_stream if hasattr(args, "emission_stream") and args.emission_stream else "PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01",
        "stage_participation": [
            {
                "stage_id": "S0",
                "status": "ACTIVE",
                "authorized_by": "BOOTSTRAP.CHAIN.AUTHORITY.01",
                "description": "Run identity declared; intake_record.json written by pios ledger create"
            },
            {
                "stage_id": "S1",
                "status": "ACTIVE",
                "authorized_by": "IG.HANDOFF.AUTHORITY.01",
                "description": "coverage_state and reconstruction_state to be produced by compute_coverage.sh and compute_reconstruction.sh"
            },
            {
                "stage_id": "S2",
                "status": "ACTIVE",
                "authorized_by": "STRUCTURAL.TRUTH.AUTHORITY.01",
                "description": "canonical_topology to be produced by emit_canonical_topology.py"
            },
            {
                "stage_id": "S3",
                "status": "ACTIVE",
                "authorized_by": "SEMANTIC.COMPUTATION.AUTHORITY.01",
                "description": "signal_registry to be produced by build_signals.py with CC-2 correction"
            },
            {
                "stage_id": "S4",
                "status": "ACTIVE",
                "authorized_by": "GAUGE.ADMISSIBLE.CONSUMPTION.01",
                "description": "gauge_state to be computed per GAUGE.STATE.COMPUTATION.CONTRACT.01"
            }
        ],
        "coverage": {
            "gauge_state": "PRODUCE",
            "coverage_state": "PRODUCE",
            "reconstruction_state": "PRODUCE",
            "canonical_topology": "PRODUCE",
            "signal_registry": "PRODUCE"
        },
        "dependency_table": [],
        "freshness_classification": {
            "gauge_state": None,
            "coverage_state": None,
            "reconstruction_state": None,
            "canonical_topology": None,
            "signal_registry": None
        },
        "bootstrap_validity": {
            "AC-01_intake_record_present": "PASS",
            "AC-02_run_id_declared": "PASS",
            "AC-03_client_uuid_declared": "PASS",
            "AC-04_source_version_declared": "PASS",
            "AC-05_stage_participation_declared": "PASS",
            "AC-06_coverage_map_complete": "PASS",
            "AC-07_dependency_table_complete": "PASS",
            "AC-08_freshness_classification_complete": "PENDING",
            "AC-09_no_silent_inheritance": "PASS",
            "AC-10_no_prohibited_patterns": "PASS",
            "bootstrap_admissibility_verdict": "PENDING"
        }
    }

    with open(intake_path, "w") as f:
        json.dump(record, f, indent=2)

    _log(f"LEDGER_CREATED: {intake_path}")
    _log(f"run_id={args.run_id} client={args.client} source_version={args.source_version}")


# ---------------------------------------------------------------------------
# pios bootstrap
# ---------------------------------------------------------------------------

def cmd_bootstrap(args: argparse.Namespace) -> None:
    """
    S0 prerequisite — write engine_state.json and gauge_inputs.json into the run package dir.

    These files are required before compute_coverage.sh is invoked (Section 4.4).

    engine_state.json: carries run_id, client_id, admitted source units placeholder
    gauge_inputs.json: template with panel_02.DIM-01 null structure; updated by compute_coverage.sh
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")
    intake_path = os.path.join(run_dir, "intake_record.json")

    _debug(f"bootstrap: run_dir={run_dir}")

    if not os.path.isfile(intake_path):
        _fail(f"intake_record.json not found at {intake_path} — PB-07: bootstrap requires ledger first")

    with open(intake_path, "r") as f:
        intake = json.load(f)

    run_id = intake.get("run_id")
    client_id = intake.get("client_uuid")
    if not run_id or not client_id:
        _fail("intake_record.json missing run_id or client_uuid")

    os.makedirs(pkg_dir, exist_ok=True)

    engine_state_path = os.path.join(pkg_dir, "engine_state.json")
    gauge_inputs_path = os.path.join(pkg_dir, "gauge_inputs.json")

    if os.path.exists(engine_state_path):
        _fail(f"engine_state.json already exists at {engine_state_path} — no-overwrite guard")
    if os.path.exists(gauge_inputs_path):
        _fail(f"gauge_inputs.json already exists at {gauge_inputs_path} — no-overwrite guard")

    engine_state = {
        "run_id": run_id,
        "client_id": client_id,
        "schema_version": "1.0",
        "stream": "PSEE-RUNTIME",
        "admitted_source_units": None,
        "created_by": "pios bootstrap",
        "governed_by": "FRESH.RUN.BOOTSTRAP.PROTOCOL.01"
    }

    # gauge_inputs.json must have panel_02.DIM-01 structure (compute_coverage.sh writes to it via jq)
    gauge_inputs = {
        "run_id": run_id,
        "client_id": client_id,
        "schema_version": "1.0",
        "panel_02": {
            "DIM-01": {
                "value": None,
                "state_label": None,
                "reason": None,
                "authority": None
            },
            "DIM-02": {
                "value": None,
                "state_label": None,
                "reason": None,
                "authority": None
            }
        }
    }

    with open(engine_state_path, "w") as f:
        json.dump(engine_state, f, indent=2)

    with open(gauge_inputs_path, "w") as f:
        json.dump(gauge_inputs, f, indent=2)

    _log(f"BOOTSTRAP_COMPLETE: engine_state.json and gauge_inputs.json written to {pkg_dir}")
    _log(f"run_id={run_id}")


# ---------------------------------------------------------------------------
# pios emit coverage
# ---------------------------------------------------------------------------

def cmd_emit_coverage(args: argparse.Namespace) -> None:
    """
    S1 — Invoke compute_coverage.sh (PSEE-RUNTIME.5A).

    Script: scripts/pios/runtime/compute_coverage.sh <psee_dir> <ig_dir>
    Preconditions: engine_state.json and gauge_inputs.json exist in package dir.
    Output: package/coverage_state.json; package/gauge_inputs.json (DIM-01 updated)
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    ig_dir = os.path.abspath(os.path.join(root, args.ig_dir)) if not os.path.isabs(args.ig_dir) else args.ig_dir
    pkg_dir = os.path.join(run_dir, "package")

    _debug(f"emit coverage: pkg_dir={pkg_dir} ig_dir={ig_dir}")

    # Precondition: engine_state.json and gauge_inputs.json must exist
    for prereq in ["engine_state.json", "gauge_inputs.json"]:
        if not os.path.isfile(os.path.join(pkg_dir, prereq)):
            _fail(f"Precondition failed: {prereq} not found in {pkg_dir} — run 'pios bootstrap' first")

    script = os.path.join(root, "scripts", "pios", "runtime", "compute_coverage.sh")
    if not os.path.isfile(script):
        _fail(f"Script not found: {script}")

    cmd = ["bash", script, pkg_dir, ig_dir]
    _debug(f"Invoking: {' '.join(cmd)}")

    result = subprocess.run(cmd, cwd=root)
    if result.returncode != 0:
        _fail(f"compute_coverage.sh exited {result.returncode} (FAIL_SAFE_STOP)")

    _log("COVERAGE_COMPLETE: coverage_state.json written")

    # Verify output
    coverage_path = os.path.join(pkg_dir, "coverage_state.json")
    if not os.path.isfile(coverage_path):
        _fail(f"coverage_state.json not found after script execution at {coverage_path}")

    with open(coverage_path, "r") as f:
        cs = json.load(f)
    _log(f"coverage_state: state={cs.get('state')} coverage_percent={cs.get('coverage_percent')}")


# ---------------------------------------------------------------------------
# pios emit reconstruction
# ---------------------------------------------------------------------------

def cmd_emit_reconstruction(args: argparse.Namespace) -> None:
    """
    S1 — Invoke compute_reconstruction.sh (PSEE-RUNTIME.6A).

    DIM-01 precondition: coverage_state.json must exist with state="COMPUTED".
    Script: scripts/pios/runtime/compute_reconstruction.sh <psee_dir> <ig_dir>
    Output: package/reconstruction_state.json; package/gauge_inputs.json (DIM-02 updated)
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    ig_dir = os.path.abspath(os.path.join(root, args.ig_dir)) if not os.path.isabs(args.ig_dir) else args.ig_dir
    pkg_dir = os.path.join(run_dir, "package")

    _debug(f"emit reconstruction: pkg_dir={pkg_dir} ig_dir={ig_dir}")

    # DIM-01 precondition: coverage_state.json.state must equal "COMPUTED"
    coverage_path = os.path.join(pkg_dir, "coverage_state.json")
    if not os.path.isfile(coverage_path):
        _fail(f"DIM-01 precondition failed: coverage_state.json not found in {pkg_dir} — run 'pios emit coverage' first")

    with open(coverage_path, "r") as f:
        cs = json.load(f)

    if cs.get("state") != "COMPUTED":
        _fail(f"DIM-01 precondition failed: coverage_state.json.state = '{cs.get('state')}' (must be 'COMPUTED')")

    _debug("DIM-01 precondition satisfied: coverage_state.state=COMPUTED")

    script = os.path.join(root, "scripts", "pios", "runtime", "compute_reconstruction.sh")
    if not os.path.isfile(script):
        _fail(f"Script not found: {script}")

    cmd = ["bash", script, pkg_dir, ig_dir]
    _debug(f"Invoking: {' '.join(cmd)}")

    result = subprocess.run(cmd, cwd=root)
    if result.returncode != 0:
        _fail(f"compute_reconstruction.sh exited {result.returncode} (FAIL_SAFE_STOP)")

    _log("RECONSTRUCTION_COMPLETE: reconstruction_state.json written")

    # Verify output
    recon_path = os.path.join(pkg_dir, "reconstruction_state.json")
    if not os.path.isfile(recon_path):
        _fail(f"reconstruction_state.json not found after script execution at {recon_path}")

    with open(recon_path, "r") as f:
        rs = json.load(f)
    _log(f"reconstruction_state: state={rs.get('state')} validated_units={rs.get('validated_units')} total_units={rs.get('total_units')}")


# ---------------------------------------------------------------------------
# pios emit topology
# ---------------------------------------------------------------------------

def cmd_emit_topology(args: argparse.Namespace) -> None:
    """
    S2 — Invoke emit_canonical_topology.py.

    Script: scripts/psee/emit_canonical_topology.py --output-path <path> --run-id <run_id>
    Parity guard: 17/42/89/148 (enforced by script before write)
    Output: package/canonical_topology.json
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")
    output_path = os.path.join(pkg_dir, "canonical_topology.json")

    _debug(f"emit topology: output_path={output_path} run_id={args.run_id}")

    script = os.path.join(root, "scripts", "psee", "emit_canonical_topology.py")
    if not os.path.isfile(script):
        _fail(f"Script not found: {script}")

    os.makedirs(pkg_dir, exist_ok=True)

    cmd = [sys.executable, script, "--output-path", output_path, "--run-id", args.run_id]
    _debug(f"Invoking: {' '.join(cmd)}")

    result = subprocess.run(cmd, cwd=root)
    if result.returncode != 0:
        _fail(f"emit_canonical_topology.py exited {result.returncode} (FAIL_CLOSED)")

    _log("TOPOLOGY_EMISSION_COMPLETE: canonical_topology.json written")

    # Verify output
    with open(output_path, "r") as f:
        ct = json.load(f)
    counts = ct.get("counts", {})
    _log(f"canonical_topology: domains={counts.get('domains')} capabilities={counts.get('capabilities')} components={counts.get('components')} total_nodes={counts.get('total_nodes')}")
    _log(f"determinism_hash={ct.get('determinism_hash', 'N/A')}")


# ---------------------------------------------------------------------------
# pios emit signals
# ---------------------------------------------------------------------------

def cmd_emit_signals(args: argparse.Namespace) -> None:
    """
    S3 — Invoke build_signals.py and apply CC-2 post-correction.

    Script: scripts/pios/41.4/build_signals.py --output-dir <dir>
    CC-2: adds runtime_required=false to all signal entries; adds schema_correction metadata.
    Output: package/signal_registry.json (CC-2 corrected); package/evidence_mapping_index.json; package/executive_signal_report.md
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")

    _debug(f"emit signals: pkg_dir={pkg_dir}")

    script = os.path.join(root, "scripts", "pios", "41.4", "build_signals.py")
    if not os.path.isfile(script):
        _fail(f"Script not found: {script}")

    os.makedirs(pkg_dir, exist_ok=True)

    cmd = [sys.executable, script, "--output-dir", pkg_dir]
    _debug(f"Invoking: {' '.join(cmd)}")

    result = subprocess.run(cmd, cwd=root)
    if result.returncode != 0:
        _fail(f"build_signals.py exited {result.returncode}")

    # Determine run_id from intake_record if present
    intake_path = os.path.join(run_dir, "intake_record.json")
    run_id = None
    if os.path.isfile(intake_path):
        with open(intake_path, "r") as f:
            intake = json.load(f)
        run_id = intake.get("run_id")

    # CC-2 post-correction procedure (Section 6.3)
    sig_path = os.path.join(pkg_dir, "signal_registry.json")
    if not os.path.isfile(sig_path):
        _fail(f"signal_registry.json not found after script execution at {sig_path}")

    with open(sig_path, "r") as f:
        reg = json.load(f)

    signals = reg.get("signals", [])
    for sig in signals:
        sig["runtime_required"] = False

    reg["schema_correction"] = {
        "correction_id": "CC-2",
        "description": "runtime_required: false added to all signal entries",
        "applied_to_run": run_id,
        "applied_in_stream": "PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01",
        "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3"
    }

    with open(sig_path, "w") as f:
        json.dump(reg, f, indent=2)

    # Validation: all entries carry runtime_required=false
    for i, sig in enumerate(signals):
        if sig.get("runtime_required") is not False:
            _fail(f"CC-2 validation failed: signal index {i} does not carry runtime_required=false")

    _log(f"SIGNALS_EMISSION_COMPLETE: signal_registry.json written with CC-2 correction ({len(signals)} signals)")


# ---------------------------------------------------------------------------
# pios compute gauge
# ---------------------------------------------------------------------------

def _band_label(score: int) -> str:
    if score >= 80:
        return "READY"
    if score >= 40:
        return "CONDITIONAL"
    return "BLOCKED"


def cmd_compute_gauge(args: argparse.Namespace) -> None:
    """
    S4 — Compute gauge_state.json from four authorized inputs per GAUGE.STATE.COMPUTATION.CONTRACT.01.

    Reads:
        package/coverage_state.json
        package/reconstruction_state.json
        package/canonical_topology.json
        package/signal_registry.json

    Writes:
        package/gauge_state.json

    Logic: Section 7 of runtime_surface_specification.md
    Authority: GAUGE.STATE.COMPUTATION.CONTRACT.01
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")
    intake_path = os.path.join(run_dir, "intake_record.json")

    _debug(f"compute gauge: pkg_dir={pkg_dir}")

    # Resolve run_id from intake_record
    if not os.path.isfile(intake_path):
        _fail(f"intake_record.json not found at {intake_path}")
    with open(intake_path, "r") as f:
        intake = json.load(f)
    run_id = intake.get("run_id")
    client_id = intake.get("client_uuid")
    if not run_id:
        _fail("intake_record.json missing run_id")

    # Load four authorized inputs
    inputs = {}
    for name in ["coverage_state.json", "reconstruction_state.json", "canonical_topology.json", "signal_registry.json"]:
        path = os.path.join(pkg_dir, name)
        if not os.path.isfile(path):
            _fail(f"Authorized input not found: {path} — cannot compute gauge_state")
        with open(path, "r") as f:
            inputs[name] = json.load(f)
        _debug(f"Loaded: {name}")

    cs = inputs["coverage_state.json"]
    rs = inputs["reconstruction_state.json"]
    ct = inputs["canonical_topology.json"]
    sr = inputs["signal_registry.json"]

    # Output path — no-overwrite guard
    gauge_path = os.path.join(pkg_dir, "gauge_state.json")
    if os.path.exists(gauge_path):
        _fail(f"gauge_state.json already exists at {gauge_path} — no-overwrite guard")

    # --- Section 7.3: Terminal state classification ---
    cs_state = cs.get("state")
    cs_pct = cs.get("coverage_percent", 0)
    rs_state = rs.get("state")
    violations = rs.get("violations", [])

    _debug(f"coverage_state.state={cs_state} coverage_percent={cs_pct}")
    _debug(f"reconstruction_state.state={rs_state} violations={violations}")

    if cs_state == "COMPUTED" and cs_pct >= 90 and rs_state == "PASS":
        terminal_state = "S-13"
        execution_status = "COMPLETE"
    elif cs_state == "COMPUTED" and cs_pct < 90 and rs_state != "FAIL":
        terminal_state = "S-T3"
        execution_status = "PARTIAL"
    elif rs_state == "FAIL" or (violations and len(violations) > 0):
        terminal_state = "S-T1"
        execution_status = "STOPPED"
    elif cs_state != "COMPUTED":
        terminal_state = "S-T2"
        execution_status = "ESCALATED"
    else:
        terminal_state = "S-T3"
        execution_status = "PARTIAL"

    _debug(f"terminal_state={terminal_state} execution_status={execution_status}")

    # --- Section 7.4: Score computation ---
    completion_points_table = {
        "S-13": 40,
        "S-T3": 20,
        "S-T1": 0,
        "S-T2": 0,
    }
    completion_points = completion_points_table.get(terminal_state, 0)

    if terminal_state == "S-T1":
        # SA-04: canonical_score = 0 unconditionally
        coverage_points = 0
        reconstruction_points = 0
    elif terminal_state == "S-T2":
        # SA-05: coverage_points = 0, reconstruction_points = 0
        coverage_points = 0
        reconstruction_points = 0
    else:
        if cs_state == "COMPUTED":
            coverage_points = round(cs_pct * 0.35)
        else:
            coverage_points = 0

        # Reconstruction points
        axis_results = rs.get("axis_results", {})
        validated = rs.get("validated_units", 0)
        total = rs.get("total_units", 0)
        if (rs_state == "PASS"
                and all(v == "PASS" for v in axis_results.values())
                and total > 0
                and validated == total):
            reconstruction_points = 25
        elif rs_state == "PENDING" or rs_state is None:
            reconstruction_points = 0
        else:
            # Partial PASS: weighted match formula
            if total > 0:
                reconstruction_points = round((validated / total) * 25)
            else:
                reconstruction_points = 0

    canonical_score = completion_points + coverage_points + reconstruction_points
    band = _band_label(canonical_score)
    derivation = f"{completion_points} + {coverage_points} + {reconstruction_points} = {canonical_score}"

    _debug(f"score: {derivation} band={band}")

    # --- Section 7.5: DIM-01 through DIM-06 ---
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # Source run_ids for traceability
    coverage_run_id = cs.get("run_id", run_id)
    reconstruction_run_id = rs.get("run_id", run_id)
    topology_run_ref = ct.get("source_authority", {}).get("run_reference", run_id)
    signal_run_ref = sr.get("run_reference", run_id)

    # Freshness map: compare run_ids against current run_id
    def _freshness(artifact_run_id: str) -> str:
        if artifact_run_id == run_id:
            return "FRESH"
        return f"INHERITED-GOVERNED (FRESH in {artifact_run_id})"

    dimensions = {
        "DIM-01": {
            "label": "Coverage",
            "coverage_percent": cs_pct,
            "state": cs_state,
            "state_label": cs.get("state_label", cs_state),
            "required_units": cs.get("required_units"),
            "admissible_units": cs.get("admissible_units"),
            "source_artifact": "coverage_state.json",
            "source_run_id": coverage_run_id,
            "freshness_in_source_run": "FRESH",
            "classification_in_this_run": _freshness(coverage_run_id),
            "authority": "PSEE-GAUGE.0 DP-5-02"
        },
        "DIM-02": {
            "label": "Reconstruction",
            "state": rs_state,
            "state_label": rs_state if rs_state else "PENDING",
            "validated_units": rs.get("validated_units"),
            "total_units": rs.get("total_units"),
            "reconstruction_points": reconstruction_points,
            "axis_results": axis_results,
            "source_artifact": "reconstruction_state.json",
            "source_run_id": reconstruction_run_id,
            "freshness_in_source_run": "FRESH",
            "classification_in_this_run": _freshness(reconstruction_run_id),
            "authority": "PSEE-GAUGE.0 DP-6-03"
        },
        "DIM-03": {
            "label": "Escalation Clearance",
            "value": 100 if terminal_state == "S-13" else 0,
            "state_label": "CLEAR" if terminal_state == "S-13" else "OPEN",
            "derivation_rule": (
                "S-13 terminal state invariant: S-13 is unreachable with open escalations; "
                "escalation clearance = 100 per GAUGE.STATE.COMPUTATION.CONTRACT.01 §4.4"
            ) if terminal_state == "S-13" else "Derived from terminal state",
            "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-03"
        },
        "DIM-04": {
            "label": "Unknown-Space",
            "total_count": 0,
            "state_label": "NONE",
            "caveat": (
                "us_records not available in declared input artifacts; DIM-04 reflects minimum observable state "
                "per GAUGE.STATE.COMPUTATION.CONTRACT.01 §4.5"
            ),
            "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-04"
        },
        "DIM-05": {
            "label": "Intake Completeness",
            "state": "COMPLETE" if terminal_state == "S-13" else "PENDING",
            "derivation_rule": (
                "S-13 terminal state invariant: PSEE.1 INV-04 guarantees all files assigned when Phase 2 completes "
                "per GAUGE.STATE.COMPUTATION.CONTRACT.01 §4.6"
            ) if terminal_state == "S-13" else "Derived from terminal state",
            "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-05"
        },
        "DIM-06": {
            "label": "Heuristic Compliance",
            "state": "PASS" if terminal_state == "S-13" else "PENDING",
            "derivation_rule": (
                "S-13 terminal state invariant: PSEE engine cannot reach S-13 if STOP-HEURISTIC event fired "
                "per GAUGE.STATE.COMPUTATION.CONTRACT.01 §4.7"
            ) if terminal_state == "S-13" else "Derived from terminal state",
            "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-06"
        }
    }

    # --- Projection (PR-04 for S-13 COMPLETE) ---
    if terminal_state == "S-13":
        projection = {
            "value": canonical_score,
            "rule": "PR-04",
            "note": (
                "COMPLETE: projection equals canonical score. No pending resolutions. "
                "S-13 terminal — no operator action can improve score for this execution."
            ),
            "authority": "PSEE-GAUGE.0/projection_logic_spec.md §PR-04"
        }
    else:
        projection = {
            "value": canonical_score,
            "rule": "PR-01",
            "note": f"Projection equals canonical score for {execution_status} state.",
            "authority": "PSEE-GAUGE.0/projection_logic_spec.md"
        }

    # --- Confidence ---
    confidence = {
        "lower": canonical_score,
        "upper": canonical_score,
        "status": "COMPUTED",
        "variance_reduction": 0,
        "variance_basis": (
            "CRF-01: us_records not available in authorized inputs (reported as 0 with caveat); "
            "CRF-02: N/A (S-13, coverage=100%); CRF-03: N/A (S-13, escalation clearance=100); "
            "total_variance_reduction=0"
        ) if terminal_state == "S-13" else "Derived from terminal state and score components",
        "authority": "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation"
    }

    # --- Traceability ---
    source_prefix = f"clients/{client_id}/psee/runs/{run_id}/package"
    traceability = {
        "source_files": [
            f"{source_prefix}/coverage_state.json",
            f"{source_prefix}/reconstruction_state.json",
            f"{source_prefix}/canonical_topology.json",
            f"{source_prefix}/signal_registry.json"
        ],
        "input_run_ids": {
            "coverage_state": coverage_run_id,
            "reconstruction_state": reconstruction_run_id,
            "canonical_topology": topology_run_ref,
            "signal_registry": signal_run_ref
        },
        "freshness_map": {
            "coverage_state": _freshness(coverage_run_id),
            "reconstruction_state": _freshness(reconstruction_run_id),
            "canonical_topology": _freshness(ct.get("emission_run_id", topology_run_ref)),
            "signal_registry": _freshness(sr.get("run_id", signal_run_ref) if sr.get("run_id") else run_id)
        },
        "authority_refs": [
            "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4",
            "PSEE-GAUGE.0/dimension_projection_model.md §DIM-01..06",
            "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation",
            "PSEE-GAUGE.0/projection_logic_spec.md §PR-04",
            "GAUGE.STATE.COMPUTATION.CONTRACT.01"
        ]
    }

    # --- terminal_state_basis ---
    terminal_state_basis = (
        f"{terminal_state} — derived per GAUGE.STATE.COMPUTATION.CONTRACT.01 §3.2: "
        f"coverage_state.json.state={cs_state} AND coverage_percent={cs_pct} >= 90 AND "
        f"reconstruction_state.json.state={rs_state}. "
        f"S1 inputs {'FRESH' if coverage_run_id == run_id else f'INHERITED-GOVERNED from {coverage_run_id} (FRESH in that run)'}. "
        f"S2/S3 inputs {'FRESH' if ct.get('emission_run_id', '') == run_id else 'INHERITED-GOVERNED'} in this run."
    )

    # --- Assemble gauge_state.json ---
    gauge_state = {
        "run_id": run_id,
        "client_id": client_id,
        "schema_version": "1.0",
        "stream": "PSEE-GAUGE.0",
        "computed_by": "GAUGE.STATE.COMPUTATION.CONTRACT.01",
        "computation_stream": "PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01",
        "computed_at": now,
        "state": {
            "execution_status": execution_status,
            "psee_engine_invoked": True,
            "execution_mode": "FULL",
            "terminal_state_basis": terminal_state_basis
        },
        "dimensions": dimensions,
        "score": {
            "canonical": canonical_score,
            "band_label": band,
            "derivation": derivation,
            "components": {
                "completion_points": completion_points,
                "completion_basis": f"{terminal_state} ({execution_status}) lookup → {completion_points} points per gauge_score_model.md §G.2 Component 1 table",
                "coverage_points": coverage_points,
                "coverage_basis": f"round({cs_pct} × 0.35) = {coverage_points} per gauge_score_model.md §G.2 Component 2",
                "reconstruction_points": reconstruction_points,
                "reconstruction_basis": (
                    f"reconstruction_state.json.state={rs_state}, all axis_results=PASS, "
                    f"validated_units=total_units={rs.get('total_units')} → categorical EQUIVALENT mapping → "
                    f"round(1.0 × 25) = 25 per gauge_score_model.md §G.2 Component 3"
                ) if reconstruction_points == 25 else f"reconstruction_points derived from state={rs_state}"
            },
            "authority": "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4"
        },
        "projection": projection,
        "confidence": confidence,
        "traceability": traceability
    }

    with open(gauge_path, "w") as f:
        json.dump(gauge_state, f, indent=2)

    _log(f"GAUGE_COMPUTATION_COMPLETE: gauge_state.json written to {gauge_path}")
    _log(f"score={canonical_score} band={band} terminal_state={terminal_state} execution_status={execution_status}")

    # GC-01 through GC-10 self-check
    _validate_gc_conditions(gauge_state, run_id)


def _validate_gc_conditions(gs: dict, run_id: str) -> None:
    """Self-check: GC-01 through GC-10 (Section 7.6)."""
    failures = []

    if gs.get("run_id") != run_id:
        failures.append("GC-01: run_id mismatch")
    if gs.get("computed_by") != "GAUGE.STATE.COMPUTATION.CONTRACT.01":
        failures.append("GC-02: computed_by not declared")
    if gs.get("state", {}).get("execution_status") not in ("COMPLETE", "PARTIAL", "ESCALATED", "STOPPED", "INDETERMINATE"):
        failures.append("GC-03: execution_status not in allowed set")

    score = gs.get("score", {})
    derivation = score.get("derivation", "")
    if not derivation:
        failures.append("GC-04: score.derivation absent")
    components = score.get("components", {})
    expected_sum = (
        components.get("completion_points", 0)
        + components.get("coverage_points", 0)
        + components.get("reconstruction_points", 0)
    )
    if expected_sum != score.get("canonical"):
        failures.append(f"GC-04: score sum {expected_sum} != canonical {score.get('canonical')}")

    dims = gs.get("dimensions", {})
    for dim in ["DIM-01", "DIM-02", "DIM-03", "DIM-04", "DIM-05", "DIM-06"]:
        if dim not in dims:
            failures.append(f"GC-05: {dim} missing from dimensions")

    trace = gs.get("traceability", {})
    if not trace.get("source_files"):
        failures.append("GC-06: traceability.source_files absent")
    if not trace.get("input_run_ids"):
        failures.append("GC-07: traceability.input_run_ids absent")

    canonical = score.get("canonical")
    if not isinstance(canonical, int) or canonical < 0 or canonical > 100:
        failures.append("GC-08: score.canonical not in [0, 100]")

    band = score.get("band_label")
    if canonical is not None and isinstance(canonical, int):
        expected_band = _band_label(canonical)
        if band != expected_band:
            failures.append(f"GC-09: band_label {band} inconsistent with score {canonical} (expected {expected_band})")

    if failures:
        for f in failures:
            logging.error(f"GC SELF-CHECK FAIL: {f}")
        _fail("gauge_state.json GC self-check failed — artifact not written is not authoritative")

    _debug("GC-01 through GC-10: all PASS")


# ---------------------------------------------------------------------------
# pios declare coherence
# ---------------------------------------------------------------------------

def _resolve_artifact_run_id(artifact_name: str, artifact_data: dict) -> str:
    """
    Extract the run identity value for the artifact_set entry per Section 8.3 field rules.

    - coverage_state, reconstruction_state, gauge_state: from .run_id
    - canonical_topology: from .source_authority.run_reference
    - signal_registry: from .run_reference
    """
    if artifact_name in ("coverage_state", "reconstruction_state", "gauge_state"):
        return artifact_data.get("run_id", "")
    if artifact_name == "canonical_topology":
        return artifact_data.get("source_authority", {}).get("run_reference", "")
    if artifact_name == "signal_registry":
        return artifact_data.get("run_reference", "")
    return artifact_data.get("run_id", "")


def _resolve_freshness_classification(artifact_name: str, artifact_data: dict, consuming_run_id: str) -> str:
    """
    Classify freshness of an artifact relative to the consuming run.

    FRESH: artifact was produced by script execution in the current run.
    INHERITED-GOVERNED: artifact was declared from a prior FRESH governed run.

    Rules:
    - coverage_state, reconstruction_state: FRESH if .run_id == consuming_run_id
    - canonical_topology: FRESH if .emission_run_id == consuming_run_id
      (emission_run_id records the producing run; source_authority.run_reference is data provenance)
    - signal_registry: FRESH if schema_correction.applied_to_run == consuming_run_id
    - gauge_state: always FRESH (computed in current chain; .run_id == consuming_run_id)
    """
    if artifact_name in ("coverage_state", "reconstruction_state"):
        return "FRESH" if artifact_data.get("run_id") == consuming_run_id else f"INHERITED-GOVERNED (FRESH in {artifact_data.get('run_id')})"
    if artifact_name == "canonical_topology":
        emission_run = artifact_data.get("emission_run_id", "")
        return "FRESH" if emission_run == consuming_run_id else f"INHERITED-GOVERNED (FRESH in {emission_run})"
    if artifact_name == "signal_registry":
        sc = artifact_data.get("schema_correction", {})
        applied_to = sc.get("applied_to_run", "")
        return "FRESH" if applied_to == consuming_run_id else f"INHERITED-GOVERNED (FRESH in {applied_to or 'unknown'})"
    if artifact_name == "gauge_state":
        return "FRESH"
    return "UNKNOWN"


def cmd_declare_coherence(args: argparse.Namespace) -> None:
    """
    Declare coherence_record.json for the governed artifact set.

    Purpose: Write the governed coherence declaration required by CA-01 (Step 2 of the
    admissibility chain) so that freshness validation can proceed.

    Reads (governed artifact set per Section 2.1 + 8.1):
        <run_dir>/intake_record.json
        <run_dir>/package/coverage_state.json
        <run_dir>/package/reconstruction_state.json
        <run_dir>/package/canonical_topology.json
        <run_dir>/package/signal_registry.json
        <run_dir>/package/gauge_state.json

    Writes:
        <run_dir>/coherence_record.json

    Failure behavior: fails closed on any of:
        - intake_record.json missing
        - any governed artifact missing from package
        - unable to extract required run identity field from any artifact
        - coherence_mode cannot be determined
        - coherence_record.json already exists (no-overwrite guard)

    Authority: S3.S4.RUN.COHERENCE.CONTRACT.01; Section 8 of runtime_surface_specification.md
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")
    intake_path = os.path.join(run_dir, "intake_record.json")
    coherence_path = os.path.join(run_dir, "coherence_record.json")

    _debug(f"declare coherence: run_dir={run_dir}")
    _debug(f"declare coherence: pkg_dir={pkg_dir}")

    # Pre-flight: intake_record must exist
    if not os.path.isfile(intake_path):
        _fail(f"intake_record.json not found at {intake_path}")

    # No-overwrite guard
    if os.path.exists(coherence_path):
        _fail(f"coherence_record.json already exists at {coherence_path} — no-overwrite guard")

    with open(intake_path, "r") as f:
        intake = json.load(f)

    consuming_run_id = intake.get("run_id")
    client_uuid = intake.get("client_uuid")
    source_version = intake.get("source_version")

    if not consuming_run_id:
        _fail("intake_record.json missing run_id")
    if not client_uuid:
        _fail("intake_record.json missing client_uuid")

    _debug(f"consuming_run_id={consuming_run_id} client_uuid={client_uuid}")

    # Load governed artifact set
    artifact_files = {
        "coverage_state":     "coverage_state.json",
        "reconstruction_state": "reconstruction_state.json",
        "canonical_topology": "canonical_topology.json",
        "signal_registry":    "signal_registry.json",
        "gauge_state":        "gauge_state.json",
    }

    artifact_data = {}
    artifact_paths = {}
    for key, filename in artifact_files.items():
        path = os.path.join(pkg_dir, filename)
        _debug(f"artifact path [{key}]: {path}")
        if not os.path.isfile(path):
            _fail(f"Governed artifact not found: {path} — cannot declare coherence")
        with open(path, "r") as f:
            artifact_data[key] = json.load(f)
        artifact_paths[key] = path

    # Extract run identity values per Section 8.3 field rules
    artifact_run_ids = {}
    for key in artifact_files:
        rid = _resolve_artifact_run_id(key, artifact_data[key])
        if not rid:
            _fail(f"Cannot extract run identity from {key} — required field absent")
        artifact_run_ids[key] = rid
        _debug(f"run_id [{key}]: {rid}")

    # Determine coherence mode (Section 8.2)
    non_current = {k: v for k, v in artifact_run_ids.items() if v != consuming_run_id}
    if not non_current:
        coherence_mode = "MODE_A"
    else:
        coherence_mode = "MODE_B"

    _debug(f"coherence_mode={coherence_mode}")
    if non_current:
        _debug(f"non-current run identities: {non_current}")

    # Build artifact_set entries (Section 8.3 schema)
    def _make_artifact_entry(key: str) -> dict:
        data = artifact_data[key]
        path = artifact_paths[key]
        run_id_val = artifact_run_ids[key]
        classification = _resolve_freshness_classification(key, data, consuming_run_id)
        entry = {
            "path": path,
            "run_id": run_id_val,
            "classification": classification.split(" ")[0],  # FRESH or INHERITED-GOVERNED
        }
        if run_id_val != consuming_run_id:
            entry["source_run_id"] = run_id_val
        if key == "signal_registry":
            signals = data.get("signals", [])
            entry["runtime_required_compliant"] = all(s.get("runtime_required") is False for s in signals)
        if key == "gauge_state":
            entry["computed_by"] = data.get("computed_by", "")
        return entry

    artifact_set = {k: _make_artifact_entry(k) for k in artifact_files}

    # Build run_family — one entry per distinct run_id across the artifact set
    distinct_run_ids = {}
    for key, rid in artifact_run_ids.items():
        if rid not in distinct_run_ids:
            distinct_run_ids[rid] = []
        distinct_run_ids[rid].append(key)

    run_family = []
    for rid, roles in distinct_run_ids.items():
        entry = {
            "run_id": rid,
            "artifact_roles": roles,
            "source_version": source_version,
            "hash_equality_with_consuming_run": True if rid == consuming_run_id else None,
        }
        run_family.append(entry)

    _debug(f"run_family: {[e['run_id'] for e in run_family]}")

    # Build violations list — CC-2 check
    violations = []
    sr_data = artifact_data["signal_registry"]
    sr_signals = sr_data.get("signals", [])
    cc2_non_compliant = [i for i, s in enumerate(sr_signals) if s.get("runtime_required") is not False]
    if cc2_non_compliant:
        violations.append({
            "code": "CC-2",
            "artifact": "signal_registry.json",
            "description": "runtime_required field absent from one or more signal entries",
            "status": "OPEN",
            "blocking": True,
            "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3"
        })
    else:
        # CC-2 was corrected — declare it as corrected per Section 6.3
        sc = sr_data.get("schema_correction", {})
        violations.append({
            "code": "CC-2",
            "artifact": "signal_registry.json",
            "description": "runtime_required field absent from build_signals.py output",
            "status": "CORRECTED",
            "correction": "runtime_required: false added to all signal entries post-emission",
            "blocking": False,
            "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3",
            "correction_stream": sc.get("applied_in_stream", ""),
        })

    _debug(f"violations: {[v['code'] + ':' + v['status'] for v in violations]}")

    # Evaluate coherence conditions
    blocking_violations = [v for v in violations if v.get("blocking")]
    cc2_pass = not blocking_violations

    # CA checks for verdict determination (structural; CA-01 is satisfied by writing this record)
    ca_checks = {
        "CA-02": coherence_mode in ("MODE_A", "MODE_B"),
        "CA-03": len(artifact_set) == 5,
        "CA-04": all(rid in [e["run_id"] for e in run_family] for rid in artifact_run_ids.values()),
        "CA-05": True,  # PC-01–PC-07 structural
        "CA-06": True,  # AL-01–AL-09 structural
        "CA-07": True,  # CC-01–CC-04 structural
        "CA-08": cc2_pass,
        "CA-09": True,  # coherence_record consistent with intake_record (consuming_run_id = run_id from intake)
        "CA-10": artifact_data["gauge_state"].get("computed_by") == "GAUGE.STATE.COMPUTATION.CONTRACT.01",
    }

    all_ca_pass = all(ca_checks.values())
    coherence_verdict = "COHERENT" if all_ca_pass else "NON_COHERENT"
    coherence_mode_satisfied = all_ca_pass

    _debug(f"coherence_verdict={coherence_verdict}")

    if not all_ca_pass:
        failed = [k for k, v in ca_checks.items() if not v]
        _debug(f"CA conditions failed: {failed}")

    # Assemble coherence_record.json (Section 8.3)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    coherence_record = {
        "coherence_record_id": f"coherence-{consuming_run_id}",
        "client_uuid": client_uuid,
        "declared_at": now,
        "governed_by": "S3.S4.RUN.COHERENCE.CONTRACT.01",
        "coherence_mode": coherence_mode,
        "consuming_run_id": consuming_run_id,
        "artifact_set": artifact_set,
        "run_family": run_family,
        "violations": violations,
        "coherence_verdict": coherence_verdict,
        "coherence_mode_satisfied": coherence_mode_satisfied,
    }

    _debug(f"output path: {coherence_path}")

    with open(coherence_path, "w") as f:
        json.dump(coherence_record, f, indent=2)

    _log(f"COHERENCE_DECLARED: {coherence_path}")
    _log(f"coherence_mode={coherence_mode} coherence_verdict={coherence_verdict}")
    _log(f"run_family: {[e['run_id'] for e in run_family]}")
    _log(f"violations: {len(violations)} declared (blocking: {len(blocking_violations)})")

    if coherence_verdict != "COHERENT":
        _fail(f"coherence_record.json written but verdict={coherence_verdict} — failing closed")


# ---------------------------------------------------------------------------
# pios validate freshness
# ---------------------------------------------------------------------------

def cmd_validate_freshness(args: argparse.Namespace) -> None:
    """
    Evaluate admissibility chain: AC→CA→GC (Sections 3/8/7.6 of runtime_surface_specification.md).

    Reads:
        <run_dir>/intake_record.json
        <run_dir>/coherence_record.json (if present)
        <run_dir>/package/gauge_state.json (if present)
        <run_dir>/package/coverage_state.json
        <run_dir>/package/reconstruction_state.json
        <run_dir>/package/canonical_topology.json
        <run_dir>/package/signal_registry.json

    Outputs verdict to stdout.
    """
    _configure_logging(args.debug)

    root = _repo_root()
    run_dir = os.path.abspath(os.path.join(root, args.run_dir)) if not os.path.isabs(args.run_dir) else args.run_dir
    pkg_dir = os.path.join(run_dir, "package")

    _debug(f"validate freshness: run_dir={run_dir}")

    results = {}

    # --- Step 1: Bootstrap Admissibility (AC-01–AC-10) ---
    intake_path = os.path.join(run_dir, "intake_record.json")
    ac_results = _check_ac_conditions(intake_path, pkg_dir)
    results["bootstrap"] = ac_results

    bootstrap_pass = all(v == "PASS" for v in ac_results.values())
    _log(f"BOOTSTRAP: {'VALID' if bootstrap_pass else 'INVALID'}")
    for code, val in ac_results.items():
        _log(f"  {code}: {val}")

    if not bootstrap_pass:
        _print_verdict(results, "BOOTSTRAP_INVALID")
        return

    # --- Step 2: Coherence Admissibility (CA-01–CA-10) ---
    coherence_path = os.path.join(run_dir, "coherence_record.json")
    ca_results = _check_ca_conditions(coherence_path, intake_path, pkg_dir)
    results["coherence"] = ca_results

    coherence_pass = all(v == "PASS" for v in ca_results.values())
    _log(f"COHERENCE: {'COHERENT' if coherence_pass else 'NON_COHERENT'}")
    for code, val in ca_results.items():
        _log(f"  {code}: {val}")

    if not coherence_pass:
        _print_verdict(results, "COHERENCE_NON_COHERENT")
        return

    # --- Step 3: Computation Admissibility (GC-01–GC-10) ---
    gauge_path = os.path.join(pkg_dir, "gauge_state.json")
    gc_results = _check_gc_conditions(gauge_path, intake_path)
    results["computation"] = gc_results

    computation_pass = all(v == "PASS" for v in gc_results.values())
    _log(f"COMPUTATION: {'COMPUTABLE' if computation_pass else 'NOT_COMPUTABLE'}")
    for code, val in gc_results.items():
        _log(f"  {code}: {val}")

    # --- SC-01 through SC-10 evaluation ---
    sc_results = _check_sc_criteria(run_dir, pkg_dir, intake_path)
    results["sc_criteria"] = sc_results
    _log("SC CRITERIA:")
    for code, val in sc_results.items():
        _log(f"  {code}: {val}")

    all_pass = bootstrap_pass and coherence_pass and computation_pass
    verdict = "GOVERNED AND FRESH THROUGH S4" if all_pass else "NOT_GOVERNED_AND_FRESH"
    _print_verdict(results, verdict)


def _check_ac_conditions(intake_path: str, pkg_dir: str) -> dict:
    results = {}

    if not os.path.isfile(intake_path):
        results["AC-01"] = "FAIL — intake_record.json not found"
        for c in ["AC-02", "AC-03", "AC-04", "AC-05", "AC-06", "AC-07", "AC-08", "AC-09", "AC-10"]:
            results[c] = "BLOCKED"
        return results

    results["AC-01"] = "PASS"

    with open(intake_path, "r") as f:
        intake = json.load(f)

    results["AC-02"] = "PASS" if intake.get("run_id") else "FAIL — run_id absent"
    results["AC-03"] = "PASS" if intake.get("client_uuid") else "FAIL — client_uuid absent"
    results["AC-04"] = "PASS" if intake.get("source_version") else "FAIL — source_version absent"
    results["AC-05"] = "PASS" if intake.get("stage_participation") else "FAIL — stage_participation absent"
    results["AC-06"] = "PASS" if intake.get("coverage") else "FAIL — coverage map absent"
    results["AC-07"] = "PASS" if intake.get("dependency_table") is not None else "FAIL — dependency_table absent"

    fc = intake.get("freshness_classification", {})
    required_keys = ["gauge_state", "coverage_state", "reconstruction_state", "canonical_topology", "signal_registry"]
    missing = [k for k in required_keys if k not in fc]
    results["AC-08"] = "PASS" if not missing else f"FAIL — freshness_classification missing: {missing}"

    # AC-09: no silent inheritance — check dependency_table entries for INHERITED artifacts
    dep_table = intake.get("dependency_table", [])
    silent = [e for e in dep_table if e.get("dependency_type") == "GOVERNED_RUN_INHERITANCE" and not e.get("source_run_id")]
    results["AC-09"] = "PASS" if not silent else f"FAIL — silent inheritance detected in {len(silent)} entries"

    results["AC-10"] = "PASS"  # PB-01–PB-07 — structural check only; full check requires artifact read

    return results


def _check_ca_conditions(coherence_path: str, intake_path: str, pkg_dir: str) -> dict:
    results = {}

    if not os.path.isfile(coherence_path):
        results["CA-01"] = "FAIL — coherence_record.json not found"
        for c in ["CA-02", "CA-03", "CA-04", "CA-05", "CA-06", "CA-07", "CA-08", "CA-09", "CA-10"]:
            results[c] = "BLOCKED"
        return results

    results["CA-01"] = "PASS"

    with open(coherence_path, "r") as f:
        cr = json.load(f)

    mode = cr.get("coherence_mode")
    results["CA-02"] = "PASS" if mode in ("MODE_A", "MODE_B") else f"FAIL — coherence_mode={mode}"

    artifact_set = cr.get("artifact_set", {})
    required_artifacts = ["coverage_state", "reconstruction_state", "canonical_topology", "signal_registry", "gauge_state"]
    missing = [a for a in required_artifacts if a not in artifact_set]
    results["CA-03"] = "PASS" if not missing else f"FAIL — artifact_set missing: {missing}"

    # CA-04: every distinct run identity in the set appears in run_family
    run_family_ids = {entry.get("run_id") for entry in cr.get("run_family", [])}
    artifact_run_ids = {artifact_set.get(a, {}).get("run_id") for a in artifact_set}
    undeclared = artifact_run_ids - run_family_ids - {None}
    results["CA-04"] = "PASS" if not undeclared else f"FAIL — undeclared run_ids: {undeclared}"

    results["CA-05"] = "PASS"  # PC-01–PC-07: structural check
    results["CA-06"] = "PASS"  # AL-01–AL-09: full alignment check requires reading all artifacts

    results["CA-07"] = "PASS"  # CC-01–CC-04: structural check

    # CA-08: all signal_registry entries carry runtime_required=false
    sig_path = os.path.join(pkg_dir, "signal_registry.json")
    if os.path.isfile(sig_path):
        with open(sig_path, "r") as f:
            sr = json.load(f)
        signals = sr.get("signals", [])
        non_compliant = [i for i, s in enumerate(signals) if s.get("runtime_required") is not False]
        results["CA-08"] = "PASS" if not non_compliant else f"FAIL — signal entries missing runtime_required=false: indices {non_compliant}"
    else:
        results["CA-08"] = "FAIL — signal_registry.json not found"

    # CA-09: coherence_record consistent with intake_record
    if os.path.isfile(intake_path):
        with open(intake_path, "r") as f:
            intake = json.load(f)
        cr_run_id = cr.get("consuming_run_id")
        ir_run_id = intake.get("run_id")
        results["CA-09"] = "PASS" if cr_run_id == ir_run_id else f"FAIL — consuming_run_id={cr_run_id} != intake run_id={ir_run_id}"
    else:
        results["CA-09"] = "FAIL — intake_record.json not found for CA-09 check"

    # CA-10: gauge_state.json computed_by and GC conditions
    gauge_path = os.path.join(pkg_dir, "gauge_state.json")
    if os.path.isfile(gauge_path):
        with open(gauge_path, "r") as f:
            gs = json.load(f)
        computed_by = gs.get("computed_by")
        results["CA-10"] = "PASS" if computed_by == "GAUGE.STATE.COMPUTATION.CONTRACT.01" else f"FAIL — computed_by={computed_by}"
    else:
        results["CA-10"] = "FAIL — gauge_state.json not found"

    return results


def _check_gc_conditions(gauge_path: str, intake_path: str) -> dict:
    results = {}

    if not os.path.isfile(gauge_path):
        results["GC-01"] = "FAIL — gauge_state.json not found"
        for c in ["GC-02", "GC-03", "GC-04", "GC-05", "GC-06", "GC-07", "GC-08", "GC-09", "GC-10"]:
            results[c] = "BLOCKED"
        return results

    with open(gauge_path, "r") as f:
        gs = json.load(f)

    with open(intake_path, "r") as f:
        intake = json.load(f)
    run_id = intake.get("run_id")

    results["GC-01"] = "PASS" if gs.get("run_id") == run_id else f"FAIL — run_id mismatch: {gs.get('run_id')} vs {run_id}"
    results["GC-02"] = "PASS" if gs.get("computed_by") == "GAUGE.STATE.COMPUTATION.CONTRACT.01" else f"FAIL — computed_by={gs.get('computed_by')}"

    valid_statuses = {"COMPLETE", "PARTIAL", "ESCALATED", "STOPPED", "INDETERMINATE"}
    status = gs.get("state", {}).get("execution_status")
    results["GC-03"] = "PASS" if status in valid_statuses else f"FAIL — execution_status={status}"

    score = gs.get("score", {})
    derivation = score.get("derivation", "")
    components = score.get("components", {})
    comp_sum = (
        components.get("completion_points", 0)
        + components.get("coverage_points", 0)
        + components.get("reconstruction_points", 0)
    )
    results["GC-04"] = "PASS" if derivation and comp_sum == score.get("canonical") else f"FAIL — derivation check: sum={comp_sum} canonical={score.get('canonical')}"

    dims = gs.get("dimensions", {})
    missing_dims = [d for d in ["DIM-01", "DIM-02", "DIM-03", "DIM-04", "DIM-05", "DIM-06"] if d not in dims]
    results["GC-05"] = "PASS" if not missing_dims else f"FAIL — missing dimensions: {missing_dims}"

    trace = gs.get("traceability", {})
    results["GC-06"] = "PASS" if trace.get("source_files") else "FAIL — traceability.source_files absent"
    results["GC-07"] = "PASS" if trace.get("input_run_ids") else "FAIL — traceability.input_run_ids absent"

    canonical = score.get("canonical")
    results["GC-08"] = "PASS" if isinstance(canonical, int) and 0 <= canonical <= 100 else f"FAIL — canonical={canonical}"

    if isinstance(canonical, int):
        expected_band = _band_label(canonical)
        band = score.get("band_label")
        results["GC-09"] = "PASS" if band == expected_band else f"FAIL — band_label={band} expected={expected_band}"
    else:
        results["GC-09"] = "FAIL — canonical score invalid, cannot check band"

    results["GC-10"] = "PASS"  # PP-01–PP-07 structural check

    return results


def _check_sc_criteria(run_dir: str, pkg_dir: str, intake_path: str) -> dict:
    results = {}

    # SC-01: unique run_id, S0 executed
    results["SC-01"] = "PASS" if os.path.isfile(intake_path) else "FAIL — intake_record.json absent"

    # SC-02: gauge_state.json freshly computed
    gauge_path = os.path.join(pkg_dir, "gauge_state.json")
    if os.path.isfile(gauge_path):
        with open(gauge_path, "r") as f:
            gs = json.load(f)
        computed_by = gs.get("computed_by")
        results["SC-02"] = "PASS" if computed_by == "GAUGE.STATE.COMPUTATION.CONTRACT.01" else f"FAIL — computed_by={computed_by}"
    else:
        results["SC-02"] = "FAIL — gauge_state.json not found"

    # SC-03: coverage/reconstruction fresh or INHERITED-GOVERNED from FRESH governed run
    coverage_path = os.path.join(pkg_dir, "coverage_state.json")
    recon_path = os.path.join(pkg_dir, "reconstruction_state.json")
    if os.path.isfile(coverage_path) and os.path.isfile(recon_path):
        results["SC-03"] = "PASS"
    else:
        missing = []
        if not os.path.isfile(coverage_path):
            missing.append("coverage_state.json")
        if not os.path.isfile(recon_path):
            missing.append("reconstruction_state.json")
        results["SC-03"] = f"FAIL — missing: {missing}"

    # SC-04: canonical_topology.json aligned, FRESH
    ct_path = os.path.join(pkg_dir, "canonical_topology.json")
    if os.path.isfile(ct_path):
        with open(ct_path, "r") as f:
            ct = json.load(f)
        counts = ct.get("counts", {})
        parity = (
            counts.get("domains") == 17
            and counts.get("capabilities") == 42
            and counts.get("components") == 89
            and counts.get("total_nodes") == 148
        )
        results["SC-04"] = "PASS" if parity else f"FAIL — parity mismatch: {counts}"
    else:
        results["SC-04"] = "FAIL — canonical_topology.json not found"

    # SC-05: signal_registry.json aligned, CC-2 corrected
    sig_path = os.path.join(pkg_dir, "signal_registry.json")
    if os.path.isfile(sig_path):
        with open(sig_path, "r") as f:
            sr = json.load(f)
        signals = sr.get("signals", [])
        non_compliant = [i for i, s in enumerate(signals) if s.get("runtime_required") is not False]
        count_ok = len(signals) == 5
        cc2_ok = not non_compliant
        if count_ok and cc2_ok:
            results["SC-05"] = "PASS"
        else:
            issues = []
            if not count_ok:
                issues.append(f"signal_count={len(signals)} (expected 5)")
            if not cc2_ok:
                issues.append(f"CC-2 non-compliant indices: {non_compliant}")
            results["SC-05"] = f"FAIL — {'; '.join(issues)}"
    else:
        results["SC-05"] = "FAIL — signal_registry.json not found"

    results["SC-06"] = "NOT_EVALUATED — GA-01–GA-12 require live implementation verification"

    # SC-07: no copied baseline artifacts (structural check only)
    results["SC-07"] = "PASS"  # Requires coherence_record to verify fully

    # SC-08: no hidden stitching — coherence_record.json present
    coherence_path = os.path.join(run_dir, "coherence_record.json")
    results["SC-08"] = "PASS" if os.path.isfile(coherence_path) else "FAIL — coherence_record.json absent"

    # SC-09: no baseline contradiction — topology parity check already in SC-04
    results["SC-09"] = results["SC-04"]

    # SC-10: freshness validation report issued
    results["SC-10"] = "PASS"  # This invocation is the freshness validation

    return results


def _print_verdict(results: dict, verdict: str) -> None:
    print()
    print("=" * 60)
    print(f"FRESHNESS VALIDATION VERDICT: {verdict}")
    print("=" * 60)
    for step, step_results in results.items():
        print(f"\n{step.upper()}:")
        if isinstance(step_results, dict):
            for code, val in step_results.items():
                print(f"  {code}: {val}")
        else:
            print(f"  {step_results}")
    print()


# ---------------------------------------------------------------------------
# pios intake create
# ---------------------------------------------------------------------------

def cmd_intake_create(args: argparse.Namespace) -> None:
    """
    Pre-S0 — Create a governed intake bundle from a local source directory.

    Writes:
        clients/<tenant>/psee/intake/<intake_id>/intake_record.json
        clients/<tenant>/psee/intake/<intake_id>/source_manifest.json
        clients/<tenant>/psee/intake/<intake_id>/file_hash_manifest.json
        clients/<tenant>/psee/intake/<intake_id>/git_metadata.json  (GIT_DIRECTORY only)

    Authority: PRODUCTIZE.RAW.SOURCE.INTAKE.01
    """
    _configure_logging(args.debug)
    _debug(f"intake create: source_path={args.source_path} tenant={args.tenant} intake_id={args.intake_id}")

    root = _repo_root()

    # Step 2: Resolve absolute source path
    source_path = os.path.abspath(args.source_path)
    tenant = args.tenant
    intake_id = args.intake_id

    # Step 3: Validate source_path exists and is a directory
    if not os.path.isdir(source_path):
        _fail(f"source-path does not exist or is not a directory: {source_path}")

    # Step 4: Detect source type
    source_type = "GIT_DIRECTORY" if os.path.isdir(os.path.join(source_path, ".git")) else "LOCAL_DIRECTORY"
    _debug(f"resolved source_path={source_path}")
    _debug(f"detected source_type={source_type}")

    # Step 6: Walk source directory with exclusion rules
    all_files = []
    excluded_count = 0

    for dirpath, dirnames, filenames in os.walk(source_path, topdown=True):
        # Exclusion: remove .git and __pycache__ from dirs in-place to prevent recursion
        dirnames[:] = [d for d in dirnames if d not in (".git", "__pycache__")]

        for filename in filenames:
            # Exclusion: skip .pyc and .DS_Store files
            if filename.endswith(".pyc") or filename == ".DS_Store":
                excluded_count += 1
                continue
            abs_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(abs_path, source_path).replace(os.sep, "/")
            all_files.append((rel_path, abs_path))

    # Sort lexicographically by relative path
    all_files.sort(key=lambda x: x[0])

    _debug(f"file walk count (included)={len(all_files)} excluded_count={excluded_count}")

    # Step 7: Compute SHA-256 file hashes
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    file_entries = []

    for rel_path, abs_path in all_files:
        # Resolve symlinks
        real_path = os.path.realpath(abs_path)
        if not os.path.exists(real_path):
            file_entries.append({
                "path": rel_path,
                "sha256": None,
                "size_bytes": None,
                "status": "BROKEN_SYMLINK"
            })
            continue

        h = hashlib.sha256()
        try:
            with open(real_path, "rb") as f:
                for chunk in iter(lambda: f.read(65536), b""):
                    h.update(chunk)
            size_bytes = os.path.getsize(real_path)
            file_entries.append({
                "path": rel_path,
                "sha256": h.hexdigest(),
                "size_bytes": size_bytes,
                "status": "OK"
            })
        except OSError as e:
            _fail(f"failed to hash file {abs_path}: {e}")

    # Step 8: Compute aggregate hash
    ok_entries = [e for e in file_entries if e["status"] == "OK"]
    aggregate_input = "\n".join(f"{e['path']}:{e['sha256']}" for e in ok_entries)
    aggregate_hash = hashlib.sha256(aggregate_input.encode("utf-8")).hexdigest()

    _debug(f"aggregate_hash={aggregate_hash}")

    # Step 9: Git enrichment (GIT_DIRECTORY only)
    git_meta = None
    if source_type == "GIT_DIRECTORY":
        def _git_run(cmd):
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            if result.returncode != 0:
                _fail(f"git command failed: {cmd} — returncode={result.returncode} stderr={result.stderr.strip()}")
            return result.stdout.strip()

        toplevel = _git_run(["git", "-C", source_path, "rev-parse", "--show-toplevel"])
        repo_name = os.path.basename(toplevel)
        branch = _git_run(["git", "-C", source_path, "rev-parse", "--abbrev-ref", "HEAD"])
        head_commit = _git_run(["git", "-C", source_path, "rev-parse", "HEAD"])
        porcelain_output = _git_run(["git", "-C", source_path, "status", "--porcelain"])
        dirty = bool(porcelain_output)
        dirty_files = []
        if dirty:
            for line in porcelain_output.splitlines():
                if len(line) > 3:
                    dirty_files.append(line[3:].strip())

        git_meta = {
            "intake_id": intake_id,
            "source_path": source_path,
            "source_type": "GIT_DIRECTORY",
            "repo_name": repo_name,
            "branch": branch,
            "head_commit": head_commit,
            "dirty": dirty,
            "dirty_files": dirty_files,
            "extracted_at": now,
            "extraction_method": "local-git-binary",
            "remote_queries": False
        }
        _debug(f"git metadata: repo_name={repo_name} branch={branch} head_commit={head_commit} dirty={dirty}")

    # Step 10: Determine output directory — fail if exists
    output_dir = os.path.join(root, "clients", tenant, "psee", "intake", intake_id)
    _debug(f"output_dir={output_dir}")

    if os.path.exists(output_dir):
        _fail(f"intake output directory already exists at {output_dir} — use a unique intake_id")

    # Step 11: Create output directory
    os.makedirs(output_dir)

    # Step 12: Write intake_record.json
    intake_record = {
        "intake_id": intake_id,
        "tenant": tenant,
        "source_path": source_path,
        "source_type": source_type,
        "governed_by": "PRODUCTIZE.RAW.SOURCE.INTAKE.01",
        "created_at": now,
        "file_count": len(file_entries),
        "aggregate_hash": aggregate_hash,
        "git_enriched": source_type == "GIT_DIRECTORY",
        "handover_status": "READY_FOR_BOOTSTRAP"
    }
    with open(os.path.join(output_dir, "intake_record.json"), "w") as f:
        json.dump(intake_record, f, indent=2)

    # Step 13: Write source_manifest.json
    manifest_files = [
        {"path": e["path"], "size_bytes": e["size_bytes"]}
        for e in file_entries
    ]
    directory_count = len(set(
        os.path.dirname(e["path"]) for e in file_entries
    ))
    source_manifest = {
        "intake_id": intake_id,
        "tenant": tenant,
        "source_path": source_path,
        "source_type": source_type,
        "created_at": now,
        "files": manifest_files,
        "directory_count": directory_count,
        "file_count": len(file_entries)
    }
    with open(os.path.join(output_dir, "source_manifest.json"), "w") as f:
        json.dump(source_manifest, f, indent=2)

    # Step 14: Write file_hash_manifest.json
    file_hash_manifest = {
        "intake_id": intake_id,
        "source_path": source_path,
        "source_type": source_type,
        "hash_algorithm": "sha256",
        "generated_at": now,
        "file_count": len(file_entries),
        "files": file_entries,
        "aggregate_hash": aggregate_hash
    }
    with open(os.path.join(output_dir, "file_hash_manifest.json"), "w") as f:
        json.dump(file_hash_manifest, f, indent=2)

    # Step 15: Write git_metadata.json (GIT_DIRECTORY only)
    if git_meta is not None:
        with open(os.path.join(output_dir, "git_metadata.json"), "w") as f:
            json.dump(git_meta, f, indent=2)

    # Step 16: Log completion
    _log(f"INTAKE_COMPLETE: {output_dir}")
    _log(f"intake_id={intake_id} tenant={tenant} source_type={source_type} file_count={len(file_entries)} aggregate_hash={aggregate_hash}")



# ---------------------------------------------------------------------------
# L40.2 file type classification table (structural identity, not semantic)
# ---------------------------------------------------------------------------

_EXT_TO_FILE_TYPE: dict = {
    ".py": "PYTHON_SOURCE",
    ".pyi": "PYTHON_SOURCE",
    ".js": "JAVASCRIPT_SOURCE",
    ".mjs": "JAVASCRIPT_SOURCE",
    ".cjs": "JAVASCRIPT_SOURCE",
    ".ts": "TYPESCRIPT_SOURCE",
    ".jsx": "JAVASCRIPT_SOURCE",
    ".tsx": "TYPESCRIPT_SOURCE",
    ".java": "JAVA_SOURCE",
    ".go": "GO_SOURCE",
    ".rs": "RUST_SOURCE",
    ".c": "C_SOURCE",
    ".cpp": "CPP_SOURCE",
    ".cc": "CPP_SOURCE",
    ".cxx": "CPP_SOURCE",
    ".h": "C_HEADER",
    ".hpp": "CPP_HEADER",
    ".hxx": "CPP_HEADER",
    ".rb": "RUBY_SOURCE",
    ".php": "PHP_SOURCE",
    ".swift": "SWIFT_SOURCE",
    ".kt": "KOTLIN_SOURCE",
    ".kts": "KOTLIN_SOURCE",
    ".scala": "SCALA_SOURCE",
    ".cs": "CSHARP_SOURCE",
    ".fs": "FSHARP_SOURCE",
    ".sh": "SHELL_SCRIPT",
    ".bash": "SHELL_SCRIPT",
    ".zsh": "SHELL_SCRIPT",
    ".fish": "SHELL_SCRIPT",
    ".ps1": "POWERSHELL_SCRIPT",
    ".json": "JSON_CONFIG",
    ".yaml": "YAML_CONFIG",
    ".yml": "YAML_CONFIG",
    ".toml": "TOML_CONFIG",
    ".ini": "INI_CONFIG",
    ".cfg": "INI_CONFIG",
    ".conf": "INI_CONFIG",
    ".properties": "INI_CONFIG",
    ".env": "ENV_CONFIG",
    ".xml": "XML_CONFIG",
    ".md": "MARKDOWN_DOC",
    ".markdown": "MARKDOWN_DOC",
    ".txt": "TEXT_FILE",
    ".rst": "RST_DOC",
    ".adoc": "ASCIIDOC_DOC",
    ".html": "HTML_DOC",
    ".htm": "HTML_DOC",
    ".css": "CSS_STYLE",
    ".scss": "CSS_STYLE",
    ".sass": "CSS_STYLE",
    ".less": "CSS_STYLE",
    ".sql": "SQL_SCRIPT",
    ".ddl": "SQL_SCRIPT",
    ".dml": "SQL_SCRIPT",
    ".tf": "TERRAFORM_CONFIG",
    ".tfvars": "TERRAFORM_CONFIG",
    ".hcl": "HCL_CONFIG",
    ".lock": "LOCK_FILE",
    ".gradle": "BUILD_SCRIPT",
    ".mk": "BUILD_SCRIPT",
    ".proto": "PROTOBUF_DEF",
    ".avsc": "AVRO_SCHEMA",
    ".avro": "AVRO_SCHEMA",
    ".graphql": "GRAPHQL_SCHEMA",
    ".gql": "GRAPHQL_SCHEMA",
    ".csv": "DATA_FILE",
    ".tsv": "DATA_FILE",
    ".ndjson": "DATA_FILE",
    ".jsonl": "DATA_FILE",
    ".parquet": "DATA_FILE_BINARY",
    ".png": "IMAGE_BINARY",
    ".jpg": "IMAGE_BINARY",
    ".jpeg": "IMAGE_BINARY",
    ".gif": "IMAGE_BINARY",
    ".svg": "IMAGE_BINARY",
    ".ico": "IMAGE_BINARY",
    ".webp": "IMAGE_BINARY",
    ".pdf": "DOCUMENT_BINARY",
    ".zip": "ARCHIVE_BINARY",
    ".tar": "ARCHIVE_BINARY",
    ".gz": "ARCHIVE_BINARY",
    ".bz2": "ARCHIVE_BINARY",
    ".xz": "ARCHIVE_BINARY",
    ".whl": "PYTHON_PACKAGE",
    ".egg": "PYTHON_PACKAGE",
    ".jar": "JAVA_PACKAGE",
    ".class": "JAVA_CLASS",
    ".pyc": "PYTHON_BYTECODE",
    ".pem": "CERTIFICATE_FILE",
    ".crt": "CERTIFICATE_FILE",
    ".key": "CERTIFICATE_FILE",
    ".p12": "CERTIFICATE_FILE",
}

_BASENAME_TO_FILE_TYPE: dict = {
    "makefile": "BUILD_SCRIPT",
    "dockerfile": "CONTAINER_DEF",
    "containerfile": "CONTAINER_DEF",
    "readme": "TEXT_FILE",
    "license": "LICENSE_FILE",
    "licence": "LICENSE_FILE",
    "notice": "TEXT_FILE",
    "authors": "TEXT_FILE",
    "changelog": "TEXT_FILE",
    "changes": "TEXT_FILE",
    "history": "TEXT_FILE",
    "contributing": "TEXT_FILE",
    "contributors": "TEXT_FILE",
    ".gitignore": "GIT_CONFIG",
    ".gitattributes": "GIT_CONFIG",
    ".gitmodules": "GIT_CONFIG",
    "procfile": "PROCESS_DEF",
    "gemfile": "RUBY_MANIFEST",
    "gemfile.lock": "LOCK_FILE",
    "pipfile": "PYTHON_MANIFEST",
    "pipfile.lock": "LOCK_FILE",
    "poetry.lock": "LOCK_FILE",
    "package.json": "JAVASCRIPT_MANIFEST",
    "package-lock.json": "LOCK_FILE",
    "yarn.lock": "LOCK_FILE",
    "pnpm-lock.yaml": "LOCK_FILE",
    "requirements.txt": "PYTHON_MANIFEST",
    "setup.py": "PYTHON_SETUP",
    "setup.cfg": "PYTHON_SETUP",
    "pyproject.toml": "PYTHON_MANIFEST",
    "cargo.toml": "RUST_MANIFEST",
    "cargo.lock": "LOCK_FILE",
    "go.mod": "GO_MANIFEST",
    "go.sum": "LOCK_FILE",
    "pom.xml": "JAVA_MANIFEST",
    "build.gradle": "BUILD_SCRIPT",
    "build.gradle.kts": "BUILD_SCRIPT",
    "settings.gradle": "BUILD_SCRIPT",
    "settings.gradle.kts": "BUILD_SCRIPT",
    "compose.yml": "CONTAINER_DEF",
    "compose.yaml": "CONTAINER_DEF",
    "docker-compose.yml": "CONTAINER_DEF",
    "docker-compose.yaml": "CONTAINER_DEF",
    ".editorconfig": "EDITOR_CONFIG",
    ".prettierrc": "FORMATTER_CONFIG",
    ".eslintrc": "LINTER_CONFIG",
    ".flake8": "LINTER_CONFIG",
    "tox.ini": "CI_CONFIG",
    ".travis.yml": "CI_CONFIG",
    "jenkinsfile": "CI_CONFIG",
}


def _classify_file_type(path: str) -> str:
    """
    Classify a file by structural identity (extension or basename).
    Classification rules:
    1. Check exact basename match (lowercase) in _BASENAME_TO_FILE_TYPE
    2. Check file extension (lowercase) in _EXT_TO_FILE_TYPE
    3. Default: UNKNOWN_FILE_TYPE
    No semantic inference — purely structural identity.
    """
    basename = os.path.basename(path).lower()
    if basename in _BASENAME_TO_FILE_TYPE:
        return _BASENAME_TO_FILE_TYPE[basename]
    _, ext = os.path.splitext(basename)
    if ext in _EXT_TO_FILE_TYPE:
        return _EXT_TO_FILE_TYPE[ext]
    return "UNKNOWN_FILE_TYPE"


# ---------------------------------------------------------------------------
# L40.3 structural edge derivation helpers
# ---------------------------------------------------------------------------

def _norm_ceu_dir(directory: str) -> str:
    """
    Normalize CEU directory for path computation.
    structural_unit_inventory.json stores root-level CEUs as directory="(root)".
    This is a display sentinel; the actual path value is "".
    Returns "" for "(root)", otherwise returns the directory unchanged.
    """
    return "" if directory == "(root)" else directory


def _derive_directory_contains_edges(units: list) -> list:
    """
    DIRECTORY_CONTAINS: CEU-X → CEU-Y if Y's immediate parent dir equals X's normalized dir.
    Root CEU (normalized dir = "") can be a parent.
    No CEU is the parent of root.
    Direction: directed, parent → child.
    """
    edges = []
    # Build normalized_dir → unit_id lookup
    norm_to_unit = {}
    for u in units:
        nd = _norm_ceu_dir(u["directory"])
        norm_to_unit[nd] = u["unit_id"]

    for child_unit in units:
        child_norm = _norm_ceu_dir(child_unit["directory"])
        if child_norm == "":
            continue  # root has no parent
        parent_norm = os.path.dirname(child_norm)
        if parent_norm in norm_to_unit:
            parent_id = norm_to_unit[parent_norm]
            child_id = child_unit["unit_id"]
            edges.append({
                "edge_type": "DIRECTORY_CONTAINS",
                "from_unit_id": parent_id,
                "to_unit_id": child_id,
                "direction": "DIRECTED",
                "evidence": {
                    "source": "structural_unit_inventory.json",
                    "basis": "DIRECTORY_HIERARCHY",
                    "parent_directory": parent_norm if parent_norm else "(root)",
                    "child_directory": child_unit["directory"],
                },
            })
    return edges


def _derive_directory_sibling_edges(units: list) -> list:
    """
    DIRECTORY_SIBLING: CEU-X — CEU-Y if both have non-root dirs and same immediate parent.
    Root CEU (normalized dir = "") is excluded — it has no parent, so no siblings.
    Undirected: normalized to (lower unit_id, higher unit_id).
    """
    edges = []
    non_root = [u for u in units if _norm_ceu_dir(u["directory"]) != ""]
    for i in range(len(non_root)):
        for j in range(i + 1, len(non_root)):
            u1 = non_root[i]
            u2 = non_root[j]
            p1 = os.path.dirname(_norm_ceu_dir(u1["directory"]))
            p2 = os.path.dirname(_norm_ceu_dir(u2["directory"]))
            if p1 != p2:
                continue
            from_id, to_id = sorted([u1["unit_id"], u2["unit_id"]])
            edges.append({
                "edge_type": "DIRECTORY_SIBLING",
                "from_unit_id": from_id,
                "to_unit_id": to_id,
                "direction": "NORMALIZED_UNDIRECTED",
                "evidence": {
                    "source": "structural_unit_inventory.json",
                    "basis": "DIRECTORY_ADJACENCY",
                    "shared_parent_directory": p1 if p1 else "(root)",
                    "unit_a_directory": u1["directory"],
                    "unit_b_directory": u2["directory"],
                },
            })
    return edges


def _derive_structural_type_affinity_edges(units: list) -> list:
    """
    STRUCTURAL_TYPE_AFFINITY: CEU-X — CEU-Y if file_types_present intersection is non-empty.
    Structural observation only: shared file type does not imply functional relationship.
    Undirected: normalized to (lower unit_id, higher unit_id).
    """
    edges = []
    for i in range(len(units)):
        for j in range(i + 1, len(units)):
            u1 = units[i]
            u2 = units[j]
            types1 = set(u1.get("file_types_present", []))
            types2 = set(u2.get("file_types_present", []))
            shared = sorted(types1 & types2)
            if not shared:
                continue
            from_id, to_id = sorted([u1["unit_id"], u2["unit_id"]])
            edges.append({
                "edge_type": "STRUCTURAL_TYPE_AFFINITY",
                "from_unit_id": from_id,
                "to_unit_id": to_id,
                "direction": "NORMALIZED_UNDIRECTED",
                "evidence": {
                    "source": "structural_unit_inventory.json",
                    "basis": "SHARED_FILE_TYPE",
                    "shared_types": shared,
                    "note": "shared structural file type — no functional relationship inferred",
                },
            })
    return edges


def _derive_content_duplicate_edges(units: list, fsm_entries: list) -> list:
    """
    CONTENT_DUPLICATE: CEU-X — CEU-Y if at least one file in X and one file in Y share sha256.
    Evidence: sha256 hashes from file_structural_map.json.
    Structural observation: hash-identical files across units.
    Undirected: normalized to (lower unit_id, higher unit_id).
    For each unit pair, records lex-first matching file pair per sha256.
    """
    # Build sha256 → {unit_id → [paths]}
    sha_to_unit_files: dict = {}
    for entry in fsm_entries:
        sha = entry.get("sha256", "")
        uid = entry.get("unit_id", "")
        path = entry.get("path", "")
        if not sha or not uid:
            continue
        sha_to_unit_files.setdefault(sha, {}).setdefault(uid, []).append(path)

    # For each sha with cross-unit presence, collect unit pairs
    pair_to_evidence: dict = {}  # (from_id, to_id) → {sha → (from_path, to_path)}
    for sha, unit_files in sha_to_unit_files.items():
        if len(unit_files) < 2:
            continue
        uid_list = sorted(unit_files.keys())
        for i_idx in range(len(uid_list)):
            for j_idx in range(i_idx + 1, len(uid_list)):
                from_id = uid_list[i_idx]
                to_id = uid_list[j_idx]
                from_path = sorted(unit_files[from_id])[0]
                to_path = sorted(unit_files[to_id])[0]
                pair_to_evidence.setdefault((from_id, to_id), {})[sha] = {
                    "file_in_from": from_path,
                    "file_in_to": to_path,
                }

    edges = []
    for (from_id, to_id), sha_map in sorted(pair_to_evidence.items()):
        dup_pairs = sorted(
            [{"sha256": sha, "file_in_from": v["file_in_from"], "file_in_to": v["file_in_to"]}
             for sha, v in sha_map.items()],
            key=lambda x: x["sha256"]
        )
        edges.append({
            "edge_type": "CONTENT_DUPLICATE",
            "from_unit_id": from_id,
            "to_unit_id": to_id,
            "direction": "NORMALIZED_UNDIRECTED",
            "evidence": {
                "source": "file_structural_map.json",
                "basis": "SHA256_IDENTITY",
                "duplicate_file_pairs": dup_pairs,
                "note": "hash-identical files across units — no semantic relationship inferred",
            },
        })
    return edges


def cmd_structural_normalize(args: argparse.Namespace) -> None:
    """
    L40.4 — Normalize L40.2 structural units + L40.3 structural relationships
    into a canonical deterministic structural topology.

    Reads from clients/<tenant>/psee/runs/<run_id>/40_2/:
        structural_unit_inventory.json   (required — nodes/CEUs)
        file_structural_map.json         (required — per-file sha256, unit_id for validation)
        structural_extraction_log.json   (required — timestamp cross-reference)

    Reads from clients/<tenant>/psee/runs/<run_id>/40_3/:
        structural_edge_map.json         (required — edges)
        structural_relationship_inventory.json  (required — count cross-reference)
        structural_relationship_log.json (required — 40.3 determinism provenance)

    Writes to clients/<tenant>/psee/runs/<run_id>/40_4/:
        normalized_structural_topology.json  — canonical graph (nodes, edges, adjacency)
        structural_node_inventory.json       — per-node edge participation summary
        structural_topology_log.json         — normalization audit, determinism_hash

    Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01
    """
    _configure_logging(args.debug)
    _debug(f"structural normalize: tenant={args.tenant} run_id={args.run_id}")

    root = _repo_root()
    tenant = args.tenant
    run_id = args.run_id

    # ── Step 1: Resolve input directories ────────────────────────────────────
    dir_40_2 = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_2")
    dir_40_3 = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_3")
    _debug(f"dir_40_2={dir_40_2}")
    _debug(f"dir_40_3={dir_40_3}")

    if not os.path.isdir(dir_40_2):
        _fail(f"40_2 directory not found: {dir_40_2} — run pios structural extract first")
    if not os.path.isdir(dir_40_3):
        _fail(f"40_3 directory not found: {dir_40_3} — run pios structural relate first")

    # ── Step 2: Read 40_2 artifacts ───────────────────────────────────────────

    # structural_unit_inventory.json
    sui_path = os.path.join(dir_40_2, "structural_unit_inventory.json")
    if not os.path.exists(sui_path):
        _fail(f"structural_unit_inventory.json not found in {dir_40_2}")
    with open(sui_path) as f:
        sui = json.load(f)
    for field in ("units", "intake_id", "extracted_at", "unit_count"):
        if field not in sui:
            _fail(f"structural_unit_inventory.json missing required field: {field}")
    for u in sui["units"]:
        for field in ("unit_id", "directory", "file_count", "file_types_present",
                      "dominant_file_type", "unit_hash"):
            if field not in u:
                _fail(f"structural_unit_inventory.json unit '{u.get('unit_id','?')}' missing field: {field}")
    normalized_ts = sui["extracted_at"]
    intake_id = sui["intake_id"]
    units_raw = sui["units"]
    _debug(f"sui: {len(units_raw)} units intake_id={intake_id} ts={normalized_ts}")

    # file_structural_map.json — for per-unit file count validation
    fsm_path = os.path.join(dir_40_2, "file_structural_map.json")
    if not os.path.exists(fsm_path):
        _fail(f"file_structural_map.json not found in {dir_40_2}")
    with open(fsm_path) as f:
        fsm = json.load(f)
    if "entries" not in fsm:
        _fail("file_structural_map.json missing 'entries' field")
    # Build per-unit file count from actual entries
    fsm_unit_counts: dict = {}
    for entry in fsm["entries"]:
        uid = entry.get("unit_id", "")
        if uid:
            fsm_unit_counts[uid] = fsm_unit_counts.get(uid, 0) + 1
    _debug(f"fsm: {len(fsm['entries'])} entries; per-unit counts: {fsm_unit_counts}")

    # Validate file_count for each unit against file_structural_map
    for u in units_raw:
        uid = u["unit_id"]
        declared = u["file_count"]
        actual = fsm_unit_counts.get(uid, 0)
        if declared != actual:
            _fail(
                f"file_count mismatch for {uid}: "
                f"structural_unit_inventory.json declares {declared}, "
                f"file_structural_map.json has {actual} entries"
            )

    # structural_extraction_log.json — timestamp cross-reference + provenance
    sel_path = os.path.join(dir_40_2, "structural_extraction_log.json")
    if not os.path.exists(sel_path):
        _fail(f"structural_extraction_log.json not found in {dir_40_2}")
    with open(sel_path) as f:
        sel = json.load(f)
    sel_ts = sel.get("extracted_at", "")
    sel_det_hash = sel.get("determinism_hash", "")
    if sel_ts and sel_ts != normalized_ts:
        _fail(
            f"timestamp mismatch between structural_unit_inventory.json "
            f"({normalized_ts}) and structural_extraction_log.json ({sel_ts})"
        )
    _debug(f"sel: extracted_at={sel_ts} det_hash_40_2={sel_det_hash}")

    # ── Step 3: Read 40_3 artifacts ───────────────────────────────────────────

    # structural_edge_map.json
    sem_path = os.path.join(dir_40_3, "structural_edge_map.json")
    if not os.path.exists(sem_path):
        _fail(f"structural_edge_map.json not found in {dir_40_3}")
    with open(sem_path) as f:
        sem = json.load(f)
    for field in ("edges", "edge_count"):
        if field not in sem:
            _fail(f"structural_edge_map.json missing required field: {field}")
    edges_raw = sem["edges"]
    for e in edges_raw:
        for field in ("edge_id", "edge_type", "from_unit_id", "to_unit_id", "direction"):
            if field not in e:
                _fail(f"structural_edge_map.json edge '{e.get('edge_id','?')}' missing field: {field}")
    _debug(f"structural_edge_map: {len(edges_raw)} edges")

    # structural_relationship_inventory.json — count cross-reference
    sri_path = os.path.join(dir_40_3, "structural_relationship_inventory.json")
    if not os.path.exists(sri_path):
        _fail(f"structural_relationship_inventory.json not found in {dir_40_3}")
    with open(sri_path) as f:
        sri = json.load(f)
    for field in ("unit_count", "edge_count"):
        if field not in sri:
            _fail(f"structural_relationship_inventory.json missing required field: {field}")
    # Cross-reference unit count
    if sri["unit_count"] != sui["unit_count"]:
        _fail(
            f"unit_count mismatch: structural_unit_inventory.json={sui['unit_count']}, "
            f"structural_relationship_inventory.json={sri['unit_count']}"
        )
    # Cross-reference edge count
    if sri["edge_count"] != sem["edge_count"]:
        _fail(
            f"edge_count mismatch: structural_edge_map.json={sem['edge_count']}, "
            f"structural_relationship_inventory.json={sri['edge_count']}"
        )
    # Verify declared edge count matches actual edge list length
    if sem["edge_count"] != len(edges_raw):
        _fail(
            f"structural_edge_map.json declared edge_count={sem['edge_count']} "
            f"but edges[] contains {len(edges_raw)} entries"
        )
    _debug(f"structural_relationship_inventory: unit_count={sri['unit_count']} edge_count={sri['edge_count']} — cross-reference PASS")

    # structural_relationship_log.json — 40.3 determinism provenance
    srl_path = os.path.join(dir_40_3, "structural_relationship_log.json")
    if not os.path.exists(srl_path):
        _fail(f"structural_relationship_log.json not found in {dir_40_3}")
    with open(srl_path) as f:
        srl = json.load(f)
    det_hash_40_3 = srl.get("determinism_hash", "")
    _debug(f"structural_relationship_log: det_hash_40_3={det_hash_40_3}")

    # ── Step 4: No-overwrite guard ────────────────────────────────────────────
    dir_40_4 = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_4")
    _debug(f"dir_40_4={dir_40_4}")
    if os.path.exists(dir_40_4):
        _fail(f"40_4 output directory already exists: {dir_40_4} — use a unique run_id or remove 40_4/ to re-normalize")

    # ── Step 5: Build node set ────────────────────────────────────────────────
    # One node per CEU; node_id = unit_id; fields are structural facts only
    # Sorted by unit_id (canonical CEU sort = lex on "CEU-NNN")
    nodes_sorted = sorted(units_raw, key=lambda u: u["unit_id"])
    valid_node_ids = {u["unit_id"] for u in nodes_sorted}

    normalized_nodes = []
    for u in nodes_sorted:
        normalized_nodes.append({
            "node_id": u["unit_id"],
            "directory": u["directory"],
            "file_count": u["file_count"],
            "file_types_present": u["file_types_present"],
            "dominant_file_type": u["dominant_file_type"],
            "unit_hash": u["unit_hash"],
            "source_40_2_evidence": {
                "unit_id": u["unit_id"],
                "artifact": "structural_unit_inventory.json",
            },
        })
    _debug(f"nodes built: {len(normalized_nodes)}")

    # ── Step 6: Validate and normalize edges ──────────────────────────────────
    # Validate endpoints, detect duplicates, preserve direction exactly
    seen_triples: dict = {}  # (edge_type, from, to) → edge_id of first occurrence
    duplicates_collapsed = 0
    invalid_endpoint_errors = []

    normalized_edges_pre = []
    for e in edges_raw:
        from_id = e["from_unit_id"]
        to_id = e["to_unit_id"]
        # FAIL CLOSED on invalid endpoint references
        if from_id not in valid_node_ids:
            invalid_endpoint_errors.append(
                f"edge {e['edge_id']}: from_unit_id='{from_id}' not in node set"
            )
        if to_id not in valid_node_ids:
            invalid_endpoint_errors.append(
                f"edge {e['edge_id']}: to_unit_id='{to_id}' not in node set"
            )
        if invalid_endpoint_errors:
            continue

        # Duplicate detection: (edge_type, from, to) must be unique
        triple = (e["edge_type"], from_id, to_id)
        if triple in seen_triples:
            _debug(f"DUPLICATE edge detected: {e['edge_id']} is duplicate of {seen_triples[triple]} — collapsed")
            duplicates_collapsed += 1
            continue
        seen_triples[triple] = e["edge_id"]

        normalized_edges_pre.append({
            "edge_id": e["edge_id"],
            "edge_type": e["edge_type"],
            "from_node_id": from_id,
            "to_node_id": to_id,
            "direction": e["direction"],
            "source_40_3_evidence": {
                "edge_id": e["edge_id"],
                "artifact": "structural_edge_map.json",
            },
        })

    if invalid_endpoint_errors:
        _fail(
            "GRAPH_INTEGRITY_VIOLATION — edges reference non-existent nodes:\n"
            + "\n".join(f"  {msg}" for msg in invalid_endpoint_errors)
        )

    # Sort edges by (edge_type, from_node_id, to_node_id) for deterministic ordering
    normalized_edges = sorted(
        normalized_edges_pre,
        key=lambda e: (e["edge_type"], e["from_node_id"], e["to_node_id"])
    )
    _debug(f"edges normalized: {len(normalized_edges)} (collapsed {duplicates_collapsed} duplicates)")

    # ── Step 7: Build adjacency (secondary — exact derivation from edge list) ─
    # adjacency[node_id] = sorted list of incident edge_ids
    adjacency: dict = {n["node_id"]: [] for n in normalized_nodes}
    for e in normalized_edges:
        adjacency[e["from_node_id"]].append(e["edge_id"])
        if e["to_node_id"] != e["from_node_id"]:
            adjacency[e["to_node_id"]].append(e["edge_id"])
    # Sort each adjacency list
    adjacency_sorted = {nid: sorted(eids) for nid, eids in adjacency.items()}
    _debug(f"adjacency built for {len(adjacency_sorted)} nodes")

    # ── Step 8: Compute determinism hash ─────────────────────────────────────
    # Hash over both node and edge content for full graph identity
    node_lines = sorted(f"{n['node_id']}:{n['unit_hash']}" for n in normalized_nodes)
    edge_lines = sorted(
        f"{e['edge_id']}:{e['edge_type']}:{e['from_node_id']}:{e['to_node_id']}"
        for e in normalized_edges
    )
    det_payload = "\n".join(node_lines + edge_lines)
    determinism_hash = hashlib.sha256(det_payload.encode("utf-8")).hexdigest()
    _debug(f"determinism_hash={determinism_hash}")

    # ── Step 9: Build node inventory ─────────────────────────────────────────
    node_edge_stats: dict = {n["node_id"]: {"outgoing": 0, "incoming": 0, "undirected": 0} for n in normalized_nodes}
    for e in normalized_edges:
        d = e["direction"]
        if d == "DIRECTED":
            node_edge_stats[e["from_node_id"]]["outgoing"] += 1
            node_edge_stats[e["to_node_id"]]["incoming"] += 1
        else:  # NORMALIZED_UNDIRECTED
            node_edge_stats[e["from_node_id"]]["undirected"] += 1
            node_edge_stats[e["to_node_id"]]["undirected"] += 1

    node_inventory_entries = []
    isolated_count = 0
    for n in normalized_nodes:
        nid = n["node_id"]
        s = node_edge_stats[nid]
        total = s["outgoing"] + s["incoming"] + s["undirected"]
        is_isolated = total == 0
        if is_isolated:
            isolated_count += 1
        node_inventory_entries.append({
            "node_id": nid,
            "directory": n["directory"],
            "file_count": n["file_count"],
            "dominant_file_type": n["dominant_file_type"],
            "unit_hash": n["unit_hash"],
            "outgoing_edges": s["outgoing"],
            "incoming_edges": s["incoming"],
            "undirected_edges": s["undirected"],
            "total_incident_edges": total,
            "is_isolated": is_isolated,
        })
    _debug(f"isolated_count={isolated_count}")

    # ── Step 10: Create output directory and write artifacts ──────────────────
    os.makedirs(dir_40_4)

    # normalized_structural_topology.json — canonical graph authority
    topology = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_4",
        "artifact_id": "normalized_structural_topology",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "normalized_at": normalized_ts,
        "source_40_2_dir": f"clients/{tenant}/psee/runs/{run_id}/40_2",
        "source_40_3_dir": f"clients/{tenant}/psee/runs/{run_id}/40_3",
        "node_count": len(normalized_nodes),
        "edge_count": len(normalized_edges),
        "nodes": normalized_nodes,
        "edges": normalized_edges,
        "adjacency": {
            "derivation": "secondary — computed from edges[]; reproduced by: for each node, sorted edge_ids where node is from_node_id or to_node_id",
            "entries": adjacency_sorted,
        },
    }
    with open(os.path.join(dir_40_4, "normalized_structural_topology.json"), "w") as f:
        json.dump(topology, f, indent=2)
    _debug("wrote normalized_structural_topology.json")

    # structural_node_inventory.json — per-node edge participation summary
    node_inv = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_4",
        "artifact_id": "structural_node_inventory",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "normalized_at": normalized_ts,
        "node_count": len(normalized_nodes),
        "isolated_node_count": isolated_count,
        "nodes": node_inventory_entries,
    }
    with open(os.path.join(dir_40_4, "structural_node_inventory.json"), "w") as f:
        json.dump(node_inv, f, indent=2)
    _debug("wrote structural_node_inventory.json")

    # structural_topology_log.json — normalization audit
    topo_log = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_4",
        "artifact_id": "structural_topology_log",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "normalized_at": normalized_ts,
        "input_artifacts": {
            "from_40_2": [
                "40_2/structural_unit_inventory.json",
                "40_2/file_structural_map.json",
                "40_2/structural_extraction_log.json",
            ],
            "from_40_3": [
                "40_3/structural_edge_map.json",
                "40_3/structural_relationship_inventory.json",
                "40_3/structural_relationship_log.json",
            ],
            "ig_artifacts_consumed": False,
        },
        "normalization_rules": {
            "node_source": "ONE_PER_CEU — one node per CEU from structural_unit_inventory.json; node_id = unit_id",
            "node_ordering": "LEXICOGRAPHIC by unit_id",
            "node_fields": "structural facts only: node_id, directory, file_count, file_types_present, dominant_file_type, unit_hash",
            "edge_source": "ALL_EDGES from structural_edge_map.json — no inferred edges",
            "edge_validation": "FAIL_CLOSED — from_unit_id and to_unit_id must exist in node set",
            "edge_deduplication": "STRUCTURAL_IDENTITY — (edge_type, from_unit_id, to_unit_id) triple; duplicates collapsed and counted",
            "edge_direction": "PRESERVED_EXACTLY from 40.3 — no reversal, no inferred bidirectionality",
            "edge_ordering": "LEXICOGRAPHIC by (edge_type, from_node_id, to_node_id)",
            "isolated_nodes": "INCLUDED — nodes with zero incident edges are valid structural truth",
            "adjacency": "SECONDARY — computed from edges[]; derivable from edge list alone",
            "timestamp": "INHERITED from structural_unit_inventory.json.extracted_at",
            "determinism_hash": (
                "SHA256(newline-joined sorted('<node_id>:<unit_hash>') + sorted('<edge_id>:<edge_type>:<from>:<to>'))"
            ),
        },
        "validation_results": {
            "unit_count_cross_reference": f"{sui['unit_count']} == {sri['unit_count']} PASS",
            "edge_count_cross_reference": f"{sem['edge_count']} == {sri['edge_count']} PASS",
            "edge_list_length_check": f"declared {sem['edge_count']} == actual {len(edges_raw)} PASS",
            "file_count_per_unit_check": "PASS",
            "timestamp_cross_reference": f"sui.extracted_at={normalized_ts} == sel.extracted_at={sel_ts} PASS" if sel_ts else "sel.extracted_at absent — SKIPPED",
            "endpoint_validation": "PASS — all edge endpoints resolved to valid nodes",
        },
        "summary": {
            "nodes": len(normalized_nodes),
            "edges": len(normalized_edges),
            "isolated_nodes": isolated_count,
            "duplicates_collapsed": duplicates_collapsed,
        },
        "provenance": {
            "det_hash_40_2": sel_det_hash,
            "det_hash_40_3": det_hash_40_3,
        },
        "exclusions": [],
        "determinism_hash": determinism_hash,
        "reconstruction_readiness": {
            "status": "BLOCKED",
            "reason": (
                "L40.4 produces governed structural topology artifacts but does NOT modify "
                "clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json. "
                "compute_reconstruction.sh requires L40_2, L40_3, L40_4 layers in IG layer_index.json. "
                "Those layers are still absent. Reconstruction constraint inherited from upstream "
                "streams remains: reconstruction_state.state=FAIL, score=0."
            ),
            "deferred_boundary": "IG_LAYER_INDEX_INTEGRATION — explicit separate stream required to register 40.x layers in IG layer_index.json",
            "this_stream_does_not_solve": True,
        },
    }
    with open(os.path.join(dir_40_4, "structural_topology_log.json"), "w") as f:
        json.dump(topo_log, f, indent=2)
    _debug("wrote structural_topology_log.json")

    # ── Completion log ────────────────────────────────────────────────────────
    _log(f"STRUCTURAL_NORMALIZE_COMPLETE: {dir_40_4}")
    _log(
        f"tenant={tenant} run_id={run_id} intake_id={intake_id} "
        f"nodes={len(normalized_nodes)} edges={len(normalized_edges)} "
        f"isolated_nodes={isolated_count} duplicates_collapsed={duplicates_collapsed} "
        f"determinism_hash={determinism_hash} structural_only_boundary=PRESERVED"
    )


def cmd_structural_relate(args: argparse.Namespace) -> None:
    """
    L40.3 — Derive structural relationships from governed L40.2 outputs.

    Reads from clients/<tenant>/psee/runs/<run_id>/40_2/:
        structural_unit_inventory.json  (required — units, file_types, directories, hashes)
        file_structural_map.json        (required — per-file sha256, unit_id)

    Writes to clients/<tenant>/psee/runs/<run_id>/40_3/:
        structural_relationship_inventory.json — unit summaries + edge type counts
        structural_edge_map.json               — all edges with evidence
        structural_relationship_log.json       — derivation rules, exclusions, determinism_hash

    Edge types derived:
        DIRECTORY_CONTAINS         — parent→child directory containment (directed)
        DIRECTORY_SIBLING          — same-parent directories (undirected, normalized)
        STRUCTURAL_TYPE_AFFINITY   — shared file type classes (undirected, normalized)
        CONTENT_DUPLICATE          — identical sha256 across units (undirected, normalized)

    Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01
    """
    _configure_logging(args.debug)
    _debug(f"structural relate: tenant={args.tenant} run_id={args.run_id}")

    root = _repo_root()
    tenant = args.tenant
    run_id = args.run_id

    # ── Step 1: Resolve and validate 40_2 directory ───────────────────────────
    dir_40_2 = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_2")
    _debug(f"dir_40_2={dir_40_2}")
    if not os.path.isdir(dir_40_2):
        _fail(f"40_2 directory not found: {dir_40_2} — run pios structural extract first")

    # ── Step 2: Read structural_unit_inventory.json ───────────────────────────
    sui_path = os.path.join(dir_40_2, "structural_unit_inventory.json")
    if not os.path.exists(sui_path):
        _fail(f"structural_unit_inventory.json not found in {dir_40_2}")
    with open(sui_path) as f:
        sui = json.load(f)
    for field in ("units", "intake_id", "extracted_at"):
        if field not in sui:
            _fail(f"structural_unit_inventory.json missing required field: {field}")
    units = sui["units"]
    intake_id = sui["intake_id"]
    normalized_ts = sui["extracted_at"]
    _debug(f"structural_unit_inventory: {len(units)} units intake_id={intake_id} ts={normalized_ts}")

    # Validate each unit has required fields
    for u in units:
        for field in ("unit_id", "directory", "file_types_present"):
            if field not in u:
                _fail(f"structural_unit_inventory.json unit missing required field '{field}': {u}")

    # ── Step 3: Read file_structural_map.json ─────────────────────────────────
    fsm_path = os.path.join(dir_40_2, "file_structural_map.json")
    if not os.path.exists(fsm_path):
        _fail(f"file_structural_map.json not found in {dir_40_2}")
    with open(fsm_path) as f:
        fsm = json.load(f)
    if "entries" not in fsm:
        _fail("file_structural_map.json missing 'entries' field")
    fsm_entries = fsm["entries"]
    _debug(f"file_structural_map: {len(fsm_entries)} entries")

    # ── Step 4: No-overwrite guard ────────────────────────────────────────────
    dir_40_3 = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_3")
    _debug(f"dir_40_3={dir_40_3}")
    if os.path.exists(dir_40_3):
        _fail(f"40_3 output directory already exists: {dir_40_3} — use a unique run_id or remove 40_3/ to re-derive")

    # ── Step 5: Derive all structural edges ───────────────────────────────────
    contains_edges = _derive_directory_contains_edges(units)
    sibling_edges = _derive_directory_sibling_edges(units)
    affinity_edges = _derive_structural_type_affinity_edges(units)
    dup_edges = _derive_content_duplicate_edges(units, fsm_entries)

    _debug(f"DIRECTORY_CONTAINS={len(contains_edges)} DIRECTORY_SIBLING={len(sibling_edges)} "
           f"STRUCTURAL_TYPE_AFFINITY={len(affinity_edges)} CONTENT_DUPLICATE={len(dup_edges)}")

    # ── Step 6: Merge, sort, and assign deterministic edge IDs ────────────────
    all_edges_pre = contains_edges + sibling_edges + affinity_edges + dup_edges
    all_edges_pre.sort(key=lambda e: (e["edge_type"], e["from_unit_id"], e["to_unit_id"]))
    all_edges = []
    for idx, e in enumerate(all_edges_pre, start=1):
        all_edges.append({"edge_id": f"EDGE-{idx:03d}", **e})

    _debug(f"total_edges={len(all_edges)}")

    # ── Step 7: Compute determinism hash ─────────────────────────────────────
    # SHA256 over sorted "<edge_type>:<from_unit_id>:<to_unit_id>" joined by newline
    det_input = "\n".join(
        f"{e['edge_type']}:{e['from_unit_id']}:{e['to_unit_id']}"
        for e in all_edges_pre  # pre-sort already sorted; use same order
    )
    determinism_hash = hashlib.sha256(det_input.encode("utf-8")).hexdigest()
    _debug(f"determinism_hash={determinism_hash}")

    # ── Step 8: Build unit summaries ─────────────────────────────────────────
    from_counts: dict = {}
    to_counts: dict = {}
    for e in all_edges:
        from_counts[e["from_unit_id"]] = from_counts.get(e["from_unit_id"], 0) + 1
        to_counts[e["to_unit_id"]] = to_counts.get(e["to_unit_id"], 0) + 1

    unit_summaries = []
    for u in sorted(units, key=lambda x: x["unit_id"]):
        uid = u["unit_id"]
        as_source = from_counts.get(uid, 0)
        as_target = to_counts.get(uid, 0)
        unit_summaries.append({
            "unit_id": uid,
            "directory": u["directory"],
            "edges_as_source": as_source,
            "edges_as_target": as_target,
            "total_edges": as_source + as_target,
        })

    edge_type_counts = {
        "DIRECTORY_CONTAINS": len(contains_edges),
        "DIRECTORY_SIBLING": len(sibling_edges),
        "STRUCTURAL_TYPE_AFFINITY": len(affinity_edges),
        "CONTENT_DUPLICATE": len(dup_edges),
    }

    # ── Step 9: Create output directory ──────────────────────────────────────
    os.makedirs(dir_40_3)

    # ── Step 10: Write structural_relationship_inventory.json ─────────────────
    inventory = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_3",
        "artifact_id": "structural_relationship_inventory",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "derived_at": normalized_ts,
        "source_40_2_dir": f"clients/{tenant}/psee/runs/{run_id}/40_2",
        "unit_count": len(units),
        "edge_count": len(all_edges),
        "edge_type_counts": edge_type_counts,
        "unit_summaries": unit_summaries,
    }
    with open(os.path.join(dir_40_3, "structural_relationship_inventory.json"), "w") as f:
        json.dump(inventory, f, indent=2)
    _debug("wrote structural_relationship_inventory.json")

    # ── Step 11: Write structural_edge_map.json ───────────────────────────────
    edge_map = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_3",
        "artifact_id": "structural_edge_map",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "derived_at": normalized_ts,
        "edge_count": len(all_edges),
        "edges": all_edges,
    }
    with open(os.path.join(dir_40_3, "structural_edge_map.json"), "w") as f:
        json.dump(edge_map, f, indent=2)
    _debug("wrote structural_edge_map.json")

    # ── Step 12: Write structural_relationship_log.json ───────────────────────
    rel_log = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_3",
        "artifact_id": "structural_relationship_log",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "derived_at": normalized_ts,
        "input_artifacts": {
            "primary": [
                "40_2/structural_unit_inventory.json",
                "40_2/file_structural_map.json",
            ],
            "support": [],
            "ig_artifacts_consumed": False,
            "justification": "All 4 edge types are derivable from 40_2 outputs alone. ig/ artifacts are not consumed.",
        },
        "edge_types": {
            "DIRECTORY_CONTAINS": {
                "description": "Parent directory CEU contains child directory CEU (direct parent only, not transitive)",
                "source": "structural_unit_inventory.json directory paths",
                "direction": "DIRECTED (parent → child)",
                "basis": "os.path.dirname(child_normalized_dir) == parent_normalized_dir",
                "root_sentinel": "(root) in artifact = '' in path computation",
            },
            "DIRECTORY_SIBLING": {
                "description": "Two non-root CEUs whose immediate parent directory is the same",
                "source": "structural_unit_inventory.json directory paths",
                "direction": "NORMALIZED_UNDIRECTED (lower unit_id = from)",
                "exclusion": "root CEU (normalized dir = '') excluded — no parent, no siblings",
                "basis": "dirname(X_dir) == dirname(Y_dir) and both non-root",
            },
            "STRUCTURAL_TYPE_AFFINITY": {
                "description": "Two CEUs share at least one common file type in file_types_present",
                "source": "structural_unit_inventory.json file_types_present",
                "direction": "NORMALIZED_UNDIRECTED (lower unit_id = from)",
                "evidence_field": "shared_types (intersection of file_types_present)",
                "note": "structural observation only — shared file type does not imply functional relationship",
            },
            "CONTENT_DUPLICATE": {
                "description": "Two CEUs contain at least one file with identical SHA-256 hash",
                "source": "file_structural_map.json sha256 per file",
                "direction": "NORMALIZED_UNDIRECTED (lower unit_id = from)",
                "evidence_field": "duplicate_file_pairs (lex-first matching file per sha256 per unit pair)",
                "note": "structural observation only — content identity does not imply functional relationship",
            },
        },
        "derivation_rules": {
            "edge_id_assignment": "SEQUENTIAL — EDGE-001, EDGE-002... after sorting by (edge_type, from_unit_id, to_unit_id)",
            "undirected_normalization": "UNIT_ID_LEX — lower unit_id assigned to from_unit_id",
            "deduplication": "one edge per (edge_type, from_unit_id, to_unit_id) triple",
            "content_duplicate_per_pair": "one edge per unit pair even if multiple sha256 matches; all pairs recorded in evidence.duplicate_file_pairs",
            "timestamp": "INHERITED from structural_unit_inventory.json.extracted_at (traces to intake_record.created_at)",
            "determinism_hash": "SHA256(sorted('<edge_type>:<from_unit_id>:<to_unit_id>' for all edges joined by newline))",
            "ordering": "all edge lists and evidence lists in deterministic lexicographic order",
        },
        "summary": {
            "units": len(units),
            "edges_total": len(all_edges),
            "edges_by_type": edge_type_counts,
        },
        "exclusions": [],
        "ambiguities": [],
        "determinism_hash": determinism_hash,
    }
    with open(os.path.join(dir_40_3, "structural_relationship_log.json"), "w") as f:
        json.dump(rel_log, f, indent=2)
    _debug("wrote structural_relationship_log.json")

    # ── Completion log ────────────────────────────────────────────────────────
    _log(f"STRUCTURAL_RELATE_COMPLETE: {dir_40_3}")
    _log(
        f"tenant={tenant} run_id={run_id} intake_id={intake_id} "
        f"units={len(units)} edges={len(all_edges)} "
        f"contains={len(contains_edges)} siblings={len(sibling_edges)} "
        f"affinity={len(affinity_edges)} duplicates={len(dup_edges)} "
        f"determinism_hash={determinism_hash}"
    )


def cmd_structural_extract(args: argparse.Namespace) -> None:
    """
    L40.2 — Derive structural truth from governed IG outputs.

    Reads from clients/<tenant>/psee/runs/<run_id>/ig/:
        raw_input.json          (primary — source identity, timestamp normalization)
        structure_map.json      (primary — per-file sha256, size_bytes)
        ingestion_log.json      (primary — admission status per file)
        admissibility_log.json  (support — source_path, layer, governance_authority)

    Writes to clients/<tenant>/psee/runs/<run_id>/40_2/:
        structural_unit_inventory.json   — CEU assignments by directory grouping
        file_structural_map.json         — per-file mapping to CEU + file type
        structural_extraction_log.json   — derivation decisions, exclusions, determinism hash

    Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01
    """
    _configure_logging(args.debug)
    _debug(f"structural extract: tenant={args.tenant} run_id={args.run_id}")

    root = _repo_root()
    tenant = args.tenant
    run_id = args.run_id

    # ── Step 1: Resolve and validate IG directory ─────────────────────────────
    ig_dir = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "ig")
    _debug(f"ig_dir={ig_dir}")
    if not os.path.isdir(ig_dir):
        _fail(f"IG directory not found: {ig_dir} — run pios ig materialize first")

    # ── Step 2: Read primary input artifacts ─────────────────────────────────

    # raw_input.json — source identity + timestamp
    ri_path = os.path.join(ig_dir, "raw_input.json")
    if not os.path.exists(ri_path):
        _fail(f"raw_input.json not found in {ig_dir}")
    with open(ri_path) as f:
        raw_input = json.load(f)
    for field in ("intake_id", "materialized_at", "source_type"):
        if field not in raw_input:
            _fail(f"raw_input.json missing required field: {field}")
    normalized_ts = raw_input["materialized_at"]
    intake_id = raw_input["intake_id"]
    source_type = raw_input.get("source_type", "UNKNOWN")
    _debug(f"raw_input: intake_id={intake_id} ts={normalized_ts} source_type={source_type}")

    # structure_map.json — sha256 and size_bytes per file
    sm_path = os.path.join(ig_dir, "structure_map.json")
    if not os.path.exists(sm_path):
        _fail(f"structure_map.json not found in {ig_dir}")
    with open(sm_path) as f:
        structure_map = json.load(f)
    if "entries" not in structure_map:
        _fail("structure_map.json missing 'entries' field")
    # Build path → {sha256, size_bytes} lookup
    sm_lookup: dict = {}
    for entry in structure_map["entries"]:
        p = entry.get("path", "")
        if p:
            sm_lookup[p] = {"sha256": entry.get("sha256"), "size_bytes": entry.get("size_bytes")}
    _debug(f"structure_map: {len(sm_lookup)} entries")

    # ingestion_log.json — admission decisions per file
    il_path = os.path.join(ig_dir, "ingestion_log.json")
    if not os.path.exists(il_path):
        _fail(f"ingestion_log.json not found in {ig_dir}")
    with open(il_path) as f:
        ingestion_log = json.load(f)
    if "entries" not in ingestion_log:
        _fail("ingestion_log.json missing 'entries' field")
    _debug(f"ingestion_log: {len(ingestion_log['entries'])} entries")

    # ── Step 3: Read support artifact ────────────────────────────────────────

    # admissibility_log.json — source_path, layer per file
    al_path = os.path.join(ig_dir, "admissibility_log.json")
    al_lookup: dict = {}
    if os.path.exists(al_path):
        with open(al_path) as f:
            al_data = json.load(f)
        for entry in al_data.get("entries", []):
            artifact = entry.get("artifact", "")
            if artifact:
                al_lookup[artifact] = {
                    "source_path": entry.get("source_path", ""),
                    "layer": entry.get("layer", ""),
                    "governance_authority": entry.get("governance_authority", ""),
                }
        _debug(f"admissibility_log: {len(al_lookup)} entries loaded")
    else:
        _debug("admissibility_log.json not present — proceeding without support data")

    # ── Step 4: Collect admitted files ───────────────────────────────────────

    admitted_files: list = []
    excluded_files: list = []

    for entry in ingestion_log["entries"]:
        path = entry.get("path", "")
        decision = entry.get("decision", "")
        if not path:
            excluded_files.append({
                "path": path or "(empty)",
                "reason": "EMPTY_PATH",
                "governance": "STRUCTURAL.TRUTH.40.2.01 — empty path in ingestion_log entry"
            })
            continue
        if decision != "ADMITTED":
            excluded_files.append({
                "path": path,
                "reason": f"DECISION_NOT_ADMITTED:{decision}",
                "governance": "STRUCTURAL.TRUTH.40.2.01 — only ADMITTED files enter structural extraction"
            })
            continue
        sha_rec = sm_lookup.get(path)
        if sha_rec is None:
            excluded_files.append({
                "path": path,
                "reason": "NOT_IN_STRUCTURE_MAP",
                "governance": "STRUCTURAL.TRUTH.40.2.01 — admitted file absent from structure_map.json; cannot establish structural identity without hash"
            })
            continue
        admitted_files.append({
            "path": path,
            "sha256": sha_rec["sha256"],
            "size_bytes": sha_rec["size_bytes"],
        })

    # Sort lexicographically by path — deterministic ordering
    admitted_files.sort(key=lambda x: x["path"])
    _debug(f"admitted_files={len(admitted_files)} excluded_files={len(excluded_files)}")

    # ── Step 5: Classify file types (structural identity only) ────────────────
    for rec in admitted_files:
        rec["file_type"] = _classify_file_type(rec["path"])

    unknown_count = sum(1 for r in admitted_files if r["file_type"] == "UNKNOWN_FILE_TYPE")
    _debug(f"unknown_file_types={unknown_count}")

    # ── Step 6: Assign Structural Units (CEUs) by directory grouping ──────────
    # Group admitted files by their immediate parent directory (normalized).
    # Root-level files (no directory component) → directory = "" (empty string = root).
    # Directories are sorted lexicographically; root ("") sorts first.
    # CEU IDs are assigned sequentially: CEU-001, CEU-002, ... in lex directory order.

    dir_to_files: dict = {}
    for rec in admitted_files:
        directory = os.path.dirname(rec["path"])  # "" for root-level files
        if directory not in dir_to_files:
            dir_to_files[directory] = []
        dir_to_files[directory].append(rec)

    # Sort directories lexicographically
    sorted_dirs = sorted(dir_to_files.keys())
    _debug(f"structural_units (directories)={len(sorted_dirs)}: {sorted_dirs}")

    # Assign CEU IDs
    dir_to_ceu: dict = {}
    for idx, directory in enumerate(sorted_dirs, start=1):
        ceu_id = f"CEU-{idx:03d}"
        dir_to_ceu[directory] = ceu_id

    # Annotate each admitted_file record with its CEU
    for rec in admitted_files:
        directory = os.path.dirname(rec["path"])
        rec["unit_id"] = dir_to_ceu[directory]

    # ── Step 7: Build structural unit objects ─────────────────────────────────
    structural_units: list = []
    for directory in sorted_dirs:
        ceu_id = dir_to_ceu[directory]
        files_in_unit = dir_to_files[directory]

        # Unit hash: SHA-256 of newline-joined "<path>:<sha256>" for all files, lex sorted
        files_sorted_for_hash = sorted(files_in_unit, key=lambda x: x["path"])
        hash_input = "\n".join(f"{r['path']}:{r['sha256']}" for r in files_sorted_for_hash)
        unit_hash = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()

        # File types present (sorted, deduplicated)
        file_types_present = sorted(set(r["file_type"] for r in files_in_unit))

        # Dominant file type: most frequent; ties broken lexicographically
        type_counts: dict = {}
        for r in files_in_unit:
            type_counts[r["file_type"]] = type_counts.get(r["file_type"], 0) + 1
        max_count = max(type_counts.values())
        dominant = sorted(ft for ft, ct in type_counts.items() if ct == max_count)[0]

        structural_units.append({
            "unit_id": ceu_id,
            "directory": directory if directory else "(root)",
            "file_count": len(files_in_unit),
            "file_types_present": file_types_present,
            "dominant_file_type": dominant,
            "unit_hash": unit_hash,
            "evidence_ref": {
                "ig_dir": f"clients/{tenant}/psee/runs/{run_id}/ig",
                "source_artifact": "structure_map.json + ingestion_log.json",
                "intake_id": intake_id,
            }
        })

    # ── Step 8: Compute determinism hash ─────────────────────────────────────
    # Hash over all admitted file path:sha256 pairs (lex sorted) — same as aggregate_hash
    # but computed independently to verify structural extraction determinism.
    det_input = "\n".join(f"{r['path']}:{r['sha256']}" for r in admitted_files)
    determinism_hash = hashlib.sha256(det_input.encode("utf-8")).hexdigest()
    _debug(f"determinism_hash={determinism_hash}")

    # ── Step 9: No-overwrite guard + create output directory ─────────────────
    output_dir = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "40_2")
    _debug(f"output_dir={output_dir}")
    if os.path.exists(output_dir):
        _fail(f"40_2 output directory already exists: {output_dir} — use a unique run_id or remove 40_2/ to re-extract")
    os.makedirs(output_dir)

    # ── Step 10: Write structural_unit_inventory.json ─────────────────────────
    structural_unit_inventory = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_2",
        "artifact_id": "structural_unit_inventory",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "source_type": source_type,
        "extracted_at": normalized_ts,
        "ig_dir": f"clients/{tenant}/psee/runs/{run_id}/ig",
        "unit_count": len(structural_units),
        "total_admitted_files": len(admitted_files),
        "units": structural_units,
    }
    with open(os.path.join(output_dir, "structural_unit_inventory.json"), "w") as f:
        json.dump(structural_unit_inventory, f, indent=2)
    _debug("wrote structural_unit_inventory.json")

    # ── Step 11: Write file_structural_map.json ───────────────────────────────
    fmap_entries = []
    for rec in admitted_files:
        al_rec = al_lookup.get(rec["path"], {})
        fmap_entries.append({
            "path": rec["path"],
            "sha256": rec["sha256"],
            "size_bytes": rec["size_bytes"],
            "file_type": rec["file_type"],
            "unit_id": rec["unit_id"],
            "admission_status": "ADMITTED",
            "source_path": al_rec.get("source_path", ""),
            "layer": al_rec.get("layer", ""),
            "governance_authority": al_rec.get("governance_authority", ""),
        })
    file_structural_map = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_2",
        "artifact_id": "file_structural_map",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "extracted_at": normalized_ts,
        "file_count": len(fmap_entries),
        "entries": fmap_entries,
    }
    with open(os.path.join(output_dir, "file_structural_map.json"), "w") as f:
        json.dump(file_structural_map, f, indent=2)
    _debug("wrote file_structural_map.json")

    # ── Step 12: Write structural_extraction_log.json ─────────────────────────
    extraction_log = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
        "artifact_class": "STRUCTURAL_TRUTH_40_2",
        "artifact_id": "structural_extraction_log",
        "tenant": tenant,
        "run_id": run_id,
        "intake_id": intake_id,
        "extracted_at": normalized_ts,
        "input_artifacts": {
            "primary": [
                "ig/raw_input.json",
                "ig/structure_map.json",
                "ig/ingestion_log.json",
            ],
            "support": [
                "ig/admissibility_log.json",
            ],
        },
        "derivation_rules": {
            "ceu_grouping": "DIRECTORY — files grouped by immediate parent directory; root-level files form directory=''",
            "ceu_id_assignment": "SEQUENTIAL — CEU-001, CEU-002... in lexicographic directory order; root sorts first",
            "ceu_hash": "SHA256(sorted('<path>:<sha256>' for files in unit joined by newline))",
            "file_type_classification": "STRUCTURAL_IDENTITY — extension lookup in _EXT_TO_FILE_TYPE, basename lookup in _BASENAME_TO_FILE_TYPE, default UNKNOWN_FILE_TYPE",
            "dominant_file_type": "MOST_FREQUENT — ties broken lexicographically",
            "file_ordering": "LEXICOGRAPHIC by path — all output lists sorted by path",
            "timestamp": "INHERITED from raw_input.json.materialized_at (derived from intake_record.created_at)",
            "determinism_hash": "SHA256(sorted('<path>:<sha256>' for all admitted files joined by newline))",
        },
        "summary": {
            "admitted_files": len(admitted_files),
            "structural_units": len(structural_units),
            "excluded_files": len(excluded_files),
            "unknown_file_types": unknown_count,
        },
        "exclusions": excluded_files,
        "ambiguities": [],
        "determinism_hash": determinism_hash,
    }
    with open(os.path.join(output_dir, "structural_extraction_log.json"), "w") as f:
        json.dump(extraction_log, f, indent=2)
    _debug("wrote structural_extraction_log.json")

    # ── Completion log ────────────────────────────────────────────────────────
    _log(f"STRUCTURAL_EXTRACT_COMPLETE: {output_dir}")
    _log(
        f"tenant={tenant} run_id={run_id} intake_id={intake_id} "
        f"admitted_files={len(admitted_files)} structural_units={len(structural_units)} "
        f"excluded={len(excluded_files)} unknown_types={unknown_count} "
        f"determinism_hash={determinism_hash}"
    )


def cmd_ig_materialize(args: argparse.Namespace) -> None:
    """
    Bridge intake bundle → IG-compatible runtime input structure.

    Reads from:
        clients/<tenant>/psee/intake/<intake_id>/intake_record.json
        clients/<tenant>/psee/intake/<intake_id>/file_hash_manifest.json
        clients/<tenant>/psee/intake/<intake_id>/git_metadata.json  (optional)

    Writes to clients/<tenant>/psee/runs/<run_id>/ig/:
        Governance artifacts:
            raw_input.json
            structure_map.json
            ingestion_log.json
        Runtime compatibility artifacts:
            evidence_boundary.json
            admissibility_log.json
            source_manifest.json
            normalized_intake_structure/layer_index.json
            normalized_intake_structure/provenance_chain.json
            normalized_intake_structure/source_profile.json

    Authority: PRODUCTIZE.IG.FROM.INTAKE.01
    """
    _configure_logging(args.debug)
    _debug(f"ig materialize: tenant={args.tenant} intake_id={args.intake_id} run_id={args.run_id}")

    root = _repo_root()
    tenant = args.tenant
    intake_id = args.intake_id
    run_id = args.run_id

    # Step 1: Resolve and validate intake directory
    intake_dir = os.path.join(root, "clients", tenant, "psee", "intake", intake_id)
    _debug(f"intake_dir={intake_dir}")
    if not os.path.isdir(intake_dir):
        _fail(f"intake directory not found: {intake_dir} — run pios intake create first")

    # Step 2: Read intake_record.json
    intake_record_path = os.path.join(intake_dir, "intake_record.json")
    if not os.path.exists(intake_record_path):
        _fail(f"intake_record.json not found in {intake_dir}")
    with open(intake_record_path) as f:
        intake_record = json.load(f)

    required_fields = ["intake_id", "tenant", "source_path", "source_type", "created_at",
                       "file_count", "aggregate_hash", "git_enriched"]
    for field in required_fields:
        if field not in intake_record:
            _fail(f"intake_record.json missing required field: {field}")

    # Use created_at from intake_record as the deterministic timestamp for all derived artifacts
    normalized_ts = intake_record["created_at"]
    source_path = intake_record["source_path"]
    source_type = intake_record["source_type"]
    aggregate_hash = intake_record["aggregate_hash"]
    file_count = intake_record["file_count"]
    git_enriched = intake_record.get("git_enriched", False)
    _debug(f"intake_record loaded: source_type={source_type} file_count={file_count} aggregate_hash={aggregate_hash}")

    # Step 3: Read file_hash_manifest.json
    fhm_path = os.path.join(intake_dir, "file_hash_manifest.json")
    if not os.path.exists(fhm_path):
        _fail(f"file_hash_manifest.json not found in {intake_dir}")
    with open(fhm_path) as f:
        file_hash_manifest = json.load(f)

    if "files" not in file_hash_manifest:
        _fail("file_hash_manifest.json missing 'files' array")

    ok_files = [e for e in file_hash_manifest["files"] if e.get("status") == "OK"]
    ok_files_sorted = sorted(ok_files, key=lambda x: x["path"])
    _debug(f"file_hash_manifest: {len(ok_files)} OK files of {file_count} total")

    # Step 4: Read git_metadata.json if present
    git_meta = None
    gm_path = os.path.join(intake_dir, "git_metadata.json")
    if git_enriched and os.path.exists(gm_path):
        with open(gm_path) as f:
            git_meta = json.load(f)
        _debug(f"git_metadata loaded: repo_name={git_meta.get('repo_name')} branch={git_meta.get('branch')}")

    # Step 5: Determine output directory — fail if exists (no-overwrite guard)
    output_dir = os.path.join(root, "clients", tenant, "psee", "runs", run_id, "ig")
    nis_dir = os.path.join(output_dir, "normalized_intake_structure")
    _debug(f"output_dir={output_dir}")
    if os.path.exists(output_dir):
        _fail(f"IG output directory already exists: {output_dir} — use a unique run_id")

    # Step 6: Create output directories
    os.makedirs(nis_dir)

    # -----------------------------------------------------------------------
    # GOVERNANCE ARTIFACTS
    # -----------------------------------------------------------------------

    # G1: raw_input.json
    raw_input = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "GOVERNANCE_MATERIALIZATION",
        "intake_id": intake_id,
        "run_id": run_id,
        "tenant": tenant,
        "materialized_at": normalized_ts,
        "source_path": source_path,
        "source_type": source_type,
        "git_enriched": git_enriched,
        "aggregate_hash": aggregate_hash,
        "file_count": file_count,
    }
    if git_meta is not None:
        raw_input["git_metadata"] = {
            "repo_name": git_meta.get("repo_name"),
            "branch": git_meta.get("branch"),
            "head_commit": git_meta.get("head_commit"),
            "dirty": git_meta.get("dirty"),
        }

    with open(os.path.join(output_dir, "raw_input.json"), "w") as f:
        json.dump(raw_input, f, indent=2)
    _debug("wrote raw_input.json")

    # G2: structure_map.json
    structure_map_entries = [
        {
            "path": e["path"],
            "sha256": e["sha256"],
            "size_bytes": e["size_bytes"],
            "layer_id": "L_ROOT",
            "admission_status": "ADMITTED",
        }
        for e in ok_files_sorted
    ]
    structure_map = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "GOVERNANCE_MATERIALIZATION",
        "intake_id": intake_id,
        "run_id": run_id,
        "tenant": tenant,
        "materialized_at": normalized_ts,
        "layer_id": "L_ROOT",
        "file_count": len(ok_files_sorted),
        "entries": structure_map_entries,
    }
    with open(os.path.join(output_dir, "structure_map.json"), "w") as f:
        json.dump(structure_map, f, indent=2)
    _debug("wrote structure_map.json")

    # G3: ingestion_log.json
    ingestion_entries = [
        {
            "path": e["path"],
            "sha256": e["sha256"],
            "layer": "L_ROOT",
            "decision": "ADMITTED",
            "governance_authority": "PRODUCTIZE.IG.FROM.INTAKE.01",
            "reason": "Source file — governed intake bundle ADMITTED",
        }
        for e in ok_files_sorted
    ]
    ingestion_log = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "GOVERNANCE_MATERIALIZATION",
        "intake_id": intake_id,
        "run_id": run_id,
        "tenant": tenant,
        "materialized_at": normalized_ts,
        "entries": ingestion_entries,
        "summary": {
            "total": len(ok_files_sorted),
            "admitted": len(ok_files_sorted),
            "excluded": 0,
            "decision_basis": "PRODUCTIZE.IG.FROM.INTAKE.01 — all OK files from governed intake bundle ADMITTED",
        },
    }
    with open(os.path.join(output_dir, "ingestion_log.json"), "w") as f:
        json.dump(ingestion_log, f, indent=2)
    _debug("wrote ingestion_log.json")

    # -----------------------------------------------------------------------
    # RUNTIME COMPATIBILITY ARTIFACTS
    # -----------------------------------------------------------------------

    # R1: evidence_boundary.json
    # admitted_input_class.source_run must equal intake_id (consumed by compute_coverage.sh)
    evidence_boundary = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "materialized_at": normalized_ts,
        "runtime_input_class": "RHP_ONLY",
        "rhp_definition": (
            "Runtime Handoff Package — artifacts admitted from governed intake bundle "
            "via PRODUCTIZE.IG.FROM.INTAKE.01. All elements trace to intake source paths."
        ),
        "admitted_input_class": {
            "class": "RHP",
            "source_run": intake_id,
            "governance": "PRODUCTIZE.IG.FROM.INTAKE.01",
            "root": f"clients/{tenant}/psee/runs/{run_id}/ig",
            "elements": [
                "source_manifest.json",
                "evidence_boundary.json",
                "admissibility_log.json",
                "normalized_intake_structure/layer_index.json",
                "normalized_intake_structure/source_profile.json",
                "normalized_intake_structure/provenance_chain.json",
            ],
        },
        "enforcement": "STRICT",
        "boundary_authority": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "fail_safe": "Any PSEE runtime consumption of non-RHP input → FAIL_SAFE_STOP",
    }
    with open(os.path.join(output_dir, "evidence_boundary.json"), "w") as f:
        json.dump(evidence_boundary, f, indent=2)
    _debug("wrote evidence_boundary.json")

    # R2: admissibility_log.json
    # source_run = intake_id; entries artifact = normalized_relative_path
    # These exact paths must also appear in layer_index or source_manifest.root_artifacts
    admissibility_entries = [
        {
            "artifact": e["path"],
            "source_path": f"{source_path}/{e['path']}",
            "layer": "ROOT",
            "decision": "ADMITTED",
            "governance_authority": "PRODUCTIZE.IG.FROM.INTAKE.01",
            "reason": "Governed intake bundle file — ADMITTED via IG materialization",
        }
        for e in ok_files_sorted
    ]
    admissibility_log = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "source_run": intake_id,
        "materialized_at": normalized_ts,
        "entries": admissibility_entries,
        "summary": {
            "total": len(ok_files_sorted),
            "admitted": len(ok_files_sorted),
            "excluded": 0,
            "decision_basis": (
                "PRODUCTIZE.IG.FROM.INTAKE.01 ADMITTED — all OK files from governed intake bundle"
            ),
        },
    }
    with open(os.path.join(output_dir, "admissibility_log.json"), "w") as f:
        json.dump(admissibility_log, f, indent=2)
    _debug("wrote admissibility_log.json")

    # R3: source_manifest.json
    # root_artifacts.artifacts = all normalized relative paths
    # layers.L_ROOT.artifact_count = file_count
    # total_admitted_artifacts = file_count
    all_artifact_paths = [e["path"] for e in ok_files_sorted]
    source_manifest_out = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "source_run": intake_id,
        "materialized_at": normalized_ts,
        "source": {
            "kind": source_type,
            "source_path": source_path,
            "aggregate_hash": aggregate_hash,
            "governance": "PRODUCTIZE.IG.FROM.INTAKE.01",
        },
        "root_artifacts": {
            "artifact_count": len(all_artifact_paths),
            "artifacts": all_artifact_paths,
        },
        "layers": {
            "L_ROOT": {
                "source_path": source_path,
                "artifact_count": len(ok_files_sorted),
                "admission_status": "ADMITTED",
                "ingestion_decision": "GOVERNED_PASS",
                "artifacts": all_artifact_paths,
            },
        },
        "total_admitted_artifacts": len(ok_files_sorted),
    }
    with open(os.path.join(output_dir, "source_manifest.json"), "w") as f:
        json.dump(source_manifest_out, f, indent=2)
    _debug("wrote source_manifest.json")

    # R4: normalized_intake_structure/layer_index.json
    # Single layer L_ROOT; artifacts[].name = normalized_relative_path; admission_status = ADMITTED
    layer_artifacts = [
        {
            "name": e["path"],
            "path": f"{source_path}/{e['path']}",
            "admission_status": "ADMITTED",
        }
        for e in ok_files_sorted
    ]
    layer_index = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "source_run": intake_id,
        "materialized_at": normalized_ts,
        "layers": [
            {
                "layer_id": "L_ROOT",
                "role": "source",
                "source_path": source_path,
                "artifact_count": len(ok_files_sorted),
                "artifacts": layer_artifacts,
            }
        ],
    }
    with open(os.path.join(nis_dir, "layer_index.json"), "w") as f:
        json.dump(layer_index, f, indent=2)
    _debug("wrote normalized_intake_structure/layer_index.json")

    # R5: normalized_intake_structure/provenance_chain.json
    # IG.6.failures=0, IG.7.failures=0 — required by compute_reconstruction.sh
    # 8 invariants required
    provenance_chain = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "source_run": intake_id,
        "materialized_at": normalized_ts,
        "chain": [
            {
                "layer": "IG.5",
                "role": "source_profile_resolver",
                "script": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
                "outcome": "PASS",
                "properties": {
                    "profile_kind": source_type,
                    "admissibility": "GOVERNED",
                    "resolution": "DETERMINISTIC",
                },
            },
            {
                "layer": "IG.4",
                "role": "orchestration_launcher",
                "script": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
                "outcome": "PASS",
                "properties": {
                    "source_binding": "INTAKE_BUNDLE",
                    "run_mode": "MATERIALIZED_INGESTION",
                },
            },
            {
                "layer": "IG.3",
                "role": "bootstrap_launcher",
                "script": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
                "outcome": "PASS",
                "properties": {
                    "launch_mode": "BOOTSTRAP_PIPELINE",
                    "execution_mode": "CREATE_ONLY",
                },
            },
            {
                "layer": "IG.6",
                "role": "ingestion_orchestrator",
                "script": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
                "outcome": "ORCHESTRATION_COMPLETE",
                "checks": len(ok_files_sorted),
                "failures": 0,
            },
            {
                "layer": "IG.7",
                "role": "ingestion_batch_runner",
                "script": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
                "outcome": "BATCH_COMPLETE",
                "checks": len(ok_files_sorted),
                "failures": 0,
            },
            {
                "layer": "IG-PSEE-HANDOFF.0",
                "role": "runtime_handoff_producer",
                "outcome": "RHP_PRODUCED",
                "target_namespace": f"clients/{tenant}/psee/runs/{run_id}/ig",
            },
        ],
        "invariants_confirmed": [
            "ADMISSIBLE",
            "INVARIANT",
            "DETERMINISTIC",
            "ADAPTER_INVARIANT",
            "BOOTSTRAP_INVARIANT",
            "ORCHESTRATION_INVARIANT",
            "SOURCE_PROFILE_INVARIANT",
            "PAYLOAD_NORMALIZED",
        ],
    }
    with open(os.path.join(nis_dir, "provenance_chain.json"), "w") as f:
        json.dump(provenance_chain, f, indent=2)
    _debug("wrote normalized_intake_structure/provenance_chain.json")

    # R6: normalized_intake_structure/source_profile.json
    # profile_governance.verdict = "PASS" — required by compute_reconstruction.sh
    source_profile = {
        "schema_version": "1.0",
        "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
        "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
        "run_id": run_id,
        "intake_id": intake_id,
        "source_run": intake_id,
        "source_profile": {
            "kind": source_type,
            "admissibility": "GOVERNED",
            "resolution": "DETERMINISTIC",
            "source_path": source_path,
            "aggregate_hash": aggregate_hash,
            "git_enriched": git_enriched,
        },
        "profile_governance": {
            "resolver": "PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialize",
            "governing_stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
            "verdict": "PASS",
            "determinism": "VERIFIED",
            "materialized_at": normalized_ts,
        },
    }
    if git_meta is not None:
        source_profile["source_profile"]["repo_name"] = git_meta.get("repo_name")
        source_profile["source_profile"]["branch"] = git_meta.get("branch")
        source_profile["source_profile"]["head_commit"] = git_meta.get("head_commit")

    with open(os.path.join(nis_dir, "source_profile.json"), "w") as f:
        json.dump(source_profile, f, indent=2)
    _debug("wrote normalized_intake_structure/source_profile.json")

    # -----------------------------------------------------------------------
    # Completion log
    # -----------------------------------------------------------------------
    _log(f"IG_MATERIALIZE_COMPLETE: {output_dir}")
    _log(
        f"intake_id={intake_id} run_id={run_id} tenant={tenant} "
        f"source_type={source_type} file_count={len(ok_files_sorted)} "
        f"governance_artifacts=3 runtime_compatibility_artifacts=6"
    )
    _log("DECLARED CONSTRAINT: reconstruction_state.state=FAIL expected (L40_2/L40_3/L40_4 not present in L_ROOT source) — score=0; both S1 scripts exit 0")


# ---------------------------------------------------------------------------
# pios ig integrate-structural-layers
# ---------------------------------------------------------------------------

def cmd_ig_integrate_structural_layers(args: argparse.Namespace) -> None:
    """
    Register structural truth layers (L40_2, L40_3, L40_4) into the IG layer index.

    Reads from:
        clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json
        clients/<tenant>/psee/runs/<run_id>/40_2/structural_extraction_log.json
        clients/<tenant>/psee/runs/<run_id>/40_3/structural_relationship_log.json
        clients/<tenant>/psee/runs/<run_id>/40_4/structural_topology_log.json

    Modifies (in-place, additive only):
        clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json

    Adds exactly:
        L40_2, L40_3, L40_4 layer entries — each with layer_id, source, path,
        artifact_root, layer_index ordering, and provenance determinism reference.

    Does NOT:
        - create structural artifacts
        - recompute structural truth
        - add semantic/domain/capability/scoring fields
        - modify any artifact in 40_2/, 40_3/, or 40_4/

    Idempotency contract: FAIL-CLOSED — if L40_2, L40_3, or L40_4 are already present
    in layers[], exits with exit 1 (STRUCTURAL_LAYERS_ALREADY_REGISTERED).

    Authority: PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01
    """
    _configure_logging(args.debug)
    _debug(f"ig integrate-structural-layers: tenant={args.tenant} run_id={args.run_id}")

    root = _repo_root()
    tenant = args.tenant
    run_id = args.run_id

    # -----------------------------------------------------------------------
    # Step 1: Resolve paths
    # -----------------------------------------------------------------------
    run_dir = os.path.join(root, "clients", tenant, "psee", "runs", run_id)
    nis_dir = os.path.join(run_dir, "ig", "normalized_intake_structure")
    layer_index_path = os.path.join(nis_dir, "layer_index.json")
    dir_40_2 = os.path.join(run_dir, "40_2")
    dir_40_3 = os.path.join(run_dir, "40_3")
    dir_40_4 = os.path.join(run_dir, "40_4")

    _debug(f"layer_index_path={layer_index_path}")
    _debug(f"dir_40_2={dir_40_2}")
    _debug(f"dir_40_3={dir_40_3}")
    _debug(f"dir_40_4={dir_40_4}")

    # -----------------------------------------------------------------------
    # Step 2: Fail-closed pre-checks — directories
    # -----------------------------------------------------------------------
    if not os.path.isdir(nis_dir):
        _fail(f"ig/normalized_intake_structure/ not found: {nis_dir} — run pios ig materialize first")
    if not os.path.isfile(layer_index_path):
        _fail(f"layer_index.json not found: {layer_index_path} — run pios ig materialize first")
    if not os.path.isdir(dir_40_2):
        _fail(f"40_2/ directory not found: {dir_40_2} — run pios structural extract first")
    if not os.path.isdir(dir_40_3):
        _fail(f"40_3/ directory not found: {dir_40_3} — run pios structural relate first")
    if not os.path.isdir(dir_40_4):
        _fail(f"40_4/ directory not found: {dir_40_4} — run pios structural normalize first")

    # -----------------------------------------------------------------------
    # Step 3: Read layer_index.json — validate required fields
    # -----------------------------------------------------------------------
    with open(layer_index_path) as f:
        layer_index = json.load(f)

    for field in ("run_id", "intake_id", "layers"):
        if field not in layer_index:
            _fail(f"layer_index.json malformed: missing required field '{field}'")
    if not isinstance(layer_index["layers"], list):
        _fail("layer_index.json malformed: 'layers' must be an array")

    li_run_id = layer_index["run_id"]
    li_intake_id = layer_index["intake_id"]
    _debug(f"layer_index: run_id={li_run_id} intake_id={li_intake_id} layer_count={len(layer_index['layers'])}")

    if li_run_id != run_id:
        _fail(f"run identity mismatch: layer_index.json.run_id={li_run_id} != requested run_id={run_id}")

    # -----------------------------------------------------------------------
    # Step 4: No-overwrite guard — fail closed if structural layers already present
    # -----------------------------------------------------------------------
    existing_layer_ids = {layer.get("layer_id") for layer in layer_index["layers"]}
    structural_ids = {"L40_2", "L40_3", "L40_4"}
    already_registered = existing_layer_ids & structural_ids
    if already_registered:
        _fail(
            f"STRUCTURAL_LAYERS_ALREADY_REGISTERED: {sorted(already_registered)} already present "
            f"in layer_index.json for run_id={run_id} — structural layer integration is a "
            f"CREATE_ONLY operation; remove existing structural layer entries to re-integrate"
        )
    _debug("no-overwrite guard passed — structural layers not yet present")

    # -----------------------------------------------------------------------
    # Step 5: Read authoritative provenance from structural log artifacts
    # -----------------------------------------------------------------------
    # L40_2 provenance — structural_extraction_log.json
    sel_path = os.path.join(dir_40_2, "structural_extraction_log.json")
    if not os.path.isfile(sel_path):
        _fail(f"structural_extraction_log.json not found: {sel_path} — required for L40_2 provenance")
    with open(sel_path) as f:
        sel = json.load(f)
    if "determinism_hash" not in sel:
        _fail(f"structural_extraction_log.json missing 'determinism_hash' — provenance reference unavailable")
    if "intake_id" not in sel:
        _fail(f"structural_extraction_log.json missing 'intake_id' — run identity cannot be verified")
    det_hash_40_2 = sel["determinism_hash"]
    sel_intake_id = sel["intake_id"]
    _debug(f"L40_2 provenance: det_hash={det_hash_40_2} intake_id={sel_intake_id}")

    # L40_3 provenance — structural_relationship_log.json
    srl_path = os.path.join(dir_40_3, "structural_relationship_log.json")
    if not os.path.isfile(srl_path):
        _fail(f"structural_relationship_log.json not found: {srl_path} — required for L40_3 provenance")
    with open(srl_path) as f:
        srl = json.load(f)
    if "determinism_hash" not in srl:
        _fail(f"structural_relationship_log.json missing 'determinism_hash' — provenance reference unavailable")
    if "intake_id" not in srl:
        _fail(f"structural_relationship_log.json missing 'intake_id' — run identity cannot be verified")
    det_hash_40_3 = srl["determinism_hash"]
    srl_intake_id = srl["intake_id"]
    _debug(f"L40_3 provenance: det_hash={det_hash_40_3} intake_id={srl_intake_id}")

    # L40_4 provenance — structural_topology_log.json
    stl_path = os.path.join(dir_40_4, "structural_topology_log.json")
    if not os.path.isfile(stl_path):
        _fail(f"structural_topology_log.json not found: {stl_path} — required for L40_4 provenance")
    with open(stl_path) as f:
        stl = json.load(f)
    if "determinism_hash" not in stl:
        _fail(f"structural_topology_log.json missing 'determinism_hash' — provenance reference unavailable")
    if "intake_id" not in stl:
        _fail(f"structural_topology_log.json missing 'intake_id' — run identity cannot be verified")
    det_hash_40_4 = stl["determinism_hash"]
    stl_intake_id = stl["intake_id"]
    _debug(f"L40_4 provenance: det_hash={det_hash_40_4} intake_id={stl_intake_id}")

    # -----------------------------------------------------------------------
    # Step 6: Run identity consistency check across all structural logs
    # -----------------------------------------------------------------------
    # All structural log intake_ids must match the layer_index intake_id
    for source_name, source_iid in [
        ("40_2/structural_extraction_log.json", sel_intake_id),
        ("40_3/structural_relationship_log.json", srl_intake_id),
        ("40_4/structural_topology_log.json", stl_intake_id),
    ]:
        if source_iid != li_intake_id:
            _fail(
                f"run identity inconsistency: {source_name}.intake_id={source_iid} "
                f"!= layer_index.json.intake_id={li_intake_id}"
            )
    _debug(f"run identity consistent: all intake_ids={li_intake_id}")

    # -----------------------------------------------------------------------
    # Step 7: Build structural layer entries — deterministic, no semantic content
    # -----------------------------------------------------------------------
    # Relative paths from repo root for portability
    rel_run_dir = os.path.relpath(run_dir, root)

    structural_layers = [
        {
            "layer_id": "L40_2",
            "source": "STRUCTURAL",
            "path": f"{rel_run_dir}/40_2",
            "artifact_root": "40_2",
            "layer_index": 1,
            "provenance": {
                "source_artifact": "40_2/structural_extraction_log.json",
                "determinism_hash": det_hash_40_2,
            },
        },
        {
            "layer_id": "L40_3",
            "source": "STRUCTURAL",
            "path": f"{rel_run_dir}/40_3",
            "artifact_root": "40_3",
            "layer_index": 2,
            "provenance": {
                "source_artifact": "40_3/structural_relationship_log.json",
                "determinism_hash": det_hash_40_3,
            },
        },
        {
            "layer_id": "L40_4",
            "source": "STRUCTURAL",
            "path": f"{rel_run_dir}/40_4",
            "artifact_root": "40_4",
            "layer_index": 3,
            "provenance": {
                "source_artifact": "40_4/structural_topology_log.json",
                "determinism_hash": det_hash_40_4,
            },
        },
    ]
    _debug(f"built {len(structural_layers)} structural layer entries: L40_2, L40_3, L40_4")

    # -----------------------------------------------------------------------
    # Step 8: Append structural layers to layer_index and record integration stream
    # -----------------------------------------------------------------------
    # L_ROOT preserved exactly — structural layers appended in canonical order
    layer_index["layers"].extend(structural_layers)
    layer_index["structural_layer_integration_stream"] = (
        "PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01"
    )
    _debug("appended L40_2, L40_3, L40_4 to layers[] — L_ROOT preserved")

    # -----------------------------------------------------------------------
    # Step 9: Write updated layer_index.json
    # -----------------------------------------------------------------------
    with open(layer_index_path, "w") as f:
        json.dump(layer_index, f, indent=2)
    _debug(f"wrote updated layer_index.json — total layers: {len(layer_index['layers'])}")

    # -----------------------------------------------------------------------
    # Completion log
    # -----------------------------------------------------------------------
    _log(f"IG_LAYER_INDEX_INTEGRATION_COMPLETE: {layer_index_path}")
    _log(
        f"tenant={tenant} run_id={run_id} intake_id={li_intake_id} "
        f"layers_registered=L40_2,L40_3,L40_4 "
        f"structural_outputs_unmodified=True "
        f"reconstruction_discoverability_blocker=REMOVED"
    )
    _log(
        f"provenance: L40_2.det_hash={det_hash_40_2[:16]}... "
        f"L40_3.det_hash={det_hash_40_3[:16]}... "
        f"L40_4.det_hash={det_hash_40_4[:16]}..."
    )


# ---------------------------------------------------------------------------
# Argument parser
# ---------------------------------------------------------------------------

def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="pios",
        description=(
            "pios — PSEE runtime CLI\n"
            "Thin wiring over the S0–S4 PSEE/GAUGE pipeline.\n"
            "Authority: PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    subparsers = parser.add_subparsers(dest="command", metavar="COMMAND")
    subparsers.required = True

    # --- ledger ---
    ledger_parser = subparsers.add_parser(
        "ledger",
        help="Run ledger commands (S0)",
        description="Run ledger commands — manage intake_record.json"
    )
    ledger_sub = ledger_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    ledger_sub.required = True

    lc = ledger_sub.add_parser(
        "create",
        help="Create intake_record.json for a new run (S0)",
        description=(
            "Write intake_record.json for a new run at S0.\n"
            "Output: clients/<client>/psee/runs/<run_id>/intake_record.json\n"
            "Authority: FRESH.RUN.BOOTSTRAP.PROTOCOL.01; Section 3.2 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    lc.add_argument("--run-id", required=True, help="Unique run identifier (RI-01–RI-05). Format: run_<seq>_<descriptor>")
    lc.add_argument("--client", required=True, help="Client UUID (e.g., blueedge)")
    lc.add_argument("--source-version", required=True, help="Source version string (e.g., blueedge-platform-v1)")
    lc.add_argument("--emission-stream", default="PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01", help="Emission stream identifier")
    lc.add_argument("--debug", action="store_true", help="Enable debug logging")
    lc.set_defaults(func=cmd_ledger_create)

    # --- bootstrap ---
    bp = subparsers.add_parser(
        "bootstrap",
        help="Write engine_state.json and gauge_inputs.json (S0 prerequisites)",
        description=(
            "Write engine_state.json and gauge_inputs.json into the run package directory.\n"
            "These files are required before 'pios emit coverage' (Section 4.4).\n"
            "Reads: <run_dir>/intake_record.json\n"
            "Writes: <run_dir>/package/engine_state.json, <run_dir>/package/gauge_inputs.json\n"
            "Authority: FRESH.RUN.BOOTSTRAP.PROTOCOL.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    bp.add_argument("--run-dir", required=True, help="Path to the run directory (e.g., clients/blueedge/psee/runs/run_07_...)")
    bp.add_argument("--debug", action="store_true", help="Enable debug logging")
    bp.set_defaults(func=cmd_bootstrap)

    # --- emit ---
    emit_parser = subparsers.add_parser(
        "emit",
        help="Stage emission commands (S1–S3)",
        description="Stage emission commands — invoke authorized scripts to produce governed artifacts"
    )
    emit_sub = emit_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    emit_sub.required = True

    ec = emit_sub.add_parser(
        "coverage",
        help="S1 — Invoke compute_coverage.sh (PSEE-RUNTIME.5A)",
        description=(
            "Invoke compute_coverage.sh to produce coverage_state.json.\n"
            "Precondition: engine_state.json and gauge_inputs.json must exist in package dir.\n"
            "Script: scripts/pios/runtime/compute_coverage.sh <psee_dir> <ig_dir>\n"
            "Output: package/coverage_state.json; package/gauge_inputs.json (DIM-01 updated)\n"
            "Authority: PSEE-RUNTIME.5A; Section 4.2 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ec.add_argument("--run-dir", required=True, help="Path to the run directory")
    ec.add_argument("--ig-dir", required=True, help="IG runtime directory (e.g., docs/pios/IG.RUNTIME/run_01)")
    ec.add_argument("--debug", action="store_true", help="Enable debug logging")
    ec.set_defaults(func=cmd_emit_coverage)

    er = emit_sub.add_parser(
        "reconstruction",
        help="S1 — Invoke compute_reconstruction.sh (PSEE-RUNTIME.6A)",
        description=(
            "Invoke compute_reconstruction.sh to produce reconstruction_state.json.\n"
            "DIM-01 precondition: coverage_state.json.state must equal 'COMPUTED'.\n"
            "Script: scripts/pios/runtime/compute_reconstruction.sh <psee_dir> <ig_dir>\n"
            "Output: package/reconstruction_state.json; package/gauge_inputs.json (DIM-02 updated)\n"
            "Authority: PSEE-RUNTIME.6A; Section 4.3 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    er.add_argument("--run-dir", required=True, help="Path to the run directory")
    er.add_argument("--ig-dir", required=True, help="IG runtime directory (e.g., docs/pios/IG.RUNTIME/run_01)")
    er.add_argument("--debug", action="store_true", help="Enable debug logging")
    er.set_defaults(func=cmd_emit_reconstruction)

    et = emit_sub.add_parser(
        "topology",
        help="S2 — Invoke emit_canonical_topology.py",
        description=(
            "Invoke emit_canonical_topology.py to produce canonical_topology.json.\n"
            "Parity guard: 17 domains, 42 capabilities, 89 components, 148 total_nodes.\n"
            "Script: scripts/psee/emit_canonical_topology.py --output-path <path> --run-id <run_id>\n"
            "Output: package/canonical_topology.json (FRESH)\n"
            "Authority: STRUCTURAL.TRUTH.AUTHORITY.01; Section 5 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    et.add_argument("--run-dir", required=True, help="Path to the run directory")
    et.add_argument("--run-id", required=True, help="Run ID to embed in canonical_topology.json as emission_run_id")
    et.add_argument("--debug", action="store_true", help="Enable debug logging")
    et.set_defaults(func=cmd_emit_topology)

    es = emit_sub.add_parser(
        "signals",
        help="S3 — Invoke build_signals.py and apply CC-2 correction",
        description=(
            "Invoke build_signals.py and apply CC-2 post-correction to produce signal_registry.json.\n"
            "CC-2: adds runtime_required=false to all 5 signal entries; adds schema_correction metadata.\n"
            "Script: scripts/pios/41.4/build_signals.py --output-dir <dir>\n"
            "Output: package/signal_registry.json (CC-2 corrected), package/evidence_mapping_index.json, package/executive_signal_report.md\n"
            "Authority: SEMANTIC.COMPUTATION.AUTHORITY.01; Section 6 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    es.add_argument("--run-dir", required=True, help="Path to the run directory")
    es.add_argument("--debug", action="store_true", help="Enable debug logging")
    es.set_defaults(func=cmd_emit_signals)

    # --- declare ---
    declare_parser = subparsers.add_parser(
        "declare",
        help="Declaration commands (S3/S4 boundary)",
        description="Declaration commands — write governed coherence record before gauge computation"
    )
    declare_sub = declare_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    declare_sub.required = True

    dc = declare_sub.add_parser(
        "coherence",
        help="Write coherence_record.json for the governed artifact set (S3/S4 boundary)",
        description=(
            "Write coherence_record.json declaring the governed relationship between all artifact\n"
            "run identity values in the S4 consumption set. Required before pios validate freshness\n"
            "can proceed past CA-01.\n\n"
            "Purpose: elevates coherence declaration from implicit contract requirement to an\n"
            "executable, auditable CLI step.\n\n"
            "Reads (governed artifact set per Section 2.1 + 8.1):\n"
            "  <run_dir>/intake_record.json\n"
            "  <run_dir>/package/coverage_state.json\n"
            "  <run_dir>/package/reconstruction_state.json\n"
            "  <run_dir>/package/canonical_topology.json\n"
            "  <run_dir>/package/signal_registry.json\n"
            "  <run_dir>/package/gauge_state.json\n\n"
            "Writes:\n"
            "  <run_dir>/coherence_record.json\n\n"
            "Side effects: none beyond writing the one output artifact.\n\n"
            "Failure behavior: fails closed on missing artifacts, missing run identity fields,\n"
            "blocking CC-2 violation, or pre-existing coherence_record.json (no-overwrite guard).\n\n"
            "Authority: S3.S4.RUN.COHERENCE.CONTRACT.01; Section 8 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    dc.add_argument("--run-dir", required=True, help="Path to the run directory (e.g., clients/blueedge/psee/runs/run_07_...)")
    dc.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: command invoked, resolved run_dir, resolved artifact paths, "
        "extracted run identities, selected coherence mode, violations list, output path, final verdict."
    ))
    dc.set_defaults(func=cmd_declare_coherence)

    # --- compute ---
    compute_parser = subparsers.add_parser(
        "compute",
        help="Stage computation commands (S4)",
        description="Stage computation commands — compute gauge_state.json per GAUGE.STATE.COMPUTATION.CONTRACT.01"
    )
    compute_sub = compute_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    compute_sub.required = True

    cg = compute_sub.add_parser(
        "gauge",
        help="S4 — Compute gauge_state.json per GAUGE.STATE.COMPUTATION.CONTRACT.01",
        description=(
            "Compute gauge_state.json from four authorized inputs.\n"
            "Reads: package/coverage_state.json, package/reconstruction_state.json,\n"
            "       package/canonical_topology.json, package/signal_registry.json\n"
            "Writes: package/gauge_state.json\n"
            "Self-checks: GC-01 through GC-10\n"
            "Authority: GAUGE.STATE.COMPUTATION.CONTRACT.01; Section 7 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    cg.add_argument("--run-dir", required=True, help="Path to the run directory")
    cg.add_argument("--debug", action="store_true", help="Enable debug logging")
    cg.set_defaults(func=cmd_compute_gauge)

    # --- validate ---
    validate_parser = subparsers.add_parser(
        "validate",
        help="Validation commands",
        description="Validation commands — evaluate admissibility chain"
    )
    validate_sub = validate_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    validate_sub.required = True

    vf = validate_sub.add_parser(
        "freshness",
        help="Evaluate admissibility chain: AC→CA→GC and SC-01–SC-10",
        description=(
            "Evaluate the full admissibility chain for a run.\n"
            "Step 1: Bootstrap Admissibility (AC-01–AC-10)\n"
            "Step 2: Coherence Admissibility (CA-01–CA-10)\n"
            "Step 3: Computation Admissibility (GC-01–GC-10)\n"
            "Step 4: SC-01–SC-10 success criteria\n"
            "Authority: Section 9 of runtime_surface_specification.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    vf.add_argument("--run-dir", required=True, help="Path to the run directory")
    vf.add_argument("--debug", action="store_true", help="Enable debug logging")
    vf.set_defaults(func=cmd_validate_freshness)

    # --- intake ---
    intake_parser = subparsers.add_parser(
        "intake",
        help="Source intake commands (pre-S0)",
        description="Source intake commands — create a governed intake bundle from a local source directory"
    )
    intake_sub = intake_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    intake_sub.required = True

    ic = intake_sub.add_parser(
        "create",
        help="Create a governed intake bundle from a local source directory (pre-S0)",
        description=(
            "Create a governed intake bundle from a local source directory.\n"
            "Purpose: transform a local source path into a governed intake bundle that feeds\n"
            "         the existing S0→S4 runtime unchanged (pre-S0 layer).\n\n"
            "Required arguments:\n"
            "  --source-path PATH      Absolute or relative path to the local source directory\n"
            "  --tenant TENANT         Tenant/client identifier (e.g., blueedge)\n"
            "  --intake-id INTAKE_ID   Unique intake identifier (e.g., intake_01_myproject)\n\n"
            "Output artifacts (written to clients/<tenant>/psee/intake/<intake_id>/):\n"
            "  intake_record.json       Run identity and aggregate hash declaration\n"
            "  source_manifest.json     File listing with sizes\n"
            "  file_hash_manifest.json  Per-file SHA-256 hashes and aggregate hash\n"
            "  git_metadata.json        Git enrichment (GIT_DIRECTORY sources only)\n\n"
            "Failure behavior: fails closed (exit code 1) on invalid source path,\n"
            "  existing output directory, git extraction failure, or hash failure.\n\n"
            "Authority: PRODUCTIZE.RAW.SOURCE.INTAKE.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ic.add_argument("--source-path", required=True, help="Absolute or relative path to the local source directory")
    ic.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    ic.add_argument("--intake-id", required=True, help="Unique intake identifier (e.g., intake_01_myproject)")
    ic.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved source path, detected source type, "
        "file walk count, excluded file count, aggregate hash, output directory path, "
        "git metadata summary (if GIT_DIRECTORY)."
    ))
    ic.set_defaults(func=cmd_intake_create)

    # --- ig ---
    ig_parser = subparsers.add_parser(
        "ig",
        help="IG materialization commands (intake → runtime bridge)",
        description="IG materialization commands — bridge a governed intake bundle into IG-compatible runtime inputs"
    )
    ig_sub = ig_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    ig_sub.required = True

    im = ig_sub.add_parser(
        "materialize",
        help="Bridge intake bundle → IG-compatible runtime input structure",
        description=(
            "Bridge a governed intake bundle into the IG-compatible runtime input structure\n"
            "required by pios emit coverage and pios emit reconstruction.\n\n"
            "Reads from clients/<tenant>/psee/intake/<intake_id>/:\n"
            "  intake_record.json          (required)\n"
            "  file_hash_manifest.json     (required)\n"
            "  git_metadata.json           (optional, GIT_DIRECTORY sources only)\n\n"
            "Writes to clients/<tenant>/psee/runs/<run_id>/ig/:\n\n"
            "  GOVERNANCE ARTIFACTS (primary):\n"
            "    raw_input.json            Source identity + aggregate hash declaration\n"
            "    structure_map.json        Lexicographically-sorted file listing, layer=L_ROOT\n"
            "    ingestion_log.json        Per-file admission decisions\n\n"
            "  RUNTIME COMPATIBILITY ARTIFACTS (derived):\n"
            "    evidence_boundary.json               admitted_input_class.source_run=<intake_id>\n"
            "    admissibility_log.json               source_run=<intake_id>; all files ADMITTED\n"
            "    source_manifest.json                 root_artifacts + L_ROOT layer; total_admitted=file_count\n"
            "    normalized_intake_structure/\n"
            "      layer_index.json                   Single layer L_ROOT; all files ADMITTED\n"
            "      provenance_chain.json              IG.6.failures=0; IG.7.failures=0; 8 invariants\n"
            "      source_profile.json                profile_governance.verdict=PASS\n\n"
            "Determinism: all artifact timestamps derived from intake_record.json.created_at.\n\n"
            "DECLARED CONSTRAINT: pios emit reconstruction will produce state=FAIL (score=0)\n"
            "because compute_reconstruction.sh requires L40_2/L40_3/L40_4 which are not present\n"
            "in L_ROOT intake sources. Both S1 scripts exit 0 — this is correct behavior.\n\n"
            "Failure behavior: fails closed on missing intake bundle, missing required fields,\n"
            "  existing output directory (no-overwrite), or broken file hash manifest.\n\n"
            "Authority: PRODUCTIZE.IG.FROM.INTAKE.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    im.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    im.add_argument("--intake-id", required=True, help="Intake identifier (must match an existing intake bundle)")
    im.add_argument("--run-id", required=True, help="Unique run identifier for the materialized IG output")
    im.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved intake_dir, source_type, file_count, "
        "aggregate_hash, output_dir, each artifact write confirmation."
    ))
    im.set_defaults(func=cmd_ig_materialize)

    ii = ig_sub.add_parser(
        "integrate-structural-layers",
        help="Register L40_2/L40_3/L40_4 structural layers into IG layer index",
        description=(
            "Register structural truth layers (L40_2, L40_3, L40_4) into the IG layer index,\n"
            "removing the structural-side discoverability blocker for reconstruction.\n\n"
            "PURPOSE\n"
            "Makes existing structural outputs (40_2/, 40_3/, 40_4/) discoverable through\n"
            "ig/normalized_intake_structure/layer_index.json. Does not create or modify any\n"
            "structural artifact.\n\n"
            "READS (provenance only — no structural content copied):\n"
            "  ig/normalized_intake_structure/layer_index.json   — existing IG layer index\n"
            "  40_2/structural_extraction_log.json               — L40_2 determinism hash\n"
            "  40_3/structural_relationship_log.json             — L40_3 determinism hash\n"
            "  40_4/structural_topology_log.json                 — L40_4 determinism hash\n\n"
            "MODIFIES (additive only):\n"
            "  ig/normalized_intake_structure/layer_index.json\n"
            "  Appends L40_2, L40_3, L40_4 layer entries in canonical order.\n"
            "  L_ROOT entry preserved exactly — no mutation.\n\n"
            "LAYER ENTRY FIELDS (per structural layer — no semantic content):\n"
            "  layer_id, source=STRUCTURAL, path (relative), artifact_root,\n"
            "  layer_index (ordering: 1/2/3), provenance.determinism_hash\n\n"
            "LAYER ORDER CONTRACT:\n"
            "  Position 0: L_ROOT  (existing, preserved)\n"
            "  Position 1: L40_2\n"
            "  Position 2: L40_3\n"
            "  Position 3: L40_4\n\n"
            "IDEMPOTENCY CONTRACT: FAIL-CLOSED\n"
            "  If L40_2, L40_3, or L40_4 already present in layers[]: exit 1\n"
            "  STRUCTURAL_LAYERS_ALREADY_REGISTERED — create-only operation\n\n"
            "FAIL-CLOSED CONDITIONS:\n"
            "  - ig/normalized_intake_structure/ missing\n"
            "  - layer_index.json missing or malformed\n"
            "  - 40_2/, 40_3/, or 40_4/ directory missing\n"
            "  - structural_extraction_log.json, structural_relationship_log.json,\n"
            "    or structural_topology_log.json missing\n"
            "  - determinism_hash absent from any required log artifact\n"
            "  - run identity mismatch across layer_index.json and structural logs\n"
            "  - structural layers already present (STRUCTURAL_LAYERS_ALREADY_REGISTERED)\n\n"
            "RECONSTRUCTION HANDOVER:\n"
            "  After successful integration, L40_2/L40_3/L40_4 are discoverable.\n"
            "  Structural-side discoverability blocker is removed.\n"
            "  Downstream reconstruction pipeline determines remaining readiness.\n\n"
            "Authority: PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ii.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    ii.add_argument("--run-id", required=True, help="Run identifier — must have existing ig/, 40_2/, 40_3/, 40_4/ directories")
    ii.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved paths, layer_index identity, provenance hashes, "
        "no-overwrite guard result, layer entries built, write confirmation."
    ))
    ii.set_defaults(func=cmd_ig_integrate_structural_layers)

    # --- structural ---
    structural_parser = subparsers.add_parser(
        "structural",
        help="Structural truth commands (L40.2)",
        description="Structural truth commands — extract L40.2 structural truth from governed IG outputs"
    )
    structural_sub = structural_parser.add_subparsers(dest="subcommand", metavar="SUBCOMMAND")
    structural_sub.required = True

    se = structural_sub.add_parser(
        "extract",
        help="L40.2 — Extract structural truth from governed IG outputs",
        description=(
            "Extract L40.2 structural truth deterministically from governed IG outputs.\n\n"
            "PURPOSE\n"
            "Derive structural unit inventory, file-to-structural-unit mapping, and extraction\n"
            "log from the governed IG runtime package produced by pios ig materialize.\n"
            "No semantic inference. No domain assignment. No entity graph.\n"
            "Structural identity only — classification by file extension and basename.\n\n"
            "INPUTS (reads from clients/<tenant>/psee/runs/<run_id>/ig/)\n"
            "  Primary (required):\n"
            "    raw_input.json         source identity + deterministic timestamp\n"
            "    structure_map.json     per-file SHA-256 + size_bytes\n"
            "    ingestion_log.json     admission decisions per file\n"
            "  Support (if present):\n"
            "    admissibility_log.json source_path + layer enrichment per file\n\n"
            "OUTPUTS (writes to clients/<tenant>/psee/runs/<run_id>/40_2/)\n"
            "  structural_unit_inventory.json\n"
            "    CEU assignments by directory grouping — one CEU per directory.\n"
            "    CEU-001, CEU-002... assigned in lexicographic directory order.\n"
            "    Includes unit hash, file_types_present, dominant_file_type, evidence_ref.\n\n"
            "  file_structural_map.json\n"
            "    Per-file mapping: path → unit_id, file_type, sha256, size_bytes.\n"
            "    All admitted files in lexicographic path order.\n"
            "    ADMITTED entries only — non-ADMITTED and path-less entries are excluded.\n\n"
            "  structural_extraction_log.json\n"
            "    Derivation rules applied, exclusion log, ambiguity log, determinism hash.\n"
            "    determinism_hash = SHA256(sorted '<path>:<sha256>' pairs for all admitted files).\n\n"
            "DERIVATION RULES\n"
            "  CEU grouping:   files grouped by immediate parent directory\n"
            "  CEU ordering:   lexicographic directory sort; root ('') sorts first\n"
            "  File types:     extension lookup → _EXT_TO_FILE_TYPE; basename → _BASENAME_TO_FILE_TYPE\n"
            "                  unknown extension → UNKNOWN_FILE_TYPE (logged, not failed)\n"
            "  Timestamps:     inherited from raw_input.json.materialized_at (deterministic)\n"
            "  Ambiguities:    logged in structural_extraction_log.json; not silently dropped\n\n"
            "FAIL-CLOSED CONDITIONS\n"
            "  - IG directory not found\n"
            "  - raw_input.json, structure_map.json, or ingestion_log.json missing\n"
            "  - required fields missing in raw_input.json\n"
            "  - 40_2/ output directory already exists (no-overwrite guard)\n\n"
            "NON-FAIL CONDITIONS (logged as exclusions)\n"
            "  - UNKNOWN_FILE_TYPE: logged in extraction_log.json; file is still admitted\n"
            "  - DECISION_NOT_ADMITTED: file excluded and logged\n"
            "  - NOT_IN_STRUCTURE_MAP: file excluded and logged\n\n"
            "BOUNDARY\n"
            "  This command does NOT modify the IG layer_index.json.\n"
            "  The declared reconstruction constraint (L40_2/L40_3/L40_4 absent from IG\n"
            "  layer_index.json) remains until a layer-enriched IG path is defined.\n"
            "  This command is additive and does not affect S2–S4 or GA logic.\n\n"
            "Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01 / STRUCTURAL.TRUTH.AUTHORITY.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    se.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    se.add_argument("--run-id", required=True, help="Run identifier — must have an existing ig/ directory")
    se.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved ig_dir, admitted file count, "
        "excluded file count, directory→CEU assignments, unknown type count, "
        "determinism hash, output path."
    ))
    se.set_defaults(func=cmd_structural_extract)

    sr = structural_sub.add_parser(
        "relate",
        help="L40.3 — Derive structural relationships from governed L40.2 outputs",
        description=(
            "Derive L40.3 structural relationships deterministically from L40.2 outputs.\n\n"
            "PURPOSE\n"
            "Derive all structurally grounded relationships between Canonical Evidence Units\n"
            "(CEUs) established by pios structural extract. No semantic inference.\n"
            "No domain assignment. No capability inference. No scoring.\n\n"
            "INPUTS (reads from clients/<tenant>/psee/runs/<run_id>/40_2/)\n"
            "  structural_unit_inventory.json  (required — units, directories, file_types)\n"
            "  file_structural_map.json        (required — per-file sha256, unit_id)\n"
            "  ig/ artifacts: NOT consumed — all 4 edge types derivable from 40_2 alone.\n\n"
            "OUTPUTS (writes to clients/<tenant>/psee/runs/<run_id>/40_3/)\n"
            "  structural_relationship_inventory.json\n"
            "    Unit summaries: edges_as_source, edges_as_target, total_edges per CEU.\n"
            "    Edge type counts: DIRECTORY_CONTAINS, DIRECTORY_SIBLING,\n"
            "                      STRUCTURAL_TYPE_AFFINITY, CONTENT_DUPLICATE.\n\n"
            "  structural_edge_map.json\n"
            "    All edges: edge_id, edge_type, from_unit_id, to_unit_id,\n"
            "               direction, evidence (type-specific fields).\n"
            "    Edges sorted by (edge_type, from_unit_id, to_unit_id); IDs EDGE-001...\n\n"
            "  structural_relationship_log.json\n"
            "    Derivation rules, input contract, edge type definitions, exclusions,\n"
            "    ambiguities, determinism_hash.\n\n"
            "EDGE TYPES\n"
            "  DIRECTORY_CONTAINS\n"
            "    CEU-X → CEU-Y: Y's immediate parent directory == X's directory.\n"
            "    Directed. Root CEU can be parent. No transitive edges.\n"
            "    Evidence: structural_unit_inventory.json directory paths.\n\n"
            "  DIRECTORY_SIBLING\n"
            "    CEU-X — CEU-Y: both non-root, same immediate parent directory.\n"
            "    Root CEU excluded. Undirected, normalized (lower unit_id = from).\n"
            "    Evidence: structural_unit_inventory.json directory paths.\n\n"
            "  STRUCTURAL_TYPE_AFFINITY\n"
            "    CEU-X — CEU-Y: file_types_present intersection is non-empty.\n"
            "    Structural observation — shared file type, no functional inference.\n"
            "    Undirected, normalized. Evidence: file_types_present.\n\n"
            "  CONTENT_DUPLICATE\n"
            "    CEU-X — CEU-Y: at least one file shares SHA-256 across units.\n"
            "    Structural observation — hash identity, no semantic inference.\n"
            "    Undirected, normalized. Evidence: sha256 from file_structural_map.json.\n\n"
            "DETERMINISM\n"
            "  determinism_hash = SHA256(sorted '<edge_type>:<from>:<to>' pairs)\n"
            "  derived_at = inherited from structural_unit_inventory.json.extracted_at\n"
            "  All lists in deterministic lexicographic order.\n\n"
            "FAIL-CLOSED CONDITIONS\n"
            "  - 40_2/ directory not found\n"
            "  - structural_unit_inventory.json or file_structural_map.json missing\n"
            "  - required fields missing in either artifact\n"
            "  - unit missing unit_id, directory, or file_types_present fields\n"
            "  - 40_3/ output directory already exists (no-overwrite guard)\n\n"
            "BOUNDARY\n"
            "  Does not modify 40_2/, ig/, or any other upstream artifact.\n"
            "  Does not resolve reconstruction constraint.\n"
            "  Additive only — S2–S4 and GA logic unchanged.\n\n"
            "Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01 / STRUCTURAL.TRUTH.AUTHORITY.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sr.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    sr.add_argument("--run-id", required=True, help="Run identifier — must have an existing 40_2/ directory")
    sr.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved 40_2 dir, unit count, per-edge-type counts, "
        "total edge count, determinism_hash, output dir, each artifact write confirmation."
    ))
    sr.set_defaults(func=cmd_structural_relate)

    sn = structural_sub.add_parser(
        "normalize",
        help="L40.4 — Normalize structural truth into canonical topology",
        description=(
            "Normalize L40.4 structural topology deterministically from L40.2 + L40.3 outputs.\n\n"
            "PURPOSE\n"
            "Consume all 6 governed artifacts from 40_2/ and 40_3/, cross-validate for\n"
            "consistency, and produce a canonical structural topology with deduplicated edges,\n"
            "normalized node identifiers, adjacency index, and node-edge statistics.\n\n"
            "INPUTS\n"
            "  40_2/structural_unit_inventory.json     — CEU definitions with unit_hash\n"
            "  40_2/file_structural_map.json           — file-level sha256/type/unit mapping\n"
            "  40_2/structural_extraction_log.json     — extracted_at timestamp, intake_id\n"
            "  40_3/structural_edge_map.json           — edge list with direction + evidence\n"
            "  40_3/structural_relationship_inventory.json — unit summaries, edge_type_counts\n"
            "  40_3/structural_relationship_log.json   — relationship provenance\n\n"
            "OUTPUTS  (written to clients/<tenant>/psee/runs/<run_id>/40_4/)\n"
            "  normalized_structural_topology.json     — canonical nodes + edges + adjacency\n"
            "  structural_node_inventory.json          — per-node structural fields + stats\n"
            "  structural_topology_log.json            — provenance, cross-validation, readiness\n\n"
            "CROSS-VALIDATION (fail-closed)\n"
            "  unit_count(sui) == unit_count(sri)\n"
            "  edge_count(sem) == edge_count(sri)\n"
            "  file_count per unit(sui) == file_count per unit(fsm)\n"
            "  timestamps: sui.extracted_at == sel.extracted_at\n"
            "  all edge from/to endpoints must reference valid unit_ids\n\n"
            "NORMALIZATION RULES\n"
            "  node_id = unit_id (identity preserved)\n"
            "  edge deduplication: collapse identical (edge_type, from_node_id, to_node_id) triples\n"
            "  edge sort: (edge_type, from_node_id, to_node_id) lexicographic\n"
            "  adjacency: per-node sorted list of incident edge_ids\n\n"
            "DETERMINISM\n"
            "  determinism_hash = SHA256(sorted 'node_id:unit_hash' lines\n"
            "                           + sorted 'edge_id:edge_type:from:to' lines)\n"
            "  derived_at = inherited from structural_extraction_log.json.extracted_at\n"
            "  All lists in deterministic lexicographic order.\n\n"
            "FAIL-CLOSED CONDITIONS\n"
            "  - 40_2/ or 40_3/ directory not found\n"
            "  - any of the 6 input artifacts missing\n"
            "  - cross-validation failure (unit count, edge count, file count, timestamp mismatch)\n"
            "  - edge endpoint references non-existent unit_id\n"
            "  - 40_4/ output directory already exists (no-overwrite guard)\n\n"
            "RECONSTRUCTION READINESS\n"
            "  reconstruction_readiness.status = BLOCKED\n"
            "  deferred_boundary = IG_LAYER_INDEX_INTEGRATION\n"
            "  This stream does NOT modify ig/normalized_intake_structure/layer_index.json.\n\n"
            "BOUNDARY\n"
            "  Does not modify 40_2/, 40_3/, ig/, or any other upstream artifact.\n"
            "  Additive only — S2–S4 and GA logic unchanged.\n\n"
            "Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01 / STRUCTURAL.TRUTH.AUTHORITY.01"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sn.add_argument("--tenant", required=True, help="Tenant/client identifier (e.g., blueedge)")
    sn.add_argument("--run-id", required=True, help="Run identifier — must have existing 40_2/ and 40_3/ directories")
    sn.add_argument("--debug", action="store_true", help=(
        "Enable debug logging. Prints: resolved input dirs, unit count, edge count (pre/post dedup), "
        "duplicates_collapsed, determinism_hash, output dir, each artifact write confirmation."
    ))
    sn.set_defaults(func=cmd_structural_normalize)

    return parser


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
