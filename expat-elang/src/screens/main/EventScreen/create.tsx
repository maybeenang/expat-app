import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator, // Menggunakan ActivityIndicator jika diperlukan
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import Icon from '@react-native-vector-icons/ionicons'; // Atau gunakan CustomIcon jika preferensi

// --- Import Konstanta, Tipe, Hook, Komponen Kustom ---
import COLORS from '../../../constants/colors'; // Sesuaikan path
import {RootStackParamList} from '../../../navigation/types'; // Sesuaikan path
import ErrorLabel from '../../../components/common/ErrorLabel'; // Sesuaikan path
import LoadingScreen from '../../LoadingScreen'; // Sesuaikan path
import ErrorScreen from '../../ErrorScreen'; // Sesuaikan path
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore'; // Sesuaikan path
// --- Placeholder untuk Hooks (gantilah dengan implementasi Anda) ---
import {format, parseISO} from 'date-fns'; // Untuk format tanggal
import {
  CreateEventPayload,
  EventCategoryApi,
  EventPriceOption,
} from '../../../types/event';
import {
  useEventAllOptions,
  useEventCreateMutation,
} from '../../../hooks/useEventQuery';
import FormInput from '../../../components/common/FormInput';
import FormDropdown from '../../../components/common/FormDropdown';
import FormDatePicker from '../../../components/common/FormDatePicker';
import ImagePicker from '../../../components/common/ImagePicker';
import SubmitButton from '../../../components/common/SubmitButton';

interface EventsCreateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'EventCreate'> {}

const EventsCreateScreen = ({navigation}: EventsCreateScreenProps) => {
  const {
    isLoading: isLoadingOptions,
    categoryOptions: categories,
    priceOptions: prices,
    error: optionsError,
  } = useEventAllOptions(); // Hook untuk fetch category & price options
  const mutation = useEventCreateMutation(); // Hook untuk mutasi create event
  const {show, hide} = useLoadingOverlayStore();

  // --- State Lokal ---
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // Pastikan endDate > startDate

  // --- React Hook Form ---
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<CreateEventPayload>({
    defaultValues: {
      event_title: '',
      category: '',
      description: '',
      event_start: '',
      event_end: '',
      location: '',
      max_capacity: '',
      price: '', // Atau nilai default 'free' jika ada
      organizer_name: '',
      organizer_email: '',
      organizer_phone: '',
    },
  });

  // Watch tanggal untuk validasi
  const watchedStartDate = watch('event_start');
  const watchedEndDate = watch('event_end');

  // --- Efek Samping ---
  // Set nilai default untuk dropdown jika data sudah ada
  useEffect(() => {
    if (categories && categories.length > 0 && !watch('category')) {
      // hapus all category dari input
      setValue('category', categories[0].id);
    }
    if (prices && prices.length > 0 && !watch('price')) {
      setValue('price', prices[0].id);
    }
  }, [categories, prices, setValue, watch]);

  // --- Fungsi Handler ---
  const handleImagePick = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5 - selectedImages.length, // Batasi sesuai sisa slot
        quality: 0.7, // Kurangi kualitas untuk ukuran file lebih kecil
        includeBase64: false, // Tidak perlu base64 jika mengirim sebagai file
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', 'Gagal memilih gambar: ' + result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        // Filter aset yang valid (punya URI)
        const validAssets = result.assets.filter(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...validAssets]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatDateTimeForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd HH:mm'); // Format Y-m-d H:i
  };

  const onSubmit: SubmitHandler<CreateEventPayload> = async data => {
    // Format gambar untuk payload multipart/form-data
    const imagePayload = selectedImages.map((asset, index) => ({
      uri: asset.uri!,
      type: asset.type || 'image/jpeg',
      name: asset.fileName || `event_image_${Date.now()}_${index}.jpg`,
    }));

    const payload: CreateEventPayload = {
      ...data,
      is_feature: selectedImages[0]?.fileName || '', // Gunakan nama file pertama sebagai feature image
      file: imagePayload.length > 0 ? imagePayload : undefined,
      image_title: selectedImages.map((_, index) => `Image ${index + 1}`), // Default title untuk setiap gambar
      image_alt: 'Event image', // Default alt text
      max_capacity: data.max_capacity || '', // Bisa kosong
      organizer_phone: data?.organizer_phone?.replace('+1', ''), // Hapus awalan +1
    };

    console.log('Submitting Event Payload:', JSON.stringify(payload, null, 2));

    show();
    try {
      await mutation.mutateAsync(payload);
      Alert.alert('Sukses', 'Event berhasil dibuat', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e: any) {
      console.error('Error creating event:', e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        'Gagal membuat event. Silakan coba lagi.';
      Alert.alert('Error', errorMessage);
    } finally {
      hide();
    }
  };

  // --- Render Loading/Error State ---
  if (isLoadingOptions) {
    return <LoadingScreen />;
  }

  if (optionsError) {
    return (
      <ErrorScreen error={optionsError} placeholder="Gagal memuat data opsi" />
    );
  }

  // --- Render Komponen ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Buat Event Baru</Text>
          <FormInput
            control={control}
            name="event_title"
            label="Judul Event *"
            rules={{required: 'Judul event harus diisi'}}
            error={errors.event_title?.message}
            placeholder="Workshop React Native Advanced"
            isDisabled={mutation.isPending}
          />
          <FormDropdown
            control={control}
            name="category"
            label="Kategori Event *"
            options={(categories ?? []).map((c: any) => ({
              label: c.name,
              value: c.id,
            }))}
            rules={{required: 'Kategori harus dipilih'}}
            error={errors.category?.message}
            placeholder="Pilih Kategori"
            isDisabled={mutation.isPending}
          />
          <FormInput
            control={control}
            name="description"
            label="Deskripsi Event *"
            rules={{required: 'Deskripsi event harus diisi'}}
            error={errors.description?.message}
            placeholder="Jelaskan detail event, agenda, target peserta, dll."
            isDisabled={mutation.isPending}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
          <FormDatePicker
            control={control}
            name="event_start"
            label="Waktu Mulai *"
            rules={{required: 'Waktu mulai harus diisi'}}
            error={errors.event_start?.message}
            isDisabled={mutation.isPending}
            placeholder="Pilih Tanggal & Waktu Mulai"
            mode="datetime"
          />
          <FormDatePicker
            control={control}
            name="event_end"
            label="Waktu Selesai *"
            rules={{
              required: 'Waktu selesai harus diisi',
              validate: (value: string) => {
                if (!watchedStartDate || !value) return true;
                return (
                  parseISO(value) >= parseISO(watchedStartDate) ||
                  'Waktu selesai tidak boleh sebelum waktu mulai'
                );
              },
            }}
            error={errors.event_end?.message}
            isDisabled={mutation.isPending || !watchedStartDate}
            placeholder="Pilih Tanggal & Waktu Selesai"
            mode="datetime"
            minimumDate={startDate}
          />
          <FormInput
            control={control}
            name="location"
            label="Lokasi *"
            rules={{required: 'Lokasi event harus diisi'}}
            error={errors.location?.message}
            placeholder="Gedung Serbaguna ABC, Jl. Merdeka No. 10"
            isDisabled={mutation.isPending}
          />
          <FormInput
            control={control}
            name="max_capacity"
            label="Kapasitas Maksimal"
            rules={{
              pattern: {
                value: /^[1-9]\d*$/,
                message: 'Kapasitas harus berupa angka positif',
              },
            }}
            error={errors.max_capacity?.message}
            placeholder="100"
            isDisabled={mutation.isPending}
            keyboardType="number-pad"
          />
          <FormDropdown
            control={control}
            name="price"
            label="Harga Tiket *"
            options={(prices ?? []).map((p: any) => ({
              label: p.name,
              value: p.id,
            }))}
            rules={{required: 'Harga tiket harus dipilih'}}
            error={errors.price?.message}
            placeholder="Pilih Harga (Gratis/Berbayar)"
            isDisabled={mutation.isPending}
          />
          <FormInput
            control={control}
            name="organizer_name"
            label="Nama Penyelenggara"
            error={errors.organizer_name?.message}
            placeholder="Komunitas Developer XYZ"
            isDisabled={mutation.isPending}
          />
          <FormInput
            control={control}
            name="organizer_email"
            label="Email Penyelenggara"
            error={errors.organizer_email?.message}
            placeholder="contact@komunitasxyz.org"
            isDisabled={mutation.isPending}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            control={control}
            name="organizer_phone"
            label="Telepon Penyelenggara"
            error={errors.organizer_phone?.message}
            placeholder="+1234567890"
            isDisabled={mutation.isPending}
            keyboardType="phone-pad"
          />
          <ImagePicker
            label="Gambar Event (Maks. 5)"
            selectedImages={selectedImages}
            onImagesChange={setSelectedImages}
            maxImages={5}
            isDisabled={mutation.isPending}
          />
          <SubmitButton
            onPress={handleSubmit(onSubmit)}
            isLoading={mutation.isPending}
            label="Buat Event"
            isDisabled={mutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
// Menggunakan gaya yang mirip dengan JobsCreateScreen dengan beberapa penyesuaian
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  scrollContentContainer: {paddingBottom: 40}, // Lebih banyak padding bawah
  formContainer: {padding: 20},
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold', // Sesuaikan font family jika perlu
    color: COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium', // Sesuaikan font family jika perlu
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontFamily: 'Roboto-Regular', // Sesuaikan font family jika perlu
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  dropdownPlaceholder: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: Platform.OS === 'ios' ? 50 : 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    flex: 1, // Agar teks tidak terpotong oleh ikon
    marginRight: 10,
  },
  disabledInput: {
    backgroundColor: COLORS.greyLight, // Warna latar belakang untuk input disabled
    opacity: 0.7,
  },
  // Image Upload Styles (mirip ForumCreateScreen tapi disesuaikan)
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 10, // Jarak antar gambar/tombol
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8, // Posisi tombol hapus
    right: -8,
    backgroundColor: COLORS.white, // Background putih agar ikon lebih jelas
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white, // Warna latar belakang lembut
    padding: 5,
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Beri jarak dari elemen terakhir
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.primaryDisabled, // Warna tombol saat disabled
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.greyDark,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  featureImageBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureImageText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default EventsCreateScreen;
