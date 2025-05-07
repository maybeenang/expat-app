import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import {RL37Item, RL37Response} from '../models/rl37Response';

export const getRl37 = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<RL37Item[] | null> => {
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

    console.log('month ' + params.bulan);
    console.log('year ' + params.tahun);

    // API call
    let response = await api.get<RL37Response>('/1544_rl_37', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    const formattedData: RL37Item[] = response.data.data.map(item => ({
      no: item[0],
      jenisKegiatan: item[1],
      rujukanMedisRumahSakit: item[2],
      rujukanMedisBidan: item[3],
      rujukanMedisPuskesmas: item[4],
      rujukanMedisFaskesLainnya: item[5],
      rujukanMedisJumlahHidup: item[6],
      rujukanMedisJumlahMati: item[7],
      totalRujukanMedis: item[8],
      rujukanNonMedisJumlahHidup: item[9],
      rujukanNonMedisJumlahMati: item[10],
      totalRujukanNonMedis: item[11],
      nonRujukanJumlahHidup: item[12],
      nonRujukanJumlahMati: item[13],
      totalNonRujukan: item[14],
      dirujuk: item[15],
    }));

    return response.data.status === 200 ? formattedData : null;
  } catch (error) {
    console.log('Error fetching rl 37:', error);
    return null;
  }
};

export const exportRL37 = async (
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

    const response = await api.get<ExportResponse>(`/1544_rl_37/${type}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting rl 37:', error);
    return 'Terjadi kesalahan!';
  }
};
