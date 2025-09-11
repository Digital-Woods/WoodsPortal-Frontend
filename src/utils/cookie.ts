import Cookies from 'js-cookie';

export const setCookie = (key: any, value: any) => {
    return Cookies.set(key, value, {
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