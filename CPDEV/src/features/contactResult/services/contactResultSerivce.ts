import {CONTACT_RESULT_ENDPOINT} from '../../../contants/endpoints';
import apiClient from '../../../services/apiClient'; // Sesuaikan path
import type {
  ContactResultsListApiResponse,
  GetContactResultsParams,
  DeleteContactResultSuccessResponse,
} from '../types/contactResult';
import {AxiosError} from 'axios';

export const fetchContactResults = async (
  params: GetContactResultsParams,
): Promise<ContactResultsListApiResponse> => {
  try {
    const response = await apiClient.get<ContactResultsListApiResponse>(
      CONTACT_RESULT_ENDPOINT,
      {
        params,
      },
    );
    if (
      response.data &&
      response.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || 'Failed to fetch contact results',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      'Error fetching contact results:',
      axiosError.response?.data || axiosError.message,
    );
    throw error;
  }
};

/**
 * Menghapus contact result berdasarkan ID.
 * @param contactResultId ID dari contact result yang akan dihapus.
 * @returns Promise yang resolve dengan DeleteContactResultSuccessResponse.
 */
export const deleteContactResultById = async (
  contactResultId: string,
): Promise<DeleteContactResultSuccessResponse> => {
  const deleteEndpoint = `${CONTACT_RESULT_ENDPOINT}/${contactResultId}`;
  try {
    const response = await apiClient.delete<DeleteContactResultSuccessResponse>(
      deleteEndpoint,
    );
    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message ||
          `Failed to delete contact result with ID ${contactResultId}`,
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `Error deleting contact result with ID ${contactResultId}:`,
      axiosError.response?.data || axiosError.message,
    );
    throw error;
  }
};
