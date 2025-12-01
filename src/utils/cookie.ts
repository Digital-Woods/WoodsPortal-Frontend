import Cookies from 'js-cookie';

export const setCookie = (key: any, value: any, expire?: any) => {
    return Cookies.set(key, value, {
        expires: expire,
        sameSite: 'none',
        secure: true,
    });
}

export const getCookie: any = (key: any) => {
    return Cookies.get(key);
}

export const removeCookie = (key: any) => {
    return Cookies.remove(key);
}

export const removeAllCookie = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
    });
}

// export const isCookieExpired = (key: string): boolean => {
//   const value = Cookies.get(key);
//   return value === undefined; // true means expired or never set
// };


export const isCookieExpired = (key: string): boolean => {
  const value: any = Cookies.get(key);
  try {
    const { expiresAt } = JSON.parse(value);
    return Date.now() > expiresAt ? true : false;
  } catch {
    return false; // if invalid format, treat as valid
  }
};