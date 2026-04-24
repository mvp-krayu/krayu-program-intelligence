#!/usr/bin/env python3
"""
BlueEdge Raw Intake Package Builder
Stream: PSEE.RECONCILE.1.WP-15B

Pipeline:
  SOURCE_SCAN → SOURCE_CLASSIFICATION → SOURCE_VALIDATION
  → EXTRACTION → MANIFEST_BUILD → OUTPUT_WRITE

Two independent admissibility gates:

  D1 — PATH VALIDATION: all artifacts must reside under clients/<uuid>/,
       no forbidden path fragments.

  D2 — SOURCE CLASS VALIDATION (hard gate): each source is classified
       deterministically from filename and content.

       Allowed:  AUTHORITATIVE_INTAKE
       Blocked:  TEST_INPUT | PLACEHOLDER | RUNTIME_STATE | CONFIG |
                 DERIVED_OUTPUT | DOCUMENTATION

  If any source fails D2 → FAIL INVALID_SOURCE_CLASS, halt, no output.
  If no AUTHORITATIVE_INTAKE source found → FAIL SOURCE_UNAVAILABLE.

Usage:
    python3 scripts/psee/build_raw_intake_package.py --client <uuid>

Writes (only on PASS):
    clients/<uuid>/input/raw_intake/
        source_manifest.json
        entities.json
        relationships.json
        metrics.json
        events.json
"""

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
STREAM_ID  = "PSEE.RECONCILE.1.WP-15B"
REPO_ROOT  = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_DIR = "raw_intake"

# D1: forbidden path fragments for PATH VALIDATION
FORBIDDEN_PATH_FRAGMENTS = [
    "docs/pios", "runs/pios", "signal_registry", "entity_catalog",
    "dependency_map", "signal_computation", "signal_traceability",
    "presentation", "historical",
]

# D2: deterministic filename → source class mapping
# Classified from filename; content checks applied where ambiguous.
_FILENAME_CLASS_MAP = {
    "raw_input.json":          "TEST_INPUT",
    "state_01.json":           "RUNTIME_STATE",
    "runtime_config.json":     "CONFIG",
    "authoritative_state.json":"DERIVED_OUTPUT",
    "construction_log.md":     "DERIVED_OUTPUT",
    "replay_source_reference.md": "DOCUMENTATION",
    "intake_result.json":      "DERIVED_OUTPUT",
    "verification.log":        "DERIVED_OUTPUT",
}

# Content-level markers that confirm TEST_INPUT classification
_TEST_INPUT_CONTENT_MARKERS = [
    "raw input", "placeholder", "test_input", "not committed",
    "WP-13B raw input", "Entity A", "Entity B", "Entity C",
    "Domain Alpha", "Domain Beta", "Domain Gamma",
]

# Content-level markers that confirm RUNTIME_STATE
_RUNTIME_STATE_CONTENT_MARKERS = [
    "execution_status", "escalation_clearance", "unknown_space_count",
]

# Source classes that are forbidden as intake sources
FORBIDDEN_SOURCE_CLASSES = {
    "TEST_INPUT", "PLACEHOLDER", "RUNTIME_STATE", "CONFIG",
    "DERIVED_OUTPUT", "DOCUMENTATION",
}

ALLOWED_SOURCE_CLASS = "AUTHORITATIVE_INTAKE"

# Directory-mode: names and extensions excluded from recursive scan
EXCLUDED_DIR_NAMES = frozenset({
    ".git", "__pycache__", ".venv", "venv", "node_modules", "build", "dist",
})
EXCLUDED_FILE_EXTENSIONS = frozenset({".pyc"})


# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg):
    print(msg)


def fail(stage, rule, reason):
    print()
    print(f"FAIL [{stage}]")
    print(f"  rule:   {rule}")
    print(f"  reason: {reason}")
    print(f"  action: execution halted")
    sys.exit(1)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def node_id(label):
    return "N-" + hashlib.sha256(label.encode()).hexdigest()[:8].upper()


# ── D2: SOURCE CLASSIFICATION ─────────────────────────────────────────────────
def classify_source(path):
    """Derive source class from filename and content. Classification is
    deterministic — never declared by caller.

    Returns (source_class, evidence) tuple.
    """
    fname = os.path.basename(path)

    # Step 1: filename-based classification
    direct_class = _FILENAME_CLASS_MAP.get(fname)

    # Step 2: pattern-based (state_*.json → RUNTIME_STATE)
    if direct_class is None and re.match(r"^state_.*\.json$", fname):
        direct_class = "RUNTIME_STATE"

    # Step 3: content confirmation / refinement
    content_raw = ""
    try:
        with open(path) as f:
            content_raw = f.read(4096)  # read first 4 KB only
    except Exception:
        pass

    if direct_class == "TEST_INPUT":
        # Confirm via content markers
        matched = [m for m in _TEST_INPUT_CONTENT_MARKERS if m in content_raw]
        evidence = f"filename=raw_input.json; content markers={matched}"
        return direct_class, evidence

    if direct_class == "RUNTIME_STATE":
        matched = [m for m in _RUNTIME_STATE_CONTENT_MARKERS if m in content_raw]
        evidence = f"filename matches state_*.json pattern; content markers={matched}"
        return direct_class, evidence

    if direct_class == "CONFIG":
        evidence = f"filename=runtime_config.json; configuration artifact"
        return direct_class, evidence

    if direct_class in ("DERIVED_OUTPUT", "DOCUMENTATION"):
        evidence = f"filename={fname}; classified as {direct_class}"
        return direct_class, evidence

    # Step 4: content-based classification when filename gives no match
    # Check for explicit TEST_INPUT content markers
    for marker in _TEST_INPUT_CONTENT_MARKERS:
        if marker in content_raw:
            return "TEST_INPUT", f"content marker found: {marker!r}"

    for marker in _RUNTIME_STATE_CONTENT_MARKERS:
        if marker in content_raw:
            return "RUNTIME_STATE", f"content marker found: {marker!r}"

    # Step 5: unclassifiable → UNKNOWN (treated as forbidden)
    return "UNKNOWN", f"filename={fname}; no classification rule matched"


# ── STAGE: SOURCE_SCAN ────────────────────────────────────────────────────────
def source_scan(client_uuid):
    log("--- SOURCE_SCAN ---")
    base = os.path.join(REPO_ROOT, "clients", client_uuid)

    # Enumerate candidate files under clients/<uuid>/input/ and config/
    candidates = []
    for subdir in ("input", "config"):
        d = os.path.join(base, subdir)
        if os.path.isdir(d):
            for fname in sorted(os.listdir(d)):
                fpath = os.path.join(d, fname)
                if os.path.isfile(fpath):
                    candidates.append(fpath)

    for p in candidates:
        log(f"  CANDIDATE  {os.path.relpath(p, REPO_ROOT)}")

    if not candidates:
        fail("SOURCE_SCAN", "SOURCE_UNAVAILABLE",
             f"no candidate files found under clients/{client_uuid}/")

    log(f"  total candidates: {len(candidates)}")
    log("SOURCE_SCAN_PASS")
    return candidates


# ── STAGE: SOURCE_CLASSIFICATION ─────────────────────────────────────────────
def source_classification(candidates, client_uuid):
    log("--- SOURCE_CLASSIFICATION ---")

    classified = []
    violations = []

    for path in candidates:
        rel = os.path.relpath(path, REPO_ROOT)

        # D1: path scope check
        if not rel.startswith(os.path.join("clients", client_uuid)):
            violations.append(f"OUT_OF_SCOPE: {rel}")
            continue
        for frag in FORBIDDEN_PATH_FRAGMENTS:
            if frag in rel:
                violations.append(f"FORBIDDEN_PATH: {rel} (contains {frag!r})")
                continue

        # D2: source class derivation
        source_class, evidence = classify_source(path)
        classified.append({
            "path":         rel,
            "source_class": source_class,
            "evidence":     evidence,
        })
        marker = "BLOCKED" if source_class in FORBIDDEN_SOURCE_CLASSES else "OK"
        log(f"  [{marker}] {rel}  →  {source_class}")
        if source_class in FORBIDDEN_SOURCE_CLASSES or source_class == "UNKNOWN":
            log(f"         evidence: {evidence}")

    if violations:
        fail("SOURCE_CLASSIFICATION", "PATH_VIOLATION",
             "; ".join(violations))

    # Hard gate: fail on any forbidden source class
    blocked = [c for c in classified
               if c["source_class"] in FORBIDDEN_SOURCE_CLASSES or
                  c["source_class"] == "UNKNOWN"]
    if blocked:
        detail = "; ".join(
            f"{c['path']}={c['source_class']}" for c in blocked)
        fail("SOURCE_CLASSIFICATION", "INVALID_SOURCE_CLASS",
             f"forbidden source class(es) detected — {detail}")

    # Check that at least one AUTHORITATIVE_INTAKE source exists
    admissible = [c for c in classified
                  if c["source_class"] == ALLOWED_SOURCE_CLASS]
    if not admissible:
        fail("SOURCE_CLASSIFICATION", "SOURCE_UNAVAILABLE",
             "no AUTHORITATIVE_INTAKE source found among candidate files; "
             "all candidates are forbidden source classes; "
             "intake package cannot be produced without real authoritative evidence")

    log("SOURCE_CLASSIFICATION_PASS")
    return admissible


# ── STAGE: SOURCE_VALIDATION ──────────────────────────────────────────────────
def source_validation(admissible, client_uuid):
    log("--- SOURCE_VALIDATION ---")

    for entry in admissible:
        path = os.path.join(REPO_ROOT, entry["path"])
        rel  = entry["path"]
        # Confirm file still readable
        if not os.path.isfile(path):
            fail("SOURCE_VALIDATION", "SOURCE_MISSING", f"file not found: {rel}")
        log(f"  VALID  {rel}")

    log("SOURCE_VALIDATION_PASS")
    return admissible


# ── STAGE: EXTRACTION ─────────────────────────────────────────────────────────
def extract_all(admissible):
    """Structural extraction only — no interpretation, no derivation."""
    log("--- EXTRACTION ---")

    entities      = []
    relationships = []
    metrics       = {}
    events        = []

    for entry in admissible:
        path = os.path.join(REPO_ROOT, entry["path"])
        with open(path) as f:
            data = json.load(f)

        # Entities from IG topology or domain+entity schema
        raw_domains = {d["id"]: d["label"]
                       for d in data.get("domains", [])}
        for ent in data.get("entities", []):
            domain_label = raw_domains.get(ent.get("domain", ""), ent.get("domain", ""))
            entities.append({
                "id":     node_id(ent["name"]),
                "label":  ent["name"],
                "domain": domain_label,
                "type":   ent.get("type", ""),
            })

        # Topology nodes fallback
        for n in data.get("topology", {}).get("nodes", []):
            entities.append({
                "id":     n.get("id", node_id(n["label"])),
                "label":  n["label"],
                "domain": n.get("domain", ""),
                "type":   n.get("type", ""),
            })

        # Relationships
        name_to_id = {e["label"]: e["id"] for e in entities}
        for r in data.get("relationships", []):
            relationships.append({
                "from":         name_to_id.get(r["from"], node_id(r["from"])),
                "to":           name_to_id.get(r["to"],   node_id(r["to"])),
                "type":         r["type"],
                "evidence_ref": entry["path"],
            })
        for r in data.get("topology", {}).get("relationships", []):
            relationships.append({
                "from":         r["from"],
                "to":           r["to"],
                "type":         r["type"],
                "evidence_ref": entry["path"],
            })

        # Raw metrics — no derived ratios
        for k, v in data.get("metrics", {}).items():
            if isinstance(v, (int, float)):
                metrics[k] = v

        # Events
        events.extend(data.get("events", []))

    log(f"  entities={len(entities)}  relationships={len(relationships)}  "
        f"metrics={len(metrics)}  events={len(events)}")
    log("EXTRACTION_PASS")
    return entities, relationships, metrics, events


# ── STAGE: MANIFEST_BUILD ─────────────────────────────────────────────────────
def build_manifest(admissible, client_uuid):
    log("--- MANIFEST_BUILD ---")

    hasher = hashlib.sha256()
    artifact_entries = []
    for entry in sorted(admissible, key=lambda e: e["path"]):
        full = os.path.join(REPO_ROOT, entry["path"])
        fhash = sha256_file(full)
        hasher.update(fhash.encode())
        artifact_entries.append({
            "path":         entry["path"],
            "source_class": entry["source_class"],
            "sha256":       fhash,
        })

    provenance_hash = hasher.hexdigest()

    manifest = {
        "schema_version": "1.0",
        "stream":         STREAM_ID,
        "client_uuid":    client_uuid,
        "generated_at":   datetime.now(timezone.utc).isoformat(),
        "admissibility_metadata": {
            "source_class":      ALLOWED_SOURCE_CLASS,
            "construction_mode": "FIRST_RUN_INTAKE",
            "source_artifacts":  [a["path"] for a in artifact_entries],
            "provenance_hash":   provenance_hash,
        },
        "source_artifacts":  artifact_entries,
        "provenance_hash":   provenance_hash,
    }

    log(f"  admissible artifacts: {len(artifact_entries)}")
    log(f"  provenance_hash:      {provenance_hash[:16]}...")
    log("MANIFEST_BUILD_PASS")
    return manifest, provenance_hash


# ── STAGE: OUTPUT_WRITE ───────────────────────────────────────────────────────
def output_write(client_uuid, manifest, entities, rels, metrics, events):
    log("--- OUTPUT_WRITE ---")
    out_dir = os.path.join(REPO_ROOT, "clients", client_uuid, "input", OUTPUT_DIR)
    os.makedirs(out_dir, exist_ok=True)
    files = {
        "source_manifest.json": manifest,
        "entities.json":        entities,
        "relationships.json":   rels,
        "metrics.json":         metrics,
        "events.json":          events,
    }
    for fname, data in files.items():
        path = os.path.join(out_dir, fname)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        log(f"  WRITTEN  {os.path.relpath(path, REPO_ROOT)}")
    log("OUTPUT_WRITE_PASS")
    return out_dir


# ── STAGE: VALIDATION ─────────────────────────────────────────────────────────
def validate_output(out_dir):
    log("--- VALIDATION ---")
    required = ["source_manifest.json", "entities.json", "relationships.json",
                "metrics.json", "events.json"]
    for fname in required:
        path = os.path.join(out_dir, fname)
        if not os.path.isfile(path):
            fail("VALIDATION", "MISSING_FILE", f"{fname} not written")
        with open(path) as f:
            data = json.load(f)
        if fname == "source_manifest.json":
            meta = data.get("admissibility_metadata", {})
            for field in ["source_class", "construction_mode",
                          "source_artifacts", "provenance_hash"]:
                if not meta.get(field):
                    fail("VALIDATION", "MANIFEST_INCOMPLETE",
                         f"admissibility_metadata.{field} missing")
            if meta["source_class"] != ALLOWED_SOURCE_CLASS:
                fail("VALIDATION", "MANIFEST_CLASS_VIOLATION",
                     f"source_class={meta['source_class']!r} != {ALLOWED_SOURCE_CLASS!r}")
            for ap in meta["source_artifacts"]:
                for frag in FORBIDDEN_PATH_FRAGMENTS:
                    if frag in ap:
                        fail("VALIDATION", "FORBIDDEN_PATH_IN_MANIFEST",
                             f"{ap!r} contains {frag!r}")
        if fname == "entities.json" and not data:
            fail("VALIDATION", "EMPTY_ENTITIES",
                 "entities.json is empty")
    log(f"  all {len(required)} files present and valid")
    log("VALIDATION_PASS")


# ── STAGE: SOURCE_SCAN_DIR (directory-mode) ──────────────────────────────────
def source_scan_dir(source_dir, client_uuid):
    """Recursively enumerate all non-excluded files under source_dir.

    D1: directory must exist, be a real directory, and resolve to a path
    under clients/<client_uuid>/. No FORBIDDEN_PATH_FRAGMENTS allowed.
    """
    log("--- SOURCE_SCAN_DIR ---")

    abs_source = os.path.realpath(os.path.abspath(source_dir))
    expected_prefix = os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid))

    if not os.path.isdir(abs_source):
        fail("SOURCE_SCAN_DIR", "SOURCE_NOT_FOUND",
             f"not a directory or does not exist: {source_dir}")

    if not abs_source.startswith(expected_prefix + os.sep) and abs_source != expected_prefix:
        fail("SOURCE_SCAN_DIR", "PATH_VIOLATION",
             f"source-dir must be under clients/{client_uuid}/ — got: {source_dir}")

    rel_source = os.path.relpath(abs_source, REPO_ROOT)
    for frag in FORBIDDEN_PATH_FRAGMENTS:
        if frag in rel_source:
            fail("SOURCE_SCAN_DIR", "FORBIDDEN_PATH",
                 f"source-dir contains forbidden fragment {frag!r}: {rel_source}")

    files = []
    for dirpath, dirnames, filenames in os.walk(abs_source):
        dirnames[:] = sorted(d for d in dirnames if d not in EXCLUDED_DIR_NAMES)
        for fname in sorted(filenames):
            _, ext = os.path.splitext(fname)
            if ext in EXCLUDED_FILE_EXTENSIONS:
                continue
            files.append(os.path.join(dirpath, fname))

    if not files:
        fail("SOURCE_SCAN_DIR", "SOURCE_UNAVAILABLE",
             f"no files found under {rel_source} after exclusions")

    log(f"  source_dir: {rel_source}")
    log(f"  files:      {len(files)}")
    log("SOURCE_SCAN_DIR_PASS")
    return abs_source, files


# ── STAGE: EXTRACTION (directory-mode) ───────────────────────────────────────
def extract_from_source_dir(abs_source_dir, files):
    """Minimal structural extraction from a raw source directory.

    Produces a root REPOSITORY entity plus top-level PACKAGE and MODULE
    entities derivable from the directory's immediate children. No
    interpretation — structural enumeration only.
    """
    log("--- EXTRACTION (source-dir mode) ---")

    dir_name = os.path.basename(abs_source_dir)
    entities = []
    relationships = []
    metrics = {}
    events = []

    # Root entity — always present
    entities.append({
        "id":     node_id(dir_name),
        "label":  dir_name,
        "domain": "",
        "type":   "REPOSITORY",
    })

    try:
        for entry in sorted(os.listdir(abs_source_dir)):
            entry_path = os.path.join(abs_source_dir, entry)
            if entry in EXCLUDED_DIR_NAMES:
                continue
            if os.path.isdir(entry_path):
                init_py = os.path.join(entry_path, "__init__.py")
                if os.path.isfile(init_py):
                    entities.append({
                        "id":     node_id(f"{dir_name}/{entry}"),
                        "label":  entry,
                        "domain": dir_name,
                        "type":   "PACKAGE",
                    })
            elif os.path.isfile(entry_path) and entry.endswith(".py") and entry != "__init__.py":
                module_name = entry[:-3]
                entities.append({
                    "id":     node_id(f"{dir_name}/{module_name}"),
                    "label":  module_name,
                    "domain": dir_name,
                    "type":   "MODULE",
                })
    except Exception:
        pass

    metrics["file_count"] = len(files)

    log(f"  entities={len(entities)}  relationships={len(relationships)}  "
        f"metrics={len(metrics)}  events={len(events)}")
    log("EXTRACTION_PASS")
    return entities, relationships, metrics, events


# ── STAGE: MANIFEST_BUILD (directory-mode) ───────────────────────────────────
def build_manifest_dir(abs_source_dir, files, client_uuid):
    """Build source manifest from a directory scan result."""
    log("--- MANIFEST_BUILD ---")

    hasher = hashlib.sha256()
    artifact_entries = []
    for fpath in sorted(files):
        fhash = sha256_file(fpath)
        hasher.update(fhash.encode())
        artifact_entries.append({
            "path":         os.path.relpath(fpath, REPO_ROOT),
            "source_class": ALLOWED_SOURCE_CLASS,
            "sha256":       fhash,
        })

    provenance_hash = hasher.hexdigest()
    rel_source_dir  = os.path.relpath(abs_source_dir, REPO_ROOT)

    manifest = {
        "schema_version": "1.0",
        "stream":         STREAM_ID,
        "client_uuid":    client_uuid,
        "generated_at":   datetime.now(timezone.utc).isoformat(),
        "admissibility_metadata": {
            "source_class":      ALLOWED_SOURCE_CLASS,
            "construction_mode": "FIRST_RUN_INTAKE",
            "source_dir":        rel_source_dir,
            "file_count":        len(files),
            "aggregate_hash":    provenance_hash,
            "source_artifacts":  [a["path"] for a in artifact_entries],
            "provenance_hash":   provenance_hash,
        },
        "source_artifacts":  artifact_entries,
        "provenance_hash":   provenance_hash,
    }

    log(f"  source_dir:      {rel_source_dir}")
    log(f"  files:           {len(artifact_entries)}")
    log(f"  provenance_hash: {provenance_hash[:16]}...")
    log("MANIFEST_BUILD_PASS")
    return manifest, provenance_hash


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser(
        description="BlueEdge Raw Intake Package Builder — WP-15B")
    p.add_argument("--client", required=True, help="Client UUID")
    p.add_argument("--source-dir", dest="source_dir", default=None,
                   help="Source directory for directory-mode intake (optional; "
                        "when absent, legacy scan of clients/<uuid>/input/ is used)")
    args = p.parse_args()
    client_uuid = args.client

    print(f"=== BlueEdge Raw Intake Package Builder — {STREAM_ID} ===")
    print(f"client_uuid: {client_uuid}")
    print()

    if args.source_dir:
        # Directory-mode: explicit source directory provided
        abs_source, files      = source_scan_dir(args.source_dir, client_uuid)
        entities, rels, metrics, events = extract_from_source_dir(abs_source, files)
        manifest, prov_hash    = build_manifest_dir(abs_source, files, client_uuid)
        metrics["aggregate_hash"] = prov_hash
    else:
        # Legacy scan-mode: enumerate clients/<uuid>/input/ and config/ (unchanged)
        candidates  = source_scan(client_uuid)
        admissible  = source_classification(candidates, client_uuid)
        admissible  = source_validation(admissible, client_uuid)
        entities, rels, metrics, events = extract_all(admissible)
        manifest, prov_hash = build_manifest(admissible, client_uuid)

    out_dir = output_write(client_uuid, manifest, entities, rels, metrics, events)
    validate_output(out_dir)

    print()
    print("INTAKE_BUILD_COMPLETE")
    print(f"  client_uuid:     {client_uuid}")
    print(f"  entities:        {len(entities)}")
    print(f"  relationships:   {len(rels)}")
    print(f"  metrics:         {len(metrics)}")
    print(f"  events:          {len(events)}")
    print(f"  provenance_hash: {prov_hash[:16]}...")
    print(f"  output:          clients/{client_uuid}/input/{OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
