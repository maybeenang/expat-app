export interface ImageFeature {
  id: string;
  id_blog: string;
  s3_slug: string;
  img_title: string;
  img_alt: string;
  is_feature: string; // '0' or '1'
  created_date: string;
  created_by: string;
  img_url: string;
}

export interface BlogPost {
  id: string;
  id_company: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string; // HTML content
  created_date: string; // Format "YYYY-MM-DD HH:mm:ss"
  created_by: string;
  del_date: string | null;
  del_by: string | null;
  categories: string; // Comma-separated string, e.g., "Gaya Hidup, Global"
  image_feature: ImageFeature | null; // Bisa null jika tidak ada gambar
  image_lists: any[]; // Tipe spesifik jika perlu
  blog_content_excerpt: string;
}

export interface BlogListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: BlogPost[];
}

// Tipe yang lebih bersih untuk digunakan di UI
export interface ProcessedBlogPost {
  id: string;
  title: string;
  author: string;
  date: string; // Sudah diformat
  categories: string[]; // Sudah dipisah
  imageUrl: string | null; // URL gambar atau null
  // Tambahkan field lain jika perlu untuk navigasi (slug, content)
  slug: string;
}

export interface BlogDetailApiResponse {
  status: number;
  message: string;
  data: BlogPost;
  recent_post: BlogPost[];
}

export interface ProcessedBlogDetailData {
  mainPost: ProcessedBlogDetail;
  recentPosts: ProcessedBlogPost[];
}

export interface ProcessedBlogDetail extends ProcessedBlogPost {
  content: string;
}

export interface BlogSearchApiResponse {
  status: number;
  message: string;
  data: BlogPost[];
}

export interface BlogCategory {
  id: string;
  name: string;
}

export interface BlogCategoriesApiResponse {
  status: number;
  message: string;
  data: BlogCategory[];
}
