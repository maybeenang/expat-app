import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseInfiniteQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import * as bizService from '../services/bizService'; // Sesuaikan path
import {
  BizCategoryApi,
  BizListApiResponse,
  BizItemApi,
  ProcessedBizItem,
  FetchBizItemsParams, // Tipe yang diproses untuk UI
} from '../types/biz'; // Sesuaikan path

import {IMAGE_PLACEHOLDER} from '../constants/images';
import {
  BIZ_LAWYER_CATEGORY_NAME,
  BIZ_RESTAURANT_CATEGORY_NAME,
} from '../constants/api';
import {queryKeys} from '../services/queryKeys';
import {useAuthStore} from '../store/useAuthStore';

// --- Hook untuk Kategori Bisnis ---
export const useBizCategoriesQuery = (): UseQueryResult<
  BizCategoryApi[],
  Error
> => {
  const {isLoggedIn} = useAuthStore();

  return useQuery({
    queryKey: queryKeys.bizKeys.categories(),
    queryFn: bizService.fetchBizCategoriesApi,
    staleTime: 1000 * 60 * 60, // Cache kategori selama 1 jam
    enabled: isLoggedIn, // Hanya jalankan query jika user sudah login
    select: data => {
      // Tambahkan opsi "Semua Kategori" di awal jika perlu
      // return [{ category_id: 'all', category_name: 'Semua Kategori' }, ...data];
      return data; // Atau kembalikan data asli
    },
  });
};

// --- Hook untuk Daftar Item Bisnis (Infinite Scroll) ---
export const useBizItemsInfinite = (
  filters: FetchBizItemsParams,
): UseInfiniteQueryResult<ProcessedBizItem[], Error> => {
  const {isLoggedIn} = useAuthStore();

  return useInfiniteQuery<
    BizListApiResponse, // Tipe data dari API
    Error, // Tipe error
    ProcessedBizItem[], // Tipe data yang di-select untuk UI
    QueryKey, // Tipe queryKey
    number // Tipe pageParam
  >({
    queryKey: queryKeys.bizKeys.list(filters), // Query key dinamis berdasarkan filter
    queryFn: ({pageParam}) =>
      bizService.fetchBizItemsApi({...filters, pageParam}),
    initialPageParam: 1, // Halaman awal
    enabled: isLoggedIn, // Hanya jalankan query jika user sudah login
    getNextPageParam: lastPage => {
      // Jika halaman saat ini < total halaman, kembalikan halaman berikutnya
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      // Gabungkan semua item dari semua halaman dan proses ke ProcessedBizItem
      const allItems: ProcessedBizItem[] = [];
      data.pages.forEach(page => {
        page.data.forEach((item: BizItemApi) => {
          allItems.push({
            id: item.id,
            name: item.biz_name,
            descriptionExcerpt:
              item.biz_desc_excerpt ||
              item.biz_about ||
              'Deskripsi tidak tersedia.',
            city: item.city,
            state: item.state_province,
            imageUrl: item.image_feature?.img_url || IMAGE_PLACEHOLDER, // Gunakan placeholder jika tidak ada
            rating: item.rating_location,
            slug: item.biz_location_slug,
            // Anda bisa menambahkan categoryName di sini jika ada data kategori
            // categoryName: categoriesData?.find(cat => cat.category_id === item.id_category)?.category_name || 'N/A',
          });
        });
      });
      return allItems;
    },
    staleTime: 1000 * 60 * 5, // Cache data list selama 5 menit
  });
};

export const useRestaurantItemsInfinite = (params: FetchBizItemsParams) => {
  const {isLoggedIn} = useAuthStore();
  // search category with name RESTAURANT
  const {
    data: categoriesData,
    isLoading: isLoadingCat,
    error: errorCat,
  } = useBizCategoriesQuery();

  const restaurantCategory = categoriesData?.find(
    category => category.category_name === BIZ_RESTAURANT_CATEGORY_NAME,
  );

  const filters: FetchBizItemsParams = {
    ...params,
    id_category: restaurantCategory?.category_id,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBizItemsInfinite(filters);

  return {
    data,
    isLoading: isLoading || isLoadingCat,
    error: error || errorCat,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isAuthenticated: isLoggedIn,
  };
};

export const useLawyerItemsInfinite = (params: FetchBizItemsParams) => {
  const {isLoggedIn} = useAuthStore();
  // search category with name LAWYER
  const {
    data: categoriesData,
    isLoading: isLoadingCat,
    error: errorCat,
  } = useBizCategoriesQuery();

  const lawyerCategory = categoriesData?.find(
    category => category.category_name === BIZ_LAWYER_CATEGORY_NAME,
  );

  const filters: FetchBizItemsParams = {
    ...params,
    id_category: lawyerCategory?.category_id,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBizItemsInfinite(filters);

  return {
    data,
    isLoading: isLoading || isLoadingCat,
    error: error || errorCat,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isAuthenticated: isLoggedIn,
  };
};
