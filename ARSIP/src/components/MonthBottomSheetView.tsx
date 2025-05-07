import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import IcClose from '../assets/icons/ic_close.svg';
import IcRadio from '../assets/icons/ic_radio.svg';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {COLORS} from '../constants/COLORS';

const MONTHS = [
  {id: '01', label: 'Januari'},
  {id: '02', label: 'Februari'},
  {id: '03', label: 'Maret'},
  {id: '04', label: 'April'},
  {id: '05', label: 'Mei'},
  {id: '06', label: 'Juni'},
  {id: '07', label: 'Juli'},
  {id: '08', label: 'Agustus'},
  {id: '09', label: 'September'},
  {id: '10', label: 'Oktober'},
  {id: '11', label: 'November'},
  {id: '12', label: 'Desember'},
];

const MonthBottomSheetView = ({onSelect, onClose}) => {
  return (
    <BottomSheetScrollView style={styles.bottomSheetContent}>
      <View style={styles.titleContainer}>
        <Text style={[TEXT_STYLES.text16SemiBold]}>
          PILIH BULAN
        </Text>
        <TouchableOpacity onPress={onClose}>
          <IcClose />
        </TouchableOpacity>
      </View>

      {MONTHS.map((month, index) => (
        <React.Fragment key={month.id}>
          <TouchableOpacity onPress={() => onSelect(month)}>
            <View style={styles.itemContainer}>
              <Text style={TEXT_STYLES.text16}>{month.label}</Text>
            </View>
          </TouchableOpacity>
          {index < MONTHS.length - 1 && <View style={styles.divider} />}
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

export default MonthBottomSheetView;
