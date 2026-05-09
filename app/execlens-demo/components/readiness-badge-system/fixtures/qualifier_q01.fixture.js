'use strict';

const QUALIFIER_Q01_FIXTURE = {
  input: { qualifier_class: 'Q-01' },
  expected: {
    renders: true,
    chip_label: 'Partial Grounding',
    chip_token: 'token-qualifier-amber',
    absence_notice: null,
  },
};

module.exports = { QUALIFIER_Q01_FIXTURE };
