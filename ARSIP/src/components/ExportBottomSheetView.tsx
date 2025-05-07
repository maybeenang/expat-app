import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import IcClose from '../assets/icons/ic_close.svg';
import IcPdf from '../assets/icons/ic_pdf.svg';
import IcExcel from '../assets/icons/ic_excel.svg';
import IcDocument from '../assets/icons/ic_document.svg';
import { TEXT_STYLES } from '../constants/TEXT_STYLES';
import { COLORS } from '../constants/COLORS';
import ExportType from '../enums/ExportType';

const FILTER_OPTIONS = [
  { id: ExportType.Excel, label: 'Excel', icon: <IcDocument /> },
  { id: ExportType.PDF, label: 'PDF', icon: <IcDocument /> },
];

const ExportBottomSheetView = ({ onSelect, onClose }) => {
  return (
    <BottomSheetView style={styles.bottomSheetContent}>
      <View style={styles.titleContainer}>
        <Text style={TEXT_STYLES.text16SemiBold}>Select File</Text>
        <TouchableOpacity onPress={onClose}>
          <IcClose />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Container for side-by-side buttons */}
      <View style={styles.buttonRow}>
        {FILTER_OPTIONS.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onSelect(item)} style={styles.button}>
            <View style={styles.buttonContent}>
              {item.icon}
              <Text style={[TEXT_STYLES.text14Medium, styles.buttonText]}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetView>
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.fieldBorder,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, // Spacing between buttons
  },
  button: {
    flex: 1, // Makes the buttons take equal space
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 8,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginTop: 10, // Space between icon and text
    textAlign: 'center',
  },
});

export default ExportBottomSheetView;
