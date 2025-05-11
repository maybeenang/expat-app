import {
  ADMIN_CREWS_ADD_SIGNATURE_ENDPOINT,
  ADMIN_CREWS_ADD_UNAVAILABLE_DATE_ENDPOINT,
  ADMIN_CREWS_CREATE_CONTRACT_ENDPOINT,
  ADMIN_CREWS_CREATE_ENDPOINT,
  ADMIN_CREWS_DETAIL_ENDPOINT,
  ADMIN_CREWS_ENDPOINT,
} from '../../../contants/endpoints';
import apiClient from '../../../services/apiClient'; // Sesuaikan path
import type {
  AddSignaturePayload,
  AddSignatureSuccessResponse,
  AddUnavailableDatePayload,
  AddUnavailableDateSuccessResponse,
  AdminCrew,
  AdminCrewDetailApiResponse,
  AdminCrewsApiResponse,
  CreateAdminCrewContractPayload,
  CreateAdminCrewContractSuccessResponse,
  CreateAdminCrewPayload,
  CreateAdminCrewSuccessResponse,
  GetAdminCrewsParams,
} from '../types';
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
    if (response.data && response.status === 200) {
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

export const fetchAdminCrewById = async (
  crewId: string,
): Promise<AdminCrew> => {
  try {
    const response = await apiClient.get<AdminCrewDetailApiResponse>(
      ADMIN_CREWS_DETAIL_ENDPOINT,
      {
        params: {id: crewId}, // Mengirim ID sebagai query parameter
      },
    );

    if (response.data && response.status === 200 && response.data.data) {
      return response.data.data; // Langsung kembalikan objek AdminCrew dari 'data.data'
    } else {
      throw new Error(
        response.data.message ||
          `Failed to fetch admin crew detail for ID ${crewId}: Invalid response structure`,
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `Error fetching admin crew detail for ID ${crewId}:`,
      axiosError.response?.data || axiosError.message,
    );
    // Anda bisa melempar error yang lebih spesifik jika API mengembalikan status error tertentu
    if (axiosError.response?.status === 404) {
      throw new Error(`Admin crew with ID ${crewId} not found.`);
    }
    throw error; // Re-throw error umum
  }
};

export const createAdminCrew = async (
  payload: CreateAdminCrewPayload,
): Promise<CreateAdminCrewSuccessResponse> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  formData.append('cell_number', payload.cell_number);
  formData.append('company', payload.company);
  formData.append('pin', payload.pin);

  if (
    payload['id_master_contract_terms[]'] &&
    payload['id_master_contract_terms[]']!.length > 0
  ) {
    payload['id_master_contract_terms[]']!.forEach(termId => {
      formData.append('id_master_contract_terms[]', termId);
    });
  }

  try {
    const response = await apiClient.post<CreateAdminCrewSuccessResponse>(
      ADMIN_CREWS_CREATE_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message ||
          'Failed to create admin crew: Invalid server response',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<
      CreateAdminCrewSuccessResponse | any
    >;
    console.error(
      'Error creating admin crew:',
      axiosError.response?.data || axiosError.message,
    );

    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'An unexpected error occurred',
    );
  }
};

export const createAdminCrewContract = async (
  payload: CreateAdminCrewContractPayload,
): Promise<CreateAdminCrewContractSuccessResponse> => {
  const formData = new FormData();
  formData.append('id_users', payload.id_users);
  formData.append('id_company', payload.id_company);

  // Menambahkan array id_master_contract_terms[]
  payload['id_master_contract_terms[]'].forEach(termId => {
    formData.append('id_master_contract_terms[]', termId);
  });

  try {
    const response =
      await apiClient.post<CreateAdminCrewContractSuccessResponse>(
        ADMIN_CREWS_CREATE_CONTRACT_ENDPOINT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message ||
          'Failed to create contract: Invalid server response',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<
      CreateAdminCrewContractSuccessResponse | any
    >;
    console.error(
      'Error creating admin crew contract:',
      axiosError.response?.data || axiosError.message,
    );
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'An unexpected error occurred while creating the contract',
    );
  }
};

export const addUnavailableDateToCrew = async (
  payload: AddUnavailableDatePayload,
): Promise<AddUnavailableDateSuccessResponse> => {
  try {
    // Pastikan ID dikirim sebagai number jika API mengharapkannya
    const requestPayload = {
      ...payload,
      id: Number(payload.id), // Konversi ID ke number jika API mengharapkannya
    };

    const response = await apiClient.post<AddUnavailableDateSuccessResponse>(
      ADMIN_CREWS_ADD_UNAVAILABLE_DATE_ENDPOINT,
      requestPayload, // Body request adalah objek JSON
      {
        headers: {
          'Content-Type': 'application/json', // Eksplisit set header
        },
      },
    );

    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message ||
          'Failed to add unavailable date: Invalid server response',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<
      AddUnavailableDateSuccessResponse | any
    >;
    console.error(
      'Error adding unavailable date:',
      axiosError.response?.data || axiosError.message,
    );
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'An unexpected error occurred while adding unavailable date',
    );
  }
};

export const addSignature = async (
  payload: AddSignaturePayload,
): Promise<AddSignatureSuccessResponse> => {
  const formData = new FormData();
  formData.append('id', payload.id);
  formData.append('type_signature', payload.type_signature);
  formData.append('base64_signature', payload.base64_signature);

  try {
    const response = await apiClient.post<AddSignatureSuccessResponse>(
      ADMIN_CREWS_ADD_SIGNATURE_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message ||
          'Failed to add signature: Invalid server response',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<AddSignatureSuccessResponse | any>;
    console.error(
      'Error adding signature:',
      axiosError.response?.data || axiosError.message,
    );
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'An unexpected error occurred while adding signature',
    );
  }
};
