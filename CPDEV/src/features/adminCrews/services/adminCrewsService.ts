import {ADMIN_CREWS_ENDPOINT} from '../../../contants/endpoints';
import apiClient from '../../../services/apiClient'; // Sesuaikan path
import type {AdminCrewsApiResponse, GetAdminCrewsParams} from '../types';
import {AxiosError} from 'axios';

/**
 * Mengambil daftar admin crews dengan paginasi dan opsi pencarian.
 * @param params Parameter untuk limit, page, dan search.
 * @returns Promise yang resolve dengan AdminCrewsApiResponse.
 */
export const fetchAdminCrews = async (
  params: GetAdminCrewsParams = {limit: 10, page: 1}, // Default params
): Promise<AdminCrewsApiResponse> => {
  try {
    // Penting: Pastikan parameter dikirim dengan benar ke Axios
    // Jika API Anda menggunakan URLSearchParams, maka:
    // const response = await apiClient.get<AdminCrewsApiResponse>(ADMIN_CREWS_ENDPOINT, { params });

    // Jika API Anda mengharapkan parameter langsung di URL, Anda perlu membangun URL string:
    // (Ini kurang umum untuk GET request dengan banyak parameter, tapi mungkin saja)
    // const queryParams = new URLSearchParams();
    // if (params.limit) queryParams.append('limit', params.limit.toString());
    // if (params.page) queryParams.append('page', params.page.toString());
    // if (params.search) queryParams.append('search', params.search);
    // const url = `${ADMIN_CREWS_ENDPOINT}?${queryParams.toString()}`;
    // const response = await apiClient.get<AdminCrewsApiResponse>(url);

    // ASUMSI: API menggunakan 'params' object di Axios, yang merupakan cara paling umum
    const response = await apiClient.get<AdminCrewsApiResponse>(
      ADMIN_CREWS_ENDPOINT,
      {
        params, // Axios akan otomatis mengkonversi ini menjadi query string (limit=X&page=Y&search=Z)
      },
    );

    // Validasi dasar respons (bisa lebih detail)
    if (response.data && response.data.status === 200) {
      return response.data;
    } else {
      // Jika status di dalam body data bukan 200, anggap sebagai error aplikasi
      throw new Error(
        response.data.message ||
          'Failed to fetch admin crews: Invalid response structure',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    // Log error atau transform error di sini jika perlu
    console.error(
      'Error fetching admin crews:',
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
};

// Anda bisa menambahkan fungsi service lain di sini, misalnya:
// export const fetchAdminCrewById = async (id: string): Promise<AdminCrew> => { ... };
// export const createAdminCrew = async (payload: Omit<AdminCrew, 'id' | 'contracts'>): Promise<AdminCrew> => { ... };
// export const updateAdminCrew = async (id: string, payload: Partial<AdminCrew>): Promise<AdminCrew> => { ... };
// export const deleteAdminCrew = async (id: string): Promise<void> => { ... };
