import Cookie from 'js-cookie';

export const setCookie = (key: any, value: any) => {
    Cookie.set(key, value, {
        sameSite: 'none',
        secure: true,
    });
}

export const getCookie: any = (key: any) => {
    Cookie.get(key);
}

export const removeCookie = (key: any) => {
    Cookie.remove(key);
}