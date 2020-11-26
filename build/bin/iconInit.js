'use strict';
/**
 * 此文件主要功能:
 *
 * 1. 将 packages/theme-chalk/src/icon.scss 包含中伪元素选择器(:before)的 icon名称部分提取出来
 * 2. 将所有 icon 名称以数组的形式写入 examples/icon.json
 *
 * 例如: .el-icon-coffee:before 提取 coffee, 输出到文件 ['coffee']
 */

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
// 读取字体图标 scss 文件   packages/theme-chalk/src/icon.scss
var fontFile = fs.readFileSync(
  path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'),
  'utf8'
);
// postcss 处理 scss
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

/**
 * 遍历 nodes
 * 提取 node 中 selector 格式类似 .el-icon-setting:before 元素中的 setting 部分, 即 icon 的名称
 */
nodes.forEach((node) => {
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列

/**
 * 将所有 icon 的名称写入 examples/icon.json
 */
fs.writeFile(
  path.resolve(__dirname, '../../examples/icon.json'),
  JSON.stringify(classList),
  () => {}
);
