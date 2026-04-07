#!/usr/bin/env python3
"""
PSEE Structure Manifest Emitter
Stream: PSEE.RECONCILE.1.WP-15H

PURPOSE
  Discover an AUTHORITATIVE_STRUCTURE_SOURCE under the client's intake scope
  and emit a governed structure_manifest.json for pipeline consumption.

  EVIDENCE-ONLY — no inference, no synthesis, no heuristics.

  Source discovery rules (strict):
    - Scan clients/<uuid>/input/intake/ for files containing explicit
      structural declarations at top level:
        - "domains"       → non-empty list
        - "entities"      → non-empty list of objects
        - "relationships" → non-empty list of objects
    - A valid AUTHORITATIVE_STRUCTURE_SOURCE must declare ALL THREE keys
    - Partial declarations are NOT accepted
    - telemetry_baseline.json is excluded (VAR_*-only intake; no structure)
    - intake_manifest.json is excluded (admissibility wrapper; no structure)
    - intake_introspection.json is excluded (analysis artifact; no structure)

  If no AUTHORITATIVE_STRUCTURE_SOURCE is found:
    → Emit structure_emission_log.md with status BLOCKED
    → Exit STRUCTURE_SOURCE_UNAVAILABLE (code 2)

  If AUTHORITATIVE_STRUCTURE_SOURCE is found:
    → Validate and emit structure_manifest.json
    → Emit structure_emission_log.md with status COMPLETE
    → Exit 0

Entry point:
  emit_structure_manifest.py --client <client_uuid>

Reads:   clients/<uuid>/input/intake/*.json (candidate scan)
Writes:  clients/<uuid>/input/intake/structure_manifest.json  (if found)
         clients/<uuid>/input/intake/structure_emission_log.md (always)

Exit codes:
  0 = EMISSION_COMPLETE
  1 = EMISSION_FAILED (script error)
  2 = STRUCTURE_SOURCE_UNAVAILABLE
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
REPO_NAME        = "k-pi-core"
REQUIRED_BRANCH  = "work/psee-runtime"
STREAM_ID        = "PSEE.RECONCILE.1.WP-15H"
CLIENT_UUID_EXPECTED = "1de0d815-0721-58e9-bc8d-ca83e70fa903"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)
)))

# Files in the intake directory that are NOT structural source candidates
EXCLUDED_INTAKE_FILES = {
    "telemetry_baseline.json",   # VAR_*-only metrics; no structure
    "intake_manifest.json",      # admissibility wrapper
    "intake_introspection.json", # analysis artifact
    "structure_manifest.json",   # this script's output — excluded from scan
    "structure_emission_log.md", # this script's log — excluded from scan
}

# A valid structural source MUST carry all three of these top-level keys
# as non-empty lists (or list of objects for entities/relationships)
REQUIRED_STRUCTURE_KEYS = {"domains", "entities", "relationships"}


# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg=""):
    print(msg)


def fail(stage, reason, rule_id="EMISSION_RULE", code=1):
    print(f"\nFAIL [{stage}]")
    print(f"  rule:   {rule_id}")
    print(f"  reason: {reason}")
    print(f"  action: execution halted\n")
    sys.exit(code)


def sha256_of(text):
    return hashlib.sha256(text.encode()).hexdigest()


def _jdump(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=True)


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight(client_uuid):
    log("=== PSEE Structure Manifest Emitter ===")
    log(f"stream:      {STREAM_ID}")
    log(f"client_uuid: {client_uuid}")
    log()

    log("--- PRECHECK ---")

    # Repo identity
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        if r.returncode != 0:
            fail("PRECHECK", "not a git repository", "REPO_LOCK")
        actual = os.path.basename(r.stdout.strip())
        if actual != REPO_NAME:
            fail("PRECHECK", f"repo={actual!r} expected={REPO_NAME!r}", "REPO_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "REPO_LOCK")

    # Branch
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            fail("PRECHECK",
                 f"branch={branch!r} required={REQUIRED_BRANCH!r}",
                 "BRANCH_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "BRANCH_LOCK")

    # Worktree clean — allow untracked client intake files
    try:
        r = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        lines = [l for l in r.stdout.splitlines() if l.strip()]
        allowed_prefixes = (
            f"?? clients/{client_uuid}/input/",
            f"?? clients/{client_uuid}/runs/",
            f"?? scripts/psee/emit_structure_manifest.py",
        )
        dirty = [l for l in lines if not any(l.startswith(p) for p in allowed_prefixes)]
        if dirty:
            fail("PRECHECK",
                 f"dirty worktree: {'; '.join(dirty[:3])}",
                 "WORKTREE_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "WORKTREE_LOCK")

    # Client scope exists
    intake_dir = os.path.join(REPO_ROOT, "clients", client_uuid, "input", "intake")
    if not os.path.isdir(intake_dir):
        fail("PRECHECK",
             f"intake directory not found: clients/{client_uuid}/input/intake/",
             "INTAKE_DIR_MISSING")

    log("PRECHECK_PASS")
    log()
    return intake_dir


# ── STAGE: SOURCE_DISCOVERY ───────────────────────────────────────────────────
def source_discovery(client_uuid, intake_dir):
    """Scan intake directory for AUTHORITATIVE_STRUCTURE_SOURCE.

    Discovery rules:
    1. Enumerate all .json files in intake_dir
    2. Exclude known non-structural files (EXCLUDED_INTAKE_FILES)
    3. For each candidate: load and inspect top-level keys
    4. A valid source must contain non-empty 'domains', 'entities', 'relationships'
    5. Return first compliant file found (deterministic alphabetical scan order)
    6. Return None if no compliant file found
    """
    log("--- SOURCE_DISCOVERY ---")

    # Enumerate candidates in deterministic (alphabetical) order
    try:
        all_files = sorted(os.listdir(intake_dir))
    except Exception as e:
        fail("SOURCE_DISCOVERY", f"cannot list intake dir: {e}", "SCAN_ERROR")

    json_files = [f for f in all_files if f.endswith(".json")]
    candidates = [f for f in json_files if f not in EXCLUDED_INTAKE_FILES]

    log(f"  intake_dir:     clients/{client_uuid}/input/intake/")
    log(f"  total_json:     {len(json_files)}")
    log(f"  excluded:       {len(json_files) - len(candidates)}")
    log(f"  candidates:     {len(candidates)}")

    if not candidates:
        log("  SOURCE_DISCOVERY: no candidate files remain after exclusions")
        log("SOURCE_DISCOVERY_COMPLETE  result=NONE")
        log()
        return None

    # Inspect each candidate
    for fname in candidates:
        fpath = os.path.join(intake_dir, fname)
        log(f"  scanning: {fname}")

        try:
            with open(fpath, encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            log(f"    SKIP — json parse error: {e}")
            continue

        if not isinstance(data, dict):
            log(f"    SKIP — not a JSON object")
            continue

        # Check all three required structural keys are present and non-empty
        missing = []
        for key in sorted(REQUIRED_STRUCTURE_KEYS):
            val = data.get(key)
            if not isinstance(val, list) or len(val) == 0:
                missing.append(key)

        if missing:
            log(f"    SKIP — missing or empty required keys: {missing}")
            continue

        # All three keys present and non-empty → AUTHORITATIVE_STRUCTURE_SOURCE found
        log(f"    MATCH — all required structural keys present")
        log(f"    domains:       {len(data['domains'])}")
        log(f"    entities:      {len(data['entities'])}")
        log(f"    relationships: {len(data['relationships'])}")
        log(f"SOURCE_DISCOVERY_COMPLETE  result=FOUND  source={fname}")
        log()
        return (fpath, fname, data)

    # No match found
    log("  SOURCE_DISCOVERY: scanned all candidates — no explicit structural source")
    log("SOURCE_DISCOVERY_COMPLETE  result=NONE")
    log()
    return None


# ── STAGE: STRUCTURE_VALIDATION ───────────────────────────────────────────────
def structure_validation(source_data, source_fname):
    """Validate discovered source against structural schema requirements.

    Validates:
    - domains: list of non-empty strings
    - entities: list of objects with 'name' (string) and 'domain' (string)
    - relationships: list of objects with 'from', 'to', 'type' (all strings)
    - All entity domain references resolve to declared domains
    - No empty strings for required fields
    """
    log("--- STRUCTURE_VALIDATION ---")

    violations = []

    domains = source_data.get("domains", [])
    entities = source_data.get("entities", [])
    relationships = source_data.get("relationships", [])

    # Validate domains: must be non-empty strings
    domain_set = set()
    for i, d in enumerate(domains):
        if not isinstance(d, str) or not d.strip():
            violations.append(f"domains[{i}]: not a non-empty string ({d!r})")
        else:
            domain_set.add(d)

    # Validate entities: must have name and domain
    entity_names = set()
    for i, e in enumerate(entities):
        if not isinstance(e, dict):
            violations.append(f"entities[{i}]: not an object")
            continue
        name = e.get("name", "")
        domain = e.get("domain", "")
        if not isinstance(name, str) or not name.strip():
            violations.append(f"entities[{i}].name: missing or empty")
        else:
            entity_names.add(name)
        if not isinstance(domain, str) or not domain.strip():
            violations.append(f"entities[{i}].domain: missing or empty")
        elif domain not in domain_set:
            violations.append(
                f"entities[{i}].domain={domain!r}: not declared in domains list"
            )

    # Validate relationships: must have from, to, type
    for i, r in enumerate(relationships):
        if not isinstance(r, dict):
            violations.append(f"relationships[{i}]: not an object")
            continue
        for field in ("from", "to", "type"):
            val = r.get(field, "")
            if not isinstance(val, str) or not val.strip():
                violations.append(
                    f"relationships[{i}].{field}: missing or empty"
                )

    if violations:
        log(f"  STRUCTURE_VALIDATION_FAIL  violations={len(violations)}")
        for v in violations:
            log(f"    - {v}")
        fail("STRUCTURE_VALIDATION",
             f"{len(violations)} validation violation(s) in {source_fname}",
             "STRUCTURE_SCHEMA_VIOLATION")

    log(f"  domains:       {len(domains)} — all valid")
    log(f"  entities:      {len(entities)} — all valid")
    log(f"  relationships: {len(relationships)} — all valid")
    log("STRUCTURE_VALIDATION_PASS")
    log()


# ── STAGE: MANIFEST_EMISSION ──────────────────────────────────────────────────
def manifest_emission(client_uuid, intake_dir, source_fpath, source_fname, source_data):
    """Emit structure_manifest.json from validated source."""
    log("--- MANIFEST_EMISSION ---")

    domains       = source_data["domains"]
    entities      = source_data["entities"]
    relationships = source_data["relationships"]

    # Deterministic provenance hash over source file content
    with open(source_fpath, encoding="utf-8") as f:
        source_raw = f.read()
    source_hash = sha256_of(source_raw)

    # Also hash intake telemetry_baseline for combined provenance
    tbf = os.path.join(intake_dir, "telemetry_baseline.json")
    if os.path.isfile(tbf):
        with open(tbf, encoding="utf-8") as f:
            tb_raw = f.read()
        combined_hash = sha256_of(source_raw + tb_raw)
    else:
        combined_hash = source_hash

    manifest = {
        "client_uuid":      client_uuid,
        "construction_mode": "EXPLICIT_STRUCTURE_EMISSION",
        "domains":          sorted(domains),
        "entities":         sorted(entities, key=lambda e: (e.get("domain", ""), e.get("name", ""))),
        "provenance_hash":  combined_hash,
        "relationships":    sorted(relationships, key=lambda r: (r.get("from", ""), r.get("to", ""), r.get("type", ""))),
        "source_class":     "AUTHORITATIVE_STRUCTURE_SOURCE",
        "source_file":      source_fname,
        "stream":           STREAM_ID,
    }

    out_path = os.path.join(intake_dir, "structure_manifest.json")
    if os.path.exists(out_path):
        fail("MANIFEST_EMISSION",
             "structure_manifest.json already exists — delete to re-emit",
             "NO_OVERWRITE_VIOLATION")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(_jdump(manifest))

    log(f"  WRITTEN  clients/{client_uuid}/input/intake/structure_manifest.json")
    log(f"  domains:       {len(domains)}")
    log(f"  entities:      {len(entities)}")
    log(f"  relationships: {len(relationships)}")
    log(f"  provenance_hash: {combined_hash[:16]}...")
    log("MANIFEST_EMISSION_PASS")
    log()
    return manifest, combined_hash


# ── STAGE: EMISSION_LOG ───────────────────────────────────────────────────────
def write_emission_log(client_uuid, intake_dir, status, source_fname=None,
                       manifest=None, combined_hash=None,
                       scan_details=None):
    """Write structure_emission_log.md regardless of outcome."""
    log("--- EMISSION_LOG ---")

    out_path = os.path.join(intake_dir, "structure_emission_log.md")

    if status == "COMPLETE":
        status_line  = "COMPLETE"
        source_block = f"source_file:     {source_fname}"
        result_block = (
            f"domains:         {len(manifest['domains'])}\n"
            f"entities:        {len(manifest['entities'])}\n"
            f"relationships:   {len(manifest['relationships'])}\n"
            f"provenance_hash: {combined_hash}"
        )
        outcome_block = "structure_manifest.json emitted — pipeline may proceed to STRUCTURE_EXTRACTION."
    else:
        status_line  = "BLOCKED"
        source_block = "source_file:     NONE"
        result_block = (
            "domains:         0\n"
            "entities:        0\n"
            "relationships:   0\n"
            "provenance_hash: N/A"
        )
        outcome_block = (
            "STRUCTURE_SOURCE_UNAVAILABLE — no explicit structural source found in intake scope.\n\n"
            "Pipeline MUST NOT proceed past INTAKE_SCHEMA_ADAPT without a valid "
            "structure_manifest.json.\n\n"
            "To unblock: deposit an explicit structure_manifest.json under "
            f"clients/{client_uuid}/input/intake/ containing non-empty "
            "'domains', 'entities', and 'relationships' arrays, then re-run this script."
        )

    scan_section = ""
    if scan_details:
        scan_section = "\n## Scan Details\n\n"
        scan_section += "| File | Result |\n|---|---|\n"
        for fname, result in scan_details:
            scan_section += f"| {fname} | {result} |\n"

    content = f"""# Structure Emission Log — WP-15H

stream:      {STREAM_ID}
client_uuid: {client_uuid}
status:      {status_line}
{source_block}

---

## Emission Result

{result_block}

---

## Outcome

{outcome_block}
{scan_section}
---

## Evidence Chain

| Field | Value |
|---|---|
| intake_dir | clients/{client_uuid}/input/intake/ |
| structural_scan | clients/{client_uuid}/input/intake/*.json |
| excluded_files | {', '.join(sorted(EXCLUDED_INTAKE_FILES))} |
| wp15f_verdict | STRUCTURE_SOURCE_VERDICT: NOT_FOUND (CE2 40.5–40.11 lineage) |
| wp15g_decision | OPTION_C — EXPLICIT_STRUCTURE_EMISSION |
| wp15h_outcome | {status_line} |
"""

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)

    log(f"  WRITTEN  clients/{client_uuid}/input/intake/structure_emission_log.md")
    log("EMISSION_LOG_PASS")
    log()


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PSEE Structure Manifest Emitter — WP-15H"
    )
    parser.add_argument("--client", required=True, help="Client UUID")
    args = parser.parse_args()

    client_uuid = args.client

    # ── PRE-FLIGHT ─────────────────────────────────────────────────────────────
    intake_dir = preflight(client_uuid)

    # ── SOURCE DISCOVERY ───────────────────────────────────────────────────────
    discovery_result = source_discovery(client_uuid, intake_dir)

    # ── BLOCKED PATH ───────────────────────────────────────────────────────────
    if discovery_result is None:
        write_emission_log(
            client_uuid, intake_dir,
            status="BLOCKED",
            scan_details=None
        )
        log("STRUCTURE_SOURCE_UNAVAILABLE")
        log(f"  stream:     {STREAM_ID}")
        log(f"  client:     {client_uuid}")
        log()
        log("  No explicit structural source found in:")
        log(f"  clients/{client_uuid}/input/intake/")
        log()
        log("  Evidence basis: WP-15F STRUCTURE_SOURCE_VERDICT=NOT_FOUND")
        log("  Decision basis: WP-15G OPTION_C — EXPLICIT_STRUCTURE_EMISSION required")
        log()
        log("  Pipeline status: BLOCKED at STRUCTURE_EMITTER stage")
        log("  build_authoritative_input.py MUST NOT be re-run until structure_manifest.json")
        log("  is deposited under the client intake directory.")
        log()
        log("  structure_emission_log.md written for governance record.")
        sys.exit(2)

    # ── EMISSION PATH ──────────────────────────────────────────────────────────
    source_fpath, source_fname, source_data = discovery_result

    # Validate schema compliance
    structure_validation(source_data, source_fname)

    # Emit structure_manifest.json
    manifest, combined_hash = manifest_emission(
        client_uuid, intake_dir, source_fpath, source_fname, source_data
    )

    # Write emission log
    write_emission_log(
        client_uuid, intake_dir,
        status="COMPLETE",
        source_fname=source_fname,
        manifest=manifest,
        combined_hash=combined_hash
    )

    log("EMISSION_COMPLETE")
    log(f"  stream:          {STREAM_ID}")
    log(f"  client:          {client_uuid}")
    log(f"  source_file:     {source_fname}")
    log(f"  domains:         {len(manifest['domains'])}")
    log(f"  entities:        {len(manifest['entities'])}")
    log(f"  relationships:   {len(manifest['relationships'])}")
    sys.exit(0)


if __name__ == "__main__":
    main()
