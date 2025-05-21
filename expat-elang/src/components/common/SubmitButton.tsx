import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../constants/colors';

interface SubmitButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  label: string;
  variant?: 'primary' | 'secondary';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  isLoading = false,
  isDisabled = false,
  label,
  variant = 'primary',
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.secondaryButton,
    (isLoading || isDisabled) && styles.disabledButton,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'secondary' && styles.secondaryButtonText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isLoading || isDisabled}
      activeOpacity={0.8}>
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default SubmitButton; 