import {
  BizCategoryApiResponse,
  BizListApiResponse,
  BizCategoryApi,
  FetchBizItemsParams, // Untuk tipe data kategori
} from '../types/biz'; // Sesuaikan path
import {
  BIZ_CATEGORIES_ENDPOINT,
  BIZ_ENDPOINT,
  DEFAULT_BIZ_LIMIT,
} from '../constants/api'; // Definisikan konstanta endpoint
import apiClient from './authService';

/**
 * Mengambil daftar kategori bisnis dari API.
 */
export const fetchBizCategoriesApi = async (): Promise<BizCategoryApi[]> => {
  try {
    const response = await apiClient.get<BizCategoryApiResponse>(
      BIZ_CATEGORIES_ENDPOINT,
    );
    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to fetch biz categories',
      );
    }
  } catch (error: any) {
    // Handle Axios error atau error jaringan umum
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Network error or failed to connect';
    console.error('Error fetching biz categories:', errorMessage, error);
    throw new Error(errorMessage);
  }
};

/**
 * Parameter untuk fetching daftar item bisnis.
 */

/**
 * Mengambil daftar item bisnis dari API dengan paginasi dan filter.
 */
export const fetchBizItemsApi = async (
  params: FetchBizItemsParams,
): Promise<BizListApiResponse> => {
  const {
    pageParam = 1,
    limit = DEFAULT_BIZ_LIMIT, // Gunakan DEFAULT_BIZ_LIMIT atau nilai default lain
    search = '',
    location = '',
    id_category = '',
  } = params;

  try {
    const response = await apiClient.get<BizListApiResponse>(BIZ_ENDPOINT, {
      params: {
        page: pageParam,
        limit,
        search,
        location,
        id_category: id_category === 'all' ? '' : id_category, // Kirim string kosong jika 'all'
      },
    });

    // Cek apakah data ada dan status OK
    if (response.data && response.data.status === 200 && response.data.data) {
      return response.data; // Kembalikan seluruh objek respons untuk paginasi
    } else {
      // Jika data tidak sesuai format atau status error dari API
      throw new Error(
        response.data.message || 'Failed to fetch biz items or no data found',
      );
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Network error while fetching biz items';
    console.error('Error fetching biz items:', errorMessage, error);
    throw new Error(errorMessage);
  }
};
