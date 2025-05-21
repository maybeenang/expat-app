import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import COLORS from '../../constants/colors';
import ErrorLabel from './ErrorLabel';

interface FormPriceInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
  error?: string;
  isDisabled?: boolean;
}

const FormPriceInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  isDisabled,
  ...props
}: FormPriceInputProps<T>) => {
  const formatWithSeparator = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // Add thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const removeSeparator = (value: string) => {
    return value.replace(/\./g, '');
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={[
              styles.input,
              isDisabled && styles.disabledInput,
              error && styles.errorInput,
            ]}
            placeholderTextColor={COLORS.greyDark}
            value={value ? formatWithSeparator(value) : ''}
            onChangeText={text => {
              // Remove separators before updating form value
              onChange(removeSeparator(text));
            }}
            onBlur={onBlur}
            editable={!isDisabled}
            keyboardType="number-pad"
            {...props}
          />
        )}
      />
      <ErrorLabel error={error} />
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  disabledInput: {
    backgroundColor: COLORS.greyLight,
    opacity: 0.7,
  },
  errorInput: {
    borderColor: COLORS.red,
  },
});

export default FormPriceInput; 