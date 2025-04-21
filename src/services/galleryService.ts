// src/services/galleryService.ts (Perbarui)
import axios from 'axios';
import {GALLERY_LIST_ENDPOINT} from '../constants/api';
import type {GalleryListApiResponse, GalleryImageApi} from '../types/gallery';
import apiClient from './authService'; // Gunakan instance Axios

export const fetchGalleryImagesApi = async (): Promise<GalleryImageApi[]> => {
  try {
    const response = await apiClient.get<GalleryListApiResponse>(
      GALLERY_LIST_ENDPOINT,
    );

    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to fetch gallery images',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch gallery',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};
