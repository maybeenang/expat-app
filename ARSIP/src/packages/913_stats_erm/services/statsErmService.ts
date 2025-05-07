import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {StatsErmResponse} from '../models/statsErmResponse';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';

export const getStatsErms = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<StatsErmResponse | null> => {
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

    console.log(params.filter);
    console.log(params.bulan);
    console.log(params.tahun);

    // API call
    const response = await api.get<StatsErmResponse>('/913_stats_erm', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    // console.log('Error fetching stats ERM:', error);
    return null;
  }
};

export const exportStatsErm = async (
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

    const response = await api.get<ExportResponse>(`/913_stats_erm/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting stats ERM:', error);
    return 'Terjadi kesalahan!';
  }
};
