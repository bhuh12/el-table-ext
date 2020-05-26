import Vue from 'vue'
import ColumnRender from './ColumnRender'
import ElTableFix from './ElTableFix'

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

  components: { ColumnRender, ElTableFix },

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
    height: String,

    // 空数据文本
    emptyText: String,

    // 扩展 el-table 配置
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      mounted: false,
      loading: false, // 是否 loading
      cols: [], // 列数据
      queryData: null, // 加载列表数据
      errorMessage: '', // 加载错误信息
      pagin: this.getPagin(), // 分页配置
      sorts: this.defaultSort || {}, // 排序配置
      filters: {} // 筛选配置
    }
  },

  computed: {
    // 是否静态数据
    isStatic () {
      return typeof this.query !== 'function'
    },

    // 列表展示数据
    // TODO: 静态数据分页过滤排序
    tableData () {
      return (this.isStatic ? this.data : this.queryData) || []
    },

    // 选择
    selection () {
      return this.mounted ? this.$refs.table.selection : []
    }
  },

  // 观察数据更改
  watch: {
    // 列字段更改则重新初始化
    column: {
      handler () {
        this.initColumns()
      },
      immediate: true
    },

    // 数据更改更新布局
    tableData: {
      handler () {
        this.$nextTick().then(this.adjust)
      },
      immediate: true
    }
  },

  // 组件激活
  activated () {
    this.adjust()
  },

  methods: {
    // ElTable 挂载
    tableMounted () {
      this.mounted = true

      // 移动分页节点
      if (this.pager) {
        this.$el.appendChild(this.$refs.pagin.$el)
      }

      this.filters = this.getFilters()

      // 自动加载列表
      this.autoLoad && this.load()
    },

    // 初始化字段
    initColumns () {
      this.cols = this.columns.map((item) => {
        if (item.renderOption) {
          this.$set(item, 'render', this.getOptionRender(item.renderOption))
        } else if (typeof item.formatter === 'string') {
          const formatter = this.getFilterFormatter(item.formatter)
          if (formatter) {
            this.$set(item, 'formatter', formatter)
          } else {
            this.$delete(item, 'formatter')
          }
        }
        return item
      })
    },

    // 选项渲染函数
    getOptionRender (option) {
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

      return (h, { row, value, index }) => {
        const match = options.find((item) => item.value === value)

        if (match) {
          return <span class={match.class}>{match.text}</span>
        }

        return ''
      }
    },

    // 过滤器格式化
    getFilterFormatter (filterName) {
      // 获取全局过滤器
      const filter = Vue.filter(filterName)

      if (filter) {
        return (row, column, value, index) => filter(value)
      }
      return undefined
    },

    // 字段/表头作用域绑定
    bindScope ({ row, column, $index: index }) {
      if (row) {
        const value = row[column.property]
        return { row, column, value, index }
      }
      return { column, index }
    },

    // 更新布局
    adjust () {
      const { table } = this.$refs
      table && table.doLayout()
    },

    // 加载数据
    load () {
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
          pagin.total = 0
          throw error
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取分页配置
    getPagin () {
      if (typeof this.pager === 'boolean') {
        return defaultPager
      }

      return { ...defaultPager, ...this.pager }
    },

    // 更改分页数
    changeSize (size) {
      Object.assign(this.pagin, {
        pageSize: size,
        currentPage: 1
      })

      this.load()
    },

    // 当前页跳转
    jumpPage (page = 1) {
      this.pagin.currentPage = page
      this.load()
    },

    // 排序更改
    sortChange (sort) {
      this.$emit('sort-change', sort)
      if (this.isStatic) return
      this.sorts = sort
      this.jumpPage()
    },

    // 获取筛选数据
    getFilters () {
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
    filterChange (filters) {
      this.$emit('filter-change', filters)
      if (this.isStatic) return
      this.filters = this.getFilters()
      this.jumpPage()
    }
  }
}
