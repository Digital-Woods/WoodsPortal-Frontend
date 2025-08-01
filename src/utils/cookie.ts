import Cookie from 'js-cookie';

export const setCookie = (key: any, value: any) => {
    return Cookie.set(key, value, {
        sameSite: 'none',
        secure: true,
    });
}

export const getCookie: any = (key: any) => {
    return Cookie.get(key);
}

export const removeCookie = (key: any) => {
    return Cookie.remove(key);
}