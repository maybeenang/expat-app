import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {parseISO} from 'date-fns'; // Untuk format tanggal

// --- Import Konstanta, Tipe, Hook, Komponen Kustom ---
import COLORS from '../../../constants/colors'; // Sesuaikan path
import {RootStackParamList} from '../../../navigation/types'; // Sesuaikan path
import LoadingScreen from '../../LoadingScreen'; // Sesuaikan path
import ErrorScreen from '../../ErrorScreen'; // Sesuaikan path
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore'; // Sesuaikan path
import {CreateEventPayload} from '../../../types/event';
import {
  useEventAllOptions,
  useEventCreateMutation,
} from '../../../hooks/useEventQuery';
import FormInput from '../../../components/common/FormInput';
import FormDropdown from '../../../components/common/FormDropdown';
import FormDatePicker from '../../../components/common/FormDatePicker';
import SubmitButton from '../../../components/common/SubmitButton';
import ImageSelectionManager, {
  EnhancedImageAsset,
  prepareImagesForSubmission,
} from '../../../components/common/ImageSelectionManager';

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

  // State for images
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImageAsset[]>([]);

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

  // --- Efek Samping ---
  // Set nilai default untuk dropdown jika data sudah ada
  useEffect(() => {
    if (categories && categories.length > 0 && !watch('category')) {
      setValue('category', categories[0].id);
    }
    if (prices && prices.length > 0 && !watch('price')) {
      setValue('price', prices[0].id);
    }
  }, [categories, prices, setValue, watch]);

  // --- Fungsi Handler ---
  const onSubmit: SubmitHandler<CreateEventPayload> = async data => {
    if (enhancedImages.length === 0) {
      Alert.alert('Error', 'Pilih minimal satu gambar untuk event');
      return;
    }

    // Check for feature image
    const hasFeatureImage = enhancedImages.some(img => img.isFeature);
    if (!hasFeatureImage) {
      Alert.alert('Error', 'Pilih satu gambar sebagai gambar utama');
      return;
    }

    // Prepare images for submission
    const {featureImageId, imagesToUpload, imageInfo} = prepareImagesForSubmission(enhancedImages);

    const payload: CreateEventPayload = {
      ...data,
      is_feature: featureImageId,
      file: imagesToUpload.length > 0 ? imagesToUpload : undefined,
      image_title: imageInfo.titles,
      image_alt: imageInfo.alts,
      max_capacity: data.max_capacity || '', // Bisa kosong
      organizer_phone: data?.organizer_phone?.replace('+1', ''), // Hapus awalan +1
    };

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
                if (!watchedStartDate || !value) {
                  return true;
                }
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

          {/* Image Selection Component */}
          <ImageSelectionManager
            selectedImages={enhancedImages}
            onImagesChange={setEnhancedImages}
            maxImages={5}
            isDisabled={mutation.isPending}
            label="Gambar Event (Maks. 5) *"
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
});

export default EventsCreateScreen;
