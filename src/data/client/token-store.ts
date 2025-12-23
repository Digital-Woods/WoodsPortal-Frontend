import { isCookieExpired } from "@/utils/cookie"
import { env } from "@/env";
import { getAuthRefreshToken } from "./http-client";
import { getRefreshToken } from "./auth-utils";
import Cookies from 'js-cookie';

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


// Buffer time (seconds) before token expiry to trigger refresh
const REFRESH_BUFFER = 60;

const setRefreshTime = (expiresInSeconds: number) => {
  // Subtract buffer and prevent negative values
  const safeSeconds = Math.max(0, expiresInSeconds - REFRESH_BUFFER);

  // Save refresh time with correct expiry
  Cookies.set('refreshTime', String(safeSeconds), {
    expires: new Date(Date.now() + safeSeconds * 1000),
  });
};



export function isRefreshTimeExpired(): boolean {
  return !Cookies.get('refreshTime');
  // if cookie missing → expired
}

let refreshPromise: Promise<void> | null = null;

export async function ensureValidRefresh() {
  if (!isRefreshTimeExpired()) return;

  // Deduplicate multiple parallel refresh calls
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken()
      const res = await getAuthRefreshToken(refreshToken);
      if (!res.success) {
        window.location.replace(Routes.unauthorized);
        throw new Error('Refresh failed');
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  await refreshPromise;
}

export function setAccessToken(token: string | null, expiresInSeconds?: number) {
  accessToken = token
  if (typeof expiresInSeconds === 'number' && expiresInSeconds > 0) {
    setRefreshTime(expiresInSeconds);
    // expiresInSeconds = Math.max(expiresInSeconds, 120)
    // const slack = 60 // seconds before expiry to refresh
    // const now = Date.now()
    // expiresAt = now + expiresInSeconds * 1000
    // const dueInMs = Math.max(0, expiresAt - now - slack * 1000)
    // scheduleRefresh(dueInMs)
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

// function scheduleRefresh(ms: number) {
//   clearRefresh()
//   if (ms === Infinity) return
//   refreshTimeout = window.setTimeout(() => {
//     void triggerRefresh()
//   }, ms)
// }

export async function triggerRefresh(): Promise<{
  token: string | null;
  success: boolean;
}> {
  const refreshToken = await getRefreshToken()
  return getAuthRefreshToken(refreshToken)
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