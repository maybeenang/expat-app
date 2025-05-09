import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseInfiniteQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {fetchAdminCrews} from '../services/adminCrewsService';
import type {AdminCrewsApiResponse, GetAdminCrewsParams} from '../types';
import {queryKeys} from '../../../services/queryKeys'; // Sesuaikan path

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
): UseInfiniteQueryResult<AdminCrewsApiResponse, AxiosError> => {
  return useInfiniteQuery<
    AdminCrewsApiResponse,
    AxiosError,
    AdminCrewsApiResponse, // TData
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
  });
};

// Anda juga bisa membuat hook untuk mengambil detail satu admin crew:
// export const useAdminCrewDetailQuery = (
//   crewId: string,
//   options?: { enabled?: boolean }
// ): UseQueryResult<AdminCrew, AxiosError> => {
//   return useQuery<AdminCrew, AxiosError, AdminCrew, ReturnType<typeof queryKeys.adminCrews.detail>>({
//     queryKey: queryKeys.adminCrews.detail(crewId),
//     queryFn: () => fetchAdminCrewById(crewId), // Asumsi Anda punya service fetchAdminCrewById
//     enabled: options?.enabled ?? !!crewId,
//   });
// };
