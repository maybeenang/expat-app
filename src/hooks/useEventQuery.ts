// src/hooks/useEventQuery.ts (Buat file baru)
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  fetchEventCategoriesApi,
  fetchEventDetailApi,
  fetchEventItemsApi,
  formatEventDate,
  formatEventDateTime,
} from '../services/eventService';
import type {
  EventCategoryApi,
  EventItemApi,
  EventListApiResponse,
  ProcessedEventDetail,
  ProcessedEventDetailData,
  ProcessedEventItem,
} from '../types/event';

export const eventCategoriesQueryKey = ['eventCategories'];
export const ALL_EVENT_CATEGORY_PLACEHOLDER: EventCategoryApi = {
  id: 'all',
  name: 'Semua Kategori',
};

export const useEventCategoriesQuery = () => {
  return useQuery<EventCategoryApi[], Error, EventCategoryApi[]>({
    queryKey: eventCategoriesQueryKey,
    queryFn: fetchEventCategoriesApi,
    staleTime: Infinity,
    select: data => {
      return [ALL_EVENT_CATEGORY_PLACEHOLDER, ...data];
    },
  });
};

export const eventItemsQueryKey = (categoryId?: string) => [
  'eventItems',
  categoryId ?? 'all',
];

export const useEventItemsInfinite = (
  activeCategory: EventCategoryApi | null,
) => {
  const categoryIdFilter = activeCategory?.name;

  return useInfiniteQuery<
    EventListApiResponse,
    Error,
    ProcessedEventItem[],
    string[],
    number
  >({
    queryKey: eventItemsQueryKey(categoryIdFilter),
    queryFn: ({pageParam}) => fetchEventItemsApi({pageParam}, categoryIdFilter),
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
            imageUrl: item.image_feature?.img_url ?? null,
            categoryName: item.nama_ref_global,
            slug: item.event_slug,
          });
        });
      });
      return allItems;
    },
  });
};

export const eventDetailQueryKey = (eventId: string) => [
  'eventDetail',
  eventId,
];

export const useEventDetailQuery = (eventId: string) => {
  return useQuery<
    {mainEvent: EventItemApi; recentEvents: EventItemApi[]},
    Error,
    ProcessedEventDetailData
  >({
    queryKey: eventDetailQueryKey(eventId),
    queryFn: () => fetchEventDetailApi(eventId),
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

      if (mainEventImages.length === 0) {
        mainEventImages.push('URL_PLACEHOLDER');
      }

      const mainEventProcessed: ProcessedEventDetail = {
        id: data.mainEvent.id,
        title: data.mainEvent.event_title,
        location: data.mainEvent.location,
        // Gunakan fungsi format baru
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
