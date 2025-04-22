import axios from 'axios';
import {
  API_BASE_URL,
  RENTAL_CATEGORIES_ENDPOINT,
  RENTAL_ENDPOINT,
  DEFAULT_RENTAL_LIMIT,
} from '../constants/api';
import type {
  RentalCategoriesApiResponse,
  RentalCategory,
  RentalDetailApiResponse,
  RentalItemApi,
  RentalListApiResponse,
} from '../types/rental';
import apiClient from './authService';

export const fetchRentalCategoriesApi = async (): Promise<RentalCategory[]> => {
  try {
    const response = await axios.get<RentalCategoriesApiResponse>(
      `${API_BASE_URL}${RENTAL_CATEGORIES_ENDPOINT}`,
    );
    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to fetch rental categories',
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

export const fetchRentalItemsApi = async (
  {pageParam = 1},
  rentalType?: string,
): Promise<RentalListApiResponse> => {
  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_RENTAL_LIMIT,
  };
  if (rentalType && rentalType !== 'all') {
    params.categories = rentalType;
  }

  try {
    const response = await apiClient.get<RentalListApiResponse>(
      RENTAL_ENDPOINT,
      {params},
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching rental items:', error);
  }
  return {
    status: 500,
    message: 'Error',
    page: pageParam,
    limit: DEFAULT_RENTAL_LIMIT,
    total_pages: pageParam,
    total_data: 0,
    data: [],
  };
};

export const formatPrice = (price: string | number, type: string): string[] => {
  const num = typeof price === 'string' ? parseInt(price, 10) : price;
  if (isNaN(num)) {
    return [
      'Rp 0 ',
      type.toLowerCase() === 'day'
        ? '/ hari'
        : type.toLowerCase() === 'month'
        ? '/ bulan'
        : type.toLowerCase() === 'year'
        ? '/ tahun'
        : '',
    ];
  }

  let formattedNum = '-';
  if (num >= 1000000) {
    formattedNum = `Rp ${(num / 1000000).toFixed(
      num % 1000000 !== 0 ? 1 : 0,
    )} juta `;
  } else if (num >= 1000) {
    formattedNum = `Rp ${(num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0)} ribu `;
  } else {
    formattedNum = `Rp ${num} `;
  }

  let priceType = '';
  switch (type.toUpperCase()) {
    case 'DAY':
      priceType = '/ hari';
      break;
    case 'MONTH':
      priceType = '/ bulan';
      break;
    case 'YEAR':
      priceType = '/ tahun';
      break;
    default:
      priceType = '/ ' + type.toLowerCase();
  }
  return [formattedNum, priceType];
};

export const mapRentalTypeToLabel = (typeValue: string): string => {
  switch (typeValue) {
    case 'SHARED-ROOM':
      return 'Shared Room';
    case 'ROOM':
      return 'Room';
    case 'UNIT':
      return 'Unit';
    case 'APARTMENT':
      return 'Apartment';
    case 'HOUSE':
      return 'House';
    case 'OFFICE-SPACE':
      return 'Office Space';
    case 'WAREHOUSE':
      return 'Warehouse';
    default:
      return typeValue;
  }
};

export const fetchRentalDetailApi = async (
  rentalId: string,
): Promise<RentalItemApi> => {
  try {
    // Kirim ID sebagai query parameter
    const response = await apiClient.get<RentalDetailApiResponse>(
      RENTAL_ENDPOINT,
      {
        params: {id: rentalId},
      },
    );

    if (response.data && response.data.status === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || `Failed to fetch rental detail: ${rentalId}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch rental detail',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};
