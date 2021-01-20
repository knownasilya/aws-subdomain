'use strict';

const ltcdr = require('ltcdr');
const pkg = require('../package');
const App = require('./');
const utils = require('./cli-utils');
const cli = ltcdr
  .version(pkg.version)
  .usage('[options] <subdomain>')
  .description('Creates a new subdomain based on the full domain desired')
  .option(
    '-a, --action [name]',
    'The action to take (create|delete|upsert)',
    'create'
  )
  .option(
    '-i, --aws-key-id [id]',
    'AWS AccessKeyId, comes from the `AWS_ACCESS_KEY_ID` env by default',
    process.env.AWS_ACCESS_KEY_ID
  )
  .option(
    '-s, --aws-secret-key [key]',
    'AWS SecretAccessKey, comes from the `AWS_SECRET_ACCESS_KEY` env by default',
    process.env.AWS_SECRET_ACCESS_KEY
  );

module.exports = function (argv, callback) {
  cli.parse(argv);

  callback = callback || function () {};

  if (!cli.awsKeyId || !cli.awsSecretKey) {
    return callback('AWS credentials are missing, use `-h` for details.');
  }

  const app = new App({
    accessKeyId: cli.awsKeyId,
    secretAccessKey: cli.awsSecretKey,
  });
  const domain = utils.firstArg(cli.args);

  if (!domain) {
    return callback(
      'A domain is required, e.g. `aws-subdomain test.mydomain.com`'
    );
  }

  if (utils.validAction(cli.action)) {
    app[cli.action](domain, callback);
  } else {
    callback(
      'Invalid action `' +
        cli.action +
        '` specified, valid actions are: ' +
        utils.validActions.join(',')
    );
  }
};
