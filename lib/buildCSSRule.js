'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = buildCSSRule;
/*
 * @providesModule buildCSSRule
 */

var isUnquotedContentValue = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;
var uppercaseLetter = /([A-Z])/g;

var unitlessNumbers = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

function buildCSSRule(key, value, options) {
  if (!unitlessNumbers[key] && typeof value === 'number') {
    value = '' + value + 'px';
  } else if (key === 'content' && !isUnquotedContentValue.test(value)) {
    value = '\'' + value.replace(/'/g, '\\\'') + '\'';
  }

  return hyphenate(key) + ': ' + value + ';';
}

function hyphenate(string) {
  return string.replace(uppercaseLetter, '-$1').toLowerCase();
}
module.exports = exports['default'];