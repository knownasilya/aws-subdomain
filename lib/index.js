'use strict';

var extend = require('extend');
var find = require('lodash.find');
var AWS = require('aws-sdk');
var createChange = require('./create-change');
var splitDomain = require('./split-domain');
var splitZoneId = require('./zone-id');
var baseParams = {
  ChangeBatch: {
    Changes: [],
    Comment: 'New subdomain'
  }
};

function App(options) {
  if (!(this instanceof App)) {
    return new App(options);
  }

  options = options || {};

  if (!options.accessKeyId || !options.secretAccessKey) {
    throw 'Invalid options specified; `accessKeyId` and `secretAccessKey` are required.';
  }

  this.api = new AWS.Route53({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  });
}

App.prototype.create = function (newDomain, callback) {
  var api = this.api;
  var domainDetails = splitDomain(newDomain);
  var params = extend({}, baseParams);
  var rootDomain = domainDetails.root;
  var baseDomain = domainDetails.base;
  var subDomain = domainDetails.sub;

  this._getHostedZoneId(rootDomain, function (err, id) {
    if (err) {
      return callback(err);
    }

    var change = createChange('create', baseDomain, subDomain);

    params.HostedZoneId = id;      
    params.ChangeBatch.Changes = [change];
    params.ChangeBatch.Comment += ': ' + subDomain + '.' + baseDomain;

    api.changeResourceRecordSets(params, callback);
  });
};

App.prototype._getHostedZoneId = function (domain, callback, nextMarker) {
  var options = {};

  if (nextMarker) {
    options.Marker = nextMarker;
  }

  this.api.listHostedZones(options, function (err, data) {
    if (err) {
      return callback(err);
    }

    if (data && data.HostedZones) {
      var result = find(data.HostedZones, function (item) {
        return item.Name === domain + '.';
      });

      if (result) {
        callback(undefined, splitZoneId(result.Id));
      }
      else if (!result && data.IsTruncated && data.NextMarker) {
        getHostedZoneId(domain, callback, data.NextMarker);
      }
      else {
        callback();
      }
    }
  });
};

module.exports = App;
