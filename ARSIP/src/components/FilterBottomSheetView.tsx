import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import IcClose from '../assets/icons/ic_close.svg';
import IcLeftArrow from '../assets/icons/ic_back.svg';
import IcRightArrow from '../assets/icons/ic_next.svg';
import IcDate from '../assets/icons/ic_date.svg';
import DatePicker from 'react-native-date-picker';
import {COLORS} from '../constants/COLORS';
import {FilterItem} from '../models/filterResponse';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface FilterBottomSheetProps {
  onClose: () => void;
  onApply: (filter, value) => void;
  isOnlyShowMonth: boolean;
  noDate: boolean;

  //Selected Filters
  selectedFilter?: string;
  selectedMonth?: string;
  selectedYear?: string;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;

  //Extra Filter
  showTreatmentRoomName?: boolean;
  treatmentRoomNames?: FilterItem[];
  showBedName?: boolean;
  bedNames?: FilterItem[];
  showClass?: boolean;
  classes?: FilterItem[];
  showPatientName?: boolean;
  patientNames?: FilterItem[];
  showSiranapCodeTreatmentClass?: boolean;
  siranapCodeTreatmentClasses?: FilterItem[];
  showSiranapCodeTreatmentRoom?: boolean;
  siranapCodeTreatmentRooms?: FilterItem[];
  showRsOnlineTreatment?: boolean;
  rsOnlineTreatments?: FilterItem[];
  showDinkesBedType?: boolean;
  dinkesBedTypes?: FilterItem[];
  showDpjpDoctorName?: boolean;
  dpjpDoctorNames?: FilterItem[];
  showIsNewPatient?: boolean;
  isNewPatients?: FilterItem[];
  showReferringFacility?: boolean;
  referringFacilities?: FilterItem[];
  showDeptOriginal?: boolean;
  deptOriginals?: FilterItem[];
  showDeptDestination?: boolean;
  deptDestinations?: FilterItem[];
  showPatientStatus?: boolean;
  patientStatuses?: FilterItem[];
  showAnalystName?: boolean;
  analystNames?: FilterItem[];
  showAnalystNoRm?: boolean;
  analystNoRms?: FilterItem[];
  showDpjpLabName?: boolean;
  dpjpLabNames?: FilterItem[];
  showDpjpLabNoRm?: boolean;
  dpjpLabNoRms?: FilterItem[];
  showPjLabName?: boolean;
  pjLabNames?: FilterItem[];
  showPjLabNoRm?: boolean;
  pjLabNoRms?: FilterItem[];
  showActivityName?: boolean;
  activityNames?: FilterItem[];

  //Selected Extra Filters
  selectedDeptOriginal?: string;
  selectedDeptDestination?: string;
  selectedPatientStatus?: string;
  selectedAnalystName?: string;
  selectedAnalystNoRm?: string;
  selectedDpjpLabName?: string;
  selectedDpjpLabNoRm?: string;
  selectedPjLabName?: string;
  selectedPjLabNoRm?: string;
  selectedActivityName?: string;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  onClose,
  onApply,
  isOnlyShowMonth,
  noDate,
  selectedFilter: selectedFilterProp,
  selectedMonth: selectedMonthProp,
  selectedYear: selectedYearProp,
  selectedDate: selectedDateProp,
  selectedStartDate: selectedStartDateProp,
  selectedEndDate: selectedEndDateProp,
  showTreatmentRoomName = false,
  treatmentRoomNames = [],
  showBedName = false,
  bedNames = [],
  showClass = false,
  classes = [],
  showPatientName = false,
  patientNames = [],
  showSiranapCodeTreatmentClass = false,
  siranapCodeTreatmentClasses = [],
  showSiranapCodeTreatmentRoom = false,
  siranapCodeTreatmentRooms = [],
  showRsOnlineTreatment = false,
  rsOnlineTreatments = [],
  showDinkesBedType = false,
  dinkesBedTypes = [],
  showDpjpDoctorName = false,
  dpjpDoctorNames = [],
  showIsNewPatient = false,
  isNewPatients = [],
  showReferringFacility = false,
  referringFacilities = [],
  showDeptOriginal = false,
  deptOriginals = [],
  selectedDeptOriginal: selectedDeptOriginalProp,
  showDeptDestination = false,
  deptDestinations = [],
  selectedDeptDestination: selectedDeptDestinationProp,
  showPatientStatus = false,
  patientStatuses = [],
  selectedPatientStatus: selectedPatientStatusProp,
  showAnalystName = false,
  analystNames = [],
  selectedAnalystName: selectedAnalystNameProp,
  showAnalystNoRm = false,
  analystNoRms = [],
  selectedAnalystNoRm: selectedAnalystNoRmProp,
  showDpjpLabName = false,
  dpjpLabNames = [],
  selectedDpjpLabName: selectedDpjpLabNameProp,
  showDpjpLabNoRm = false,
  dpjpLabNoRms = [],
  selectedDpjpLabNoRm: selectedDpjpLabNoRmProp,
  showPjLabName = false,
  pjLabNames = [],
  selectedPjLabName: selectedPjLabNameProp,
  showPjLabNoRm = false,
  pjLabNoRms = [],
  selectedPjLabNoRm: selectedPjLabNoRmProp,
  showActivityName = false,
  activityNames = [],
  selectedActivityName: selectedActivityNameProp,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(selectedFilterProp);
  const [year, setYear] = useState(selectedYearProp);
  const [selectedMonth, setSelectedMonth] = useState(selectedMonthProp);
  const [date, setDate] = useState(selectedDateProp);
  const [startDate, setStartDate] = useState(selectedStartDateProp);
  const [endDate, setEndDate] = useState(selectedEndDateProp);
  const [openStartPicker, setOpenStartPicker] = useState(true);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  //Extra Filters
  const [selectedTreatmentRoomName, setSelectedTreatmentRoomName] = useState(
    treatmentRoomNames.length > 0 ? treatmentRoomNames[0].value : 'all',
  );
  const [selectedBedName, setSelectedBedName] = useState(
    bedNames.length > 0 ? bedNames[0].value : 'all',
  );
  const [selectedClass, setSelectedClass] = useState(
    classes.length > 0 ? classes[0].value : 'all',
  );
  const [selectedPatientName, setSelectedPatientName] = useState(
    patientNames.length > 0 ? patientNames[0].value : 'all',
  );
  const [
    selectedSiranapCodeTreatmentClass,
    setSelectedSiranapCodeTreatmentClass,
  ] = useState(
    siranapCodeTreatmentClasses.length > 0
      ? siranapCodeTreatmentClasses[0].value
      : 'all',
  );
  const [
    selectedSiranapCodeTreatmentRoom,
    setSelectedSiranapCodeTreatmentRoom,
  ] = useState(
    siranapCodeTreatmentRooms.length > 0
      ? siranapCodeTreatmentRooms[0].value
      : 'all',
  );
  const [selectedRsOnlineTreatment, setSelectedRsOnlineTreatment] = useState(
    rsOnlineTreatments.length > 0 ? rsOnlineTreatments[0].value : 'all',
  );
  const [selectedDinkesBedType, setSelectedDinkesBedType] = useState(
    dinkesBedTypes.length > 0 ? dinkesBedTypes[0].value : 'all',
  );
  const [selectedDpjpDoctorName, setSelectedDpjpDoctorName] = useState(
    dpjpDoctorNames.length > 0 ? dpjpDoctorNames[0].value : 'all',
  );
  const [selectedIsNewPatient, setSelectedIsNewPatient] = useState(
    isNewPatients.length > 0 ? dpjpDoctorNames[0].value : 'all',
  );
  const [selectedReferringFacility, setSelectedReferringFacility] = useState(
    referringFacilities.length > 0 ? referringFacilities[0].value : 'all',
  );
  const [selectedDeptOriginal, setSelectedDeptOriginal] = useState(
    selectedDeptOriginalProp,
  );
  const [selectedDeptDestination, setSelectedDeptDestination] = useState(
    selectedDeptDestinationProp,
  );
  const [selectedPatientStatus, setSelectedPatientStatus] = useState(
    selectedPatientStatusProp,
  );
  const [selectedAnalystName, setSelectedAnalystName] = useState(
    selectedAnalystNameProp,
  );
  const [selectedAnalystNoRm, setSelectedAnalystNoRm] = useState(
    selectedAnalystNoRmProp,
  );
  const [selectedDpjpLabName, setSelectedDpjpLabName] = useState(
    selectedDpjpLabNameProp,
  );
  const [selectedDpjpLabNoRm, setSelectedDpjpLabNoRm] = useState(
    selectedDpjpLabNoRmProp,
  );
  const [selectedPjLabName, setSelectedPjLabName] = useState(
    selectedPjLabNameProp,
  );
  const [selectedPjLabNoRm, setSelectedPjLabNoRm] = useState(
    selectedPjLabNoRmProp,
  );
  const [selectedActivityName, setSelectedActivityName] = useState(
    selectedActivityNameProp,
  );

  const FILTER_TYPES = noDate
    ? ['Year', 'Month']
    : ['Year', 'Month', 'Date', 'Range'];
  const filterOptions = noDate
    ? {Year: 2, Month: 1}
    : {Year: 3, Month: 1, Date: 4, Range: 2};

  const getFilterValue = () => {
    const filterValue = {
      treatmentRoomName: selectedTreatmentRoomName,
      bedName: selectedBedName,
      class: selectedClass,
      patientName: selectedPatientName,
      siranapCodeTreatmentClass: selectedSiranapCodeTreatmentClass,
      siranapCodeTreatmentRoom: selectedSiranapCodeTreatmentRoom,
      rsOnlineTreatment: selectedRsOnlineTreatment,
      dinkesBedType: selectedDinkesBedType,
      dpjpDoctorName: selectedDpjpDoctorName,
      isNewPatient: selectedIsNewPatient,
      referringFacility: selectedReferringFacility,
      deptOriginal: selectedDeptOriginal,
      deptDestination: selectedDeptDestination,
      patientStatus: selectedPatientStatus,
      analystName: selectedAnalystName,
      analystNoRm: selectedAnalystNoRm,
      dpjpLabName: selectedDpjpLabName,
      dpjpLabNoRm: selectedDpjpLabNoRm,
      pjLabName: selectedPjLabName,
      pjLabNoRm: selectedPjLabNoRm,
      activityName: selectedActivityName,
    };

    switch (selectedFilter) {
      case 'Year':
        return {...filterValue, year};
      case 'Month':
        return {
          ...filterValue,
          month: String(MONTHS.indexOf(selectedMonth) + 1).padStart(2, '0'),
          monthName: selectedMonth,
          year,
        };
      case 'Date':
        return {...filterValue, date};
      case 'Range':
        return {...filterValue, startDate, endDate};
      default:
        return filterValue;
    }
  };

  return (
    <BottomSheetScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
        <TouchableOpacity onPress={onClose}>
          <IcClose />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>Type</Text>
      <View style={styles.filterRow}>
        {FILTER_TYPES.filter(type => !isOnlyShowMonth || type === 'Month').map(
          type => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedFilter(type)}
              style={[
                styles.filterButton,
                selectedFilter === type && styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === type && styles.filterTextActive,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Year Filter */}
      {selectedFilter === 'Year' && (
        <>
          <Text style={styles.label}>Select Year</Text>
          <View style={styles.yearSelector}>
            <TouchableOpacity
              onPress={() =>
                setYear((parseInt(year ?? '0', 10) - 1).toString())
              }>
              <IcLeftArrow />
            </TouchableOpacity>
            <Text style={styles.yearText}>{year}</Text>
            <TouchableOpacity
              onPress={() =>
                setYear((parseInt(year ?? '0', 10) + 1).toString())
              }>
              <IcRightArrow />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Month Filter */}
      {selectedFilter === 'Month' && (
        <>
          <Text style={styles.label}>Select Year</Text>
          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={() => setYear(year - 1)}>
              <IcLeftArrow />
            </TouchableOpacity>
            <Text style={styles.yearText}>{year}</Text>
            <TouchableOpacity onPress={() => setYear(year + 1)}>
              <IcRightArrow />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Select Month</Text>
          <View style={styles.monthGrid}>
            {MONTHS.map(month => (
              <TouchableOpacity
                key={month}
                onPress={() => setSelectedMonth(month)}
                style={[
                  styles.monthButton,
                  selectedMonth === month && styles.monthButtonActive,
                ]}>
                <Text
                  style={[
                    styles.monthText,
                    selectedMonth === month && styles.monthTextActive,
                  ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Day Filter */}
      {selectedFilter === 'Date' && (
        <DatePicker date={date} onDateChange={setDate} mode="date" />
      )}

      {/* Range Filter */}
      {selectedFilter === 'Range' && (
        <>
          <View style={styles.rangeSelector}>
            <TouchableOpacity
              onPress={() => {
                setOpenStartPicker(true);
                setOpenEndPicker(false);
              }}
              style={[
                styles.datePickerButton,
                openStartPicker && styles.datePickerButtonActive,
              ]}>
              <IcDate />
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            <Text>—</Text>
            <TouchableOpacity
              onPress={() => {
                setOpenStartPicker(false);
                setOpenEndPicker(true);
              }}
              style={[
                styles.datePickerButton,
                openEndPicker && styles.datePickerButtonActive,
              ]}>
              <IcDate />
              <Text>{endDate ? endDate.toDateString() : 'Select Date'}</Text>
            </TouchableOpacity>
          </View>
          {openStartPicker && (
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              mode="date"
            />
          )}
          {openEndPicker && (
            <DatePicker date={endDate} onDateChange={setEndDate} mode="date" />
          )}
        </>
      )}

      <SelectableGrid
        label="Select Nama Ruangan Perawatan"
        items={treatmentRoomNames}
        selectedValue={selectedTreatmentRoomName}
        setSelectedValue={setSelectedTreatmentRoomName}
        show={showTreatmentRoomName}
      />

      <SelectableGrid
        label="Select Nama Bed"
        items={bedNames}
        selectedValue={selectedBedName}
        setSelectedValue={setSelectedBedName}
        show={showBedName}
      />

      <SelectableGrid
        label="Select Kelas"
        items={classes}
        selectedValue={selectedClass}
        setSelectedValue={setSelectedClass}
        show={showClass}
      />

      <SelectableGrid
        label="Select Nama Pasien"
        items={patientNames}
        selectedValue={selectedPatientName}
        setSelectedValue={setSelectedPatientName}
        show={showPatientName}
      />

      <SelectableGrid
        label="Select Siranap Kelas Perawatan"
        items={siranapCodeTreatmentClasses}
        selectedValue={selectedSiranapCodeTreatmentClass}
        setSelectedValue={setSelectedSiranapCodeTreatmentClass}
        show={showSiranapCodeTreatmentClass}
      />

      <SelectableGrid
        label="Select Siranap Ruang Perawatan"
        items={siranapCodeTreatmentRooms}
        selectedValue={selectedSiranapCodeTreatmentRoom}
        setSelectedValue={setSelectedSiranapCodeTreatmentRoom}
        show={showSiranapCodeTreatmentRoom}
      />

      <SelectableGrid
        label="Select Rs Online Perawatan"
        items={rsOnlineTreatments}
        selectedValue={selectedRsOnlineTreatment}
        setSelectedValue={setSelectedRsOnlineTreatment}
        show={showRsOnlineTreatment}
      />

      <SelectableGrid
        label="Select Dinkes Jenis Bed"
        items={dinkesBedTypes}
        selectedValue={selectedDinkesBedType}
        setSelectedValue={setSelectedDinkesBedType}
        show={showDinkesBedType}
      />

      <SelectableGrid
        label="Select Nama DPJP Dokter"
        items={dpjpDoctorNames}
        selectedValue={selectedDpjpDoctorName}
        setSelectedValue={setSelectedDpjpDoctorName}
        show={showDpjpDoctorName}
      />

      <SelectableGrid
        label="Select Pasien Baru"
        items={isNewPatients}
        selectedValue={selectedIsNewPatient}
        setSelectedValue={setSelectedIsNewPatient}
        show={showIsNewPatient}
      />

      <SelectableGrid
        label="Select Faskes Perujuk"
        items={referringFacilities}
        selectedValue={selectedReferringFacility}
        setSelectedValue={setSelectedReferringFacility}
        show={showReferringFacility}
      />

      <SelectableGrid
        label="Select Deptori Nama Dept Ori"
        items={deptOriginals}
        selectedValue={selectedDeptOriginal}
        setSelectedValue={setSelectedDeptOriginal}
        show={showDeptOriginal}
      />

      <SelectableGrid
        label="Select Deptori Nama Dept Dest"
        items={deptDestinations}
        selectedValue={selectedDeptDestination}
        setSelectedValue={setSelectedDeptDestination}
        show={showDeptDestination}
      />

      <SelectableGrid
        label="Select Status Pasien"
        items={patientStatuses}
        selectedValue={selectedPatientStatus}
        setSelectedValue={setSelectedPatientStatus}
        show={showPatientStatus}
      />

      <SelectableGrid
        label="Select Analis Nama"
        items={analystNames}
        selectedValue={selectedAnalystName}
        setSelectedValue={setSelectedAnalystName}
        show={showAnalystName}
      />

      <SelectableGrid
        label="Select Analis No Rm"
        items={analystNoRms}
        selectedValue={selectedAnalystNoRm}
        setSelectedValue={setSelectedAnalystNoRm}
        show={showAnalystNoRm}
      />

      <SelectableGrid
        label="Select DPJP Lab Nama"
        items={dpjpLabNames}
        selectedValue={selectedDpjpLabName}
        setSelectedValue={setSelectedDpjpLabName}
        show={showDpjpLabName}
      />

      <SelectableGrid
        label="Select DPJP Lab No Rm"
        items={dpjpLabNoRms}
        selectedValue={selectedDpjpLabNoRm}
        setSelectedValue={setSelectedDpjpLabNoRm}
        show={showDpjpLabNoRm}
      />

      <SelectableGrid
        label="Select PJ Lab Nama"
        items={pjLabNames}
        selectedValue={selectedPjLabName}
        setSelectedValue={setSelectedPjLabName}
        show={showPjLabName}
      />

      <SelectableGrid
        label="Select PJ Lab No Rm"
        items={pjLabNoRms}
        selectedValue={selectedPjLabNoRm}
        setSelectedValue={setSelectedPjLabNoRm}
        show={showPjLabNoRm}
      />

      <SelectableGrid
        label="Select Nama Kegiatan"
        items={activityNames}
        selectedValue={selectedActivityName}
        setSelectedValue={setSelectedActivityName}
        show={showActivityName}
      />

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          const value = getFilterValue();
          onApply(filterOptions[selectedFilter], value);
        }}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </BottomSheetScrollView>
  );
};

const SelectableGrid = ({
  label,
  items,
  selectedValue,
  setSelectedValue,
  show,
}) => {
  if (!show) return null;

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.monthGrid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setSelectedValue(item.value)}
            style={[
              styles.monthButton,
              selectedValue === item.value && styles.monthButtonActive,
            ]}>
            <Text
              style={[
                styles.monthText,
                selectedValue === item.value && styles.monthTextActive,
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  datePickerButtonActive: {
    borderColor: COLORS.blue,
  },
  applyButton: {
    backgroundColor: COLORS.blue,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthButton: {
    width: '30%',
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  monthText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  monthTextActive: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FilterBottomSheet;
