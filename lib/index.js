'use strict';

const extend = require('extend');
const find = require('lodash.find');
const AWS = require('aws-sdk');
const createChange = require('./create-change');
const splitDomain = require('./split-domain');
const splitZoneId = require('./zone-id');

let baseParams = {
  ChangeBatch: {
    Changes: [],
    Comment: '',
  },
};

function App(options) {
  if (!(this instanceof App)) {
    return new App(options);
  }

  options = options || {};

  if (!options.accessKeyId || !options.secretAccessKey) {
    throw new Error(
      'Invalid options specified; `accessKeyId` and `secretAccessKey` are required.'
    );
  }

  this.api = new AWS.Route53({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
  });
}

App.prototype.create = function (newDomain, callback) {
  let api = this.api;
  let domainDetails = splitDomain(newDomain);
  let params = extend({}, baseParams);
  let rootDomain = domainDetails.root;
  let baseDomain = domainDetails.base;
  let subDomain = domainDetails.sub;

  this._getHostedZoneId(rootDomain, function (err, id) {
    if (err) {
      return callback(err);
    }

    let change = createChange('create', baseDomain, subDomain);

    params.HostedZoneId = id;
    params.ChangeBatch.Changes = [change];
    params.ChangeBatch.Comment =
      'create domain: ' + subDomain + '.' + baseDomain;

    api.changeResourceRecordSets(params, callback);
  });
};
App.prototype.createWithPointValue = function (newDomain, value, callback) {
  let api = this.api;
  let domainDetails = splitDomain(newDomain);
  let params = extend({}, baseParams);
  let rootDomain = domainDetails.root;
  let baseDomain = domainDetails.base;
  let subDomain = domainDetails.sub;

  this._getHostedZoneId(rootDomain, function (err, id) {
    if (err) {
      return callback(err);
    }

    let change = createChange('create', baseDomain, subDomain, value);

    params.HostedZoneId = id;
    params.ChangeBatch.Changes = [change];
    params.ChangeBatch.Comment =
      'create domain: ' + subDomain + '.' + baseDomain;

    api.changeResourceRecordSets(params, callback);
  });
};

App.prototype.delete = function (existingDomain, callback) {
  let api = this.api;
  let domainDetails = splitDomain(existingDomain);
  let params = extend({}, baseParams);
  let rootDomain = domainDetails.root;
  let baseDomain = domainDetails.base;
  let subDomain = domainDetails.sub;

  this._getHostedZoneId(rootDomain, function (err, id) {
    if (err) {
      return callback(err);
    }

    let change = createChange('delete', baseDomain, subDomain);

    params.HostedZoneId = id;
    params.ChangeBatch.Changes = [change];
    params.ChangeBatch.Comment =
      'delete domain: ' + subDomain + '.' + baseDomain;

    api.changeResourceRecordSets(params, callback);
  });
};

App.prototype._getHostedZoneId = function (domain, callback, nextMarker) {
  let options = {};

  if (nextMarker) {
    options.Marker = nextMarker;
  }

  this.api.listHostedZones(options, function (err, data) {
    if (err) {
      return callback(err);
    }

    if (data && data.HostedZones) {
      let result = find(data.HostedZones, function (item) {
        return item.Name === domain + '.';
      });

      if (result) {
        callback(undefined, splitZoneId(result.Id));
      } else if (!result && data.IsTruncated && data.NextMarker) {
        getHostedZoneId(domain, callback, data.NextMarker);
      } else {
        callback();
      }
    }
  });
};

module.exports = App;
