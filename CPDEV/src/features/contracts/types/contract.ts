import type {ContractTerm as AdminCrewContractTerm} from '../../adminCrews/types'; // Sesuaikan path

export type ContractContentItem = AdminCrewContractTerm;

export interface ContractDetailData {
  id: string; // ID kontrak
  id_users: string;
  contract_number: string;
  crew_signature: string | null;
  crew_signature_date: string | null;
  admin_signature: string | null;
  admin_signature_date: string | null;
  id_company: string;
  created_date: string;
  name: string;
  email: string;
  cell_number: string;
  role: string; // Bisa lebih spesifik jika role diketahui
  unavailable_date: string | null;
  contracts: ContractContentItem[]; // Ini adalah array 'isi_kontrak' dari respons
}

export interface ContractDetailApiResponse {
  status: number;
  message: string;
  data: ContractDetailData;
}
