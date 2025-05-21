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
  ActivityIndicator,
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
import Icon from '@react-native-vector-icons/ionicons';
import {format, parseISO, isValid} from 'date-fns'; // Import isValid

// --- Import Konstanta, Tipe, Hook, Komponen Kustom ---
import COLORS from '../../../constants/colors';
import {RootStackParamList} from '../../../navigation/types';
import ErrorLabel from '../../../components/common/ErrorLabel';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {
  EventCategoryApi,
  EventPriceOption,
  UpdateEventPayload,
  EventItemApi,
  EventImageFeature,
} from '../../../types/event';
import {
  useEventAllOptions,
  useEventDetailUnprocessedQuery,
  useEventUpdateMutation,
} from '../../../hooks/useEventQuery';
import {capitalizeFirstChar} from '../../../utils/helpers';

// --- Props Komponen ---
interface EventUpdateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'EventUpdate'> {}

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
  const [existingImages, setExistingImages] = useState<EventImageFeature[]>([]); // Gambar dari API
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // ID gambar yg akan dihapus
  const [newSelectedImages, setNewSelectedImages] = useState<Asset[]>([]); // Gambar baru yg dipilih user
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  // State untuk date picker (diinisialisasi nanti di useEffect)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // --- React Hook Form ---
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset, // Gunakan reset untuk mengisi form
    formState: {errors, isDirty}, // isDirty bisa digunakan untuk enable/disable tombol save
  } = useForm<UpdateEventPayload>();

  // Watch tanggal untuk validasi
  const watchedStartDate = watch('event_start');
  const watchedEndDate = watch('event_end');

  // --- Efek Samping untuk Mengisi Form Saat Data Detail Tersedia ---
  useEffect(() => {
    if (eventData) {
      console.log('Event data received:', eventData);
      // Fungsi untuk memformat data dari API ke format form
      const formatDataForForm = (data: EventItemApi): UpdateEventPayload => {
        const parsedStartDate = parseISO(data.event_start);
        const parsedEndDate = parseISO(data.event_end);

        // Set state date picker
        if (isValid(parsedStartDate)) {
          setStartDate(parsedStartDate);
        }
        if (isValid(parsedEndDate)) {
          setEndDate(parsedEndDate);
        }

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
          organizer_phone: data?.organizer_phone
            ? `+1${data.organizer_phone}`
            : '',
        };
      };

      const formattedData = formatDataForForm(eventData.mainEvent);
      reset(formattedData);
      setExistingImages(eventData.mainEvent.images || []); // Set gambar yang sudah ada
      setImagesToDelete([]); // Reset daftar gambar yg akan dihapus
      setNewSelectedImages([]); // Reset daftar gambar baru
      console.log('Form reset with data:', formattedData);
      console.log('Existing images set:', eventData.mainEvent.images);
    }
  }, [eventData, reset]); // Jalankan hanya saat eventData berubah

  // --- Fungsi Handler ---

  const handleImagePick = async () => {
    const currentTotalImages =
      (existingImages?.length || 0) -
      imagesToDelete.length +
      newSelectedImages.length;
    if (currentTotalImages >= 5) {
      Alert.alert(
        'Batas Gambar',
        'Anda sudah mencapai batas maksimal 5 gambar.',
      );
      return;
    }

    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5 - currentTotalImages, // Batasi sesuai sisa slot
        quality: 0.7,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', 'Gagal memilih gambar: ' + result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const validAssets = result.assets.filter(asset => asset.uri);
        setNewSelectedImages(prev => [...prev, ...validAssets]);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  // Menghapus gambar BARU yang dipilih user (belum diupload)
  const removeNewImage = (index: number) => {
    setNewSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Menandai gambar LAMA untuk dihapus saat submit
  const markExistingImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

  // Membatalkan penghapusan gambar LAMA
  const unmarkExistingImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  };

  const formatDateTimeForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd HH:mm');
  };

  // Handler Submit Form Update
  const onSubmit: SubmitHandler<UpdateEventPayload> = async data => {
    console.log('Updating Event with Data:', data);
    console.log('New Images:', newSelectedImages);
    console.log('Images to Delete:', imagesToDelete);

    // Filter out images without URI and map to the correct type
    const imagesToUpload = newSelectedImages
      .filter(image => image.uri)
      .map((image, index) => ({
        uri: image.uri!,
        type: image.type || 'image/jpeg',
        name: image.fileName || `event_image_${Date.now()}_${index}.jpg`,
      }));

    const payload: UpdateEventPayload = {
      ...data,
      is_feature: newSelectedImages[0]?.fileName || undefined,
      file: imagesToUpload.length > 0 ? imagesToUpload : undefined,
      image_title:
        newSelectedImages.length > 0
          ? newSelectedImages.map((_, index) => `Image ${index + 1}`)
          : undefined,
      image_alt: 'Event image',
      max_capacity: data.max_capacity || undefined,
      organizer_name: data.organizer_name || undefined,
      organizer_email: data.organizer_email || undefined,
      organizer_phone: data.organizer_phone
        ? data.organizer_phone.replace('+1', '')
        : undefined,
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

  // --- Render Loading/Error State ---
  const isLoading = isLoadingOptions || isLoadingDetail;
  const error = optionsError || detailError;

  if (isLoading && !eventData) {
    // Tampilkan loading jika sedang fetch awal
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

  // Jika eventData belum ada setelah loading selesai (misal ID salah)
  if (!eventData) {
    return (
      <ErrorScreen
        placeholder={`Event dengan ID ${eventId} tidak ditemukan.`}
        error={new Error('Event not found')}
      />
    );
  }

  // --- Render Komponen Form ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Edit Event</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul Event *</Text>
            <Controller
              control={control}
              name="event_title"
              rules={{required: 'Judul event harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Workshop React Native Advanced"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.event_title?.message} />
          </View>
          {/* Category Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori Event *</Text>
            <Controller
              control={control}
              name="category" // Ini adalah ID kategori
              rules={{required: 'Kategori harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={[
                    styles.dropdownPlaceholder,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  data={categories as EventCategoryApi[]}
                  labelField="name"
                  valueField="id"
                  placeholder="Pilih Kategori"
                  value={value || null} // Value harus ID
                  onChange={item => onChange(item.id)} // Pastikan onChange mengirim ID
                  onBlur={onBlur}
                  disable={updateMutation.isPending || categories?.length === 0} // Disable jika loading atau tidak ada opsi
                />
              )}
            />
            <ErrorLabel error={errors.category?.message} />
          </View>
          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi Event *</Text>
            <Controller
              control={control}
              name="description"
              rules={{required: 'Deskripsi event harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Jelaskan detail event..."
                  placeholderTextColor={COLORS.greyDark}
                  multiline={true}
                  textAlignVertical="top"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.description?.message} />
          </View>
          {/* Event Start DateTime */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Waktu Mulai *</Text>
            <Controller
              control={control}
              name="event_start"
              rules={{required: 'Waktu mulai harus diisi'}}
              render={({field: {onChange, value}}) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownPlaceholder,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    onPress={() =>
                      !updateMutation.isPending && setOpenStartDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={updateMutation.isPending}>
                    <Text style={styles.dropdownText}>
                      {value
                        ? format(parseISO(value), 'dd MMM yyyy, HH:mm') // Format tampilan dari string form
                        : 'Pilih Tanggal & Waktu Mulai'}
                    </Text>
                    <Icon
                      name="calendar-outline"
                      size={20}
                      color={COLORS.greyDark}
                    />
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="datetime"
                    open={openStartDatePicker}
                    date={startDate} // Gunakan state date picker
                    // minimumDate={new Date()} // Pertimbangkan apakah user boleh edit ke tanggal lampau
                    onConfirm={_date => {
                      setOpenStartDatePicker(false);
                      setStartDate(_date);
                      const formattedApiDate = formatDateTimeForAPI(_date);
                      onChange(formattedApiDate); // Update form state
                      // Validasi end date
                      if (watchedEndDate && _date > parseISO(watchedEndDate)) {
                        setEndDate(_date);
                        setValue('event_end', formattedApiDate);
                      }
                    }}
                    onCancel={() => setOpenStartDatePicker(false)}
                    title="Pilih Waktu Mulai"
                    confirmText="Konfirmasi"
                    cancelText="Batal"
                  />
                </>
              )}
            />
            <ErrorLabel error={errors.event_start?.message} />
          </View>
          {/* Event End DateTime */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Waktu Selesai *</Text>
            <Controller
              control={control}
              name="event_end"
              rules={{
                required: 'Waktu selesai harus diisi',
                validate: value => {
                  if (!watchedStartDate || !value) {
                    return true;
                  }
                  // Pastikan parseISO valid sebelum membandingkan
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
              render={({field: {onChange, value}}) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownPlaceholder,
                      updateMutation.isPending && styles.disabledInput,
                      !watchedStartDate && styles.disabledInput,
                    ]}
                    onPress={() =>
                      !updateMutation.isPending &&
                      watchedStartDate &&
                      setOpenEndDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={updateMutation.isPending || !watchedStartDate}>
                    <Text style={styles.dropdownText}>
                      {value
                        ? format(parseISO(value), 'dd MMM yyyy, HH:mm') // Format tampilan dari string form
                        : 'Pilih Tanggal & Waktu Selesai'}
                    </Text>
                    <Icon
                      name="calendar-outline"
                      size={20}
                      color={COLORS.greyDark}
                    />
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="datetime"
                    open={openEndDatePicker}
                    date={endDate}
                    minimumDate={startDate} // Minimal sama dengan start date
                    onConfirm={_date => {
                      setOpenEndDatePicker(false);
                      setEndDate(_date);
                      onChange(formatDateTimeForAPI(_date)); // Update form state
                    }}
                    onCancel={() => setOpenEndDatePicker(false)}
                    title="Pilih Waktu Selesai"
                    confirmText="Konfirmasi"
                    cancelText="Batal"
                  />
                </>
              )}
            />
            <ErrorLabel error={errors.event_end?.message} />
          </View>
          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lokasi *</Text>
            <Controller
              control={control}
              name="location"
              rules={{required: 'Lokasi event harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Gedung Serbaguna ABC"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.location?.message} />
          </View>
          {/* Max Capacity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kapasitas Maksimal</Text>
            <Controller
              control={control}
              name="max_capacity"
              rules={{
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: 'Kapasitas harus berupa angka positif',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: 100"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="number-pad"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.max_capacity?.message} />
          </View>
          {/* Price Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Harga Tiket *</Text>
            <Controller
              control={control}
              name="price"
              rules={{required: 'Harga tiket harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={[
                    styles.dropdownPlaceholder,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  data={prices as EventPriceOption[]}
                  labelField="name"
                  valueField="id"
                  placeholder="Pilih Harga (Gratis/Berbayar)"
                  value={value || null}
                  onChange={item => onChange(item.id)}
                  onBlur={onBlur}
                  disable={updateMutation.isPending || prices?.length === 0}
                />
              )}
            />
            <ErrorLabel error={errors.price?.message} />
          </View>
          {/* Organizer Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Penyelenggara</Text>
            <Controller
              control={control}
              name="organizer_name"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Komunitas Developer XYZ"
                  placeholderTextColor={COLORS.greyDark}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_name?.message} />
          </View>
          {/* Organizer Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Penyelenggara</Text>
            <Controller
              control={control}
              name="organizer_email"
              rules={{
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Format email tidak valid',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: contact@komunitasxyz.org"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_email?.message} />
          </View>
          {/* Organizer Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telepon Penyelenggara</Text>
            <Controller
              control={control}
              name="organizer_phone"
              rules={{
                pattern: {
                  value: /^\+1\d{10,}$/,
                  message:
                    'Nomor telepon harus diawali dengan +1 dan minimal 10 angka',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: +1234567890"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="phone-pad"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_phone?.message} />
          </View>
          {/* Image Upload Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gambar Event (Maks. 5)</Text>
            <View style={styles.imageContainer}>
              {/* Render Existing Images */}
              {existingImages.map(image => {
                const isMarkedForDeletion = imagesToDelete.includes(image.id);
                return (
                  <View
                    key={image.id}
                    style={[
                      styles.imageWrapper,
                      isMarkedForDeletion && styles.imageMarkedForDeletion,
                    ]}>
                    <Image
                      source={{uri: image.img_url}}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() =>
                        isMarkedForDeletion
                          ? unmarkExistingImageForDeletion(image.id)
                          : markExistingImageForDeletion(image.id)
                      }
                      disabled={updateMutation.isPending}
                      activeOpacity={0.7}>
                      {/* Ganti ikon berdasarkan status */}
                      <Icon
                        name={
                          isMarkedForDeletion
                            ? 'refresh-circle'
                            : 'close-circle'
                        }
                        size={24}
                        color={
                          isMarkedForDeletion ? COLORS.greyDark : COLORS.red
                        }
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Render New Selected Images */}
              {newSelectedImages.map((asset, index) => (
                <View key={asset.uri || index} style={styles.imageWrapper}>
                  <Image
                    source={{uri: asset.uri}}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() =>
                      !updateMutation.isPending && removeNewImage(index)
                    }
                    disabled={updateMutation.isPending}
                    activeOpacity={0.7}>
                    <Icon name="close-circle" size={24} color={COLORS.red} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add Image Button (conditional based on total images) */}
              {(existingImages?.length || 0) -
                imagesToDelete.length +
                newSelectedImages.length <
                5 && (
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  onPress={handleImagePick}
                  disabled={updateMutation.isPending}
                  activeOpacity={0.7}>
                  <Icon
                    name="camera-outline"
                    size={30}
                    color={COLORS.primary}
                  />
                  <Text style={styles.addImageText}>Tambah Gambar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (updateMutation.isPending || !isDirty) &&
                styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={
              !updateMutation.isPending && isDirty
                ? handleSubmit(onSubmit)
                : undefined
            }
            disabled={updateMutation.isPending || !isDirty}>
            {updateMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text> // Teks Update
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
  inputGroup: {
    marginBottom: 20,
  },
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
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
    flex: 1,
    marginRight: 10,
  },
  disabledInput: {
    backgroundColor: COLORS.greyLight,
    opacity: 0.7,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 10,
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
  // Style tambahan untuk gambar yg ditandai akan dihapus
  imageMarkedForDeletion: {
    opacity: 0.5, // Buat agak transparan
    borderWidth: 2,
    borderColor: COLORS.red, // Beri border merah
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow kecil agar lebih terlihat
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    backgroundColor: COLORS.white,
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
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.primaryDisabled, // Gunakan warna disable
    opacity: 0.6, // Reduksi opacity saat disable
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default EventUpdateScreen;
