export interface RadOrderNoRegResponse {
  status: number;
  message: string;
  data: RadOrderNoRegItem[];
  summary_umur: SummaryItem[];
  summary_agama: SummaryItem[];
  summary_jenis_rawat: SummaryItem[];
  summary_ruang_rawat: SummaryItem[];
  summary_nama_cara_datang: SummaryItem[];
  summary_nama_dpjp_dokter: SummaryItem[];
  summary_alasan_checkout: SummaryItem[];
  summary_kondisi_checkout: SummaryItem[];
  summary_marital_status: SummaryItem[];
  summary_kelurahan: SummaryItem[];
  summary_kecamatan: SummaryItem[];
  summary_kabupaten: SummaryItem[];
  summary_provinsi: SummaryItem[];
  summary_checkout_followup: SummaryItem[];
  summary_sumber_reg: SummaryItem[];
  summary_nama_faskes_perujuk: SummaryItem[];
  summary_dpjp_faskes_perujuk: SummaryItem[];
  summary_perujuk_faskes: SummaryItem[];
  summary_igd_trauma: SummaryItem[];
  summary_nama_reason_rujukan: SummaryItem[];
  summary_checkout_reason_rujukan: SummaryItem[];
  summary_status_ktp: SummaryItem[];
  summary_puskesmas_kelurahan: SummaryItem[];
  summary_posyandu: SummaryItem[];
  summary_kasus_polisi: SummaryItem[];
  summary_cara_masuk: SummaryItem[];
  summary_kendaraan: SummaryItem[];
  summary_jenis_kunjungan_igd: SummaryItem[];
  summary_jenis_triase_igd: SummaryItem[];
  summary_jenis_pulang_igd_rajal: SummaryItem[];
  summary_apakah_operasi_sc: SummaryItem[];
  summary_nama_akun_coa_payment: SummaryItem[];
  summary_grup_ews: SummaryItem[];
  summary_date_meninggal: SummaryItem[];
  summary_blood_type: SummaryItem[];
}

export interface SummaryItem {
  keterangan: string | null;
  total_orders: string;
}

export interface RadOrderNoRegItem {
  hasil_approved_by: string;
  hasil_approved_date: string;
  hasil_catatan_tambahan: string;
  hasil_dpjp_rad_nama: string;
  hasil_dpjp_rad_no_rm: string;
  hasil_hasil_baca: string;
  hasil_jenis_film: string;
  hasil_jenis_film_gagal: string;
  hasil_jml_ekspos: string;
  hasil_jml_film: string;
  hasil_jml_film_gagal: string;
  hasil_job_code: string;
  hasil_job_jenis: string;
  hasil_job_kategori: string;
  hasil_kV: string;
  hasil_kesan_hasil_expertise: string;
  hasil_klinis_pasien: string;
  hasil_mA: string;
  hasil_mAs: string;
  hasil_ms: string;
  hasil_mulai_pemeriksaan: string;
  hasil_nilai_di_skip: string;
  hasil_pesan: string;
  hasil_preapproved_by: string;
  hasil_preapproved_date: string;
  hasil_s: string;
  hasil_selesai_pemeriksaan: string;
  hasil_status_kritis: string;
  hasil_tingkat_dosis_radiasi: string;

  id_reg: string;
  id_visit: string;
  jenis_kelamin: string;
  nama_pasien: string;
  no_rm_pasien: string;
  order_date: string;
  order_jenis_tarif: string;
  order_nama_kegiatan: string;
  order_nama_tarif: string;
  order_oleh: string;
  order_resume_billing_group: string;
  order_tarif_group: string;
  order_tarif_jenis_rawat: string;
  order_tarif_kelas: string;
  panggilan_kehormatan: string;
}
