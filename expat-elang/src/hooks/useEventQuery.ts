// src/hooks/useEventQuery.ts (Buat file baru)
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  adminCreateEventApi,
  adminDeleteEventApi,
  adminUpdateEventApi,
  fetchEventCategoriesApi,
  fetchEventDetailApi,
  fetchEventItemsApi,
  fetchPriceOptionsApi,
  formatEventDate,
  formatEventDateTime,
  getImageEventThumbnail,
} from '../services/eventService';
import type {
  CreateEventPayload,
  EventCategoryApi,
  EventFilterParams,
  EventItemApi,
  EventListApiResponse,
  EventPriceOption,
  ProcessedEventDetail,
  ProcessedEventDetailData,
  ProcessedEventItem,
  UpdateEventPayload,
} from '../types/event';
import axios from 'axios';
import {useAuthStore} from '../store/useAuthStore';
import {queryKeys} from '../services/queryKeys';

export const eventCategoriesQueryKey = ['eventCategories'];
export const ALL_EVENT_CATEGORY_PLACEHOLDER: EventCategoryApi = {
  id: 'all',
  name: 'Semua Kategori',
};

export const MY_EVENT_CATEGORY: EventCategoryApi = {
  id: 'MY_EVENT_CATEGORY',
  name: 'Event Saya',
};

export const useEventCategoriesQuery = () => {
  const {isLoggedIn} = useAuthStore();

  return useQuery<EventCategoryApi[], Error, EventCategoryApi[]>({
    queryKey: queryKeys.eventKeys.categories(),
    queryFn: fetchEventCategoriesApi,
    staleTime: Infinity,
    select: data => {
      const deletedEndLineData = data.map(item => ({
        ...item,
        name: item.name.replace(/\n/g, ''),
      }));

      if (isLoggedIn) {
        return [
          MY_EVENT_CATEGORY,
          ALL_EVENT_CATEGORY_PLACEHOLDER,
          ...deletedEndLineData,
        ];
      }
      return [ALL_EVENT_CATEGORY_PLACEHOLDER, ...deletedEndLineData];
    },
  });
};

export const useEventItemsInfinite = (filter: EventFilterParams) => {
  return useInfiniteQuery<
    EventListApiResponse,
    Error,
    ProcessedEventItem[],
    QueryKey,
    number
  >({
    queryKey: queryKeys.eventKeys.items(filter.categories, filter),
    queryFn: ({pageParam}) => fetchEventItemsApi({pageParam}, filter),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allItems: ProcessedEventItem[] = [];
      data.pages.forEach(page => {
        page.data.forEach(item => {
          allItems.push({
            id: item.id,
            title: item.event_title,
            location: item.location,
            dateFormatted: formatEventDate(item.event_start),
            imageUrl: getImageEventThumbnail(item),
            categoryName: item.nama_ref_global,
            slug: item.event_slug,
          });
        });
      });
      return allItems;
    },
  });
};

export const useEventDetailQuery = (eventId: string, categoryId?: string) => {
  return useQuery<
    {mainEvent: EventItemApi; recentEvents: EventItemApi[]},
    Error,
    ProcessedEventDetailData
  >({
    queryKey: queryKeys.eventKeys.detail(eventId, categoryId),
    queryFn: () => fetchEventDetailApi(eventId, categoryId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
    select: data => {
      // Proses mainEvent
      const mainEventImages: string[] = [];
      if (data.mainEvent.image_feature?.img_url) {
        mainEventImages.push(data.mainEvent.image_feature.img_url);
      }
      // Asumsi image_lists ada di data.mainEvent
      if (Array.isArray(data.mainEvent.image_lists)) {
        data.mainEvent.image_lists.forEach((img: any) => {
          if (img?.img_url && !mainEventImages.includes(img.img_url)) {
            mainEventImages.push(img.img_url);
          }
        });
      }

      if (Array.isArray(data.mainEvent.images)) {
        data.mainEvent.images.forEach((img: any) => {
          if (img?.img_url && !mainEventImages.includes(img.img_url)) {
            mainEventImages.push(img.img_url);
          }
        });
      }

      if (mainEventImages.length === 0) {
        mainEventImages.push('URL_PLACEHOLDER');
      }

      const mainEventProcessed: ProcessedEventDetail = {
        id: data.mainEvent.id,
        title: data.mainEvent.event_title,
        location: data.mainEvent.location,
        dateTimeFormatted: formatEventDateTime(
          data.mainEvent.event_start,
          data.mainEvent.event_end,
        ),
        description: data.mainEvent.event_description,
        imageUrls: mainEventImages,
        categoryName: data.mainEvent.nama_ref_global,
        slug: data.mainEvent.event_slug,
      };

      const recentEventsProcessed: ProcessedEventItem[] = data.recentEvents.map(
        item => ({
          id: item.id,
          title: item.event_title,
          location: item.location,
          dateFormatted: formatEventDate(item.event_start),
          imageUrl: item.image_feature?.img_url ?? null,
          categoryName: item.nama_ref_global,
          slug: item.event_slug,
        }),
      );

      return {
        mainEvent: mainEventProcessed,
        recentEvents: recentEventsProcessed,
      };
    },
  });
};

export const useEventDetailUnprocessedQuery = (eventId: string) => {
  return useQuery<
    {mainEvent: EventItemApi; recentEvents: EventItemApi[]},
    Error
  >({
    queryKey: queryKeys.eventKeys.detailUnprocessed(eventId),
    queryFn: () => fetchEventDetailApi(eventId, MY_EVENT_CATEGORY.name),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventPriceOptions = () => {
  return useQuery<EventPriceOption[], Error>({
    queryKey: ['eventPriceOptions'],
    queryFn: fetchPriceOptionsApi,
    staleTime: Infinity,
  });
};

export const useEventAllOptions = () => {
  const priceOptions = useEventPriceOptions();
  const categoryOptions = useEventCategoriesQuery();

  // hapus placeholder dari categoryOptions
  const filteredCategoryOptions = categoryOptions.data?.filter(
    item =>
      item.id !== ALL_EVENT_CATEGORY_PLACEHOLDER.id &&
      item.id !== MY_EVENT_CATEGORY.id,
  );

  return {
    priceOptions: priceOptions.data,
    categoryOptions: filteredCategoryOptions,
    isLoading: priceOptions.isLoading || categoryOptions.isLoading,
    isError: priceOptions.isError || categoryOptions.isError,
    error: priceOptions.error || categoryOptions.error,
  };
};

export const useEventCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => adminCreateEventApi(payload),
    onSuccess: async () => {
      // Invalidate all event queries to ensure UI is up-to-date
      //
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.eventKeys.items(MY_EVENT_CATEGORY.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.eventKeys.all,
        }),
      ]);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }

      console.error('Error message:', error.message);
    },
  });
};

export const useEventDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => adminDeleteEventApi(eventId),
    onSuccess: async () => {
      // Invalidate all event queries to ensure UI is up-to-date
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.eventKeys.items(MY_EVENT_CATEGORY.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.eventKeys.all,
        }),
      ]);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }

      console.error('Error message:', error.message);
    },
  });
};

export const useEventUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) => adminUpdateEventApi(payload),
    onSuccess: async (_, variables) => {
      // Invalidate all event queries
      await queryClient.invalidateQueries({
        queryKey: queryKeys.eventKeys.all,
      });

      // Also specifically invalidate the detail query for this event
      if (variables.id) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.eventKeys.detail(variables.id),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.eventKeys.detailUnprocessed(variables.id),
          }),
        ]);
      }
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }

      console.error('Error message:', error.message);
    },
  });
};
