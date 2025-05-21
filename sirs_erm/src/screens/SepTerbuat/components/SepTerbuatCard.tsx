import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Card} from '../../../components/common';
import {colors, fonts, numbers} from '../../../contants/styles';
import type {SepTerbuat} from '../../../types/sepTerbuat';

interface SepTerbuatCardProps {
  item: SepTerbuat;
}

export const SepTerbuatCard: React.FC<SepTerbuatCardProps> = ({item}) => {
  console.log('item', item);
  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>No. SEP</Text>
          <Text style={styles.value}>{item.noSep}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>No. Kartu</Text>
          <Text style={styles.value}>{item.noKartu}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{item.created_date}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Petugas</Text>
          <Text style={styles.value}>{item.nama_petugas_input}</Text>
        </View>
      </View>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Diagnosa</Text>
        <Text style={styles.value}>{item.diagAwal}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: numbers.margin,
  },
  row: {
    flexDirection: 'row',
    gap: numbers.margin,
    marginBottom: numbers.margin,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
});
