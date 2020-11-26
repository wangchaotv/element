var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');

/**
 * 获取 src 目录下几个目录中的文件名
 * 注意: readdirSync 只能获取指定目录中第一层文件和目录的名词
 *
 * 例如: transitionList是一个数组, 数组元素是 `src/transitionList` 目录中文件和目录的名词 ['collapse-transition.js']
 */
var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(
  path.resolve(__dirname, '../src/transitions')
);

/**
 * lib 目录中存放编译后文件
 * externals对象的key和value为位置对应关系(packages、src/utils、src/mixins、src/transitions、src/locale 中文件被处理后在 lib 中)
 *    例如: { element-ui/packages/alert: 'element-ui/lib/alert' , ...... }
 */
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`;
});

externals['element-ui/src/locale'] = 'element-ui/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[
    `element-ui/src/transitions/${file}`
  ] = `element-ui/lib/transitions/${file}`;
});

externals = [
  Object.assign(
    {
      vue: 'vue', // TODO
    },
    externals
  ),
  nodeExternals(), // TODO
];

exports.externals = externals;

/**
 * 给主要目录配置别名,便于引用
 * main(src) 组件库的源码, 组件源码被提取到 packages 目录中, 在 index.js 中统一导入
 * packages 所有的组件
 * examples 组件库的文档, 可直接在文档中调用组件进行测试
 * element-ui 项目跟目录
 */
exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'element-ui': path.resolve(__dirname, '../'),
};

/**
 * 给 webpack 的 externals 配置使用
 * UMD 打包时,不需要被打包的模块
 */
exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue',
};

/**
 * 不需要babel-loader处理的文件
 * 1. mode_modules 目录下所有的文件都不需要
 * 2. src/utils/popper.js
 * 3. src/utils/date.js
 *
 * popper.js和date.js 是直接将第三方库编译后的代码 copy 到当前项目中,所以无需再次编译
 */
exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
