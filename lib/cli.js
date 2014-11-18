'use strict';

var cli = require('ltcdr');
var pkg = require('../package');
var App = require('./');

cli
  .version(pkg.version)
  .usage('[options] <subdomain>')
  .description('Creates a new subdomain based on the full domain desired')
  .option('-a, --action [name]', 'The action to take (create|delete|upsert)', 'create')
  .option('-i, --aws-key-id', 'AWS AccessKeyId, comes from the `AWS_ACCESS_KEY_ID` env by default', process.env.AWS_ACCESS_KEY_ID)
  .option('-s, --aws-secret-key', 'AWS SecretAccessKey, comes from the `AWS_SECRET_ACCESS_KEY` env by default', process.env.AWS_SECRET_ACCESS_KEY)
  .parse(process.argv);

new App({
  accessKeyId: cli.awsKeyId,
  secretAccessKey: cli.awsSecretKey
}).create(firstArg(cli.args), function (err, data) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(data);
  process.exit();
});

function firstArg(args) {
  var split = args.split(' ');

  return split && split.length ? split[0].trim() : args;
}
