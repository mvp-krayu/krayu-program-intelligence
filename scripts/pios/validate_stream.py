#!/usr/bin/env python3
"""
validate_stream.py — Krayu Stream Validation Framework
EX.0 hardening + EX.0-EXT: PROFILE_EXTENSION mode.

Usage:
    python scripts/pios/validate_stream.py --family EX --profile debug_trace [--input payload.json]
    python scripts/pios/validate_stream.py --list-families
    python scripts/pios/validate_stream.py --list-profiles EX
    python scripts/pios/validate_stream.py --discover EX debug_trace
    python scripts/pios/validate_stream.py --suggest-extension --family EX --profile debug_trace [--input payload.json]

Fail-safe behavior:
    Unknown family       → FAIL_SAFE_STOP exit 2
    Unknown profile      → FAIL_SAFE_STOP exit 2 — "Validation coverage missing — profile extension required"
    No JSON input        → FAIL_SAFE_STOP exit 2
    Validation FAIL      → exit 1, with --suggest-extension hint if paths are missing

PROFILE_EXTENSION mode (--suggest-extension):
    Reads the payload, compares against current profile, generates a PROFILE_EXTENSION REPORT,
    and writes a PROPOSED entry to docs/governance/families/<FAMILY>.json.
    Proposed extensions are NOT applied to the live profile until explicitly accepted.

Profile sources (in priority order):
    1. docs/governance/families/<FAMILY>.json (external, extensible)
    2. BUILTIN_PROFILES below (fallback defaults)
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import date
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


def flatten_paths(data: Any, prefix: str = "", max_depth: int = 3) -> List[str]:
    """Recursively flatten a JSON payload to dot-notation paths (up to max_depth)."""
    paths: List[str] = []
    if isinstance(data, dict) and max_depth > 0:
        for key in data:
            full = f"{prefix}.{key}" if prefix else key
            paths.append(full)
            paths.extend(flatten_paths(data[key], full, max_depth - 1))
    elif isinstance(data, list) and max_depth > 0 and data:
        # Sample first element only
        paths.extend(flatten_paths(data[0], prefix, max_depth - 1))
    return paths


# ---------------------------------------------------------------------------
# Builtin profiles — correct payload paths verified against real adapter outputs
# EX/debug_trace verified against EX.2 production run (run_id: EX3_live_*)
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
            ("Q1", "run_id",           "run ID present"),
            ("Q2", "telemetry_source", "telemetry source declared"),
            ("Q3", "signals",          "signals present"),
            ("Q4", "conditions",       "conditions present"),
        ],
        "enum_paths": [
            ("Q2", "telemetry_source", ["STATIC_BASELINE", "LIVE_TELEMETRY"]),
        ],
    },
    ("EX", "runtime_bridge"): {
        "required_paths": [
            ("Q1", "run_id",           "run ID present"),
            ("Q2", "telemetry_source", "telemetry source declared"),
            ("Q3", "stream",           "stream ID declared"),
            ("Q4", "signals",          "signals present"),
            ("Q5", "conditions",       "conditions present"),
            ("Q6", "diagnoses",        "diagnoses present"),
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
            ("Q1", "run_id",            "run id present"),
            ("Q2", "conditions",        "conditions dict present"),
            ("Q3", "diagnoses",         "diagnoses dict present"),
            ("Q4", "condition_summary", "condition summary present"),
        ],
        "enum_paths": [],
    },
    ("40", "diagnosis_contract"): {
        "required_paths": [
            ("Q1", "run_id",            "run id present"),
            ("Q2", "diagnoses",         "diagnoses present"),
            ("Q3", "diagnosis_summary", "diagnosis summary present"),
        ],
        "enum_paths": [],
    },
    # 42 family
    ("42", "narrative_rendering"): {
        "required_paths": [
            ("Q1", "query_id",       "query id present"),
            ("Q2", "narrative",      "narrative present"),
            ("Q3", "evidence_chain", "evidence chain present"),
            ("Q4", "state",          "render state present"),
        ],
        "enum_paths": [
            ("Q4", "state", ["READY", "PARTIAL", "BLOCKED"]),
        ],
    },
    ("42", "topology_surface"): {
        "required_paths": [
            ("Q1", "nodes",                         "topology nodes present"),
            ("Q2", "pios_summary",                  "pios_summary present"),
            ("Q3", "pios_summary.run_id",           "run_id in pios_summary present"),
            ("Q4", "pios_summary.condition_tiers",  "condition tiers present"),
            ("Q5", "pios_summary.diagnosis_states", "diagnosis states present"),
        ],
        "enum_paths": [],
    },
    # WEB family
    ("WEB", "mirror_publish"): {
        "required_paths": [
            ("Q1", "route",            "route present"),
            ("Q2", "canonical_target", "canonical target present"),
            ("Q3", "crawl_state",      "crawl state present"),
            ("Q4", "publish_state",    "publish state present"),
        ],
        "enum_paths": [
            ("Q3", "crawl_state",   ["VALID", "DEGRADED", "BLOCKED"]),
            ("Q4", "publish_state", ["READY", "PARTIAL", "BLOCKED"]),
        ],
    },
    # GOV family
    ("GOV", "canonical_integrity"): {
        "required_paths": [
            ("Q1", "registry_entry",  "registry entry present"),
            ("Q2", "source_state",    "source state present"),
            ("Q3", "authority_state", "authority state present"),
        ],
        "enum_paths": [
            ("Q2", "source_state",    ["CANONICAL", "DERIVATIVE", "INVALID"]),
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
    if not FAMILIES_DIR.exists():
        return []
    return sorted(p.stem for p in FAMILIES_DIR.glob("*.json"))


def get_all_families() -> List[str]:
    builtin = sorted({k[0] for k in BUILTIN_PROFILES})
    external = get_registered_families()
    return sorted(set(builtin) | set(external))


def get_profiles_for_family(family: str) -> Dict[str, Any]:
    builtin = {
        profile: config
        for (fam, profile), config in BUILTIN_PROFILES.items()
        if fam == family
    }
    external = load_external_profiles(family) or {}
    return {**builtin, **external}


def resolve_profile(family: str, profile: str) -> Optional[Dict[str, Any]]:
    return get_profiles_for_family(family).get(profile)


# ---------------------------------------------------------------------------
# Fail-safe output
# ---------------------------------------------------------------------------


def fail_safe_stop(reason: str, family: str = "", profile: str = "",
                   extension_hint: bool = False) -> int:
    """Governed FAIL_SAFE_STOP. Exit 2 (distinct from validation FAIL exit 1)."""
    print("FAIL_SAFE_STOP")
    print("")
    print(f"Reason: {reason}")
    if family:
        print(f"Family: {family}")
    if profile:
        print(f"Profile: {profile}")
    print("")
    if extension_hint:
        print("Validation coverage missing — profile extension required")
        print(f"  Run: python scripts/pios/validate_stream.py --suggest-extension "
              f"--family {family} --profile {profile} [--input <payload.json>]")
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


def print_results(results: List[CheckResult], family: str, profile: str,
                  suggest_hint: bool = True) -> int:
    print(f"VALIDATION PROFILE: {family}/{profile}")
    print("")
    print("| Check | Status | Detail |")
    print("|-------|--------|--------|")
    failures = 0
    missing_paths = []
    for r in results:
        print(f"| {r.question_id} | {r.status} | {r.detail} |")
        if r.status != "PASS":
            failures += 1
            if "MISSING" in r.detail:
                # Extract path from detail string
                for part in r.detail.split(";"):
                    if "path=" in part:
                        missing_paths.append(part.strip().replace("path=", ""))
    print("")
    print(f"SUMMARY: {'PASS' if failures == 0 else 'FAIL'}")
    print(f"FAILURES: {failures}")

    if failures > 0 and missing_paths and suggest_hint:
        print("")
        print("PROFILE_EXTENSION HINT:")
        print(f"  {len(missing_paths)} path(s) missing from payload.")
        print(f"  Run --suggest-extension to generate a governed PROFILE_EXTENSION REPORT.")

    return 0 if failures == 0 else 1


# ---------------------------------------------------------------------------
# PROFILE_EXTENSION mode
# ---------------------------------------------------------------------------


def suggest_extension(family: str, profile: str, payload: Dict[str, Any]) -> int:
    """
    PROFILE_EXTENSION mode. Analyse payload against current profile, produce a
    PROFILE_EXTENSION REPORT, and write a PROPOSED entry to the family JSON file.
    Does NOT modify the live profile.
    """
    config = resolve_profile(family, profile)

    # Current profile state
    if config is None:
        current_paths: List[Any] = []
        current_enums: List[Any] = []
        profile_exists = False
    else:
        current_paths = list(config.get("required_paths", []))
        current_enums = list(config.get("enum_paths", []))
        profile_exists = True

    # Flatten payload to available paths
    available_paths = flatten_paths(payload)

    # Find paths in payload that are NOT already covered by the current profile
    covered = {path for (_, path, _) in current_paths}
    covered |= {path for (_, path, _) in current_enums}
    uncovered_payload_paths = [p for p in available_paths if p not in covered]

    # Identify which current profile paths are MISSING from payload (failing checks)
    failing_checks = []
    if profile_exists:
        for qid, path, desc in current_paths:
            if not is_non_empty(deep_get(payload, path)):
                failing_checks.append((qid, path, desc))
        for qid, path, allowed in current_enums:
            if not validate_enum(deep_get(payload, path), allowed):
                failing_checks.append((qid, path, f"enum {allowed}"))

    # Build proposed additions from uncovered payload paths
    proposed_required: List[Dict[str, Any]] = []
    for i, path in enumerate(uncovered_payload_paths[:10], start=len(current_paths) + 1):
        proposed_required.append({
            "question_id": f"QE{i}",
            "path": path,
            "description": f"[proposed] {path} detected in payload — review and rename"
        })

    # Impact assessment
    existing_check_count = len(current_paths) + len(current_enums)
    new_check_count = len(proposed_required)

    # Build PROFILE_EXTENSION REPORT (stdout)
    print("PROFILE_EXTENSION REPORT")
    print("")
    print(f"Family:  {family}")
    print(f"Profile: {profile} ({'exists' if profile_exists else 'MISSING — new profile required'})")
    print("")
    print("Missing elements detected (failing checks in current profile):")
    if failing_checks:
        for qid, path, desc in failing_checks:
            print(f"  {qid}: {path} — {desc}")
    else:
        print("  None — all current profile checks pass.")
    print("")
    print("Proposed additions (paths present in payload but not in current profile):")
    if proposed_required:
        for entry in proposed_required:
            print(f"  {entry['question_id']}: {entry['path']}")
    else:
        print("  None — payload appears fully covered.")
    print("")
    print("Payload evidence (top-level paths detected):")
    for p in available_paths[:20]:
        in_profile = "✓" if p in covered else "○"
        print(f"  {in_profile} {p}")
    if len(available_paths) > 20:
        print(f"  ... ({len(available_paths) - 20} more)")
    print("")
    print("Impact assessment:")
    print(f"  Existing checks in profile: {existing_check_count}")
    print(f"  Proposed new checks:        {new_check_count}")
    print(f"  Total after acceptance:     {existing_check_count + new_check_count}")
    print("")
    print("Recommendation:")
    if not profile_exists:
        print("  CREATE — profile does not exist; define from scratch using payload evidence above")
    elif failing_checks:
        print("  REVIEW — current profile has failing checks; payload may have different shape")
        print("           Verify whether the profile paths need correction (not extension)")
    elif proposed_required:
        print("  EXTEND — existing checks pass; new payload paths are candidates for coverage")
    else:
        print("  NO ACTION — profile appears sufficient for this payload")
    print("")
    print("Status: PROPOSED (not applied)")
    print(f"Written to: docs/governance/families/{family}.json → proposed_extensions.{profile}")

    # Write PROPOSED entry to family JSON
    _write_proposed_extension(
        family=family,
        profile=profile,
        failing_checks=failing_checks,
        proposed_required=proposed_required,
        existing_check_count=existing_check_count,
        new_check_count=new_check_count,
        profile_exists=profile_exists,
    )

    return 0


def _write_proposed_extension(family: str, profile: str,
                               failing_checks: list,
                               proposed_required: list,
                               existing_check_count: int,
                               new_check_count: int,
                               profile_exists: bool) -> None:
    """Write PROPOSED extension to docs/governance/families/<FAMILY>.json."""
    profile_file = FAMILIES_DIR / f"{family}.json"
    if not profile_file.exists():
        data: Dict[str, Any] = {"family": family, "status": "REGISTERED", "profiles": {}}
    else:
        try:
            data = json.loads(profile_file.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"WARN: could not read {profile_file} for extension write: {exc}", file=sys.stderr)
            return

    proposed_entry = {
        "status": "PROPOSED",
        "proposed_date": str(date.today()),
        "proposed_by": "validate_stream.py --suggest-extension",
        "trigger": "PROFILE_EXTENSION mode",
        "profile_exists": profile_exists,
        "failing_checks": [
            {"question_id": qid, "path": path, "description": desc}
            for qid, path, desc in failing_checks
        ],
        "proposed_additions": {
            "required_paths": proposed_required,
            "enum_paths": []
        },
        "impact_assessment": {
            "existing_checks": existing_check_count,
            "proposed_new_checks": new_check_count,
            "total_after_acceptance": existing_check_count + new_check_count
        },
        "acceptance_rule": (
            "Profile extension MUST NOT be applied automatically. "
            "Move proposed_additions into profiles.<profile> only in an explicit governed stream."
        )
    }

    if "proposed_extensions" not in data:
        data["proposed_extensions"] = {}
    data["proposed_extensions"][profile] = proposed_entry

    profile_file.write_text(json.dumps(data, indent=2), encoding="utf-8")


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
            extension_hint=True,
        )
    print(f"PROFILES FOR FAMILY: {family}")
    print("")
    for name, config in sorted(profiles.items()):
        q_count = len(config.get("required_paths", [])) + len(config.get("enum_paths", []))
        print(f"  {name}  ({q_count} checks)")
    # Show any proposed extensions
    pf = FAMILIES_DIR / f"{family}.json"
    if pf.exists():
        try:
            raw = json.loads(pf.read_text(encoding="utf-8"))
            proposed = raw.get("proposed_extensions", {})
            if proposed:
                print("")
                print("  Proposed extensions (PROPOSED — not yet accepted):")
                for prof, entry in proposed.items():
                    n_new = entry.get("impact_assessment", {}).get("proposed_new_checks", "?")
                    print(f"    {prof}  ({n_new} proposed new checks, proposed {entry.get('proposed_date','?')})")
        except Exception:
            pass
    return 0


def discover_profile(family: str, profile: str) -> int:
    all_families = get_all_families()
    print("VALIDATION_DISCOVERY")
    print("")
    print(f"Family:  {family}")
    print(f"Profile: {profile}")
    print("")

    if family not in all_families:
        print("STATUS: UNKNOWN FAMILY")
        print(f"  '{family}' is not registered.")
        print("  Action: run FAMILY_DISCOVERY to assess registration candidacy.")
        return 2

    available = get_profiles_for_family(family)
    if profile not in available:
        print("STATUS: MISSING PROFILE")
        print(f"  Family '{family}' is registered but has no profile '{profile}'.")
        print(f"  Available profiles: {', '.join(sorted(available.keys())) or 'none'}")
        print(f"  Action: run --suggest-extension with a sample payload to generate PROFILE_EXTENSION REPORT")
        print(f"          or define profile manually in docs/governance/families/{family}.json")
        return 2

    config = available[profile]
    print("STATUS: PROFILE FOUND")
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
    parser.add_argument("--list-families", action="store_true",
                        help="List all known families and profiles")
    parser.add_argument("--list-profiles", metavar="FAMILY",
                        help="List profiles for a family")
    parser.add_argument("--discover", nargs=2, metavar=("FAMILY", "PROFILE"),
                        help="VALIDATION_DISCOVERY: assess coverage for family/profile")
    parser.add_argument("--suggest-extension", action="store_true",
                        help="PROFILE_EXTENSION mode: analyse payload and generate extension report")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    # Discovery / listing modes — no payload required
    if args.list_families:
        return list_families()

    if args.list_profiles:
        return list_profiles(args.list_profiles)

    if args.discover:
        return discover_profile(args.discover[0], args.discover[1])

    # All remaining modes require --family
    if not args.family:
        print("FAIL_SAFE_STOP\nReason: --family is required.", file=sys.stderr)
        return 2

    family = args.family.upper()

    # PROFILE_EXTENSION mode — --suggest-extension
    if args.suggest_extension:
        if not args.profile:
            print("FAIL_SAFE_STOP\nReason: --profile is required for --suggest-extension.", file=sys.stderr)
            return 2
        payload = load_payload(args.input)
        if payload is None:
            return fail_safe_stop(
                "No valid JSON payload provided. --suggest-extension requires a payload to analyse.",
                family=family,
                profile=args.profile,
            )
        return suggest_extension(family, args.profile, payload)

    # Validation mode
    if not args.profile:
        print("FAIL_SAFE_STOP\nReason: --profile is required for validation mode.", file=sys.stderr)
        return 2

    profile = args.profile

    # Family resolution check
    all_families = get_all_families()
    if family not in all_families:
        return fail_safe_stop(
            f"Family '{family}' is not registered. Cannot proceed with compressed execution.",
            family=family,
            profile=profile,
        )

    # Profile resolution check — extension hint on missing profile
    config = resolve_profile(family, profile)
    if config is None:
        return fail_safe_stop(
            f"Profile '{profile}' not found for family '{family}'.",
            family=family,
            profile=profile,
            extension_hint=True,
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
    return print_results(results, family, profile, suggest_hint=True)


if __name__ == "__main__":
    raise SystemExit(main())
