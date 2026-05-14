'use strict';

const QUALIFIER_Q04_ABSENCE_NOTICE_FIXTURE = {
  input: { qualifier_class: 'Q-04' },
  expected: {
    renders: false,
    chip_label: null,
    chip_token: 'NONE',
    absence_notice: 'Signal intelligence withheld from this view.',
  },
};

module.exports = { QUALIFIER_Q04_ABSENCE_NOTICE_FIXTURE };
