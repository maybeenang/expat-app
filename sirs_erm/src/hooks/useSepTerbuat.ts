import {QueryKey, useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {sepTerbuatService} from '../services/sepTerbuatService';
import {queryKeys} from '../services/queryKeys';
import type {
  SepTerbuat,
  SepTerbuatListParams,
  SepTerbuatListResponse,
} from '../types/sepTerbuat';
import {AxiosError} from 'axios';

type TableResponse = {
  data: SepTerbuat[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const useSepTerbuatList = (params: SepTerbuatListParams) => {
  return useInfiniteQuery<
    SepTerbuatListResponse,
    AxiosError,
    SepTerbuat[],
    QueryKey,
    number
  >({
    queryKey: queryKeys.sepTerbuat.list(params),
    queryFn: ({pageParam = 1}) =>
      sepTerbuatService.getList({...params, page: pageParam}),
    getNextPageParam: lastPage => {
      const currentPage = lastPage.pagination.current_page;
      const totalPages = lastPage.pagination.total_pages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    select: data => {
      const allItems: SepTerbuat[] = [];
      data.pages.forEach(page => {
        allItems.push(...page.data);
      });
      return allItems;
    },
  });
};

export const useSepTerbuatTable = (params: SepTerbuatListParams) => {
  return useQuery<SepTerbuatListResponse, AxiosError, TableResponse>({
    queryKey: queryKeys.sepTerbuat.list(params),
    queryFn: () => sepTerbuatService.getList(params),
    select: data => ({
      data: data.data,
      pagination: {
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalItems: data.pagination.total_data,
        itemsPerPage: data.pagination.limit,
      },
    }),
  });
};

// Boilerplate hooks for future implementation
export const useSepTerbuatDetail = (id: string) => {
  throw new Error('Not implemented');
};

export const useSepTerbuatCreate = () => {
  throw new Error('Not implemented');
};

export const useSepTerbuatUpdate = () => {
  throw new Error('Not implemented');
};

export const useSepTerbuatDelete = () => {
  throw new Error('Not implemented');
};

