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
import Icon from '@react-native-vector-icons/ionicons';

interface ControlledInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<
    TextInputProps,
    'onChange' | 'onChangeText' | 'onBlur' | 'value'
  > {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  rules?: object;
  error?: FieldError;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
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
  isPassword = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorTextStyle,
  secureTextEntry: _secureTextEntry,
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
              value={value as string}
              selectionColor={colors.primary}
              placeholderTextColor={colors.greyDark}
              secureTextEntry={actualSecureTextEntry}
              {...textInputProps}
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
            {isPasswordVisible ? (
              <Icon
                name="eye-off-outline"
                size={24}
                color={colors.textSecondary}
              />
            ) : (
              <Icon name="eye-outline" size={24} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
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
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: numbers.borderWidth,
    borderColor: colors.greyMedium,
    borderRadius: numbers.borderRadius,
    backgroundColor: colors.surface,
    paddingHorizontal: numbers.padding / 1.5,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  baseInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  inputWithLeftIcon: {},
  inputWithRightIcon: {},
  iconContainer: {
    paddingHorizontal: 8,
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

