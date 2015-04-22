'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = transformObjectExpressionIntoStyleSheetObject;
/*
 * @providesModule transformObjectExpressionIntoStyleSheetObject
 */

var _assert = require('assert');

var _assert2 = _interopRequireWildcard(_assert);

var _t = require('babel-core');

var isBlank = /^\s*$/;

function transformObjectExpressionIntoStyleSheetObject(expr) {
  _assert2['default'](_t.types.isObjectExpression(expr), 'must be a object expression');

  var result = {};

  expr.properties.forEach(function (property) {
    processTopLevelProperty(property.key, property.value, result);
  });

  return result;
}

function processTopLevelProperty(key, value, result) {
  var name = keyToName(key);

  _assert2['default'](_t.types.isObjectExpression(value), 'top-level value must be a object expression');

  result[name] = {};

  processProperties(value.properties, result[name]);
}

function processProperties(properties, result) {
  properties.forEach(function (property) {
    processProperty(property.key, property.value, result);
  });
}

function processProperty(key, value, result) {
  var name = keyToName(key);

  if (_t.types.isLiteral(value)) {
    var val = value.value;

    _assert2['default'](typeof val === 'string' || typeof val === 'number', 'value must be a string or number');

    if (typeof val === 'string') {
      _assert2['default'](!isBlank.test(val), 'string value cannot be blank');
    }

    result[name] = val;
  } else if (_t.types.isObjectExpression(value)) {
    result[name] = {};

    processProperties(value.properties, result[name]);
  } else if (_t.types.isUnaryExpression(value, { prefix: true, operator: '-' })) {
    _assert2['default'](_t.types.isLiteral(value.argument), 'invalid unary argument type');

    result[name] = -value.argument.value;
  } else {
    _assert2['default'](false, 'invalid value expression type');
  }
}

function keyToName(key) {
  _assert2['default'](_t.types.isIdentifier(key) || _t.types.isLiteral(key) && typeof key.value === 'string', 'key must be a string or identifier');

  return key.name || key.value;
}
module.exports = exports['default'];