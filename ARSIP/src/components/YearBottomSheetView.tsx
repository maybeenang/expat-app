import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import IcClose from '../assets/icons/ic_close.svg';
import IcRadio from '../assets/icons/ic_radio.svg';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {COLORS} from '../constants/COLORS';

// Generate last 10 years dynamically
const getLast10Years = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - index;
    return { id: year.toString(), label: year.toString() };
  });
};

const YearBottomSheetView = ({ onSelect, onClose }) => {
  const YEARS = getLast10Years();

  return (
    <BottomSheetScrollView style={styles.bottomSheetContent}>
      <View style={styles.titleContainer}>
        <Text style={TEXT_STYLES.text16SemiBold}>
          PILIH TAHUN
        </Text>
        <TouchableOpacity onPress={onClose}>
          <IcClose />
        </TouchableOpacity>
      </View>

      {YEARS.map((year, index) => (
        <React.Fragment key={year.id}>
          <TouchableOpacity onPress={() => onSelect(year)}>
            <View style={styles.itemContainer}>
              <Text style={TEXT_STYLES.text16}>{year.label}</Text>
            </View>
          </TouchableOpacity>
          {index < YEARS.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.fieldBorder,
  },
});

export default YearBottomSheetView;
