import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import COLORS from '../../../constants/colors';

interface StyledTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'bold';
}

const StyledText: React.FC<StyledTextProps> = ({
  style,
  weight = 'regular',
  children,
  ...props
}) => {
  let fontFamily = 'Roboto-Regular';
  if (weight === 'medium') {
    fontFamily = 'Roboto-Medium';
  } else if (weight === 'bold') {
    fontFamily = 'Roboto-Bold';
  }
  return (
    <Text style={[styles.baseText, { fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    color: COLORS.textPrimary,
  },
});

export default StyledText;
