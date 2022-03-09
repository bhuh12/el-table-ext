/** 延时 Promise */
export async function awaitTimeout<T extends () => void>(
  callback: T,
  ms = 0
): Promise<ReturnType<T>> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await callback()
        resolve(res as ReturnType<typeof callback>)
      } catch (e) {
        reject(e)
      }
    }, ms)
  })
}

/** 模拟 Ajax 请求 */
export function mockAjax<T extends () => void>(
  callback: T
): Promise<ReturnType<T>> {
  return awaitTimeout(callback, Math.random() * 1000)
}
