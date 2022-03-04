/** 延时 Promise */
export async function awaitTimeout(callback, ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await callback()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    }, ms)
  })
}

/** 模拟 Ajax 请求 */
export function mockAjax(callback) {
  return awaitTimeout(callback, Math.random() * 1000)
}
