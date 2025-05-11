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
  formatted_unavailable_date?: string | null; // Format yang lebih baik untuk ditampilkan
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

export interface CreateAdminCrewPayload {
  name: string;
  email: string;
  cell_number: string;
  company: string; // ID perusahaan (mis. "1" atau "2")
  pin: string; // PIN berupa string angka
  'id_master_contract_terms[]'?: string[]; // Array ID master contract terms, opsional
}

export interface CreateAdminCrewSuccessResponse {
  status: number;
  message: string;
}

export interface ApiErrorResponse {
  status: number; // Status HTTP error
  message: string; // Pesan error utama
  errors?: Record<string, string[] | string>; // Opsional: detail error per field
}

export interface CreateAdminCrewContractPayload {
  'id_master_contract_terms[]': string[]; // Array ID master contract terms, minimal satu
  id_users: string; // ID user (kru)
  id_company: string; // ID perusahaan
}

export interface CreateAdminCrewContractSuccessResponse {
  status: number;
  message: string;
}

export interface AddUnavailableDatePayload {
  id: number | string; // ID Kru (User). Dari API terlihat number, tapi string lebih aman untuk ID.
  unavailable_date: string[]; // Array string tanggal (format "YYYY-MM-DD")
}

export interface AddUnavailableDateSuccessResponse {
  status: number;
  message: string;
}

export type SignatureType = 'CREW' | 'ADMIN'; // Atau enum jika ada lebih banyak tipe

export interface AddSignaturePayload {
  id: string; // Diasumsikan ID Kontrak yang akan ditandatangani
  type_signature: SignatureType;
  base64_signature: string; // String base64 gambar tanda tangan (termasuk prefix data URI)
}

// Tipe untuk respons sukses dari API add_signature
export interface AddSignatureSuccessResponse {
  status: number;
  message: string;
  // Jika ada data lain (misalnya URL tanda tangan yang disimpan), tambahkan di sini
}
