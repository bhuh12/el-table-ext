// 表格列函数式渲染
export default {
  props: {
    render: {
      type: Function,
      required: true
    },

    row: Object,

    column: Object,

    value: {
      default: ''
    },

    index: Number
  },

  render (h) {
    const { row, column, value, index } = this

    return this.render(h, { row, column, value, index })
  }
}
