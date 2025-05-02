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
  adminUpdateForumApi,
  adminDeleteForumApi,
  formatContentHtml,
  getReplyCount,
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
  UpdateForumPayload,
} from '../types/forum';
import {AxiosError} from 'axios';
import {useAuthStore} from '../store/useAuthStore';

export const forumCategoriesQueryKey = ['forumCategories'];
export const userForumCategoriesQueryKey = ['userForumCategories'];
export const ALL_FORUM_CATEGORY_PLACEHOLDER: ForumCategoryApi = {
  id: 'all',
  name: 'Semua Topik',
  total_post: '0',
};

export const MY_FORUM_CATEGORY_PLACEHOLDER: ForumCategoryApi = {
  id: 'my',
  name: 'Forum Saya',
  total_post: '0',
};

export const useForumCategoriesQuery = () => {
  const {isLoggedIn} = useAuthStore();

  return useQuery<ForumCategoryApi[], Error, ForumCategoryApi[]>({
    queryKey: forumCategoriesQueryKey,
    queryFn: fetchForumCategoriesApi,
    staleTime: Infinity,
    select: data => {
      if (isLoggedIn) {
        return [MY_FORUM_CATEGORY_PLACEHOLDER, ...data];
      }
      return data;
    },
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
    staleTime: 1000 * 60 * 5, // Cache 3 menit
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allTopics: ProcessedForumTopic[] = [];
      data.pages.forEach(page => {
        page.data.forEach(topic => {
          const replyCount = getReplyCount(topic.detail_reply);
          allTopics.push({
            id: topic.id,
            title: topic.forum_title,
            author: topic.created_by,
            dateFormatted: formatForumDate(topic.created_date),
            categories: topic.categories
              ? topic.categories
                  .split(',')
                  .map(cat => cat.trim())
                  .filter(cat => cat)
              : [],
            firstCategory: topic.nama_ref_global,
            imageUrl: topic.image_feature?.img_url ?? null,
            slug: topic.forum_slug,
            replyCount: isNaN(replyCount) ? 0 : replyCount,
            //excerpt: topic.forum_content_excerpt // Perlu decode/strip HTML
            content: formatContentHtml(topic.forum_content),
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
          ? topic.categories
              .split(',')
              .map(cat => cat.trim())
              .filter(cat => cat)
          : [],
        firstCategory: topic.nama_ref_global,
        imageUrl: null, // imageURL tidak relevan di detail utama, pakai imageUrls
        slug: topic.forum_slug,
        contentHTML: topic.forum_content,
        imageUrls: mainTopicImages,
        content: formatContentHtml(topic.forum_content),
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
      queryClient.invalidateQueries({queryKey: ['forumDetail']});
      queryClient.invalidateQueries({queryKey: ['forumTopics']});
      queryClient.invalidateQueries({queryKey: ['adminForumDetail']});
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.error('Error creating forum:', error.response?.data);
      }

      console.error('Error creating forum:', error.message);
    },
  });
};

export const useUpdateForumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateForumPayload) => adminUpdateForumApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['forumDetail']});
      queryClient.invalidateQueries({queryKey: ['forumTopics']});
      queryClient.invalidateQueries({queryKey: ['adminForumDetail']});
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.error('hooks axios:', error.response?.data);
      }
      console.error('error update forum:', error);
    },
  });
};

export const useDeleteForumMutation = (
  categoryIdFilter: string | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (forumId: string) => adminDeleteForumApi(forumId),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<{
        pages: ForumListApiResponse[];
        pageParams: number[];
      }>(forumTopicsQueryKey(categoryIdFilter), oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(topic => topic.id !== deletedId),
          })),
        };
      });
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.error('Error deleting forum:', error.response?.data);
      }
      console.error('Error deleting forum:', error);
    },
  });
};
