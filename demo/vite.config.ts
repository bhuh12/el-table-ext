import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ command }) => ({
  root: resolve(process.cwd(), 'demo'),

  base: command === 'serve' ? '/' : '/el-table-ext/',

  resolve: {
    // 路径别名
    alias: [
      {
        find: /^~/,
        replacement: ''
      },
      {
        find: /^el-table-ext/,
        replacement: '../../src'
      }
    ]
  },

  build: {
    /**
     * 指定 CSS 构建目标，避免 `rgba()` 被转换成 `#RGBA`
     * 参考: https://vitejs.dev/config/#build-csstarget
     */
    cssTarget: ['chrome61']
  },

  esbuild: {
    // jsx 支持
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: "import { h } from 'vue';"
  },

  plugins: [
    createVuePlugin({
      // jsx 支持
      jsx: true
    }),

    legacy({
      targets: ['ie >= 10'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
        `
      }
    }
  }
}))
