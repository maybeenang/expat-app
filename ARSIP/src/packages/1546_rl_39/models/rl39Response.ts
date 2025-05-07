export interface RL39Response {
  status: number;
  message: string;
  data: [
    string,
    string,
    string,
  ][];
}

export interface RL39Item {
  no: string;
  jenisKegiatan: string;
  jumlah: string;
}
