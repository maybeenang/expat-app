export type JobListItemBase = {
  id: string;
  type?: 'ads' | 'jobs';
};

// Tipe untuk Item Iklan
export interface JobAd extends JobListItemBase {
  type: 'ads';
  ads_location: string;
  x_order: string;
  slug: string;
  external_url: string | null;
  img_url: string;
}

export interface JobItemApi extends JobListItemBase {
  type?: 'jobs'; // Opsional jika tidak selalu ada di API
  id: string; // Override karena tipe dasar opsional
  id_company: string;
  id_users: string | null;
  is_paid: string | null; // '1' or null
  is_paid_display: string; // "Paid" or "Free"
  jobs_judul: string;
  jobs_slug: string;
  jobs_desc: string;
  jobs_location_city: string;
  jobs_location_state: string;
  jobs_location_country: string;
  jobs_post_exp_date: string; // Datetime string
  contact_info_email: string;
  contact_info_phone: string;
  contact_info_web: string;
  created_date: string;
  created_by: string;
  salary_range_start: string | null; // String number
  salary_range_end: string | null; // String number
  salary_currency: string | null;
  company_logo_slug: string | null; // Slug CloudFront atau path
  company_name: string;
  company_address: string;
  company_descriptions: string;
  company_web: string;
  company_email: string;
  company_phone: string;
  jobs_desc_excerpt: string;
  // Property CloudFront (jika perlu diolah terpisah)
  company_logo_url?: string; // Bisa ditambahkan saat processing
}

// Tipe untuk response API list (data bisa berisi Job atau Ad)
export interface JobListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: (JobItemApi | JobAd)[]; // Array berisi campuran Job dan Ad
}

// Tipe yang diproses untuk UI Job Item Card
export interface ProcessedJobItem {
  id: string;
  title: string;
  companyName: string;
  location: string; // Gabungan city & state
  salaryFormatted: string | null; // Gaji sudah diformat atau null
  logoUrl: string | null; // URL logo perusahaan (sudah di-construct)
  postDateFormatted: string; // Tanggal posting
  slug: string;
  isPaid: boolean;
}

export interface ProcessedAdItem {
  id: string;
  imageUrl: string;
  externalUrl: string | null;
}

// Tipe Union untuk item di FlatList UI (bisa Job atau Ad)
export type ProcessedListItem =
  | {type: 'job'; data: ProcessedJobItem}
  | {type: 'ad'; data: ProcessedAdItem};

// TODO: Tambahkan tipe untuk detail job jika endpoint dan responsenya berbeda
