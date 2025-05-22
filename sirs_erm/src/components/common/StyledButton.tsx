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

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: string;
  rightIcon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
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
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle = styles.baseButtonContainer;
    const variantStyles: ViewStyle = {};
    const sizeStyles: ViewStyle = {};

    switch (variant) {
      case 'primary':
        variantStyles.backgroundColor = isDisabled
          ? colors.greyMedium
          : colors.primary;
        break;
      case 'outline':
        variantStyles.backgroundColor = colors.white;
        variantStyles.borderColor = isDisabled
          ? colors.greyMedium
          : colors.primary;
        variantStyles.borderWidth = numbers.borderWidth;
        break;
      case 'secondary':
        variantStyles.backgroundColor = colors.secondary;
        break;
      default:
        variantStyles.backgroundColor = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
    }

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

    return [
      base,
      variantStyles,
      sizeStyles,
      conditionalStyles,
      style as ViewStyle,
    ];
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle = styles.baseButtonText;
    const variantTextStyles: TextStyle = {};
    const sizeTextStyles: TextStyle = {};

    switch (variant) {
      case 'primary':
        variantTextStyles.color = colors.white;
        break;
      case 'outline':
        variantTextStyles.color = isDisabled
          ? colors.primaryDisabled
          : colors.primary;
        break;
      case 'secondary':
        variantTextStyles.color = colors.white;
        break;
      default:
        variantTextStyles.color = colors.white;
    }

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

    return [base, variantTextStyles, sizeTextStyles, textStyle as TextStyle];
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'primary':
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
              <Text style={{color: getIconColor()}}>{leftIcon}</Text>
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && (
            <View style={styles.iconWrapper}>
              <Text style={{color: getIconColor()}}>{rightIcon}</Text>
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
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseButtonText: {
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  iconWrapper: {
    marginHorizontal: 8,
  },
});

export default StyledButton;

