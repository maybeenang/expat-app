import React from 'react';
import {View, ScrollView, StyleSheet, Alert, Text} from 'react-native';
import {useForm} from 'react-hook-form';
import ControlledPicker, {
  PickerItemOption,
} from '../../../components/common/ControllerPicker';
import ControlledCheckboxGroup, {
  CheckboxOption,
} from '../../../components/common/ConrollerCheckBox';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useCreateAdminCrewContractMutation} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {CreateAdminCrewContractPayload} from '../../../features/adminCrews/types';
import {ScreenContainer, StyledButton} from '../../../components/common';
import {colors, fonts, numbers} from '../../../contants/styles';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

const companyOptions: PickerItemOption[] = [
  {label: 'SATU BANGSA PHOTOGRAPHY', value: '1'},
  {label: 'DUA INSANI VIDEOGRAPHY', value: '2'},
];

const contractTermsOptions: CheckboxOption[] = [
  {label: 'MASTER INDEPENDENT CONTRACTORS', value: '61'},
  {label: 'ADDITIONAL SERVICE', value: '71'},
];

// Tipe untuk form
interface CreateContractFormInputs {
  id_company: string; // ID Perusahaan
  id_master_contract_terms: string[]; // Array ID master contract terms
}

interface CreateAdminCrewContractScreenProps
  extends NativeStackScreenProps<
    RootStackParamList,
    'AdminCrewCreateContract'
  > {}

const CreateAdminCrewContractScreen: React.FC<
  CreateAdminCrewContractScreenProps
> = ({route, navigation}) => {
  const {crew} = route.params; // Dapatkan detail kru dari parameter navigasi

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateContractFormInputs>({
    mode: 'onTouched',
    defaultValues: {
      id_company: '', // Default kosong agar placeholder picker tampil
      id_master_contract_terms: [],
    },
  });

  const createContractMutation = useCreateAdminCrewContractMutation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle title={`Buat Kontrak untuk ${crew.name}`} />
      ),
    });
  }, [navigation, crew.name]);

  const {hide, show} = useLoadingOverlayStore();

  const onSubmit = async (formData: CreateContractFormInputs) => {
    // Payload untuk API
    const payload: CreateAdminCrewContractPayload = {
      id_users: crew.id, // Ambil ID user dari objek crew yang diterima
      id_company: formData.id_company,
      'id_master_contract_terms[]': formData.id_master_contract_terms,
    };

    show();
    try {
      await createContractMutation.mutateAsync(payload);
      Alert.alert('Berhasil', 'Kontrak berhasil dibuat.');
      reset(); // Reset form setelah sukses
      navigation.goBack(); // Kembali ke layar sebelumnya
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat kontrak. Silakan coba lagi.');
    } finally {
      hide();
    }
  };

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.label}>Nama:</Text>
          <Text style={styles.value}>{crew.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{crew.email?.trim()}</Text>
          <Text style={styles.label}>Nomor Telepon:</Text>
          <Text style={styles.value}>{crew.cell_number}</Text>
          {crew.unavailable_date && (
            <>
              <Text style={styles.label}>Tanggal Tidak Tersedia:</Text>
              <Text style={styles.value}>
                {new Date(crew.unavailable_date).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>

        <ControlledPicker<CreateContractFormInputs>
          control={control}
          name="id_company"
          label="Pilih Perusahaan"
          options={companyOptions}
          placeholder="Pilih Perusahaan Kontrak"
          rules={{required: 'Perusahaan harus dipilih.'}}
          error={errors.id_company}
        />

        <ControlledCheckboxGroup<CreateContractFormInputs>
          control={control}
          name="id_master_contract_terms"
          label="Pilih Syarat Kontrak (Minimal 1)"
          options={contractTermsOptions}
          rules={{
            validate: (value: string[] | undefined) => {
              if (!value || value.length === 0) {
                return 'Pilih minimal satu syarat kontrak.';
              }
              return true;
            },
          }}
          error={errors.id_master_contract_terms as any} // Cast 'any' sementara jika masih ada isu tipe error kompleks, idealnya disesuaikan
        />

        <View style={styles.buttonContainer}>
          <StyledButton
            title="Simpan Kontrak"
            onPress={handleSubmit(onSubmit)}
            isLoading={createContractMutation.isPending}
            // disabled={!isValid || createContractMutation.isPending} // Aktifkan jika ingin disable tombol
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
  crewInfoContainer: {
    marginBottom: numbers.padding * 1.5,
    padding: numbers.padding,
    backgroundColor: colors.greyLight,
    borderRadius: numbers.borderRadius,
  },
  crewInfoLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  crewInfoValue: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: numbers.padding * 1.5,
  },
  section: {
    backgroundColor: colors.surface,
    padding: numbers.padding,
    borderRadius: numbers.borderRadius,
    marginBottom: numbers.padding,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginTop: numbers.padding / 2,
  },
  value: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    marginBottom: numbers.padding / 3,
  },
});

export default CreateAdminCrewContractScreen;
