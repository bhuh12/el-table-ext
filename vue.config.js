// 构建目标是否为库
const isBuildLib =
  (process.env.npm_lifecycle_script || '').indexOf('--target lib') > 0

module.exports = {
  publicPath: '', // 相对路径

  outputDir: isBuildLib ? 'dist/lib' : 'dist/demo',

  // webpack 链式配置
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
  },

  css: {
    loaderOptions: {
      sass: {
        // scss公共变量
        // prependData: isBuildLib ? undefined : `@import "src/assets/scss/variables.scss";`
      }
    }
  }
}
