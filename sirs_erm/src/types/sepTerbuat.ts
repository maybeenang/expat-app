export interface SepTerbuat {
  id: string;
  noSep: string;
  noKartu: string;
  id_pasien_registrasi: string;
  nama_petugas_input: string;
  created_date: string;
  code_diagAwal: string | null;
  diagAwal: string | null;
}

export interface SepTerbuatListParams {
  filter: 'hari' | 'bulan' | 'range' | 'tahun';
  deleted: 'active' | 'deleted';
  limit: number;
  page?: number;
  search?: string;
  code_diag_awal?: string;
  jns_pelayanan?: number;
  // Range filter
  range_start?: string;
  range_end?: string;
  // Hari filter
  date?: string;
  // Bulan filter
  month?: string;
  year?: string;
}

export interface SepTerbuatListResponse {
  status: number;
  message: string;
  data: SepTerbuat[];
  pagination: {
    total_data: number;
    limit: number;
    current_page: number;
    total_pages: number;
  };
}
