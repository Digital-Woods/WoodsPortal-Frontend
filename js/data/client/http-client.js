const Axios = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 150000000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios.interceptors.request.use(
//   (config) => {
//     console.log("Hellooo");
//     const token = getCookie(env.AUTH_TOKEN_KEY);
//     console.log(token, "token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

Axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      // (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === "DIGITALWOODS_ERROR.NOT_AUTHORIZED")
    ) {
      removeAllCookies();
      setAuthorization(null);
      window.location.hash = "/login";
    }
    return Promise.reject(error);
  }
);

class HttpClient {
  static async get(url, params) {
    const response = await Axios.get(url, { params });
    return response.data;
  }

  static async post(url, data, options) {
    const response = await Axios.post(url, data, options);
    return response.data;
  }

  static async patch(url, data) {
    const response = await Axios.patch(url, data);
    return response.data;
  }

  static async put(url, data) {
    const response = await Axios.put(url, data);
    return response.data;
  }

  static async delete(url) {
    const response = await Axios.delete(url);
    return response.data;
  }

  static formatSearchParams(params) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ["type", "categories", "tags", "author", "manufacturer"].includes(k)
          ? `${k}.slug:${v}`
          : `${k}:${v}`
      )
      .join(";");
  }
}
