import {
  UseMutationResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createRental,
  deleteRental,
  descExpandable,
  fetchRentalCategoriesApi,
  fetchRentalDetailApi,
  fetchRentalItemsApi,
  formatPrice,
  mapRentalTypeToLabel,
  updateRental,
} from '../services/rentalService';
import type {
  RentalCategory,
  RentalListApiResponse,
  ProcessedRentalItem,
  RentalItemApi,
  ProcessedRentalDetail,
  CreateRentalFormData,
  UpdateRentalFormData,
} from '../types/rental';
import NUMBER from '../constants/number';
import {Asset} from 'react-native-image-picker';
import {useAuthStore} from '../store/useAuthStore';
import axios from 'axios';

export const rentalCategoriesQueryKey = ['rentalCategories'];
export const RECOMMENDATION_CATEGORY: RentalCategory = {
  value: 'all',
  label: 'Rekomendasi',
};

export const MY_RENTAL_CATEGORY: RentalCategory = {
  value: 'my',
  label: 'Rental Saya',
};

export const useRentalCategoriesQuery = () => {
  //const isLoggedIn = useAuthStore.getState().isLoggedIn;

  return useQuery<RentalCategory[], Error, RentalCategory[]>({
    queryKey: rentalCategoriesQueryKey,
    queryFn: fetchRentalCategoriesApi,
    staleTime: Infinity,
    select: data => {
      //if (isLoggedIn) {
      //  return [MY_RENTAL_CATEGORY, ...data];
      //}

      return [...data];
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
            isMine: item.id_users === useAuthStore.getState().userSession?.id,
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
        location: data.rent_city,
        priceFormatted: formatPrice(
          data.rent_price_number,
          data.rent_price_type,
        ),
        description: data.rent_descriptions,
        imageUrls: imageUrls,
        typeLabel: mapRentalTypeToLabel(data.type),
        contactNumber: NUMBER.defaultWhatsAppNumber, // <<< GANTI NOMOR CS
        descExpandable: descExpandable(
          data.rent_descriptions,
          imageUrls.length,
        ),
        availability: data.rent_availability,
        stayMin: data.rent_stay_min_number,
        stayMax: data.rent_stay_max_number,
        stayType: data.rent_stay_min_type,
        features: data.details_feature?.map((item: any) => item.nama_details1) || [],
        houseRules: data.details_house_rules?.map((item: any) => item.nama_details1) || [],
        address: data.rent_address,
        address2: data.rent_address2,
        city: data.rent_city,
        state: data.rent_state,
        zip: data.rent_zip,
      };
    },
  });
};

export const rentalDetailUnprocessedQueryKey = (rentalId: string) => [
  'rentalDetailUnprocessed',
  rentalId,
];

export const useRentalDetailUnprocessedQuery = (rentalId: string) => {
  return useQuery<RentalItemApi, Error>({
    queryKey: rentalDetailUnprocessedQueryKey(rentalId),
    queryFn: () => fetchRentalDetailApi(rentalId),
    enabled: !!rentalId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRentalCreateMutation = (): UseMutationResult<
  any, // Tipe sukses API
  Error, // Tipe error
  {formData: CreateRentalFormData; images: Asset[]} // Input untuk mutateAsync
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      images,
    }: {
      formData: CreateRentalFormData;
      images: Asset[];
    }) => {
      return createRental(formData, images);
    },
    onSuccess: () => {
      // Invalidate query list rental (jika ada) agar data baru muncul
      queryClient.invalidateQueries({queryKey: ['rentalItems']});
      console.log('Rental created successfully, cache invalidated.');
    },
    onError: error => {
      console.error('Error creating rental:', error);
    },
  });
};

export const useRentalDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteRental(eventId),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<{
        pages: RentalListApiResponse[];
        pageParams: number[];
      }>(['rentalItems'], oldData => {
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

      queryClient.invalidateQueries({
        queryKey: ['rentalItems'],
      });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      console.error('Error deleting job:', error.message);
      throw new Error('Failed to delete job');
    },
  });
};

export const useRentalUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRentalFormData) => updateRental(payload),
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['rentalItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['rentalDetail', variable.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['rentalDetailUnprocessed', variable.id],
      });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }

      console.error('Error message:', error.message);
    },
  });
};
