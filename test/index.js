'use strict';

var test = require('tape');
var createChange = require('../lib/create-change');
var splitDomain = require('../lib/split-domain');
var splitZoneId = require('../lib/zone-id');

test('hosted zone id', function (t) {
  var rawId = '/hostedzone/Z255TSWNFQ4K7P';
  var id = splitZoneId(rawId);

  t.equal(id, 'Z255TSWNFQ4K7P');
  t.end();
});

test('domain split', function (t) {
  var split = splitDomain('my.super.fancy.domain.com');

  t.same(split, {
    root: 'domain.com',
    base: 'super.fancy.domain.com',
    sub: 'my'
  });
  t.end();
});

test('create correct change object', function (t) {
  var change = createChange('upsert', 'beta.blob.com', 'test1');

  t.same(change, {
    Action: 'UPSERT',
    ResourceRecordSet: {
      Name: 'test1.beta.blob.com',
      Type: 'CNAME',
      ResourceRecords: [
        {
          Value: 'beta.blob.com'
        },
      ],
      TTL: 3600
    }
  });
  t.end();
});
