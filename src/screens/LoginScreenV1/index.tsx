import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import Icon from '@react-native-vector-icons/ionicons';

import COLORS from '../../constants/colors';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';

const LoginScreenV1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginPress = () => {
    console.log('Login Attempt:', { email, password });
    Alert.alert(
      'Login Attempt',
      `Email: ${email}\nPassword: ${password}`,
      [{ text: 'OK' }]
    );
  };

  const handleEyePress = () => {
    setShowPassword(!showPassword);
  };


  return (
    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      <View style={styles.container}>
        {/* --- Header Teks --- */}
        <StyledText style={styles.mainTitle}>Masuk ke Akun Anda</StyledText>
        <StyledText style={styles.subTitle}>Masukkan email dan password</StyledText>

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
                style={[styles.input, styles.inputPassword]} // Sedikit override style untuk password
                placeholder="Masukkan password anda"
                placeholderTextColor={COLORS.greyDark}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={handleEyePress}
                activeOpacity={0.7} // Efek opacity saat ditekan
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.greyDark}
                />
              </TouchableOpacity>

            </View>
          </View>

          <StyledButton
            onPress={handleLoginPress}
            style={{ marginTop: 20 }}
          >
            <StyledText style={styles.loginButtonText} weight="medium">Masuk</StyledText>
          </StyledButton>

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
    justifyContent: 'center',
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
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    backgroundColor: COLORS.white, // Background input putih
    height: 55, // Tinggi input
    borderRadius: 10, // Sudut melengkung
    paddingHorizontal: 15, // Padding dalam input
    borderWidth: 1, // Beri border tipis
    borderColor: COLORS.greyMedium, // Warna border abu-abu
    color: '#E5E5E5', // Warna teks yang diketik
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
  loginButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default LoginScreenV1;
