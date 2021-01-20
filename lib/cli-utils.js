'use strict';

const validActions = ['create', 'delete', 'upsert'];

exports.validActions = validActions;

exports.firstArg = function (args) {
  if (args && args.length) {
    return args[0];
  }
};

exports.validAction = function (action) {
  if (!action) {
    return;
  }

  action = action.trim();

  return validActions.indexOf(action) !== -1;
};
