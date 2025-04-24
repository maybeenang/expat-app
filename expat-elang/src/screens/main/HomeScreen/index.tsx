import {StyleSheet, View} from 'react-native';
import StyledText from '../../../components/common/StyledText';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';

const HomeScreen = () => {
  return (
    <ScrollView style={style.container}>
      <StyledText style={style.title}>Home</StyledText>
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

export default React.memo(HomeScreen);
