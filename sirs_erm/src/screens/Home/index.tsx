import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, numbers} from '../../contants/styles';
import FeatureButton from '../../components/common/FeatureButton';
import {useNavigation} from '@react-navigation/native';
import {ScreenContainer} from '../../components/common';

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer style={styles.container}>
      <FeatureButton
        title="Category"
        onPress={() => {
          navigation.navigate('Category' as never);
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: numbers.padding,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});

