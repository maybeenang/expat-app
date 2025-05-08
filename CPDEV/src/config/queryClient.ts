import {QueryClient} from '@tanstack/react-query';

const handleGlobalError = (error: unknown) => {
  // Di sini Anda bisa melakukan logging error ke service seperti Sentry
  // atau menampilkan notifikasi global kepada pengguna.
  console.error('Global Query Error:', error);
  // Contoh sederhana:
  // Alert.alert('Error', 'An unexpected error occurred while fetching data.');
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Konfigurasi default untuk semua query
      retry: (failureCount, error: any) => {
        // Jangan coba lagi untuk error 401 (Unauthorized) atau 403 (Forbidden)
        // atau 404 (Not Found) karena kemungkinan tidak akan berhasil
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 404
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
      refetchOnWindowFocus: true, // Refetch saat window kembali fokus (berguna di web, bisa disesuaikan untuk mobile)
      refetchOnReconnect: true, // Refetch saat koneksi jaringan kembali
    },
    mutations: {
      // Konfigurasi default untuk semua mutasi
      onError: handleGlobalError, // Sama seperti queries
      retry: false, // Biasanya mutasi tidak di-retry secara otomatis
    },
  },
});
