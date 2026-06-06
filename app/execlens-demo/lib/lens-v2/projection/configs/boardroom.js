// BOARDROOM ProjectionConfig — Reference Consumer #2a
// Governed structural revelation: posture, consequence themes, executive cockpit.

module.exports = {
  consumer_id: 'boardroom',
  consumer_label: 'BOARDROOM',
  audience_model: 'EXECUTIVE',
  narrative_mode: 'EXECUTIVE',
  narrative_register: 'executive',
  disclosure_level: 'STANDARD',
  object_selection: [
    'structural_posture', 'tension_map', 'exposure_assessment',
    'decision_surface', 'operational_ceiling',
  ],
  section_mapping: [
    { section_id: 'posture_card', section_label: 'Structural Posture', sequence: 1, primary_object: 'structural_posture', secondary_objects: ['operational_ceiling'] },
    { section_id: 'consequence_themes', section_label: 'Consequence Themes', sequence: 2, primary_object: 'tension_map', secondary_objects: ['exposure_assessment'] },
    { section_id: 'decision_cockpit', section_label: 'Decision Cockpit', sequence: 3, primary_object: 'decision_surface', secondary_objects: [] },
    { section_id: 'ceiling_assessment', section_label: 'Operational Ceiling', sequence: 4, primary_object: 'operational_ceiling', secondary_objects: [] },
  ],
  format_hints: { card_layout: true, cockpit_instruments: true },
}
