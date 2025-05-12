export interface CrewOption {
  id: string;
  name: string;
}

export interface AreaOption {
  area: string;
}

export interface AdminCrewAssignedOptionsData {
  crews: CrewOption[];
  area: AreaOption[];
}

// Tipe untuk keseluruhan respons API get_options
export interface AdminCrewAssignedOptionsResponse {
  status: number;
  message: string;
  data: AdminCrewAssignedOptionsData;
}

// --- Tipe untuk List Calendar ---

// Tipe untuk satu item event/assignment dalam list_calendar
export interface AssignedEvent {
  id: string; // ID Event/Assignment
  location_ceremony: string | null;
  event_date: string; // Format "YYYY-MM-DD"
  nama1: string | null; // Nama klien 1
  nama2: string | null; // Nama klien 2
  client_names: string; // Gabungan nama klien
  area: string | null;
  coverage_by: string | null;
  id_master_status: string | null; // Bisa jadi ID status event
  id_users: string | null; // String ID user yang di-assign, bisa multiple dipisah '|', mis. "|10|15|"
  payment: string | null; // Jumlah pembayaran
  total_contract: string | null; // Total nilai kontrak
  balance: string | null; // Sisa pembayaran
  id_exhibit_a: string | null; // Bisa multiple ID dipisah koma atau pipe
  list_crews: string | null; // String daftar kru yang di-assign dengan detail bayaran
  id_company: string | null;
  company_name: string | null;
  company: string | null; // Gabungan ID dan nama perusahaan
  hutang_gaji_karyawan: number;
  total_exhibit_a: number;
}

// Tipe untuk keseluruhan respons API list_calendar
export interface AdminCrewAssignedCalendarResponse {
  status: number;
  message: string;
  total_data: number; // Total data event (bukan paginasi, tapi jumlah total untuk filter tsb)
  data: AssignedEvent[];
}

// Tipe untuk parameter request list_calendar
export interface GetAssignedCalendarParams {
  id_users?: string; // ID user (crew) untuk filter
  area?: string;
  year?: number | string; // Tahun, bisa string atau number
  // Tambahkan parameter filter lain jika ada (mis. month, status, dll.)
}
