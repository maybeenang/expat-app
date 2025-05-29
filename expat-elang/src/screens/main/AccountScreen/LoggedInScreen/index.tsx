import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import {DrawerParamList} from '../../../../navigation/types';
import COLORS from '../../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';
import ErrorLabel from '../../../../components/common/ErrorLabel';
import {IMAGE_AVATAR_PLACEHOLDER} from '../../../../constants/images';
import {useAuthStore} from '../../../../store/useAuthStore';
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from '../../../../hooks/useProfileQuery';
import {useLoadingOverlayStore} from '../../../../store/useLoadingOverlayStore';
import {UpdateProfilePayload} from '../../../../types/profile';

interface EditProfileFormData {
  name: string;
  email: string;
  phone?: string;
}

interface EditProfileScreenProps
  extends NativeStackScreenProps<DrawerParamList, 'Profile'> {}

const EditProfileScreen = ({navigation}: EditProfileScreenProps) => {
  const {userSession, setUserSession} = useAuthStore();
  const mutation = useUpdateProfileMutation();
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error,
  } = useMyProfileQuery();

  // State lokal untuk gambar dan status submit
  const [currentAvatarUri, setCurrentAvatarUri] = useState<string | null>(
    IMAGE_AVATAR_PLACEHOLDER,
  );
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const {show, hide} = useLoadingOverlayStore();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isDirty, isLoading},
  } = useForm<EditProfileFormData>();

  useEffect(() => {
    if (profile) {
      setValue('name', profile.full_name || '');
      setValue('email', profile.email || '');
      setValue('phone', profile.phone || '');
    }
  }, [profile, setValue]);

  // Handler submit form
  const onSubmit: SubmitHandler<EditProfileFormData> = useCallback(
    async data => {
      console.log('Form Data:', data);
      console.log(
        'Selected Image:',
        selectedImage ? selectedImage.fileName : 'None',
      );

      show();
      try {
        const payload: UpdateProfilePayload = {
          full_name: data.name,
          phone: data.phone || '',
        };

        await mutation.mutateAsync(payload);
      } catch (err) {
        console.error('Error updating profile:', err);
        Alert.alert('Error', 'Gagal memperbarui profil. Silakan coba lagi.');
      } finally {
        hide();
      }
    },
    [selectedImage, show, hide, mutation], // Tambahkan userSession dan setAuthState ke dependensi,
  );

  // Mengatur tombol 'Simpan' di header navigasi
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={
            (!isDirty && !selectedImage) || isLoading || mutation.isPending
          }
          style={styles.headerButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text
              style={[
                styles.headerButtonText,
                !isDirty && !selectedImage && styles.headerButtonDisabledText,
              ]}>
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    handleSubmit,
    isDirty,
    selectedImage,
    onSubmit,
    isLoading,
    mutation.isPending,
  ]);

  // Handler untuk memilih foto dari galeri
  const handleChoosePhoto = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: false,
      });
      if (result.didCancel || result.errorCode) {
        if (result.errorCode) {
          Alert.alert('Error', result.errorMessage || 'Gagal memilih foto.');
        }
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setCurrentAvatarUri(result.assets[0].uri ?? null);
      }
    } catch (er) {
      Alert.alert('Error', 'Gagal membuka galeri.');
    }
  };

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.scrollContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.scrollContainer}>
          <Text style={{color: COLORS.red}}>Gagal memuat profil</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* Bagian Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{uri: currentAvatarUri ?? IMAGE_AVATAR_PLACEHOLDER}}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChoosePhoto}
            activeOpacity={0.7}>
            <Icon name="pencil-outline" size={16} color={COLORS.primary} />
            <Text style={styles.changePhotoButtonText}>Ganti foto</Text>
          </TouchableOpacity>
        </View>

        {/* Bagian Form */}
        <View style={styles.formContainer}>
          {/* Input Nama */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama</Text>
            <Controller
              control={control}
              name="name"
              rules={{required: 'Nama tidak boleh kosong'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={COLORS.greyDark}
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.name?.message} />
          </View>

          {/* Input Email (Non-Editable) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({field: {value}}) => (
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={value}
                  placeholder="Email"
                  editable={false}
                  selectTextOnFocus={false}
                />
              )}
            />
          </View>

          {/* Input Nomor Telepon */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={value}
                  onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))}
                  onBlur={onBlur}
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="phone-pad"
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.phone?.message} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {alignItems: 'center', marginBottom: 30},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: COLORS.greyLight,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  changePhotoButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
  },
  formContainer: {width: '100%'},
  inputGroup: {marginBottom: 25},
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  inputError: {borderColor: COLORS.red},
  disabledInput: {
    backgroundColor: COLORS.greyLight,
    color: COLORS.textSecondary,
  },
  headerButton: {marginRight: 10, padding: 5},
  headerButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
  },
  headerButtonDisabledText: {color: COLORS.greyMedium},
});

export default EditProfileScreen;
