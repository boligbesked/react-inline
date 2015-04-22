'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*
 * @providesModule buildCSS
 */

var _autoprefixer = require('autoprefixer-core');

var _autoprefixer2 = _interopRequireWildcard(_autoprefixer);

var _CleanCSS = require('clean-css');

var _CleanCSS2 = _interopRequireWildcard(_CleanCSS);

var _foreach = require('foreach');

var _foreach2 = _interopRequireWildcard(_foreach);

var _transformSpecificationIntoCSS = require("./transformSpecificationIntoCSS");

var _transformSpecificationIntoCSS2 = _interopRequireWildcard(_transformSpecificationIntoCSS);

exports['default'] = function (stylesheets, options) {
  var css = '';

  _foreach2['default'](stylesheets, function (stylesheet, name) {
    var cssOptions = _Object$assign({}, options);
    cssOptions.prefixes = [options.filename, name];

    css += _transformSpecificationIntoCSS2['default'](stylesheet, cssOptions);

    if (css.length) {
      css += '\n';
    }
  });

  if (css.length === 0) {
    return null;
  }

  var vp = options.vendorPrefixes;

  if (vp) {
    if (typeof vp === 'object') {
      css = _autoprefixer2['default'](vp).process(css).css;
    } else {
      css = _autoprefixer2['default'].process(css).css;
    }
  }

  if (options.minify) {
    css = new _CleanCSS2['default']().minify(css).styles;
  }

  return css;
};

module.exports = exports['default'];