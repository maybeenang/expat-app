export interface BedHistoryResponse {
  status: number;
  message: string;
  data: BedHistoryItem[];
}

export interface BedHistoryItem {
  id: string;
  siranap_perawatan: string;
  rsonline_perawatan: string;
  id_bed: string;
  bed_occupied_date: string;
  check_in_bed: string;
  check_out_bed: string;
  checkin_petugas: string;
  checkout_petugas: string;
  dinkes_jenis_bed: string;
  honorifics: string;
  id_dept: string;
  id_episode?: string | null;
  id_kamar: string;
  id_reg: string;
  id_visit: string;
  is_bor: string;
  is_covid?: string | null;
  is_pasien_baru: string;
  is_pasien_luar: string;
  is_pasien_titip?: string | null;
  jenis_rawat: string;
  kelas: string;
  kode_siranap_kelas_perawatan: string;
  kode_siranap_ruang_perawatan: string;
  nama_bed: string;
  nama_cara_datang: string;
  nama_dept_asal: string;
  nama_dpjp_dokter: string;
  nama_pasien: string;
  nama_penjamin: string;
  nama_pj_visit: string;
  nama_ruangan_perawatan: string;
  no_reg: string;
  no_rm_pasien: string;
  no_visit: string;
  umur: string;
}
