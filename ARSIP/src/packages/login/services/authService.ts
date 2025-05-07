import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import {LoginResponse} from '../models/loginResponse';

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse | null> => {
  try {
    const response = await api.post<LoginResponse>('/99_login', {
      username,
      password,
    });
    console.log(response);

    if (response.data.status === 200) {
      const {'x-token': token, data_session} = response.data.data;

      const expiryTime = Date.now() + data_session.duration * 1000;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('tokenExpiryTime', expiryTime.toString());
      await AsyncStorage.setItem('user', JSON.stringify(data_session));

      return response.data;
    }

    return null;
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      return error.response.data;
    } else {
      console.error('Unexpected Error:', error.message);
      return null;
    }
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};
