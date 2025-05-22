import React from 'react';
import {StyleSheet} from 'react-native';
import {colors, numbers} from '../../../contants/styles';
import {ScreenContainer} from '../../../components/common';
import FeatureButton from '../../../components/common/FeatureButton';
import {useNavigation} from '@react-navigation/native';

const CategoryScreen = () => {
  const navigation = useNavigation();

  const features = [
    {
      title: 'SEP Terbuat',
      onPress: () => {
        navigation.navigate('SepTerbuat' as never);
      },
    },
  ];

  return (
    <ScreenContainer style={styles.container}>
      {features.map((feature, index) => (
        <FeatureButton
          key={index}
          title={feature.title}
          onPress={feature.onPress}
        />
      ))}
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

export default CategoryScreen;
