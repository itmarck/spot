/**
 * Parse url and return a URL instance.
 * @param  {string[]} urls
 * @returns {URL}
 */
export function parseUrl(...urls) {
  try {
    const url = new URL(urls[0])
    if (!url.protocol.includes('http')) {
      throw new Error('Invalid URL')
    }
    return url
  } catch {
    return urls[1] && new URL(urls[1])
  }
}
