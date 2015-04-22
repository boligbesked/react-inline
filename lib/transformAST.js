'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*
 * @providesModule transformAST
 */

var _assert = require('assert');

var _assert2 = _interopRequireWildcard(_assert);

var _Transformer$t = require('babel-core');

var _transformObjectExpressionIntoStyleSheetObject = require("./transformObjectExpressionIntoStyleSheetObject");

var _transformObjectExpressionIntoStyleSheetObject2 = _interopRequireWildcard(_transformObjectExpressionIntoStyleSheetObject);

var _transformStyleSheetObjectIntoSpecification = require("./transformStyleSheetObjectIntoSpecification");

var _transformStyleSheetObjectIntoSpecification2 = _interopRequireWildcard(_transformStyleSheetObjectIntoSpecification);

var _generateClassName = require("./generateClassName");

var _generateClassName2 = _interopRequireWildcard(_generateClassName);

exports['default'] = function (stylesheets, options) {
  return new _Transformer$t.Transformer('react-inline', {
    CallExpression: function CallExpression(node, parent) {
      if (!this.get('callee').matchesPattern('StyleSheet.create')) {
        return;
      }

      _assert2['default'](_Transformer$t.types.isVariableDeclarator(parent), 'return value of StyleSheet.create(...) must be assigned to a variable');

      var sheetId = parent.id.name;
      var expr = node.arguments[0];

      _assert2['default'](expr, 'StyleSheet.create(...) call is missing an argument');

      var obj = _transformObjectExpressionIntoStyleSheetObject2['default'](expr);
      var sheet = _transformStyleSheetObjectIntoSpecification2['default'](obj);

      stylesheets[sheetId] = sheet;

      var gcnOptions = _Object$assign({}, options);
      gcnOptions.prefixes = [options.filename, sheetId];

      var properties = [];

      _Object$keys(sheet).forEach(function (styleId) {
        var className = _generateClassName2['default'](styleId, gcnOptions);
        var key = _Transformer$t.types.identifier(styleId);
        var value = _Transformer$t.types.literal(className);
        var property = _Transformer$t.types.property('init', key, value);

        properties.push(property);
      });

      this.replaceWith(_Transformer$t.types.objectExpression(properties));
    },

    ImportDeclaration: function ImportDeclaration(node) {
      if (node.source.value === 'react-inline') {
        this.remove();
      }
    },

    VariableDeclarator: function VariableDeclarator(node, parent) {
      if (!_Transformer$t.types.isIdentifier(node.id, { name: 'StyleSheet' })) {
        return;
      }

      if (!_Transformer$t.types.isCallExpression(node.init)) {
        return;
      }

      if (!_Transformer$t.types.isIdentifier(node.init.callee, { name: 'require' })) {
        return;
      }

      if (!_Transformer$t.types.isLiteral(node.init.arguments[0], { value: 'react-inline' })) {
        return;
      }

      if (parent.declarations.length > 1) {
        this.remove();
      } else {
        this.parentPath.remove();
      }
    }
  });
};

module.exports = exports['default'];