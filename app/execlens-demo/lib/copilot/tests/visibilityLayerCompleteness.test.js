'use strict';

const { resolveSpecimen, resolveVerdict, resolveVisibilityLayerCompleteness, VISIBILITY_LAYERS, ARCHITECTURE_PROFILES } = require('../PIKnowledgeGraphAccess');

function assert(condition, message) {
  if (!condition) throw new Error('FAIL: ' + message);
  console.log('  PASS: ' + message);
}

function run() {
  console.log('=== Visibility-Layer Completeness Tests ===\n');

  // 1. VISIBILITY_LAYERS vocabulary is defined
  console.log('--- Vocabulary ---');
  assert(Object.keys(VISIBILITY_LAYERS).length === 7, '7 visibility layers defined');
  assert(VISIBILITY_LAYERS.STATIC_IMPORT, 'STATIC_IMPORT exists');
  assert(VISIBILITY_LAYERS.EVENT_FLOW, 'EVENT_FLOW exists');
  assert(VISIBILITY_LAYERS.MQTT_TOPIC_FLOW, 'MQTT_TOPIC_FLOW exists');
  assert(VISIBILITY_LAYERS.WEBSOCKET_FLOW, 'WEBSOCKET_FLOW exists');
  assert(VISIBILITY_LAYERS.API_BOUNDARY, 'API_BOUNDARY exists');
  assert(VISIBILITY_LAYERS.DI_MODULE_GRAPH, 'DI_MODULE_GRAPH exists');
  assert(VISIBILITY_LAYERS.RUNTIME_WIRING, 'RUNTIME_WIRING exists');

  // 2. Architecture profiles are defined
  console.log('\n--- Architecture Profiles ---');
  assert(Object.keys(ARCHITECTURE_PROFILES).length >= 5, 'at least 5 architecture profiles');
  assert(ARCHITECTURE_PROFILES['nestjs-iot'].required.length === 6, 'nestjs-iot requires 6 layers');
  assert(ARCHITECTURE_PROFILES['django-monolith'].required.length === 4, 'django-monolith requires 4 layers');

  // 3. BlueEdge: SYSTEM_CONNECTIVITY_COMPLETE
  console.log('\n--- BlueEdge (nestjs-iot) ---');
  const beSpecimen = resolveSpecimen('blueedge', 'run_blueedge_genesis_e2e_03');
  assert(beSpecimen, 'BlueEdge specimen resolves');
  const beVlc = resolveVisibilityLayerCompleteness(beSpecimen, 'blueedge', 'run_blueedge_genesis_e2e_03');
  assert(beVlc, 'BlueEdge VLC computes');
  assert(beVlc.architecture_profile === 'nestjs-iot', 'BlueEdge detected as nestjs-iot');
  assert(beVlc.completeness === 100, 'BlueEdge completeness = 100%');
  assert(beVlc.verdict_scope === 'SYSTEM_CONNECTIVITY', 'BlueEdge verdict scope = SYSTEM_CONNECTIVITY');
  assert(beVlc.qualifier_modifier === null, 'BlueEdge no qualifier modifier');
  assert(beVlc.layers_missing.length === 0, 'BlueEdge 0 missing layers');
  assert(beVlc.measured_count === 6, 'BlueEdge 6 layers measured');
  assert(beVlc.required_count === 6, 'BlueEdge 6 layers required');

  // 4. NetBox: VISIBILITY_INCOMPLETE
  console.log('\n--- NetBox (django-monolith) ---');
  const nbSpecimen = resolveSpecimen('netbox', 'run_github_netbox_20260520_134600');
  assert(nbSpecimen, 'NetBox specimen resolves');
  const nbVlc = resolveVisibilityLayerCompleteness(nbSpecimen, 'netbox', 'run_github_netbox_20260520_134600');
  assert(nbVlc, 'NetBox VLC computes');
  assert(nbVlc.architecture_profile === 'django-monolith', 'NetBox detected as django-monolith');
  assert(nbVlc.completeness === 25, 'NetBox completeness = 25%');
  assert(nbVlc.verdict_scope === 'CODE_CONNECTIVITY', 'NetBox verdict scope = CODE_CONNECTIVITY');
  assert(nbVlc.qualifier_modifier === 'VISIBILITY_INCOMPLETE', 'NetBox qualifier modifier = VISIBILITY_INCOMPLETE');
  assert(nbVlc.layers_missing.length === 3, 'NetBox 3 missing layers');
  assert(nbVlc.measured_count === 1, 'NetBox 1 layer measured');

  // 5. VLC appears in verdict
  console.log('\n--- Verdict Integration ---');
  const beVerdict = resolveVerdict(beSpecimen, 'blueedge', 'run_blueedge_genesis_e2e_03');
  assert(beVerdict, 'BlueEdge verdict resolves');
  assert(beVerdict.visibility_layer_completeness, 'Verdict contains visibility_layer_completeness');
  assert(beVerdict.visibility_layer_completeness.verdict_scope === 'SYSTEM_CONNECTIVITY', 'Verdict VLC scope = SYSTEM_CONNECTIVITY');
  assert(beVerdict.boardroom, 'Verdict contains boardroom');
  assert(beVerdict.balanced, 'Verdict contains balanced');

  // 6. VLC output has required fields
  console.log('\n--- Field Completeness ---');
  const requiredFields = ['architecture_profile', 'layers_measured', 'layers_required', 'layers_missing', 'completeness', 'verdict_scope', 'qualifier_modifier', 'measured_count', 'required_count'];
  for (const field of requiredFields) {
    assert(field in beVlc, 'VLC output has field: ' + field);
  }

  // 7. Layers_measured contains structured objects
  console.log('\n--- Layer Structure ---');
  for (const layer of beVlc.layers_measured) {
    assert(layer.id, 'Measured layer has id: ' + layer.id);
    assert(layer.name, 'Measured layer has name: ' + layer.name);
  }

  // 8. Generic — works for unknown specimen
  console.log('\n--- Unknown Specimen ---');
  const unknownVlc = resolveVisibilityLayerCompleteness({}, 'fake', 'fake_run');
  assert(unknownVlc, 'Unknown specimen VLC computes');
  assert(unknownVlc.architecture_profile === 'unknown', 'Unknown profile detected');
  assert(unknownVlc.required_count === 1, 'Unknown requires only STATIC_IMPORT');

  console.log('\n=== All tests passed ===');
}

run();
