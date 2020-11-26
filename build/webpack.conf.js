const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('./config');

module.exports = {
  mode: 'production',
  entry: {
    app: ['./src/index.js'] // 打包时的入口文件
  },
  output: {
    path: path.resolve(process.cwd(), './lib'), // element/lib
    filename: 'index.js',
    chunkFilename: '[id].js',
    publicPath: '/dist/',
    libraryTarget: 'umd', // 设置编译后的库支持哪些模块系统
    libraryExport: 'default',
    library: 'ELEMENT',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  /**
   * 解析模块导入路径时的一些配置
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 没写扩展的导入, 根据此配置尝试
    alias: config.alias // 给使用频率高的目录配置别名, 便于导入. TODO: 让 VSCODE 支持使用 alias 时寻址
  },
  // 不需要被打包的模块, 可以从运行时环境中获取
  externals: {
    vue: config.vue
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};
