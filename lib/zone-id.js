'use strict';

module.exports = function (verboseId) {
  if (!verboseId) {
    return;
  }

  let split = verboseId.split('/');

  return split.slice(-1)[0];
};
