import React from 'react';
import {StyleSheet, View} from 'react-native';
import StyledText from '../../../components/common/StyledText';
import {ScrollView} from 'react-native-gesture-handler';

const LawyerScreen = () => {
  return (
    <ScrollView style={style.container}>
      <StyledText style={style.title}>Lawyer</StyledText>
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

export default LawyerScreen;
