import axios from 'axios';
import { env } from "@/env";
import { getCookie, isCookieExpired, removeAllCookie } from '@/utils/cookie';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './api-endpoints';
import { hubId } from "@/data/hubSpotData";

import {
  getAccessToken,
  clearAccessToken,
  isExpiresAccessToken
} from './token-store';
import { getRefreshToken, setAuthCredentials, setRefreshToken } from './auth-utils';


const VITE_PUBLIC_REST_API_ENDPOINT =
  env.VITE_PUBLIC_REST_API_ENDPOINT ?? '';

const Axios = axios.create({
  baseURL: VITE_PUBLIC_REST_API_ENDPOINT,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Change request data/error
Axios.interceptors.request.use((config: any) => {
  let token = getAccessToken();
  config.headers = {
    ...config.headers, // keep custom headers
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // add auth if available
  };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401)
    ) {
      const payload = error.response.data ?? {};
      const data = {
        errorCode: payload.errorCode,
        errorMessage: payload.errorMessage,
        detailedMessage: payload.detailedMessage,
        correlationId: payload.correlationId,
        ts: Date.now(),
      };
      sessionStorage.setItem('authError', JSON.stringify(data));
      window.location.replace(`#${Routes.unauthorized}`);
    }
    return Promise.reject(error);
  },
);

function formatBooleanSearchParam(key: string, value: boolean) {
  return value ? `${key}:1` : `${key}:`;
}


export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  

  static formatSearchParams(params: Partial<any>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        [
          'type',
          'categories',
          'tags',
          'author',
          'manufacturer',
          'shops',
          'refund_reason',
        ].includes(k)
          ? `${k}.slug:${v}`
          : ['is_approved'].includes(k)
            ? formatBooleanSearchParam(k, v as boolean)
            : `${k}:${v}`,
      )
      .join(';');
  }
}

export function getFormErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  }
  return null;
}

export function getFieldErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.errors;
  }
  return null;
}

// export async function initAuthBootstrap () {
//   if(isCookieExpired(env.VITE_REFRESH_TOKEN)) {
//     await logout();
//   }else if(isExpiresAccessToken()) {
//     await getAuthToken();
//   }
//   return false;
// }

export async function logout() {
  let currentPath = window.location.hash.split("?")[0];
  let skipPaths = [
    '#/login',
    '#/final-login',
    '#/register',
    '#/forgot-password',
    '#/reset-password',
  ];

  clearAccessToken();
  removeAllCookie();
  
  Object.keys(localStorage).forEach(key => {
    if (key !== 'theme') {
      localStorage.removeItem(key);
    }
  });

  if (!skipPaths.includes(currentPath)) {
    window.location.replace(`#${Routes.login}`);
  }
}

// export async function getAuthToken () {
//   try {
//     const res = await Axios.post(
//       `${API_ENDPOINTS.AUTH_REFRESH}?hubId=${hubId}`, 
//       { "refreshToken": getRefreshToken() },
//       env?.VITE_DEV_PORTAL_ID &&{
//         headers: {
//           'X-Dev-Portal-Id': env.VITE_DEV_PORTAL_ID,
//         },
//       }
//     );
//     const maybeData = res?.data?.data || res?.data;
//     const tokenData = maybeData?.tokenData || maybeData || {} as any
//     const refreshToken = tokenData?.refreshToken as string;
//     const token = tokenData?.token as string | undefined;
//     const expiresIn = tokenData?.expiresIn as number | undefined;
//     const rExpiresIn = tokenData?.refreshExpiresIn as number | undefined;
//     const rExpiresAt = tokenData?.refreshExpiresAt as number | undefined; // epoch seconds
    
//     if (typeof refreshToken === 'string') {
//       let rExpires  = 0
//       if (typeof rExpiresIn === 'number') rExpires = Date.now() + rExpiresIn * 1000
//       else if (typeof rExpiresAt === 'number') rExpires = rExpiresAt * 1000
//       await setRefreshToken(refreshToken, rExpires);
//     }
//     if (typeof token === 'string') {
//       setAuthCredentials(token, typeof expiresIn === 'number' ? expiresIn : undefined);
//       return token;
//     }
//     return null;
//   } catch {
//     return null;
//   }
// }

export async function getAuthRefreshToken(refreshToken: string): Promise<{
  token: string | null;
  success: boolean;
}> {
  try {
    const res = await Axios.post(
      `${API_ENDPOINTS.AUTH_REFRESH}?hubId=${hubId}`,
      { refreshToken },
      env?.VITE_DEV_PORTAL_ID && {
        headers: { 'X-Dev-Portal-Id': env.VITE_DEV_PORTAL_ID },
      }
    );

    // const maybeData = await res?.data?.data || res?.data;
    // const tokenData = await maybeData?.tokenData || maybeData || {};

    // const token = await tokenData?.token as string | undefined;
    // const newRefreshToken = await tokenData?.refreshToken as string;

    // if (newRefreshToken) {
    //   await setRefreshToken(newRefreshToken, Date.now() + 1000 * 60 * 60 * 24);
    // }

    // if (token) {
    //   setAuthCredentials(token, tokenData?.expiresIn);
    //   return { token, success: true };
    // }

    const maybeData = res?.data?.data || res?.data;
    const tokenData = maybeData?.tokenData || maybeData || {} as any
    const newRefreshToken = tokenData?.refreshToken as string;
    const token = tokenData?.token as string | undefined;
    const expiresIn = tokenData?.expiresIn as number | undefined;
    const rExpiresIn = tokenData?.refreshExpiresIn as number | undefined;
    const rExpiresAt = tokenData?.refreshExpiresAt as number | undefined; // epoch seconds
    
    if (typeof newRefreshToken === 'string') {
      let rExpires  = 0
      if (typeof rExpiresIn === 'number') rExpires = Date.now() + rExpiresIn * 1000
      else if (typeof rExpiresAt === 'number') rExpires = rExpiresAt * 1000
      await setRefreshToken(newRefreshToken, rExpires);
    }
    if (typeof token === 'string') {
      setAuthCredentials(token, typeof expiresIn === 'number' ? expiresIn : undefined);
      return { token, success: true };
    }

    return { token: null, success: false };
  } catch {
    return { token: null, success: false };
  }
}
