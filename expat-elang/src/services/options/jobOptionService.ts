import axios from 'axios';
import {
  CompanyOptionApiResponse,
  CurrencyOption,
  JobOptionApiResponse,
  PaidStatusOption,
} from '../../types/jobs';
import apiClient from '../authService';
import {JOBS_OPTIONS_ENDPOINT} from '../../constants/api';

// Tipe literal untuk nilai 'group' yang valid
type OptionGroup = 'company' | 'paid' | 'currency';

// Fungsi generik untuk fetch data opsi
const fetchJobOptionsApi = async <T>(group: OptionGroup): Promise<T[]> => {
  const formData = new FormData();
  formData.append('group', group);

  try {
    const response = await apiClient.post<JobOptionApiResponse<T>>(
      JOBS_OPTIONS_ENDPOINT,
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
      throw new Error(
        error.response.data?.message || `Failed to fetch ${group} options`,
      );
    }
    throw new Error(
      `Network error or failed to connect while fetching ${group} options`,
    );
  }
};

// Fungsi spesifik untuk setiap tipe opsi
export const fetchPaidStatusOptions = () =>
  fetchJobOptionsApi<PaidStatusOption>('paid');
export const fetchCompanyOptions = () =>
  fetchJobOptionsApi<CompanyOptionApiResponse>('company');
export const fetchCurrencyOptions = () =>
  fetchJobOptionsApi<CurrencyOption>('currency');
