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
} from 'react-native';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {useAllJobOptions} from '../../../hooks/useJobsOptionsQuery';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {CreateJobPayload} from '../../../types/jobs';
import DatePicker from 'react-native-date-picker';
import ErrorLabel from '../../../components/common/ErrorLabel';
import {useCreateJobMutation} from '../../../hooks/useJobsQuery';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';

interface JobsCreateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'JobCreate'> {}

const JobsCreateScreen = ({navigation}: JobsCreateScreenProps) => {
  const {isLoading, paidStatus, companies, currencies, error} =
    useAllJobOptions();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<CreateJobPayload>({
    defaultValues: {
      jobs_desc: '',
      id_company: '',
      jobs_title: '',
      status_paid: '0',
      salary_currency: 'Rp',
      contact_info_web: '',
      salary_range_end: '',
      salary_range_start: '',
      contact_info_email: '',
      contact_info_phone: '',
      jobs_location_city: '',
      jobs_location_state: '',
      jobs_post_exp_date: '',
      jobs_location_country: '',
    },
  });

  const mutation = useCreateJobMutation();

  const {hide, show} = useLoadingOverlayStore();

  const onSubmit: SubmitHandler<CreateJobPayload> = async data => {
    console.log('Form Data:', data);

    show();
    try {
      await mutation.mutateAsync(data);

      Alert.alert('Success', 'Job berhasil dibuat', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.log('Error creating job:', e);
      Alert.alert('Error', 'Gagal membuat forum. Silakan coba lagi.');
    } finally {
      hide();
    }
  };

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!paidStatus || !companies || !currencies) {
      return;
    }

    if (paidStatus.length > 0) {
      setValue('status_paid', paidStatus[0].value);
    }

    if (companies.length > 0) {
      setValue('id_company', companies[0].value);
    }
    if (currencies.length > 0) {
      setValue('salary_currency', currencies[0].value);
    }

    return () => {};
  }, [paidStatus, companies, currencies, setValue]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} placeholder="Gagal memuat data" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Agar bisa tap di luar input untuk dismiss keyboard
      >
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Buat Lowongan Baru</Text>

          {/* Status Dropdown Placeholder */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status Publikasi *</Text>
            <Controller
              control={control}
              name="status_paid"
              rules={{required: 'Status publikasi harus dipilih'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  mode="modal"
                  style={styles.dropdownPlaceholder}
                  data={paidStatus as any[]}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Status (Free/Paid)"
                  value={value || null}
                  onChange={item => {
                    onChange(item.value);
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <ErrorLabel error={errors.status_paid?.message} />
          </View>

          {/* Company Dropdown Placeholder */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Perusahaan *</Text>
            <Controller
              control={control}
              name="id_company"
              rules={{required: 'Silahkan pilih perusahaan'}}
              render={({field: {onChange, onBlur, value}}) => (
                <Dropdown
                  style={styles.dropdownPlaceholder}
                  data={companies as any[]}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Company"
                  value={value || null}
                  onChange={item => {
                    onChange(item.value);
                    console.log(item);
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
                  style={styles.input}
                  placeholder="Contoh: Senior React Native Developer"
                  placeholderTextColor={COLORS.greyDark}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <ErrorLabel error={errors.jobs_title?.message} />
          </View>

          {/* Jobs Description (Multiline Placeholder) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deskripsi Pekerjaan *</Text>
            <Controller
              control={control}
              name="jobs_desc"
              rules={{required: 'Deskripsi pekerjaan harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Jelaskan tanggung jawab, kualifikasi, dll."
                  placeholderTextColor={COLORS.greyDark}
                  multiline={true}
                  textAlignVertical="top" // Penting untuk Android
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <ErrorLabel error={errors.jobs_desc?.message} />
          </View>

          {/* Salary Section */}
          <View style={styles.salaryRow}>
            {/* Salary Currency Dropdown Placeholder */}
            <View style={[styles.inputGroup, styles.salaryCurrency]}>
              <Text style={styles.label}>Mata Uang</Text>
              <Controller
                control={control}
                name="salary_currency"
                rules={{required: 'Mata uang harus dipilih'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <Dropdown
                    style={styles.dropdownPlaceholder}
                    data={currencies as any[]}
                    labelField="label"
                    valueField="value"
                    placeholder="Pilih Company"
                    value={value || null}
                    onChange={item => {
                      onChange(item.value);
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            {/* Salary Range Start */}
            <View style={[styles.inputGroup, styles.salaryRange]}>
              <Text style={styles.label}>Gaji Mulai</Text>
              <Controller
                control={control}
                name="salary_range_start"
                rules={{required: 'Gaji mulai harus diisi'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: 5000"
                    placeholderTextColor={COLORS.greyDark}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
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
                rules={{required: 'Gaji akhir harus diisi'}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: 7000"
                    placeholderTextColor={COLORS.greyDark}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </View>
          </View>

          {/* Error Labels for Salary */}
          <View style={{marginTop: -10, marginBottom: 10}}>
            <ErrorLabel error={errors.salary_currency?.message} />
            <ErrorLabel error={errors.salary_range_start?.message} />
            <ErrorLabel error={errors.salary_range_end?.message} />
          </View>

          {/* Jobs Post Exp Date Placeholder */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tanggal Kadaluarsa *</Text>
            <Controller
              control={control}
              name="jobs_post_exp_date"
              rules={{required: 'Tanggal kadaluarsa harus diisi'}}
              render={({field: {onChange, value}}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={styles.dropdownPlaceholder}
                      onPress={() => setOpen(true)}
                      activeOpacity={0.7}>
                      <Text style={styles.dropdownText}>
                        {value
                          ? new Date(value).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
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
                      minimumDate={new Date()}
                      mode="date"
                      open={open}
                      date={date}
                      onConfirm={_date => {
                        setOpen(false);
                        setDate(_date);
                        // set date with format YYYY-DD-MM
                        onChange(_date.toISOString().split('T')[0]);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </>
                );
              }}
            />

            <ErrorLabel error={errors.jobs_post_exp_date?.message} />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kota Lokasi *</Text>
            <Controller
              control={control}
              name="jobs_location_city"
              rules={{required: 'Kota Lokasi harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Surabaya"
                  placeholderTextColor={COLORS.greyDark}
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
              rules={{required: 'Provinsi Lokasi harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Jawa Timur"
                  placeholderTextColor={COLORS.greyDark}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <ErrorLabel error={errors.jobs_location_city?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Negara Lokasi *</Text>
            <Controller
              control={control}
              name="jobs_location_country"
              rules={{required: 'Negara Lokasi harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Indonesia"
                  placeholderTextColor={COLORS.greyDark}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <ErrorLabel error={errors.jobs_location_city?.message} />
          </View>

          {/* Contact Info */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telepon Kontak *</Text>
            <Controller
              control={control}
              name="contact_info_phone"
              rules={{required: 'Kontak telepon harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 628123456789"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <ErrorLabel error={errors.contact_info_phone?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Kontak *</Text>
            <Controller
              control={control}
              name="contact_info_email"
              rules={{
                required: 'Email kontak harus diisi',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email tidak valid',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: hr@perusahaan.com"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <ErrorLabel error={errors.contact_info_email?.message} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website Kontak *</Text>
            <Controller
              control={control}
              name="contact_info_web"
              rules={{required: 'Website kontak harus diisi'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: https://perusahaan.com/karir"
                  placeholderTextColor={COLORS.greyDark}
                  keyboardType="url"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <ErrorLabel error={errors.contact_info_web?.message} />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Publikasikan Lowongan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 10, // iOS butuh padding lebih
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 120, // Tinggi lebih besar untuk deskripsi
    paddingTop: 12, // Padding atas untuk multiline
  },
  dropdownPlaceholder: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: Platform.OS === 'ios' ? 50 : 48, // Sesuaikan tinggi agar mirip input
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary, // Atau greyDark jika ingin seperti placeholder
  },
  salaryRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between', // Tidak perlu jika pakai flex
    marginHorizontal: -5, // Negatif margin untuk compensate padding inputGroup
  },
  salaryCurrency: {
    flex: 2, // Lebar relatif (2:3:3)
    paddingHorizontal: 5, // Padding antar kolom
  },
  salaryRange: {
    flex: 3, // Lebar relatif
    paddingHorizontal: 5,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default JobsCreateScreen;
