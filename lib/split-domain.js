'use strict';

module.exports = function (domain) {
  var newDomainSplit = domain.split('.');
  var baseDomain = newDomainSplit.slice(1).join('.');
  var subDomain = newDomainSplit[0];
  var rootDomain = newDomainSplit.slice(-2).join('.');

  return {
    root: rootDomain,
    base: baseDomain,
    sub: subDomain
  };
};
