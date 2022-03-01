import Vue from 'vue'

// 引入 Element
import ElementUI, { Table as ElTable } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 el-table-ext
import ElTableExt from '../lib'

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(ElementUI, { size: 'mini' })
Vue.use(ElTableExt, { ElTable })

new Vue({
  render: h => h(App)
}).$mount('#app')
