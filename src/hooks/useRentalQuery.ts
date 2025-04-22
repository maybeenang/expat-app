import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  descExpandable,
  fetchRentalCategoriesApi,
  fetchRentalDetailApi,
  fetchRentalItemsApi,
  formatPrice,
  mapRentalTypeToLabel,
} from '../services/rentalService';
import type {
  RentalCategory,
  RentalListApiResponse,
  ProcessedRentalItem,
  RentalItemApi,
  ProcessedRentalDetail,
} from '../types/rental';

export const rentalCategoriesQueryKey = ['rentalCategories'];
export const RECOMMENDATION_CATEGORY: RentalCategory = {
  value: 'all',
  label: 'Rekomendasi',
};

export const useRentalCategoriesQuery = () => {
  return useQuery<RentalCategory[], Error, RentalCategory[]>({
    queryKey: rentalCategoriesQueryKey,
    queryFn: fetchRentalCategoriesApi,
    staleTime: Infinity,
    select: data => {
      return [RECOMMENDATION_CATEGORY, ...data];
    },
  });
};

export const rentalItemsQueryKey = (rentalType?: string) => [
  'rentalItems',
  rentalType ?? 'all',
];

export const useRentalItemsInfinite = (
  activeCategory: RentalCategory | null,
) => {
  const categoryTypeFilter = activeCategory?.value;

  return useInfiniteQuery<
    RentalListApiResponse,
    Error,
    ProcessedRentalItem[],
    string[],
    number
  >({
    queryKey: rentalItemsQueryKey(categoryTypeFilter),
    queryFn: ({pageParam}) =>
      fetchRentalItemsApi({pageParam}, categoryTypeFilter),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allItems: ProcessedRentalItem[] = [];
      data.pages.forEach(page => {
        page.data.forEach(item => {
          allItems.push({
            id: item.id,
            title: item.rent_title,
            location: item.rent_city,
            priceFormatted: formatPrice(
              item.rent_price_number,
              item.rent_price_type,
            ),
            imageUrl: item.image_feature?.img_url ?? null,
            typeLabel: mapRentalTypeToLabel(item.type),
            slug: item.rent_slug,
          });
        });
      });
      return allItems;
    },
  });
};

export const rentalDetailQueryKey = (rentalId: string) => [
  'rentalDetail',
  rentalId,
];

const PLACEHOLDER_IMAGE_URL =
  'https://via.placeholder.com/400x300/cccccc/969696?text=Image+Not+Available';

export const useRentalDetailQuery = (rentalId: string) => {
  return useQuery<RentalItemApi, Error, ProcessedRentalDetail>({
    queryKey: rentalDetailQueryKey(rentalId),
    queryFn: () => fetchRentalDetailApi(rentalId),
    enabled: !!rentalId,
    staleTime: 1000 * 60 * 5,
    select: data => {
      const imageUrls: string[] = [];

      if (data.image_feature?.img_url) {
        imageUrls.push(data.image_feature.img_url);
      }

      if (Array.isArray(data.image_lists)) {
        data.image_lists.forEach((imgListItem: any) => {
          if (imgListItem?.img_url && typeof imgListItem.img_url === 'string') {
            if (!imageUrls.includes(imgListItem.img_url)) {
              imageUrls.push(imgListItem.img_url);
            }
          }
        });
      }

      if (imageUrls.length === 0) {
        imageUrls.push(PLACEHOLDER_IMAGE_URL);
      }

      return {
        id: data.id,
        title: data.rent_title,
        location: data.rent_city, // Atau gabungkan address
        priceFormatted: formatPrice(
          data.rent_price_number,
          data.rent_price_type,
        ),
        description: data.rent_descriptions,
        imageUrls: imageUrls,
        typeLabel: mapRentalTypeToLabel(data.type),
        contactNumber: '6281234567890', // <<< GANTI NOMOR CS
        descExpandable: descExpandable(data.rent_descriptions),
      };
    },
  });
};
