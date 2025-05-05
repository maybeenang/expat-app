import axios, {AxiosResponse} from 'axios';
// @ts-ignore
import qs from 'qs';
import {
  DEFAULT_JOBS_LIMIT,
  JOBS_ADMIN_ENDPOINT,
  JOBS_CREATE_ENDPOINT,
  JOBS_ENDPOINT,
  JOBS_UPDATE_ENDPOINT,
} from '../constants/api';
import type {
  CreateJobPayload,
  JobDetailApiResponse,
  JobItemApi,
  JobListApiResponse,
  UpdateJobPayload,
} from '../types/jobs';
import apiClient from './authService';
import {useAuthStore} from '../store/useAuthStore';
import {MY_JOBS_CATEGORY} from '../hooks/useJobsQuery';

// Fetch List Jobs (pagination, search, location)
export const fetchJobItemsApi = async (
  {pageParam = 1},
  searchTerm?: string,
  location?: string,
  categoryId?: string,
): Promise<JobListApiResponse> => {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  let endpoint = JOBS_ENDPOINT;

  if (categoryId === MY_JOBS_CATEGORY.id && isLoggedIn) {
    endpoint = JOBS_ADMIN_ENDPOINT;
  }

  const params: Record<string, string | number> = {
    page: pageParam,
    limit: DEFAULT_JOBS_LIMIT,
  };
  if (searchTerm) {
    params.search = searchTerm;
  }
  if (location) {
    params.location = location;
  }

  try {
    const response = await apiClient.get<JobListApiResponse>(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch jobs');
    }
    throw new Error('Network error or failed to connect');
  }
};

// --- Utility Functions ---
export const formatSalary = (
  start: string | null,
  end: string | null,
  currency: string | null,
): string | null => {
  if (!start || !currency) {
    return null;
  }
  const startNum = parseInt(start, 10);
  const endNum = end ? parseInt(end, 10) : null;

  if (isNaN(startNum)) {
    return null;
  }

  let range = `${currency}${startNum / 1000}k`;
  if (endNum && !isNaN(endNum) && endNum > startNum) {
    range += ` - ${currency}${endNum / 1000}k`;
  }
  return range;
};

// Format tanggal posting (contoh - hitung selisih waktu)
export const formatPostDate = (dateString: string): string => {
  try {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30); // Approx
    const diffYears = Math.floor(diffDays / 365); // Approx

    if (diffYears > 0) {
      return `${diffYears} thn lalu`;
    }
    if (diffMonths > 0) {
      return `${diffMonths} bln lalu`;
    }
    if (diffWeeks > 0) {
      return `${diffWeeks} mgg lalu`;
    }
    if (diffDays > 0) {
      return `${diffDays} hr lalu`;
    }
    if (diffHours > 0) {
      return `${diffHours} jam lalu`;
    }
    if (diffMinutes > 0) {
      return `${diffMinutes} mnt lalu`;
    }

    return 'Baru saja';
  } catch (e) {
    return ''; // Atau tanggal asli jika format gagal
  }
};

export const fetchJobDetailApi = async (
  jobId: string,
  categoryId?: string,
): Promise<JobItemApi> => {
  try {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    let endpoint = JOBS_ENDPOINT;

    if (categoryId === MY_JOBS_CATEGORY.id && isLoggedIn) {
      endpoint = JOBS_ADMIN_ENDPOINT;
    }

    const response = await apiClient.get<JobDetailApiResponse>(endpoint, {
      params: {id: jobId},
    });

    if (response.data && response.data.status === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || `Failed to fetch job detail: ${jobId}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch job detail',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

// Utility function untuk format tanggal kadaluarsa (opsional)
export const formatExpiryDate = (dateString: string | null): string => {
  if (!dateString) {
    return 'Tidak ditentukan';
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const constructCloudinaryUrl = (slug: string): string => {
  const baseUrl =
    'https://res.cloudinary.com/dzq4j5v8m/image/upload/v1689690000/';
  const imageUrl = `${baseUrl}${slug}`;
  return imageUrl;
};

export const adminCreateJobApi = (
  payload: CreateJobPayload,
): Promise<AxiosResponse> => {
  try {
    const formdata = new FormData();

    // Append each field to the FormData object
    Object.entries(payload).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    return apiClient.post(JOBS_CREATE_ENDPOINT, formdata, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to create job');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const adminUpdateJobApi = (
  payload: UpdateJobPayload,
): Promise<AxiosResponse> => {
  try {
    const formdata = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    return apiClient.post(JOBS_UPDATE_ENDPOINT, formdata, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Failed to update job');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const adminDeleteJobsApi = (jobId: string): Promise<AxiosResponse> => {
  const data = qs.stringify({id: jobId});

  return apiClient.request({
    method: 'DELETE',
    url: JOBS_ADMIN_ENDPOINT,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
