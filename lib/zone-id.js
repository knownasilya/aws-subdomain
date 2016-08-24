'use strict';

module.exports = function (verboseId) {
  if (!verboseId) {
    return;
  }

  var split = verboseId.split('/');

  return split.slice(-1)[0];
};
