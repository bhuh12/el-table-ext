import { mockAjax } from './utils'
import { mockAllUserList } from './mock'
import { ExtTableFilter, ExtTablePagin, ExtTableSorts } from '../lib'

/** 所用用户列表 */
const allUserList = mockAllUserList()

/** 查询用户数据 */
export function getUserList({
  keyword,
  pagin,
  sorts,
  filters
}: {
  keyword: string
  pagin: ExtTablePagin
  sorts: ExtTableSorts
  filters: ExtTableFilter
}) {
  return mockAjax(() => {
    let result = [...allUserList]

    // 排序
    if (sorts.prop) {
      result.sort(
        sorts.order === 'ascending'
          ? (a, b) => {
              const aVal = a[sorts.prop]
              const bVal = b[sorts.prop]

              return aVal.localeCompare
                ? aVal.localeCompare(bVal, 'zh-CN')
                : aVal - bVal
            }
          : (a, b) => {
              const aVal = a[sorts.prop]
              const bVal = b[sorts.prop]

              return bVal.localeCompare
                ? bVal.localeCompare(aVal, 'zh-CN')
                : bVal - aVal
            }
      )
    }

    // 搜索、筛选
    if (keyword || Object.keys(filters).length) {
      result = result.filter(item => {
        // 搜索
        if (
          keyword &&
          !item.name.includes(keyword) &&
          !item.phone.includes(keyword)
        )
          return false

        // 筛选
        return !Object.entries(filters).some(
          ([prop, val]) => !val.includes(item[prop])
        )
      })
    }

    const start = (pagin.currentPage - 1) * pagin.pageSize

    return {
      data: result.slice(start, start + pagin.pageSize),
      total: result.length
    }
  })
}

/** 删除用户 */
export function removeUser(id: string) {
  return mockAjax(() => {
    const item = allUserList.find(item => item.id === id)

    if (!item) return

    allUserList.splice(allUserList.indexOf(item), 1)
  })
}
