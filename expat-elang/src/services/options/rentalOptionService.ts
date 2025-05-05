import axios from 'axios';
import apiClient from '../authService';
import {RENTAL_ADMIN_OPTION_ENDPOINT} from '../../constants/api';
import {RentalOptionApiResponse} from '../../types/rental';

export type OptionGroup =
  | 'type'
  | 'stay_tipe'
  | 'type_details'
  | 'type_details2'
  | 'paid';

// Fungsi generik untuk fetch data opsi
export const fetchRentalOptionsApi = async <T>(
  group: OptionGroup,
): Promise<T[]> => {
  const formData = new FormData();
  formData.append('group', group);

  console.log('Fetching rental options for group:', group);

  try {
    const response = await apiClient.post<RentalOptionApiResponse<T>>(
      RENTAL_ADMIN_OPTION_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || `Failed to fetch options for group: ${group}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error response:', error.response.data);
      throw new Error(
        error.response.data?.message || `Failed to fetch ${group} options`,
      );
    }
    console.log('Error response:', error);
    throw new Error(
      `Network error or failed to connect while fetching ${group} options`,
    );
  }
};
