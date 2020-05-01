const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@ant-prefix': 'app',        // Antd 中所有 CSS 类使用的前缀
      '@border-radius-base': '4px' // 组件/浮层圆角
    },
  }),
  addWebpackPlugin(new CompressionWebpackPlugin({
    test: /\.js$|\.css$/,
    threshold: 1024,
    cache: true
  })),
  addWebpackPlugin(new WebpackBuildNotifierPlugin({
    title: "Room.Cafe Website Build",
    logo: path.resolve("./public/favicon.ico"),
    suppressSuccess: true
  }))
);
