import React, {useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput as RNTextInput, // Rename agar tidak konflik
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {DrawerParamList} from '../../../../navigation/types';
import COLORS from '../../../../constants/colors';
import PasswordInput from '../../../../components/common/PasswordInput';

// Tipe data untuk form
interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordScreenProps
  extends NativeStackScreenProps<DrawerParamList, 'ChangePassword'> {}

const ChangePasswordScreen = ({navigation}: ChangePasswordScreenProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newPasswordRef = useRef<RNTextInput>(null); // Ref untuk fokus ke input berikutnya
  const confirmPasswordRef = useRef<RNTextInput>(null);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch, // Untuk validasi konfirmasi password
    formState: {errors, isValid}, // isValid untuk status tombol Simpan
  } = useForm<ChangePasswordFormData>({
    mode: 'onChange', // Validasi berjalan saat input berubah
    defaultValues: {currentPassword: '', newPassword: '', confirmPassword: ''},
  });

  const watchedNewPassword = watch('newPassword'); // Tonton nilai field newPassword

  // Mengatur tombol 'Simpan' di header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          // Disable jika form tidak valid (berdasarkan rules) ATAU sedang submit
          disabled={!isValid || isSubmitting}
          style={styles.headerButton}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text
              style={[
                styles.headerButtonText,
                !isValid && styles.headerButtonDisabledText,
              ]}>
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, isValid, isSubmitting]); // Dependency array

  // Handler submit form
  const onSubmit: SubmitHandler<ChangePasswordFormData> = async data => {
    console.log('Password Change Data:', data); // Hanya log, hapus password asli di produksi
    setIsSubmitting(true);

    // --- Simulasi API Call (Ganti dengan logika API Anda) ---
    // @ts-ignore
    await new Promise(resolve => setTimeout(resolve, 1500));
    // --- Akhir Simulasi ---

    setIsSubmitting(false);
    Alert.alert('Info (Dummy)', 'Password tersimpan (simulasi)');
    // navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Input Current Password */}
          <Controller
            control={control}
            name="currentPassword"
            rules={{required: 'Password saat ini tidak boleh kosong'}}
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                label="Current Password"
                placeholder="Password saat ini"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                error={errors.currentPassword?.message}
                containerStyle={styles.inputGroup} // Beri margin bawah
                returnKeyType="next" // Tombol keyboard "Next"
                onSubmitEditing={() => newPasswordRef.current?.focus()} // Fokus ke input berikutnya
              />
            )}
          />

          {/* Input New Password */}
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: 'Password baru tidak boleh kosong',
              minLength: {value: 6, message: 'Password minimal 6 karakter'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                ref={newPasswordRef} // Kaitkan ref
                label="Password Baru"
                placeholder="Masukkan password baru"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                error={errors.newPassword?.message}
                containerStyle={styles.inputGroup}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              />
            )}
          />

          {/* Input Confirm New Password */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Konfirmasi password tidak boleh kosong',
              validate: value =>
                value === watchedNewPassword ||
                'Konfirmasi password tidak cocok', // Validasi kecocokan
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                ref={confirmPasswordRef} // Kaitkan ref
                label="Konfirmasi Password Baru"
                placeholder="Konfirmasi password baru"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                error={errors.confirmPassword?.message}
                containerStyle={styles.inputGroup}
                returnKeyType="done" // Tombol keyboard "Done"
                onSubmitEditing={handleSubmit(onSubmit)} // Submit form saat done
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles untuk ChangePasswordScreen
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollContainer: {flexGrow: 1, paddingVertical: 30, paddingHorizontal: 20}, // Beri padding atas
  formContainer: {flex: 1}, // Form mengisi sisa ruang
  inputGroup: {marginBottom: 5}, // Kurangi sedikit margin antar password input
  headerButton: {marginRight: 10, padding: 5},
  headerButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
  },
  headerButtonDisabledText: {color: COLORS.greyMedium},
});

export default ChangePasswordScreen;
