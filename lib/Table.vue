<template>
  <div
    v-loading="loading"
    class="el-table-ext"
    :class="{ 'is-flexible': isFlexible }"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <ElTable
      ref="table"
      v-bind="options"
      :data="tableData"
      :height="tableHeight"
      :default-sort="defaultSort"
      @sort-change="sortChange"
      @filter-change="filterChange"
      v-on="$listeners"
    >
      <ElTableColumn
        v-for="col in cols"
        :key="col.prop"
        :column-key="col.prop"
        v-bind="col"
      >
        <!-- 字段插槽 -->
        <template v-if="$scopedSlots[col.prop]" #default="scope">
          <slot :name="col.prop" v-bind="bindScope(scope)">
            {{ scope.row[col.prop] }}
          </slot>
        </template>

        <!-- 字段 render 渲染 -->
        <template v-else-if="col.render" #default="scope">
          <ColumnRender :render="col.render" v-bind="bindScope(scope)" />
        </template>

        <!-- 头部字段插槽 -->
        <template v-if="$scopedSlots['header:' + col.prop]" #header="scope">
          <slot :name="'header:' + col.prop" v-bind="bindScope(scope)">
            {{ scope.column.label }}
          </slot>
        </template>
      </ElTableColumn>

      <slot />

      <template #empty>
        <slot name="empty">
          <ElEmpty
            :description="errorMessage || emptyText || options.emptyText"
            :image="emptyImage"
            :image-size="emptyImageSize"
          />
        </slot>
      </template>

      <template #append>
        <slot name="append" />
      </template>
    </ElTable>

    <ElPagination
      v-if="pager"
      ref="pagination"
      v-bind="pagin"
      @size-change="changeSize"
      @current-change="jumpPage"
      @hook:mounted="updatePaginHeight"
      @hook:destroyed="paginHeight = 0"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="tsx">
import Vue, { CreateElement } from 'vue'
import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  PropType,
  ref,
  watch
} from '@vue/composition-api'
import { DefaultSortOptions } from 'element-ui/types/table'
import { TableColumn } from 'element-ui/types/table-column'
import { ElPagination } from 'element-ui/types/pagination'
import ColumnRender from './ColumnRender'
import {
  ElTable,
  ExtPaginConfig,
  ExtTablePagin,
  ExtTableColumn,
  ExtTableRenderOption,
  ExtTableQuery,
  ExtTableFilter
} from './types'

/** 默认分页配置 */
const defaultPager: ExtPaginConfig = {
  currentPage: 1,
  pageSizes: [10, 20, 40, 50, 100],
  pageSize: 20,
  layout: 'total, sizes, ->, prev, pager, next, jumper',
  background: true,
  total: 0
}

/** 选项渲染函数 */
function getOptionsRender(options: ExtTableRenderOption[]) {
  if (!Array.isArray(options)) return

  return (h: CreateElement, { value }: { value: any }) => {
    const match = options.find(item => item.value === value)

    if (!match) return ''

    return <span class={match.class}>{match.text}</span>
  }
}

/** 过滤器格式化 */
function getFilterFormatter(filterName: string) {
  /** 获取全局过滤器 */
  const filter = Vue.filter(filterName)

  if (filter) return (row, column, value) => filter(value)
}

/* 表格组件 */
export default defineComponent({
  name: 'ElTableExt',

  components: { ColumnRender },

  props: {
    /** 列数据 */
    columns: {
      type: Array as PropType<ExtTableColumn[]>,
      default: () => []
    },

    /** 静态列表数据 */
    data: {
      type: Array,
      default: () => []
    },

    /** 查询列表数据 */
    query: Function as PropType<ExtTableQuery>,

    /** 分页配置，为 false 则不展示分页 */
    pager: {
      type: [Object, Boolean] as PropType<Partial<ExtTablePagin> | boolean>,
      default: () => ({})
    },

    /** 是否自动加载 */
    autoLoad: {
      type: Boolean,
      default: true
    },

    /** 默认排序 */
    defaultSort: Object as PropType<DefaultSortOptions>,

    /** 列表高度 */
    height: [String, Number],

    /** 是否伸缩盒布局 */
    flexible: {
      type: Boolean,
      default: true
    },

    /** 空数据时显示的文本内容，也可以通过 slot="empty" 设置 */
    emptyText: String,

    /** 空数据图片 */
    emptyImage: String,

    /** 空数据图片大小（宽度） */
    emptyImageSize: Number,

    /** 扩展 el-table 配置 */
    options: {
      type: Object as PropType<Partial<ElTable>>,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    /** 表格 ref */
    const table = ref(null as null | ElTable)

    /** 分页 ref */
    const pagination = ref(null as null | ElPagination)

    /** 加载中 */
    const loading = ref(false)

    /** 分页配置 */
    const pagin = ref(getPagin())

    /** 分页条高度 */
    const paginHeight = ref(0)

    /** 排序配置 */
    const sorts = ref(props.defaultSort || ({} as DefaultSortOptions))

    /** 筛选配置 */
    const filters = computed(() => {
      const filters: ExtTableFilter = {}
      table.value?.columns.forEach(
        ({ property: prop, filteredValue: value }) => {
          if (value && value.length) {
            filters[prop] = value
          }
        }
      )
      return filters
    })

    /** 加载列表数据 */
    const queryData = ref(null as null | object[])

    /** 加载错误信息 */
    const errorMessage = ref('')

    /** 是否静态数据 */
    const isStatic = computed(() => typeof props.query !== 'function')

    /** 是否伸缩布局，如果设置了高度则自动启用 */
    const isFlexible = computed(() => props.flexible || !!props.height)

    /** 列表展示数据 */
    const tableData = computed(
      () => (isStatic.value ? props.data : queryData.value) || []
    )

    /** 已选择数据列表 */
    const selection = computed(() => table.value?.selection || [])

    /** 字段列表 */
    const cols = computed(() => {
      return props.columns
        .filter(item => item.visible !== false)
        .map(_item => {
          const item: ExtTableColumn = { ..._item }
          if (item.renderOption) {
            item.render = getOptionsRender(item.renderOption)
          } else if (typeof item.formatter === 'string') {
            const formatter = getFilterFormatter(item.formatter)
            if (formatter) {
              item.formatter = formatter
            } else {
              delete item.formatter
            }
          }
          return item
        })
    })

    /** 更新布局 */
    function adjust() {
      table.value?.doLayout()
    }

    /** 获取分页配置 */
    function getPagin(): ExtPaginConfig {
      const { pager } = props
      if (typeof pager === 'boolean') {
        return defaultPager
      }
      return { ...defaultPager, ...pager }
    }

    /** 加载列表数据 */
    async function load() {
      if (isStatic.value || !props.query) return

      loading.value = true

      try {
        const { data, total } = await props.query({
          pagin: pagin.value,
          filters: filters.value,
          sorts: sorts.value
        })

        queryData.value = data
        errorMessage.value = ''
        pagin.value.total = total
      } catch (error) {
        queryData.value = []
        errorMessage.value = (error as Error).message
        throw error
      } finally {
        loading.value = false
      }
    }

    /** 当前页跳转 */
    function jumpPage(page = 1) {
      pagin.value.currentPage = page
      load()
    }

    /** 列字段、数据更改更改则重新初始化 */
    watch(
      [cols, tableData],
      async () => {
        await nextTick()
        adjust()
      },
      {
        immediate: true
      }
    )

    onMounted(() => {
      /** 自动加载列表 */
      props.autoLoad && load()
    })

    /** 组件激活 */
    onActivated(adjust)

    return {
      /** 表格 ref */
      table,

      /** 分页 ref */
      pagination,

      /** 分页配置 */
      pagin,

      /** 是否伸缩布局，如果设置了高度则自动启用 */
      isFlexible,

      /** 分页条高度 */
      paginHeight,

      /** 表格高度 */
      tableHeight: computed(() => {
        if (isFlexible.value) return '100%'

        const { height } = props
        const ph = paginHeight.value

        if (typeof height === 'number') {
          return height - ph
        } else if (height && /^(\d+)px$/g.test(height)) {
          return +height.replace('px', '') - ph
        }

        return ''
      }),

      /** 字段列表 */
      cols,

      /** 列表展示数据 */
      tableData,

      /** 已选择数据列表 */
      selection,

      /** 加载中 */
      loading,

      /** 加载错误信息 */
      errorMessage,

      /** 更新布局 */
      adjust,

      /** 加载列表数据 */
      load,

      /** 当前页跳转 */
      jumpPage,

      /** 更改分页数 */
      changeSize(size: number) {
        Object.assign(pagin.value, {
          pageSize: size,
          currentPage: 1
        })
        load()
      },

      /** 排序更改 */
      sortChange(sort: DefaultSortOptions) {
        emit('sort-change', sort)

        if (isStatic.value) return

        sorts.value = sort
        jumpPage()
      },

      /** 筛选更改 */
      filterChange(filters) {
        emit('filter-change', filters)

        if (isStatic.value) return

        jumpPage()
      },

      /** 更新分页条高度 */
      async updatePaginHeight() {
        await nextTick()

        const paginEl = pagination.value?.$el

        paginHeight.value = paginEl?.clientHeight || 0
      },

      /** 字段/表头作用域绑定 */
      bindScope({
        row,
        column,
        $index: index
      }: {
        row: object
        column: TableColumn
        $index: number
      }) {
        if (row) {
          const value = row[column.property]
          return { row, column, value, index }
        }
        return { column, index }
      }
    }
  }
})
</script>

<style lang="scss">
.el-table-ext {
  &.is-flexible {
    display: flex;
    flex: 1 1 200px;
    flex-direction: column;
    overflow: hidden;
  }

  /** 分页 */
  .el-pagination {
    position: relative;
    padding: 10px 5px;
    font-weight: 400;

    &::before {
      position: absolute;
      top: -1px;
      left: 0;
      z-index: 4;
      width: 100%;
      height: 1px;
      background-color: #ebeef5;
      content: '';
    }

    .el-pager li.active {
      font-weight: 700;
    }
  }
}
</style>
