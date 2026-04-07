#!/usr/bin/env python3
"""
PSEE Intake Structure Extractor
Stream: PSEE.RECONCILE.1.WP-15E

PURPOSE
  Deterministically extract structural topology elements (domains, entities,
  relationships) from an AUTHORITATIVE_INTAKE canonical dict.

  EVIDENCE-ONLY — no inference, no synthesis, no heuristics.

  Extraction rules (strict):
    - Only derive structure if pattern is EXPLICIT in intake data
    - Allowed patterns: arrays of objects, explicit cross-key references
    - Key prefix groupings are NOT treated as domain/entity declarations
      (metric variable prefixes ≠ topology elements)
    - If no explicit structural pattern present → return empty (valid outcome)

Entry point:
  extract_structure_from_intake(intake_json) -> dict
  Returns: {"domains": [], "entities": [], "relationships": []}
"""


def extract_structure_from_intake(intake_json: dict) -> dict:
    """Extract explicit structural topology from adapted canonical intake.

    Scanning rules (in order):
    1. Look for arrays of objects under any top-level key — each object array
       may yield entity candidates if objects have 'name'/'id' and 'domain' fields.
    2. Look for explicit cross-key references — values that match other keys,
       indicating a declared relationship.
    3. Prefix groups in VAR_* metrics are NOT structural declarations.
       They are metric measurement categories and produce no topology output.

    Returns empty structure if no explicit patterns found — this is a
    VALID and EXPECTED outcome for VAR_*-only telemetry intake.
    """
    domains       = []
    entities      = []
    relationships = []

    # ── RULE 1: arrays of objects ─────────────────────────────────────────────
    # If any top-level value is a list of dicts with 'name'/'id' fields,
    # treat as explicit entity declarations.
    for key, val in intake_json.items():
        if not isinstance(val, list) or not val:
            continue
        if not all(isinstance(item, dict) for item in val):
            continue
        # Must have explicit identity field to be an entity candidate
        has_name = any("name" in item or "id" in item for item in val)
        if not has_name:
            continue
        # Extract entities from this array
        domain_ref = key  # key name is the explicit container → domain
        if domain_ref not in domains:
            domains.append(domain_ref)
        for item in val:
            label = item.get("name") or item.get("id")
            if label:
                entities.append({
                    "name":   str(label),
                    "domain": domain_ref,
                })

    # ── RULE 2: explicit cross-key references ─────────────────────────────────
    # If a value in one entity references the name of another entity,
    # that is an explicit relationship declaration.
    entity_names = {e["name"] for e in entities}
    for entity in entities:
        item_data = {}
        # Re-locate original item to inspect reference fields
        for key, val in intake_json.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        label = item.get("name") or item.get("id")
                        if label == entity["name"]:
                            item_data = item
                            break

        for field, fval in item_data.items():
            if field in ("name", "id", "domain"):
                continue
            if isinstance(fval, str) and fval in entity_names and fval != entity["name"]:
                relationships.append({
                    "from": entity["name"],
                    "to":   fval,
                    "type": field.upper(),
                })

    # ── VAR_* prefix groups: explicitly excluded ──────────────────────────────
    # Prefix groups (VAR_AT, VAR_DT, VAR_ST) are metric measurement categories.
    # They contain no object structure, no name/id fields, no cross-references.
    # Mapping them to domains/entities would be semantic inference — forbidden.

    return {
        "domains":       sorted(set(domains)),
        "entities":      entities,
        "relationships": relationships,
    }
