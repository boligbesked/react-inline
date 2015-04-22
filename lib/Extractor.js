'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequire = require('babel-runtime/helpers/interop-require')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.transform = transform;
exports.transformFile = transformFile;
exports.transformFileSync = transformFileSync;

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _babelize = require('babel-core');

var _transformAST = require("./transformAST");

var _transformAST2 = _interopRequireWildcard(_transformAST);

var _buildCSS = require("./buildCSS");

var _buildCSS2 = _interopRequireWildcard(_buildCSS);

/*
 * @providesModule Extractor
 */

var _default = require("./transformObjectExpressionIntoStyleSheetObject");

exports.transformObjectExpressionIntoStyleSheetObject = _interopRequire(_default);

var _default2 = require("./transformStyleSheetObjectIntoSpecification");

exports.transformStyleSheetObjectIntoSpecification = _interopRequire(_default2);

var _default3 = require("./transformSpecificationIntoCSS");

exports.transformSpecificationIntoCSS = _interopRequire(_default3);

function transform(source) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  options.filename = options.filename || 'unknown';

  var tfs = _babelize.transform.transformers;
  var cmf = _babelize.transform.moduleFormatters.common;

  _babelize.transform.transformers = {};
  _babelize.transform.moduleFormatters.common = function () {};

  var stylesheets = {};

  var babelOptions = {
    ast: false,
    plugins: [_transformAST2['default'](stylesheets, options)]
  };

  var code = _babelize.transform(source, babelOptions).code;
  var css = _buildCSS2['default'](stylesheets, options);

  _babelize.transform.transformers = tfs;
  _babelize.transform.moduleFormatters.common = cmf;

  return { code: code, css: css };
}

function transformFile(filename, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options.filename = filename;

  _fs2['default'].readFile(filename, function (err, source) {
    if (err) {
      return callback(err);
    }

    var result = undefined;

    try {
      result = transform(source, options);
    } catch (exc) {
      return callback(exc);
    }

    callback(null, result);
  });
}

function transformFileSync(filename) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  options.filename = filename;

  return transform(_fs2['default'].readFileSync(filename), options);
}