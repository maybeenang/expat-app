import {FetchBizItemsParams} from '../types/biz';
import {EventFilterParams} from '../types/event';
import {ForumFilterParams} from '../types/forum';
import {RentalFilterParams} from '../types/rental';

export const queryKeys = {
  all: ['all'] as const,

  // Biz Query Keys
  bizKeys: {
    all: ['biz'] as const,
    categories: () => [...queryKeys.bizKeys.all, 'categories'] as const,
    lists: () => [...queryKeys.bizKeys.all, 'list'] as const,
    list: (filters: FetchBizItemsParams) =>
      [...queryKeys.bizKeys.lists(), {filters}] as const,
  },

  // Event Query Keys
  eventKeys: {
    all: ['event'] as const,
    categories: () => [...queryKeys.eventKeys.all, 'categories'] as const,
    items: (categoryId?: string, filter?: EventFilterParams) =>
      [
        ...queryKeys.eventKeys.all,
        'items',
        categoryId ?? 'all',
        {filter},
      ] as const,
    detail: (eventId: string, categoryId?: string) =>
      [...queryKeys.eventKeys.all, 'detail', eventId, categoryId] as const,
    detailUnprocessed: (eventId: string) =>
      [...queryKeys.eventKeys.all, 'detailUnprocessed', eventId] as const,
  },

  // Blog Query Keys
  blogKeys: {
    all: ['blog'] as const,
    posts: (category?: string) =>
      [...queryKeys.blogKeys.all, 'posts', category ?? 'all'] as const,
    categories: () => [...queryKeys.blogKeys.all, 'categories'] as const,
    detail: (slug: string) =>
      [...queryKeys.blogKeys.all, 'detail', slug] as const,
    search: (query: string) =>
      [...queryKeys.blogKeys.all, 'search', query] as const,
  },

  // Forum Query Keys
  forumKeys: {
    all: ['forum'] as const,
    categories: () => [...queryKeys.forumKeys.all, 'categories'] as const,
    userCategories: () =>
      [...queryKeys.forumKeys.all, 'userCategories'] as const,
    topics: (categoryId?: string, filter?: ForumFilterParams) =>
      [
        ...queryKeys.forumKeys.all,
        'topics',
        categoryId ?? 'all',
        {filter},
      ] as const,
    detail: (forumId: string) =>
      [...queryKeys.forumKeys.all, 'detail', forumId] as const,
  },

  // Jobs Query Keys
  jobKeys: {
    all: ['job'] as const,
    items: (searchTerm?: string, location?: string, categoryId?: string) =>
      [
        ...queryKeys.jobKeys.all,
        'items',
        searchTerm ?? '',
        location ?? '',
        categoryId ?? '',
      ] as const,
    detail: (jobId: string, categoryId?: string) =>
      [...queryKeys.jobKeys.all, 'detail', jobId, categoryId ?? ''] as const,
    detailUnprocessed: (jobId: string, categoryId?: string) =>
      [
        ...queryKeys.jobKeys.all,
        'detailUnprocessed',
        jobId,
        categoryId ?? '',
      ] as const,
    options: {
      paidStatus: () =>
        [...queryKeys.jobKeys.all, 'options', 'paidStatus'] as const,
      company: () => [...queryKeys.jobKeys.all, 'options', 'company'] as const,
    },
  },

  // Rental Query Keys
  rentalKeys: {
    all: ['rental'] as const,
    categories: () => [...queryKeys.rentalKeys.all, 'categories'] as const,
    items: (rentalType?: string, filter?: RentalFilterParams) =>
      [
        ...queryKeys.rentalKeys.all,
        'items',
        rentalType ?? 'all',
        {filter},
      ] as const,
    detail: (rentalId: string) =>
      [...queryKeys.rentalKeys.all, 'detail', rentalId] as const,
    detailUnprocessed: (rentalId: string) =>
      [...queryKeys.rentalKeys.all, 'detailUnprocessed', rentalId] as const,
    options: (type: string) =>
      [...queryKeys.rentalKeys.all, 'options', type] as const,
  },
};
