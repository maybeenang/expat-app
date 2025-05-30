import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {format, parseISO, isValid} from 'date-fns';

// --- Import Konstanta, Tipe, Hook, Komponen Kustom ---
import COLORS from '../../../constants/colors';
import {RootStackParamList} from '../../../navigation/types';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {UpdateEventPayload, EventItemApi} from '../../../types/event';
import {
  useEventAllOptions,
  useEventDetailUnprocessedQuery,
  useEventUpdateMutation,
} from '../../../hooks/useEventQuery';
import {capitalizeFirstChar} from '../../../utils/helpers';

// --- Import Reusable Components ---
import FormInput from '../../../components/common/FormInput';
import FormDropdown from '../../../components/common/FormDropdown';
import FormDatePicker from '../../../components/common/FormDatePicker';
import ImageSelectionManager, {
  EnhancedImageAsset,
  ExistingImageType,
  prepareImagesForSubmission,
} from '../../../components/common/ImageSelectionManager';

// --- Props Komponen ---
interface EventUpdateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'EventUpdate'> {}

const formatDataForForm = (data: EventItemApi): UpdateEventPayload => {
  const parsedStartDate = parseISO(data.event_start);
  const parsedEndDate = parseISO(data.event_end);

  return {
    id: data.id,
    event_url: data.event_slug,
    event_title: data.event_title,
    category: data.id_ref_indo_global_event_category,
    description: data.event_description,
    event_start: isValid(parsedStartDate)
      ? format(parsedStartDate, 'yyyy-MM-dd HH:mm')
      : '',
    event_end: isValid(parsedEndDate)
      ? format(parsedEndDate, 'yyyy-MM-dd HH:mm')
      : '',
    location: data.location,
    max_capacity: data?.max_capacity ? String(data.max_capacity) : '',
    price: capitalizeFirstChar(data.price),
    organizer_name: data?.organizer_name || '',
    organizer_email: data?.organizer_email || '',
    organizer_phone: data?.organizer_phone ? `+1${data.organizer_phone}` : '',
  };
};

const EventUpdateScreen = ({navigation, route}: EventUpdateScreenProps) => {
  const {eventId} = route.params;

  const {
    data: eventData,
    isLoading: isLoadingDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useEventDetailUnprocessedQuery(eventId);

  const {
    isLoading: isLoadingOptions,
    categoryOptions: categories,
    priceOptions: prices,
    error: optionsError,
  } = useEventAllOptions();

  const updateMutation = useEventUpdateMutation(); // Hook mutasi update
  const {show, hide} = useLoadingOverlayStore();

  // --- State Lokal untuk UI ---
  const [existingImages, setExistingImages] = useState<ExistingImageType[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImageAsset[]>(
    [],
  );

  // --- React Hook Form ---
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {errors, isDirty},
  } = useForm<UpdateEventPayload>();

  // Watch tanggal untuk validasi
  const watchedStartDate = watch('event_start');

  useEffect(() => {
    if (eventData) {
      const formattedData = formatDataForForm(eventData.mainEvent);
      reset(formattedData);

      if (eventData.mainEvent.images && eventData.mainEvent.images.length > 0) {
        const existingImagesData = eventData.mainEvent.images.map(
          (img, index) => ({
            id: img.id,
            img_url: img.img_url,
            title: img.img_title || `Image ${index + 1}`,
            alt: img.img_alt || 'Event image',
            isFeature: img.is_feature === '1',
          }),
        );

        setExistingImages(existingImagesData);
      } else {
        setExistingImages([]);
      }

      setImagesToDelete([]);
      setEnhancedImages([]);
    }
  }, [eventData, reset]);

  // Handler Submit Form Update
  const onSubmit: SubmitHandler<UpdateEventPayload> = async data => {
    const totalImagesAfterUpdate =
      existingImages.filter(img => !imagesToDelete.includes(img.id)).length +
      enhancedImages.length;

    if (totalImagesAfterUpdate === 0) {
      Alert.alert('Error', 'Minimal harus ada satu gambar untuk event');
      return;
    }

    // Check that a feature image is selected
    const hasFeatureImage =
      existingImages.some(
        img => img.isFeature && !imagesToDelete.includes(img.id),
      ) || enhancedImages.some(img => img.isFeature);

    if (!hasFeatureImage) {
      Alert.alert('Error', 'Pilih satu gambar sebagai gambar feature');
      return;
    }

    const {featureImageId, imagesToUpload, imageInfo} =
      prepareImagesForSubmission(
        enhancedImages,
        existingImages,
        imagesToDelete,
      );

    const payload: UpdateEventPayload = {
      ...data,
      is_feature: featureImageId,
      file: imagesToUpload.length > 0 ? imagesToUpload : undefined,
      image_title: imageInfo.titles,
      image_alt: imageInfo.alts,
      max_capacity: data.max_capacity || undefined,
      organizer_name: data.organizer_name || undefined,
      organizer_email: data.organizer_email || undefined,
      organizer_phone: data.organizer_phone
        ? data.organizer_phone.replace('+1', '')
        : undefined,
      images_deleted: imagesToDelete.length > 0 ? imagesToDelete : undefined,
    };

    show();
    try {
      await updateMutation.mutateAsync(payload);
      Alert.alert('Sukses', 'Event berhasil diperbarui', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e: any) {
      console.error('Error updating event:', e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        'Gagal memperbarui event. Silakan coba lagi.';
      Alert.alert('Error', errorMessage);
    } finally {
      hide();
    }
  };

  // --- Prepare dropdown options ---
  const categoryOptions =
    categories?.map(cat => ({
      label: cat.name,
      value: cat.id,
    })) || [];

  const priceOptions =
    prices?.map(price => ({
      label: price.name,
      value: price.id,
    })) || [];

  // --- Render Loading/Error State ---
  const isLoading = isLoadingOptions || isLoadingDetail;
  const error = optionsError || detailError;

  if (isLoading && !eventData) {
    return <LoadingScreen text="Memuat data event..." />;
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        placeholder="Gagal memuat data event atau opsi"
        refetch={refetchDetail}
      />
    );
  }

  if (!eventData) {
    return (
      <ErrorScreen
        placeholder={`Event dengan ID ${eventId} tidak ditemukan.`}
        error={new Error('Event not found')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Edit Event</Text>

          <FormInput
            control={control}
            name="event_title"
            label="Judul Event *"
            placeholder="Contoh: Workshop React Native Advanced"
            rules={{required: 'Judul event harus diisi'}}
            error={errors.event_title?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormDropdown
            control={control}
            name="category"
            label="Kategori Event *"
            placeholder="Pilih Kategori"
            options={categoryOptions}
            rules={{required: 'Kategori harus dipilih'}}
            error={errors.category?.message}
            isDisabled={
              updateMutation.isPending || categoryOptions.length === 0
            }
          />

          <FormInput
            control={control}
            name="description"
            label="Deskripsi Event *"
            placeholder="Jelaskan detail event..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            rules={{required: 'Deskripsi event harus diisi'}}
            error={errors.description?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormDatePicker
            control={control}
            name="event_start"
            label="Waktu Mulai *"
            placeholder="Pilih Tanggal & Waktu Mulai"
            mode="datetime"
            rules={{required: 'Waktu mulai harus diisi'}}
            error={errors.event_start?.message}
            isDisabled={updateMutation.isPending}
            minimumDate={new Date()}
          />

          <FormDatePicker
            control={control}
            name="event_end"
            label="Waktu Selesai *"
            placeholder="Pilih Tanggal & Waktu Selesai"
            mode="datetime"
            minimumDate={
              watchedStartDate ? parseISO(watchedStartDate) : undefined
            }
            rules={{
              required: 'Waktu selesai harus diisi',
              validate: (value: string) => {
                if (!watchedStartDate || !value) {
                  return true;
                }
                const start = parseISO(watchedStartDate);
                const end = parseISO(value);
                if (!isValid(start) || !isValid(end)) {
                  return 'Format tanggal tidak valid';
                }
                return (
                  end >= start ||
                  'Waktu selesai tidak boleh sebelum waktu mulai'
                );
              },
            }}
            error={errors.event_end?.message}
            isDisabled={updateMutation.isPending || !watchedStartDate}
          />

          <FormInput
            control={control}
            name="location"
            label="Lokasi *"
            placeholder="Contoh: Gedung Serbaguna ABC"
            rules={{required: 'Lokasi event harus diisi'}}
            error={errors.location?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormInput
            control={control}
            name="max_capacity"
            label="Kapasitas Maksimal"
            placeholder="Contoh: 100"
            keyboardType="number-pad"
            rules={{
              pattern: {
                value: /^[1-9]\d*$/,
                message: 'Kapasitas harus berupa angka positif',
              },
            }}
            error={errors.max_capacity?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormDropdown
            control={control}
            name="price"
            label="Harga Tiket *"
            placeholder="Pilih Harga (Gratis/Berbayar)"
            options={priceOptions}
            rules={{required: 'Harga tiket harus dipilih'}}
            error={errors.price?.message}
            isDisabled={updateMutation.isPending || priceOptions.length === 0}
          />

          <FormInput
            control={control}
            name="organizer_name"
            label="Nama Penyelenggara"
            placeholder="Contoh: Komunitas Developer XYZ"
            error={errors.organizer_name?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormInput
            control={control}
            name="organizer_email"
            label="Email Penyelenggara"
            placeholder="Contoh: contact@komunitasxyz.org"
            keyboardType="email-address"
            autoCapitalize="none"
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Format email tidak valid',
              },
            }}
            error={errors.organizer_email?.message}
            isDisabled={updateMutation.isPending}
          />

          <FormInput
            control={control}
            name="organizer_phone"
            label="Telepon Penyelenggara"
            placeholder="Contoh: +1234567890"
            keyboardType="phone-pad"
            rules={{
              pattern: {
                value: /^\+1\d{10,}$/,
                message:
                  'Nomor telepon harus diawali dengan +1 dan minimal 10 angka',
              },
            }}
            error={errors.organizer_phone?.message}
            isDisabled={updateMutation.isPending}
          />

          {/* Image Selection Component */}
          <ImageSelectionManager
            selectedImages={enhancedImages}
            onImagesChange={setEnhancedImages}
            existingImages={existingImages}
            onExistingImagesChange={setExistingImages}
            imagesToDelete={imagesToDelete}
            onImagesToDeleteChange={setImagesToDelete}
            maxImages={5}
            isDisabled={updateMutation.isPending}
            label="Gambar Event (Maks. 5) *"
            showExistingImagesLabel="Gambar Tersimpan"
            addNewImagesLabel="Tambah Gambar Baru"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              updateMutation.isPending && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={
              !updateMutation.isPending ? handleSubmit(onSubmit) : undefined
            }
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  scrollContentContainer: {paddingBottom: 40},
  formContainer: {padding: 20},
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.primaryDisabled,
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default EventUpdateScreen;
