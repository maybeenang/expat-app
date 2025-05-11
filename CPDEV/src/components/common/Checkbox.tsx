import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, fonts, numbers} from '../../contants/styles';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  checkboxSize?: number;
  containerStyle?: ViewStyle;
  checkboxStyle?: ViewStyle;
  checkedCheckboxStyle?: ViewStyle; // Style saat checked
  labelStyle?: TextStyle;
  testID?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  disabled = false,
  checkboxSize = 22,
  containerStyle,
  checkboxStyle,
  checkedCheckboxStyle,
  labelStyle,
  testID,
}) => {
  const iconName = checked
    ? 'checkbox-marked-outline'
    : 'checkbox-blank-outline';
  const iconColor = disabled
    ? colors.textDisabled
    : checked
    ? colors.primary
    : colors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{checked, disabled}}
      accessibilityLabel={label || 'Checkbox'}
      testID={testID}>
      <View
        style={[
          styles.checkboxBase,
          {
            width: checkboxSize,
            height: checkboxSize,
            borderRadius: checkboxSize / 5,
          },
          checkboxStyle,
          checked && styles.checkboxChecked,
          checked && checkedCheckboxStyle,
          disabled && styles.checkboxDisabled,
        ]}>
        {checked && (
          // <Icon name="check" size={checkboxSize * 0.7} color={colors.white} />
          // Placeholder jika tidak ada ikon:
          <Text
            style={{
              color: colors.white,
              fontSize: checkboxSize * 0.6,
              fontWeight: 'bold',
            }}>
            ✓
          </Text>
        )}
      </View>
      {label && (
        <Text
          style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Spasi vertikal
  },
  checkboxBase: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.greyMedium,
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxDisabled: {
    backgroundColor: colors.greyLight,
    borderColor: colors.greyDark,
  },
  label: {
    marginLeft: numbers.padding / 1.5,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
});

export default React.memo(Checkbox);
