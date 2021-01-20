'use strict';

const test = require('tape');
const createChange = require('../lib/create-change');
const splitDomain = require('../lib/split-domain');
const splitZoneId = require('../lib/zone-id');

test('hosted zone id', function (t) {
  const rawId = '/hostedzone/Z255TSWNFQ4K7P';
  const id = splitZoneId(rawId);

  t.equal(id, 'Z255TSWNFQ4K7P');
  t.end();
});

test('hosted zone id - not set', function (t) {
  const id = splitZoneId();

  t.equal(id, undefined);
  t.end();
});

test('hosted zone id - weird', function (t) {
  const id = splitZoneId('/');

  t.equal(id, '');
  t.end();
});

test('domain split', function (t) {
  const split = splitDomain('my.super.fancy.domain.com');

  t.same(split, {
    root: 'domain.com',
    base: 'super.fancy.domain.com',
    sub: 'my',
  });
  t.end();
});

test('create correct change object', function (t) {
  const change = createChange('upsert', 'beta.blob.com', 'test1');

  t.same(change, {
    Action: 'UPSERT',
    ResourceRecordSet: {
      Name: 'test1.beta.blob.com',
      Type: 'CNAME',
      ResourceRecords: [
        {
          Value: 'beta.blob.com',
        },
      ],
      TTL: 3600,
    },
  });
  t.end();
});

test('create correct change object - no type', function (t) {
  const change = createChange('beta.blob.com', 'test1');

  t.same(change, {
    Action: 'CREATE',
    ResourceRecordSet: {
      Name: 'test1.beta.blob.com',
      Type: 'CNAME',
      ResourceRecords: [
        {
          Value: 'beta.blob.com',
        },
      ],
      TTL: 3600,
    },
  });
  t.end();
});
