import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {colors, fonts, numbers} from '../../contants/styles';
import {StyledButton} from '.';

interface EmptyListProps {
  message?: string;
  isLoading?: boolean; // Jika loading awal, tampilkan spinner
  onRefresh?: () => void; // Jika ada fungsi refresh
  refreshing?: boolean;
}

const EmptyListComponent: React.FC<EmptyListProps> = ({
  message = 'Tidak ada data untuk ditampilkan.',
  isLoading = false,
  onRefresh,
  refreshing = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Icon name="information-outline" size={48} color={colors.greyMedium} /> */}
      <Text style={styles.message}>{message}</Text>
      {onRefresh && (
        <StyledButton
          title={refreshing ? 'Menyegarkan...' : 'Coba Lagi'}
          onPress={onRefresh}
          variant="outlinePrimary"
          size="small"
          isLoading={refreshing}
          style={{marginTop: numbers.padding}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: numbers.padding * 2,
    minHeight: 200, // Pastikan ada ruang cukup untuk pesan
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: numbers.padding / 2,
  },
});

export default EmptyListComponent;
