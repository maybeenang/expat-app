import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportType from '../../../enums/ExportType';
import {ExportResponse} from '../../../models/exportResponse';
import {MktRanapResponse} from '../models/mktRanapResponse';
import api from '../../../services/api';

export const getMktRanaps = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
): Promise<MktRanapResponse | null> => {
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
    const response = await api.get<MktRanapResponse>('/1421_mkt_ranap', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    console.log('Error fetching MKT Ranap:', error);
    return null;
  }
};

export const exportMktRanap = async (
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

    const response = await api.get<ExportResponse>(`/1421_mkt_ranap/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting MKT Ranap:', error);
    return 'Terjadi kesalahan!';
  }
};
