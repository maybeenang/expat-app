import {AxiosError} from 'axios';
import {ADMIN_CONTRACT_DETAIL_ENDPOINT} from '../../../contants/endpoints';
import apiClient from '../../../services/apiClient';
import {ContractDetailApiResponse, ContractDetailData} from '../types/contract';

export const fetchContractDetailById = async (
  contractId: string,
): Promise<ContractDetailData> => {
  try {
    const response = await apiClient.get<ContractDetailApiResponse>(
      ADMIN_CONTRACT_DETAIL_ENDPOINT,
      {
        params: {id: contractId},
      },
    );

    if (response.data && response.data.status === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message ||
          `Failed to fetch contract detail for ID ${contractId}`,
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `Error fetching contract detail for ID ${contractId}:`,
      axiosError.response?.data || axiosError.message,
    );
    if (axiosError.response?.status === 404) {
      throw new Error(`Contract with ID ${contractId} not found.`);
    }
    throw error;
  }
};
