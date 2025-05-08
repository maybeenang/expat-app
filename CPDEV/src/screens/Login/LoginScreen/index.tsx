import React from 'react';
import {StyleSheet, Text, Alert, Keyboard} from 'react-native';
import {useForm} from 'react-hook-form';
import {
  ControlledInput,
  ScreenContainer,
  StyledButton,
} from '../../../components/common';
import {numbers} from '../../../contants/styles';
import {useAuthMutations} from '../../../hooks/useAuthMutation';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import axios from 'axios';

interface LoginFormInputs {
  email: string;
  password_is_very_long_name: string; // Contoh nama panjang
}

const LoginScreen: React.FC = () => {
  const {login, isLoading} = useAuthMutations();
  const {show, hide} = useLoadingOverlayStore();

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting, isValid},
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password_is_very_long_name: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    Keyboard.dismiss();
    if (!data.email || !data.password_is_very_long_name || isLoading) {
      return;
    }
    show();
    try {
      await login({
        username: data.email,
        password: data.password_is_very_long_name, // Gunakan nama panjang yang sama
      });
      Alert.alert('Login Berhasil', 'Selamat datang kembali!');
    } catch (error) {
      console.log('Login error:', axios.isAxiosError(error));
      console.log('Login error:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Login Gagal',
          error.message || 'Terjadi kesalahan. Silakan coba lagi.',
        );
      } else {
        Alert.alert('Login Gagal', 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      hide();
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Masuk ke Akun Anda</Text>
      <Text style={styles.subtitle}>Masukkan email dan password</Text>

      <ControlledInput
        name="email"
        label="Email"
        control={control}
        placeholder="Masukan email anda"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ControlledInput
        name="password_is_very_long_name" // Gunakan nama panjang yang sama
        label="Password"
        placeholder="Masukan password anda"
        control={control}
        rules={{
          required: 'Password is required',
        }}
        error={errors.password_is_very_long_name}
        isPassword
      />
      <StyledButton
        title="Masuk"
        size="large"
        style={{marginTop: numbers.margin}}
        disabled={!isValid}
        isLoading={isSubmitting}
        textStyle={{fontWeight: 'bold'}}
        onPress={handleSubmit(onSubmit)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: numbers.padding,
    paddingTop: numbers.padding * 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: numbers.margin,
  },
});

export default LoginScreen;
