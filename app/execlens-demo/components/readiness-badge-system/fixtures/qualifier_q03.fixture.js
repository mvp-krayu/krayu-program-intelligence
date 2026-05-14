'use strict';

const QUALIFIER_Q03_FIXTURE = {
  input: { qualifier_class: 'Q-03' },
  expected: {
    renders: true,
    chip_label: 'Under Review',
    chip_token: 'token-qualifier-grey',
    absence_notice: null,
  },
};

module.exports = { QUALIFIER_Q03_FIXTURE };
