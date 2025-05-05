import axios, {AxiosResponse} from 'axios';
import {
  RENTAL_CATEGORIES_ENDPOINT,
  RENTAL_ENDPOINT,
  DEFAULT_RENTAL_LIMIT,
  RENTAL_ADMIN_CREATE_ENDPOINT,
  RENTAL_ADMIN_ENDPOINT,
  RENTAL_ADMIN_UPDATE_ENDPOINT,
} from '../constants/api';
import type {
  CreateRentalFormData,
  RentalCategoriesApiResponse,
  RentalCategory,
  RentalDetailApiResponse,
  RentalItemApi,
  RentalListApiResponse,
  UpdateRentalFormData,
} from '../types/rental';
import apiClient from './authService';
import {Asset} from 'react-native-image-picker';
import {MY_RENTAL_CATEGORY} from '../hooks/useRentalQuery';
import {useAuthStore} from '../store/useAuthStore';
import {qss} from '../utils/helpers';

export const fetchRentalCategoriesApi = async (): Promise<RentalCategory[]> => {
  try {
    const response = await apiClient.get<RentalCategoriesApiResponse>(
      RENTAL_CATEGORIES_ENDPOINT,
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
  const isLoggedIn = useAuthStore.getState().isLoggedIn;

  let endpoint = RENTAL_ENDPOINT;

  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_RENTAL_LIMIT,
  };

  if (rentalType === MY_RENTAL_CATEGORY.value && isLoggedIn) {
    endpoint = RENTAL_ADMIN_ENDPOINT;
  }

  if (
    rentalType &&
    rentalType !== 'all' &&
    rentalType !== MY_RENTAL_CATEGORY.value
  ) {
    params.categories = rentalType;
  }

  try {
    const response = await apiClient.get<RentalListApiResponse>(endpoint, {
      params,
    });

    if (!response.data?.data) {
      throw new Error('No data found');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching rental items:', error.response.data);
      throw new Error(error.response.data?.message || 'Failed to fetch data');
    }

    console.log('Error fetching rental items:', error);
    throw new Error('Network error or failed to connect');
  }
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

// @ts-ignore
export const descExpandable = (desc: string, imgLenght): boolean => {
  const descLength = desc.length;
  const descWordCount = desc.split(' ').length;
  return descLength > 150 || descWordCount > 30 || imgLenght - 1 > 0;
};

/**
 * Membuat FormData untuk create rental.
 * Memastikan format key array (kt_details, images) sesuai Postman.
 */
const buildRentalFormData = (
  data: CreateRentalFormData,
  images: Asset[],
): FormData => {
  const formData = new FormData();

  // Append fields standar
  formData.append('title', data.title);
  formData.append('status_paid', data.status_paid);
  formData.append('type', data.type);
  formData.append('address', data.address);
  if (data.address2) {
    formData.append('address2', data.address2);
  }
  formData.append('city', data.city);
  formData.append('state', data.state);
  formData.append('zip', data.zip);
  formData.append('description', data.description);
  formData.append('availability', data.availability); // Format YYYY-MM-DD
  formData.append('price', data.price);
  formData.append('stay_min', data.stay_min);
  formData.append('stay_max', data.stay_max);
  formData.append('stay_type', data.stay_type);

  // Append kt_details array
  data.kt_details.forEach((detail, index) => {
    formData.append(`kt_details[${index}][type_details]`, detail.type_details);
    formData.append(
      `kt_details[${index}][nama_details1]`,
      detail.nama_details1,
    );
    formData.append(
      `kt_details[${index}][nama_details2]`,
      detail.nama_details2,
    );
    formData.append(`kt_details[${index}][desc]`, detail.desc);
  });

  // Append images array
  images.forEach(asset => {
    if (asset.uri) {
      formData.append('images[]', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `rental_image_${Date.now()}.jpg`,
      } as any);
    }
  });

  console.log('Constructed FormData:', formData); // Debugging
  return formData;
};

/**
 * Mengirim data rental baru ke API.
 */
export const createRental = async (
  formDataPayload: CreateRentalFormData,
  imagesPayload: Asset[],
): Promise<any> => {
  // Ganti `any` dengan tipe respons sukses API Anda
  const formData = buildRentalFormData(formDataPayload, imagesPayload);

  const response = await apiClient.post(
    RENTAL_ADMIN_CREATE_ENDPOINT,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteRental = (eventId: string): Promise<AxiosResponse> => {
  const data = qss.stringify({id: eventId});

  return apiClient.request({
    method: 'DELETE',
    url: RENTAL_ADMIN_ENDPOINT,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const buildUpdateRentalFormData = (data: UpdateRentalFormData): FormData => {
  const formData = new FormData();

  // Append fields standar (semua kecuali kt_details & images)
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'kt_details' && value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  // Append kt_details array
  data.kt_details.forEach((detail, index) => {
    formData.append(`kt_details[${index}][type_details]`, detail.type_details);
    formData.append(
      `kt_details[${index}][nama_details1]`,
      detail.nama_details1 ?? '',
    ); // Kirim string kosong jika null
    formData.append(
      `kt_details[${index}][nama_details2]`,
      detail.nama_details2 ?? '',
    ); // Kirim string kosong jika null
    formData.append(`kt_details[${index}][desc]`, detail.desc ?? ''); // Kirim string kosong jika null
  });

  console.log(data.images);

  // Append gambar baru
  data.images?.forEach(asset => {
    if (asset.uri) {
      formData.append('images[]', {
        // Sesuaikan nama field jika beda
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `new_rental_image_${Date.now()}.jpg`,
      } as any);
    }
  });

  //// Append ID gambar yang akan dihapus
  //imagesToDelete.forEach(imageId => {
  //  formData.append('images_to_delete[]', imageId); // Sesuaikan nama field jika beda
  //});

  console.log('Constructed Update FormData:', formData); // Debugging
  return formData;
};

// Fungsi update rental (BARU)
export const updateRental = async (
  formDataPayload: UpdateRentalFormData,
): Promise<any> => {
  // Ganti any dengan tipe sukses API
  const formData = buildUpdateRentalFormData(formDataPayload);

  // Gunakan POST dengan _method=PUT atau langsung PUT jika API support
  const response = await apiClient.post(
    RENTAL_ADMIN_UPDATE_ENDPOINT,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
