import React from 'react';
import {StyleSheet, Keyboard, Alert, Text, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {
  ControlledInput,
  ScreenContainer,
  StyledButton,
} from '../../../components/common';
import {COLORS, numbers} from '../../../contants/styles';
import {useAuthMutations} from '../../../hooks/useAuthMutation';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import type {LoginCredentials} from '../../../types/auth';
import Logo from '../../../components/common/Logo';

const LoginScreen: React.FC = () => {
  const {login, isLoading} = useAuthMutations();
  const {show, hide} = useLoadingOverlayStore();

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting, isValid},
  } = useForm<LoginCredentials>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    Keyboard.dismiss();
    if (!data.username || !data.password || isLoading) {
      return;
    }
    show();
    try {
      await login(data);
    } catch (error) {
      Alert.alert(
        'Login Gagal',
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan. Silakan coba lagi.',
      );
    } finally {
      hide();
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: numbers.margin * 2,
          marginTop: numbers.margin * -2,
        }}>
        <Logo height={24} width={200} />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Log In to your account and stay connected
      </Text>

      <ControlledInput
        name="username"
        label="Username"
        control={control}
        placeholder="Masukan username anda"
        rules={{
          required: 'Username is required',
        }}
        error={errors.username}
        autoCapitalize="none"
      />
      <ControlledInput
        name="password"
        label="Password"
        placeholder="Masukan password anda"
        control={control}
        rules={{
          required: 'Password is required',
        }}
        error={errors.password}
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
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: numbers.margin * 2,
    color: COLORS.textDisabled,
  },
});

export default LoginScreen;
