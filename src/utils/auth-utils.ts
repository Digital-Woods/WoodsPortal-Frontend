import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_PORTAL_KEY,
  ROUTE_MENU_CONFIG_KEY,
  ASSOCIATION_VIEW_URL_KEY,
  COOKIE_EXPIRE,
  DATA_SOURCE_SET,
  NOTE_INTERVAL_TIME,
  TABLE_PAGE_LIMIT
} from './constants';


// export function setAuthCredentials(token: string) {
//   Cookie.set(AUTH_CRED, JSON.stringify({ token }), {
//     sameSite: 'none',
//     secure: true,
//   });
// }




// Set
export const setAuthCredentials = async (data : any, days = COOKIE_EXPIRE) => {
  return new Promise((resolve: any) => {
    Cookie.set(env.AUTH_TOKEN_KEY, JSON.stringify(data), days);
    resolve();
  });
};

export const setLoggedInDetails = async (data: any, days = COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    Cookie.set(env.LOGIN_DETAILS, JSON.stringify(data), days);
    resolve();
  });
};

export const setTwoFa = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    Cookie.set(env.TWO_FA, JSON.stringify(data), days);
    resolve();
  });
};

export const setPortal = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    Cookie.set(env.PORTAL, JSON.stringify(data), days);
    resolve();
  });
};

export const setRouteMenuConfig = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    Cookie.set(env.ROUTE_MENU_CONFIG_KEY, JSON.stringify(data), days);
    resolve();
  });
};

// Get
export const getAuthCredentials = () => {
  return JSON.parse(getCookie(env.AUTH_TOKEN_KEY));
};

export const getLoggedInDetails = () => {
  return JSON.parse(getCookie(env.LOGIN_DETAILS));
};

export const getUserDetails = () => {
  return JSON.parse(getCookie(env.AUTH_USER_KEY));
};

export const getTwoFa = () => {
  return JSON.parse(getCookie(env.TWO_FA));
};

export const getPortal = () => {
  const portal = getCookie(env.PORTAL);
  return portal ? JSON.parse(getCookie(env.PORTAL)) : null;
};

// Reuse functions
export function Cookie.set(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const removeAllCookies = () => {
  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const name = cookie.split("=")[0];
    removeCookie(name);
  });
};

export function removeCookie(name) {
  Cookie.set(name, "", -1);
}

export function checkHasAuthToken() {
  const token = getCookie(env.AUTH_TOKEN_KEY);
  return !!token;
}

export function getAuthToken() {
  return getCookie(env.AUTH_TOKEN_KEY);
}

export function removeAuthToken() {
  removeCookie(env.AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  Cookie.set(env.AUTH_TOKEN_KEY, token, env.COOKIE_EXPIRE);
}

export function isAuthenticated() {
  if (isLivePreview()) return true;
  return !!getCookie(env.AUTH_TOKEN_KEY);
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
  const routeMenuConfig = getCookie(env.ROUTE_MENU_CONFIG_KEY)
  return routeMenuConfig ? JSON.parse(routeMenuConfig) : null;
};
