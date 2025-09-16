import { isCookieExpired } from "@/utils/cookie"
import { env } from "@/env";
import { getAuthToken } from "./http-client";

let accessToken: string | null = null
let expiresAt: number | null = null // token expiry, epoch ms

let refreshTimeout: number | null = null


export function getAccessToken(): string | null {
  return accessToken
}

export function getExpiresAt(): number | null {
  return expiresAt
}

export function isExpiresAccessToken(): any {
  try {
      const token = getAccessToken()
      const exp = getExpiresAt()
      const now = Date.now()
      const nearExpiry = typeof exp === 'number' ? exp - now < 60_000 : false
      // If toke is expired or near expiry, return true
      if (!token || nearExpiry) {
        return true
      }
      return false
    } catch {}
}

export function setAccessToken(token: string | null, expiresInSeconds?: number) {
  accessToken = token
  if (typeof expiresInSeconds === 'number' && expiresInSeconds > 0) {
    const slack = 60 // seconds before expiry to refresh
    const now = Date.now()
    expiresAt = now + expiresInSeconds * 1000
    const dueInMs = Math.max(0, expiresAt - now - slack * 1000)
    scheduleRefresh(dueInMs)
  } else {
    expiresAt = null
    clearRefresh()
  }
}

function clearRefresh() {
  if (refreshTimeout !== null) {
    window.clearTimeout(refreshTimeout)
    refreshTimeout = null
  }
}

function scheduleRefresh(ms: number) {
  clearRefresh()
  if (ms === Infinity) return
  refreshTimeout = window.setTimeout(() => {
    void triggerRefresh()
  }, ms)
}

export async function triggerRefresh(): Promise<string | null> {
  return getAuthToken()
}


export function clearAccessToken() {
  setAccessToken(null)
}

export function isAuthenticateApp () {
  if(isCookieExpired(env.VITE_REFRESH_TOKEN) || isExpiresAccessToken()) {
    return false;
  }
  return true;
}