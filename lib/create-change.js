'use strict';

function createChange(type, baseDomain, subDomainName, value) {
  type = type || 'CREATE';
  value = value ? value : baseDomain;
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
          Value: value,
        },
      ],
      TTL: 3600,
    },
  };
}

module.exports = createChange;
