'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*
 * @providesModule Bundler
 */

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireWildcard(_glob);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireWildcard(_mkdirp);

function bundle(sourceDir) {
  var filename = arguments[1] === undefined ? 'bundle.css' : arguments[1];
  var options = arguments[2] === undefined ? {} : arguments[2];

  var bundleFile = _path2['default'].join(sourceDir, filename);

  var globOptions = { cwd: sourceDir, realpath: true, ignore: bundleFile };
  var globPattern = options.globPattern || '**/*.css';

  var readOptions = { encoding: options.sourceCharset || 'utf8' };
  var writeOptions = { encoding: options.outputCharset || 'utf8' };

  var cssFiles = _glob2['default'].sync(globPattern, globOptions);

  var bundleCSS = cssFiles.reduce(function (memo, filePath) {
    return memo + _fs2['default'].readFileSync(filePath, readOptions);
  }, '');

  _mkdirp2['default'].sync(_path2['default'].dirname(bundleFile));
  _fs2['default'].writeFileSync(bundleFile, bundleCSS, writeOptions);
}

exports['default'] = { bundle: bundle };
module.exports = exports['default'];