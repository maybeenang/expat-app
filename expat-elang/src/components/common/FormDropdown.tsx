import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../constants/colors';
import ErrorLabel from './ErrorLabel';

interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: DropdownOption[];
  rules?: object;
  error?: string;
  isDisabled?: boolean;
  placeholder?: string;
}

const FormDropdown = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  rules,
  error,
  isDisabled,
  placeholder = 'Pilih opsi',
}: FormDropdownProps<T>) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <Dropdown
            mode="modal"
            style={[
              styles.dropdown,
              isDisabled && styles.disabledInput,
              error && styles.errorInput,
            ]}
            data={options}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value || null}
            onChange={item => onChange(item.value)}
            onBlur={onBlur}
            disable={isDisabled || options.length === 0}
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
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: Platform.OS === 'ios' ? 50 : 48,
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

export default FormDropdown; 