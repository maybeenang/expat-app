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
  data: GalleryImageApi[];
}

// Tipe yang diproses untuk UI
export interface GalleryItemData {
  id: string;
  imageUrl: string;
  link: string;
}
