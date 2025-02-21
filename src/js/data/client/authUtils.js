// Set
const setAuthCredentials = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    setCookie(env.AUTH_TOKEN_KEY, JSON.stringify(data), days);
    resolve();
  });
};

const setLoggedInDetails = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    setCookie(env.LOGIN_DETAILS, JSON.stringify(data), days);
    resolve();
  });
};

const setTwoFa = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    setCookie(env.TWO_FA, JSON.stringify(data), days);
    resolve();
  });
};

const setPortal = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    setCookie(env.PORTAL, JSON.stringify(data), days);
    resolve();
  });
};

const setRouteMenuConfig = async (data, days = env.COOKIE_EXPIRE) => {
  return new Promise((resolve) => {
    setCookie(env.ROUTE_MENU_CONFIG_KEY, JSON.stringify(data), days);
    resolve();
  });
};

// Get
const getAuthCredentials = () => {
  return JSON.parse(getCookie(env.AUTH_TOKEN_KEY));
};

const getLoggedInDetails = () => {
  return JSON.parse(getCookie(env.LOGIN_DETAILS));
};

const getTwoFa = () => {
  return JSON.parse(getCookie(env.TWO_FA));
};

const getPortal = () => {
  const portal = getCookie(env.PORTAL);
  return portal ? JSON.parse(getCookie(env.PORTAL)) : null;
};

// Reuse functions
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const removeAllCookies = () => {
  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const name = cookie.split("=")[0];
    removeCookie(name);
  });
};

function removeCookie(name) {
  setCookie(name, "", -1);
}

function checkHasAuthToken() {
  const token = getCookie(env.AUTH_TOKEN_KEY);
  return !!token;
}

function getAuthToken() {
  return getCookie(env.AUTH_TOKEN_KEY);
}

function removeAuthToken() {
  removeCookie(env.AUTH_TOKEN_KEY);
}

function setAuthToken(token) {
  setCookie(env.AUTH_TOKEN_KEY, token, env.COOKIE_EXPIRE);
}

function isAuthenticated() {
  if (isLivePreview()) return true;
  return !!getCookie(env.AUTH_TOKEN_KEY);
}

function getIsEmailVerify() {
  return getCookie("IS_EMAIL_VERIFY");
}

const isLivePreview = () => {
  const fragment = window.location.hash.substring(1);
  const livePreview = fragment.includes("live-preview");
  if (livePreview) {
  }
  return livePreview;
};

const getRouteMenuConfig = () => {
  const routeMenuConfig = getCookie(env.ROUTE_MENU_CONFIG_KEY)
  return routeMenuConfig ? JSON.parse(routeMenuConfig) : null;
};
