import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  fetchBlogCategoriesApi,
  fetchBlogPostDetailApi,
  fetchBlogPostsApi,
  formatDate,
  searchBlogPostsApi,
} from '../services/blogService';
import type {
  BlogCategory,
  BlogListApiResponse,
  BlogPost,
  ProcessedBlogDetail,
  ProcessedBlogDetailData,
  ProcessedBlogPost,
} from '../types/blog';
import {useMemo} from 'react';
import {queryKeys} from '../services/queryKeys';

// Query key untuk blog posts
export const blogPostsQueryKey = (categoryNames?: string[]) => [
  'blogPosts',
  categoryNames?.join(',') ?? 'all',
];

export const useBlogPostsInfinite = (categoryNames?: string[]) => {
  return useInfiniteQuery<
    BlogListApiResponse,
    Error,
    ProcessedBlogPost[],
    readonly ['blog', 'posts', string],
    number
  >({
    queryKey: queryKeys.blogKeys.posts(categoryNames),
    queryFn: ({pageParam}) =>
      fetchBlogPostsApi({pageParam}, categoryNames),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allPosts: ProcessedBlogPost[] = [];
      data.pages.forEach(page => {
        page.data.forEach(post => {
          allPosts.push({
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
          });
        });
      });
      return allPosts;
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
    queryKey: queryKeys.blogKeys.categories(),
    queryFn: fetchBlogCategoriesApi,
    staleTime: Infinity,
    select: data => {
      // delete \n and \r form data
      data = data.map(item => ({
        ...item,
        name: item.name.replace(/[\n\r]/g, ''),
      }));
      return [ALL_CATEGORY_PLACEHOLDER, ...data];
    },
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
    queryKey: queryKeys.blogKeys.detail(slug),
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
  return useQuery<BlogPost[], Error, ProcessedBlogPost[]>({
    queryKey: queryKeys.blogKeys.search(query),
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
