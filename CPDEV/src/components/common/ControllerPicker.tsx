import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Picker, PickerProps} from '@react-native-picker/picker';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import {colors, fonts, numbers} from '../../contants/styles';

export interface PickerItemOption {
  label: string;
  value: string | number; // Value bisa string atau number
  color?: string; // Opsional, untuk warna teks item tertentu
}

interface ControlledPickerProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<
    PickerProps,
    'selectedValue' | 'onValueChange' | 'children' | 'style'
  > {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  rules?: object;
  error?: FieldError;
  options: PickerItemOption[];
  placeholder?: string; // Teks untuk item placeholder (opsional)
  containerStyle?: ViewStyle;
  pickerContainerStyle?: ViewStyle; // Style untuk View pembungkus Picker
  labelStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  pickerStyle?: ViewStyle; // Style langsung untuk komponen Picker
}

const ControlledPicker = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  rules = {},
  error,
  options,
  placeholder,
  containerStyle,
  pickerContainerStyle,
  labelStyle,
  errorTextStyle,
  pickerStyle,
  enabled = true, // Default enabled
  ...pickerProps
}: ControlledPickerProps<TFieldValues>): React.ReactElement => {
  const ref = React.useRef<Picker<any>>(null);

  return (
    <View style={[styles.baseContainer, containerStyle]}>
      {label && <Text style={[styles.baseLabel, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.pickerWrapper,
          !enabled && styles.pickerWrapperDisabled,
          error ? styles.pickerWrapperError : null,
          pickerContainerStyle,
        ]}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {onChange, value}}) => (
            <Picker
              ref={ref}
              selectedValue={value}
              onValueChange={(itemValue, itemIndex) => {
                // Jangan biarkan placeholder dipilih jika ada
                if (placeholder && itemIndex === 0 && itemValue === '') return;
                onChange(itemValue);
              }}
              style={[styles.picker, pickerStyle]}
              enabled={enabled}
              dropdownIconColor={
                enabled ? colors.textSecondary : colors.textDisabled
              }
              {...pickerProps} // mode, prompt, dll.
            >
              {placeholder && (
                <Picker.Item
                  label={placeholder}
                  value=""
                  style={styles.placeholderItem}
                  enabled={false}
                />
              )}
              {options.map(option => (
                <Picker.Item
                  key={option.value.toString()}
                  label={option.label}
                  value={option.value}
                  color={option.color} // Bisa digunakan untuk memberi warna pada item tertentu
                />
              ))}
            </Picker>
          )}
        />
      </View>
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
  pickerWrapper: {
    borderWidth: numbers.borderWidth,
    borderColor: colors.greyMedium,
    borderRadius: numbers.borderRadius,
    backgroundColor: colors.surface,
    overflow: 'hidden', // Penting untuk borderRadius pada Android
  },
  pickerWrapperError: {
    borderColor: colors.error,
  },
  pickerWrapperDisabled: {
    backgroundColor: colors.greyLight, // Atau warna disabled Anda
  },
  picker: {
    height: 50, // Sesuaikan tinggi agar konsisten dengan input lain
    width: '100%',
    color: colors.textPrimary,
    // backgroundColor: 'transparent', // Sudah dihandle wrapper
  },
  placeholderItem: {
    color: colors.greyDark, // Warna untuk teks placeholder
  },
  baseErrorText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.error,
  },
});

export default ControlledPicker;
