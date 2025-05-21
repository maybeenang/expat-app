import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {colors, fonts} from '../../contants/styles';

interface ListFooterLoadingProps {
  isLoading: boolean;
  message?: string;
}

const ListFooterLoading: React.FC<ListFooterLoadingProps> = ({
  isLoading,
  message = 'Memuat lebih banyak...',
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ListFooterLoading;
