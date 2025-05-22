import {
  QueryKey,
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
import {queryKeys} from '../services/queryKeys';

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
    queryKey: queryKeys.forumKeys.categories(),
    queryFn: fetchForumCategoriesApi,
    staleTime: Infinity,
    select: data => {
      const deletedEndLineData = data.map(item => ({
        ...item,
        name: item.name.replace(/\n/g, ''),
      }));

      if (isLoggedIn) {
        return [
          MY_FORUM_CATEGORY_PLACEHOLDER,
          ALL_FORUM_CATEGORY_PLACEHOLDER,
          ...deletedEndLineData,
        ];
      }
      return [ALL_FORUM_CATEGORY_PLACEHOLDER, ...deletedEndLineData];
    },
  });
};

export const useForumTopicsInfinite = (
  activeCategory: ForumCategoryApi | null,
) => {
  const categoryIdFilter = activeCategory?.name;

  return useInfiniteQuery<
    ForumListApiResponse,
    Error,
    ProcessedForumTopic[],
    QueryKey,
    number
  >({
    queryKey: queryKeys.forumKeys.topics(categoryIdFilter),
    queryFn: ({pageParam}) =>
      fetchForumTopicsApi({pageParam}, categoryIdFilter),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    queryKey: queryKeys.forumKeys.detail(forumId),
    queryFn: () => fetchForumDetailApi(forumId),
    enabled: !!forumId,
    staleTime: 1000 * 60 * 5,
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
        imageUrl: null,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.forumKeys.all,
      });
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
    onSuccess: async (_, variables) => {
      console.log('Update forum success:', variables);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.forumKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.forumKeys.detail(variables.id),
        }),
      ]);
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.forumKeys.all,
      });

      if (categoryIdFilter) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.forumKeys.topics(categoryIdFilter),
        });
      }
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.error('Error deleting forum:', error.response?.data);
      }
      console.error('Error deleting forum:', error);
      throw error;
    },
  });
};
