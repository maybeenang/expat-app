import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import COLORS from '../../../constants/colors';

interface StyledButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary';
}

const StyledButton: React.FC<StyledButtonProps> = ({
  style,
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        style,
      ]}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
});

export default StyledButton;
