export interface RL53Response {
  status: number;
  message: string;
  data: RL53Item[];
  graphics: RL53Graphic[];
}

interface RL53Graphic {
  data_grafik: RL53DataGraphic[];
  judul_grafik: string;
}

interface RL53DataGraphic {
  label: string;
  value: string;
}

interface RL53Item {
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
