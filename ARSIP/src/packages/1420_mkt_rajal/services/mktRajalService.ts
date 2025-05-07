import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportType from '../../../enums/ExportType';
import {ExportResponse} from '../../../models/exportResponse';
import {MktRajalResponse} from '../models/mktRajalResponse';
import api from '../../../services/api';

export const getMktRajals = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
): Promise<MktRajalResponse | null> => {
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
    const response = await api.get<MktRajalResponse>('/1420_mkt_rajal', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    console.log('Error fetching MKT Rajal:', error);
    return null;
  }
};

export const exportMktRajal = async (
  type: ExportType,
  tahun?: string,
  bulan?: string,
): Promise<ExportResponse | string> => {
  try {
    const token = await AsyncStorage.getItem('token');

    const params: Record<string, string | boolean> = {};
    if (tahun) {
      params.tahun = tahun;
    }
    if (bulan) {
      params.bulan = bulan;
    }

    const response = await api.get<ExportResponse>(`/1420_mkt_rajal/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting MKT Rajal:', error);
    return 'Terjadi kesalahan!';
  }
};
