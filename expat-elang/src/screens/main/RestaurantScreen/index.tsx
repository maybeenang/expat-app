import React from 'react';
import {StyleSheet, View} from 'react-native';
import StyledText from '../../../components/common/StyledText';
import {ScrollView} from 'react-native-gesture-handler';

const RestaurantScreen = () => {
  return (
    <ScrollView style={style.container}>
      <StyledText style={style.title}>Restaurant</StyledText>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default RestaurantScreen;
