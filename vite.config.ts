import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    // 路径别名
    alias: [
      {
        find: /^~/,
        replacement: ''
      }
    ]
  },

  build: {
    /**
     * 指定 CSS 构建目标，避免 `rgba()` 被转换成 `#RGBA`
     * 参考: https://vitejs.dev/config/#build-csstarget
     */
    cssTarget: ['chrome61'],

    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'ElTableExt',
      fileName: 'el-table-ext'
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@vue/composition-api', 'element-ui'],

      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          '@vue/composition-api': 'VueCompositionAPI',
          'element-ui': 'ElementUI'
        },

        exports: 'named'
      }
    }
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
    dts({
      include: ['lib']
    })
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
        `
      }
    },

    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              /**
               * 去除 `@charse` 警告
               * 参考：https://github.com/vitejs/vite/issues/5833
               */
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  }
})
