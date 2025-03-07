const pendingRequests = new Map();
var numberOfAjaxCAllPending = 0;

const Axios = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 150000000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Parse and sort query parameters to ensure uniqueness
    const url = new URL(config.url, config.baseURL);
    const params = new URLSearchParams(config.params || url.search);
    const sortedParams = new URLSearchParams(
      [...params.entries()].sort()
    ).toString();
    const fullUrl = `${url.pathname}?${sortedParams}`;

    // const requestIdentifier = `${config.url}_${config.method}`;
    const requestIdentifier = `${fullUrl}_${config.method}`;
    // check if there is already a pending request with the same identifier
    if (pendingRequests.has(requestIdentifier)) {
      const cancelTokenSource = pendingRequests.get(requestIdentifier);
      // cancel the previous request
      cancelTokenSource.cancel(
        "Cancelled due to new request with the same parameters"
      );
    }

    // create a new CancelToken
    const newCancelTokenSource = axios.CancelToken.source();
    config.cancelToken = newCancelTokenSource.token;

    // store the new cancel token source in the map
    pendingRequests.set(requestIdentifier, newCancelTokenSource);
    numberOfAjaxCAllPending++;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => {
    numberOfAjaxCAllPending = Math.max(0, numberOfAjaxCAllPending - 1); // Ensure it never goes below 0
    return response;
  },
  (error) => {
    numberOfAjaxCAllPending = Math.max(0, numberOfAjaxCAllPending - 1);
    if (
      (error.response && error.response.status === 401) ||
      // (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === "DIGITALWOODS_ERROR.NOT_AUTHORIZED")
    ) {
      removeAllCookies();
      window.location.hash = "/login";
    }
    return Promise.reject(error);
  }
);

class HttpClient {
  static async get(url, params) {
    updateSyncDisableState(true);
    const response = await Axios.get(url, { params });
    updateSyncDisableState(numberOfAjaxCAllPending === 0 ? false : true);
    return response.data;
  }

  static async post(url, data, options) {
    updateSyncDisableState(true);
    const response = await Axios.post(url, data, options);
     updateSyncDisableState(numberOfAjaxCAllPending === 0 ? false : true);
    return response.data;
  }

  static async patch(url, data) {
    updateSyncDisableState(true);
    const response = await Axios.patch(url, data);
     updateSyncDisableState(numberOfAjaxCAllPending === 0 ? false : true);
    return response.data;
  }

  static async put(url, data) {
    updateSyncDisableState(true);
    const response = await Axios.put(url, data);
     updateSyncDisableState(numberOfAjaxCAllPending === 0 ? false : true);
    return response.data;
  }

  static async delete(url) {
    updateSyncDisableState(true);
    const response = await Axios.delete(url);
     updateSyncDisableState(numberOfAjaxCAllPending === 0 ? false : true);
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
