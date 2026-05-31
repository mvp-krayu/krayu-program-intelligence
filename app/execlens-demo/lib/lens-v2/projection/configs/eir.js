// EIR ProjectionConfig — Reference Consumer #1
// Executive Intelligence Report: exercises all three PRE zones at maximum depth.

module.exports = {
  consumer_id: 'eir',
  consumer_label: 'Executive Intelligence Report',
  audience_model: 'EXECUTIVE',
  narrative_mode: 'EXECUTIVE',
  narrative_register: 'executive',
  disclosure_level: 'FULL',
  object_selection: [
    'structural_posture', 'tension_map', 'constraint_inventory',
    'exposure_assessment', 'trajectory_assessment', 'decision_surface',
    'absence_profile', 'detection_boundary', 'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'ch01_executive_posture', section_label: 'Executive Posture', sequence: 1, primary_object: 'structural_posture', secondary_objects: ['operational_ceiling'] },
    { section_id: 'ch02_structural_tensions', section_label: 'Structural Tensions', sequence: 2, primary_object: 'tension_map', secondary_objects: ['constraint_inventory'] },
    { section_id: 'ch03_exposure_profile', section_label: 'Exposure Profile', sequence: 3, primary_object: 'exposure_assessment', secondary_objects: ['detection_boundary'] },
    { section_id: 'ch04_decision_landscape', section_label: 'Decision Landscape', sequence: 4, primary_object: 'decision_surface', secondary_objects: ['tension_map'] },
    { section_id: 'ch05_trajectory', section_label: 'Trajectory', sequence: 5, primary_object: 'trajectory_assessment', secondary_objects: ['structural_posture'] },
    { section_id: 'ch06_operational_constraints', section_label: 'Operational Constraints', sequence: 6, primary_object: 'constraint_inventory', secondary_objects: ['operational_ceiling'] },
    { section_id: 'ch07_absence_analysis', section_label: 'Absence Analysis', sequence: 7, primary_object: 'absence_profile', secondary_objects: ['detection_boundary'] },
    { section_id: 'ch08_risk_stratification', section_label: 'Risk Stratification', sequence: 8, primary_object: 'exposure_assessment', secondary_objects: ['constraint_inventory'] },
    { section_id: 'ch09_recommendations', section_label: 'Decision Surface', sequence: 9, primary_object: 'decision_surface', secondary_objects: ['trajectory_assessment'] },
    { section_id: 'ch10_appendices', section_label: 'Appendices', sequence: 10, primary_object: 'structural_posture', secondary_objects: ['tension_map', 'constraint_inventory', 'exposure_assessment', 'trajectory_assessment', 'decision_surface', 'absence_profile', 'detection_boundary', 'operational_ceiling'] },
  ],
  format_hints: { output_formats: ['HTML', 'PDF'], chapter_structure: true },
}
