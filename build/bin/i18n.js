'use strict';
/**
 * 此文件主要功能:
 *
 * examples/i18n 页面、组件的国际化文案
 * examples/pages/template 项目文档的文档模板(标准的 vue 格式)
 *
 * 将模板中的文案变量替换成对应的语言文案, 并写入 examples/pages 下对应的语言目录
 */
var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach((lang) => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${lang.lang}`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${lang.lang}`));
  }

  Object.keys(lang.pages).forEach((page) => {
    var templatePath = path.resolve(
      __dirname,
      `../../examples/pages/template/${page}.tpl`
    );
    var outputPath = path.resolve(
      __dirname,
      `../../examples/pages/${lang.lang}/${page}.vue`
    );
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach((key) => {
      // 将模板中的变量替换成值
      content = content.replace(
        new RegExp(`<%=\\s*${key}\\s*>`, 'g'),
        pairs[key]
      );
    });

    fs.writeFileSync(outputPath, content);
  });
});
