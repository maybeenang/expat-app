import React from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {FieldError, useForm} from 'react-hook-form';
import ControlledPicker, {
  PickerItemOption,
} from '../../../components/common/ControllerPicker';
import ControlledCheckboxGroup, {
  CheckboxOption,
} from '../../../components/common/ConrollerCheckBox';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useCreateAdminCrewMutation} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {CreateAdminCrewPayload} from '../../../features/adminCrews/types';
import {
  ControlledInput,
  ScreenContainer,
  StyledButton,
} from '../../../components/common';
import {colors, numbers} from '../../../contants/styles';

interface Props
  extends NativeStackScreenProps<RootStackParamList, 'AdminCrewCreate'> {}

// Data hardcode untuk options (sementara)
const companyOptions: PickerItemOption[] = [
  {label: 'SATU BANGSA PHOTOGRAPHY', value: '1'},
  {label: 'DUA INSANI VIDEOGRAPHY', value: '2'},
];

const contractTermsOptions: CheckboxOption[] = [
  {label: 'MASTER INDEPENDENT CONTRACTORS', value: '61'},
  {label: 'ADDITIONAL SERVICE', value: '71'},
];

// Tipe untuk form, pastikan sesuai dengan CreateAdminCrewPayload
interface AdminCrewFormInputs {
  name: string;
  email: string;
  cell_number: string;
  company: string; // Akan menjadi "1" atau "2"
  pin: string;
  id_master_contract_terms: string[]; // RHF akan menangani ini sebagai array string
}

const CreateAdminCrewScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset, // Untuk reset form setelah sukses
  } = useForm<AdminCrewFormInputs>({
    mode: 'onTouched', // Validasi saat field disentuh atau berubah
    defaultValues: {
      name: '',
      email: '',
      cell_number: '',
      company: '', // Default kosong agar placeholder picker tampil
      pin: '',
      id_master_contract_terms: [], // Default array kosong
    },
  });

  const createCrewMutation = useCreateAdminCrewMutation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <UniversalHeaderTitle title="Tambah Kru Baru" />,
    });
  }, [navigation]);

  const onSubmit = (formData: AdminCrewFormInputs) => {
    // Transformasi data form ke payload API
    const payload: CreateAdminCrewPayload = {
      name: formData.name,
      email: formData.email,
      cell_number: formData.cell_number,
      company: formData.company,
      pin: formData.pin,
      // Penting: Sesuaikan nama field dengan yang diharapkan API
      'id_master_contract_terms[]': formData.id_master_contract_terms,
    };

    createCrewMutation.mutate(payload, {
      onSuccess: response => {
        Alert.alert('Sukses', response.message || 'Kru berhasil ditambahkan.');
        reset(); // Reset form ke defaultValues
        // TODO: Navigasi ke halaman daftar Admin Crews
        // navigation.navigate('AdminCrews'); // Atau nama rute daftar Anda
        navigation.goBack(); // Atau kembali ke layar sebelumnya
      },
      onError: error => {
        // Error sudah di-log di hook, di sini bisa tampilkan ke user
        Alert.alert(
          'Gagal',
          error.response?.data?.message ||
            error.message ||
            'Terjadi kesalahan saat menambahkan kru.',
        );
      },
    });
  };

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Agar tap di luar input menutup keyboard
      >
        <ControlledInput<AdminCrewFormInputs>
          control={control}
          name="name"
          label="Nama Lengkap Kru"
          placeholder="Masukkan nama kru"
          rules={{required: 'Nama kru tidak boleh kosong.'}}
          error={errors.name}
          returnKeyType="next"
          // onSubmitEditing={() => emailRef.current?.focus()} // Contoh navigasi fokus
        />

        <ControlledInput<AdminCrewFormInputs>
          control={control}
          name="email"
          label="Alamat Email"
          placeholder="contoh@email.com"
          rules={{
            required: 'Email tidak boleh kosong.',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Format email tidak valid.',
            },
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <ControlledInput<AdminCrewFormInputs>
          control={control}
          name="cell_number"
          label="Nomor Telepon Seluler"
          placeholder="08xxxxxxxxxx"
          rules={{
            required: 'Nomor telepon tidak boleh kosong.',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Nomor telepon hanya boleh berisi angka.',
            },
          }}
          error={errors.cell_number}
          keyboardType="phone-pad"
          returnKeyType="next"
        />

        <ControlledPicker<AdminCrewFormInputs>
          control={control}
          name="company"
          label="Perusahaan"
          options={companyOptions}
          placeholder="Pilih Perusahaan" // Teks untuk item placeholder
          rules={{required: 'Perusahaan harus dipilih.'}}
          error={errors.company}
        />

        <ControlledInput<AdminCrewFormInputs>
          control={control}
          name="pin"
          label="PIN (5 digit)"
          placeholder="Masukkan PIN"
          rules={{
            required: 'PIN tidak boleh kosong.',
            minLength: {value: 5, message: 'PIN minimal 5 digit.'},
            maxLength: {value: 5, message: 'PIN maksimal 5 digit.'},
            pattern: {
              value: /^[0-9]+$/,
              message: 'PIN hanya boleh berisi angka.',
            },
          }}
          error={errors.pin}
          keyboardType="number-pad"
          secureTextEntry // Jika PIN sensitif
          returnKeyType="done" // Atau "next" jika ada field lain
        />

        <ControlledCheckboxGroup<AdminCrewFormInputs>
          control={control}
          name="id_master_contract_terms" // RHF akan mengelola ini sebagai string[]
          label="Form Contracts & Terms"
          options={contractTermsOptions}
          rules={{
            // Validasi custom untuk memastikan minimal satu checkbox dipilih
            validate: (value: string[] | undefined) => {
              if (!value || value.length === 0) {
                return 'Pilih minimal satu syarat kontrak.'; // Pesan error jika tidak ada yang dipilih
              }
              return true; // Validasi berhasil
            },
          }}
          error={errors.id_master_contract_terms as FieldError | undefined}
        />

        <View style={styles.buttonContainer}>
          <StyledButton
            title="Simpan"
            onPress={handleSubmit(onSubmit)}
            isLoading={createCrewMutation.isPending}
            // disabled={!isValid || createCrewMutation.isPending} // Disable jika form tidak valid atau sedang loading
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    padding: numbers.padding,
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: numbers.padding * 1.5,
  },
});

export default CreateAdminCrewScreen;
