import { CreateElement, RenderContext, VNode } from 'vue'
import { defineComponent, PropType } from '@vue/composition-api'
import { TableColumn } from 'element-ui/types/table-column'

// 表格列函数式渲染
export default defineComponent({
  name: 'ElTableExtColumnRender',

  props: {
    render: {
      type: Function as PropType<
        (createElement: CreateElement, hack: RenderContext<any>) => VNode
      >,

      required: true
    },

    row: Object,

    column: {
      type: Object as PropType<TableColumn>
    },

    value: {
      type: [String, Number],
      default: ''
    },

    index: Number
  },

  render(h) {
    const { row, column, value, index } = this
    return this.render(h, { row, column, value, index })
  }
})
