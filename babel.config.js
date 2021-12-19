// 项目开发阶段用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 移除所有的console
  plugins: [ // 发布产品时候的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}