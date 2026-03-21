function loadImage(url, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    let settled = false

    const onDone = (callback) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      image.onload = null
      image.onerror = null
      callback()
    }

    const timer = setTimeout(() => {
      onDone(() => reject(new Error(`Image preload timeout: ${url}`)))
    }, timeoutMs)

    image.onload = () => onDone(() => resolve(url))
    image.onerror = () => onDone(() => reject(new Error(`Image preload failed: ${url}`)))
    image.src = url
  })
}

async function loadWithRetry(url, { timeoutMs, retries }) {
  let attempt = 0
  let lastError = null

  while (attempt <= retries) {
    try {
      await loadImage(url, timeoutMs)
      return { ok: true, url }
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        const backoffMs = 300 * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, backoffMs))
      }
    }
    attempt += 1
  }

  return { ok: false, url, error: lastError }
}

export async function preloadImages(urls, options = {}) {
  const {
    timeoutMs = 3000,
    retries = 2,
    onAssetSettled,
  } = options

  const uniqueUrls = [...new Set((urls || []).filter(Boolean))]

  const tasks = uniqueUrls.map(async (url) => {
    const result = await loadWithRetry(url, { timeoutMs, retries })
    if (onAssetSettled) onAssetSettled(result)
    return result
  })

  const results = await Promise.all(tasks)
  const loaded = results.filter((item) => item.ok).length
  const failed = results.filter((item) => !item.ok)

  return {
    total: uniqueUrls.length,
    loaded,
    failed,
    allReady: true,
  }
}

export default preloadImages
