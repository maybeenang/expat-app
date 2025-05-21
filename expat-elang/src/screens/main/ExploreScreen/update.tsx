import React, {useEffect, useMemo, useState} from 'react';
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
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import Icon from '@react-native-vector-icons/ionicons';
import {format, parseISO, isValid} from 'date-fns';

// --- Imports ---
import COLORS from '../../../constants/colors';
import {RootStackParamList} from '../../../navigation/types';
import ErrorLabel from '../../../components/common/ErrorLabel';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {useAllRentalOptions} from '../../../hooks/useRentalOptionQuery'; // Your options hook
import {
  useRentalDetailUnprocessedQuery,
  useRentalUpdateMutation, // Your detail query hook
} from '../../../hooks/useRentalQuery'; // Your rental query hooks
import {UpdateRentalFormData} from '../../../types/rental';
import FormPriceInput from '../../../components/common/FormPriceInput';

// --- Props ---
interface RentalsUpdateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'RentalUpdate'> {} // Adjust route name if needed

// --- Helper Type for API Images (combining feature and lists) ---
interface RentalImageApiSource {
  id: string;
  url: string;
}

const RentalsUpdateScreen = ({navigation, route}: RentalsUpdateScreenProps) => {
  const {rentalId} = route.params;

  // --- Data Fetching & Mutation Hooks ---
  const {
    data: rentalData,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useRentalDetailUnprocessedQuery(rentalId);

  const {
    isLoading: isLoadingOptions,
    type: typeOptions = [],
    paid: paidOptions = [],
    stayType: stayTypeOptions = [],
    typeDetails: typeDetailsOptions = [],
    typeDetails2: typeDetails2Options = [],
    error: optionsError,
  } = useAllRentalOptions();

  const updateMutation = useRentalUpdateMutation();
  const {show, hide} = useLoadingOverlayStore();

  // --- Local UI State ---
  const [existingImages, setExistingImages] = useState<RentalImageApiSource[]>(
    [],
  ); // Use helper type
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newSelectedImages, setNewSelectedImages] = useState<Asset[]>([]);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors, isDirty},
    trigger,
  } = useForm<UpdateRentalFormData>();

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: 'kt_details',
  });

  // Find the 'value' (ID) corresponding to the 'MAIN' label
  const mainTypeValue = useMemo(
    () =>
      typeDetailsOptions.find(opt => opt.label.toUpperCase() === 'MAIN')?.value,
    [typeDetailsOptions],
  );

  useEffect(() => {
    console.log(newSelectedImages.length);
  }, [newSelectedImages]);

  // --- Form Population Effect ---
  useEffect(() => {
    // Proceed only when detail data AND options are loaded
    if (rentalData && !isLoadingOptions) {
      // --- Combine all detail types from API into one array for the form ---
      const combinedApiDetails = [
        ...(rentalData.details_main || []),
        ...(rentalData.details_feature || []),
        ...(rentalData.details_in_room || []),
        ...(rentalData.details_shared_common || []),
        ...(rentalData.details_house_rules || []),
      ];

      // --- Map combined API details to the form's kt_details structure ---
      const formattedKtDetails = combinedApiDetails.map(detail => {
        const typeDetailOption = typeDetailsOptions.find(
          opt => opt.value.toUpperCase() === detail.tipe?.toUpperCase(),
        );
        const isMainApiType = detail.tipe?.toUpperCase() === 'MAIN';
        const namaDetails2Option = isMainApiType
          ? typeDetails2Options.find(opt => opt.label === detail.nama_details2) // Match by label from API
          : null;

        return {
          id: detail.id || null, // Use ID from API
          type_details: typeDetailOption?.value || '', // Use the found 'value' (ID)
          nama_details1: detail.nama_details1 ?? '',
          nama_details2:
            namaDetails2Option?.value ??
            (isMainApiType ? '' : detail.nama_details2 ?? ''), // Use found 'value' or original string if not MAIN/found
          desc: detail.desc ?? '',
        };
      });

      // --- Format other fields for the form ---
      const parsedAvailability = parseISO(rentalData.rent_availability);
      if (isValid(parsedAvailability)) {
        setAvailabilityDate(parsedAvailability);
      }

      // Find option values based on API strings (case-insensitive for safety)
      const statusPaidValue = paidOptions.find(
        opt =>
          opt.label.toUpperCase() === rentalData.is_paid_display?.toUpperCase(),
      )?.value;
      const typeValue = typeOptions.find(
        opt =>
          opt.label.toUpperCase() ===
          mapRentalTypeToLabel(rentalData.type).toUpperCase(),
      )?.value;
      const stayTypeValue = stayTypeOptions.find(
        opt =>
          opt.label.toUpperCase() ===
          rentalData.rent_stay_min_type?.toUpperCase(),
      )?.value; // Assuming min/max/price type are the same

      // --- Prepare data for reset ---
      const formDataToReset: UpdateRentalFormData = {
        id: rentalData.id,
        rent_slug: rentalData.rent_slug,
        title: rentalData.rent_title,
        status_paid: statusPaidValue || '', // Use found value or fallback
        type: typeValue || '', // Use found value or fallback
        address: rentalData.rent_address,
        address2: rentalData.rent_address2 ?? '',
        city: rentalData.rent_city,
        state: rentalData.rent_state,
        zip: rentalData.rent_zip,
        description: rentalData.rent_descriptions,
        availability: isValid(parsedAvailability)
          ? format(parsedAvailability, 'yyyy-MM-dd')
          : '',
        price: rentalData.rent_price_number ?? '', // Already a string in API
        stay_min: rentalData.rent_stay_min_number ?? '',
        stay_max: rentalData.rent_stay_max_number ?? '',
        stay_type: stayTypeValue || '', // Use found value or fallback
        kt_details: formattedKtDetails,
      };

      reset(formDataToReset); // Reset the entire form

      // --- Handle Images ---
      const apiImages: RentalImageApiSource[] = [];
      if (rentalData.image_feature) {
        apiImages.push({
          id: rentalData.image_feature.id,
          url: rentalData.image_feature.img_url,
        });
      }
      (rentalData.image_lists || []).forEach((img: any) => {
        // Avoid adding duplicates if feature image is also in lists
        if (
          img &&
          img.id &&
          img.img_url &&
          !apiImages.some(existing => existing.id === img.id)
        ) {
          apiImages.push({id: img.id, url: img.img_url});
        }
      });
      setExistingImages(apiImages);
      setImagesToDelete([]);
      setNewSelectedImages([]);

      if (formattedKtDetails.length > 0) {
        replace(formattedKtDetails);
      } else if (fields.length > 0) {
        replace([]);
      }
    } else if (!isLoadingDetail && !isLoadingOptions && fields.length === 0) {
      // If loading is finished, data is null/empty, and form is empty, add one default
      append({
        type_details: '',
        nama_details1: '',
        nama_details2: '',
        desc: '',
      });
    }
  }, [
    rentalData,
    isLoadingOptions,
    isLoadingDetail,
    reset,
    setValue,
    replace,
    append,
    fields.length,
    paidOptions,
    typeOptions,
    stayTypeOptions,
    typeDetailsOptions,
    typeDetails2Options,
  ]);

  // --- Event Handlers (Image Pick, Remove, Submit) ---
  const handleImagePick = async () => {
    const currentTotalImages =
      (existingImages?.length || 0) -
      imagesToDelete.length +
      newSelectedImages.length;
    if (currentTotalImages >= 10) {
      Alert.alert('Batas Gambar', 'Maksimal 10 gambar.');
      return;
    }
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10 - currentTotalImages,
        quality: 0.7,
        includeBase64: false,
      });
      if (result.didCancel || result.errorCode || !result.assets) {
        if (result.errorCode) {
          Alert.alert('Error', result.errorMessage || 'Gagal memilih gambar');
        }
        return;
      }
      const validAssets = result.assets.filter(asset => asset.uri);
      setNewSelectedImages(prev => [...prev, ...validAssets]);
    } catch (error) {
      Alert.alert('Error', 'Gagal membuka galeri.');
    }
  };

  const removeNewImage = (index: number) =>
    setNewSelectedImages(prev => prev.filter((_, i) => i !== index));
  const markExistingImageForDeletion = (imageId: string) =>
    setImagesToDelete(prev => [...prev, imageId]);
  const unmarkExistingImageForDeletion = (imageId: string) =>
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  const formatSimpleDateForAPI = (date: Date): string =>
    format(date, 'yyyy-MM-dd');

  const onSubmit: SubmitHandler<UpdateRentalFormData> = async data => {
    if (!data.kt_details || data.kt_details.length === 0) {
      Alert.alert('Error', 'Harap tambahkan minimal satu detail.');
      return;
    }

    console.log(newSelectedImages);

    data.images = newSelectedImages;

    console.log(data);

    show();
    try {
      await updateMutation.mutateAsync(data);
      Alert.alert('Sukses', 'Rental berhasil diperbarui', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || e?.message || 'Gagal memperbarui rental.';
      Alert.alert('Error', errorMessage);
    } finally {
      hide();
    }
  };

  // --- Loading & Error Rendering ---
  if (isLoadingOptions || (isLoadingDetail && !rentalData)) {
    return <LoadingScreen text="Memuat data rental..." />;
  }
  if (detailError && !rentalData) {
    return (
      <ErrorScreen
        error={detailError}
        placeholder="Gagal memuat detail rental"
      />
    );
  }
  if (!rentalData) {
    return (
      <ErrorScreen
        placeholder={`Rental dengan ID ${rentalId} tidak ditemukan.`}
        error={new Error('Rental not found')}
      />
    );
  }
  if (optionsError) {
    return (
      <ErrorScreen error={optionsError} placeholder="Gagal memuat opsi form" />
    );
  } // Handle options error after detail check

  // --- Main Form Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Edit Rental</Text>

          {/* --- Standard Fields --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul/Nama Properti *</Text>
            <Controller
              control={control}
              name="title"
              rules={{required: 'Judul properti harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Kost Eksklusif Mawar"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.title?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status Pembayaran *</Text>
            <Controller
              control={control}
              name="status_paid"
              rules={{required: 'Status pembayaran harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={[
                    styles.dropdownPlaceholder,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  data={paidOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Status"
                  value={value || null}
                  onChange={item => onChange(item.value)}
                  onBlur={onBlur}
                  disable={updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.status_paid?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipe Properti *</Text>
            <Controller
              control={control}
              name="type"
              rules={{required: 'Tipe properti harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={[
                    styles.dropdownPlaceholder,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  data={typeOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Tipe"
                  value={value || null}
                  onChange={item => onChange(item.value)}
                  onBlur={onBlur}
                  disable={updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.type?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Lengkap *</Text>
            <Controller
              control={control}
              name="address"
              rules={{required: 'Alamat harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Jl. Contoh No. 123..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
            <ErrorLabel error={errors.address?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Tambahan (Opsional)</Text>
            <Controller
              control={control}
              name="address2"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Blok C"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!updateMutation.isPending}
                />
              )}
            />
          </View>
          <View style={styles.addressRow}>
            <View style={[styles.inputGroup, styles.addressCity]}>
              <Text style={styles.label}>Kota *</Text>
              <Controller
                control={control}
                name="city"
                rules={{required: 'Kota harus diisi'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Kota"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.city?.message} />
            </View>
            <View style={[styles.inputGroup, styles.addressState]}>
              <Text style={styles.label}>Provinsi *</Text>
              <Controller
                control={control}
                name="state"
                rules={{required: 'Provinsi harus diisi'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Provinsi"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.state?.message} />
            </View>
            <View style={[styles.inputGroup, styles.addressZip]}>
              <Text style={styles.label}>Kode Pos *</Text>
              <Controller
                control={control}
                name="zip"
                rules={{
                  required: 'Kode pos harus diisi',
                  pattern: {value: /^\d{5}$/, message: 'Kode pos 5 digit'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="12345"
                    keyboardType="number-pad"
                    maxLength={5}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.zip?.message} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi Properti *</Text>
            <Controller
              control={control}
              name="description"
              rules={{required: 'Deskripsi properti harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    updateMutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Jelaskan fasilitas..."
                  multiline
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tersedia Mulai Tanggal *</Text>
            <Controller
              control={control}
              name="availability"
              rules={{required: 'Tanggal ketersediaan harus diisi'}}
              render={({field: {onChange, value}}) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownPlaceholder,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    onPress={() =>
                      !updateMutation.isPending && setOpenDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={updateMutation.isPending}>
                    <Text style={styles.dropdownText}>
                      {value && isValid(parseISO(value))
                        ? format(parseISO(value), 'dd MMM yyyy')
                        : 'Pilih Tanggal'}
                    </Text>
                    <Icon
                      name="calendar-outline"
                      size={20}
                      color={COLORS.greyDark}
                    />
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="date"
                    open={openDatePicker}
                    date={availabilityDate}
                    onConfirm={_date => {
                      setOpenDatePicker(false);
                      setAvailabilityDate(_date);
                      onChange(formatSimpleDateForAPI(_date));
                    }}
                    onCancel={() => setOpenDatePicker(false)}
                    title="Pilih Tanggal Tersedia"
                    confirmText="Konfirmasi"
                    cancelText="Batal"
                  />
                </>
              )}
            />
            <ErrorLabel error={errors.availability?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Harga Sewa (per satuan waktu) *</Text>
            <Controller
              control={control}
              name="price"
              rules={{
                required: 'Harga sewa harus diisi',
                pattern: {value: /^\d+$/, message: 'Harga harus angka'},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <FormPriceInput
                  control={control}
                  name="price"
                  label=""
                  rules={{
                    required: 'Harga sewa harus diisi',
                    pattern: {value: /^\d+$/, message: 'Harga harus angka'},
                  }}
                  error={errors.price?.message}
                  isDisabled={updateMutation.isPending}
                  placeholder="500000"
                />
              )}
            />
            <ErrorLabel error={errors.price?.message} />
          </View>
          <View style={styles.stayRow}>
            <View style={[styles.inputGroup, styles.stayDuration]}>
              <Text style={styles.label}>Min. Sewa *</Text>
              <Controller
                control={control}
                name="stay_min"
                rules={{
                  required: 'Min. sewa harus diisi',
                  pattern: {value: /^[1-9]\d*$/, message: 'Harus angka > 0'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="1"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.stay_min?.message} />
            </View>
            <View style={[styles.inputGroup, styles.stayDuration]}>
              <Text style={styles.label}>Maks. Sewa *</Text>
              <Controller
                control={control}
                name="stay_max"
                rules={{
                  required: 'Maks. sewa harus diisi',
                  pattern: {value: /^[1-9]\d*$/, message: 'Harus angka > 0'},
                  validate: val =>
                    parseInt(val || '0') >=
                      parseInt(watch('stay_min') || '0') ||
                    'Maksimal < minimal',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="12"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.stay_max?.message} />
            </View>
            <View style={[styles.inputGroup, styles.stayType]}>
              <Text style={styles.label}>Satuan *</Text>
              <Controller
                control={control}
                name="stay_type"
                rules={{required: 'Satuan waktu sewa harus dipilih'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <Dropdown
                    mode="modal"
                    data={stayTypeOptions}
                    labelField="label"
                    valueField="value"
                    style={[
                      styles.dropdownPlaceholder,
                      updateMutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Bulan/Tahun"
                    value={value || null}
                    onChange={item => onChange(item.value)}
                    onBlur={onBlur}
                    disable={updateMutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.stay_type?.message} />
            </View>
          </View>

          {/* --- KT Details Section --- */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Detail Fasilitas / Ruangan</Text>
            {fields.map((field, index) => {
              const currentTypeDetailsId = watch(
                `kt_details.${index}.type_details`,
              );
              const isMainType =
                !!mainTypeValue && currentTypeDetailsId === mainTypeValue; // Use mainTypeValue
              return (
                <View key={field.id} style={styles.detailItemContainer}>
                  <View style={styles.detailItemHeader}>
                    <Text style={styles.detailItemIndex}>
                      Detail #{index + 1}
                    </Text>
                    {fields.length > 1 && (
                      <TouchableOpacity
                        onPress={() =>
                          !updateMutation.isPending && remove(index)
                        }
                        disabled={updateMutation.isPending}
                        style={styles.removeDetailButton}>
                        <Icon
                          name="trash-outline"
                          size={20}
                          color={COLORS.red}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tipe Detail *</Text>
                    <Controller
                      control={control}
                      name={`kt_details.${index}.type_details`}
                      rules={{required: 'Tipe detail harus dipilih'}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <Dropdown
                          mode="modal"
                          style={[
                            styles.dropdownPlaceholder,
                            updateMutation.isPending && styles.disabledInput,
                          ]}
                          data={typeDetailsOptions}
                          labelField="label"
                          valueField="value"
                          placeholder="Pilih Tipe"
                          value={value || null}
                          onChange={item => {
                            onChange(item.value);
                            if (mainTypeValue && item.value !== mainTypeValue) {
                              setValue(
                                `kt_details.${index}.nama_details1`,
                                '',
                                {shouldValidate: true},
                              );
                              setValue(
                                `kt_details.${index}.nama_details2`,
                                '',
                                {shouldValidate: true},
                              );
                            } else if (item.value === mainTypeValue) {
                              trigger(`kt_details.${index}.nama_details1`);
                              trigger(`kt_details.${index}.nama_details2`);
                            }
                          }}
                          onBlur={onBlur}
                          disable={updateMutation.isPending}
                        />
                      )}
                    />
                    <ErrorLabel
                      error={errors.kt_details?.[index]?.type_details?.message}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Detail Kuantitas/Nama 1</Text>
                    <Controller
                      control={control}
                      name={`kt_details.${index}.nama_details1`}
                      rules={{
                        required: isMainType ? 'Kuantitas harus diisi' : false,
                      }}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          style={[
                            styles.input,
                            updateMutation.isPending && styles.disabledInput,
                            !isMainType && styles.disabledInput,
                          ]}
                          placeholder={
                            isMainType
                              ? 'Contoh: 2'
                              : '(Hanya aktif jika tipe MAIN)'
                          }
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          editable={!updateMutation.isPending && isMainType}
                          keyboardType={isMainType ? 'number-pad' : 'default'}
                        />
                      )}
                    />
                    {isMainType && (
                      <ErrorLabel
                        error={
                          errors.kt_details?.[index]?.nama_details1?.message
                        }
                      />
                    )}
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Detail Unit/Nama 2</Text>
                    {isMainType ? (
                      <Controller
                        control={control}
                        name={`kt_details.${index}.nama_details2`}
                        rules={{
                          required: isMainType ? 'Unit harus dipilih' : false,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Dropdown
                            mode="modal"
                            style={[
                              styles.dropdownPlaceholder,
                              updateMutation.isPending && styles.disabledInput,
                            ]}
                            data={typeDetails2Options}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Unit"
                            value={value || null}
                            onChange={item => onChange(item.value)}
                            onBlur={onBlur}
                            disable={updateMutation.isPending}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`kt_details.${index}.nama_details2`}
                        render={({field: {value}}) => (
                          <TextInput
                            style={[styles.input, styles.disabledInput]}
                            placeholder="(Hanya aktif jika tipe MAIN)"
                            value={value as string}
                            editable={false}
                          />
                        )}
                      />
                    )}
                    {isMainType && (
                      <ErrorLabel
                        error={
                          errors.kt_details?.[index]?.nama_details2?.message
                        }
                      />
                    )}
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Deskripsi Detail</Text>
                    <Controller
                      control={control}
                      name={`kt_details.${index}.desc`}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          style={[
                            styles.input,
                            updateMutation.isPending && styles.disabledInput,
                          ]}
                          placeholder="Contoh: AC, Wifi, Lemari"
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          editable={!updateMutation.isPending}
                        />
                      )}
                    />
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              style={[
                styles.addDetailButton,
                updateMutation.isPending && styles.disabledInput,
              ]}
              onPress={() =>
                !updateMutation.isPending &&
                append({
                  type_details: '',
                  nama_details1: '',
                  nama_details2: '',
                  desc: '',
                })
              }
              disabled={updateMutation.isPending}>
              <Icon
                name="add-circle-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.addDetailButtonText}>Tambah Detail</Text>
            </TouchableOpacity>
          </View>

          {/* --- Image Upload Section --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gambar Properti (Maks. 10)</Text>
            <View style={styles.imageContainer}>
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
                      source={{uri: image.url}}
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
                      <Icon
                        name={
                          isMarkedForDeletion
                            ? 'refresh-circle'
                            : 'close-circle'
                        }
                        size={24}
                        color={
                          isMarkedForDeletion ? COLORS.greyLight : COLORS.red
                        }
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
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
              {(existingImages?.length || 0) -
                imagesToDelete.length +
                newSelectedImages.length <
                10 && (
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

          {/* --- Submit Button --- */}
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
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  scrollContentContainer: {paddingBottom: 50},
  formContainer: {padding: 20},
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {marginBottom: 20},
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
  textArea: {height: 100, paddingTop: 12},
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
  disabledInput: {backgroundColor: COLORS.greyLight, opacity: 0.7},
  addressRow: {flexDirection: 'row', marginHorizontal: -5, marginBottom: -10},
  addressCity: {flex: 3, paddingHorizontal: 5},
  addressState: {flex: 3, paddingHorizontal: 5},
  addressZip: {flex: 2, paddingHorizontal: 5},
  stayRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: -10,
    alignItems: 'flex-start',
  },
  stayDuration: {flex: 2, paddingHorizontal: 5},
  stayType: {flex: 3, paddingHorizontal: 5},
  detailsSection: {
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    paddingTop: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  detailItemContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: COLORS.greyLight,
  },
  detailItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  detailItemIndex: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
  },
  removeDetailButton: {padding: 5},
  addDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 5,
  },
  addDetailButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.primary,
    fontFamily: 'Roboto-Medium',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 10,
  },
  imageWrapper: {position: 'relative', width: 100, height: 100},
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  imageMarkedForDeletion: {
    opacity: 0.5,
    borderWidth: 2,
    borderColor: COLORS.red,
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
  submitButtonDisabled: {backgroundColor: COLORS.primaryDisabled, opacity: 0.6},
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

// Helper function (letakkan di scope yang sama atau impor)
const mapRentalTypeToLabel = (typeValue: string): string => {
  // Salin implementasi fungsi ini dari rentalService.ts
  switch (typeValue) {
    case 'SHARED-ROOM':
      return 'Shared Room';
    case 'ROOM':
      return 'Room';
    case 'UNIT':
      return 'Unit';
    case 'APARTMENT':
      return 'Apartment';
    case 'HOUSE':
      return 'House';
    case 'OFFICE-SPACE':
      return 'Office Space';
    case 'WAREHOUSE':
      return 'Warehouse';
    default:
      return typeValue;
  }
};

export default RentalsUpdateScreen;
