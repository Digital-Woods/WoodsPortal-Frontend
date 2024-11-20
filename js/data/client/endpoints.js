const API_ENDPOINTS = {
  USERS_LOGIN: "/api/auth/login",
  VERIFY_OTP: "/api/auth/verify-otp",
  USER_LOGOUT: "/api/auth/logout",
  USERS_REGISTER: "/register",
  USERS_CHANGE_PASSWORD: "/api/auth/change-password",
  USERS_FORGET_PASSWORD: "/api/auth/forget-password",
  USER_RESET_PASSWORD: "/api/auth/reset-password",
  RESEND_EMAIL: "/api/auth/resend-email",
  PRODUCTS: "/products",
  FEATURES: "api/templates/demo/features?featureType=BASE",
  OBJECTS: "/api/feature-data",
  OBJECTS_BY_ID: "/api/feature-data",
  PROFILE_UPDATE: "api/users",
  GET_PROFILE_DETAILS: "/api/auth/me",
  USERS_ME: "/api/auth/me",

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
