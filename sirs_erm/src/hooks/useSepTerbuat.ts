import {QueryKey, useInfiniteQuery} from '@tanstack/react-query';
import {sepTerbuatService} from '../services/sepTerbuatService';
import {queryKeys} from '../services/queryKeys';
import type {
  SepTerbuat,
  SepTerbuatListParams,
  SepTerbuatListResponse,
} from '../types/sepTerbuat';
import {AxiosError} from 'axios';

export const useSepTerbuatList = (params: SepTerbuatListParams) => {
  return useInfiniteQuery<
    SepTerbuatListResponse,
    AxiosError,
    SepTerbuat[], // TData
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
        page.data.forEach(item => {
          allItems.push(item);
        });
      });

      return allItems;
    },
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

