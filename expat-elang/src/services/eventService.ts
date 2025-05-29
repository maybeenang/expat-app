import axios, {AxiosResponse} from 'axios';
// @ts-ignore
import qs from 'qs';
import {
  DEFAULT_EVENT_LIMIT,
  EVENT_ADMIN_ENDPOINT,
  EVENT_CATEGORIES_ENDPOINT,
  EVENT_CREATE_ENDPOINT,
  EVENT_ENDPOINT,
  EVENT_PRICE_ENDPOINT,
  EVENT_UPDATE_ENDPOINT,
} from '../constants/api';
import {
  CreateEventPayload,
  EventCategoriesApiResponse,
  EventCategoryApi,
  EventDetailApiResponse,
  EventFilterParams,
  EventItemApi,
  EventListApiResponse,
  EventPriceApiResponse,
  EventPriceOption,
  UpdateEventPayload,
} from '../types/event';
import apiClient from './authService';
import {useAuthStore} from '../store/useAuthStore';
import {
  ALL_EVENT_CATEGORY_PLACEHOLDER,
  MY_EVENT_CATEGORY,
} from '../hooks/useEventQuery';

export const fetchEventCategoriesApi = async (): Promise<
  EventCategoryApi[]
> => {
  try {
    const response = await apiClient.get<EventCategoriesApiResponse>(
      EVENT_CATEGORIES_ENDPOINT,
    );
    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to fetch event categories',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch categories',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const fetchEventItemsApi = async (
  {pageParam = 1},
  filter: EventFilterParams,
): Promise<EventListApiResponse> => {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;

  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_EVENT_LIMIT,
    ...filter,
  };

  let endpoint = EVENT_ENDPOINT;

  if (filter.categories === MY_EVENT_CATEGORY.id && isLoggedIn) {
    endpoint = EVENT_ADMIN_ENDPOINT;
    // delete categories from params
    delete params.categories;
  }

  if (filter.categories === ALL_EVENT_CATEGORY_PLACEHOLDER.id) {
    delete params.categories;
  }

  console.log('params:', params);

  try {
    const response = await apiClient.get<EventListApiResponse>(endpoint, {
      params,
    });

    if (!response.data?.data) {
      throw new Error('No data found');
    }

    console.log(response.config.baseURL);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch data');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const formatEventDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const fetchEventDetailApi = async (
  eventId: string,
  categoryId?: string,
): Promise<{mainEvent: EventItemApi; recentEvents: EventItemApi[]}> => {
  try {
    let endpoint = EVENT_ENDPOINT;

    if (categoryId === MY_EVENT_CATEGORY.name) {
      endpoint = EVENT_ADMIN_ENDPOINT;
    }

    console.log(endpoint);

    const response = await apiClient.get<EventDetailApiResponse>(endpoint, {
      params: {id: eventId},
    });

    if (response.data && response.data.status === 200 && response.data.data) {
      return {
        mainEvent: response.data.data,
        recentEvents: Array.isArray(response.data.recent_event)
          ? response.data.recent_event
          : [],
      };
    } else {
      throw new Error(
        response.data.message || `Failed to fetch event detail: ${eventId}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch event detail',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const formatEventDateTime = (
  startString: string,
  endString: string,
): string => {
  try {
    const startDate = new Date(startString);
    const endDate = new Date(endString);

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }; // format 24 jam

    const formattedDate = startDate.toLocaleDateString('id-ID', dateOptions);
    const startTime = startDate
      .toLocaleTimeString('id-ID', timeOptions)
      .replace('.', ':');
    const endTime = endDate
      .toLocaleTimeString('id-ID', timeOptions)
      .replace('.', ':');

    if (startDate.toDateString() === endDate.toDateString()) {
      return `${formattedDate} | ${startTime} - ${endTime} WIB`;
    } else {
      return `${formattedDate} ${startTime} WIB`;
    }
  } catch (e) {
    console.error('Date formatting failed:', e);
    return startString; // Fallback
  }
};

export const fetchPriceOptionsApi = async (): Promise<EventPriceOption[]> => {
  try {
    const response = await apiClient.get<EventPriceApiResponse>(
      EVENT_PRICE_ENDPOINT,
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch price options');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch price');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const adminCreateEventApi = (
  payload: CreateEventPayload,
): Promise<AxiosResponse> => {
  try {
    const formdata = new FormData();

    // Append each field to the FormData object
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'file' && Array.isArray(value)) {
        // Handle file array
        value.forEach(file => {
          formdata.append('file[]', file);
        });
      } else if (key === 'image_title' && Array.isArray(value)) {
        // Handle image title array
        value.forEach(title => {
          formdata.append('image_title[]', title);
        });
      } else {
        formdata.append(key, value);
      }
    });

    return apiClient.post(EVENT_CREATE_ENDPOINT, formdata, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to create event');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const getImageEventThumbnail = (item: EventItemApi): string | null => {
  // check if image_feature is not null
  if (item.image_feature) {
    // check if image_feature is an object
    if (typeof item.image_feature === 'object') {
      return item.image_feature.img_url;
    }
  }

  if (item.image_lists && item.image_lists.length > 0) {
    const image = item.image_lists[0];
    if (typeof image === 'object' && image.img_url) {
      return image.img_url;
    }
  }

  if (item.images && item.images.length > 0) {
    const image = item.images[0];
    if (typeof image === 'object' && image.img_url) {
      return image.img_url;
    }
  }

  return null;
};

export const adminDeleteEventApi = (
  eventId: string,
): Promise<AxiosResponse> => {
  const data = qs.stringify({id: eventId});

  return apiClient.request({
    method: 'DELETE',
    url: EVENT_ADMIN_ENDPOINT,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const adminUpdateEventApi = (
  payload: UpdateEventPayload,
): Promise<AxiosResponse> => {
  try {
    const formdata = new FormData();

    // Append each field to the FormData Object
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'file' && Array.isArray(value)) {
        // Handle file array
        value.forEach(file => {
          formdata.append('file[]', file);
        });
      } else if (key === 'image_title' && Array.isArray(value)) {
        // Handle image title array
        value.forEach(title => {
          formdata.append('image_title[]', title);
        });
      } else if (key === 'organizer_phone' && value) {
        // Hapus awalan +1 dari nomor telepon
        formdata.append(key, value.replace('+1', ''));
      } else {
        formdata.append(key, value);
      }
    });

    return apiClient.post(EVENT_UPDATE_ENDPOINT, formdata, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data?.message || 'Failed to update event');
    }
    throw new Error('Network error or failed to connect');
  }
};
