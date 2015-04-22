"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * @providesModule MemoryCache
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

var cache = {};

var MemoryCache = (function () {
  function MemoryCache(name) {
    _classCallCheck(this, MemoryCache);

    this.name = name;

    this.fetch.bind(this);
    this.clear.bind(this);

    cache[name] = cache[name] || {};
  }

  _createClass(MemoryCache, [{
    key: "fetch",
    value: function fetch(key, miss) {
      if (hasOwnProperty.call(cache[this.name], key)) {
        return cache[this.name][key];
      }

      cache[this.name][key] = miss(_Object$keys(cache[this.name]));
      return cache[this.name][key];
    }
  }, {
    key: "clear",
    value: function clear() {
      cache[this.name] = {};
    }
  }]);

  return MemoryCache;
})();

exports["default"] = MemoryCache;
module.exports = exports["default"];