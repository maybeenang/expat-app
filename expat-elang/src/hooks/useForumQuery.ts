import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchForumCategoriesApi,
  fetchForumTopicsApi,
  fetchForumDetailApi,
  formatForumDate,
  adminCreateForumApi,
} from '../services/forumService';
import type {
  ForumCategoryApi,
  ForumListApiResponse,
  ProcessedForumTopic,
  ForumDetailApiResponse,
  ProcessedForumDetailData,
  ProcessedForumDetail,
  ProcessedForumReply,
  CreateForumPayload,
} from '../types/forum';
import {AxiosError} from 'axios';

export const forumCategoriesQueryKey = ['forumCategories'];
export const ALL_FORUM_CATEGORY_PLACEHOLDER: ForumCategoryApi = {
  id: 'all',
  name: 'Semua Topik',
  total_post: '0',
};

export const useForumCategoriesQuery = () => {
  return useQuery<ForumCategoryApi[], Error, ForumCategoryApi[]>({
    queryKey: forumCategoriesQueryKey,
    queryFn: fetchForumCategoriesApi,
    staleTime: Infinity,
    select: data => [ALL_FORUM_CATEGORY_PLACEHOLDER, ...data],
  });
};

export const forumTopicsQueryKey = (categoryId?: string) => [
  'forumTopics',
  categoryId ?? ALL_FORUM_CATEGORY_PLACEHOLDER.name,
];

export const useForumTopicsInfinite = (
  activeCategory: ForumCategoryApi | null,
) => {
  const categoryIdFilter = activeCategory?.name;

  return useInfiniteQuery<
    ForumListApiResponse,
    Error,
    ProcessedForumTopic[],
    string[],
    number
  >({
    queryKey: forumTopicsQueryKey(categoryIdFilter),
    queryFn: ({pageParam}) =>
      fetchForumTopicsApi({pageParam}, categoryIdFilter),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allTopics: ProcessedForumTopic[] = [];
      data.pages.forEach(page => {
        page.data.forEach(topic => {
          const replyCount = parseInt(topic.total_reply || '0', 10);
          allTopics.push({
            id: topic.id,
            title: topic.forum_title,
            author: topic.created_by,
            dateFormatted: formatForumDate(topic.created_date),
            categories: topic.categories
              .split(',')
              .map(cat => cat.trim())
              .filter(cat => cat),
            firstCategory: topic.nama_ref_global,
            imageUrl: topic.image_feature?.img_url ?? null,
            slug: topic.forum_slug,
            replyCount: isNaN(replyCount) ? 0 : replyCount,
            //excerpt: topic.forum_content_excerpt // Perlu decode/strip HTML
          });
        });
      });
      return allTopics;
    },
  });
};

// --- Detail Forum Hook ---
export const forumDetailQueryKey = (forumId: string) => [
  'forumDetail',
  forumId,
];

export const useForumDetailQuery = (forumId: string) => {
  return useQuery<ForumDetailApiResponse, Error, ProcessedForumDetailData>({
    queryKey: forumDetailQueryKey(forumId),
    queryFn: () => fetchForumDetailApi(forumId),
    enabled: !!forumId,
    staleTime: 1000 * 60 * 3, // Cache 3 menit
    select: data => {
      const topic = data.data;
      const ads = data.data_ads ?? [];

      const mainTopicImages: string[] = [];
      if (topic.image_feature?.img_url) {
        mainTopicImages.push(topic.image_feature.img_url);
      }

      topic.image_lists?.forEach((img: any) => {
        if (img?.img_url && !mainTopicImages.includes(img.img_url)) {
          mainTopicImages.push(img.img_url);
        }
      });

      // if (mainTopicImages.length === 0) mainTopicImages.push('URL_PLACEHOLDER');

      const mainTopicProcessed: ProcessedForumDetail = {
        id: topic.id,
        title: topic.forum_title,
        author: topic.created_by,
        dateFormatted: formatForumDate(topic.created_date),
        categories: topic.categories
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat),
        firstCategory: topic.nama_ref_global,
        imageUrl: null, // imageURL tidak relevan di detail utama, pakai imageUrls
        slug: topic.forum_slug,
        contentHTML: topic.forum_content,
        imageUrls: mainTopicImages,
      };

      const repliesProcessed: ProcessedForumReply[] = (
        topic.detail_reply ?? []
      ).map(reply => {
        const replyImages = (reply.image_lists ?? [])
          .map(img => img.img_url)
          .filter(url => url);
        return {
          id: reply.id,
          author: reply.created_by,
          dateFormatted: formatForumDate(reply.created_date),
          content: reply.reply_content,
          images: replyImages,
        };
      });

      return {
        mainTopic: mainTopicProcessed,
        replies: repliesProcessed,
        ads: ads,
      };
    },
  });
};

export const useCreateForumMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateForumPayload) => adminCreateForumApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: forumTopicsQueryKey()});
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.error('Error creating forum:', error.response);
      }

      console.error('Error creating forum:', error.message);
    },
  });
};
