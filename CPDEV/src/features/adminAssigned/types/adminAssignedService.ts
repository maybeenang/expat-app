import apiClient from '../../../services/apiClient'; // Sesuaikan path
import {AxiosError} from 'axios';
import {
  AdminCrewAssignedCalendarResponse,
  AdminCrewAssignedOptionsData,
  AdminCrewAssignedOptionsResponse,
  AssignedEvent,
  GetAssignedCalendarParams,
} from './adminAssigned';
import {
  ADMIN_ASSIGNED_LIST_CALENDAR_ENDPOINT,
  ADMIN_ASSIGNED_OPTIONS_ENDPOINT,
} from '../../../contants/endpoints';

export const fetchAdminCrewAssignedOptions =
  async (): Promise<AdminCrewAssignedOptionsData> => {
    try {
      const response = await apiClient.get<AdminCrewAssignedOptionsResponse>(
        ADMIN_ASSIGNED_OPTIONS_ENDPOINT,
      );
      if (response.data && response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch assigned crew options',
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        'Error fetching assigned crew options:',
        axiosError.response?.data || axiosError.message,
      );
      throw error;
    }
  };

export const fetchAdminCrewAssignedCalendar = async (
  params: GetAssignedCalendarParams,
): Promise<AssignedEvent[]> => {
  // Kita langsung kembalikan array data event
  try {
    // Pastikan parameter dikirim dengan benar, terutama jika ada yang opsional
    const activeParams: Record<string, string | number> = {};
    if (params.id_users) {
      activeParams.id_users = params.id_users;
    }
    if (params.area) {
      activeParams.area = params.area;
    }
    if (params.year) {
      activeParams.year = params.year.toString();
    }

    const response = await apiClient.get<AdminCrewAssignedCalendarResponse>(
      ADMIN_ASSIGNED_LIST_CALENDAR_ENDPOINT,
      {
        params: activeParams,
      },
    );

    if (
      response.data &&
      response.data.status === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data; // Kembalikan array AssignedEvent
    } else if (
      response.data &&
      response.data.status === 200 &&
      !Array.isArray(response.data.data)
    ) {
      // Handle kasus jika 'data' ada tapi bukan array (mis. objek kosong jika tidak ada hasil)
      console.warn(
        'fetchAdminCrewAssignedCalendar: response.data.data is not an array, returning empty array.',
      );
      return [];
    } else {
      throw new Error(
        response.data?.message || 'Failed to fetch assigned crew calendar',
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      'Error fetching assigned crew calendar:',
      axiosError.response?.data || axiosError.message,
    );
    throw error;
  }
};
