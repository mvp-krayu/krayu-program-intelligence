// DENSE ProjectionConfig — Reference Consumer #2c
// Structural behavior interrogation: full numeric precision, zone-navigated topology.

module.exports = {
  consumer_id: 'dense',
  consumer_label: 'DENSE',
  audience_model: 'STRUCTURAL_ENGINEER',
  narrative_mode: 'STRUCTURAL',
  narrative_register: 'structural',
  disclosure_level: 'STANDARD',
  object_selection: [
    'structural_posture', 'tension_map', 'constraint_inventory',
    'exposure_assessment', 'trajectory_assessment', 'decision_surface',
    'absence_profile', 'detection_boundary', 'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'structural_posture', section_label: 'Structural Posture', sequence: 1, primary_object: 'structural_posture', secondary_objects: [] },
    { section_id: 'tension_topology', section_label: 'Tension Topology', sequence: 2, primary_object: 'tension_map', secondary_objects: ['constraint_inventory'] },
    { section_id: 'constraint_surface', section_label: 'Constraint Surface', sequence: 3, primary_object: 'constraint_inventory', secondary_objects: [] },
    { section_id: 'exposure_surface', section_label: 'Exposure Surface', sequence: 4, primary_object: 'exposure_assessment', secondary_objects: ['detection_boundary'] },
    { section_id: 'trajectory_vectors', section_label: 'Trajectory Vectors', sequence: 5, primary_object: 'trajectory_assessment', secondary_objects: [] },
    { section_id: 'decision_leverage', section_label: 'Decision Leverage', sequence: 6, primary_object: 'decision_surface', secondary_objects: [] },
    { section_id: 'absence_inventory', section_label: 'Absence Inventory', sequence: 7, primary_object: 'absence_profile', secondary_objects: [] },
    { section_id: 'measurement_frontier', section_label: 'Measurement Frontier', sequence: 8, primary_object: 'detection_boundary', secondary_objects: [] },
    { section_id: 'operational_ceiling', section_label: 'Operational Ceiling', sequence: 9, primary_object: 'operational_ceiling', secondary_objects: [] },
  ],
  format_hints: { full_precision: true, zone_navigation: true },
}
