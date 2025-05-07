export interface MktAsalPasienResponse {
  status: number;
  message: string;
  total_pasien: number;
  total_pasien_baru: number;
  total_pasien_lama: number;
  data: MktAsalPasienItem[];
}

interface MktAsalPasienItem {
  id_reg: string;
  no_rm_pasien: string;
  panggilan_kehormatan: string;
  nama_pasien: string;
  pasien_baru_lama: string;
  nama_penjamin: string;
  nama_faskes_perujuk: string;
  dpjp_faskes_perujuk: string;
  cara_datang: string;
  no_rm_dpjp: string;
  nama_dpjp_dokter: string;
}
