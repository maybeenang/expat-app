import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Control, UseFormHandleSubmit, FieldErrors} from 'react-hook-form';
import ControlledPicker, {
  PickerItemOption,
} from '../../../components/common/ControllerPicker';
import {StyledButton} from '../../../components/common';
import {numbers} from '../../../contants/styles';

// Tipe ini akan mendefinisikan field-field dalam form filter
export interface ContactResultFilterFormInputs {
  selectedCompany?: string;
  // Tambahkan field filter lain jika ada (mis. area, tanggal, dll.)
}

interface ContactResultFilterContentProps {
  control: Control<ContactResultFilterFormInputs>;
  errors: FieldErrors<ContactResultFilterFormInputs>;
  handleSubmit: UseFormHandleSubmit<ContactResultFilterFormInputs>;
  onApplyFilters: (data: ContactResultFilterFormInputs) => void;
  onClose: () => void;
  companyOptions: PickerItemOption[]; // Opsi untuk picker perusahaan
  isApplyingFilters: boolean;
}

const ContactResultFilterContent: React.FC<ContactResultFilterContentProps> = ({
  control,
  errors,
  handleSubmit,
  onApplyFilters,
  onClose,
  companyOptions,
  isApplyingFilters,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ControlledPicker<ContactResultFilterFormInputs>
        control={control}
        name="selectedCompany"
        label="Filter Berdasarkan Perusahaan"
        options={companyOptions}
        placeholder="Semua Perusahaan"
        // error={errors.selectedCompany} // Jika ada validasi
      />

      {/* Tambahkan picker/input lain untuk filter tambahan di sini */}

      <View style={styles.actionsContainer}>
        <StyledButton
          title="Batal"
          onPress={onClose}
          variant="outlinePrimary"
          style={styles.actionButton}
        />
        <StyledButton
          title="Terapkan Filter"
          onPress={handleSubmit(onApplyFilters)}
          isLoading={isApplyingFilters}
          disabled={isApplyingFilters}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: numbers.padding,
    paddingBottom: numbers.padding * 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: numbers.padding * 1.5,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: numbers.padding / 2,
  },
});

export default ContactResultFilterContent;
