import { VueConstructor } from 'vue'
import ElTableExt from './Table.vue'
export * from './types'

export { ElTableExt }

export default {
  install(Vue: VueConstructor) {
    Vue.component(ElTableExt.name, ElTableExt)
  }
}
