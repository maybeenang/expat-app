export interface RL52Response {
  status: number;
  message: string;
  data: RL52Item[];
  graphics: RL52Graphic[];
}

interface RL52Graphic {
  data_grafik: RL52DataGraphic[];
  judul_grafik: string;
}

interface RL52DataGraphic {
  label: string;
  value: string;
}

interface RL52Item {
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
