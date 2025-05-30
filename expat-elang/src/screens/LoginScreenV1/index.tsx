import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';

import Icon from '@react-native-vector-icons/ionicons';

import COLORS from '../../constants/colors';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';
import {useAuthMutations} from '../../hooks/useAuthMutations';
import {useLoadingOverlayStore} from '../../store/useLoadingOverlayStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {useRedirectStore} from '../../store/useRedirectStore';

interface LoginScreenV1Props
  extends NativeStackScreenProps<RootStackParamList, 'LoginV1'> {}

const LoginScreenV1 = ({navigation, route}: LoginScreenV1Props) => {
  const {show, hide} = useLoadingOverlayStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {login, error, isLoading} = useAuthMutations();

  const isValid = email && password && isLoading === false;

  const handleLoginPress = async () => {
    Keyboard.dismiss();
    if (!isValid) {
      return;
    }

    try {
      show();
      await login({username: email, password});
      if (route.params?.goto) {
      }
    } catch (e: any) {
      console.log('Login Error:', e);
    }

    hide();
  };

  const handleEyePress = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (error) {
      console.log('Login Error:', error.message);
      Alert.alert(error.message);
    }

    return () => {};
  }, [error]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{padding: 10}}>
            <Icon name="close" size={32} color={COLORS.textPrimary} />
          </TouchableOpacity>
        );
      },
    });

    return () => {};
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.container}>
        {/* --- Header Teks --- */}
        <StyledText style={styles.mainTitle}>Masuk ke Akun Anda</StyledText>
        <StyledText style={styles.subTitle}>
          Masukkan email dan password
        </StyledText>

        {/* --- Form Input --- */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username anda"
              placeholderTextColor={COLORS.greyDark}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                placeholder="Masukkan password anda"
                placeholderTextColor={COLORS.greyDark}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={handleEyePress}
                activeOpacity={0.7} // Efek opacity saat ditekan
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.greyDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          <StyledButton
            onPress={handleLoginPress}
            disabled={!isValid}
            style={[
              styles.loginButton,
              {
                backgroundColor: isValid
                  ? COLORS.primary
                  : COLORS.primaryDisabled,
              },
            ]}
            activeOpacity={0.8}>
            <StyledText style={styles.loginButtonText} weight="medium">
              Masuk
            </StyledText>
          </StyledButton>

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum memiliki akun?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}>
              <Text style={styles.registerLinkText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25, // Padding kiri-kanan utama
    alignItems: 'center',
    marginTop: 64, // Jarak dari atas layar
  },
  mainTitle: {
    fontFamily: 'Roboto-Bold', // Gunakan font bold
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: COLORS.textSecondary, // Warna abu-abu
    textAlign: 'center',
    marginBottom: 40, // Jarak lebih besar ke form
  },
  form: {
    width: '100%', // Form mengambil lebar penuh container
  },
  inputGroup: {
    marginBottom: 20, // Jarak antar group input (label + input)
    width: '100%',
  },
  label: {
    fontFamily: 'Roboto-Medium', // Atau Roboto-Regular, sesuaikan preferensi
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8, // Jarak label ke input
    alignSelf: 'flex-start', // Pastikan label rata kiri
  },
  input: {
    fontSize: 16,
    backgroundColor: COLORS.white, // Background input putih
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15, // Padding dalam input
    borderWidth: 1, // Beri border tipis
    borderColor: COLORS.greyMedium, // Warna border abu-abu
    color: COLORS.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row', // Susun TextInput dan Ikon secara horizontal
    alignItems: 'center', // Sejajarkan item di tengah secara vertikal
    width: '100%',
    position: 'relative', // Dibutuhkan agar ikon bisa diposisikan absolut di dalamnya jika perlu
  },
  inputPassword: {
    flex: 1, // Pastikan TextInput mengambil ruang yang tersedia
    paddingRight: 50, // Beri ruang di kanan untuk ikon mata
  },
  eyeIcon: {
    position: 'absolute', // Posisikan ikon di dalam container password
    right: 15, // Jarak ikon dari sisi kanan input
    height: '100%', // Pastikan area sentuh ikon setinggi input
    justifyContent: 'center', // Pusatkan ikon secara vertikal di area sentuh
    paddingLeft: 10, // Sedikit padding agar tidak terlalu mepet teks
  },
  loginButton: {
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  forgotPasswordLink: {
    marginLeft: 10,
  },
  forgotPasswordText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: COLORS.primary,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  registerLink: {
    marginLeft: 10,
  },
  registerLinkText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default LoginScreenV1;
