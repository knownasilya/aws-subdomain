'use strict';

var ltcdr = require('ltcdr');
var pkg = require('../package');
var App = require('./');
var utils = require('./cli-utils');
var cli = ltcdr.version(pkg.version)
  .usage('[options] <subdomain>')
  .description('Creates a new subdomain based on the full domain desired')
  .option('-a, --action [name]', 'The action to take (create|delete|upsert)', 'create')
  .option('-i, --aws-key-id [id]', 'AWS AccessKeyId, comes from the `AWS_ACCESS_KEY_ID` env by default', process.env.AWS_ACCESS_KEY_ID)
  .option('-s, --aws-secret-key [key]', 'AWS SecretAccessKey, comes from the `AWS_SECRET_ACCESS_KEY` env by default', process.env.AWS_SECRET_ACCESS_KEY);

module.exports = function (argv, callback) {
  cli.parse(argv);

  if (!cli.awsKeyId || !cli.awsSecretKey) {
    return callback('AWS credentials are missing, use `-h` for details.');
  }

  var app = new App({
    accessKeyId: cli.awsKeyId,
    secretAccessKey: cli.awsSecretKey
  });

  callback = callback || function () {};

  if (utils.validAction(cli.action)) {
    app[cli.action](utils.firstArg(cli.args), callback);
  }
  else {
    callback('Invalid action `' + cli.action + '` specified, valid actions are: ' + utils.validActions.join(','));
  }
};
