import ElTableExt from './Table.vue'

const install = function (Vue) {
  if (install.installed) return

  install.installed = true

  Vue.component(ElTableExt.name, ElTableExt)
}

ElTableExt.install = install

// 如果浏览器环境且拥有全局Vue，则自动安装组件
/* if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ElTableExt)
} */

export default ElTableExt
