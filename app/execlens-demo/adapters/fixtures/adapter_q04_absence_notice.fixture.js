'use strict';

const { BLOCKED_FIXTURE } = require('../../validation/fixtures/blocked.fixture');

// BLOCKED_FIXTURE has Q-04 and correct absence notice
const ADAPTER_Q04_ABSENCE_NOTICE = BLOCKED_FIXTURE;

module.exports = {
  ADAPTER_Q04_ABSENCE_NOTICE,
  expectedQualifierClass: 'Q-04',
  expectedAbsenceNotice: 'Signal intelligence withheld from this view.',
};
