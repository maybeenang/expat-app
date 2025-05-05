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
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import COLORS from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {useAllJobOptions} from '../../../hooks/useJobsOptionsQuery'; // Fetches dropdown options
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import type {UpdateJobPayload} from '../../../types/jobs'; // Payload type (might need adjustment for update) <<< ADJUST PATH
import DatePicker from 'react-native-date-picker';
import ErrorLabel from '../../../components/common/ErrorLabel';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {
  useJobDetailUnprocessedQuery,
  useUpdateJobMutation,
} from '../../../hooks/useJobsQuery';
import Icon from '@react-native-vector-icons/ionicons';

interface JobsUpdateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'JobUpdate'> {} // Use 'JobUpdate' route name

const JobUpdateScreen = ({navigation, route}: JobsUpdateScreenProps) => {
  const {jobId, categoryId} = route.params; // Get jobId from navigation parameters

  const {
    isLoading: isLoadingOptions,
    paidStatus: paidStatusOptions,
    companies: companyOptions,
    currencies: currencyOptions,
    error: errorOptions,
  } = useAllJobOptions();

  const {
    data: jobDetail, // This will be of type JobItemApi (raw API data)
    isLoading: isLoadingDetail,
    error: errorDetail,
    refetch: refetchDetail,
  } = useJobDetailUnprocessedQuery({
    jobId: jobId,
    categoryId: categoryId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<UpdateJobPayload>();

  // --- Placeholder for Update Mutation ---
  const updateMutation = useUpdateJobMutation();

  const {hide, show} = useLoadingOverlayStore();

  // --- State for Date Picker ---
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // --- Effect to Populate Form with Detail Data ---
  useEffect(() => {
    // Only reset form when detail data is available and options might be ready
    if (jobDetail) {
      console.log('Populating form with:', jobDetail);
      // Reset the form with fetched values
      reset({
        id: jobDetail.id, // API gives ID, RHF state needs ID
        jobs_slug: jobDetail.jobs_slug,
        jobs_title: jobDetail.jobs_judul,
        id_company: jobDetail.id_company, // API gives ID, RHF state needs ID
        status_paid: jobDetail.is_paid ?? '0', // Use '0' if is_paid is null
        jobs_desc: jobDetail.jobs_desc,
        salary_currency: jobDetail.salary_currency ?? 'Rp', // Default to Rp if null
        salary_range_start: jobDetail.salary_range_start ?? '',
        salary_range_end: jobDetail.salary_range_end ?? '',
        jobs_post_exp_date: jobDetail.jobs_post_exp_date
          ? jobDetail.jobs_post_exp_date.split(' ')[0] // Extract YYYY-MM-DD part
          : '',
        jobs_location_city: jobDetail.jobs_location_city,
        jobs_location_state: jobDetail.jobs_location_state,
        jobs_location_country: jobDetail.jobs_location_country,
        contact_info_phone: jobDetail.contact_info_phone ?? '',
        contact_info_email: jobDetail.contact_info_email ?? '',
        contact_info_web: jobDetail.contact_info_web ?? '',
      });

      // Set initial date for the picker if expiry date exists
      if (jobDetail.jobs_post_exp_date) {
        try {
          // Attempt to parse the date part only
          const datePart = jobDetail.jobs_post_exp_date.split(' ')[0];
          const parsedDate = new Date(datePart);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          }
        } catch (e) {
          console.error('Error parsing expiry date for picker:', e);
        }
      }
    }
  }, [jobDetail, reset]); // Re-run ONLY when jobDetail data changes

  // --- Submit Handler ---
  const onSubmit: SubmitHandler<UpdateJobPayload> = async data => {
    console.log('Form Data for Update:', data);
    show();
    try {
      // Call the UPDATE mutation
      await updateMutation.mutateAsync(data); // Send updated data
      Alert.alert('Success', 'Job berhasil diperbarui', [
        {
          text: 'OK',
          // Navigate back or to detail screen after update
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.error('Error updating job:', e);
      Alert.alert('Error', 'Gagal memperbarui lowongan. Silakan coba lagi.');
    } finally {
      hide();
    }
  };

  // --- Render Loading/Error for Initial Data ---
  if (isLoadingOptions || isLoadingDetail) {
    return <LoadingScreen text="Memuat data lowongan..." />;
  }

  // Handle error fetching detail OR options
  const combinedError = errorOptions || errorDetail;
  if (combinedError) {
    return (
      <ErrorScreen
        error={combinedError}
        placeholder="Gagal memuat data untuk update"
        refetch={refetchDetail}
      />
    );
  }
  // Ensure options are loaded before rendering dropdowns
  if (!paidStatusOptions || !companyOptions || !currencyOptions) {
    return <LoadingScreen text="Memuat opsi..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Edit Lowongan</Text>

          {/* Status Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status Publikasi *</Text>
            <Controller
              control={control}
              name="status_paid"
              rules={{required: 'Status publikasi harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal" // Keep modal mode?
                  style={[
                    styles.dropdownPlaceholder,
                    errors.status_paid && styles.inputError,
                  ]}
                  data={paidStatusOptions} // No need for 'as any[]' if types are correct
                  labelField="label"
                  valueField="value" // Value is '0' or '1'
                  placeholder="Pilih Status (Free/Paid)"
                  value={value} // RHF state now holds '0' or '1'
                  onChange={item => {
                    onChange(item.value); // Update RHF state with the value ('0' or '1')
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <ErrorLabel error={errors.status_paid?.message} />
          </View>

          {/* Company Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Perusahaan *</Text>
            <Controller
              control={control}
              name="id_company"
              rules={{required: 'Silahkan pilih perusahaan'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  style={[
                    styles.dropdownPlaceholder,
                    errors.id_company && styles.inputError,
                  ]}
                  data={companyOptions as any[]} // No need for 'as any[]'
                  placeholder="Pilih Perusahaan"
                  labelField="label"
                  valueField="value"
                  value={value} // RHF state holds the company ID string
                  onChange={item => {
                    onChange(item.value); // Update RHF state with the company ID
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <ErrorLabel error={errors.id_company?.message} />
          </View>

          {/* Jobs Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul Lowongan *</Text>
            <Controller
              control={control}
              name="jobs_title"
              rules={{required: 'Judul lowongan harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.jobs_title && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Contoh: Senior React Native Developer"
                />
              )}
            />
            <ErrorLabel error={errors.jobs_title?.message} />
          </View>

          {/* Jobs Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi Pekerjaan *</Text>
            <Controller
              control={control}
              name="jobs_desc"
              rules={{required: 'Deskripsi pekerjaan harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errors.jobs_desc && styles.inputError,
                  ]}
                  multiline={true}
                  textAlignVertical="top"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Jelaskan tanggung jawab, kualifikasi, dll."
                />
              )}
            />
            <ErrorLabel error={errors.jobs_desc?.message} />
          </View>

          {/* Salary Section */}
          <View style={styles.salaryRow}>
            {/* Salary Currency Dropdown */}
            <View style={[styles.inputGroup, styles.salaryCurrency]}>
              <Text style={styles.label}>Mata Uang</Text>
              <Controller
                control={control}
                name="salary_currency"
                // Make it required if salary range is filled? Add custom validation later
                render={({field: {onChange, onBlur, value}}) => (
                  <Dropdown
                    style={[
                      styles.dropdownPlaceholder,
                      styles.dropdownSmall,
                      errors.salary_currency && styles.inputError,
                    ]} // Use smaller dropdown style
                    data={currencyOptions}
                    labelField="label"
                    valueField="value" // Value is '$' or 'Rp'
                    placeholder="Pilih"
                    value={value} // RHF state holds '$' or 'Rp'
                    onChange={item => onChange(item.value)} // Update with value
                    onBlur={onBlur}
                    // renderLeftIcon...
                  />
                )}
              />
              {/* No separate error label needed if grouped */}
            </View>
            {/* Salary Range Start */}
            <View style={[styles.inputGroup, styles.salaryRange]}>
              <Text style={styles.label}>Gaji Mulai</Text>
              <Controller
                control={control}
                name="salary_range_start"
                rules={{pattern: {value: /^[0-9]*$/, message: 'Hanya angka'}}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.salary_range_start && styles.inputError,
                    ]}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Contoh: 5000"
                  />
                )}
              />
            </View>
            {/* Salary Range End */}
            <View style={[styles.inputGroup, styles.salaryRange]}>
              <Text style={styles.label}>Gaji Akhir</Text>
              <Controller
                control={control}
                name="salary_range_end"
                rules={{pattern: {value: /^[0-9]*$/, message: 'Hanya angka'}}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.salary_range_end && styles.inputError,
                    ]}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Contoh: 7000"
                  />
                )}
              />
            </View>
          </View>
          {/* Combined Salary Error Labels */}
          <View style={styles.errorRow}>
            <ErrorLabel error={errors.salary_currency?.message} />
            <ErrorLabel error={errors.salary_range_start?.message} />
            <ErrorLabel error={errors.salary_range_end?.message} />
          </View>

          {/* Jobs Post Exp Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tanggal Kadaluarsa *</Text>
            <Controller
              control={control}
              name="jobs_post_exp_date"
              rules={{required: 'Tanggal kadaluarsa harus diisi'}}
              render={({field: {onChange, value}}) => {
                // Value is string YYYY-MM-DD
                return (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.dropdownPlaceholder,
                        errors.jobs_post_exp_date && styles.inputError,
                      ]}
                      onPress={() => setOpenDatePicker(true)}
                      activeOpacity={0.7}>
                      <Text style={styles.dropdownText}>
                        {value
                          ? new Date(value + 'T00:00:00').toLocaleDateString(
                              'id-ID',
                              {
                                // Add time part for correct local date parsing
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )
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
                      minimumDate={new Date()} // Hanya tanggal ke depan
                      mode="date"
                      open={openDatePicker}
                      date={date} // State lokal untuk picker
                      onConfirm={_date => {
                        setOpenDatePicker(false);
                        setDate(_date); // Update state picker
                        // Update state RHF dengan format YYYY-MM-DD
                        onChange(_date.toISOString().split('T')[0]);
                      }}
                      onCancel={() => setOpenDatePicker(false)}
                      locale="id" // Set locale jika perlu
                      title="Pilih Tanggal Kadaluarsa"
                      confirmText="Pilih"
                      cancelText="Batal"
                    />
                  </>
                );
              }}
            />
            <ErrorLabel error={errors.jobs_post_exp_date?.message} />
          </View>

          {/* Location Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kota Lokasi *</Text>
            <Controller
              control={control}
              name="jobs_location_city"
              rules={{required: 'Kota harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.jobs_location_city && styles.inputError,
                  ]}
                  placeholder="Contoh: Surabaya"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <ErrorLabel error={errors.jobs_location_city?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Provinsi Lokasi *</Text>
            <Controller
              control={control}
              name="jobs_location_state"
              rules={{required: 'Provinsi harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.jobs_location_state && styles.inputError,
                  ]}
                  placeholder="Contoh: Jawa Timur"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <ErrorLabel error={errors.jobs_location_state?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Negara Lokasi *</Text>
            <Controller
              control={control}
              name="jobs_location_country"
              rules={{required: 'Negara harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.jobs_location_country && styles.inputError,
                  ]}
                  placeholder="Contoh: Indonesia"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <ErrorLabel error={errors.jobs_location_country?.message} />
          </View>

          {/* Contact Info Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telepon Kontak</Text>
            <Controller
              control={control}
              name="contact_info_phone"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 628123456789"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {/* No error label if not required */}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Kontak *</Text>
            <Controller
              control={control}
              name="contact_info_email"
              rules={{
                required: 'Email kontak harus diisi',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Format email tidak valid',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.contact_info_email && styles.inputError,
                  ]}
                  placeholder="Contoh: hr@perusahaan.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <ErrorLabel error={errors.contact_info_email?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website Kontak</Text>
            <Controller
              control={control}
              name="contact_info_web"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: https://perusahaan.com/karir"
                  keyboardType="url"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {/* No error label if not required */}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]} // Style disable saat submit
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting} // Disable tombol saat submitting
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text> // Ganti teks tombol
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (semua style lain sama seperti Create Screen) ...
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  scrollContentContainer: {paddingBottom: 30},
  formContainer: {padding: 20},
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {marginBottom: 15}, // Kurangi margin bottom sedikit
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
    marginBottom: 6,
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
  textArea: {height: 120, paddingTop: 12},
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
  },
  // --- Style Dropdown dari react-native-element-dropdown ---
  dropdown: {
    height: Platform.OS === 'ios' ? 50 : 48,
    borderColor: COLORS.greyMedium,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
  },
  dropdownFocus: {borderColor: COLORS.primary},
  dropdownSmall: {
    height: Platform.OS === 'ios' ? 48 : 46,
    paddingHorizontal: 6,
  },
  icon: {marginRight: 5},
  iconSmall: {marginRight: 4},
  placeholderStyle: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.greyDark,
    marginLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  iconStyle: {width: 20, height: 20},
  inputSearchStyle: {height: 40, fontSize: 15, fontFamily: 'Roboto-Regular'},
  // ---------------------------------------------------------
  salaryRow: {flexDirection: 'row', marginHorizontal: -5, marginBottom: 0}, // Kurangi margin bottom
  salaryCurrency: {flex: 2, paddingHorizontal: 5, marginBottom: 0}, // Kurangi margin bottom
  salaryRange: {flex: 3, paddingHorizontal: 5, marginBottom: 0}, // Kurangi margin bottom
  errorRow: {
    // Container untuk error salary agar tidak menambah tinggi
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 15, // Beri margin bawah setelah error
    minHeight: 18, // Beri tinggi minimum agar layout tidak lompat
  },
  salaryErrorLabel: {
    // Style untuk error di baris salary
    flex: 1, // Bagi ruang error
    paddingHorizontal: 5,
    fontSize: 11, // Lebih kecil
  },
  inputError: {borderColor: COLORS.primary}, // Style error umum
  errorText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
    marginLeft: 2,
  }, // Error di bawah input
  inlineLoader: {position: 'absolute', right: 10, top: 35}, // Loading di dalam dropdown
  inlineLoaderSmall: {position: 'absolute', right: 10, top: 32}, // Loading dropdown kecil
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  }, // Margin atas lebih besar
  submitButtonDisabled: {backgroundColor: COLORS.greyMedium}, // Warna saat disable
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default JobUpdateScreen;
