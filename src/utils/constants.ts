export const AUTH_TOKEN_KEY = "testToken";
export const AUTH_USER_KEY = "testUser";
export const AUTH_PORTAL_KEY = "portalSettings";
export const ROUTE_MENU_CONFIG_KEY = "routeMenuConfig";
export const ASSOCIATION_VIEW_URL_KEY = "associationsViewUrl";
export const COOKIE_EXPIRE = 7;
export const DATA_SOURCE_SET = false;
export const NOTE_INTERVAL_TIME = 10000;
export const TABLE_PAGE_LIMIT = 10;

export const FREE_ACCOUNT_MAX_FILE_SIZE = 20;
export const ENTERPRISE_ACCOUNT_MAX_FILE_SIZE = 1024;

export const HUBSPOT_DEFAULT_OBJECT_IDS = {
  "contacts": "0-1",
  "companies": "0-2",
  "deals": "0-3",
  "tickets": "0-5"
};

// image mime types
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

// file mime types
export const ALLOWED_FILE_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',

  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',

  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',
  'application/x-gzip',
  'application/x-zip-compressed',

  // Media
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/x-m4a',
  'audio/flac',

  // Google Workspace
  'application/vnd.google-apps.document',
  'application/vnd.google-apps.spreadsheet',
  'application/vnd.google-apps.presentation',
]);
