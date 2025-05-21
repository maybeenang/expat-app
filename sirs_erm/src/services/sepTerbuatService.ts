import {apiClient} from './apiClient';
import type {
  SepTerbuatListParams,
  SepTerbuatListResponse,
} from '../types/sepTerbuat';
import {SEP_TERBUAT_ENDPOINT} from '../contants/endpoints';
import axios from 'axios';

class SepTerbuatService {
  async getList(params: SepTerbuatListParams): Promise<SepTerbuatListResponse> {
    try {
      const response = await apiClient.get<SepTerbuatListResponse>(
        SEP_TERBUAT_ENDPOINT,
        {
          params,
        },
      );

      if (response.status === 200 && response.data.data) {
        return response.data;
      }

      throw new Error('Failed to fetch data');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  }

  // Boilerplate methods for future implementation
  async getDetail(id: string): Promise<any> {
    throw new Error('Not implemented');
  }

  async create(data: any): Promise<any> {
    throw new Error('Not implemented');
  }

  async update(id: string, data: any): Promise<any> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<any> {
    throw new Error('Not implemented');
  }
}

export const sepTerbuatService = new SepTerbuatService();

