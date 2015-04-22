'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
/*
 * @providesModule WebpackStyleSheet
 */

var _transform = require('./Extractor');

var stylesheets = [];

function create(spec) {

	var sheetId = 'sheet' + _Object$keys(stylesheets).length;

	var wrapped = ['import StyleSheet from \'react-inline\';', 'const ' + sheetId + ' = StyleSheet.create(' + JSON.stringify(spec) + ');'].join('\n');

	var options = { filename: sheetId, vendorPrefixes: true, minify: true, compressClassNames: true };

	var result = _transform.transform(wrapped, options);

	var classCode = result.code.replace(/\n\s*/g, '').replace(new RegExp('(^(const|let|var) ' + sheetId + ' ?= ?|;$)', 'g'), '');
	var classNames = {};

	try {
		classNames = eval('(' + classCode + ')');
	} catch (err) {
		throw err;
	}

	stylesheets.push(result.css);

	return classNames;
}

function compile() {
	return stylesheets.join('\n');
}

function loader(source) {
	console.log('React Inline - webpack loader');
	return source;
}

exports.create = create;
exports.compile = compile;
exports.loader = loader;