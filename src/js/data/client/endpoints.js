const API_ENDPOINTS = {
  PRE_LOGIN: "/api/auth/pre-login",
  USERS_LOGIN: "/api/auth/login",
  EXISTING_USER_REGISTER: "/api/auth/existing-user-register",
  VERIFY_EMAIL: 'api/auth/verify-email',
  VERIFY_OTP: "/api/auth/verify-otp",
  USER_LOGOUT: "/api/auth/logout",
  USERS_REGISTER: "/register",
  USERS_CHANGE_PASSWORD: "/api/auth/change-password",
  USERS_FORGET_PASSWORD: "/api/auth/forget-password",
  USER_RESET_PASSWORD: "/api/auth/reset-password",
  RESEND_EMAIL: "/api/auth/resend-email",
  VERIFY_EMAIL_RESEND: "/api/verify-email/resend",
  PRODUCTS: "/products",
  FEATURES: "api/templates/demo/features?featureType=BASE",
  OBJECTS: "/api/feature-data",
  OBJECTS_BY_ID: "/api/feature-data",
  PROFILE_UPDATE: "api/users",
  GET_PROFILE_DETAILS: "/api/auth/me",
  USERS_ME: "/api/auth/me",

  DETAILS_SAVE: "/api/:hubId/:portalId/hubspot-object-forms/:objectTypeId/properties/:recordId",
  STAGES: "/api/:hubId/:portalId/hubspot-object-pipelines/:objectTypeId/:pipelineId/stages",

  //File Upload
  FILE_UPLOAD: "/api/feature-data/files",
  ALL_FILES: "/api/feature-data/files",
  ONE_FILE: "/api/feature-data/files",
  DELETE_ONE_FILE: "/api/feature-data/files",

  //Folder Upload
  FOLDER_UPLOAD: "/api/feature-data/folders",
  //notes
  ALL_NOTES: "/api/feature-data/notes",
  NOTES_UPLOAD: "/api/feature-data/notes",

  //notes-Image
  IMAGE_UPLOAD: "/api/feature-data/notes/images",
};
