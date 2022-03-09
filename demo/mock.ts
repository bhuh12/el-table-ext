export interface User {
  index: number
  id: string
  name: string
  phone: string
  sex: string
  remark: string
  type: number
  status: number
  createTime: Date
}

/** 模拟所有数据 */
export function mockAllUserList() {
  const now = new Date()
  const data = Array.from(
    new Array(Math.floor(Math.random() * 1000)),
    (i, index) =>
      mockUser(
        index,
        new Date(now.getTime() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000)
      )
  )

  // 默认倒序展示
  data.sort((a, b) => b.index - a.index)
  return data
}

/** 模拟用户数据 */
function mockUser(index: number, createTime = new Date()): User {
  return {
    index,
    id: index + 1 + '',
    name: `用户${index + 1}`,
    phone:
      '1' +
      Array.from(new Array(10), () => Math.floor(Math.random() * 10)).join(''),
    sex: Math.floor(Math.random() * 2),
    remark: Array.from(
      new Array(Math.floor(Math.random() * 10)),
      () => '这是很长的一段文本'
    ).join(','),
    type: Math.floor(Math.random() * 3),
    status: Math.floor(Math.random() * 2),
    createTime
  }
}
