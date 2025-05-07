import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import { RL43Response } from '../models/rl43Response';

export const getRl43 = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<RL43Response | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return null;
    }

    const params: Record<string, string | boolean> = {filter};
    if (tahun) {
      params.tahun = tahun;
    }
    if (bulan) {
      params.bulan = bulan;
    }
    if (tanggal) {
      params.tanggal = tanggal;
    }
    if (rangeStart) {
      params.range_start = rangeStart;
    }
    if (rangeEnd) {
      params.range_end = rangeEnd;
    }

    // API call
    const response = await api.get<RL43Response>('/1559_rl_43', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    console.log('Error fetching rl 43:', error);
    return null;
  }
};

export const exportRL43 = async (
  type: ExportType,
  filter: string,
  graphic: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<ExportResponse | String> => {
  try {
    const token = await AsyncStorage.getItem('token');

    const params: Record<string, string | boolean> = {filter};
    if (tahun) {
      params.tahun = tahun;
    }
    if (bulan) {
      params.bulan = bulan;
    }
    if (tanggal) {
      params.tanggal = tanggal;
    }
    if (rangeStart) {
      params.range_start = rangeStart;
    }
    if (rangeEnd) {
      params.range_end = rangeEnd;
    }
    params.grafik = graphic;

    const response = await api.get<ExportResponse>(`/1559_rl_43/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting rl 43:', error);
    return 'Terjadi kesalahan!';
  }
};
