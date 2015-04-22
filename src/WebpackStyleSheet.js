/*
 * @providesModule StyleSheet
 */

import { transform } from './Extractor';

const stylesheets = [];

function create(spec) {

	const sheetId = 'sheet' + Object.keys(stylesheets).length;

	const wrapped = [
		"import StyleSheet from 'react-inline';",
		'const ' + sheetId + ' = StyleSheet.create(' + JSON.stringify(spec) + ');'
	].join('\n');
	
	const options = { filename: sheetId, vendorPrefixes: true, minify: true, compressClassNames: true };

	const result = transform( wrapped, options );

	const classCode = result.code.replace(/\n\s*/g, '').replace(new RegExp('(^(const|let|var) ' + sheetId + ' ?= ?|;$)', 'g'), '');
	let classNames = {};

	try {
		classNames = eval('(' + classCode + ')');
	}
	catch (err) {
		throw err;
	}

	stylesheets.push(result.css);

	return classNames;
}

function compile() {
	return stylesheets.join('\n');
}

function extractor() {

}

export { create, compile, extractor };
