import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, useFieldArray} from 'react-hook-form';
import Icon from '@react-native-vector-icons/ionicons';

import COLORS from '../../../constants/colors';
import {RootStackParamList} from '../../../navigation/types';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {useAllRentalOptions} from '../../../hooks/useRentalOptionQuery';
import {CreateRentalFormData} from '../../../types/rental';
import {useRentalCreateMutation} from '../../../hooks/useRentalQuery';

// --- Reusable Components ---
import FormInput from '../../../components/common/FormInput';
import FormDropdown from '../../../components/common/FormDropdown';
import FormDatePicker from '../../../components/common/FormDatePicker';
import SubmitButton from '../../../components/common/SubmitButton';
import FormPriceInput from '../../../components/common/FormPriceInput';
import ImageSelectionManager, {
  EnhancedImageAsset,
  prepareImagesForSubmission,
} from '../../../components/common/ImageSelectionManager';

interface RentalsCreateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'RentalCreate'> {}

const RentalsCreateScreen = ({navigation}: RentalsCreateScreenProps) => {
  // --- Data Fetching & Mutation Hooks ---
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

  // --- Local UI State ---
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImageAsset[]>(
    [],
  );

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
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

  // --- Effects ---
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
      const today = new Date();
      setValue('availability', today.toISOString().split('T')[0]);
    }
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
    fields.length,
    append,
    isLoadingOptions,
  ]);

  // --- Form Handlers ---
  const onSubmit = async (data: CreateRentalFormData) => {
    if (!data.kt_details || data.kt_details.length === 0) {
      Alert.alert(
        'Error',
        'Harap tambahkan setidaknya satu detail fasilitas/ruangan.',
      );
      return;
    }

    if (enhancedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    // Check for feature image
    const hasFeatureImage = enhancedImages.some(img => img.isFeature);
    if (!hasFeatureImage) {
      Alert.alert('Error', 'Please select a feature image');
      return;
    }

    show();
    try {
      // Prepare images for submission
      const {featureImageId, imagesToUpload, imageInfo} =
        prepareImagesForSubmission(enhancedImages);

      await mutation.mutateAsync({
        ...data,
        images: imagesToUpload,
        is_feature: featureImageId,
        image_alt: imageInfo.titles,
        image_title: imageInfo.alts,
      });
      Alert.alert('Sukses', 'Rental berhasil dibuat', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || e?.message || 'Gagal membuat rental.';
      Alert.alert('Error', errorMessage);
    } finally {
      hide();
    }
  };

  // --- Loading & Error States ---
  if (isLoadingOptions) {
    return <LoadingScreen text="Memuat opsi..." />;
  }

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

          <FormInput
            control={control}
            name="title"
            label="Judul/Nama Properti *"
            rules={{required: 'Judul properti harus diisi'}}
            error={errors.title?.message}
            isDisabled={mutation.isPending}
            placeholder="Kost Eksklusif Mawar"
          />

          <FormDropdown
            control={control}
            name="status_paid"
            label="Status Pembayaran *"
            options={paidOptions}
            rules={{required: 'Status pembayaran harus dipilih'}}
            error={errors.status_paid?.message}
            isDisabled={mutation.isPending}
            placeholder="Pilih Status (Gratis/Berbayar)"
          />

          <FormDropdown
            control={control}
            name="type"
            label="Tipe Properti *"
            options={typeOptions}
            rules={{required: 'Tipe properti harus dipilih'}}
            error={errors.type?.message}
            isDisabled={mutation.isPending}
            placeholder="Pilih Tipe (Room/Apartment/House)"
          />

          <FormInput
            control={control}
            name="address"
            label="Alamat Lengkap *"
            rules={{required: 'Alamat harus diisi'}}
            error={errors.address?.message}
            isDisabled={mutation.isPending}
            placeholder="Jl. Contoh No. 123, Kelurahan..."
          />

          <FormInput
            control={control}
            name="address2"
            label="Alamat Tambahan (Opsional)"
            isDisabled={mutation.isPending}
            placeholder="Blok C, Lantai 2"
          />

          <View style={styles.addressRow}>
            <View style={[styles.inputGroup, styles.addressCity]}>
              <FormInput
                control={control}
                name="city"
                label="Kota *"
                rules={{required: 'Kota harus diisi'}}
                error={errors.city?.message}
                isDisabled={mutation.isPending}
                placeholder="Jakarta Pusat"
              />
            </View>
            <View style={[styles.inputGroup, styles.addressState]}>
              <FormInput
                control={control}
                name="state"
                label="Provinsi *"
                rules={{required: 'Provinsi harus diisi'}}
                error={errors.state?.message}
                isDisabled={mutation.isPending}
                placeholder="DKI Jakarta"
              />
            </View>
            <View style={[styles.inputGroup, styles.addressZip]}>
              <FormInput
                control={control}
                name="zip"
                label="Kode Pos *"
                rules={{
                  required: 'Kode pos harus diisi',
                  pattern: {
                    value: /^\d{5}$/,
                    message: 'Kode pos harus 5 digit angka',
                  },
                }}
                error={errors.zip?.message}
                isDisabled={mutation.isPending}
                placeholder="12345"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </View>

          <FormInput
            control={control}
            name="description"
            label="Deskripsi Properti *"
            rules={{required: 'Deskripsi properti harus diisi'}}
            error={errors.description?.message}
            isDisabled={mutation.isPending}
            placeholder="Jelaskan fasilitas, kondisi, lingkungan sekitar, dll."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
          />

          <FormDatePicker
            control={control}
            name="availability"
            label="Tersedia Mulai Tanggal *"
            rules={{required: 'Tanggal ketersediaan harus diisi'}}
            error={errors.availability?.message}
            isDisabled={mutation.isPending}
            placeholder="Pilih Tanggal"
            mode="date"
            minimumDate={new Date()}
          />

          <FormPriceInput
            control={control}
            name="price"
            label="Harga Sewa (per satuan waktu) *"
            rules={{
              required: 'Harga sewa harus diisi',
              pattern: {value: /^\d+$/, message: 'Harga harus angka'},
            }}
            error={errors.price?.message}
            isDisabled={mutation.isPending}
            placeholder="500000"
          />

          <View style={styles.stayRow}>
            <View style={[styles.inputGroup, styles.stayDuration]}>
              <FormInput
                control={control}
                name="stay_min"
                label="Min. Sewa *"
                rules={{
                  required: 'Min. sewa harus diisi',
                  pattern: {value: /^[1-9]\d*$/, message: 'Harus angka > 0'},
                }}
                error={errors.stay_min?.message}
                isDisabled={mutation.isPending}
                placeholder="2"
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.stayDuration]}>
              <FormInput
                control={control}
                name="stay_max"
                label="Maks. Sewa *"
                rules={{
                  required: 'Maks. sewa harus diisi',
                  pattern: {value: /^[1-9]\d*$/, message: 'Harus angka > 0'},
                  validate: (val: string) =>
                    parseInt(val || '0') >=
                      parseInt(watch('stay_min') || '0') ||
                    'Maksimal < minimal',
                }}
                error={errors.stay_max?.message}
                isDisabled={mutation.isPending}
                placeholder="12"
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.stayType]}>
              <FormDropdown
                control={control}
                name="stay_type"
                label="Satuan *"
                options={stayTypeOptions}
                rules={{required: 'Satuan waktu sewa harus dipilih'}}
                error={errors.stay_type?.message}
                isDisabled={mutation.isPending}
                placeholder="Bulan/Tahun"
              />
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

                  <FormDropdown
                    control={control}
                    name={`kt_details.${index}.type_details`}
                    label="Tipe Detail *"
                    options={typeDetailsOptions}
                    rules={{required: 'Tipe detail harus dipilih'}}
                    error={errors.kt_details?.[index]?.type_details?.message}
                    isDisabled={mutation.isPending}
                    placeholder="Pilih Tipe (Main/Features/etc)"
                  />

                  <FormInput
                    control={control}
                    name={`kt_details.${index}.nama_details1`}
                    label="Detail Kuantitas/Nama 1"
                    rules={{
                      required: isMainType
                        ? 'Detail kuantitas harus diisi jika tipe MAIN'
                        : false,
                    }}
                    error={errors.kt_details?.[index]?.nama_details1?.message}
                    isDisabled={mutation.isPending || !isMainType}
                    placeholder={
                      isMainType ? 'Contoh: 2' : '(Hanya aktif jika tipe MAIN)'
                    }
                    keyboardType={isMainType ? 'number-pad' : 'default'}
                  />

                  {isMainType ? (
                    <FormDropdown
                      control={control}
                      name={`kt_details.${index}.nama_details2`}
                      label="Detail Unit/Nama 2"
                      options={typeDetails2Options}
                      rules={{
                        required: isMainType
                          ? 'Detail unit/nama 2 harus dipilih jika tipe MAIN'
                          : false,
                      }}
                      error={errors.kt_details?.[index]?.nama_details2?.message}
                      isDisabled={mutation.isPending}
                      placeholder="Pilih Unit (Bathroom/etc)"
                    />
                  ) : (
                    <FormInput
                      control={control}
                      name={`kt_details.${index}.nama_details2`}
                      label="Detail Unit/Nama 2"
                      isDisabled={true}
                      placeholder="(Hanya aktif jika tipe MAIN)"
                    />
                  )}

                  <FormInput
                    control={control}
                    name={`kt_details.${index}.desc`}
                    label="Deskripsi Detail"
                    isDisabled={mutation.isPending}
                    placeholder="AC, Wifi, Lemari (jika tipe FEATURES)"
                  />
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

          <ImageSelectionManager
            selectedImages={enhancedImages}
            onImagesChange={setEnhancedImages}
            maxImages={10}
            isDisabled={mutation.isPending}
            label="Gambar Properti (Maks. 10)"
          />

          <SubmitButton
            onPress={handleSubmit(onSubmit)}
            isLoading={mutation.isPending}
            label="Buat Rental"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
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
  textArea: {
    height: 100,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
  },
  addressRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: -10,
  },
  addressCity: {
    flex: 3,
    paddingHorizontal: 5,
  },
  addressState: {
    flex: 3,
    paddingHorizontal: 5,
  },
  addressZip: {
    flex: 2,
    paddingHorizontal: 5,
  },
  stayRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: -10,
    alignItems: 'flex-start',
  },
  stayDuration: {
    flex: 2,
    paddingHorizontal: 5,
  },
  stayType: {
    flex: 3,
    paddingHorizontal: 5,
  },
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
  removeDetailButton: {
    padding: 5,
  },
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
  disabledInput: {
    opacity: 0.5,
  },
});

export default RentalsCreateScreen;
