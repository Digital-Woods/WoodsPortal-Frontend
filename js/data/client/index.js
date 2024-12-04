class Client {
  static authentication = {
    preLogin: (data) => HttpClient.post(API_ENDPOINTS.PRE_LOGIN, data),
    login: (data) => HttpClient.post(API_ENDPOINTS.USERS_LOGIN, data),
    existingUserRegister: (data) => HttpClient.post(API_ENDPOINTS.EXISTING_USER_REGISTER, data),
    verifyEmail: (data) => HttpClient.post(API_ENDPOINTS.VERIFY_EMAIL, data),
    verifyOtp: (data) => HttpClient.post(API_ENDPOINTS.VERIFY_OTP, data),
    register: (data) => HttpClient.post(API_ENDPOINTS.USERS_REGISTER, data),
    Logout: () => HttpClient.post(API_ENDPOINTS.USER_LOGOUT),
    changePassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USERS_CHANGE_PASSWORD, data),
    forgetPassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USERS_FORGET_PASSWORD, data),
    resetPassword: (data) =>
      HttpClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, data),
    resendEmail: (data) => HttpClient.post(API_ENDPOINTS.RESEND_EMAIL, data),
    verifyEmailResend: (data) => HttpClient.post(API_ENDPOINTS.VERIFY_EMAIL_RESEND, data),
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
    all: ({objectId, id, portalId, cache, ...query}) => {
      // const url = `${API_ENDPOINTS.ALL_FILES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.get(url,
        {
          cache: !!cache,
          ...query,
        }
      );
    },
    uploadFile: ({objectId, id, portalId, fileData}) => {
      // const url = `${API_ENDPOINTS.FILE_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.post(url, fileData);
    },
    getDetails: ({objectId, id, portalId, rowId}) => {
      // const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}/${rowId}`;
      return HttpClient.get(url);
    },
    deleteafile: (me, path, fileId, postId) => {
      const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      return HttpClient.delete(url);
    },
    createAfolder: ({objectId, id, portalId, fileData}) => {
      // const url = `${API_ENDPOINTS.FOLDER_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-folders/${objectId}/${id}`;
      return HttpClient.post(url, fileData);
    },
  };

  static notes = {
    all: ({objectId, id, limit = 5, page, portalId, cache, ...query}) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}`;
      return HttpClient.get(url, {
        limit,
        page: page,
        cache: !!cache,
        ...query,
      });
    },
    createnote: ({objectId, id, noteBody, attachmentId, portalId}) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}`;
      return HttpClient.post(url, {noteBody: noteBody, attachmentId: attachmentId});
    },
    updateNote: ({objectId, id, note, note_id, portalId}) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}/${note_id}`;
      return HttpClient.put(url, note);
    },
    imageUpload: (me, fileId, path, data) => {
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
      // portalId,
      // hubspotObjectTypeId,
      API_ENDPOINT,
      cache,
      // param,
      ...query
    }) =>
      HttpClient.get(
        // `/api/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
        API_ENDPOINT,
        // `${API_ENDPOINTS.OBJECTS}/${me.hubspotPortals.templateName}${path}`,
        {
          limit,
          sort,
          after,
          page: page,
          search: inputValue,
          cache: !!cache,
          ...query,
        }
      ),

    byObjectId: ({ path, objectId, id, urlParam, portalId,hubId, cache, ...query }) =>
      HttpClient.get(
        // `${API_ENDPOINTS.OBJECTS_BY_ID}/${me.hubspotPortals.templateName}${path}/${objectId}`
        // `/api/${portalId}/hubspot-object-data/${objectId}/${id}${mediatorObjectTypeId && mediatorObjectRecordId ? '?mediatorObjectTypeId='+mediatorObjectTypeId+'&mediatorObjectRecordId='+mediatorObjectRecordId : ''}`
        `/api/${hubId}/${portalId}/hubspot-object-data/${objectId}/${id}${urlParam}`,
        {
          cache: !!cache,
          ...query,
        }
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

  static form = {
    fields: ({ API }) =>
      HttpClient.get(API),
    formData: ({ API, params }) =>HttpClient.get(generateApiUrl({route: API, params})),
    stages: ({ API }) =>
      HttpClient.get(API),
    create: ({API, data}) => HttpClient.post(API, data),
    update: ({API, data}) => HttpClient.put(API, data),
  };

  static details = {
    update: ({data, params}) => {
      const apiUrl = generateApiUrl({route:API_ENDPOINTS.DETAILS_SAVE, params})
      return HttpClient.put(apiUrl, data)
    },
    stages: ({params}) => {
      const apiUrl = generateApiUrl({route:API_ENDPOINTS.STAGES, params})
      return HttpClient.get(apiUrl)
    },
  };
}
