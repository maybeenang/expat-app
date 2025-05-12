export interface ContactResultDesc {
  package: string | null;
  event_location: string | null;
  reception_location: string | null;
  instagram: string | null;
  attracted_work: string | null;
  how_did_you_hear: string | null;
  // Tambahkan properti lain jika ada di dalam JSON 'desc'
}

// Tipe untuk satu item Contact Result
export interface ContactResultItem {
  id: string;
  desc: string; // String JSON, perlu di-parse
  parsedDesc?: ContactResultDesc; // Properti opsional untuk menyimpan hasil parsing 'desc'
  company: string | null;
  wedding_date: string | null; // Format "YYYY-MM-DD"
  area: string | null;
  name1: string | null;
  email1: string | null;
  cellphone1: string | null;
  name2: string | null;
  email2: string | null;
  cellphone2: string | null;
}

// Tipe untuk informasi paginasi (bisa di-reuse dari fitur lain jika ada)
export interface PaginationInfo {
  total_data: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

// Tipe untuk keseluruhan respons API get list contact_result
export interface ContactResultsListApiResponse {
  status: number;
  message: string;
  total_data: number; // Total data keseluruhan yang cocok filter
  data: ContactResultItem[];
  pagination: PaginationInfo;
}

// Tipe untuk parameter request get list contact_result
export interface GetContactResultsParams {
  company?: string; // Nama perusahaan untuk filter
  page?: number;
  limit?: number;
  search?: string; // Jika ada parameter search di masa depan
}

// Tipe untuk respons sukses dari API delete contact_result
export interface DeleteContactResultSuccessResponse {
  status: string; // API mengembalikan "200" sebagai string
  message: string;
}
