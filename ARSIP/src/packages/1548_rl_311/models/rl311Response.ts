export interface RL311Response {
  status: number;
  message: string;
  data: [string, string, string][];
}

export interface RL311Item {
  jenisKegiatan: string;
  jumlah: string;
}
