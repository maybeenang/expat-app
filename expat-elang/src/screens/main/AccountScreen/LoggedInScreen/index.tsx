import React, {useState, useLayoutEffect, useCallback} from 'react';
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

interface EditProfileFormData {
  name: string;
  email: string;
  phone?: string;
}

interface EditProfileScreenProps
  extends NativeStackScreenProps<DrawerParamList, 'Profile'> {}

const EditProfileScreen = ({navigation}: EditProfileScreenProps) => {
  const {userSession} = useAuthStore();
  
  // State lokal untuk gambar dan status submit
  const [currentAvatarUri, setCurrentAvatarUri] = useState<string | null>(
    IMAGE_AVATAR_PLACEHOLDER,
  );
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: userSession?.nama || '',
      email: userSession?.email || '',
      phone: '',
    },
  });

  // Handler submit form
  const onSubmit: SubmitHandler<EditProfileFormData> = useCallback(
    async data => {
      console.log('Form Data:', data);
      console.log(
        'Selected Image:',
        selectedImage ? selectedImage.fileName : 'None',
      );
      setIsSubmitting(true);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      Alert.alert('Info (Dummy)', 'Data profil disimpan (simulasi)');
    },
    [selectedImage],
  );

  // Mengatur tombol 'Simpan' di header navigasi
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={(!isDirty && !selectedImage) || isSubmitting}
          style={styles.headerButton}>
          {isSubmitting ? (
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
    isSubmitting,
    onSubmit,
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
    } catch (error) {
      Alert.alert('Error', 'Gagal membuka galeri.');
    }
  };

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
                  editable={!isSubmitting}
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
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  onBlur={onBlur}
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="phone-pad"
                  editable={!isSubmitting}
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
