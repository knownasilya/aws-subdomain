'use strict';

module.exports = function (verboseId) {
  var split = verboseId.split('/');
  
  if (!split || !split.length) {
    return;
  }
  
  return split.slice(-1)[0];
};
