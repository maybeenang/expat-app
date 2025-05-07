export interface RL42Response {
  status: number;
  message: string;
  data: RL42Item[];
  graphics: RL42Graphic[];
}

interface RL42Graphic {
  data_grafik: RL42DataGraphic[];
  judul_grafik: string;
}

interface RL42DataGraphic {
  label: string;
  value: string;
}

interface RL42Item {
  jml_laki: string;
  jml_perempuan: string;
  jml_total: string;
  jml_mati_laki: string;
  jml_mati_perempuan: string;
  jml_mati_total: string;
  kelompok_diagnosis_penyakit: string;
  kelompok_icd_10: string;
  periode: string;
}
