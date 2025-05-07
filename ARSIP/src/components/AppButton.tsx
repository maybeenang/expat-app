import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants/COLORS';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  marginTop?: number;
  marginBottom?: number;
}

const AppButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  marginTop = 0,
  marginBottom = 0,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabledButton,
        {marginTop, marginBottom},
      ]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8} // Prevent click effect if disabled
      disabled={disabled}>
      <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: COLORS.blue,
  },
  secondary: {
    backgroundColor: '#4CAF50',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: COLORS.grey2,
  },
  text: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'inter_semibold',
  },
  textOutline: {
    color: '#007AFF',
  },
});

export default AppButton;
