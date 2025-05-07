import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';
import ErrorLabel from '../ErrorLabel';

// Interface ini mendefinisikan props yang diterima komponen
interface PasswordInputProps extends TextInputProps {
  label: string; // Label wajib untuk input
  error?: string; // Pesan error opsional
  containerStyle?: StyleProp<ViewStyle>; // Style opsional untuk container utama
  // Props TextInput standar (seperti value, onChangeText, placeholder, dll.) diwarisi
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  containerStyle,
  style, // Style untuk TextInput itu sendiri
  ...rest // Sisa props TextInput (value, onChangeText, onBlur, etc.)
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <View style={[styles.inputGroup, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      {/* Container untuk TextInput dan ikon mata */}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputErrorBorder : styles.inputDefaultBorder,
        ]}>
        <TextInput
          style={[styles.input, style]} // Gabungkan style default & custom
          secureTextEntry={!isPasswordVisible} // Sembunyikan teks jika isPasswordVisible false
          placeholderTextColor={COLORS.greyDark} // Warna placeholder
          autoCapitalize="none" // Nonaktifkan auto-kapitalisasi
          autoCorrect={false} // Nonaktifkan auto-koreksi
          textContentType="password" // Bantu password manager (iOS)
          {...rest} // Sebarkan sisa props (value, onChangeText, etc.)
        />
        {/* Tombol ikon mata */}
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
          activeOpacity={0.7}>
          <Icon
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} // Ganti ikon berdasarkan state
            size={22}
            color={COLORS.greyDark} // Warna ikon
          />
        </TouchableOpacity>
      </View>
      {/* Tampilkan pesan error jika ada */}
      <ErrorLabel error={error} />
    </View>
  );
};

// Styles untuk komponen PasswordInput
const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 25, // Jarak bawah antar grup input
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium', // Font medium untuk label
    color: COLORS.textSecondary, // Warna abu-abu untuk label
    marginBottom: 8, // Jarak antara label dan input
  },
  inputContainer: {
    flexDirection: 'row', // Susun TextInput dan ikon secara horizontal
    alignItems: 'center', // Tengahkan item secara vertikal
    borderWidth: 1, // Lebar border
    borderRadius: 8, // Sudut melengkung
    backgroundColor: COLORS.white, // Background putih
  },
  inputDefaultBorder: {
    borderColor: COLORS.greyMedium, // Warna border default
  },
  inputErrorBorder: {
    borderColor: COLORS.red, // Warna border merah jika ada error
  },
  input: {
    flex: 1, // TextInput mengambil ruang fleksibel
    paddingHorizontal: 15, // Padding horizontal dalam input
    paddingVertical: Platform.OS === 'ios' ? 14 : 12, // Padding vertikal (sedikit beda antar OS)
    fontSize: 16, // Ukuran font input
    fontFamily: 'Roboto-Regular', // Font regular untuk input
    color: COLORS.textPrimary, // Warna teks input
  },
  iconContainer: {
    paddingHorizontal: 12, // Area sentuh untuk ikon mata
    justifyContent: 'center', // Tengahkan ikon secara vertikal
  },
});

export default PasswordInput; // Ekspor komponen
