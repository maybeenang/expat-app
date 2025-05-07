export interface MktRajalResponse {
  status: number;
  message: string;
  total_pasien: number;
  total_pasien_baru: string;
  total_pasien_lama: number;
  data: MktRajalItem[];
}

interface MktRajalItem {
  id_reg: string;
  checkout_time: string;
  no_rm_pasien: string;
  panggilan_kehormatan: string;
  nama_pasien: string;
  pasien_baru_lama: string;
  nama_penjamin: string;
  nama_dpjp_dokter: string;
  ruang_rawat: string;
  poli: string;
}
