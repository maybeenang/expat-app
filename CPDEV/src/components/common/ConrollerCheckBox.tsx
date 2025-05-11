import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import Checkbox from './Checkbox'; // Import komponen Checkbox kita
import {colors, fonts} from '../../contants/styles';

export interface CheckboxOption {
  label: string;
  value: string; // Value adalah ID string
}

interface ControlledCheckboxGroupProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>; // Nama field di RHF, akan menyimpan array string
  label?: string;
  rules?: object;
  error?: FieldError;
  options: CheckboxOption[];
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  checkboxContainerStyle?: ViewStyle; // Style untuk setiap item checkbox
}

const ControlledCheckboxGroup = <
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  rules = {},
  error,
  options,
  containerStyle,
  labelStyle,
  errorTextStyle,
  checkboxContainerStyle,
}: ControlledCheckboxGroupProps<TFieldValues>): React.ReactElement => {
  return (
    <View style={[styles.baseContainer, containerStyle]}>
      {label && <Text style={[styles.baseLabel, labelStyle]}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={[] as any} // Default ke array kosong
        render={({field: {onChange, value: selectedValues = []}}) => (
          <View>
            {options.map(option => {
              const isChecked = (selectedValues as string[]).includes(
                option.value,
              );

              const handlePress = () => {
                const newSelectedValues = isChecked
                  ? (selectedValues as string[]).filter(v => v !== option.value) // Hapus jika sudah ada
                  : [...(selectedValues as string[]), option.value]; // Tambah jika belum ada
                onChange(newSelectedValues);
              };

              return (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={isChecked}
                  onPress={handlePress}
                  containerStyle={checkboxContainerStyle}
                  testID={`checkbox-${name}-${option.value}`}
                />
              );
            })}
          </View>
        )}
      />
      {error && (
        <Text style={[styles.baseErrorText, errorTextStyle]}>
          {error.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    marginBottom: 16,
    width: '100%',
  },
  baseLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  baseErrorText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.error,
  },
});

export default ControlledCheckboxGroup;
