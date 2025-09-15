import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from '@/data/client/http-client';
import { generateApiUrl } from '@/utils/generateApiUrl';
import { hubId } from '@/data/hubSpotData'
import { env } from "@/env";

export const Client = {
  authentication : {
    preLogin: (data: any) => HttpClient.post(API_ENDPOINTS.PRE_LOGIN, data),
    // login: (data: any) => HttpClient.post(API_ENDPOINTS.USERS_LOGIN, data),
    // login: (data: any, hub_id: any) => HttpClient.post(`${API_ENDPOINTS.USERS_LOGIN}?hubId=${hub_id}`, data),
    login: (data: any, hub_id: any) =>
    HttpClient.post(
      `${API_ENDPOINTS.USERS_LOGIN}?hubId=${hub_id}`,
      data,
      env?.VITE_DEV_PORTAL_ID &&{
        headers: {
          'X-Dev-Portal-Id': env.VITE_DEV_PORTAL_ID,
        },
      }
    ),
    existingUserRegister: (data: any) => HttpClient.post(API_ENDPOINTS.EXISTING_USER_REGISTER, data),
    verifyEmail: (data: any) => HttpClient.post(API_ENDPOINTS.VERIFY_EMAIL, data),
    verifyOtp: (data: any) => HttpClient.post(API_ENDPOINTS.VERIFY_OTP, data),
    register: (data: any) => HttpClient.post(API_ENDPOINTS.USERS_REGISTER, data),
    Logout: () => HttpClient.post(API_ENDPOINTS.USER_LOGOUT, null),
    changePassword: (data: any) =>
      HttpClient.post(API_ENDPOINTS.USERS_CHANGE_PASSWORD, data),
    forgetPassword: (data: any) =>
      HttpClient.post(API_ENDPOINTS.USERS_FORGET_PASSWORD, data),
    resetPassword: (data: any) =>
      HttpClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, data),
    resendEmail: (data: any) => HttpClient.post(API_ENDPOINTS.RESEND_EMAIL, data),
    verifyEmailResend: (data: any) => HttpClient.post(API_ENDPOINTS.VERIFY_EMAIL_RESEND, data),
     clientSession: (data:any) => HttpClient.post(API_ENDPOINTS.CLIENT_SESSION, data),
  },

  fetchAllFeatures : {
    all: () => HttpClient.get(API_ENDPOINTS.FEATURES),
  },

  profile : {
    update: (data: any) => HttpClient.put(API_ENDPOINTS.PROFILE_UPDATE, data),
  },

  getProfileDetails : {
    all: () => HttpClient.get(API_ENDPOINTS.GET_PROFILE_DETAILS),
  },

  users : {
    me: () => {
      const GET_PROFILE_DETAILS = `${API_ENDPOINTS.GET_PROFILE_DETAILS}`
      return HttpClient.get(GET_PROFILE_DETAILS)
    },
  },

  user : {
    profile: async ({ portalId, cache, ...query }: any) => {
      try {
        const url = `/api/${hubId}/${portalId}/profiles`;
        const response = await HttpClient.get(url, { cache, ...query }); 
        return response; 
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
    },
  },
  

  files : {
    all: ({objectId, id, portalId, cache, ...query}: any) => {
      // const url = `${API_ENDPOINTS.ALL_FILES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.get(url,
        {
          cache: !!cache,
          ...query,
        }
      );
    },
    uploadFile: ({objectId, id, portalId, fileData}: any) => {
      // const url = `${API_ENDPOINTS.FILE_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.post(url, fileData);
    },
    getDetails: ({objectId, id, portalId, rowId}: any) => {
      // const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}/${rowId}`;
      return HttpClient.get(url);
    },
    deleteafile: (me: any, path: any, fileId: any, postId: any) => {
      const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
      return HttpClient.delete(url);
    },
    createAfolder: ({objectId, id, portalId, fileData}: any) => {
      // const url = `${API_ENDPOINTS.FOLDER_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-folders/${objectId}/${id}`;
      return HttpClient.post(url, fileData);
    },
  },

  notes : {
    all: ({objectId, id, limit = 5, page, portalId, cache, ...query}: any) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}`;
      return HttpClient.get(url, {
        limit,
        page: page,
        cache: !!cache,
        ...query,
      });
    },
    createnote: ({objectId, id, noteBody, attachmentId, portalId}: any) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}`;
      return HttpClient.post(url, {noteBody: noteBody, attachmentId: attachmentId});
    },
    updateNote: ({objectId, id, note, note_id, portalId}: any) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      const url = `/api/${hubId}/${portalId}/hubspot-object-notes/${objectId}/${id}/${note_id}`;
      return HttpClient.put(url, note);
    },
    imageUpload: (me: any, fileId: any, path: any, data: any) => {
      const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      return HttpClient.post(url, data);
    },
  },

  objects : {
    all: ({
      // limit = 10,
      // after,
      // sort = "updatedAt",
      // inputValue,
      // page,
      // me,
      // // portalId,
      // // hubspotObjectTypeId,
      // API_ENDPOINT,
      // cache,
      // // param,
      // ...query
      API_ENDPOINT,
      param
    }: any) =>
      HttpClient.get(
        // `/api/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
        API_ENDPOINT,
        // `${API_ENDPOINTS.OBJECTS}/${me.hubspotPortals.templateName}${path}`,
        param
      ),

    byObjectId: ({ path, objectId, id, urlParam, portalId,hubId, cache, ...query }: any) =>
      HttpClient.get(
        // `${API_ENDPOINTS.OBJECTS_BY_ID}/${me.hubspotPortals.templateName}${path}/${objectId}`
        // `/api/${portalId}/hubspot-object-data/${objectId}/${id}${mediatorObjectTypeId && mediatorObjectRecordId ? '?mediatorObjectTypeId='+mediatorObjectTypeId+'&mediatorObjectRecordId='+mediatorObjectRecordId : ''}`
        `/api/${hubId}/${portalId}/hubspot-object-data/${objectId}/${id}${urlParam}`,
        {
          cache: !!cache,
          ...query,
        }
      ),
  },

  products : {
    all: ({ categories, tags, name, shop_id, price, page, ...query }: any) =>
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
    store: (data: any) => HttpClient.post(API_ENDPOINTS.PRODUCTS, data),
  },

  form : {
    fields: ({ API }: any) =>
      HttpClient.get(API),
    formData: ({ API, params }: any) =>HttpClient.get(generateApiUrl({route: API, params})),
    stages: ({ API }: any) =>
      HttpClient.get(API),
    options: ({ API }: any) =>
      HttpClient.get(API),
    create: ({API, data}: any) => HttpClient.post(API, data),
    createExisting: ({API, params, data}: any) => HttpClient.post(generateApiUrl({route: API, params}), data),
    removeExisting: ({API, params, data}: any) => HttpClient.post(generateApiUrl({route: API, params}), data),
    update: ({API, data}: any) => HttpClient.put(API, data),
  },

  details : {
    update: ({data, params, queryParams}: any) => {
      const apiUrl = generateApiUrl({route:API_ENDPOINTS.DETAILS_SAVE, params, queryParams})
      return HttpClient.put(apiUrl, data)
    },
    stages: ({params}: any) => {
      const apiUrl = generateApiUrl({route:API_ENDPOINTS.STAGES, params})
      return HttpClient.get(apiUrl)
    },
  },


  Deals : {
    pipelines: ({API_ENDPOINT, param}: any) => {
      // const url = `${API_ENDPOINTS.ALL_FILES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      // const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.get(API_ENDPOINT, param
        // {
        //   cache: !!cache,
        //   ...query,
        // }
      );
    },
    pipelineDeals: ({API_ENDPOINT}: any) => {
      // const url = `${API_ENDPOINTS.ALL_FILES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      // const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
      return HttpClient.get(API_ENDPOINT,
        // {
        //   cache: !!cache,
        //   ...query,
        // }
      );
    },

    updatePipelineDeal: ({API_ENDPOINT, data}: any) => {
      // const url = `${API_ENDPOINTS.ALL_NOTES}/${me.hubspotPortals.templateName}${path}/${fileId}`;
      // const url = `/api/${hubId}/${portalId}/hubspot-object-forms/${objectId}/${id}/${note_id}`;
      return HttpClient.put(API_ENDPOINT, data);
    },


    

    // uploadFile: ({objectId, id, portalId, fileData}) => {
    //   // const url = `${API_ENDPOINTS.FILE_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
    //   const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}`;
    //   return HttpClient.post(url, fileData);
    // },
    // getDetails: ({objectId, id, portalId, rowId}) => {
    //   // const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
    //   const url = `/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}/${rowId}`;
    //   return HttpClient.get(url);
    // },
    // deleteafile: (me, path, fileId, postId) => {
    //   const url = `${API_ENDPOINTS.ONE_FILE}/${me.hubspotPortals.templateName}${path}/${postId}/${fileId}`;
    //   return HttpClient.delete(url);
    // },
    // createAfolder: ({objectId, id, portalId, fileData}) => {
    //   // const url = `${API_ENDPOINTS.FOLDER_UPLOAD}/${me.hubspotPortals.templateName}${path}/${fileId}`;
    //   const url = `/api/${hubId}/${portalId}/hubspot-object-folders/${objectId}/${id}`;
    //   return HttpClient.post(url, fileData);
    // },
  },


}
