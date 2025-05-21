import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {colors} from '../../contants/styles';

interface CardProps extends ViewProps {}

const Card: React.FC<CardProps> = ({children, style, ...props}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card; 