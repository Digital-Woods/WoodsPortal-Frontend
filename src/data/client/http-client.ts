import axios from 'axios';
import { env } from "@/env";
import { getCookie, removeAllCookie } from '@/utils/cookie';
import { Routes } from '@/config/routes';


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
const AUTH_TOKEN_KEY = env.VITE_AUTH_TOKEN_KEY ?? 'authToken';
Axios.interceptors.request.use((config: any) => {
  const cookies = getCookie(AUTH_TOKEN_KEY);
  let token = cookies;
  // if (cookies) {
  //   token = JSON.parse(cookies)['token'];
  // }
  config.headers = token
    ? { ...config.headers, Authorization: `Bearer ${token}` }
    : { ...config.headers };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401)
    ) {
      removeAllCookie();
      localStorage.clear();
      window.location.replace(Routes.login);
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
