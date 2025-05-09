export interface ContractTerm {
  id_contract_terms: string;
  title_contract_terms: string;
  contract_terms: string; // Ini berisi HTML, mungkin perlu penanganan khusus di UI
}

export interface Contract {
  id: string;
  id_company: string;
  id_users: string;
  contract_number: string;
  crew_signature: string | null;
  crew_signature_date: string | null; // Sebaiknya di-parse menjadi Date object jika digunakan
  isi_kontrak: ContractTerm[];
  admin_signature: string | null;
  admin_signature_date: string | null; // Sebaiknya di-parse menjadi Date object
  created_date: string; // Sebaiknya di-parse menjadi Date object
  auto_send_email: string | null; // Tipe sebenarnya mungkin boolean atau string tertentu
  company_name: string;
}

export interface AdminCrew {
  id: string;
  name: string;
  email: string;
  cell_number: string; // Meskipun angka, seringkali lebih aman sebagai string jika ada format khusus
  role: 'CREW' | string; // Bisa lebih spesifik jika ada role lain
  unavailable_date: string | null; // Sebaiknya di-parse menjadi Date object
  contracts: Contract[];
}

export interface PaginationInfo {
  total_data: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

// Tipe untuk respons API yang berhasil
export interface AdminCrewsApiResponse {
  status: number;
  message: string;
  data: AdminCrew[];
  pagination: PaginationInfo;
}

export interface AdminCrewDetailApiResponse {
  status: number;
  message: string;
  data: AdminCrew; // Menggunakan kembali tipe AdminCrew yang sudah ada
}

// Tipe untuk parameter request (termasuk paginasi dan search)
export interface GetAdminCrewsParams {
  limit?: number;
  page?: number;
  search?: string;
  // Tambahkan filter lain jika ada (mis. role, status, dll.)
}
