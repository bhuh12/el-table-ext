import { CreateElement, VNode } from 'vue'
import { ElementUIComponent } from 'element-ui/types/component'
import { ElPagination } from 'element-ui/types/pagination'
import {
  ElTable as ElTableOrigin,
  DefaultSortOptions
} from 'element-ui/types/table'
import { ElTableColumn, TableColumn } from 'element-ui/types/table-column'

/** Element Table */
export interface ElTable<T = object> extends ElTableOrigin {
  /** 字段配置 */
  columns: ElTableColumnOrigin[]

  /** 已选择数据列表 */
  selection: T[]
}

interface ElTableColumnOrigin extends ElTableColumn {
  /** alias to prop */
  property: string
}

/** 扩展表格字段 */
export interface ExtTableColumn<T = object>
  extends Partial<Omit<ElTableColumn, 'formatter'>> {
  /** jsx 方式渲染字段数据 */
  render?: (
    h: CreateElement,
    {
      row,
      column,
      value,
      index
    }: { row: T; column: TableColumn; value: any; index: number }
  ) => VNode | string

  /** 字段格式化方法。如果为 String 则匹配全局过滤器格式化，暂不支持额外参数 */
  formatter?:
    | string
    | ((row: T, column: TableColumn, value: any, index: number) => any)

  /** 渲染选项数据，展示匹配到的选项文本和 class 样式。 */
  renderOption?: ExtTableRenderOption[]

  /** 对应列是否显示，设置则为 `true` */
  visible?: boolean
}

/** 表格字段选项 */
export interface ExtTableRenderOption {
  text: string
  /** 选项值 */
  value: string
  /** class 类名 */
  class?: string
}

/** 异步表格查询 */
export type ExtTableQuery<T = object> = ({
  pagin,
  filters,
  sorts
}: {
  pagin: ExtTablePagin
  filters: ExtTableFilter
  sorts: ExtTableSorts
}) => Promise<{
  /** 查询到的数据列表 */
  data: T[]
  /** 列表总数量 */
  total: number
}>

/** 分页组件选项 */
export interface ExtPaginConfig
  extends Partial<Omit<ElPagination, keyof ElementUIComponent>> {
  /** 是否为分页按钮添加背景色 */
  background?: boolean
}

/** 分页配置 */
export interface ExtTablePagin extends ExtPaginConfig {
  /** 当前页码 */
  currentPage: number
  /** 分页数量 */
  pageSize: number
}

/** 过滤 */
export type ExtTableFilter = Record<string, any[]>

/** 排序 */
export type ExtTableSorts = DefaultSortOptions
