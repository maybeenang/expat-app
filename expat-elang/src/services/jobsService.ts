import axios from 'axios';
import {DEFAULT_JOBS_LIMIT, JOBS_ENDPOINT} from '../constants/api';
import type {JobListApiResponse} from '../types/jobs';
import apiClient from './authService';

// Fetch List Jobs (pagination, search, location)
export const fetchJobItemsApi = async (
  {pageParam = 1},
  searchTerm?: string,
  location?: string,
): Promise<JobListApiResponse> => {
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
    const response = await apiClient.get<JobListApiResponse>(JOBS_ENDPOINT, {
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

export const constructCloudinaryUrl = (slug: string): string => {
  const baseUrl =
    'https://res.cloudinary.com/dzq4j5v8m/image/upload/v1689690000/';
  const imageUrl = `${baseUrl}${slug}`;
  return imageUrl;
};
