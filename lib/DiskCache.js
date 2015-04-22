'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*
 * @providesModule DiskCache
 */

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireWildcard(_mkdirp);

var hasOwnProperty = Object.prototype.hasOwnProperty;

function remove(filePath) {
  if (_fs2['default'].existsSync(filePath)) {
    _fs2['default'].unlinkSync(filePath);
  }
}

function load(filePath) {
  if (!_fs2['default'].existsSync(filePath)) {
    _mkdirp2['default'].sync(_path2['default'].dirname(filePath));
    store({}, filePath);
    return {};
  }

  var data = _fs2['default'].readFileSync(filePath, { encoding: 'utf8' });

  return JSON.parse(data);
}

function store(data, filePath) {
  _fs2['default'].writeFileSync(filePath, JSON.stringify(data));
}

var DiskCache = (function () {
  function DiskCache(name, options) {
    _classCallCheck(this, DiskCache);

    this.filePath = _path2['default'].resolve(_path2['default'].join(options.cacheDir, name + '.json'));

    this.fetch.bind(this);
    this.clear.bind(this);
  }

  _createClass(DiskCache, [{
    key: 'fetch',
    value: function fetch(key, miss) {
      var cache = load(this.filePath);

      if (hasOwnProperty.call(cache, key)) {
        return cache[key];
      }

      cache[key] = miss(_Object$keys(cache));

      store(cache, this.filePath);

      return cache[key];
    }
  }, {
    key: 'clear',
    value: function clear() {
      remove(this.filePath);
    }
  }]);

  return DiskCache;
})();

exports['default'] = DiskCache;
module.exports = exports['default'];