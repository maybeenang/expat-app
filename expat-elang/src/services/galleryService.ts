// src/services/galleryService.ts (Perbarui)
import axios from 'axios';
import {GALLERY_LIST_ENDPOINT} from '../constants/api';
import type {GalleryListApiResponse} from '../types/gallery';
import apiClient from './authService'; // Gunakan instance Axios

// Terima pageParam, default ke 1 jika undefined
export const fetchGalleryImagesApi = async ({
  pageParam = 1,
}: {
  pageParam: unknown;
}): Promise<GalleryListApiResponse> => {
  try {
    const response = await apiClient.get<GalleryListApiResponse>(
      GALLERY_LIST_ENDPOINT,
      {
        params: {
          page: pageParam,
          limit: 10,
        },
      },
    );

    if (!response.data?.data) {
      throw new Error('No data found');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch gallery',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};
