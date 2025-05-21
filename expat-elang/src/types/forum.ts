export interface ForumCategoryApi {
  id: string;
  name: string;
  total_post?: string; // String number
}

export interface ForumCategoriesApiResponse {
  status: number;
  message: string;
  data: ForumCategoryApi[];
}

export interface ForumImageFeature {
  id: string;
  id_forum?: string; // Opsional karena ada juga di reply
  id_forum_reply?: string; // Opsional
  s3_slug: string;
  img_title: string | null;
  img_alt: string | null;
  is_feature?: string; // Opsional di reply
  created_date: string;
  created_by: string;
  img_url: string;
}

export interface ForumReply {
  id: string;
  id_users: string;
  id_forum: string;
  reply_content: string;
  alias_random: string | null;
  created_by: string;
  created_date: string;
  del_date: string | null;
  del_by: string | null;
  image_lists: ForumImageFeature[]; // Menggunakan tipe yang sama
}

export interface ForumTopicApi {
  id: string;
  id_users: string;
  forum_title: string;
  forum_content: string; // HTML content
  forum_slug: string;
  created_date: string;
  created_by: string;
  del_date: string | null;
  del_by: string | null;
  categories: string | null; // Comma-separated string
  nama_ref_global: string; // Nama kategori utama?
  image_feature: ForumImageFeature | null;
  image_lists: any[]; // Tipe spesifik jika diketahui
  total_reply: string; // String number
  detail_reply?: ForumReply[]; // Opsional di list, ada di detail
}

export interface ForumListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: ForumTopicApi[];
}

// Tipe untuk Ad (dari detail response)
export interface ForumAd {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumDetailApiResponse {
  status: number;
  message: string;
  data: ForumTopicApi; // Detail utama
  data_ads?: ForumAd[]; // Ads opsional
  // recent_event tidak ada, tapi bisa jadi ada recent_forum? Asumsi tidak ada
}

// --- Tipe yang diproses untuk UI ---
export interface ProcessedForumTopic {
  id: string;
  title: string;
  author: string;
  dateFormatted: string;
  categories: string[]; // Array nama kategori
  firstCategory: string; // Kategori utama/pertama
  imageUrl: string | null;
  slug: string;
  replyCount: number;
  // Konten excerpt mungkin perlu di-decode/strip HTML jika ingin ditampilkan di list
  excerpt?: string;
  content: string; // Konten HTML asli
}

// Tipe untuk detail UI
export interface ProcessedForumReply {
  id: string;
  author: string;
  dateFormatted: string;
  content: string; // Konten reply
  images: string[]; // Array URL gambar reply
}

export interface ProcessedForumDetailData {
  mainTopic: ProcessedForumDetail;
  replies: ProcessedForumReply[];
  ads: ForumAd[];
}

export interface ProcessedForumDetail
  extends Omit<ProcessedForumTopic, 'excerpt' | 'replyCount'> {
  contentHTML: string; // Konten HTML asli
  imageUrls: string[]; // Semua gambar topic (feature + lists)
}

export interface CreateForumPayload {
  forum_title: string;
  forum_content: string;
  images: {
    uri: string;
    type: string;
    name: string;
  }[];
  category: string[];
  key?: string[];
}

export interface UpdateForumPayload extends CreateForumPayload {
  id: string;
}
