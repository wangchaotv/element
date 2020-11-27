/**
 * 主要功能:
 *
 * 1. 将 /src/locale/lang 中的 js 文件用 babel 转换成 umd 规范
 */
var fs = require('fs');
var save = require('file-save');
var resolve = require('path').resolve;
var basename = require('path').basename;
var localePath = resolve(__dirname, '../../src/locale/lang');
/**
 * /src/locale/lang
 * 组件的各国语言的文案
 * ['ug-CN.js', 'uz-UZ.js', 'vi.js', 'zh-CN.js', 'zh-TW.js', ....]
 */
var fileList = fs.readdirSync(localePath);

var transform = function(filename, name, cb) {
  require('babel-core').transformFile(
    resolve(localePath, filename),
    {
      plugins: [
        'add-module-exports',
        ['transform-es2015-modules-umd', { loose: true }],
      ],
      moduleId: name,
    },
    cb
  );
};

fileList
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');

    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace("define('", "define('element/locale/")
          .replace(
            'global.',
            'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.'
          );
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });
