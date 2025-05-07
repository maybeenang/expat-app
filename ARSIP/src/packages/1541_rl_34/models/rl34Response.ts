export interface RL34Response {
  status: number;
  message: string;
  data: [string, string, string][];
  graphics: RL34Graphic[];
}

export interface RL34Data {
  data: RL34Item[];
  graphicsData: RL34DataGraphic[];
}

export interface RL34Item {
  no: number;
  jenisPengunjung: string;
  jumlah: string;
}

interface RL34Graphic {
  data_grafik: RL34DataGraphic[];
  judul_grafik: string;
}

export interface RL34DataGraphic {
  label: string;
  pengunjung_baru: string;
  pengunjung_lama: string;
}
