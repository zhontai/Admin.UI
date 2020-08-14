const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isDev = process.env.NODE_ENV === 'development'
const name = defaultSettings.title || '中台admin'

// 官方配置说明 https://cli.vuejs.org/zh/config/#vue-config-js
module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // assetsDir: 'static',
  lintOnSave: isDev,
  productionSourceMap: false,
  devServer: {
    // 自动启动浏览器
    open: true,
    port: 9000,
    // 浏览器弹出错误
    overlay: {
      warnings: false,
      errors: true
    },
    // 配置多个代理
    // detail: https://cli.vuejs.org/config/#devserver-proxy
    proxy: {
      ['^' + process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      },
      '^/upload': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      },
      '^/images': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      },
      '^/swagger': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 发布时关闭警告
    performance: {
      hints: false
    }
  },
  // webpack配置
  chainWebpack(config) {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    // config.when(isDev, config => config.devtool('cheap-source-map'))

    config.when(!isDev, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
