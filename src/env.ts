import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_NODE_ENV: z.enum(["development", "production"]).default("development"),
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_DEV: z.any(),
    VITE_PORTAL_URL: z.string().url(),
    VITE_PUBLIC_REST_API_ENDPOINT: z.string().url(),
    VITE_LOGIN_DETAILS: z.string(),
    VITE_SUBSCRIPTION_TYPE: z.string(),
    VITE_PAGINATION_DATA: z.string(),
    VITE_TWO_FA: z.string(),
    VITE_PORTAL: z.string(),
    VITE_AUTH_TOKEN_KEY: z.string(),
    VITE_REFRESH_TOKEN: z.string(),
    VITE_AUTH_USER_KEY: z.string(),
    VITE_AUTH_PORTAL_KEY: z.string(),
    VITE_ROUTE_MENU_CONFIG_KEY: z.string(),
    VITE_ASSOCIATION_VIEW_URL_KEY: z.string(),
    VITE_COOKIE_EXPIRE: z.string(),
    VITE_DATA_SOURCE_SET: z.any(),
    VITE_NOTE_INTERVAL_TIME: z.string(),
    VITE_TABLE_PAGE_LIMIT: z.string(),
    VITE_HUBSPOT_DEFAULT_OBJECT_IDS: z.any(),
    VITE_DEV_PORTAL_ID: z.any(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
