'use strict';

function createChange(type, baseDomain, subDomainName) {
  type = type || 'CREATE';
  type = type.toUpperCase();

  if (arguments.length === 2) {
    subDomainName = baseDomain;
    baseDomain = type;
  }

  return {
    Action: type,
    ResourceRecordSet: {
      Name: subDomainName + '.' + baseDomain,
      Type: 'CNAME',
      ResourceRecords: [
        {
          Value: baseDomain
        },
      ],
      TTL: 3600
    }
  };
}

module.exports = createChange;
