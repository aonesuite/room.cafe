const { override, fixBabelImports, addLessLoader } = require('customize-cra');

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
);
