import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportType from '../../../enums/ExportType';
import {ExportResponse} from '../../../models/exportResponse';
import {MktAsalPasienResponse} from '../models/mktAsalPasienResponse';
import api from '../../../services/api';
import {FilterItem, FilterResponse} from '../../../models/filterResponse';

export const getMktAsalPasien = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  referringFacility?: string,
): Promise<MktAsalPasienResponse | null> => {
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
    if (referringFacility) {
      params.nama_faskes_perujuk = referringFacility;
    }
    const response = await api.get<MktAsalPasienResponse>(
      '/1422_mkt_asal_pasien',
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = response.data.data;

    // Count total
    const total_pasien = data.length;
    const total_pasien_baru = data.filter(
      item => item.pasien_baru_lama.toLowerCase() === 'baru',
    ).length;
    const total_pasien_lama = data.filter(
      item => item.pasien_baru_lama.toLowerCase() === 'lama',
    ).length;

    // Assign calculated values
    const finalResponse: MktAsalPasienResponse = {
      ...response.data,
      total_pasien,
      total_pasien_baru,
      total_pasien_lama,
    };

    return response.data.status === 200 ? finalResponse : null;
  } catch (error) {
    console.log('Error fetching MKT Asal Pasien:', error);
    return null;
  }
};

export const exportMktAsalPasien = async (
  type: ExportType,
  tahun?: string,
  bulan?: string,
  referringFacility?: string,
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
    if (referringFacility) {
      params.nama_faskes_perujuk = referringFacility;
    }

    const response = await api.get<ExportResponse>(
      `/1422_mkt_asal_pasien/${type}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting MKT Asal Pasien:', error);
    return 'Terjadi kesalahan!';
  }
};
