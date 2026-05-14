'use strict';

const FLAGSHIP_BOARDROOM_MODE_FIXTURE = {
  boardroomMode: true,
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-01',
  densityClass: 'EXECUTIVE_BALANCED',
  presentationMode: true,
  boardroom_config: {
    fullscreen: true,
    focus_mode: 'EXECUTIVE_BRIEFING',
    pacing: 'CONTROLLED',
    reveal_style: 'STAGED',
    audience_tier: 'EXECUTIVE',
    density_class: 'EXECUTIVE_BALANCED',
  },
  expected: {
    boardroom_active: true,
    fullscreen_enabled: true,
    presentation_compatible: true,
    density_class: 'EXECUTIVE_BALANCED',
    motion_profile: 'QUALIFIED_AUTHORITATIVE',
    qualifier_notice_visible: true,
    no_prompt_surfaces: true,
    no_chatbot_ux: true,
    no_ai_personas: true,
    topology_read_only: true,
    cinematic_mode: true,
  },
};

module.exports = { FLAGSHIP_BOARDROOM_MODE_FIXTURE };
