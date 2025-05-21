import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../components/common/Text';
import {colors} from '../../contants/styles';

export const Page12Screen = () => {
  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Page 12
      </Text>
      <Text variant="body" style={styles.subtitle}>
        This is Page 12 from bottom tab navigation
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 10,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
  },
}); 