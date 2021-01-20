'use strict';

function createChange(type, baseDomain, subDomainName) {
  type = type || 'CREATE';

  if (arguments.length === 2) {
    subDomainName = baseDomain;
    baseDomain = type;
    type = 'CREATE';
  } else {
    type = type.toUpperCase();
  }

  return {
    Action: type,
    ResourceRecordSet: {
      Name: subDomainName + '.' + baseDomain,
      Type: 'CNAME',
      ResourceRecords: [
        {
          Value: baseDomain,
        },
      ],
      TTL: 3600,
    },
  };
}

module.exports = createChange;
