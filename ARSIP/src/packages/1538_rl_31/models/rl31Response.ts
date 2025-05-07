export interface RL31Response {
  status: number;
  message: string;
  data: [string, string, string, string, string, string, string, string][];
}

export interface RL31Item {
  jenisPelayanan: string;
  bor: string;
  alos: string;
  bto: string;
  toi: string;
  ndr: string;
  gdr: string;
}
