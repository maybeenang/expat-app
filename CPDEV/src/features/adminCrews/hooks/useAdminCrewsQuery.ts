import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseInfiniteQueryResult,
  QueryKey,
  UseMutationResult,
  useMutation,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {
  addSignature,
  addUnavailableDateToCrew,
  createAdminCrew,
  createAdminCrewContract,
  fetchAdminCrewById,
  fetchAdminCrews,
} from '../services/adminCrewsService';
import type {
  AdminCrewsApiResponse,
  GetAdminCrewsParams,
  AdminCrew,
  CreateAdminCrewSuccessResponse,
  CreateAdminCrewPayload,
  CreateAdminCrewContractSuccessResponse,
  CreateAdminCrewContractPayload,
  AddUnavailableDateSuccessResponse,
  AddUnavailableDatePayload,
  AddSignatureSuccessResponse,
  AddSignaturePayload,
} from '../types';
import {queryKeys} from '../../../services/queryKeys'; // Sesuaikan path
import {formattedUnavailableDates} from '../../../utils/helpers';

export const useAdminCrewsListQuery = (
  params: GetAdminCrewsParams,
): UseQueryResult<AdminCrewsApiResponse, AxiosError> => {
  return useQuery<
    AdminCrewsApiResponse,
    AxiosError,
    AdminCrewsApiResponse,
    ReturnType<typeof queryKeys.adminCrews.list> // Tipe queryKey yang spesifik
  >({
    queryKey: queryKeys.adminCrews.list(params),
    queryFn: () => fetchAdminCrews(params),
    enabled: !!params,
  });
};

export const useInfiniteAdminCrewsQuery = (
  baseParams: Omit<GetAdminCrewsParams, 'page'> & {limit: number},
): UseInfiniteQueryResult<AdminCrew[], AxiosError> => {
  return useInfiniteQuery<
    AdminCrewsApiResponse,
    AxiosError,
    AdminCrew[], // TData
    QueryKey,
    number
  >({
    initialPageParam: 1,
    queryKey: queryKeys.adminCrews.list(baseParams),
    queryFn: ({pageParam = 1}) =>
      fetchAdminCrews({...baseParams, page: pageParam as number}),
    getNextPageParam: lastPage => {
      const currentPage = lastPage.pagination.current_page;
      const totalPages = lastPage.pagination.total_pages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Tidak ada halaman berikutnya
    },
    enabled: !!baseParams,
    select: data => {
      const allItems: AdminCrew[] = [];

      data.pages.forEach(page => {
        page.data.forEach(item => {
          allItems.push({
            ...item,
            formatted_unavailable_date: formattedUnavailableDates(
              item.unavailable_date,
            ),
          });
        });
      });

      return allItems;
    },
  });
};

export const useAdminCrewDetailQuery = (
  crewId: string | undefined,
): UseQueryResult<AdminCrew, AxiosError> => {
  return useQuery<
    AdminCrew,
    AxiosError,
    AdminCrew,
    ReturnType<typeof queryKeys.adminCrews.detail>
  >({
    queryKey: queryKeys.adminCrews.detail(crewId!),
    queryFn: () => fetchAdminCrewById(crewId!),
    enabled: !!crewId,
    select: data => {
      return {
        ...data,
        formatted_unavailable_date: formattedUnavailableDates(
          data.unavailable_date,
        ),
      };
    },
  });
};

export const useCreateAdminCrewMutation = (): UseMutationResult<
  CreateAdminCrewSuccessResponse,
  AxiosError, // Tipe error
  CreateAdminCrewPayload, // Tipe variabel input untuk fungsi mutasi (payload)
  unknown // Tipe context untuk optimistic updates (jika ada)
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<
    CreateAdminCrewSuccessResponse,
    AxiosError,
    CreateAdminCrewPayload
  >({
    mutationFn: createAdminCrew,
    onSuccess: (data, variables) => {
      console.log(
        'Admin crew created successfully:',
        data,
        'with payload:',
        variables,
      );

      queryClient.invalidateQueries({queryKey: queryKeys.adminCrews.lists()});
    },
    onError: (error, variables) => {
      // Dipanggil jika mutasi gagal
      console.error(
        'Error creating admin crew in hook:',
        error.message,
        'with payload:',
        variables,
      );
    },
  });
};

export const useCreateAdminCrewContractMutation = (): UseMutationResult<
  CreateAdminCrewContractSuccessResponse,
  AxiosError,
  CreateAdminCrewContractPayload,
  unknown
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<
    CreateAdminCrewContractSuccessResponse,
    AxiosError,
    CreateAdminCrewContractPayload
  >({
    mutationFn: createAdminCrewContract,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminCrews.detail(variables.id_users),
      });
      queryClient.invalidateQueries({queryKey: queryKeys.adminCrews.lists()});
    },
    onError: (error, variables) => {
      console.error('asd', error.stack);
      console.error(
        'Error creating admin crew contract in hook:',
        error.message,
        'for user:',
        variables.id_users,
      );
    },
  });
};

export const useAddUnavailableDateMutation = (): UseMutationResult<
  AddUnavailableDateSuccessResponse,
  AxiosError,
  AddUnavailableDatePayload,
  unknown
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<
    AddUnavailableDateSuccessResponse,
    AxiosError,
    AddUnavailableDatePayload
  >({
    mutationFn: addUnavailableDateToCrew,
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminCrews.all(),
      });
    },
    onError: (error, variables) => {
      console.error(
        'Error adding unavailable date in hook:',
        error.message,
        'for user ID:',
        variables.id,
      );
    },
  });
};

export const useAddSignatureMutation = (
  relatedCrewId?: string,
): UseMutationResult<
  AddSignatureSuccessResponse,
  AxiosError,
  AddSignaturePayload, // Payload termasuk ID (kontrak) dan signature
  unknown
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<
    AddSignatureSuccessResponse,
    AxiosError,
    AddSignaturePayload
  >({
    mutationFn: addSignature,
    onSuccess: (data, variables) => {
      console.log(
        'Signature added successfully:',
        data,
        'for ID (contract):',
        variables.id,
        'Type:',
        variables.type_signature,
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.contracts.detail(variables.id),
      });

      if (relatedCrewId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.adminCrews.detail(relatedCrewId),
        });
      }
    },
    onError: (error, variables) => {
      console.error(
        'Error adding signature in hook:',
        error.message,
        'for ID (contract):',
        variables.id,
      );
    },
  });
};
