import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import Icon from '@react-native-vector-icons/ionicons';
import {format, parseISO, isValid} from 'date-fns';
import COLORS from '../../constants/colors';
import ErrorLabel from './ErrorLabel';

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
  error?: string;
  isDisabled?: boolean;
  placeholder?: string;
  mode?: 'date' | 'datetime';
  minimumDate?: Date;
}

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  isDisabled,
  placeholder = 'Pilih tanggal',
  mode = 'date',
  minimumDate,
}: FormDatePickerProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, value}}) => (
          <>
            <TouchableOpacity
              style={[
                styles.dateInput,
                isDisabled && styles.disabledInput,
                error && styles.errorInput,
              ]}
              onPress={() => !isDisabled && setIsOpen(true)}
              disabled={isDisabled}
              activeOpacity={0.7}>
              <Text style={styles.dateText}>
                {value
                  ? format(
                      parseISO(value),
                      mode === 'date' ? 'dd MMM yyyy' : 'dd MMM yyyy, HH:mm',
                    )
                  : placeholder}
              </Text>
              <Icon
                name="calendar-outline"
                size={20}
                color={COLORS.greyDark}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              mode={mode}
              open={isOpen}
              date={selectedDate}
              minimumDate={minimumDate}
              onConfirm={date => {
                setIsOpen(false);
                setSelectedDate(date);
                onChange(
                  format(
                    date,
                    mode === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm',
                  ),
                );
              }}
              onCancel={() => setIsOpen(false)}
              title={label}
              confirmText="Konfirmasi"
              cancelText="Batal"
            />
          </>
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
  dateInput: {
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
  dateText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  disabledInput: {
    backgroundColor: COLORS.greyLight,
    opacity: 0.7,
  },
  errorInput: {
    borderColor: COLORS.red,
  },
});

export default FormDatePicker; 