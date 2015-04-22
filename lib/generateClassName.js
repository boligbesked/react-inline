'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = generateClassName;
/*
 * @providesModule generateClassName
 */

var _compressClassName = require("./compressClassName");

var _compressClassName2 = _interopRequireWildcard(_compressClassName);

var _splitSelector3 = require("./splitSelector");

var _splitSelector4 = _interopRequireWildcard(_splitSelector3);

var invalidChars = /[^_a-z0-9-]/ig;

function generateClassName(id, options) {
  var result = '';

  if (options.prefix) {
    result += options.prefix.replace(invalidChars, '_') + '-';
  } else if (options.prefixes) {
    result += options.prefixes.map(function (p) {
      return p.replace(invalidChars, '_');
    }).join('-') + '-';
  }

  result += id;

  if (options.compressClassNames) {
    var _splitSelector = _splitSelector4['default'](result);

    var _splitSelector2 = _slicedToArray(_splitSelector, 2);

    var className = _splitSelector2[0];
    var selector = _splitSelector2[1];

    return _compressClassName2['default'](className, options) + selector;
  }

  return result;
}

module.exports = exports['default'];