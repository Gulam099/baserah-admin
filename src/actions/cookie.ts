// cookieUtils.ts

/**
 * Sets a cookie with optional `maxAge` in days (defaults to 7).
 * Path defaults to root ("/") so it's accessible from all pages.
 */
export function setCookie(name: string, value: string, days = 7) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    const cookieString = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires.toUTCString()}; path=/`
    document.cookie = cookieString
  }
  
  /** Removes a cookie by setting it to an empty value and an expired date. */
  export function removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  }
  
  /**
   * Gets a cookie value by name.
   * Returns null if not found.
   */
  export function getCookie(name: string) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    )
    if (match) {
      return decodeURIComponent(match[2])
    }
    return null
  }
  