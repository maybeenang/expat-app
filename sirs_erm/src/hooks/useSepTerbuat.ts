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

export const useSepTerbuatChartData = (params: SepTerbuatListParams) => {
  const {data, isLoading, isError, error} = useSepTerbuatTable({
    ...params,
    code_diag_awal: 'simrs',
    limit: 1000,
    page: 1,
  });

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useSepTerbuatTable({
    ...params,
    code_diag_awal: 'vclaim',
    limit: 1000,
    page: 1,
  });

  const {
    data: data3,
    isLoading: isLoading3,
    isError: isError3,
    error: error3,
  } = useSepTerbuatTable({
    ...params,
    jns_pelayanan: 1,
    limit: 1000,
    page: 1,
  });

  const {
    data: data4,
    isLoading: isLoading4,
    isError: isError4,
    error: error4,
  } = useSepTerbuatTable({
    ...params,
    jns_pelayanan: 2,
    limit: 1000,
    page: 1,
  });

  if (isLoading || isLoading2 || isLoading3 || isLoading4) {
    return {
      isLoading: true,
      chartData: [[]],
    };
  }

  if (isError || isError2 || isError3 || isError4) {
    return {
      isLoading: false,
      chartData: [[]],
      error: error || error2 || error3 || error4,
    };
  }

  if (!data || !data2 || !data3 || !data4) {
    return {
      isLoading: false,
      chartData: [[]],
      error: new Error('No data found'),
    };
  }

  // buat 2 pie chart berdasarkan data dari data dan data2
  // buat 2 pie chart berdasarkan data3 dan data4
  //
  const chartData = [
    [
      {
        name: 'Simrs',
        population: data.data.length,
        percentage:
          (data.data.length / (data.data.length + data2.data.length)) * 100,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Vclaim',
        population: data2.data.length,
        percentage:
          (data2.data.length / (data.data.length + data2.data.length)) * 100,
        color: 'rgba(255, 128, 0, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ],
    [
      {
        name: 'Ranap',
        population: data3.data.length,
        percentage:
          (data3.data.length / (data3.data.length + data4.data.length)) * 100,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'IGD/Rajal',
        population: data4.data.length,
        percentage:
          (data4.data.length / (data3.data.length + data4.data.length)) * 100,
        color: 'rgba(255, 128, 0, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ],
  ];

  console.log('Chart Data:', chartData);

  return {
    isLoading: false,
    chartData,
  };
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
