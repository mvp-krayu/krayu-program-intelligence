// BALANCED ProjectionConfig — Reference Consumer #2b
// Governed operational briefing: causal understanding, reinforcement flow, operational pacing.

module.exports = {
  consumer_id: 'balanced',
  consumer_label: 'BALANCED',
  audience_model: 'CTO_VP_EA',
  narrative_mode: 'OPERATIONAL',
  narrative_register: 'operational',
  disclosure_level: 'STANDARD',
  object_selection: [
    'structural_posture', 'tension_map', 'constraint_inventory',
    'exposure_assessment', 'trajectory_assessment', 'decision_surface',
    'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'posture_briefing', section_label: 'Posture Briefing', sequence: 1, primary_object: 'structural_posture', secondary_objects: ['operational_ceiling'] },
    { section_id: 'tension_dynamics', section_label: 'Tension Dynamics', sequence: 2, primary_object: 'tension_map', secondary_objects: ['constraint_inventory'] },
    { section_id: 'exposure_briefing', section_label: 'Exposure Briefing', sequence: 3, primary_object: 'exposure_assessment', secondary_objects: [] },
    { section_id: 'trajectory_outlook', section_label: 'Trajectory Outlook', sequence: 4, primary_object: 'trajectory_assessment', secondary_objects: [] },
    { section_id: 'decision_surface', section_label: 'Decision Surface', sequence: 5, primary_object: 'decision_surface', secondary_objects: [] },
    { section_id: 'constraint_landscape', section_label: 'Constraint Landscape', sequence: 6, primary_object: 'constraint_inventory', secondary_objects: ['operational_ceiling'] },
  ],
  format_hints: { briefing_corridor: true, reinforcement_panels: true },
}
