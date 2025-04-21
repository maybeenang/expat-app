import {useQuery} from '@tanstack/react-query';
import {
  fetchBlogCategoriesApi,
  fetchBlogPostDetailApi,
  fetchBlogPostsApi,
  formatDate,
  searchBlogPostsApi,
} from '../services/blogService';
import type {
  BlogCategory,
  BlogPost,
  ProcessedBlogDetail,
  ProcessedBlogDetailData,
  ProcessedBlogPost,
} from '../types/blog';

// Query key untuk blog posts
export const blogPostsQueryKey = ['blogPosts'];

export const useBlogPosts = () => {
  return useQuery<BlogPost[], Error, ProcessedBlogPost[]>({
    queryKey: blogPostsQueryKey,
    queryFn: fetchBlogPostsApi,
    staleTime: 1000 * 60 * 5,
    select: data => {
      return data.map(post => ({
        id: post.id,
        title: post.blog_title,
        author: post.created_by,
        date: formatDate(post.created_date), // Format tanggal
        categories: post.categories
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat), // Pisahkan kategori
        imageUrl: post.image_feature?.img_url ?? null, // Ambil URL gambar
        slug: post.blog_slug,
      }));
    },
  });
};

export const blogCategoriesQueryKey = ['blogCategories'];

// --- Hook untuk Fetch Kategori ---
export const useBlogCategoriesQuery = () => {
  const ALL_CATEGORY_PLACEHOLDER: BlogCategory = {
    id: 'all',
    name: 'Semua Kategori',
  };

  return useQuery<BlogCategory[], Error, BlogCategory[]>({
    queryKey: blogCategoriesQueryKey,
    queryFn: fetchBlogCategoriesApi,
    staleTime: Infinity,
    select: data => {
      return [ALL_CATEGORY_PLACEHOLDER, ...data];
    },
    placeholderData: [ALL_CATEGORY_PLACEHOLDER],
  });
};

export const blogPostDetailQueryKey = (slug: string) => [
  'blogPostDetail',
  slug,
];

// Hook sekarang mengembalikan ProcessedBlogDetailData
export const useBlogPostDetail = (slug: string) => {
  return useQuery<
    {mainPost: BlogPost; recentPosts: BlogPost[]},
    Error,
    ProcessedBlogDetailData
  >({
    queryKey: blogPostDetailQueryKey(slug),
    queryFn: () => fetchBlogPostDetailApi(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
    select: data => {
      const mainPostProcessed: ProcessedBlogDetail = {
        id: data.mainPost.id,
        title: data.mainPost.blog_title,
        author: data.mainPost.created_by,
        date: formatDate(data.mainPost.created_date),
        categories: data.mainPost.categories
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat),
        imageUrl: data.mainPost.image_feature?.img_url ?? null,
        slug: data.mainPost.blog_slug,
        content: data.mainPost.blog_content,
      };

      const recentPostsProcessed: ProcessedBlogPost[] = data.recentPosts.map(
        post => ({
          id: post.id,
          title: post.blog_title,
          author: post.created_by,
          date: formatDate(post.created_date),
          categories: post.categories
            .split(',')
            .map(cat => cat.trim())
            .filter(cat => cat),
          imageUrl: post.image_feature?.img_url ?? null,
          slug: post.blog_slug,
        }),
      );

      return {
        mainPost: mainPostProcessed,
        recentPosts: recentPostsProcessed,
      };
    },
  });
};

export const useBlogSearch = (query: string) => {
  const queryKey = ['blogSearch', query];

  return useQuery<BlogPost[], Error, ProcessedBlogPost[]>({
    queryKey: queryKey,
    queryFn: () => searchBlogPostsApi(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 1,
    select: data => {
      return data.map(post => ({
        id: post.id,
        title: post.blog_title,
        author: post.created_by,
        date: formatDate(post.created_date),
        categories: post.categories
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat),
        imageUrl: post.image_feature?.img_url ?? null,
        slug: post.blog_slug,
      }));
    },
    placeholderData: previousData => previousData,
  });
};
