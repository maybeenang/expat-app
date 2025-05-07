export interface MktRanapResponse {
  status: number;
  message: string;
  total_pasien: number;
  total_pasien_baru: string;
  total_pasien_lama: number;
  data: MktRanapItem[];
}

interface MktRanapItem {
  id_reg: string;
  checkout_time: string;
  no_rm_pasien: string;
  panggilan_kehormatan: string;
  nama_pasien: string;
  pasien_baru_lama: string;
  nama_penjamin: string;
  nama_dpjp_dokter: string;
  ruang_rawat: string;
}
