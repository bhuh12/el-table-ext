import ElTableExt from './Table.vue'
import ElTableFix from './ElTableFix'

const install = function (Vue, options = {}) {
  if (install.installed) return

  if (!options.ElTable) {
    throw new Error(`[el-table-ext] 安装错误！
    本插件依赖 Element-Table，请使用如下代码初始化安装：
      // 引入 Element
      import ElementUI, { Table as ElTable } from 'element-ui'
      import 'element-ui/lib/theme-chalk/index.css'
      
      // 引入 el-table-ext
      import ElTableExt from 'el-table-ext'
      import 'el-table-ext/dist/lib/el-table-ext.css'
      
      Vue.use(ElementUI)
      Vue.use(ElTableExt, { ElTable })
    `)
  }

  install.installed = true
  ElTableFix.extends = options.ElTable

  Vue.component(ElTableExt.name, ElTableExt)
}

ElTableExt.install = install

// 如果浏览器环境且拥有全局Vue，则自动安装组件
/* if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ElTableExt)
} */

export default ElTableExt
