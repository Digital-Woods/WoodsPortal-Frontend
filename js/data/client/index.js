class Client {
  static authentication = {
    login: (data) => HttpClient.post(API_ENDPOINTS.USERS_LOGIN, data),
    verifyOtp: (data) => HttpClient.post(API_ENDPOINTS.VERIFY_OTP, data),
    register: (data) => HttpClient.post(API_ENDPOINTS.USERS_REGISTER, data),
    Logout: () => HttpClient.post(API_ENDPOINTS.USER_LOGOUT),
    changePassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USERS_CHANGE_PASSWORD, data),
    forgetPassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USERS_FORGET_PASSWORD, data),
    resetPassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, data),
    resendEmail: (data) => HttpClient.get(API_ENDPOINTS.RESEND_EMAIL, data),
  };

  static fetchAllFeatures = {
    all: () => HttpClient.get(API_ENDPOINTS.FEATURES),
  };

  static profile = {
    update: (data) => HttpClient.put(API_ENDPOINTS.PROFILE_UPDATE, data),
  };

  static getProfileDetails = {
    all: () => HttpClient.get(API_ENDPOINTS.GET_PROFILE_DETAILS),
  };

  static users = {
    me: () => HttpClient.get(API_ENDPOINTS.GET_PROFILE_DETAILS),
  };

  static files = {
    all: (me, fileId, path) => {
      const url = `${API_ENDPOINTS.ALL_FILES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.get(url);
    },
    create: (me, fileId, path, fileData) => {
      const url = `${API_ENDPOINTS.FILE_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.post(url, fileData);
    },
    getDetails: (me, path, fileId, postId) => {
      const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      return HttpClient.get(url);
    },
    deleteafile: (me, path, fileId, postId) => {
      const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      return HttpClient.delete(url);
    },
    createAfolder: (me, fileId, path, fileData) => {
      const url = `${API_ENDPOINTS.FOLDER_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.post(url, fileData);
    },
  };

  static notes = {
    all: (me, fileId, path) => {
      const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.get(url);
    },
    createnote: (me, fileId, path, data) => {
      const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.post(url, data);
    },
  };

  static objects = {
    all: ({
      path,
      limit = 10,
      after,
      sort = "updatedAt",
      inputValue,
      page,
      me,
      ...query
    }) =>
      HttpClient.get(
        `${API_ENDPOINTS.OBJECTS}/${me.hubspotPortals.templateName}${path}`,
        {
          limit,
          sort,
          after,
          page: page,
          search: inputValue,
          ...query,
        }
      ),

    byObjectId: ({ path, objectId, me }) =>
      HttpClient.get(
        `${API_ENDPOINTS.OBJECTS_BY_ID}/${me.hubspotPortals.templateName}${path}/${objectId}`
      ),
  };

  static products = {
    all: ({ categories, tags, name, shop_id, price, page, ...query }) =>
      HttpClient.get(API_ENDPOINTS.PRODUCTS, {
        searchJoin: "and",
        with: "shop",
        orderBy: "updated_at",
        sortedBy: "ASC",
        page: page,
        ...query,
        search: HttpClient.formatSearchParams({
          categories,
          tags,
          name,
          shop_id,
          price,
          status: "publish",
        }),
      }),
    store: (data) => HttpClient.post(API_ENDPOINTS.PRODUCTS, data),
  };
}
