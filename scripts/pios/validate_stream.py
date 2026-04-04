#!/usr/bin/env python3
"""
validate_stream.py — Krayu Stream Validation Framework
EX.0 hardening: external profile loading, fail-safe discovery, correct payload paths.

Usage:
    python scripts/pios/validate_stream.py --family EX --profile debug_trace [--input payload.json]
    python scripts/pios/validate_stream.py --list-families
    python scripts/pios/validate_stream.py --list-profiles EX
    python scripts/pios/validate_stream.py --discover EX debug_trace

Fail-safe behavior:
    Unknown family  → FAIL_SAFE_STOP (not a Python exception)
    Unknown profile → FAIL_SAFE_STOP (not a Python exception)
    No JSON input   → FAIL_SAFE_STOP (not a Python exception)

Profile sources (in priority order):
    1. docs/governance/families/<FAMILY>.json (external, extensible)
    2. BUILTIN_PROFILES below (fallback defaults)
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Repo root resolution
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[2]
FAMILIES_DIR = REPO_ROOT / "docs" / "governance" / "families"
FAMILY_REGISTRY_PATH = REPO_ROOT / "docs" / "governance" / "FAMILY_REGISTRY.md"

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------


@dataclass
class CheckResult:
    question_id: str
    status: str
    detail: str


# ---------------------------------------------------------------------------
# Payload helpers
# ---------------------------------------------------------------------------


def deep_get(data: Dict[str, Any], path: str) -> Any:
    current: Any = data
    for part in path.split("."):
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return None
    return current


def is_non_empty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, (list, dict, tuple, set)):
        return len(value) > 0
    return True


def validate_enum(value: Any, allowed: List[str]) -> bool:
    return isinstance(value, str) and value in allowed


# ---------------------------------------------------------------------------
# Builtin profiles — correct payload paths, verified against real adapter outputs
# EX/debug_trace paths verified against EX.2 production run (run_id: EX3_live_*)
# ---------------------------------------------------------------------------

BUILTIN_PROFILES: Dict[Tuple[str, str], Dict[str, Any]] = {
    # EX family
    ("EX", "debug_trace"): {
        "required_paths": [
            ("Q1",  "signals",                  "CE.4 signals dict present"),
            ("Q2",  "signal_summary",            "CE.4 signal summary present"),
            ("Q3",  "ce5_consumption_records",   "CE.5 consumption records present"),
            ("Q4",  "ce5_traceability_records",  "CE.5 traceability records present"),
            ("Q5",  "trace_chains",              "signal→condition→diagnosis chains present"),
            ("Q6",  "conditions",               "CE.2 condition states present"),
            ("Q7",  "diagnoses",                "CE.2 diagnosis states present"),
            ("Q8",  "debug_run_id",             "run ID present"),
            ("Q9",  "telemetry_source",         "telemetry source declared"),
            ("Q10", "condition_summary",         "condition summary present"),
        ],
        "enum_paths": [
            ("Q9", "telemetry_source", ["STATIC_BASELINE", "LIVE_TELEMETRY"]),
        ],
    },
    ("EX", "bridge_binding"): {
        "required_paths": [
            ("Q1", "run_id",          "run ID present"),
            ("Q2", "telemetry_source", "telemetry source declared"),
            ("Q3", "signals",         "signals present"),
            ("Q4", "conditions",      "conditions present"),
        ],
        "enum_paths": [
            ("Q2", "telemetry_source", ["STATIC_BASELINE", "LIVE_TELEMETRY"]),
        ],
    },
    ("EX", "runtime_bridge"): {
        "required_paths": [
            ("Q1", "run_id",          "run ID present"),
            ("Q2", "telemetry_source", "telemetry source declared"),
            ("Q3", "stream",          "stream ID declared"),
            ("Q4", "signals",         "signals present"),
            ("Q5", "conditions",      "conditions present"),
            ("Q6", "diagnoses",       "diagnoses present"),
        ],
        "enum_paths": [
            ("Q2", "telemetry_source", ["STATIC_BASELINE", "LIVE_TELEMETRY"]),
        ],
    },
    # 40 family
    ("40", "signal_contract"): {
        "required_paths": [
            ("Q1", "run_id",   "run id present"),
            ("Q2", "signals",  "signals dict present"),
            ("Q3", "summary",  "signal summary present"),
        ],
        "enum_paths": [],
    },
    ("40", "condition_contract"): {
        "required_paths": [
            ("Q1", "run_id",           "run id present"),
            ("Q2", "conditions",       "conditions dict present"),
            ("Q3", "diagnoses",        "diagnoses dict present"),
            ("Q4", "condition_summary", "condition summary present"),
        ],
        "enum_paths": [],
    },
    # 42 family
    ("42", "narrative_rendering"): {
        "required_paths": [
            ("Q1", "query_id",      "query id present"),
            ("Q2", "narrative",     "narrative present"),
            ("Q3", "evidence_chain", "evidence chain present"),
            ("Q4", "state",         "render state present"),
        ],
        "enum_paths": [
            ("Q4", "state", ["READY", "PARTIAL", "BLOCKED"]),
        ],
    },
    ("42", "topology_surface"): {
        "required_paths": [
            ("Q1", "nodes",                          "topology nodes present"),
            ("Q2", "pios_summary",                   "pios_summary present"),
            ("Q3", "pios_summary.run_id",            "run_id in pios_summary present"),
            ("Q4", "pios_summary.condition_tiers",   "condition tiers present"),
            ("Q5", "pios_summary.diagnosis_states",  "diagnosis states present"),
        ],
        "enum_paths": [],
    },
    # WEB family
    ("WEB", "mirror_publish"): {
        "required_paths": [
            ("Q1", "route",           "route present"),
            ("Q2", "canonical_target", "canonical target present"),
            ("Q3", "crawl_state",     "crawl state present"),
            ("Q4", "publish_state",   "publish state present"),
        ],
        "enum_paths": [
            ("Q3", "crawl_state",   ["VALID", "DEGRADED", "BLOCKED"]),
            ("Q4", "publish_state", ["READY", "PARTIAL", "BLOCKED"]),
        ],
    },
    # GOV family
    ("GOV", "canonical_integrity"): {
        "required_paths": [
            ("Q1", "registry_entry", "registry entry present"),
            ("Q2", "source_state",   "source state present"),
            ("Q3", "authority_state", "authority state present"),
        ],
        "enum_paths": [
            ("Q2", "source_state",   ["CANONICAL", "DERIVATIVE", "INVALID"]),
            ("Q3", "authority_state", ["LOCKED", "PARTIAL", "UNRESOLVED"]),
        ],
    },
}


# ---------------------------------------------------------------------------
# Profile loading — external files override builtins
# ---------------------------------------------------------------------------


def load_external_profiles(family: str) -> Optional[Dict[str, Any]]:
    """Load profiles from docs/governance/families/<FAMILY>.json if it exists."""
    profile_file = FAMILIES_DIR / f"{family}.json"
    if not profile_file.exists():
        return None
    try:
        data = json.loads(profile_file.read_text(encoding="utf-8"))
        return data.get("profiles", {})
    except Exception as exc:
        print(f"WARN: could not load external profiles from {profile_file}: {exc}", file=sys.stderr)
        return None


def get_registered_families() -> List[str]:
    """Return families that have external JSON profile files."""
    if not FAMILIES_DIR.exists():
        return []
    return sorted(p.stem for p in FAMILIES_DIR.glob("*.json"))


def get_all_families() -> List[str]:
    """Builtin families plus any external families."""
    builtin = sorted({k[0] for k in BUILTIN_PROFILES})
    external = get_registered_families()
    return sorted(set(builtin) | set(external))


def get_profiles_for_family(family: str) -> Dict[str, Any]:
    """Return all profiles for a family, merging external over builtins."""
    builtin = {
        profile: config
        for (fam, profile), config in BUILTIN_PROFILES.items()
        if fam == family
    }
    external = load_external_profiles(family) or {}
    # External profiles override builtins of the same name
    merged = {**builtin, **external}
    return merged


def resolve_profile(family: str, profile: str) -> Optional[Dict[str, Any]]:
    """Return the profile config, or None if not found."""
    profiles = get_profiles_for_family(family)
    return profiles.get(profile)


# ---------------------------------------------------------------------------
# Fail-safe output
# ---------------------------------------------------------------------------


def fail_safe_stop(reason: str, family: str = "", profile: str = "") -> int:
    """Emit a governed FAIL_SAFE_STOP message and exit 2 (distinct from validation failure)."""
    print("FAIL_SAFE_STOP")
    print("")
    print(f"Reason: {reason}")
    if family:
        print(f"Family: {family}")
    if profile:
        print(f"Profile: {profile}")
    print("")
    print("Compressed execution is blocked until the above is resolved.")
    print("Invoke FAMILY_DISCOVERY or VALIDATION_DISCOVERY as appropriate.")
    print("")
    known = get_all_families()
    if known:
        print(f"Known families: {', '.join(known)}")
    if family and family in known:
        available = list(get_profiles_for_family(family).keys())
        if available:
            print(f"Available profiles for {family}: {', '.join(sorted(available))}")
        else:
            print(f"No profiles registered for family {family}.")
    return 2


# ---------------------------------------------------------------------------
# Validation execution
# ---------------------------------------------------------------------------


def run_profile(payload: Dict[str, Any], config: Dict[str, Any]) -> List[CheckResult]:
    results: List[CheckResult] = []

    for qid, path, desc in config.get("required_paths", []):
        value = deep_get(payload, path)
        ok = is_non_empty(value)
        results.append(CheckResult(
            question_id=qid,
            status="PASS" if ok else "FAIL",
            detail=f"{desc}; path={path}; value={'present' if ok else 'MISSING'}",
        ))

    for qid, path, allowed in config.get("enum_paths", []):
        value = deep_get(payload, path)
        ok = validate_enum(value, allowed)
        results.append(CheckResult(
            question_id=qid,
            status="PASS" if ok else "FAIL",
            detail=f"enum check; path={path}; value={value!r}; allowed={allowed}",
        ))

    return results


def print_results(results: List[CheckResult], family: str, profile: str) -> int:
    print(f"VALIDATION PROFILE: {family}/{profile}")
    print("")
    print("| Check | Status | Detail |")
    print("|-------|--------|--------|")
    failures = 0
    for r in results:
        print(f"| {r.question_id} | {r.status} | {r.detail} |")
        if r.status != "PASS":
            failures += 1
    print("")
    print(f"SUMMARY: {'PASS' if failures == 0 else 'FAIL'}")
    print(f"FAILURES: {failures}")
    return 0 if failures == 0 else 1


# ---------------------------------------------------------------------------
# Discovery modes
# ---------------------------------------------------------------------------


def list_families() -> int:
    families = get_all_families()
    print("REGISTERED FAMILIES")
    print("")
    for f in families:
        profiles = list(get_profiles_for_family(f).keys())
        print(f"  {f}  ({len(profiles)} profiles: {', '.join(sorted(profiles))})")
    return 0


def list_profiles(family: str) -> int:
    profiles = get_profiles_for_family(family)
    if not profiles:
        return fail_safe_stop(
            f"No profiles found for family '{family}'. Register profiles in "
            f"docs/governance/families/{family}.json or add to BUILTIN_PROFILES.",
            family=family,
        )
    print(f"PROFILES FOR FAMILY: {family}")
    print("")
    for name, config in sorted(profiles.items()):
        q_count = len(config.get("required_paths", [])) + len(config.get("enum_paths", []))
        print(f"  {name}  ({q_count} checks)")
    return 0


def discover_profile(family: str, profile: str) -> int:
    """VALIDATION_DISCOVERY mode — report what is known and what is missing."""
    all_families = get_all_families()
    print("VALIDATION_DISCOVERY")
    print("")
    print(f"Family:  {family}")
    print(f"Profile: {profile}")
    print("")

    if family not in all_families:
        print(f"STATUS: UNKNOWN FAMILY")
        print(f"  '{family}' is not registered in the governance framework.")
        print(f"  Action: run FAMILY_DISCOVERY to assess registration candidacy.")
        return 2

    available = get_profiles_for_family(family)
    if profile not in available:
        print(f"STATUS: MISSING PROFILE")
        print(f"  Family '{family}' is registered but has no profile '{profile}'.")
        print(f"  Available profiles: {', '.join(sorted(available.keys())) or 'none'}")
        print(f"  Action: define profile in docs/governance/families/{family}.json")
        return 2

    config = available[profile]
    print(f"STATUS: PROFILE FOUND")
    q_paths = config.get("required_paths", [])
    e_paths = config.get("enum_paths", [])
    print(f"  Required path checks: {len(q_paths)}")
    for qid, path, desc in q_paths:
        print(f"    {qid}: {path} — {desc}")
    if e_paths:
        print(f"  Enum checks: {len(e_paths)}")
        for qid, path, allowed in e_paths:
            print(f"    {qid}: {path} ∈ {allowed}")
    return 0


# ---------------------------------------------------------------------------
# Payload loading
# ---------------------------------------------------------------------------


def load_payload(input_path: Optional[str]) -> Optional[Dict[str, Any]]:
    try:
        if input_path:
            return json.loads(Path(input_path).read_text(encoding="utf-8"))
        raw = sys.stdin.read()
        if not raw.strip():
            return None
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"FAIL_SAFE_STOP\nReason: JSON parse error — {exc}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Argument parsing and dispatch
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Krayu stream validation framework. Unknown family/profile → FAIL_SAFE_STOP."
    )
    parser.add_argument("--family", help="Stream family (e.g. EX, 40, 42, WEB, GOV)")
    parser.add_argument("--profile", help="Validation profile within family")
    parser.add_argument("--input", help="Path to JSON payload file (default: stdin)")
    parser.add_argument("--list-families", action="store_true", help="List all known families and profiles")
    parser.add_argument("--list-profiles", metavar="FAMILY", help="List profiles for a family")
    parser.add_argument("--discover", nargs=2, metavar=("FAMILY", "PROFILE"),
                        help="VALIDATION_DISCOVERY mode: assess coverage for family/profile")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    # Discovery modes — no payload required
    if args.list_families:
        return list_families()

    if args.list_profiles:
        return list_profiles(args.list_profiles)

    if args.discover:
        return discover_profile(args.discover[0], args.discover[1])

    # Validation mode — family and profile required
    if not args.family:
        print("FAIL_SAFE_STOP\nReason: --family is required for validation mode.", file=sys.stderr)
        return 2

    if not args.profile:
        print("FAIL_SAFE_STOP\nReason: --profile is required for validation mode.", file=sys.stderr)
        return 2

    family = args.family.upper()
    profile = args.profile

    # Family resolution check
    all_families = get_all_families()
    if family not in all_families:
        return fail_safe_stop(
            f"Family '{family}' is not registered. Cannot proceed with compressed execution.",
            family=family,
            profile=profile,
        )

    # Profile resolution check
    config = resolve_profile(family, profile)
    if config is None:
        return fail_safe_stop(
            f"Profile '{profile}' not found for family '{family}'. Validation coverage is missing.",
            family=family,
            profile=profile,
        )

    # Load payload
    payload = load_payload(args.input)
    if payload is None:
        return fail_safe_stop(
            "No valid JSON payload provided (stdin empty or --input missing/invalid).",
            family=family,
            profile=profile,
        )

    # Run validation
    results = run_profile(payload, config)
    return print_results(results, family, profile)


if __name__ == "__main__":
    raise SystemExit(main())
