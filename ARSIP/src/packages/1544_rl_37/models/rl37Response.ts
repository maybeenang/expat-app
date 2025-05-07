export interface RL37Response {
  status: number;
  message: string;
  data: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ][];
}

export interface RL37Item {
  no: string;
  jenisKegiatan: string;
  rujukanMedisRumahSakit: string;
  rujukanMedisBidan: string;
  rujukanMedisPuskesmas: string;
  rujukanMedisFaskesLainnya: string;
  rujukanMedisJumlahHidup: string;
  rujukanMedisJumlahMati: string;
  totalRujukanMedis: string;
  rujukanNonMedisJumlahHidup: string;
  rujukanNonMedisJumlahMati: string;
  totalRujukanNonMedis: string;
  nonRujukanJumlahHidup: string;
  nonRujukanJumlahMati: string;
  totalNonRujukan: string;
  dirujuk: string;
}
