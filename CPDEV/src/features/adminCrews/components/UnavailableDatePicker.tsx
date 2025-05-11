// src/features/adminCrews/components/ManageUnavailableDatesContent.tsx (Rename atau buat baru)

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type {AdminCrew} from '../types';
import {
  formatDateForBottomSheet,
  parseUnavailableDatesString,
} from '../../../utils/helpers';
import {StyledButton} from '../../../components/common';
import {colors, fonts, numbers} from '../../../contants/styles';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {CustomIcon} from '../../../components/common/CustomIcon';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Untuk ikon hapus

interface ManageUnavailableDatesContentProps {
  crew: AdminCrew;
  initialUnavailableDatesString: string | null | undefined; // String JSON dari data kru
  onSave: (updatedDateStrings: string[]) => void; // Kirim array string "YYYY-MM-DD"
  onCancel: () => void;
  isSaving: boolean;
}

const ManageUnavailableDatesContent: React.FC<
  ManageUnavailableDatesContentProps
> = ({crew, initialUnavailableDatesString, onSave, onCancel, isSaving}) => {
  const [currentDates, setCurrentDates] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  useEffect(() => {
    if (!initialUnavailableDatesString) {
      return;
    }

    setCurrentDates(JSON.parse(initialUnavailableDatesString));

    return () => {};
  }, [initialUnavailableDatesString]);

  const handleDateChangeForNewDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      handleAddNewDate(selectedDate);
    }
  };

  const handleAddNewDate = (selectedDate: Date) => {
    const newDateString = formatDateForBottomSheet(selectedDate);
    if (currentDates.includes(newDateString)) {
      Alert.alert('Info', 'Tanggal ini sudah ada dalam daftar.');
      return;
    }
    setCurrentDates(prevDates => [...prevDates, newDateString].sort());
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setCurrentDates(prevDates =>
      prevDates.filter(date => date !== dateToRemove),
    );
  };

  const handleSave = () => {
    onSave(currentDates); // Kirim array string tanggal yang sudah diupdate
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kelola Unavailable Date</Text>
      <Text style={styles.crewName}>Untuk: {crew.name}</Text>

      <BottomSheetFlatList
        style={styles.dateListContainer}
        showsVerticalScrollIndicator={false}
        data={currentDates}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.dateListItem}>
            <Text style={styles.dateText}>{item}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveDate(item)}
              style={styles.deleteButton}>
              <CustomIcon name="Trash" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noDatesText}>
            Belum ada tanggal tidak tersedia.
          </Text>
        }
        contentContainerStyle={{paddingBottom: numbers.padding}}
      />

      <View style={styles.addDateSection}>
        <StyledButton
          title="Tambah Tanggal Baru"
          onPress={() => setShowPicker(true)}
          variant="primary"
          style={styles.dateDisplayButton}
        />
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChangeForNewDate}
            style={styles.datePicker}
          />
        )}
      </View>

      <View style={styles.actionsContainer}>
        <StyledButton
          title="Batal"
          onPress={onCancel}
          variant="outlinePrimary"
          style={styles.actionButton}
        />
        <StyledButton
          title="Simpan Perubahan"
          onPress={handleSave}
          isLoading={isSaving}
          disabled={isSaving}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: numbers.padding,
    paddingTop: numbers.padding / 2,
    paddingBottom: numbers.padding,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  crewName: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: numbers.padding,
  },
  dateListContainer: {
    marginBottom: numbers.padding,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: numbers.borderRadius,
    padding: numbers.padding / 2,
  },
  dateListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
  },
  dateText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  deleteButton: {
    padding: 5,
  },
  noDatesText: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    paddingVertical: 20,
  },
  addDateSection: {
    paddingTop: numbers.padding / 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: numbers.padding,
  },
  addDateLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  dateDisplayButton: {
    marginBottom: numbers.padding / 2,
  },
  datePicker: {
    width: '100%',
    marginBottom: numbers.padding / 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingTop: numbers.padding,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: numbers.padding / 2,
  },
});

export default ManageUnavailableDatesContent;
