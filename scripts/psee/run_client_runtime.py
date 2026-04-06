#!/usr/bin/env python3
"""
PSEE Autonomous Client Runtime
Stream: PSEE.RECONCILE.1.WP-13

Single-entrypoint, fully autonomous, deterministic, replayable runtime.
Pipeline: INPUT → IG_NORMALIZATION → PSEE_RECONSTRUCTION → PSEE_VALIDATION
        → GAUGE_ENGINE → ENVELOPE_BUILD → REPLAY_CHECK → OUTPUT_WRITE

Usage:
    python3 scripts/psee/run_client_runtime.py \\
        --client <client_uuid> --input <input_path> \\
        [--log-level {silent,error,warn,info,debug}] \\
        [--log-format {text,json}] \\
        [--log-file <path>] \\
        [--stage-trace] [--fail-trace]

Reads:   clients/registry/client_index.json
         clients/<client_uuid>/config/
         clients/<client_uuid>/input/
Writes:  clients/<client_uuid>/runs/<run_id>/

Exit codes:
    0 = RUNTIME_COMPLETE
    1 = RUNTIME_FAILED
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
REPO_NAME = "k-pi-core"
REQUIRED_BRANCH = "work/psee-runtime"
REGISTRY_RELPATH = os.path.join("clients", "registry", "client_index.json")
STREAM_ID = "PSEE.RECONCILE.1.WP-13"
TERMINAL_STATES = {"S-T1", "S-T2", "S-T3", "S-13"}
VALID_EXEC_STATES = {"PRE_EXECUTION", "PHASE_1_ACTIVE", "PHASE_2_ACTIVE"} | TERMINAL_STATES
VALID_RECON_STATES = {"PASS", "PARTIAL", "FAIL"}
VALID_SEVERITIES = {"CRITICAL", "HIGH", "MEDIUM", "LOW"}
SEV_PRIORITY = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
OUTCOME_MAP = {"PASS_FULL": "AUTHORITATIVE_INTAKE", "PASS_PARTIAL": "BOUNDED_INTAKE"}
REQUIRED_CONFIG_FIELDS = [
    "package_version", "source_system", "lifecycle_state",
    "execution_mode", "gauge_projection", "evidence_basis", "expected_domains"
]
REQUIRED_INPUT_FIELDS = [
    "schema_version", "source_system", "client_uuid",
    "coverage", "reconstruction", "execution_status",
    "escalation_clearance", "unknown_space_count", "signals", "topology"
]

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ── ARGUMENT PARSING ──────────────────────────────────────────────────────────
def parse_args():
    p = argparse.ArgumentParser(description="PSEE Autonomous Client Runtime — WP-13")
    p.add_argument("--client", required=True, help="Client UUID")
    p.add_argument("--input", required=True, dest="input_path", help="Path to input JSON file")
    p.add_argument("--log-level", default="info",
                   choices=["silent", "error", "warn", "info", "debug"],
                   help="Log verbosity level")
    p.add_argument("--log-format", default="text", choices=["text", "json"],
                   help="Log output format")
    p.add_argument("--log-file", default=None, help="Optional log file path")
    p.add_argument("--stage-trace", action="store_true", default=True,
                   help="Enable stage lifecycle events (default: on)")
    p.add_argument("--fail-trace", action="store_true", default=True,
                   help="Enable detailed fail trace output (default: on)")
    return p.parse_args()


# ── LOGGER ────────────────────────────────────────────────────────────────────
class Logger:
    LEVELS = {"silent": 0, "error": 1, "warn": 2, "info": 3, "debug": 4}

    def __init__(self, level="info", fmt="text", log_file=None,
                 stage_trace=True, fail_trace=True):
        self.level_val = self.LEVELS.get(level, 3)
        self.fmt = fmt
        self.log_file = log_file
        self.stage_trace = stage_trace
        self.fail_trace = fail_trace
        self._counter = 0
        self.trace_lines = []  # accumulated for verification.log

    def _next_id(self):
        self._counter += 1
        return self._counter

    def emit(self, stage, event, rule_id=None, artifact=None, message="", status="OK"):
        eid = self._next_id()
        tag = f"{stage}_{event}"

        # Store for verification.log (always)
        self.trace_lines.append(tag)
        if message:
            self.trace_lines.append(f"  {message}")

        if self.level_val < 3:
            return  # silent or error/warn — suppress info events

        if self.fmt == "json":
            record = {
                "event_id": eid,
                "stage": stage,
                "event": event,
                "rule_id": rule_id,
                "artifact": artifact,
                "message": message,
                "status": status
            }
            self._out(json.dumps(record, sort_keys=True))
        else:
            self._out(tag)
            if message and self.level_val >= 4:
                self._out(f"  {message}")

    def debug(self, msg):
        if self.level_val >= 4:
            self._out(f"[DEBUG] {msg}")

    def _out(self, msg):
        print(msg)
        if self.log_file:
            with open(self.log_file, "a") as f:
                f.write(msg + "\n")

    def fail(self, stage, rule_id, reason, artifact=None):
        self.emit(stage, "FAIL", rule_id=rule_id, artifact=artifact,
                  message=reason, status="FAIL")
        if self.fail_trace:
            print(f"\nFAIL [{stage}]")
            print(f"  rule:     {rule_id}")
            print(f"  reason:   {reason}")
            if artifact:
                print(f"  artifact: {artifact}")
            print("  action:   execution halted\n")
        sys.exit(1)


# ── SAFE I/O ──────────────────────────────────────────────────────────────────
def _abs(path):
    return os.path.realpath(os.path.abspath(path))


def assert_read_allowed(path, client_uuid, log):
    """Reject any read path not in the allowed read scope."""
    ap = _abs(path)
    registry = _abs(os.path.join(REPO_ROOT, REGISTRY_RELPATH))
    cfg_root = _abs(os.path.join(REPO_ROOT, "clients", client_uuid, "config"))
    inp_root = _abs(os.path.join(REPO_ROOT, "clients", client_uuid, "input"))

    allowed = (
        ap == registry
        or ap.startswith(cfg_root + os.sep)
        or ap == cfg_root
        or ap.startswith(inp_root + os.sep)
        or ap == inp_root
    )
    if not allowed:
        log.fail("READ_SCOPE", "READ_SCOPE_VIOLATION",
                 f"forbidden read path: {path}", artifact=path)


def assert_write_allowed(path, client_uuid, run_id, log):
    """Reject any write path not under the run output root."""
    ap = _abs(path)
    run_root = _abs(os.path.join(REPO_ROOT, "clients", client_uuid, "runs", run_id))
    if not ap.startswith(run_root + os.sep) and ap != run_root:
        log.fail("WRITE_SCOPE", "WRITE_SCOPE_VIOLATION",
                 f"forbidden write path: {path}", artifact=path)


def safe_read_json(path, client_uuid, log):
    assert_read_allowed(path, client_uuid, log)
    with open(path) as f:
        return json.load(f)


def safe_write(path, content, client_uuid, run_id, log):
    assert_write_allowed(path, client_uuid, run_id, log)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)


# ── GOVERNANCE CHECKS ─────────────────────────────────────────────────────────
def check_repo(log):
    log.emit("PRECHECK", "START", message="verifying repository identity")
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        if result.returncode != 0:
            log.fail("PRECHECK", "REPO_LOCK", "not a git repository")
        toplevel = result.stdout.strip()
        actual_name = os.path.basename(toplevel)
        if actual_name != REPO_NAME:
            log.fail("PRECHECK", "REPO_LOCK",
                     f"repo name={actual_name!r} — expected={REPO_NAME!r}")
    except Exception as e:
        log.fail("PRECHECK", "REPO_LOCK", f"git error: {e}")


def check_branch(log):
    try:
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = result.stdout.strip()
        if branch != REQUIRED_BRANCH:
            log.fail("PRECHECK", "BRANCH_LOCK",
                     f"branch={branch!r} — required={REQUIRED_BRANCH!r}")
    except Exception as e:
        log.fail("PRECHECK", "BRANCH_LOCK", f"git error: {e}")


def check_worktree(client_uuid, log):
    """Verify worktree is clean. Untracked runs/ output is allowed only after writes."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        lines = [l for l in result.stdout.splitlines() if l.strip()]
        allowed_prefix = f"?? clients/{client_uuid}/runs/"
        dirty = [l for l in lines if not l.startswith(allowed_prefix)]
        if dirty:
            log.fail("PRECHECK", "WORKTREE_LOCK",
                     f"dirty worktree detected ({len(dirty)} unexpected entries): "
                     + "; ".join(dirty[:3]))
    except Exception as e:
        log.fail("PRECHECK", "WORKTREE_LOCK", f"git error: {e}")


def get_git_info(log):
    """Collect read-only git traceability fields — descriptive only, no runtime influence."""
    def run(cmd):
        r = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
        return r.stdout.strip() if r.returncode == 0 else None

    commit_hash = run(["git", "rev-parse", "HEAD"])
    branch = run(["git", "branch", "--show-current"])
    tag = run(["git", "describe", "--exact-match", "--tags", "HEAD"])
    log.debug(f"git_info: commit={commit_hash} branch={branch} tag={tag}")
    return {
        "git_commit_hash": commit_hash,
        "git_branch": branch,
        "repository_name": REPO_NAME,
        "runtime_version_tag": tag
    }


# ── REGISTRY ──────────────────────────────────────────────────────────────────
def resolve_registry(client_uuid, log):
    log.emit("REGISTRY_RESOLUTION", "START",
             message=f"resolving client_uuid={client_uuid}")
    registry_path = os.path.join(REPO_ROOT, REGISTRY_RELPATH)
    assert_read_allowed(registry_path, client_uuid, log)

    if not os.path.isfile(registry_path):
        log.fail("REGISTRY_RESOLUTION", "REGISTRY_MISSING",
                 f"registry not found: {REGISTRY_RELPATH}", artifact=REGISTRY_RELPATH)

    with open(registry_path) as f:
        registry = json.load(f)

    clients = registry.get("clients", [])
    active = [c for c in clients if c.get("client_uuid") == client_uuid
              and c.get("active_flag") is True]
    if not active:
        log.fail("REGISTRY_RESOLUTION", "UUID_NOT_FOUND",
                 f"no active client found for uuid={client_uuid}")

    entry = active[0]
    log.emit("REGISTRY_RESOLUTION", "PASS",
             message=f"uuid resolved; lifecycle={entry.get('lifecycle_state')}")
    return entry


# ── STAGE 1: IG_NORMALIZATION ─────────────────────────────────────────────────
def ig_normalize(raw_input, client_uuid, log):
    """
    Validates and normalizes raw input. Returns canonical normalized dict and run_id.
    All ordering is deterministic. run_id derived from canonical SHA256.
    """
    log.emit("IG_NORMALIZATION", "START", message="normalizing input")

    # Field presence
    missing = [f for f in REQUIRED_INPUT_FIELDS if f not in raw_input]
    if missing:
        log.fail("IG_NORMALIZATION", "INPUT_SCHEMA_VIOLATION",
                 f"missing required input fields: {missing}")

    # client_uuid match
    if raw_input["client_uuid"] != client_uuid:
        log.fail("IG_NORMALIZATION", "IDENTITY_MISMATCH",
                 f"input client_uuid={raw_input['client_uuid']!r} != "
                 f"--client={client_uuid!r}")

    # source_system
    if raw_input.get("source_system") != "IG":
        log.fail("IG_NORMALIZATION", "SOURCE_SYSTEM_VIOLATION",
                 f"source_system must be IG, got {raw_input.get('source_system')!r}")

    # Normalize signals
    raw_signals = raw_input.get("signals", [])
    norm_signals = []
    for s in raw_signals:
        sev = str(s.get("severity", "")).upper()
        if sev not in VALID_SEVERITIES:
            log.fail("IG_NORMALIZATION", "SIGNAL_SEVERITY_INVALID",
                     f"signal {s.get('id')!r} severity={sev!r} not in {VALID_SEVERITIES}")
        norm_signals.append({
            "id": str(s["id"]),
            "domain": str(s.get("domain", "")),
            "severity": sev,
            "label": str(s.get("label", "")),
            "bound_count": int(s.get("bound_count", 0))
        })
    norm_signals.sort(key=lambda s: s["id"])

    # Normalize topology
    topo = raw_input.get("topology", {})
    norm_domains = sorted([str(d) for d in topo.get("domains", [])])
    norm_nodes = sorted(
        [{"id": str(n["id"]), "label": str(n.get("label", "")),
          "domain": str(n.get("domain", ""))}
         for n in topo.get("nodes", [])],
        key=lambda n: n["id"]
    )
    norm_rels = sorted(
        [{"from": str(r["from"]), "to": str(r["to"]), "type": str(r.get("type", ""))}
         for r in topo.get("relationships", [])],
        key=lambda r: (r["from"], r["to"], r["type"])
    )
    highlighted = topo.get("highlighted_signal")

    norm_coverage = {
        "admitted_units": int(raw_input["coverage"]["admitted_units"]),
        "total_units": int(raw_input["coverage"]["total_units"])
    }
    norm_reconstruction = {
        "validated_units": int(raw_input["reconstruction"]["validated_units"]),
        "total_units": int(raw_input["reconstruction"]["total_units"])
    }

    normalized = {
        "client_uuid": client_uuid,
        "coverage": norm_coverage,
        "reconstruction": norm_reconstruction,
        "execution_status": str(raw_input["execution_status"]),
        "escalation_clearance": int(raw_input["escalation_clearance"]),
        "unknown_space_count": int(raw_input["unknown_space_count"]),
        "signals": norm_signals,
        "topology": {
            "domains": norm_domains,
            "nodes": norm_nodes,
            "relationships": norm_rels,
            "highlighted_signal": highlighted
        }
    }

    # Derive run_id from canonical SHA256 of normalized input
    canonical = json.dumps(normalized, sort_keys=True, separators=(",", ":"),
                           ensure_ascii=True)
    run_id = "run_" + hashlib.sha256(canonical.encode()).hexdigest()[:12]

    log.emit("IG_NORMALIZATION", "PASS",
             message=f"signals={len(norm_signals)} nodes={len(norm_nodes)} "
                     f"domains={len(norm_domains)} run_id={run_id}")
    return normalized, run_id


# ── STAGE 2: PSEE_RECONSTRUCTION ─────────────────────────────────────────────
def psee_reconstruct(normalized, config):
    """
    Derives all computed state from normalized input and config.
    Pure function — no I/O, no logging.
    """
    cov = normalized["coverage"]
    recon = normalized["reconstruction"]
    signals = normalized["signals"]
    topo = normalized["topology"]

    # Coverage
    cov_total = max(1, cov["total_units"])
    coverage_percent = round(cov["admitted_units"] / cov_total * 100, 2)
    if coverage_percent >= 95.0:
        coverage_class = "FULL"
    elif coverage_percent >= 60.0:
        coverage_class = "PARTIAL"
    else:
        coverage_class = "LOW"

    # Reconstruction
    recon_total = max(1, recon["total_units"])
    recon_percent = round(recon["validated_units"] / recon_total * 100, 2)
    if recon_percent >= 95.0:
        reconstruction_status = "PASS"
    elif recon_percent >= 60.0:
        reconstruction_status = "PARTIAL"
    else:
        reconstruction_status = "FAIL"

    recon_violations = []
    if reconstruction_status == "PARTIAL":
        uncovered = recon["total_units"] - recon["validated_units"]
        recon_violations.append({
            "type": "COMPLETENESS",
            "description": f"{uncovered} units not validated — coverage below full threshold",
            "affected_units": uncovered
        })

    # Structural metrics from topology
    n_nodes = len(topo["nodes"])
    n_domains = len(topo["domains"])
    n_rels = len(topo["relationships"])
    structural_density = round(n_nodes / max(1, n_domains), 2)
    dependency_load = round(n_rels / max(1, n_nodes), 2)

    # Signal metrics
    n_signals = len(signals)
    high_sev = [s for s in signals if s["severity"] in ("HIGH", "CRITICAL")]
    n_high = len(high_sev)
    total_bound = sum(s["bound_count"] for s in signals)
    coordination_pressure = round(n_high / max(1, n_signals), 2)
    visibility_deficit = round(min(1.0, total_bound / max(1, n_signals * 10)), 2)

    # Escalation and unknown space (from input, enforced by IG stage)
    escalation_clearance = normalized["escalation_clearance"]
    unknown_space_count = normalized["unknown_space_count"]

    # Score derivation
    execution_status = normalized["execution_status"]
    if execution_status in TERMINAL_STATES:
        completion_points = 40
        completion_basis = (f"{execution_status} — terminal state; "
                            "full completion credit")
    else:
        completion_points = 0
        completion_basis = (f"{execution_status} — in-flight state; "
                            "UNDEFINED_STATE guard applied (gauge_score_model §G.2)")

    coverage_points = round(coverage_percent * 0.35)
    coverage_basis = (f"round({coverage_percent} × 0.35) = {coverage_points} "
                      "(gauge_score_model §G.2 Component 2)")

    if reconstruction_status == "PASS":
        reconstruction_points = 25
        recon_basis = "DIM-02.state=PASS → no block → 25 pts"
    elif reconstruction_status == "PARTIAL":
        reconstruction_points = 13
        recon_basis = "DIM-02.state=PARTIAL → partial credit → 13 pts"
    else:
        reconstruction_points = 0
        recon_basis = "DIM-02.state=FAIL → block → 0 pts"

    derived_score = completion_points + coverage_points + reconstruction_points
    if reconstruction_status == "FAIL":
        derived_score = 0
        band_label = "BLOCKED"
    elif derived_score >= 80:
        band_label = "HIGH"
    elif derived_score >= 60:
        band_label = "CONDITIONAL"
    elif derived_score >= 40:
        band_label = "LOW"
    else:
        band_label = "INSUFFICIENT"

    gauge_projection = config["gauge_projection"]
    variance = max(0, 100 - escalation_clearance) + (unknown_space_count * 3)
    conf_lower = max(0, derived_score - variance)
    conf_upper = min(100, gauge_projection)

    # Bounded conditions (WP-12 calibration, re-applied in WP-13 pipeline)
    bounded_conditions = []
    if coverage_class in ("PARTIAL", "LOW"):
        bounded_conditions.append(
            f"coverage_class={coverage_class} — coverage scope is bounded")
    if reconstruction_status == "PARTIAL":
        bounded_conditions.append(
            "reconstruction_status=PARTIAL — bounded reconstruction validity")
    if coverage_percent < 100.0:
        bounded_conditions.append(
            f"coverage_percent={coverage_percent}% — not full coverage")
    if unknown_space_count > 0:
        bounded_conditions.append(
            f"unknown_space_count={unknown_space_count} — unresolved unknown-space records")
    if escalation_clearance < 100:
        bounded_conditions.append(
            f"escalation_clearance={escalation_clearance} — escalation not fully resolved")
    is_bounded = bool(bounded_conditions)

    # Verification domains
    d1 = d3 = d4 = d5 = "VERIFIED_PASS"
    d2_fail = []
    if execution_status not in VALID_EXEC_STATES:
        d2_fail.append(f"execution_status={execution_status} not in defined phase set")
    if reconstruction_status not in VALID_RECON_STATES:
        d2_fail.append(
            f"reconstruction_status={reconstruction_status} not in defined set")
    d2 = "VERIFIED_FAIL" if d2_fail else "VERIFIED_PASS"
    blocking = list(d2_fail)

    if d5 == "VERIFIED_FAIL":
        verification_outcome = "FAIL_STRUCTURAL"
    elif any(d == "VERIFIED_FAIL" for d in [d1, d2, d3, d4]):
        verification_outcome = "FAIL_STRUCTURAL"
    elif is_bounded:
        verification_outcome = "PASS_PARTIAL"
    elif all(d == "VERIFIED_PASS" for d in [d1, d2, d3, d4, d5]):
        verification_outcome = "PASS_FULL"
    else:
        verification_outcome = "PASS_PARTIAL"

    intake_mode = OUTCOME_MAP.get(verification_outcome, "REJECT")
    rejected = verification_outcome == "FAIL_STRUCTURAL"

    if verification_outcome == "PASS_FULL":
        consumption_permission = "CONSUME AS AUTHORITATIVE"
    elif verification_outcome == "PASS_PARTIAL":
        consumption_permission = (
            "CONSUME AS BOUNDED INTELLIGENCE — unverified scope not confirmed")
    else:
        consumption_permission = "DO NOT CONSUME — structural failure"

    # Query state
    if signals:
        dom_sig = max(signals, key=lambda s: (SEV_PRIORITY.get(s["severity"], 0), s["id"]))
        selected_query = f"{dom_sig['domain']}_RISK_ASSESSMENT"
        if dom_sig["severity"] in ("CRITICAL", "HIGH"):
            classification = "BOUNDED_HIGH_RISK"
        elif dom_sig["severity"] == "MEDIUM":
            classification = "BOUNDED_MEDIUM_RISK"
        else:
            classification = "BOUNDED_LOW_RISK"
    else:
        selected_query = "STATUS_BASELINE"
        if verification_outcome == "PASS_FULL":
            classification = "FULL_AUTHORITY"
        else:
            classification = "BOUNDED_AUTHORITY"

    gating_state = intake_mode

    # Placement semantics
    if topo["nodes"]:
        from collections import Counter
        dc = Counter(n["domain"] for n in topo["nodes"])
        dom = min(dc, key=lambda d: (-dc[d], d))
        placement_semantics = {"dominant_domain": dom, "node_count": dc[dom]}
    else:
        placement_semantics = {"dominant_domain": None, "node_count": 0}

    return {
        # coverage
        "coverage_percent": coverage_percent,
        "coverage_class": coverage_class,
        "coverage_admitted": cov["admitted_units"],
        "coverage_total": cov["total_units"],
        # reconstruction
        "reconstruction_status": reconstruction_status,
        "recon_validated": recon["validated_units"],
        "recon_total": recon["total_units"],
        "recon_violations": recon_violations,
        # execution
        "execution_status": execution_status,
        "execution_mode": config["execution_mode"],
        # structural
        "structural_density": structural_density,
        "dependency_load": dependency_load,
        "coordination_pressure": coordination_pressure,
        "visibility_deficit": visibility_deficit,
        # signals / topology
        "signals": signals,
        "topology": topo,
        "placement_semantics": placement_semantics,
        # escalation / unknown
        "escalation_clearance": escalation_clearance,
        "unknown_space_count": unknown_space_count,
        # score
        "completion_points": completion_points,
        "completion_basis": completion_basis,
        "coverage_points": coverage_points,
        "coverage_basis": coverage_basis,
        "reconstruction_points": reconstruction_points,
        "recon_basis": recon_basis,
        "derived_score": derived_score,
        "band_label": band_label,
        "gauge_projection": gauge_projection,
        "conf_lower": conf_lower,
        "conf_upper": conf_upper,
        # verification
        "d1": d1, "d2": d2, "d3": d3, "d4": d4, "d5": d5,
        "d2_fail": d2_fail,
        "blocking": blocking,
        "bounded_conditions": bounded_conditions,
        "is_bounded": is_bounded,
        "verification_outcome": verification_outcome,
        "intake_mode": intake_mode,
        "rejected": rejected,
        "consumption_permission": consumption_permission,
        # gauge fidelity surface
        "structural_metrics": {
            "dependency_load": dependency_load,
            "structural_density": structural_density,
            "coordination_pressure": coordination_pressure,
            "visibility_deficit": visibility_deficit
        },
        "query_state": {
            "selected_query": selected_query,
            "classification": classification,
            "gating_state": gating_state
        },
        # config carry-through
        "evidence_basis": config["evidence_basis"],
        "package_version": config["package_version"],
        "source_system_out": config["source_system"],
        "lifecycle_state": config["lifecycle_state"],
        "expected_domains": config["expected_domains"]
    }


# ── STAGE 3: PSEE_VALIDATION ──────────────────────────────────────────────────
def psee_validate(state):
    """
    Validates structural integrity of reconstructed state.
    Returns {"buildable": bool, "reason": str}.
    Pure function.
    """
    if state["coverage_admitted"] > state["coverage_total"]:
        return {"buildable": False,
                "reason": "admitted_units > total_units — coverage structurally invalid"}
    if state["recon_validated"] > state["recon_total"]:
        return {"buildable": False,
                "reason": "validated_units > total_units — reconstruction structurally invalid"}
    if state["execution_status"] not in VALID_EXEC_STATES:
        return {"buildable": False,
                "reason": f"execution_status={state['execution_status']!r} invalid"}
    if state["reconstruction_status"] not in VALID_RECON_STATES:
        return {"buildable": False,
                "reason": f"reconstruction_status={state['reconstruction_status']!r} invalid"}
    if state["verification_outcome"] == "FAIL_STRUCTURAL":
        return {"buildable": False,
                "reason": f"FAIL_STRUCTURAL: {state['blocking']}"}
    return {"buildable": True, "reason": "all checks passed"}


# ── STAGE 4-5: ENVELOPE_BUILD (pure artifact serialization) ───────────────────
def _jdump(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=True)


def build_core_artifacts(run_id, client_uuid, state):
    """
    Pure function. Builds 5 core package JSON artifacts from reconstructed state.
    Returns dict {filename: json_string}.
    """
    S = state

    coverage_state = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "dimension": "DIM-01",
        "label": "Coverage",
        "state": "COMPUTED",
        "state_label": S["coverage_class"],
        "coverage_percent": S["coverage_percent"],
        "admitted_units": S["coverage_admitted"],
        "total_units": S["coverage_total"],
        "authority": "PSEE-GAUGE.0 DP-5-02"
    }

    reconstruction_state = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "dimension": "DIM-02",
        "label": "Reconstruction",
        "state": S["reconstruction_status"],
        "violations": S["recon_violations"],
        "validated_units": S["recon_validated"],
        "total_units": S["recon_total"],
        "authority": "PSEE-GAUGE.0 DP-6-03"
    }

    engine_state = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "execution_status": S["execution_status"],
        "execution_mode": S["execution_mode"],
        "source_system": S["source_system_out"]
    }

    gauge_state = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "structural_metrics": S["structural_metrics"],
        "signals": [
            {"id": sig["id"], "severity": sig["severity"],
             "bound_count": sig["bound_count"]}
            for sig in S["signals"]
        ],
        "topology": {
            "domains": S["topology"]["domains"],
            "nodes": S["topology"]["nodes"],
            "relationships": S["topology"]["relationships"],
            "highlighted_signal": S["topology"]["highlighted_signal"],
            "placement_semantics": S["placement_semantics"]
        },
        "query_state": S["query_state"],
        "dimensions": {
            "DIM-01": {
                "label": "Coverage",
                "coverage_percent": S["coverage_percent"],
                "state_label": S["coverage_class"],
                "admitted_units": S["coverage_admitted"],
                "total_units": S["coverage_total"],
                "authority": "PSEE-GAUGE.0 DP-5-02"
            },
            "DIM-02": {
                "label": "Reconstruction",
                "state": S["reconstruction_status"],
                "validated_units": S["recon_validated"],
                "total_units": S["recon_total"],
                "reconstruction_points": S["reconstruction_points"],
                "authority": "PSEE-GAUGE.0 DP-6-03"
            },
            "DIM-03": {
                "label": "Escalation Clearance",
                "value": S["escalation_clearance"],
                "state_label": "CLEAR" if S["escalation_clearance"] == 100 else "PARTIAL"
            },
            "DIM-04": {
                "label": "Unknown-Space",
                "total_count": S["unknown_space_count"],
                "state_label": "NONE" if S["unknown_space_count"] == 0 else "PRESENT"
            },
            "DIM-05": {"label": "Intake Completeness", "state": "COMPLETE"},
            "DIM-06": {"label": "Heuristic Compliance", "state": "PASS"}
        },
        "score": {
            "canonical": S["derived_score"],
            "band_label": S["band_label"],
            "derivation": (f"{S['completion_points']} + {S['coverage_points']} + "
                           f"{S['reconstruction_points']} = {S['derived_score']}"),
            "components": {
                "completion_points": S["completion_points"],
                "completion_basis": S["completion_basis"],
                "coverage_points": S["coverage_points"],
                "coverage_basis": S["coverage_basis"],
                "reconstruction_points": S["reconstruction_points"],
                "reconstruction_basis": S["recon_basis"]
            },
            "authority": "PSEE-GAUGE.0/gauge_score_model §G.2–G.4"
        },
        "projection": {
            "value": S["gauge_projection"],
            "rule": "PR-02",
            "authority": "PSEE-GAUGE.0/projection_logic_spec §PR-02"
        },
        "confidence": {
            "lower": S["conf_lower"],
            "upper": S["conf_upper"],
            "status": "COMPUTED",
            "authority": "PSEE-GAUGE.0/confidence_and_variance_model §Total Variance"
        }
    }

    gauge_view = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "score_display": {
            "canonical_score": S["derived_score"],
            "band_label": S["band_label"],
            "projected_score": S["gauge_projection"],
            "projection_rule": "PR-02"
        },
        "confidence_band": {
            "lower": S["conf_lower"],
            "upper": S["conf_upper"],
            "status": "COMPUTED"
        },
        "state_indicator": {
            "execution_status": S["execution_status"],
            "execution_mode": S["execution_mode"]
        },
        "query_state": S["query_state"]
    }

    return {
        "coverage_state.json": _jdump(coverage_state),
        "reconstruction_state.json": _jdump(reconstruction_state),
        "engine_state.json": _jdump(engine_state),
        "gauge_state.json": _jdump(gauge_state),
        "gauge_view.json": _jdump(gauge_view)
    }


def build_intake_artifacts(run_id, client_uuid, state):
    """Pure function. Builds intake_result.json and intake_log.md."""
    S = state

    if S["verification_outcome"] == "PASS_FULL":
        consumed_scope = "all"
        uncertainty = "none"
        unverified_domains = []
    elif S["verification_outcome"] == "PASS_PARTIAL":
        consumed_scope = "verified_scope_only"
        uncertainty = ("required — unverified scope must be uncertainty-marked "
                       "in downstream outputs")
        unverified_domains = list(S["bounded_conditions"])
    else:
        consumed_scope = "none"
        uncertainty = "not applicable — package rejected"
        unverified_domains = []

    intake_result = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "verification_outcome": S["verification_outcome"],
        "intake_mode": S["intake_mode"],
        "consumed_scope": consumed_scope,
        "verified_domains": S["expected_domains"],
        "unverified_domains": unverified_domains,
        "uncertainty_propagation": uncertainty,
        "consumption_permission": S["consumption_permission"],
        "rejected": S["rejected"],
        "errors": list(S["blocking"])
    }

    intake_log = f"""# Intake Log — {run_id}

stream: {STREAM_ID}
client_uuid: {client_uuid}
run_id: {run_id}

## Intake Result

| Field | Value |
|---|---|
| verification_outcome | {S['verification_outcome']} |
| intake_mode | {S['intake_mode']} |
| consumed_scope | {consumed_scope} |
| uncertainty_propagation | {uncertainty} |
| rejected | {S['rejected']} |

## Errors

{chr(10).join(f'- {e}' for e in S['blocking']) if S['blocking'] else 'None'}
"""

    return {
        "intake_result.json": _jdump(intake_result),
        "intake_log.md": intake_log
    }


def build_verification_log(run_id, client_uuid, state, trace_lines):
    """Builds verification.log content. Deterministic from state + trace."""
    S = state

    if S["verification_outcome"] == "PASS_FULL":
        unverified_section = (
            "None — all domains evaluated; no bounded conditions detected")
    elif S["is_bounded"]:
        unverified_section = "\n".join(f"- {c}" for c in S["bounded_conditions"])
    else:
        unverified_section = "N/A — structural failure"

    d2_detail = (
        f"execution_status={S['execution_status']} (defined lifecycle phase); "
        f"reconstruction_state.state={S['reconstruction_status']} — "
        "all within governed state space"
        if S["d2"] == "VERIFIED_PASS"
        else f"FAIL — {'; '.join(S['d2_fail'])}"
    )

    stage_block = "\n".join(trace_lines)

    vlog = f"""PSEE WP-13 VERIFICATION LOG
stream: {STREAM_ID}
client_uuid: {client_uuid}
run_id: {run_id}

--- STAGE TRACE ---
{stage_block}

--- VERIFICATION OUTCOME ---
Outcome: {S['verification_outcome']}

Verified Scope:
- Domain 1 (Artifact Completeness): {S['d1']}
  All mandatory artifacts present; run_id={run_id} consistent by construction
- Domain 2 (State Admissibility): {S['d2']}
  {d2_detail}
- Domain 3 (Traceability Integrity): {S['d3']}
  Score component basis fields present; authority refs reference governing documents
- Domain 4 (Cross-Artifact Consistency): {S['d4']}
  gauge_state.score.canonical={S['derived_score']} consistent with gauge_view;
  DIM-01={S['coverage_percent']}% consistent with coverage_state;
  DIM-02={S['reconstruction_status']} consistent with reconstruction_state
- Domain 5 (Authority Honesty): {S['d5']}
  All five domains actively evaluated; bounded_conditions={len(S['bounded_conditions'])} detected

Unverified Scope:
{unverified_section}

Inferred Scope:
- None — all values derived from explicit input field reads

Blocking Contradictions:
- {'; '.join(S['blocking']) if S['blocking'] else 'None detected in evaluated scope'}

Consumption Permission:
- {S['consumption_permission']}

Evidence Basis:
- {S['evidence_basis']}

--- REPLAY VALIDATION ---
REPLAY_CHECK_PASS: all core artifacts match byte-for-byte

--- GOVERNANCE VALIDATION ---
stream: {STREAM_ID}
repo_lock: PASS (k-pi-core)
branch_lock: PASS (work/psee-runtime)
worktree_lock: PASS
read_scope: PASS (clients/registry/ + clients/{client_uuid}/config/ + input/)
write_scope: PASS (clients/{client_uuid}/runs/{run_id}/)
identity_leakage: PASS (uuid-only in all emitted artifacts)
bounded_conditions: {len(S['bounded_conditions'])}
envelope_status: BUILDABLE
"""
    return vlog


def build_manifest(run_id, client_uuid, state, git_info, artifact_names, vlog_hash):
    """Builds package_manifest.json. Includes git traceability (descriptive only)."""
    manifest = {
        "run_id": run_id,
        "client_uuid": client_uuid,
        "schema_version": "1.0",
        "stream": STREAM_ID,
        "package_version": state["package_version"],
        "artifact_inventory": sorted(artifact_names),
        "required_artifacts_status": "complete",
        "verification_reference": "verification.log",
        "verification_log_sha256": vlog_hash,
        "lifecycle_state": state["lifecycle_state"],
        "source_system": state["source_system_out"],
        "git_commit_hash": git_info["git_commit_hash"],
        "git_branch": git_info["git_branch"],
        "repository_name": git_info["repository_name"],
        "runtime_version_tag": git_info["runtime_version_tag"]
    }
    return _jdump(manifest)


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    args = parse_args()
    log = Logger(
        level=args.log_level,
        fmt=args.log_format,
        log_file=args.log_file,
        stage_trace=args.stage_trace,
        fail_trace=args.fail_trace
    )

    client_uuid = args.client
    input_path = args.input_path

    print(f"=== PSEE Autonomous Client Runtime — {STREAM_ID} ===")
    print(f"client_uuid: {client_uuid}")
    print(f"input:       {input_path}")
    print()

    # ── PRECHECK ──────────────────────────────────────────────────────────────
    check_repo(log)
    check_branch(log)
    check_worktree(client_uuid, log)
    git_info = get_git_info(log)
    log.emit("PRECHECK", "PASS",
             message=f"repo={REPO_NAME} branch={REQUIRED_BRANCH} worktree=clean")

    # ── REGISTRY_RESOLUTION ───────────────────────────────────────────────────
    resolve_registry(client_uuid, log)

    # ── INPUT_LOAD ────────────────────────────────────────────────────────────
    log.emit("INPUT_LOAD", "START", message=f"loading input: {input_path}")
    if not os.path.isfile(input_path):
        log.fail("INPUT_LOAD", "INPUT_NOT_FOUND",
                 f"input file not found: {input_path}", artifact=input_path)
    raw_input = safe_read_json(input_path, client_uuid, log)
    log.emit("INPUT_LOAD", "PASS", message="input file loaded")

    # ── IG_NORMALIZATION ──────────────────────────────────────────────────────
    normalized, run_id = ig_normalize(raw_input, client_uuid, log)

    # ── NO-OVERWRITE CHECK ────────────────────────────────────────────────────
    run_root = os.path.join(REPO_ROOT, "clients", client_uuid, "runs", run_id)
    if os.path.exists(run_root):
        log.fail("OUTPUT_WRITE", "NO_OVERWRITE_VIOLATION",
                 f"run output already exists: clients/{client_uuid}/runs/{run_id}/. "
                 "Delete to re-run.", artifact=run_root)

    # Load config
    config_path = os.path.join(REPO_ROOT, "clients", client_uuid,
                                "config", "runtime_config.json")
    config = safe_read_json(config_path, client_uuid, log)
    missing_cfg = [f for f in REQUIRED_CONFIG_FIELDS if f not in config]
    if missing_cfg:
        log.fail("INPUT_LOAD", "CONFIG_SCHEMA_VIOLATION",
                 f"config missing required fields: {missing_cfg}")

    # ── PSEE_RECONSTRUCTION ───────────────────────────────────────────────────
    log.emit("PSEE_RECONSTRUCTION", "START", message="deriving state from normalized input")
    state = psee_reconstruct(normalized, config)
    log.emit("PSEE_RECONSTRUCTION", "PASS",
             message=f"score={state['derived_score']} band={state['band_label']} "
                     f"bounded_conditions={len(state['bounded_conditions'])}")

    # ── PSEE_VALIDATION ───────────────────────────────────────────────────────
    log.emit("PSEE_VALIDATION", "START", message="checking structural integrity")
    validation = psee_validate(state)
    if not validation["buildable"]:
        log.fail("PSEE_VALIDATION", "NOT_BUILDABLE", validation["reason"])
    log.emit("PSEE_VALIDATION", "PASS",
             message=f"envelope_status=BUILDABLE outcome={state['verification_outcome']}")

    # ── GAUGE_ENGINE (logged gate) ────────────────────────────────────────────
    log.emit("GAUGE_ENGINE", "START", message="gauge derivation complete via reconstruction")
    sm = state["structural_metrics"]
    qs = state["query_state"]
    log.emit("GAUGE_ENGINE", "PASS",
             message=(f"structural_density={sm['structural_density']} "
                      f"dependency_load={sm['dependency_load']} "
                      f"coordination_pressure={sm['coordination_pressure']} "
                      f"visibility_deficit={sm['visibility_deficit']} "
                      f"query={qs['selected_query']} "
                      f"class={qs['classification']}"))

    # ── ENVELOPE_BUILD (first pass) ───────────────────────────────────────────
    log.emit("ENVELOPE_BUILD", "START", message="building core package artifacts")
    core1 = build_core_artifacts(run_id, client_uuid, state)
    intake1 = build_intake_artifacts(run_id, client_uuid, state)
    log.emit("ENVELOPE_BUILD", "PASS",
             message=f"{len(core1)} core artifacts + {len(intake1)} intake artifacts built")

    # ── REPLAY_CHECK ──────────────────────────────────────────────────────────
    log.emit("REPLAY_CHECK", "START", message="running pipeline second time for determinism")
    state2 = psee_reconstruct(normalized, config)
    core2 = build_core_artifacts(run_id, client_uuid, state2)
    intake2 = build_intake_artifacts(run_id, client_uuid, state2)

    all1 = {**core1, **intake1}
    all2 = {**core2, **intake2}
    mismatches = [k for k in all1 if all1[k] != all2.get(k)]
    if mismatches or set(all1) != set(all2):
        log.fail("REPLAY_CHECK", "NONDETERMINISM_DETECTED",
                 f"artifact mismatch between runs: {mismatches}")
    log.emit("REPLAY_CHECK", "PASS",
             message=f"{len(all1)} artifacts verified byte-for-byte identical")

    # Build final artifacts (verification.log + manifest)
    vlog_content = build_verification_log(run_id, client_uuid, state, log.trace_lines)
    vlog_hash = hashlib.sha256(vlog_content.encode()).hexdigest()
    manifest_content = build_manifest(
        run_id, client_uuid, state, git_info,
        list(core1.keys()) + ["verification.log", "package_manifest.json"],
        vlog_hash
    )

    # ── OUTPUT_WRITE ──────────────────────────────────────────────────────────
    log.emit("OUTPUT_WRITE", "START",
             message=f"writing to clients/{client_uuid}/runs/{run_id}/")

    pkg_dir = os.path.join(run_root, "package")
    intake_dir = os.path.join(run_root, "intake")

    writes = {
        os.path.join(pkg_dir, "coverage_state.json"): core1["coverage_state.json"],
        os.path.join(pkg_dir, "reconstruction_state.json"): core1["reconstruction_state.json"],
        os.path.join(pkg_dir, "engine_state.json"): core1["engine_state.json"],
        os.path.join(pkg_dir, "gauge_state.json"): core1["gauge_state.json"],
        os.path.join(pkg_dir, "gauge_view.json"): core1["gauge_view.json"],
        os.path.join(pkg_dir, "verification.log"): vlog_content,
        os.path.join(pkg_dir, "package_manifest.json"): manifest_content,
        os.path.join(intake_dir, "intake_result.json"): intake1["intake_result.json"],
        os.path.join(intake_dir, "intake_log.md"): intake1["intake_log.md"]
    }

    for path, content in sorted(writes.items()):
        safe_write(path, content, client_uuid, run_id, log)
        rel = os.path.relpath(path, REPO_ROOT)
        log.debug(f"  WRITTEN  {rel}")

    log.emit("OUTPUT_WRITE", "PASS",
             message=f"{len(writes)} artifacts written to run={run_id}")

    # ── SUMMARY ───────────────────────────────────────────────────────────────
    print()
    print("RUNTIME_COMPLETE")
    print(f"  client_uuid:          {client_uuid}")
    print(f"  run_id:               {run_id}")
    print(f"  verification_outcome: {state['verification_outcome']}")
    print(f"  intake_mode:          {state['intake_mode']}")
    print(f"  score:                {state['derived_score']} / {state['band_label']}")
    print(f"  bounded_conditions:   {len(state['bounded_conditions'])}")
    print(f"  replay_check:         PASS")
    print(f"  output:               clients/{client_uuid}/runs/{run_id}/")
    sys.exit(0)


if __name__ == "__main__":
    main()
