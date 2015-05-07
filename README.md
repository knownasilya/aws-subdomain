aws-subdomain
=============

Create subdomains for AWS without diving into the AWS SDK

[![NPM][npm-badge]][npm-badge-url]  
[![Build Status][travis-badge]][travis-badge-url]

## Usage

First install this module with `npm install aws-subdomain --save`.

```js
var subdomain = require('aws-subdomain')({
  accessKeyId: 'your-id-here',
  secretAccessKey: 'your-secret-here'
});

subdomain.create('i.wear.sho.es', function (err, result) {
  // handle error/result
});
```

We will find the correct HostedZoneId based on the root domain, e.g. 'sho.es'
and will create the subdomain for you.

## CLI

```shell
npm install aws-subdomain -g
aws-subdomain new.shiny.po.ny -i [awsAccessKeyId] -s [awsSecretAccessKey]
```

Can also pass `-a` with 'upsert', or 'delete'. The default is to 'create'.

By default the AWS credentials come from environment variables 
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, but can be
overridden with `-i` and `-s` respectively.

## Test

```shell
npm test
# or for TAP output
node test
```

## TODO

* Add event for completion of change
* Add upsert/delete functions
* Support promises
* Add default `baseDomain` to options/integrate with actions.

[travis-badge-url]: https://travis-ci.org/knownasilya/aws-subdomain
[travis-badge]: https://travis-ci.org/knownasilya/aws-subdomain.svg?branch=master
[npm-badge-url]: https://nodei.co/npm/aws-subdomain/
[npm-badge]: https://nodei.co/npm/aws-subdomain.png?downloads=true&stars=true
