import { env } from "@/env";
import { setCookie, getCookie, removeCookie } from "@/utils/cookie";
import { setAccessToken } from "./token-store";

// Set
export const setRefreshToken = async (token: string, expiresInSeconds?: number) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_REFRESH_TOKEN, JSON.stringify(token), expiresInSeconds);
    resolve();
  });
};

export const setAuthCredentials = async (token: string, expiresInSeconds?: number) => {
  return new Promise((resolve: any) => {
    // setCookie(env.VITE_AUTH_TOKEN_KEY, JSON.stringify(token), expiresInSeconds);
    setAccessToken(token, expiresInSeconds);
    resolve();
  });
};

export const setLoggedInDetails = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_LOGIN_DETAILS, JSON.stringify(data));
    setCookie(env.VITE_AUTH_USER_KEY, JSON.stringify(data));
    resolve();
  });
};

export const setAuthSubscriptionType = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_SUBSCRIPTION_TYPE, data);
    resolve();
  });
};

export const setPaginationData = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_PAGINATION_DATA, JSON.stringify(data));
    resolve();
  });
};

export const setTwoFa = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_TWO_FA, JSON.stringify(data));
    resolve();
  });
};

export const setPortal = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_PORTAL, JSON.stringify(data));
    resolve();
  });
};

export const setRouteMenuConfig = async (data: any) => {
  return new Promise((resolve: any) => {
    setCookie(env.VITE_ROUTE_MENU_CONFIG_KEY, JSON.stringify(data));
    resolve();
  });
};

// Get
export const getRefreshToken = () => {
  return JSON.parse(getCookie(env.VITE_REFRESH_TOKEN));
};

export const getAuthCredentials = () => {
  return getCookie(env.VITE_AUTH_TOKEN_KEY);
};

export const getLoggedInDetails = () => {
  return JSON.parse(getCookie(env.VITE_LOGIN_DETAILS));
};

export const getUserDetails = () => {
  return JSON.parse(getCookie(env.VITE_AUTH_USER_KEY));
};

export const getTwoFa = () => {
  return JSON.parse(getCookie(env.VITE_TWO_FA));
};

export const getPortal = () => {
  const portal = getCookie(env.VITE_PORTAL);
  return portal ? JSON.parse(portal) : null;
};

// Reuse functions
// export function setCookie(name: any, value: any, days: any) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }


// export function getCookie(name: any) {
//   const value = `; ${document.cookie}`;
//   const parts: any = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
// }

export const removeAllCookies = () => {
  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const name = cookie.split("=")[0];
    removeCookie(name);
  });
};

export function checkHasAuthToken() {
  const token = getCookie(env.VITE_AUTH_TOKEN_KEY);
  return !!token;
}

export function getAuthToken() {
  return getCookie(env.VITE_AUTH_TOKEN_KEY);
}

export function getAuthSubscriptionType() {
  return getCookie(env.VITE_SUBSCRIPTION_TYPE);
}

export function getPaginationData() {
  const paginationData = getCookie(env.VITE_PAGINATION_DATA);
  return paginationData ? JSON.parse(paginationData) : [];
}

export function removeAuthToken() {
  removeCookie(env.VITE_AUTH_TOKEN_KEY);
}

export function setAuthToken(token: any) {
  setCookie(env.VITE_AUTH_TOKEN_KEY, token);
}

export function isAuthenticated() {
  if (isLivePreview()) return true;
  return !!getCookie(env.VITE_AUTH_TOKEN_KEY);
}

export function getIsEmailVerify() {
  return getCookie("IS_EMAIL_VERIFY");
}

export const isLivePreview = () => {
  const fragment = window.location.hash.substring(1);
  const livePreview = fragment.includes("live-preview");
  if (livePreview) {
  }
  return livePreview;
};

export const getRouteMenuConfig = () => {
  const routeMenuConfig = getCookie(env.VITE_ROUTE_MENU_CONFIG_KEY)
  return routeMenuConfig ? JSON.parse(routeMenuConfig) : null;
};
