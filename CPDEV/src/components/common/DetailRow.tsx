import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {colors, fonts, numbers} from '../../contants/styles';

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  containerStyle?: ViewStyle;
  isHtml?: boolean; // Jika value adalah HTML (belum diimplementasikan di sini, tapi bisa jadi ekstensi)
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  labelStyle,
  valueStyle,
  containerStyle,
}) => {
  if (value === null || value === undefined || value === '') {
    return null; // Jangan render jika value kosong
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}:</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: numbers.padding / 2,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginRight: 8,
    minWidth: 100, // Beri lebar minimum untuk label agar rapi
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default DetailRow;
