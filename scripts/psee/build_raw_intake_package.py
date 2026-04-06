#!/usr/bin/env python3
"""
BlueEdge Raw Intake Package Builder
Stream: PSEE.RECONCILE.1.WP-15B

Produces a normalized, admissible raw_intake/ package for a given client UUID.

Pipeline:
  SOURCE_SCAN → SOURCE_VALIDATION → ENTITY_EXTRACTION → RELATIONSHIP_EXTRACTION
  → METRICS_EXTRACTION → EVENT_EXTRACTION → MANIFEST_BUILD → OUTPUT_WRITE

Usage:
    python3 scripts/psee/build_raw_intake_package.py \\
        --client <client_uuid>

Reads:  clients/<uuid>/input/raw_input.json       (primary IG source)
        clients/<uuid>/input/state_01.json         (secondary state reference)
        clients/<uuid>/config/runtime_config.json  (client config)

Writes: clients/<uuid>/input/raw_intake/
          source_manifest.json
          entities.json
          relationships.json
          metrics.json
          events.json

Admissibility rules:
  - ALL source artifacts must reside under clients/<uuid>/
  - Forbidden path fragments must not appear in any source path
  - Source content must contain non-empty entities and relationships
  - No synthesis, no documentation layer usage
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
STREAM_ID  = "PSEE.RECONCILE.1.WP-15B"
REPO_NAME  = "k-pi-core"
REPO_ROOT  = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_DIR = "raw_intake"

FORBIDDEN_PATH_FRAGMENTS = [
    "docs/pios", "runs/pios", "signal_registry", "entity_catalog",
    "dependency_map", "signal_computation", "signal_traceability",
    "presentation", "historical",
]


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


def sha256_str(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def node_id(label):
    return "N-" + hashlib.sha256(label.encode()).hexdigest()[:8].upper()


def assert_client_scoped(path, client_uuid):
    """Verify path resides under clients/<uuid>/ — no forbidden fragments."""
    rel = os.path.relpath(path, REPO_ROOT)
    if not rel.startswith(os.path.join("clients", client_uuid)):
        fail("SOURCE_VALIDATION", "SOURCE_OUT_OF_SCOPE",
             f"source artifact {rel!r} is not under clients/{client_uuid}/")
    for frag in FORBIDDEN_PATH_FRAGMENTS:
        if frag in rel:
            fail("SOURCE_VALIDATION", "FORBIDDEN_SOURCE_FRAGMENT",
                 f"source artifact {rel!r} references forbidden fragment {frag!r}")


# ── STAGE: SOURCE_SCAN ────────────────────────────────────────────────────────
def source_scan(client_uuid):
    log("--- SOURCE_SCAN ---")
    base = os.path.join(REPO_ROOT, "clients", client_uuid)

    primary   = os.path.join(base, "input", "raw_input.json")
    secondary = os.path.join(base, "input", "state_01.json")
    config    = os.path.join(base, "config", "runtime_config.json")

    found = []
    for label, path in [("primary_ig", primary),
                        ("secondary_state", secondary),
                        ("client_config", config)]:
        if os.path.isfile(path):
            found.append((label, path))
            log(f"  FOUND  {label}: {os.path.relpath(path, REPO_ROOT)}")
        else:
            log(f"  ABSENT {label}: {os.path.relpath(path, REPO_ROOT)}")

    if not any(label == "primary_ig" for label, _ in found):
        fail("SOURCE_SCAN", "SOURCE_UNAVAILABLE",
             f"primary IG source raw_input.json not found under "
             f"clients/{client_uuid}/input/ — no admissible intake possible")

    log("SOURCE_SCAN_PASS")
    return {label: path for label, path in found}


# ── STAGE: SOURCE_VALIDATION ──────────────────────────────────────────────────
def source_validation(sources, client_uuid):
    log("--- SOURCE_VALIDATION ---")

    for label, path in sources.items():
        assert_client_scoped(path, client_uuid)
        log(f"  SCOPED OK: {label}")

    # Load primary source
    with open(sources["primary_ig"]) as f:
        primary = json.load(f)

    # Must have entities or domains
    has_entities = bool(primary.get("entities") or primary.get("topology", {}).get("nodes"))
    has_rels     = bool(primary.get("relationships") or
                        primary.get("topology", {}).get("relationships"))

    if not has_entities:
        fail("SOURCE_VALIDATION", "SOURCE_UNAVAILABLE",
             "primary source contains no entities or topology nodes — "
             "cannot produce admissible intake")

    if not has_rels:
        fail("SOURCE_VALIDATION", "SOURCE_UNAVAILABLE",
             "primary source contains no relationships — "
             "cannot produce admissible intake")

    entity_count = len(primary.get("entities", []) or
                       primary.get("topology", {}).get("nodes", []))
    rel_count    = len(primary.get("relationships", []) or
                       primary.get("topology", {}).get("relationships", []))

    log(f"  entities={entity_count}  relationships={rel_count}")
    log("SOURCE_VALIDATION_PASS")
    return primary


# ── STAGE: ENTITY_EXTRACTION ──────────────────────────────────────────────────
def extract_entities(primary):
    log("--- ENTITY_EXTRACTION ---")
    entities = []

    # IG schema: domains list + entities list with domain ref
    raw_domains  = {d["id"]: d["label"] for d in primary.get("domains", [])}
    raw_entities = primary.get("entities", [])

    if raw_entities:
        for ent in raw_entities:
            domain_label = raw_domains.get(ent.get("domain"), ent.get("domain", ""))
            entities.append({
                "id":     node_id(ent["name"]),
                "label":  ent["name"],
                "domain": domain_label,
                "type":   ent.get("type", ""),
            })
    elif primary.get("topology", {}).get("nodes"):
        for n in primary["topology"]["nodes"]:
            entities.append({
                "id":     n.get("id", node_id(n["label"])),
                "label":  n["label"],
                "domain": n.get("domain", ""),
                "type":   n.get("type", ""),
            })

    if not entities:
        fail("ENTITY_EXTRACTION", "SOURCE_UNAVAILABLE",
             "no entities extractable from primary source")

    log(f"  extracted {len(entities)} entities")
    log("ENTITY_EXTRACTION_PASS")
    return entities


# ── STAGE: RELATIONSHIP_EXTRACTION ───────────────────────────────────────────
def extract_relationships(primary, entities):
    log("--- RELATIONSHIP_EXTRACTION ---")
    rels = []

    # Build name→id map from extracted entities
    name_to_id = {e["label"]: e["id"] for e in entities}

    raw_rels = primary.get("relationships", [])
    if not raw_rels:
        raw_rels = primary.get("topology", {}).get("relationships", [])

    for r in raw_rels:
        from_id = name_to_id.get(r["from"], node_id(r["from"]))
        to_id   = name_to_id.get(r["to"],   node_id(r["to"]))
        rels.append({
            "from":         from_id,
            "to":           to_id,
            "type":         r["type"],
            "evidence_ref": r.get("evidence_ref", "raw_input.json"),
        })

    if not rels:
        fail("RELATIONSHIP_EXTRACTION", "SOURCE_UNAVAILABLE",
             "no relationships extractable from primary source")

    log(f"  extracted {len(rels)} relationships")
    log("RELATIONSHIP_EXTRACTION_PASS")
    return rels


# ── STAGE: METRICS_EXTRACTION ─────────────────────────────────────────────────
def extract_metrics(primary, state_01=None):
    log("--- METRICS_EXTRACTION ---")
    raw_metrics = {}

    # From primary IG source
    if "metrics" in primary:
        for k, v in primary["metrics"].items():
            if isinstance(v, (int, float)):
                raw_metrics[k] = v

    # From state_01 coverage/reconstruction (raw counts only)
    if state_01:
        cov  = state_01.get("coverage", {})
        recon = state_01.get("reconstruction", {})
        if cov.get("admitted_units") is not None:
            raw_metrics["admitted_units"]   = cov["admitted_units"]
            raw_metrics["total_units"]      = cov["total_units"]
        if recon.get("validated_units") is not None:
            raw_metrics["validated_units"]  = recon["validated_units"]
        raw_metrics["escalation_clearance"] = state_01.get("escalation_clearance", 100)
        raw_metrics["unknown_space_count"]  = state_01.get("unknown_space_count", 0)

    log(f"  extracted {len(raw_metrics)} raw metric fields")
    log("METRICS_EXTRACTION_PASS")
    return raw_metrics


# ── STAGE: EVENT_EXTRACTION ───────────────────────────────────────────────────
def extract_events(primary):
    log("--- EVENT_EXTRACTION ---")
    events = primary.get("events", [])
    log(f"  extracted {len(events)} events")
    log("EVENT_EXTRACTION_PASS")
    return events


# ── STAGE: MANIFEST_BUILD ─────────────────────────────────────────────────────
def build_manifest(sources, client_uuid):
    log("--- MANIFEST_BUILD ---")

    # Compute provenance_hash over all source artifact contents
    hasher = hashlib.sha256()
    artifact_list = []
    for label in sorted(sources.keys()):
        path = sources[label]
        rel  = os.path.relpath(path, REPO_ROOT)
        file_hash = sha256_file(path)
        hasher.update(file_hash.encode("utf-8"))
        artifact_list.append({
            "label":      label,
            "path":       rel,
            "sha256":     file_hash,
        })

    provenance_hash = hasher.hexdigest()

    manifest = {
        "schema_version":    "1.0",
        "stream":            STREAM_ID,
        "client_uuid":       client_uuid,
        "generated_at":      datetime.now(timezone.utc).isoformat(),
        "admissibility_metadata": {
            "source_class":      "AUTHORITATIVE_INTAKE",
            "construction_mode": "FIRST_RUN_INTAKE",
            "source_artifacts":  [a["path"] for a in artifact_list],
            "provenance_hash":   provenance_hash,
        },
        "source_artifacts":  artifact_list,
        "provenance_hash":   provenance_hash,
    }

    log(f"  source artifacts: {len(artifact_list)}")
    log(f"  provenance_hash:  {provenance_hash[:16]}...")
    log("MANIFEST_BUILD_PASS")
    return manifest


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
        rel = os.path.relpath(path, REPO_ROOT)
        log(f"  WRITTEN  {rel}")

    log("OUTPUT_WRITE_PASS")
    return out_dir


# ── VALIDATION ────────────────────────────────────────────────────────────────
def validate_output(out_dir, client_uuid):
    log("--- VALIDATION ---")
    required = ["source_manifest.json", "entities.json", "relationships.json",
                "metrics.json", "events.json"]
    violations = []

    for fname in required:
        path = os.path.join(out_dir, fname)
        if not os.path.isfile(path):
            violations.append(f"MISSING: {fname}")
            continue
        with open(path) as f:
            data = json.load(f)
        if fname == "source_manifest.json":
            meta = data.get("admissibility_metadata", {})
            for field in ["source_class", "construction_mode",
                          "source_artifacts", "provenance_hash"]:
                if not meta.get(field):
                    violations.append(f"MANIFEST_INCOMPLETE: admissibility_metadata.{field}")
            if meta.get("source_class") != "AUTHORITATIVE_INTAKE":
                violations.append("MANIFEST: source_class != AUTHORITATIVE_INTAKE")
            for artifact_path in meta.get("source_artifacts", []):
                for frag in FORBIDDEN_PATH_FRAGMENTS:
                    if frag in artifact_path:
                        violations.append(
                            f"FORBIDDEN_SOURCE: {artifact_path!r} contains {frag!r}")
        if fname == "entities.json" and not data:
            violations.append("EMPTY: entities.json contains no entities")
        if fname == "relationships.json" and not data:
            violations.append("EMPTY: relationships.json contains no relationships")

    if violations:
        for v in violations:
            log(f"  VIOLATION: {v}")
        fail("VALIDATION", "VALIDATION_FAILED",
             f"{len(violations)} validation violation(s) detected")

    log(f"  all {len(required)} files present and valid")
    log("VALIDATION_PASS")


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser(
        description="BlueEdge Raw Intake Package Builder — WP-15B")
    p.add_argument("--client", required=True, help="Client UUID")
    args = p.parse_args()

    client_uuid = args.client
    print(f"=== BlueEdge Raw Intake Package Builder — {STREAM_ID} ===")
    print(f"client_uuid: {client_uuid}")
    print()

    sources    = source_scan(client_uuid)
    primary    = source_validation(sources, client_uuid)
    state_01   = (json.load(open(sources["secondary_state"]))
                  if "secondary_state" in sources else None)

    entities   = extract_entities(primary)
    rels       = extract_relationships(primary, entities)
    metrics    = extract_metrics(primary, state_01)
    events     = extract_events(primary)
    manifest   = build_manifest(sources, client_uuid)

    out_dir = output_write(client_uuid, manifest, entities, rels, metrics, events)
    validate_output(out_dir, client_uuid)

    print()
    print("INTAKE_BUILD_COMPLETE")
    print(f"  client_uuid:     {client_uuid}")
    print(f"  entities:        {len(entities)}")
    print(f"  relationships:   {len(rels)}")
    print(f"  metrics:         {len(metrics)}")
    print(f"  events:          {len(events)}")
    print(f"  provenance_hash: {manifest['provenance_hash'][:16]}...")
    print(f"  output:          clients/{client_uuid}/input/{OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
