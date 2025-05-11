import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {API_BASE_URL} from '@env'; // Dari react-native-dotenv
import {useAuthStore} from '../store/useAuthStore'; // Sesuaikan path
import {Alert} from 'react-native';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || 'https://fallback-api.example.com/v1', // Fallback jika .env tidak ada/kosong
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token; // Ambil token dari Zustand store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-token'] = token;
    }
    // Anda bisa menambahkan logging di sini untuk dev
    // console.log('Starting Request', JSON.stringify(config, null, 2));
    return config;
  },
  (error: AxiosError) => {
    // console.error('Request Error Interceptor:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Anda bisa memproses data response di sini sebelum dikembalikan
    // console.log('Response:', JSON.stringify(response.data, null, 2));
    return response; // atau response.data jika Anda selalu ingin data saja
  },
  (error: AxiosError) => {
    // console.error('Response Error Interceptor:', JSON.stringify(error.response?.data || error.message, null, 2));
    if (error.response) {
      // Server merespons dengan status code di luar 2xx range
      if (error.response.status === 401) {
        // Mungkin perlu navigasi ke layar login
        // RootNavigation.navigate('Login'); // Jika Anda setup global navigation helper
        Alert.alert('Session Expired', 'Silahkan login', [
          {
            text: 'OK',
            onPress: () => {
              useAuthStore.setState({token: null}); // Hapus token dari store
            },
          },
        ]);
      }
      // Anda bisa menambahkan penanganan error global lainnya di sini
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons diterima
      Alert.alert(
        'Network Error',
        'Could not connect to server. Please check your internet connection.',
      );
    } else {
      // Sesuatu terjadi saat setup request yang memicu Error
      Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
