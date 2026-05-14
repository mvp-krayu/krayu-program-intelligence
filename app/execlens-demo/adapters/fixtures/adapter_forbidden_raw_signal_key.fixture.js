'use strict';

const { EXECUTIVE_READY_FIXTURE } = require('../../validation/fixtures/executive_ready.fixture');

// Fixture with a raw CPI/CFA key injected into signal_label — must be rejected by SignalCardAdapter
const ADAPTER_FORBIDDEN_RAW_SIGNAL_KEY = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-FORBIDDEN-RAW-SIGNAL',
  evidence_blocks: [
    {
      ...EXECUTIVE_READY_FIXTURE.evidence_blocks[0],
      signal_cards: [
        {
          signal_label: 'cpi_score',       // Forbidden raw signal key (ALI-01 not applied)
          pressure_label: 'High pressure',
          pressure_tier: 'HIGH',
          qualifier_label: '',
          evidence_text: 'Raw key in signal_label.',
        },
      ],
    },
  ],
};

module.exports = {
  ADAPTER_FORBIDDEN_RAW_SIGNAL_KEY,
  expectedSignalCardError: 'ADAPT-GOV-01',
};
