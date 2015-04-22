'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = transformStyleSheetObjectIntoSpecification;
/*
 * @providesModule transformStyleSheetObjectIntoSpecification
 */

var _assert = require('assert');

var _assert2 = _interopRequireWildcard(_assert);

var _foreach = require('foreach');

var _foreach2 = _interopRequireWildcard(_foreach);

var _splitSelector4 = require("./splitSelector");

var _splitSelector5 = _interopRequireWildcard(_splitSelector4);

var isMediaQueryDeclaration = /^@/;
var hasAttachedSelector = /[^:\[]+[:\[]/;
var isStandaloneSelector = /^[:\[]/;
var isValidStyleName = /^.-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

function transformStyleSheetObjectIntoSpecification(content) {
  assertPlainObject(content);

  var styles = {};

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      processMediaQuery(styles, key.substring(1), value);
    } else if (isStandaloneSelector.test(key)) {
      _assert2['default'](false, 'stand-alone selectors are not allowed at the top-level');
    } else if (hasAttachedSelector.test(key)) {
      var _splitSelector = _splitSelector5['default'](key);

      var _splitSelector2 = _slicedToArray(_splitSelector, 2);

      var styleName = _splitSelector2[0];
      var selectorName = _splitSelector2[1];

      processStyleAndSelector(styles, styleName, selectorName, value);
    } else {
      processStyle(styles, key, value);
    }
  });

  return styles;
}

function processMediaQuery(styles, mediaQueryName, content) {
  assertPlainObject(content);

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      _assert2['default'](false, 'media queries cannot be nested into each other');
    } else if (isStandaloneSelector.test(key)) {
      _assert2['default'](false, 'stand-alone selectors are not allowed in top-level media queries');
    } else if (hasAttachedSelector.test(key)) {
      var _splitSelector3 = _splitSelector5['default'](key);

      var _splitSelector32 = _slicedToArray(_splitSelector3, 2);

      var styleName = _splitSelector32[0];
      var selectorName = _splitSelector32[1];

      processStyleAndMediaQueryAndSelector(styles, styleName, mediaQueryName, selectorName, value);
    } else {
      processStyleAndMediaQuery(styles, key, mediaQueryName, value);
    }
  });
}

function processStyle(styles, styleName, content) {
  assertPlainObject(content);

  var style = initStyleSpec(styles, styleName);

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      processStyleAndMediaQuery(styles, styleName, key.substring(1), value);
    } else if (isStandaloneSelector.test(key)) {
      processStyleAndSelector(styles, styleName, key, value);
    } else if (hasAttachedSelector.test(key)) {
      _assert2['default'](false, 'styles cannot be nested into each other');
    } else {
      processRule(style.rules, key, value);
    }
  });
}

function processStyleAndMediaQuery(styles, styleName, mediaQueryName, content) {
  assertPlainObject(content);

  var style = initStyleSpec(styles, styleName);
  var mediaQuery = initMediaQuerySpec(style.mediaQueries, mediaQueryName);

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      _assert2['default'](false, 'media queries cannot be nested into each other');
    } else if (isStandaloneSelector.test(key)) {
      processStyleAndMediaQueryAndSelector(styles, styleName, mediaQueryName, key, value);
    } else if (hasAttachedSelector.test(key)) {
      _assert2['default'](false, 'styles cannot be nested into each other');
    } else {
      processRule(mediaQuery.rules, key, value);
    }
  });
}

function processStyleAndSelector(styles, styleName, selectorName, content) {
  assertPlainObject(content);

  var style = initStyleSpec(styles, styleName);
  var selector = initSelectorSpec(style.selectors, selectorName);

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      _assert2['default'](false, 'media queries cannot be nested into selectors');
    } else if (isStandaloneSelector.test(key)) {
      processStyleAndSelector(styles, styleName, selectorName + key, value);
    } else if (hasAttachedSelector.test(key)) {
      _assert2['default'](false, 'styles cannot be nested into each other');
    } else {
      processRule(selector.rules, key, value);
    }
  });
}

function processStyleAndMediaQueryAndSelector(styles, styleName, mediaQueryName, selectorName, content) {
  _assert2['default'](isPlainObject(content), 'style value must be a plain object');

  var style = initStyleSpec(styles, styleName);
  var mediaQuery = initMediaQuerySpec(style.mediaQueries, mediaQueryName);
  var selector = initSelectorSpec(mediaQuery.selectors, selectorName);

  _foreach2['default'](content, function (value, key) {
    if (isMediaQueryDeclaration.test(key)) {
      _assert2['default'](false, 'media queries cannot be nested into each other');
    } else if (isStandaloneSelector.test(key)) {
      processStyleAndMediaQueryAndSelector(styles, styleName, mediaQueryName, selectorName + key, value);
    } else if (hasAttachedSelector.test(key)) {
      _assert2['default'](false, 'styles cannot be nested into each other');
    } else {
      processRule(selector.rules, key, value);
    }
  });
}

function processRule(rules, key, value) {
  _assert2['default'](typeof value === 'string' || typeof value === 'number', 'value must be a number or a string');
  rules[key] = value;
}

function initStyleSpec(styles, name) {
  _assert2['default'](isValidStyleName.test(name), 'style name is invalid');

  styles[name] = styles[name] || { rules: {}, selectors: {}, mediaQueries: {} };
  return styles[name];
}

function initMediaQuerySpec(mediaQueries, name) {
  mediaQueries[name] = mediaQueries[name] || { rules: {}, selectors: {} };
  return mediaQueries[name];
}

function initSelectorSpec(selectors, name) {
  selectors[name] = selectors[name] || { rules: {} };
  return selectors[name];
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function assertPlainObject(content) {
  _assert2['default'](isPlainObject(content), 'value must be a plain object');
}
module.exports = exports['default'];