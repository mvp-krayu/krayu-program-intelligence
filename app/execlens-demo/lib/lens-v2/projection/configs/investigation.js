// INVESTIGATION ProjectionConfig — Reference Consumer #2e
// Verification sequence panels, compilation chain, PASS/FAIL assertions.
// No narrative — INVESTIGATION verifies, it does not narrate.

module.exports = {
  consumer_id: 'investigation',
  consumer_label: 'INVESTIGATION',
  audience_model: 'FORENSIC',
  narrative_mode: 'NONE',
  narrative_register: 'forensic',
  disclosure_level: 'FULL',
  object_selection: [
    'structural_posture', 'tension_map', 'constraint_inventory',
    'exposure_assessment', 'trajectory_assessment', 'decision_surface',
    'absence_profile', 'detection_boundary', 'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'posture_verification', section_label: 'Posture Verification', sequence: 1, primary_object: 'structural_posture', secondary_objects: ['operational_ceiling'] },
    { section_id: 'tension_verification', section_label: 'Tension Verification', sequence: 2, primary_object: 'tension_map', secondary_objects: ['constraint_inventory'] },
    { section_id: 'exposure_verification', section_label: 'Exposure Verification', sequence: 3, primary_object: 'exposure_assessment', secondary_objects: ['detection_boundary'] },
    { section_id: 'trajectory_verification', section_label: 'Trajectory Verification', sequence: 4, primary_object: 'trajectory_assessment', secondary_objects: [] },
    { section_id: 'decision_verification', section_label: 'Decision Verification', sequence: 5, primary_object: 'decision_surface', secondary_objects: [] },
    { section_id: 'absence_verification', section_label: 'Absence Verification', sequence: 6, primary_object: 'absence_profile', secondary_objects: [] },
    { section_id: 'detection_verification', section_label: 'Detection Verification', sequence: 7, primary_object: 'detection_boundary', secondary_objects: [] },
    { section_id: 'ceiling_verification', section_label: 'Ceiling Verification', sequence: 8, primary_object: 'operational_ceiling', secondary_objects: [] },
  ],
  format_hints: { verification_panels: true, pass_fail_assertions: true, compilation_chain: true },
}
