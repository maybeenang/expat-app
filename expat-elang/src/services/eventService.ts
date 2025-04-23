import axios from 'axios';
import {
  DEFAULT_EVENT_LIMIT,
  EVENT_CATEGORIES_ENDPOINT,
  EVENT_ENDPOINT,
} from '../constants/api';
import {
  EventCategoriesApiResponse,
  EventCategoryApi,
  EventDetailApiResponse,
  EventItemApi,
  EventListApiResponse,
} from '../types/event';
import apiClient from './authService';

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
  categoryId?: string,
): Promise<EventListApiResponse> => {
  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_EVENT_LIMIT,
  };
  if (categoryId && categoryId !== 'Semua Kategori') {
    params.categories = categoryId;
  }

  try {
    const response = await apiClient.get<EventListApiResponse>(EVENT_ENDPOINT, {
      params,
    });

    if (!response.data?.data) {
      throw new Error('No data found');
    }

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
): Promise<{mainEvent: EventItemApi; recentEvents: EventItemApi[]}> => {
  try {
    const response = await apiClient.get<EventDetailApiResponse>(
      EVENT_ENDPOINT,
      {
        params: {id: eventId},
      },
    );

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
