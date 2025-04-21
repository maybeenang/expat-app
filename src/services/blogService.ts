import axios from 'axios';
import {BLOG_CATEGORIES_ENDPOINT, BLOG_LIST_ENDPOINT} from '../constants/api';
import type {
  BlogCategoriesApiResponse,
  BlogCategory,
  BlogDetailApiResponse,
  BlogListApiResponse,
  BlogPost,
} from '../types/blog';
import apiClient from './authService';

export const fetchBlogPostsApi = async (): Promise<BlogPost[]> => {
  const params: Record<string, string> = {};
  try {
    const response = await apiClient.get<BlogListApiResponse>(
      BLOG_LIST_ENDPOINT,
      {params},
    );
    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch blog posts');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch blog posts',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const formatDate = (dateString: string): string => {
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

export const fetchBlogPostDetailApi = async (
  slug: string,
): Promise<{mainPost: BlogPost; recentPosts: BlogPost[]}> => {
  try {
    const response = await apiClient.get<BlogDetailApiResponse>(
      BLOG_LIST_ENDPOINT,
      {
        params: {id: slug},
      },
    );

    if (response.data && response.data.status === 200 && response.data.data) {
      return {
        mainPost: response.data.data,
        recentPosts: Array.isArray(response.data.recent_post)
          ? response.data.recent_post
          : [],
      };
    } else {
      throw new Error(
        response.data.message || `Failed to fetch blog post: ${slug}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch blog detail',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export const searchBlogPostsApi = async (
  query: string,
): Promise<BlogPost[]> => {
  if (!query) {
    return [];
  }

  const params: Record<string, string> = {};
  if (query) {
    params.search = query;
  }

  try {
    const response = await apiClient.get<BlogListApiResponse>(
      BLOG_LIST_ENDPOINT,
      {params},
    ); // Endpoint sama, params beda
    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to search blog posts');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to search blogs');
    }
    throw new Error('Network error or failed to connect');
  }
};
export const fetchBlogCategoriesApi = async (): Promise<BlogCategory[]> => {
  try {
    const response = await apiClient.get<BlogCategoriesApiResponse>(
      BLOG_CATEGORIES_ENDPOINT,
    );

    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to fetch blog categories',
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
