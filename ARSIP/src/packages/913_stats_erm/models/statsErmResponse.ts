export interface StatsErmResponse {
  status: number;
  message: string;
  data: StatsErmItem[];
  graphics: StatsErmGraphic[];
}

interface StatsErmGraphic {
  data_grafik: StatsErmDataGraphic[];
  judul_grafik: string;
}

interface StatsErmDataGraphic {
  label: string;
  value: string;
}

export interface StatsErmItem {
  periode: string;
  id_erm: string;
  id_erm_count: string;
  kode_form: string;
  nama_form: string;
}
