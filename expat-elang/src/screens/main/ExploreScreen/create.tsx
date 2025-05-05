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

import COLORS from '../../../constants/colors';
import {RootStackParamList} from '../../../navigation/types';
import ErrorLabel from '../../../components/common/ErrorLabel';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {useAllRentalOptions} from '../../../hooks/useRentalOptionQuery';
import {CreateRentalFormData} from '../../../types/rental';
import {useRentalCreateMutation} from '../../../hooks/useRentalQuery';

interface RentalsCreateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'RentalCreate'> {}

const RentalsCreateScreen = ({navigation}: RentalsCreateScreenProps) => {
  const {
    isLoading: isLoadingOptions,
    type: typeOptions = [],
    paid: paidOptions = [],
    stayType: stayTypeOptions = [],
    typeDetails: typeDetailsOptions = [],
    typeDetails2: typeDetails2Options = [],
    error: optionsError,
  } = useAllRentalOptions();

  const mutation = useRentalCreateMutation();
  const {show, hide} = useLoadingOverlayStore();

  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
    trigger,
  } = useForm<CreateRentalFormData>({
    defaultValues: {
      kt_details: [],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'kt_details',
  });

  // Cari ID (value) untuk 'MAIN' dari opsi typeDetails
  const mainTypeId = useMemo(
    () =>
      typeDetailsOptions.find(opt => opt.label.toUpperCase() === 'MAIN')?.value,
    [typeDetailsOptions],
  );

  // Efek samping untuk set default value dropdown dan tanggal
  useEffect(() => {
    if (paidOptions.length > 0 && !watch('status_paid')) {
      setValue('status_paid', paidOptions[0].value);
    }
    if (typeOptions.length > 0 && !watch('type')) {
      setValue('type', typeOptions[0].value);
    }
    if (stayTypeOptions.length > 0 && !watch('stay_type')) {
      setValue('stay_type', stayTypeOptions[0].value);
    }
    if (!watch('availability')) {
      const todayFormatted = format(availabilityDate, 'yyyy-MM-dd');
      if (isValid(parseISO(todayFormatted))) {
        setValue('availability', todayFormatted);
      }
    }
    // Tambahkan satu item detail default jika belum ada & opsi sudah load
    if (!isLoadingOptions && fields.length === 0) {
      append({
        type_details: '',
        nama_details1: '',
        nama_details2: '',
        desc: '',
      });
    }
  }, [
    paidOptions,
    typeOptions,
    stayTypeOptions,
    setValue,
    watch,
    availabilityDate,
    fields.length,
    append,
    isLoadingOptions,
  ]);

  // Handler untuk memilih gambar
  const handleImagePick = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10 - selectedImages.length,
        quality: 0.7,
        includeBase64: false,
      });
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert('Error', 'Gagal memilih gambar: ' + result.errorMessage);
        return;
      }
      if (result.assets && result.assets.length > 0) {
        const validAssets = result.assets.filter(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...validAssets]);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  // Handler untuk menghapus gambar
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Format tanggal YYYY-MM-DD
  const formatSimpleDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Handler submit form
  const onSubmit: SubmitHandler<CreateRentalFormData> = async data => {
    console.log('Submitting Rental Payload:', JSON.stringify(data, null, 2));
    console.log('Submitting Images:', selectedImages.length);

    if (!data.kt_details || data.kt_details.length === 0) {
      Alert.alert(
        'Error',
        'Harap tambahkan setidaknya satu detail fasilitas/ruangan.',
      );
      return;
    }

    show(); // Tampilkan loading overlay
    try {
      await mutation.mutateAsync({formData: data, images: selectedImages});
      Alert.alert('Sukses', 'Rental berhasil dibuat', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || e?.message || 'Gagal membuat rental.';
      Alert.alert('Error', errorMessage);
    } finally {
      hide(); // Sembunyikan loading overlay
    }
  };

  // Tampilkan loading jika opsi masih dimuat dan belum ada field detail
  if (isLoadingOptions && fields.length === 0) {
    return <LoadingScreen text="Memuat opsi..." />;
  }

  // Tampilkan error jika gagal memuat opsi
  if (optionsError) {
    return (
      <ErrorScreen error={optionsError} placeholder="Gagal memuat data opsi" />
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
          <Text style={styles.screenTitle}>Buat Rental Baru</Text>

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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Kost Eksklusif Mawar"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  data={paidOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Status (Gratis/Berbayar)"
                  value={value || null}
                  onChange={item => onChange(item.value)}
                  onBlur={onBlur}
                  disable={mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  data={typeOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Tipe (Room/Apartment/House)"
                  value={value || null}
                  onChange={item => onChange(item.value)}
                  onBlur={onBlur}
                  disable={mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Jl. Contoh No. 123, Kelurahan..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: Blok C, Lantai 2"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Contoh: Jakarta Pusat"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Contoh: DKI Jakarta"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!mutation.isPending}
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
                  pattern: {
                    value: /^\d{5}$/,
                    message: 'Kode pos harus 5 digit angka',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="12345"
                    keyboardType="number-pad"
                    maxLength={5}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!mutation.isPending}
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
                    mutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Jelaskan fasilitas, kondisi, lingkungan sekitar, dll."
                  multiline
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    onPress={() =>
                      !mutation.isPending && setOpenDatePicker(true)
                    }
                    activeOpacity={0.7}
                    disabled={mutation.isPending}>
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
                    minimumDate={new Date()}
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
                <TextInput
                  style={[
                    styles.input,
                    mutation.isPending && styles.disabledInput,
                  ]}
                  placeholder="Contoh: 500000"
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="1"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="12"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!mutation.isPending}
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
                      mutation.isPending && styles.disabledInput,
                    ]}
                    placeholder="Bulan/Tahun"
                    value={value || null}
                    onChange={item => onChange(item.value)}
                    onBlur={onBlur}
                    disable={mutation.isPending}
                  />
                )}
              />
              <ErrorLabel error={errors.stay_type?.message} />
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Detail Fasilitas / Ruangan</Text>
            {fields.map((field, index) => {
              const currentTypeDetailsId = watch(
                `kt_details.${index}.type_details`,
              );
              const isMainType =
                !!mainTypeId && currentTypeDetailsId === mainTypeId;

              return (
                <View key={field.id} style={styles.detailItemContainer}>
                  <View style={styles.detailItemHeader}>
                    <Text style={styles.detailItemIndex}>
                      Detail #{index + 1}
                    </Text>
                    {fields.length > 1 && (
                      <TouchableOpacity
                        onPress={() => !mutation.isPending && remove(index)}
                        disabled={mutation.isPending}
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
                            mutation.isPending && styles.disabledInput,
                          ]}
                          data={typeDetailsOptions}
                          labelField="label"
                          valueField="value"
                          placeholder="Pilih Tipe (Main/Features/etc)"
                          value={value || null}
                          onChange={item => {
                            onChange(item.value);
                            if (mainTypeId && item.value !== mainTypeId) {
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
                            } else if (item.value === mainTypeId) {
                              trigger(`kt_details.${index}.nama_details1`);
                              trigger(`kt_details.${index}.nama_details2`);
                            }
                          }}
                          onBlur={onBlur}
                          disable={mutation.isPending}
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
                        required: isMainType
                          ? 'Detail kuantitas harus diisi jika tipe MAIN'
                          : false,
                      }}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          style={[
                            styles.input,
                            mutation.isPending && styles.disabledInput,
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
                          editable={!mutation.isPending && isMainType}
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
                          required: isMainType
                            ? 'Detail unit/nama 2 harus dipilih jika tipe MAIN'
                            : false,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Dropdown
                            mode="modal"
                            style={[
                              styles.dropdownPlaceholder,
                              mutation.isPending && styles.disabledInput,
                            ]}
                            data={typeDetails2Options}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Unit (Bathroom/etc)"
                            value={value || null}
                            onChange={item => onChange(item.value)}
                            onBlur={onBlur}
                            disable={mutation.isPending}
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
                            value={value ?? ''}
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
                            mutation.isPending && styles.disabledInput,
                          ]}
                          placeholder="Contoh: AC, Wifi, Lemari (jika tipe FEATURES)"
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          editable={!mutation.isPending}
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
                mutation.isPending && styles.disabledInput,
              ]}
              onPress={() =>
                !mutation.isPending &&
                append({
                  type_details: '',
                  nama_details1: '',
                  nama_details2: '',
                  desc: '',
                })
              }
              disabled={mutation.isPending}>
              <Icon
                name="add-circle-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.addDetailButtonText}>Tambah Detail</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gambar Properti (Maks. 10)</Text>
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
              {selectedImages.length < 10 && (
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
          </View>

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
              <Text style={styles.submitButtonText}>Buat Rental</Text>
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

export default RentalsCreateScreen;
