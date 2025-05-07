export interface RL41Response {
  status: number;
  message: string;
  data: RL41Item[];
  graphics: RL41Graphic[];
}

interface RL41Graphic {
  data_grafik: RL41DataGraphic[];
  judul_grafik: string;
}

interface RL41DataGraphic {
  label: string,
  value: string,
}

interface RL41Item {
  age_0_1_hour_laki: string;
  age_0_1_hour_perempuan: string;
  age_1_7_days_laki: string;
  age_1_7_days_perempuan: string;
  age_1_24_hours_laki: string;
  age_1_24_hours_perempuan: string;
  age_1_to_5_years_laki: string;
  age_1_to_5_years_perempuan: string;
  age_3_to_6_months_laki: string;
  age_3_to_6_months_perempuan: string;
  age_5_to_10_years_laki: string;
  age_5_to_10_years_perempuan: string;
  age_6_months_to_1_year_laki: string;
  age_6_months_to_1_year_perempuan: string;
  age_7_28_days_laki: string;
  age_7_28_days_perempuan: string;
  age_10_to_15_years_laki: string;
  age_10_to_15_years_perempuan: string;
  age_15_to_20_years_laki: string;
  age_15_to_20_years_perempuan: string;
  age_20_to_25_years_laki: string;
  age_20_to_25_years_perempuan: string;
  age_25_to_30_years_laki: string;
  age_25_to_30_years_perempuan: string;
  age_28_days_to_3_months_laki: string;
  age_28_days_to_3_months_perempuan: string;
  age_30_to_35_years_laki: string;
  age_30_to_35_years_perempuan: string;
  age_35_to_40_years_laki: string;
  age_35_to_40_years_perempuan: string;
  age_40_to_45_years_laki: string;
  age_40_to_45_years_perempuan: string;
  age_45_to_50_years_laki: string;
  age_45_to_50_years_perempuan: string;
  age_50_to_55_years_laki: string;
  age_50_to_55_years_perempuan: string;
  age_55_to_60_years_laki: string;
  age_55_to_60_years_perempuan: string;
  age_60_to_65_years_laki: string;
  age_60_to_65_years_perempuan: string;
  age_65_to_70_years_laki: string;
  age_65_to_70_years_perempuan: string;
  age_70_to_75_years_laki: string;
  age_70_to_75_years_perempuan: string;
  age_75_to_80_years_laki: string;
  age_75_to_80_years_perempuan: string;
  age_80_to_85_years_laki: string;
  age_80_to_85_years_perempuan: string;
  age_85_and_up_laki: string;
  age_85_and_up_perempuan: string;
  diagnosis_penyakit: string;
  jml_laki: string;
  jml_perempuan: string;
  jml_total: string;
  jml_mati_laki: string;
  jml_mati_perempuan: string;
  jml_mati_total: string;
  kode_icd: string;
  periode: string;
}
