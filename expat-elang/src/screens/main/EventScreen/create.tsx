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
      type: asset.type || 'image/jpeg', // Default ke jpeg jika type tidak ada
      name: asset.fileName || `event_image_${Date.now()}_${index}.jpg`, // Generate nama file jika tidak ada
    }));

    const payload: CreateEventPayload = {
      ...data,
      // Pastikan format number/string sesuai API (jika perlu konversi)
      max_capacity: String(data.max_capacity), // Contoh: pastikan string
      images: imagePayload.length > 0 ? imagePayload : undefined, // Sertakan hanya jika ada gambar
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

          {/* Event Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul Event *</Text>
            <Controller
              control={control}
              name="event_title"
              rules={{required: 'Judul event harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Workshop React Native Advanced"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
              name="category"
              rules={{required: 'Kategori harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={[
                    styles.dropdownPlaceholder,
                    mutation.isPending && styles.disabledInput,
                  ]}
                  data={categories as EventCategoryApi[]}
                  labelField="name"
                  valueField="id"
                  placeholder="Pilih Kategori"
                  value={value || null}
                  onChange={item => onChange(item.id)}
                  onBlur={onBlur}
                  disable={mutation.isPending}
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
                  style={[styles.input, styles.textArea]}
                  placeholder="Jelaskan detail event, agenda, target peserta, dll."
                  placeholderTextColor={COLORS.greyDark}
                  multiline={true}
                  textAlignVertical="top"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    onPress={() =>
                      !mutation.isPending && setOpenStartDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={mutation.isPending}>
                    <Text style={styles.dropdownText}>
                      {value
                        ? format(parseISO(value), 'dd MMM yyyy, HH:mm') // Format tampilan
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
                    date={startDate}
                    minimumDate={new Date()} // Minimal hari ini
                    onConfirm={_date => {
                      setOpenStartDatePicker(false);
                      setStartDate(_date);
                      onChange(formatDateTimeForAPI(_date)); // Simpan format API
                      // Jika tanggal akhir lebih kecil, set sama dengan tanggal mulai
                      if (watchedEndDate && _date > parseISO(watchedEndDate)) {
                        setEndDate(_date);
                        setValue('event_end', formatDateTimeForAPI(_date));
                      }
                    }}
                    onCancel={() => setOpenStartDatePicker(false)}
                    title="Pilih Waktu Mulai" // Judul modal
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
                  } // Lewati jika salah satu kosong
                  return (
                    parseISO(value) >= parseISO(watchedStartDate) ||
                    'Waktu selesai tidak boleh sebelum waktu mulai'
                  );
                },
              }}
              render={({field: {onChange, value}}) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownPlaceholder,
                      mutation.isPending && styles.disabledInput,
                      !watchedStartDate && styles.disabledInput,
                    ]} // Disable jika start date belum dipilih
                    onPress={() =>
                      !mutation.isPending &&
                      watchedStartDate &&
                      setOpenEndDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={mutation.isPending || !watchedStartDate}>
                    <Text style={styles.dropdownText}>
                      {value
                        ? format(parseISO(value), 'dd MMM yyyy, HH:mm') // Format tampilan
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
                    date={endDate} // Gunakan state endDate
                    minimumDate={startDate} // Minimal sama dengan tanggal mulai
                    onConfirm={_date => {
                      setOpenEndDatePicker(false);
                      setEndDate(_date);
                      onChange(formatDateTimeForAPI(_date)); // Simpan format API
                    }}
                    onCancel={() => setOpenEndDatePicker(false)}
                    title="Pilih Waktu Selesai" // Judul modal
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
                  style={styles.input}
                  placeholder="Contoh: Gedung Serbaguna ABC, Jl. Merdeka No. 10"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.location?.message} />
          </View>

          {/* Max Capacity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kapasitas Maksimal *</Text>
            <Controller
              control={control}
              name="max_capacity"
              rules={{
                required: 'Kapasitas maksimal harus diisi',
                pattern: {
                  value: /^[1-9]\d*$/, // Hanya angka positif > 0
                  message: 'Kapasitas harus berupa angka positif',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 100"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  data={prices as EventPriceOption[]} // Asumsikan prices adalah array {label, value}
                  labelField="name"
                  valueField="id"
                  placeholder="Pilih Harga (Gratis/Berbayar)"
                  value={value || null}
                  onChange={item => onChange(item.id)}
                  onBlur={onBlur}
                  disable={mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.price?.message} />
          </View>

          {/* Organizer Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Penyelenggara *</Text>
            <Controller
              control={control}
              name="organizer_name"
              rules={{required: 'Nama penyelenggara harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Komunitas Developer XYZ"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_name?.message} />
          </View>

          {/* Organizer Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Penyelenggara *</Text>
            <Controller
              control={control}
              name="organizer_email"
              rules={{
                required: 'Email penyelenggara harus diisi',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Format email tidak valid',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: contact@komunitasxyz.org"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_email?.message} />
          </View>

          {/* Organizer Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telepon Penyelenggara *</Text>
            <Controller
              control={control}
              name="organizer_phone"
              rules={{
                required: 'Telepon penyelenggara harus diisi',
                pattern: {
                  // diawali dengan +628
                  value: /^\+628/,
                  message: 'Format nomor telepon tidak valid',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: +6281234567890"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.organizer_phone?.message} />
          </View>

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gambar Event (Maks. 5)</Text>
            <View style={styles.imageContainer}>
              {selectedImages.map((asset, index) => (
                <View key={asset.uri || index} style={styles.imageWrapper}>
                  <Image
                    source={{uri: asset.uri}}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => !mutation.isPending && removeImage(index)}
                    disabled={mutation.isPending}
                    activeOpacity={0.7}>
                    <Icon name="close-circle" size={24} color={COLORS.red} />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < 5 && (
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    mutation.isPending && styles.disabledInput,
                  ]}
                  onPress={handleImagePick}
                  disabled={mutation.isPending}
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
            {/* Tidak ada ErrorLabel khusus untuk gambar via RHF, handle validasi di onSubmit jika perlu */}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              mutation.isPending && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}>
            {mutation.isPending ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Buat Event</Text>
            )}
          </TouchableOpacity>
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
});

export default EventsCreateScreen;
