export interface EventCategoryApi {
  id: string;
  name: string;
}

export interface EventCategoriesApiResponse {
  status: number;
  message: string;
  data: EventCategoryApi[];
}

export interface EventImageFeature {
  id: string;
  id_events: string;
  s3_slug: string;
  img_title: string | null;
  img_alt: string | null;
  is_feature: string;
  created_date: string;
  created_by: string;
  img_url: string;
}

export interface EventItemApi {
  id: string;
  id_users: string;
  max_capacity: string | null;
  max_capacity_display: string;
  price: string;
  event_title: string;
  event_slug: string;
  event_description: string;
  id_ref_indo_global_event_category: string;
  event_start: string;
  event_end: string;
  location: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  nama_ref_global: string;
  image_feature: EventImageFeature | null;
  image_lists: any[];
  event_description_excerpt: string;
}

export interface EventListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: EventItemApi[];
}

export interface ProcessedEventItem {
  id: string;
  title: string;
  location: string;
  dateFormatted: string; // Tanggal sudah diformat
  imageUrl: string | null;
  categoryName: string; // Nama kategori
  slug: string;
}

export interface EventDetailApiResponse {
  status: number;
  message: string;
  data: EventItemApi; // Objek detail event utama
  recent_event: EventItemApi[]; // Array event terbaru
}

export interface ProcessedEventDetailData {
  mainEvent: ProcessedEventDetail;
  recentEvents: ProcessedEventItem[]; // Gunakan tipe item list yang sudah ada
}

export interface ProcessedEventDetail {
  id: string;
  title: string;
  location: string;
  dateTimeFormatted: string; // Tanggal & Waktu sudah diformat
  description: string;
  imageUrls: string[]; // Semua URL gambar
  categoryName: string;
  slug: string;
}
