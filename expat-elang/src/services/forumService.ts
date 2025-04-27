import axios, {AxiosResponse} from 'axios';
import {
  ADMIN_FORUM_CREATE_ENDPOINT,
  DEFAULT_FORUM_LIMIT,
  FORUM_CATEGORIES_ENDPOINT,
  FORUM_LIST_ENDPOINT,
} from '../constants/api'; // Ganti ke DEFAULT_FORUM_LIMIT
import type {
  ForumCategoriesApiResponse,
  ForumCategoryApi,
  ForumListApiResponse,
  ForumDetailApiResponse,
  CreateForumPayload,
} from '../types/forum';
import apiClient from './authService';
import {ALL_FORUM_CATEGORY_PLACEHOLDER} from '../hooks/useForumQuery';

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
  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_FORUM_LIMIT,
  };
  if (categoryId && categoryId !== ALL_FORUM_CATEGORY_PLACEHOLDER.name) {
    params.categories = categoryId;
  }
  try {
    const response = await apiClient.get<ForumListApiResponse>(
      FORUM_LIST_ENDPOINT,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
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
