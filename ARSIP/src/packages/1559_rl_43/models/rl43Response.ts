export interface RL43Response {
  status: number;
  message: string;
  data: RL43Item[];
  graphics: RL43Graphic[];
}

interface RL43Graphic {
  data_grafik: RL43DataGraphic[];
  judul_grafik: string;
}

interface RL43DataGraphic {
  label: string;
  value: string;
}

interface RL43Item {
  kelompok_icd_10: string;
  periode: string;
  jml_laki: string;
  jml_perempuan: string;
  jml_total: string;
  jml_mati_laki: string;
  jml_mati_perempuan: string;
  jml_mati_total: string;
  kelompok_diagnosis_penyakit: string;
}
