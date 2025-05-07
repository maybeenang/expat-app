import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import {RL34Data, RL34Item, RL34Response} from '../models/rl34Response';

export const getRl34 = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<RL34Data | null> => {
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
    let response = await api.get<RL34Response>('/1541_rl_34', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    const formattedData: RL34Data = {
      data: response.data.data.map(item => ({
        no: item[0],
        jenisPengunjung: item[1],
        jumlah: item[2],
      })),
      graphicsData: response.data.graphics[0].data_grafik,
    };

    return response.data.status === 200 ? formattedData : null;
  } catch (error) {
    console.log('Error fetching rl 34:', error);
    return null;
  }
};

export const exportRL34 = async (
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

    const response = await api.get<ExportResponse>(`/1541_rl_34/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting rl 34:', error);
    return 'Terjadi kesalahan!';
  }
};
