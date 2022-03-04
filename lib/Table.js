import Vue from 'vue'
import ColumnRender from './ColumnRender'

// 默认分页配置
const defaultPager = {
  currentPage: 1,
  pageSizes: [10, 20, 40, 50, 100],
  pageSize: 20,
  layout: 'total, sizes, ->, prev, pager, next, jumper',
  background: true,
  total: 0
}

/* 表格组件 */
export default {
  name: 'ElTableExt',

  components: { ColumnRender },

  props: {
    // 列数据
    columns: {
      type: Array,
      default: () => []
    },

    // 静态列表数据
    data: {
      type: Array,
      default: () => []
    },

    // 查询列表数据
    query: Function,

    // 分页配置，为 false 则不展示分页
    pager: {
      type: [Object, Boolean],
      default: () => ({})
    },

    // 是否自动加载
    autoLoad: {
      type: Boolean,
      default: true
    },

    // 默认排序
    defaultSort: Object,

    // 列表高度
    height: [String, Number],

    // 是否伸缩盒布局
    flexible: {
      type: Boolean,
      default: true
    },

    // 空数据时显示的文本内容，也可以通过 slot="empty" 设置
    emptyText: String,

    // 空数据图片
    emptyImage: String,

    // 空数据图片大小（宽度）
    emptyImageSize: Number,

    // 扩展 el-table 配置
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      mounted: false,
      loading: false, // 是否 loading
      queryData: null, // 加载列表数据
      errorMessage: '', // 加载错误信息
      pagin: this.getPagin(), // 分页配置
      paginHeight: 0, // 分页条高度
      sorts: this.defaultSort || {}, // 排序配置
      filters: {} // 筛选配置
    }
  },

  computed: {
    // 是否静态数据
    isStatic() {
      return typeof this.query !== 'function'
    },

    // 是否伸缩布局，如果设置了高度则自动启用
    isFlexible() {
      return this.flexible || !!this.height
    },

    // 列表展示数据
    // TODO: 静态数据分页过滤排序
    tableData() {
      return (this.isStatic ? this.data : this.queryData) || []
    },

    // 表格高度
    tableHeight() {
      if (this.isFlexible) return '100%'

      const { height, paginHeight } = this

      if (typeof height === 'number') {
        return height - paginHeight
      } else if (/^(\d+)px$/g.test(height)) {
        return height.replace('px', '') - paginHeight
      }
    },

    // 选择
    selection() {
      return this.mounted ? this.$refs.table.selection : []
    },

    // 字段
    cols() {
      return this.columns
        .filter(item => item.visible !== false)
        .map(_item => {
          const item = { ..._item }
          if (item.renderOption) {
            item.render = this.getOptionRender(item.renderOption)
          } else if (typeof item.formatter === 'string') {
            const formatter = this.getFilterFormatter(item.formatter)
            if (formatter) {
              item.formatter = formatter
            } else {
              delete item.formatter
            }
          }
          return item
        })
    }
  },

  // 观察数据更改
  watch: {
    // 列字段更改则重新初始化
    cols: {
      handler() {
        this.$nextTick().then(this.adjust)
      },
      immediate: true
    },

    // 数据更改更新布局
    tableData: {
      handler() {
        this.$nextTick().then(this.adjust)
      },
      immediate: true
    }
  },

  // 组件激活
  activated() {
    this.adjust()
  },

  methods: {
    // ElTable 挂载
    tableMounted() {
      this.mounted = true

      this.filters = this.getFilters()

      // 自动加载列表
      this.autoLoad && this.load()
    },

    /** 更新分页条高度 */
    updatePaginHeight() {
      this.$nextTick(() => {
        this.paginHeight = this.$refs.pagin.$el.clientHeight
      })
    },

    // 更新布局
    adjust() {
      const { table } = this.$refs
      table && table.doLayout()
    },

    // 加载数据
    load() {
      if (this.isStatic) return

      const { pagin, filters, sorts } = this
      this.loading = true

      this.query({ pagin, filters, sorts })
        .then(({ data, total }) => {
          this.queryData = data
          this.errorMessage = ''
          pagin.total = total
        })
        .catch(error => {
          this.queryData = []
          this.errorMessage = error.message
          throw error
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取分页配置
    getPagin() {
      if (typeof this.pager === 'boolean') {
        return defaultPager
      }

      return { ...defaultPager, ...this.pager }
    },

    // 更改分页数
    changeSize(size) {
      Object.assign(this.pagin, {
        pageSize: size,
        currentPage: 1
      })

      this.load()
    },

    // 当前页跳转
    jumpPage(page = 1) {
      this.pagin.currentPage = page
      this.load()
    },

    // 排序更改
    sortChange(sort) {
      this.$emit('sort-change', sort)
      if (this.isStatic) return
      this.sorts = sort
      this.jumpPage()
    },

    // 字段/表头作用域绑定
    bindScope({ row, column, $index: index }) {
      if (row) {
        const value = row[column.property]
        return { row, column, value, index }
      }
      return { column, index }
    },

    // 选项渲染函数
    getOptionRender(option) {
      let options =
        typeof option === 'string'
          ? this.$option && this.$option[option]
          : option

      if (!options) {
        console.warn(
          '[FaTable]: 根据配置的 renderOption 无法获取到选项',
          option
        )
        return ''
      }

      return (h, { value }) => {
        const match = options.find(item => item.value === value)

        if (!match) return ''

        return <span class={match.class}>{match.text}</span>
      }
    },

    // 过滤器格式化
    getFilterFormatter(filterName) {
      // 获取全局过滤器
      const filter = Vue.filter(filterName)

      if (filter) {
        return (row, column, value) => filter(value)
      }
    },

    // 获取筛选数据
    getFilters() {
      const filters = {}
      this.$refs.table.columns.forEach(
        ({ property: prop, filteredValue: value }) => {
          if (value && value.length) {
            filters[prop] = value
          }
        }
      )
      return filters
    },

    // 筛选更改
    filterChange(filters) {
      this.$emit('filter-change', filters)
      if (this.isStatic) return
      this.filters = this.getFilters()
      this.jumpPage()
    }
  }
}
