'use strict';

module.exports = function (domain) {
  let newDomainSplit = domain.split('.');
  let baseDomain = newDomainSplit.slice(1).join('.');
  let subDomain = newDomainSplit[0];
  let rootDomain = newDomainSplit.slice(-2).join('.');

  return {
    root: rootDomain,
    base: baseDomain,
    sub: subDomain,
  };
};
