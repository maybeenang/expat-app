import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Control, UseFormHandleSubmit, FieldErrors} from 'react-hook-form';
import {numbers} from '../../../contants/styles';
import ControlledPicker, {
  PickerItemOption,
} from '../../../components/common/ControllerPicker';
import {StyledButton} from '../../../components/common';

export interface FilterFormInputs {
  // Definisikan ulang di sini atau impor dari layar utama
  selectedCrewId?: string;
  selectedArea?: string;
  selectedYear: string;
}

interface AssignmentFilterContentProps {
  control: Control<FilterFormInputs>;
  errors: FieldErrors<FilterFormInputs>; // Untuk menampilkan error jika ada validasi
  handleSubmit: UseFormHandleSubmit<FilterFormInputs>;
  onApplyFilters: (data: FilterFormInputs) => void;
  onClose: () => void; // Untuk menutup BottomSheet
  crewOptions: PickerItemOption[];
  areaOptions: PickerItemOption[];
  yearOptions: PickerItemOption[];
  isApplyingFilters: boolean; // Untuk status loading tombol Apply
}

const AssignmentFilterContent: React.FC<AssignmentFilterContentProps> = ({
  control,
  errors,
  handleSubmit,
  onApplyFilters,
  onClose,
  crewOptions,
  areaOptions,
  yearOptions,
  isApplyingFilters,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Filter Jadwal</Text> */}

      <ControlledPicker<FilterFormInputs>
        control={control}
        name="selectedCrewId"
        label="Pilih Crew"
        options={crewOptions}
        placeholder="Semua Crew"
        // error={errors.selectedCrewId} // Jika ada validasi
      />

      <ControlledPicker<FilterFormInputs>
        control={control}
        name="selectedArea"
        label="Pilih Area"
        options={areaOptions}
        placeholder="Semua Area"
        // error={errors.selectedArea} // Jika ada validasi
      />

      <ControlledPicker<FilterFormInputs>
        control={control}
        name="selectedYear"
        label="Pilih Tahun"
        options={yearOptions}
        error={errors.selectedYear}
      />

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
    paddingBottom: numbers.padding * 2, // Beri ruang lebih di bawah
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

export default AssignmentFilterContent;
