import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleSheet} from 'react-native';
import {colors} from '../../contants/styles';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = colors.textPrimary,
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        {color},
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
}); 