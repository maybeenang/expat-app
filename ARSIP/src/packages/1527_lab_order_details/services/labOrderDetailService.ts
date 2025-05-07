import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {ExportResponse} from '../../../models/exportResponse';
import ExportType from '../../../enums/ExportType';
import {LabOrderDetailResponse} from '../models/labOrderDetailResponse';
import {FilterItem, FilterResponse} from '../../../models/filterResponse';

export const getLabOrderDetail = async (
  filter: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
  deptOriginal?: string,
  deptDestination?: string,
  patientStatus?: string,
  analystName?: string,
  analystNoRm?: string,
  dpjpLabName?: string,
  dpjpLabNoRm?: string,
  pjLabName?: string,
  pjLabNoRm?: string,
  activityName?: string,
): Promise<LabOrderDetailResponse | null> => {
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
    if (deptOriginal) {
      params.deptori_nama_dept_ori = deptOriginal;
    }
    if (deptDestination) {
      params.deptori_nama_dept_dest = deptDestination;
    }
    if (patientStatus) {
      params.status_pasien = patientStatus;
    }
    if (analystName) {
      params.analis_nama = analystName;
    }
    if (analystNoRm) {
      params.analis_no_rm = analystNoRm;
    }
    if (dpjpLabName) {
      params.dpjp_lab_nama = dpjpLabName;
    }
    if (dpjpLabNoRm) {
      params.dpjp_lab_no_rm = dpjpLabNoRm;
    }
    if (pjLabName) {
      params.pj_lab_nama = pjLabName;
    }
    if (pjLabNoRm) {
      params.pj_lab_no_rm = pjLabNoRm;
    }
    if (activityName) {
      params.nama_kegiatan = activityName;
    }

    // API call
    const response = await api.get<LabOrderDetailResponse>(
      '/1527_lab_order_details',
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data);

    return response.data.status === 200 ? response.data : null;
  } catch (error) {
    console.log('Error fetching Lab Order Detail:', error);
    return null;
  }
};

export const exportLabOrderDetail = async (
  type: ExportType,
  filter: string,
  graphic: string,
  tahun?: string,
  bulan?: string,
  tanggal?: string,
  rangeStart?: string,
  rangeEnd?: string,
  deptOriginal?: string,
  deptDestination?: string,
  patientStatus?: string,
  analystName?: string,
  analystNoRm?: string,
  dpjpLabName?: string,
  dpjpLabNoRm?: string,
  pjLabName?: string,
  pjLabNoRm?: string,
  activityName?: string,
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
    if (deptOriginal) {
      params.deptori_nama_dept_ori = deptOriginal;
    }
    if (deptDestination) {
      params.deptori_nama_dept_dest = deptDestination;
    }
    if (patientStatus) {
      params.status_pasien = patientStatus;
    }
    if (analystName) {
      params.analis_nama = analystName;
    }
    if (analystNoRm) {
      params.analis_no_rm = analystNoRm;
    }
    if (dpjpLabName) {
      params.dpjp_lab_nama = dpjpLabName;
    }
    if (dpjpLabNoRm) {
      params.dpjp_lab_no_rm = dpjpLabNoRm;
    }
    if (pjLabName) {
      params.pj_lab_nama = pjLabName;
    }
    if (pjLabNoRm) {
      params.pj_lab_no_rm = pjLabNoRm;
    }
    if (activityName) {
      params.nama_kegiatan = activityName;
    }
    params.grafik = graphic;

    const response = await api.get<ExportResponse>(
      `/1527_lab_order_details/${type}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data);

    return response.data.status === 200 ? response.data : 'Terjadi kesalahan!';
  } catch (error) {
    console.log('Error exporting lab order detail:', error);
    return 'Terjadi kesalahan!';
  }
};

export const getFilterDataLabOrderDetail = async (
  type: string,
): Promise<FilterItem[]> => {
  try {
    const token = await AsyncStorage.getItem('token');

    const params: Record<string, string | boolean> = {type};

    const response = await api.get<FilterResponse>(
      '/1527_lab_order_details/filter',
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.status === 200 ? response.data.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
