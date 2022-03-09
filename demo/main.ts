import Vue from 'vue'
import VueCompotition from '@vue/composition-api'

// 引入 Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 el-table-ext
import ElTableExt from '../lib'

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(VueCompotition)
Vue.use(ElementUI, { size: 'mini' })
Vue.use(ElTableExt)

new Vue({
  render: h => h(App)
}).$mount('#app')
