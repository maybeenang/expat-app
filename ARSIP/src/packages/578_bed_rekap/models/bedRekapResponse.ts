export interface BedRekapResponse {
  status: number;
  message: string;
  data: BedRekapItem[];
}

export interface BedRekapItem {
  id: string;
  id_dept: string;
  id_kamar: string;
  id_bed: string;
  nama_bed: string;
  nama_ruangan_perawatan: string;
  bed_occupied_date: string;
  kelas: string;
  rsonline_perawatan: string;
  siranap_perawatan: string;
}
