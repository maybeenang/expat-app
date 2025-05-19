export interface BizCategoryApi {
  category_id: string;
  category_name: string;
}

// Tipe respons API untuk daftar kategori bisnis
export interface BizCategoryApiResponse {
  status: number;
  message: string;
  data: BizCategoryApi[];
}

// Tipe untuk gambar fitur atau item dalam image_lists
export interface BizImageApi {
  id?: string; // ID bisa opsional jika image_feature tidak selalu punya (meski di contoh ada)
  id_biz_location?: string; // Jika dari image_lists atau image_feature yang terkait lokasi
  s3_slug: string;
  img_title?: string;
  img_alt?: string;
  is_feature?: string; // '0' atau '1'
  created_date?: string;
  created_by?: string;
  img_url: string; // URL gambar yang utama
}

// Tipe untuk satu item bisnis dari API daftar bisnis
export interface BizItemApi {
  id: string; // ID lokasi bisnis
  id_category: string;
  id_biz: string; // ID bisnis utama (parent)
  biz_location_slug: string;
  street: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_main: string | null; // '1' or null
  id_users: string;
  biz_name: string;
  biz_desc: string; // HTML content
  biz_slug: string;
  biz_about: string | null;
  seo_title: string | null;
  seo_desc: string | null;
  seo_keywords: string | null;
  image_feature: BizImageApi | null; // Bisa null jika tidak ada s3_slug/img_url
  image_lists: BizImageApi[]; // Array gambar
  rating_location: number;
  biz_desc_excerpt: string;
}

// Tipe respons API untuk daftar item bisnis
export interface BizListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: BizItemApi[];
}

// Tipe yang diproses untuk ditampilkan di UI (opsional, tapi best practice)
export interface ProcessedBizItem {
  id: string; // ID lokasi bisnis
  name: string;
  descriptionExcerpt: string;
  city: string;
  state: string;
  imageUrl: string; // URL gambar fitur
  // Tambahkan field lain yang dibutuhkan UI
  rating: number;
  categoryName?: string; // Jika ingin menampilkan nama kategori
  slug: string; // biz_location_slug
}

export interface FetchBizItemsParams {
  pageParam?: number;
  limit?: number;
  search?: string;
  location?: string; // Mungkin city atau state_province
  id_category?: string; // ID kategori untuk filter
}
