import React from 'react';
import {SafeAreaView, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../contants/styles';

const GLOBAL_STYLE = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({children, style}) => {
  return (
    <SafeAreaView style={[GLOBAL_STYLE.container, style]}>
      {children}
    </SafeAreaView>
  );
};

export default ScreenContainer;

