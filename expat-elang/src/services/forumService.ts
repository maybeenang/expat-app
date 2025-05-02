import axios, {AxiosResponse} from 'axios';
// @ts-ignore
import qs from 'qs';
import {
  ADMIN_FORUM_CREATE_ENDPOINT,
  ADMIN_FORUM_LIST_ENDPOINT,
  DEFAULT_FORUM_LIMIT,
  FORUM_CATEGORIES_ENDPOINT,
  FORUM_LIST_ENDPOINT,
  USER_FORUM_CATEGORIES_ENDPOINT,
  ADMIN_FORUM_UPDATE_ENDPOINT,
  ADMIN_FORUM_DELETE_ENDPOINT,
} from '../constants/api'; // Ganti ke DEFAULT_FORUM_LIMIT
import type {
  ForumCategoriesApiResponse,
  ForumCategoryApi,
  ForumListApiResponse,
  ForumDetailApiResponse,
  CreateForumPayload,
  UpdateForumPayload,
  ForumReply,
} from '../types/forum';
import apiClient from './authService';
import {
  ALL_FORUM_CATEGORY_PLACEHOLDER,
  MY_FORUM_CATEGORY_PLACEHOLDER,
} from '../hooks/useForumQuery';
import {useAuthStore} from '../store/useAuthStore';

// Fetch Kategori Forum
export const fetchForumCategoriesApi = async (): Promise<
  ForumCategoryApi[]
> => {
  try {
    const response = await apiClient.get<ForumCategoriesApiResponse>(
      FORUM_CATEGORIES_ENDPOINT,
    );
    if (response.data?.status === 200 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error(
        response.data?.message || 'Failed to fetch forum categories',
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

// Fetch List Forum (pagination & filter category ID)
export const fetchForumTopicsApi = async (
  {pageParam = 1},
  categoryId?: string,
): Promise<ForumListApiResponse> => {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;

  try {
    const params: Record<string, string | number> = {
      page: pageParam,
      limit: DEFAULT_FORUM_LIMIT,
    };

    if (categoryId === MY_FORUM_CATEGORY_PLACEHOLDER.name && isLoggedIn) {
      // Use admin_forum endpoint for "Forum Saya"
      const response = await apiClient.get<ForumListApiResponse>(
        ADMIN_FORUM_LIST_ENDPOINT,
        {params},
      );
      return response.data;
    }

    if (categoryId && categoryId !== ALL_FORUM_CATEGORY_PLACEHOLDER.name) {
      params.categories = categoryId;
    }

    const response = await apiClient.get<ForumListApiResponse>(
      FORUM_LIST_ENDPOINT,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching forum topics:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch forum topics',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const fetchForumDetailApi = async (
  forumId: string,
): Promise<ForumDetailApiResponse> => {
  try {
    const response = await apiClient.get<ForumDetailApiResponse>(
      FORUM_LIST_ENDPOINT,
      {
        params: {id: forumId},
      },
    );
    if (response.data?.status === 200 && response.data.data) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || `Failed to fetch forum detail: ${forumId}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message ||
          `Failed to fetch forum detail: ${forumId}`,
      );
    }

    throw new Error('Network error or failed to connect');
  }
};

export const adminFetchForumDetailApi = async (
  forumId: string,
): Promise<ForumDetailApiResponse> => {
  try {
    const response = await apiClient.get<ForumDetailApiResponse>(
      ADMIN_FORUM_LIST_ENDPOINT,
      {
        params: {id: forumId},
      },
    );
    if (response.data?.status === 200 && response.data.data) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to fetch forum detail');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch forum detail',
      );
    }

    throw new Error('Network error or failed to connect');
  }
};

export const adminCreateForumApi = (
  payload: CreateForumPayload,
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('forum_title', payload.forum_title);
  formData.append('forum_content', payload.forum_content);

  payload.images.forEach(image => {
    formData.append('images[]', {
      name: image.name,
      type: image.type,
      uri: image.uri,
    });
  });

  payload.category.forEach(catId => {
    formData.append('category[]', catId);
  });

  return apiClient.post(ADMIN_FORUM_CREATE_ENDPOINT, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const adminUpdateForumApi = (
  payload: UpdateForumPayload,
): Promise<AxiosResponse> => {
  try {
    const formData = new FormData();
    formData.append('id', payload.id);
    formData.append('forum_title', payload.forum_title);
    formData.append('forum_content', payload.forum_content);

    const slug = payload.forum_title.replace(/\s+/g, '-').toLowerCase();
    formData.append('forum_slug', slug);

    if (payload.images.length > 0) {
      payload.images.forEach(image => {
        formData.append('images[]', {
          name: image.name,
          type: image.type,
          uri: image.uri,
        });
      });
    }

    payload.category.forEach(catId => {
      formData.append('category[]', catId);
    });

    return apiClient.post(ADMIN_FORUM_UPDATE_ENDPOINT, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
    }

    throw new Error('Failed to update forum');
  }
};

export const adminDeleteForumApi = (formId: string): Promise<AxiosResponse> => {
  const data = qs.stringify({id: formId});

  return apiClient.request({
    method: 'DELETE',
    url: ADMIN_FORUM_DELETE_ENDPOINT,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const formatForumDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

// Fetch User's Forum Categories
export const fetchUserForumCategoriesApi = async (): Promise<
  ForumCategoryApi[]
> => {
  try {
    const response = await apiClient.get<ForumCategoriesApiResponse>(
      USER_FORUM_CATEGORIES_ENDPOINT,
    );
    if (response.data?.status === 200 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error(
        response.data?.message || 'Failed to fetch user forum categories',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch user categories',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const formatContentHtml = (html: string): string => {
  // Remove unwanted tags and attributes
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]+(style|on\w+)=["'][^"']*["']/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove inline styles and event handlers
  // make max length
  const maxLength = 500;
  if (cleanHtml.length > maxLength) {
    // get latest closing tag
    const closingTagIndex = cleanHtml.lastIndexOf('</');

    if (closingTagIndex !== -1) {
      if (closingTagIndex > maxLength) {
        return cleanHtml.slice(0, maxLength) + '...';
      } else {
        const lastTag = cleanHtml.slice(closingTagIndex);
        const lastTagIndex = cleanHtml.indexOf(lastTag);
        const lastTagCloseIndex = cleanHtml.indexOf('>', lastTagIndex);
        const lastTagClose = cleanHtml.slice(lastTagCloseIndex + 1);
        return cleanHtml.slice(0, lastTagIndex) + lastTagClose + '...';
      }
    }
    return cleanHtml.slice(0, maxLength) + '...';
  }

  return cleanHtml;
};

export const getReplyCount = (replies: ForumReply[] | undefined): number => {
  if (!replies || replies.length === 0) {
    return 0;
  }

  return replies.length;
};
