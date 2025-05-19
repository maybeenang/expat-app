import {ENV} from '../config/env';

// export const API_BASE_URL = 'https://solo.oiffel.com/api';
// export const API_BASE_URL = 'https://devexpat.oiffel.com/api';
export const API_BASE_URL = ENV.API_BASE_URL;
//export const API_BASE_URL = 'https://satuexpat.com/api';
export const LOGIN_ENDPOINT = '/login';

export const BLOG_LIST_ENDPOINT = '/blog';
export const BLOG_CATEGORIES_ENDPOINT = '/blog/categories';

export const GALLERY_LIST_ENDPOINT = '/gallery';

export const RENTAL_CATEGORIES_ENDPOINT = '/rental/categories';
export const RENTAL_ENDPOINT = '/rental';
export const RENTAL_ADMIN_ENDPOINT = '/admin_rental';
export const RENTAL_ADMIN_CREATE_ENDPOINT = '/admin_rental/create';
export const RENTAL_ADMIN_UPDATE_ENDPOINT = '/admin_rental/update';
export const RENTAL_ADMIN_OPTION_ENDPOINT = '/admin_rental/data_option';
export const DEFAULT_RENTAL_LIMIT = 6;

export const EVENT_CATEGORIES_ENDPOINT = '/events/categories';
export const EVENT_ENDPOINT = '/events';
export const EVENT_ADMIN_ENDPOINT = '/admin_events';
export const EVENT_CREATE_ENDPOINT = '/admin_events/create';
export const EVENT_UPDATE_ENDPOINT = '/admin_events/update';
export const EVENT_PRICE_ENDPOINT = '/admin_events/price';
export const DEFAULT_EVENT_LIMIT = 6;

export const FORUM_LIST_ENDPOINT = '/forum';
export const FORUM_CATEGORIES_ENDPOINT = '/forum/categories';
export const USER_FORUM_CATEGORIES_ENDPOINT = '/admin_forum/categories';
export const DEFAULT_FORUM_LIMIT = 6;

export const ADMIN_FORUM_CREATE_ENDPOINT = '/admin_forum/create';
export const ADMIN_FORUM_UPDATE_ENDPOINT = '/admin_forum/update';
export const ADMIN_FORUM_DELETE_ENDPOINT = '/admin_forum';
export const ADMIN_FORUM_LIST_ENDPOINT = '/admin_forum';

export const JOBS_ENDPOINT = '/jobs';
export const JOBS_ADMIN_ENDPOINT = '/admin_jobs';
export const JOBS_OPTIONS_ENDPOINT = '/admin_jobs/data_option';
export const JOBS_CREATE_ENDPOINT = '/admin_jobs/create';
export const JOBS_UPDATE_ENDPOINT = '/admin_jobs/update';
export const DEFAULT_JOBS_LIMIT = 10;
