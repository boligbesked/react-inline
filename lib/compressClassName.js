'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = compressClassName;
/*
 * @providesModule compressClassName
 */

var _DiskCache = require("./DiskCache");

var _DiskCache2 = _interopRequireWildcard(_DiskCache);

var _MemoryCache = require("./MemoryCache");

var _MemoryCache2 = _interopRequireWildcard(_MemoryCache);

var cacheName = 'classnames';

function getCache(options) {
  if (options.cacheDir) {
    return new _DiskCache2['default'](cacheName, options);
  } else {
    return new _MemoryCache2['default'](cacheName);
  }
}

function clearCache(options) {
  getCache(options).clear();
}

function compressClassName(className, options) {
  var cache = getCache(options);

  return cache.fetch(className, function (keys) {
    return '_' + keys.length.toString(36).split('').reverse().join('');
  });
}

compressClassName.clearCache = clearCache;
module.exports = exports['default'];