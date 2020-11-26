/**
 * 此文件主要功能:
 *
 * 1. 将历史版本号和当前版本号合并
 * 2. 将合并后的版本号列表写入 examples/versions.json 文件
 */

var fs = require('fs');
var path = require('path');
// 当前最新版本号
var version = process.env.VERSION || require('../../package.json').version;
/**
 * 历史版本
 */
var content = {
  '1.4.13': '1.4',
  '2.0.11': '2.0',
  '2.1.0': '2.1',
  '2.2.2': '2.2',
  '2.3.9': '2.3',
  '2.4.11': '2.4',
  '2.5.4': '2.5',
  '2.6.3': '2.6',
  '2.7.2': '2.7',
  '2.8.2': '2.8',
  '2.9.2': '2.9',
  '2.10.1': '2.10',
  '2.11.1': '2.11',
  '2.12.0': '2.12',
};
// 如果当前版本号不在历史版本配置中, 则主动写入
if (!content[version]) content[version] = '2.13';
// 将版本号配置写入 examples/versions.json
fs.writeFileSync(
  path.resolve(__dirname, '../../examples/versions.json'),
  JSON.stringify(content)
);
