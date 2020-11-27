/**
 * 主要功能:
 *
 * 1. 生成 packages/theme-chalk/src/index.scss 文件, index.scss 中用 @import 将所有的样式文件汇总
 *
 * 如果发现某个组件没有对用的 scss 文件,自动创建
 */
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = ['theme-chalk'];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

/**
 * 1. 遍历组件名
 * 2. 在 packages/theme-chalk/src 查找组件组件对应的 scss
 */
themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default'; // 目前看起来没用, 固定输出 true
  // @import "./base.scss";\n
  var indexContent = isSCSS
    ? '@import "./base.scss";\n'
    : '@import "./base.css";\n';
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    // fileName -> pagination.scss
    var fileName = key + (isSCSS ? '.scss' : '.css');
    // indexContent -> @import "./base.scss";\n@import "./pagination.scss";\n
    indexContent += '@import "./' + fileName + '";\n';
    // 例如: filePath -> /Users/admin/vue-family/element/packages/theme-chalk/src/pagination.scss
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    // 如果 packages/theme-chalk/src 下没有某个组件对应的样式文件,则创建该文件
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  // indexContent -> @import "./base.scss";\n@import "./pagination.scss";\n@import "./dialog.scss";\n ...............
  // outputIndexPath -> /Users/admin/vue-family/element/packages/theme-chalk/src/index.scss
  let outputIndexPath = path.resolve(
    basepath,
    theme,
    'src',
    isSCSS ? 'index.scss' : 'index.css'
  );
  fs.writeFileSync(outputIndexPath, indexContent);
});
