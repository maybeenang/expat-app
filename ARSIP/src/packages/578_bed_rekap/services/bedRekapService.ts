import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import {BedRekapResponse} from '../models/bedRekapResponse';
import {FilterItem, FilterResponse} from '../../../models/filterResponse';

export const getBedRekap = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
  treatmentRoomName?: string,
  bedName?: string,
  classItem?: string,
): Promise<BedRekapResponse | null> => {
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
    if (treatmentRoomName) {
      params.nama_ruangan_perawatan = treatmentRoomName;
    }
    if (bedName) {
      params.nama_bed = bedName;
    }
    if (classItem) {
      params.kelas = classItem;
    }

    // API call
    const response = await api.get<BedRekapResponse>('/578_bed_rekap', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    console.log('Error fetching bed Rekap:', error);
    return null;
  }
};

export const exportBedRekap = async (
  type: ExportType,
  filter: string,
  graphic: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
  treatmentRoomName?: string,
  bedName?: string,
  classItem?: string,
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
    if (treatmentRoomName) {
      params.nama_ruangan_perawatan = treatmentRoomName;
    }
    if (bedName) {
      params.nama_bed = bedName;
    }
    if (classItem) {
      params.kelas = classItem;
    }
    params.grafik = graphic;

    const response = await api.get<ExportResponse>(`/578_bed_rekap/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting bed Rekap:', error);
    return 'Terjadi kesalahan!';
  }
};

export const getFilterDataBedRekap = async (
  type: string,
): Promise<FilterItem[]> => {
  try {
    const token = await AsyncStorage.getItem('token');

    const params: Record<string, string | boolean> = {type};

    const response = await api.get<FilterResponse>('/578_bed_rekap/filter', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(type + ' : ' + response.data.data);

    return response.data.status === 200 ? response.data.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
