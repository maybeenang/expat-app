import React, {useState} from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import {colors, fonts, numbers} from '../../contants/styles';

// Menggunakan generic TFieldValues untuk type safety yang lebih baik dengan React Hook Form
interface ControlledInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<
    TextInputProps,
    'onChange' | 'onChangeText' | 'onBlur' | 'value'
  > {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>; // Path memastikan 'name' adalah key yang valid dari TFieldValues
  label?: string;
  rules?: object; // Sebenarnya bisa lebih spesifik: RegisterOptions dari RHF
  error?: FieldError;
  leftIcon?: React.ReactNode;
  // rightIcon bisa digunakan untuk ikon kustom, atau kita akan handle toggle password secara internal
  // rightIcon?: React.ReactNode;
  isPassword?: boolean; // Flag untuk menandakan ini adalah input password
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle; // Style khusus untuk TextInput itu sendiri
  labelStyle?: TextStyle;
  errorTextStyle?: TextStyle;
}

const ControlledInput = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  rules = {},
  error,
  leftIcon,
  // rightIcon,
  isPassword = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorTextStyle,
  secureTextEntry: _secureTextEntry, // Ambil secureTextEntry dari props jika ada, tapi akan dioverride oleh internal state jika isPassword true
  ...textInputProps
}: ControlledInputProps<TFieldValues>): React.ReactElement => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    if (isPassword) {
      setIsPasswordVisible(prev => !prev);
    }
  };

  const actualSecureTextEntry = isPassword
    ? !isPasswordVisible
    : _secureTextEntry;

  return (
    <View style={[styles.baseContainer, containerStyle]}>
      {label && <Text style={[styles.baseLabel, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputWrapperError : null,
          inputStyle,
        ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={[
                styles.baseInput,
                leftIcon ? styles.inputWithLeftIcon : null,
                isPassword ? styles.inputWithRightIcon : null,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string} // RHF value bisa jadi berbagai tipe, tapi TextInput mengharapkan string
              selectionColor={colors.primary}
              placeholderTextColor={colors.greyDark}
              secureTextEntry={actualSecureTextEntry}
              {...textInputProps} // Sisa props TextInput
            />
          )}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityRole="button">
            {/* Ganti dengan komponen Ikon Anda, contoh menggunakan Text */}
            {isPasswordVisible ? (
              //   <Icon name="eye-off-outline" size={22} color={colors.textSecondary} />
              <Text style={{color: colors.textSecondary}}>👁️</Text> // Placeholder ikon
            ) : (
              //   <Icon name="eye-outline" size={22} color={colors.textSecondary} />
              <Text style={{color: colors.textSecondary}}>👁️‍🗨️</Text> // Placeholder ikon
            )}
          </TouchableOpacity>
        )}
        {/* Jika Anda ingin mengizinkan rightIcon kustom yang bukan untuk toggle password: */}
        {/* {!isPassword && rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>} */}
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
    marginBottom: 16, // Sedikit lebih banyak spasi
    width: '100%',
  },
  baseLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: numbers.borderWidth,
    borderColor: colors.greyMedium, // Border default
    borderRadius: numbers.borderRadius,
    backgroundColor: colors.surface, // Latar belakang input
    paddingHorizontal: numbers.padding / 1.5, // Padding horizontal di wrapper
  },
  inputWrapperError: {
    borderColor: colors.error, // Warna border saat error
  },
  baseInput: {
    flex: 1,
    paddingVertical: 12, // Padding vertikal di dalam input
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  inputWithLeftIcon: {
    // paddingLeft: 0, // Jika ikon sudah memiliki padding sendiri atau diatur oleh iconContainer
  },
  inputWithRightIcon: {
    // paddingRight: 0, // Sama seperti inputWithLeftIcon
  },
  iconContainer: {
    // Digunakan untuk leftIcon dan rightIcon (toggle password)
    paddingHorizontal: 8, // Jarak ikon dari teks input atau border
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseErrorText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.error,
  },
});

export default ControlledInput;
