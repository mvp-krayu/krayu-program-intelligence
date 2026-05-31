// OPERATOR ProjectionConfig — Reference Consumer #2d
// Evidence section tables, governance lifecycle, signal audit at 4-decimal precision.
// Minimal narrative — most content is Zone A (raw evidence display).

module.exports = {
  consumer_id: 'operator',
  consumer_label: 'OPERATOR',
  audience_model: 'OPERATOR',
  narrative_mode: 'MINIMAL',
  narrative_register: 'operational',
  disclosure_level: 'STANDARD',
  object_selection: [
    'structural_posture', 'tension_map', 'constraint_inventory',
    'exposure_assessment', 'decision_surface', 'absence_profile',
    'detection_boundary', 'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'posture_evidence', section_label: 'Posture Evidence', sequence: 1, primary_object: 'structural_posture', secondary_objects: [] },
    { section_id: 'tension_evidence', section_label: 'Tension Evidence', sequence: 2, primary_object: 'tension_map', secondary_objects: [] },
    { section_id: 'constraint_evidence', section_label: 'Constraint Evidence', sequence: 3, primary_object: 'constraint_inventory', secondary_objects: [] },
    { section_id: 'exposure_evidence', section_label: 'Exposure Evidence', sequence: 4, primary_object: 'exposure_assessment', secondary_objects: [] },
    { section_id: 'decision_evidence', section_label: 'Decision Evidence', sequence: 5, primary_object: 'decision_surface', secondary_objects: [] },
    { section_id: 'absence_evidence', section_label: 'Absence Evidence', sequence: 6, primary_object: 'absence_profile', secondary_objects: [] },
    { section_id: 'detection_evidence', section_label: 'Detection Evidence', sequence: 7, primary_object: 'detection_boundary', secondary_objects: [] },
    { section_id: 'ceiling_evidence', section_label: 'Ceiling Evidence', sequence: 8, primary_object: 'operational_ceiling', secondary_objects: [] },
  ],
  format_hints: { evidence_tables: true, four_decimal_precision: true, hash_chain_inspection: true },
}
