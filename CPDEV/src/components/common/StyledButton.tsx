import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import {colors, fonts, numbers} from '../../contants/styles';

export type ButtonVariant =
  | 'primary'
  | 'secondary' // Jika Anda akan menambahkannya nanti
  | 'outlinePrimary'
  | 'outlineSecondary' // Jika Anda akan menambahkannya nanti
  | 'textPrimary' // Tombol hanya teks, seperti link
  | 'textSecondary' // Tombol hanya teks, seperti link
  | 'danger' // Untuk aksi destruktif
  | 'dangerOutline';

// Definisikan ukuran tombol
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle; // Untuk kustomisasi tambahan pada container TouchableOpacity
  textStyle?: TextStyle; // Untuk kustomisasi tambahan pada Text
}

const StyledButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...rest // Sisa props untuk TouchableOpacity
}) => {
  const isDisabled = disabled || isLoading;

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle = styles.baseButtonContainer;
    const variantStyles: ViewStyle = {};
    const sizeStyles: ViewStyle = {};

    // Variant specific container styles
    switch (variant) {
      case 'primary':
        variantStyles.backgroundColor = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
        break;
      case 'outlinePrimary':
        variantStyles.backgroundColor = colors.white; // Atau transparent jika Anda mau
        variantStyles.borderColor = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
        variantStyles.borderWidth = numbers.borderWidth;
        break;
      case 'textPrimary':
        variantStyles.backgroundColor = 'transparent';
        break;
      case 'danger':
        variantStyles.backgroundColor = isDisabled
          ? colors.primaryDisabled
          : colors.error; // Ganti dengan warna dangerDisabled jika ada
        break;
      case 'dangerOutline':
        variantStyles.backgroundColor = colors.white;
        variantStyles.borderColor = isDisabled
          ? colors.primaryDisabled
          : colors.error;
        variantStyles.borderWidth = numbers.borderWidth;
        break;
      // Tambahkan case untuk 'secondary', 'outlineSecondary', 'textSecondary' jika diperlukan
      default: // 'primary'
        variantStyles.backgroundColor = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
    }

    // Size specific container styles
    switch (size) {
      case 'small':
        sizeStyles.paddingVertical = 8;
        sizeStyles.paddingHorizontal = numbers.padding / 2;
        break;
      case 'medium':
        sizeStyles.paddingVertical = 12;
        sizeStyles.paddingHorizontal = numbers.padding;
        break;
      case 'large':
        sizeStyles.paddingVertical = 16;
        sizeStyles.paddingHorizontal = numbers.padding * 1.5;
        break;
    }

    const conditionalStyles: ViewStyle = {};
    if (fullWidth) {
      conditionalStyles.width = '100%';
    }

    return [base, variantStyles, sizeStyles, conditionalStyles, style];
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle = styles.baseButtonText;
    const variantTextStyles: TextStyle = {};
    const sizeTextStyles: TextStyle = {};

    // Variant specific text styles
    switch (variant) {
      case 'primary':
        variantTextStyles.color = colors.white;
        break;
      case 'outlinePrimary':
        variantTextStyles.color = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
        break;
      case 'textPrimary':
        variantTextStyles.color = isDisabled
          ? colors.textDisabled
          : colors.primary;
        break;
      case 'danger':
        variantTextStyles.color = colors.white;
        break;
      case 'dangerOutline':
        variantTextStyles.color = isDisabled
          ? colors.textDisabled
          : colors.error;
        break;
      default: // 'primary'
        variantTextStyles.color = colors.white;
    }

    // Size specific text styles
    switch (size) {
      case 'small':
        sizeTextStyles.fontSize = 12;
        break;
      case 'medium':
        sizeTextStyles.fontSize = 14;
        break;
      case 'large':
        sizeTextStyles.fontSize = 16;
        break;
    }
    //
    // if (
    //   isDisabled &&
    //   variant !== 'outlinePrimary' &&
    //   variant !== 'textPrimary' &&
    //   variant !== 'dangerOutline'
    // ) {
    //   // Untuk varian solid, teks jadi lebih pudar jika disabled, kecuali untuk outline/text
    //   // dimana warna text sudah dihandle untuk disabled
    //   if (variant === 'primary' || variant === 'danger') {
    //     variantTextStyles.color = colors.textDisabled;
    //   }
    // }

    return [base, variantTextStyles, sizeTextStyles, textStyle];
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.white;
      case 'outlinePrimary':
        return isDisabled ? colors.primaryDisabled : colors.primary;
      case 'textPrimary':
        return isDisabled ? colors.textDisabled : colors.primary;
      case 'dangerOutline':
        return isDisabled ? colors.textDisabled : colors.error;
      default:
        return colors.white;
    }
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled}}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View style={styles.contentWrapper}>
          {leftIcon && (
            <View style={styles.iconWrapper}>
              {React.cloneElement(leftIcon as React.ReactElement, {
                color: getIconColor(),
              })}
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && (
            <View style={styles.iconWrapper}>
              {React.cloneElement(rightIcon as React.ReactElement, {
                color: getIconColor(),
              })}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: numbers.borderRadius,
    // shadowColor: colors.shadow, (nonaktifkan default shadow, bisa ditambahkan per variant jika perlu)
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: numbers.shadowRadius,
    // elevation: 2, (nonaktifkan default elevation)
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseButtonText: {
    fontFamily: fonts.medium, // Default ke medium, bisa disesuaikan per size/variant
    textAlign: 'center',
  },
  iconWrapper: {
    marginHorizontal: 8, // Jarak antara ikon dan teks
  },
});

export default StyledButton;
