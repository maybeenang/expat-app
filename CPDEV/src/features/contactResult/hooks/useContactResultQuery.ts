// src/features/contactResults/hooks/useContactResultQueries.ts

import {
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import type {
  ContactResultsListApiResponse,
  ContactResultItem,
  GetContactResultsParams,
  DeleteContactResultSuccessResponse,
} from '../types/contactResult'; // Pastikan path benar
import {queryKeys} from '../../../services/queryKeys';
import {
  deleteContactResultById,
  fetchContactResults,
} from '../services/contactResultSerivce';

export const useInfiniteContactResultsQuery = (
  baseParams: Omit<GetContactResultsParams, 'page' | 'limit'> & {limit: number},
): UseInfiniteQueryResult<ContactResultItem[], AxiosError> => {
  return useInfiniteQuery<
    ContactResultsListApiResponse,
    AxiosError,
    ContactResultItem[],
    QueryKey,
    number
  >({
    queryKey: queryKeys.contactResults.list(baseParams),
    queryFn: async ({pageParam = 1}) => {
      // pageParam adalah nomor halaman, default ke 1
      const paramsWithPage: GetContactResultsParams = {
        ...baseParams,
        limit: baseParams.limit,
        page: pageParam as number, // Gunakan pageParam untuk menentukan halaman
      };
      return fetchContactResults(paramsWithPage);
    },
    initialPageParam: 1, // Halaman pertama adalah 1
    getNextPageParam: lastPageResponse => {
      // Logika berdasarkan current_page dan total_pages dari pagination
      const currentPage = lastPageResponse.pagination.current_page;
      const totalPages = lastPageResponse.pagination.total_pages;

      if (currentPage < totalPages) {
        return currentPage + 1; // Kembalikan nomor halaman berikutnya
      }
      return undefined; // Tidak ada halaman berikutnya
    },
    select: data => {
      const allItemsFlattened = data.pages.flatMap(page => page.data);

      return allItemsFlattened.map(item => ({
        ...item,
      }));
    },
  });
};

export const useDeleteContactResultMutation = (): UseMutationResult<
  DeleteContactResultSuccessResponse, // Tipe data yang dikembalikan on success
  AxiosError, // Tipe error
  string, // Variabel input adalah contactResultId (string)
  unknown // Tipe context untuk optimistic updates (jika ada)
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<
    DeleteContactResultSuccessResponse,
    AxiosError,
    string // Tipe argumen untuk mutationFn, yaitu contactResultId
  >({
    mutationFn: (contactResultId: string) =>
      deleteContactResultById(contactResultId), // Fungsi service yang dipanggil
    onSuccess: (data, contactResultId, _context) => {
      // Dipanggil setelah mutasi berhasil
      console.log(
        'Contact result deleted successfully:',
        data,
        'for ID:',
        contactResultId,
      );

      // Invalidate semua query yang berkaitan dengan daftar contact results
      // Ini akan membuat query tersebut menjadi stale dan di-refetch otomatis
      // saat komponen yang menggunakannya aktif kembali.
      queryClient.invalidateQueries({
        queryKey: queryKeys.contactResults.lists(),
      });

      // Contoh invalidasi yang lebih spesifik jika Anda tahu parameter filter saat ini:
      // Jika Anda menyimpan parameter filter aktif (misalnya dari state atau context)
      // const currentFilterParams = /* ... dapatkan parameter filter aktif ... */;
      // queryClient.invalidateQueries({ queryKey: queryKeys.contactResults.list(currentFilterParams) });

      // Opsional: Optimistic Update (lebih advanced, untuk UI yang lebih responsif)
      // Anda bisa mencoba menghapus item dari cache secara manual sebelum invalidasi.
      // Namun, ini memerlukan penanganan yang hati-hati terhadap struktur data cache,
      // terutama dengan infinite queries. Invalidasi query list biasanya sudah cukup.
      // Contoh (SANGAT DISESUAIKAN dan mungkin kompleks dengan infinite query & select):
      // queryClient.setQueryData(
      //   queryKeys.contactResults.list(/** parameter filter yang relevan **/),
      //   (oldData: any /* tipe InfiniteData<InfiniteContactResultsData> yang benar */) => {
      //     if (!oldData || !oldData.pages) return oldData;
      //     return {
      //       ...oldData,
      //       pages: oldData.pages.map((pageGroup: any /* tipe ContactResultsListApiResponse */) => ({
      //         ...pageGroup,
      //         data: pageGroup.data.filter((item: any /* tipe ContactResultItem */) => item.id !== contactResultId),
      //         // Anda mungkin juga perlu mengupdate pagination.total_data di sini
      //       })).filter((pageGroup: any) => pageGroup.data.length > 0), // Hapus halaman kosong
      //     };
      //   }
      // );

      // Notifikasi sukses bisa ditambahkan di sini
      // Alert.alert('Sukses', data.message || 'Hasil kontak berhasil dihapus.');
    },
    onError: (error, contactResultId, _context) => {
      // Dipanggil jika mutasi gagal
      console.error(
        'Error deleting contact result in hook:',
        error.message,
        'for ID:',
        contactResultId,
      );
    },
  });
};
