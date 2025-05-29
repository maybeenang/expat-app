import {
  QueryKey,
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
  RentalDetailsFeature,
  RentalFilterParams,
} from '../types/rental';
import NUMBER from '../constants/number';
import {Asset} from 'react-native-image-picker';
import {useAuthStore} from '../store/useAuthStore';
import axios from 'axios';
import {IMAGE_PLACEHOLDER} from '../constants/images';
import {queryKeys} from '../services/queryKeys';

export const RECOMMENDATION_CATEGORY: RentalCategory = {
  value: 'all',
  label: 'Semua',
};

export const MY_RENTAL_CATEGORY: RentalCategory = {
  value: 'my',
  label: 'Rental Saya',
};

export const useRentalCategoriesQuery = () => {
  //const isLoggedIn = useAuthStore.getState().isLoggedIn;

  return useQuery<RentalCategory[], Error, RentalCategory[]>({
    queryKey: queryKeys.rentalKeys.categories(),
    queryFn: fetchRentalCategoriesApi,
    staleTime: Infinity,
    select: data => {
      //if (isLoggedIn) {
      //  return [MY_RENTAL_CATEGORY, ...data];
      //}

      return [RECOMMENDATION_CATEGORY, ...data];
    },
  });
};

export const useRentalItemsInfinite = (filter: RentalFilterParams) => {
  return useInfiniteQuery<
    RentalListApiResponse,
    Error,
    ProcessedRentalItem[],
    QueryKey,
    number
  >({
    queryKey: queryKeys.rentalKeys.items(filter.categories, filter),
    queryFn: ({pageParam}) => fetchRentalItemsApi({pageParam}, filter),
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

export const useRentalDetailQuery = (rentalId: string) => {
  return useQuery<RentalItemApi, Error, ProcessedRentalDetail>({
    queryKey: queryKeys.rentalKeys.detail(rentalId),
    queryFn: () => fetchRentalDetailApi(rentalId),
    enabled: !!rentalId,
    staleTime: 1000 * 60 * 5,
    select: data => {
      const imageUrls: string[] = [];
      const featureInRoom: RentalDetailsFeature[] = [];

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

      if (Array.isArray(data.details_in_room)) {
        data.details_in_room.forEach((item: RentalDetailsFeature) => {
          featureInRoom.push(item);
        });
      }

      if (Array.isArray(data.details_shared_common)) {
        data.details_shared_common.forEach((item: RentalDetailsFeature) => {
          featureInRoom.push(item);
        });
      }

      if (Array.isArray(data.details_main)) {
        data.details_main.forEach((item: RentalDetailsFeature) => {
          featureInRoom.push(item);
        });
      }

      if (Array.isArray(data.details_feature)) {
        data.details_feature.forEach((item: RentalDetailsFeature) => {
          featureInRoom.push(item);
        });
      }

      if (Array.isArray(data.details_house_rules)) {
        data.details_house_rules.forEach((item: RentalDetailsFeature) => {
          featureInRoom.push(item);
        });
      }

      if (imageUrls.length === 0) {
        imageUrls.push(IMAGE_PLACEHOLDER);
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
        features:
          data.details_feature?.map((item: any) => item.nama_details1) || [],
        houseRules:
          data.details_house_rules?.map((item: any) => item.nama_details1) ||
          [],
        address: data.rent_address,
        address2: data.rent_address2,
        city: data.rent_city,
        state: data.rent_state,
        zip: data.rent_zip,
        featuresInRoom: featureInRoom,
      };
    },
  });
};

export const useRentalDetailUnprocessedQuery = (rentalId: string) => {
  return useQuery<RentalItemApi, Error>({
    queryKey: queryKeys.rentalKeys.detailUnprocessed(rentalId),
    queryFn: () => fetchRentalDetailApi(rentalId),
    enabled: !!rentalId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRentalCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateRentalFormData) => createRental(formData),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.items(MY_RENTAL_CATEGORY.value),
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.all,
        }),
      ]);
    },
    onError: error => {
      console.error('Error creating rental:', error);
    },
  });
};

export const useRentalDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rentalId: string) => deleteRental(rentalId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.items(MY_RENTAL_CATEGORY.value),
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.all,
        }),
      ]);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      console.error('Error deleting rental:', error.message);
    },
  });
};

export const useRentalUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: UpdateRentalFormData) => updateRental(formData),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.items(MY_RENTAL_CATEGORY.value),
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.rentalKeys.detail(variables.id),
        }),
      ]);
    },
    onError: error => {
      console.error('Error updating rental:', error);
    },
  });
};
