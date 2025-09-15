import axios from 'axios';
import { env } from "@/env";
import { getCookie, isCookieExpired, removeAllCookie } from '@/utils/cookie';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './api-endpoints';

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
      logout();
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

export async function initAuthBootstrap () {
  if(isCookieExpired(env.VITE_REFRESH_TOKEN)) {
    await logout();
  }else if(isExpiresAccessToken()) {
    await getAuthToken();
  }
  return false;
}

export async function logout() {
  let currentPath = window.location.hash;
  let skipPaths = [
    '#/login',
    '#/final-login',
    '#/register',
    '#/forgot-password',
    '#/reset-password',
  ];

  clearAccessToken();
  removeAllCookie();
  localStorage.clear();

  if (!skipPaths.includes(currentPath)) {
    window.location.replace(`#${Routes.login}`);
  }
}

export async function getAuthToken () {
  try {
    const res = await Axios.post(API_ENDPOINTS.AUTH_REFRESH, { "refreshToken": getRefreshToken() });
    const maybeData = res?.data?.data || res?.data;
    const tokenData = maybeData?.tokenData || maybeData || {} as any
    const refreshToken = tokenData?.refreshToken as string;
    const token = tokenData?.token as string | undefined;
    const expiresIn = tokenData?.expiresIn as number | undefined;
    const rExpiresIn = tokenData?.refreshExpiresIn as number | undefined;
    const rExpiresAt = tokenData?.refreshExpiresAt as number | undefined; // epoch seconds
    
    if (typeof refreshToken === 'string') {
      let rExpires  = 0
      if (typeof rExpiresIn === 'number') rExpires = Date.now() + rExpiresIn * 1000
      else if (typeof rExpiresAt === 'number') rExpires = rExpiresAt * 1000
      await setRefreshToken(refreshToken, rExpires);
    }
    if (typeof token === 'string') {
      setAuthCredentials(token, typeof expiresIn === 'number' ? expiresIn : undefined);
      return token;
    }
    return null;
  } catch {
    return null;
  }
}
