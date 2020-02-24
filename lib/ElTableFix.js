const ElTableFix = {
  name: 'ElTableFix',
  computed: {
    // 列表内容高度
    bodyHeight () {
      return this.fixBodyHeight('bodyHeight')
    },

    // 固定列表内容高度
    fixedBodyHeight () {
      return this.fixBodyHeight('fixedBodyHeight')
    },

    // 固定列高度
    fixedHeight () {
      return this.fixBodyHeight('fixedHeight')
    }
  },

  methods: {
    // 调整添加分页条后的内容高度
    fixBodyHeight (type) {
      const h = ElTableFix.extends.computed[type].call(this)
      const paginHeight = this.getPaginHeight()

      if (!paginHeight) {
        return h
      }

      if (h.height) {
        let height = parseInt(h.height) - paginHeight
        h.height = height + 'px'
      } else if (h['max-height']) {
        let height = parseInt(h['max-height']) - paginHeight
        h['max-height'] = height + 'px'
      }
      return h
    },

    // 分页条高度
    getPaginHeight () {
      const { pagin } = this.$parent.$refs

      if (pagin && pagin.$el) {
        return pagin.$el.clientHeight
      }

      return 0
    }
  }
}

export default ElTableFix
