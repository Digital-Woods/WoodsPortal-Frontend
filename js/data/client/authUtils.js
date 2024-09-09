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
  return !!getCookie(env.AUTH_TOKEN_KEY);
}

function getIsEmailVerify() {
  return getCookie("IS_EMAIL_VERIFY");
}