export interface GalleryImageApi {
  id: string;
  xorder: string;
  s3_slug: string;
  hyperlink: string;
  created_date: string;
  created_by: string;
  img_url: string;
}

export interface GalleryListApiResponse {
  status: number;
  message: string;
  page: number; // Halaman saat ini
  limit: number; // Limit per halaman
  total_pages: number; // Total halaman tersedia
  total_data: number; // Total item
  data: GalleryImageApi[]; // Data untuk halaman ini
}

// Tipe yang diproses untuk UI (tetap sama)
export interface GalleryItemData {
  id: string;
  imageUrl: string;
  link: string;
}
