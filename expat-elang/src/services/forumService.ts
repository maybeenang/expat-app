import axios from 'axios';
import {
  DEFAULT_FORUM_LIMIT,
  FORUM_CATEGORIES_ENDPOINT,
  FORUM_LIST_ENDPOINT,
} from '../constants/api'; // Ganti ke DEFAULT_FORUM_LIMIT
import type {
  ForumCategoriesApiResponse,
  ForumCategoryApi,
  ForumListApiResponse,
  ForumDetailApiResponse,
} from '../types/forum';
import apiClient from './authService';

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
  if (categoryId && categoryId !== 'all') {
    params.category_id = categoryId;
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
