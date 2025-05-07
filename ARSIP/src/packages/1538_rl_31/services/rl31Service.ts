import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import {RL31Item, RL31Response} from '../models/rl31Response';

export const getRl31 = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<RL31Item[] | null> => {
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
    let response = await api.get<RL31Response>('/1538_rl_31', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    const formattedData: RL31Item[] = response.data.data.map(item => ({
      jenisPelayanan: item[1],
      bor: item[2],
      alos: item[3],
      bto: item[4],
      toi: item[5],
      ndr: item[6],
      gdr: item[7],
    }));

    return response.data.status === 200 ? formattedData : null;
  } catch (error) {
    console.log('Error fetching rl 31:', error);
    return null;
  }
};

export const exportRL31 = async (
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

    const response = await api.get<ExportResponse>(`/1538_rl_31/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting rl 31:', error);
    return 'Terjadi kesalahan!';
  }
};
