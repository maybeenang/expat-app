import {API_BASE_URL, APP_ENVIRONMENT} from '@env';

export const ENV = {
  API_BASE_URL,
  APP_ENVIRONMENT,
  IS_DEV: APP_ENVIRONMENT === 'dev',
  IS_PROD: APP_ENVIRONMENT === 'prod',
} as const;

