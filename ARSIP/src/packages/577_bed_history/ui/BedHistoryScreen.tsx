import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  getBedHistory,
  exportBedHistory,
  getFilterDataBedHistory,
} from '../services/bedHistoryService';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {BedHistoryResponse} from '../models/bedHistoryResponse';
import ExportType from '../../../enums/ExportType';
import CustomAppBar from '../../../components/CustomAppBar';
import {COLORS} from '../../../constants/COLORS';
import {DateUtils} from '../../../utils/dateUtils';
import FilterBottomSheetView from '../../../components/FilterBottomSheetView';
import BottomSheetType from '../../../enums/BottomSheetType ';
import ExportBottomSheetView from '../../../components/ExportBottomSheetView';
import {FileUtils} from '../../../utils/fileUtils';
import {MODULES} from '../../../constants/MODULES';
import {STYLES} from '../../../constants/STYLES';
import {useSnackbar} from '../../../components/SnackbarContext';
import {TEXT_STYLES} from '../../../constants/TEXT_STYLES';
import AppButton from '../../../components/AppButton';
import AppDataTable from '../../../components/AppDataTable';
import {FilterItem} from '../../../models/filterResponse';

const BedHistoryScreen = ({navigation}) => {
  const [selectedFilterId, setSelectedFilterId] = useState('3');
  const [selectedFilterName, setSelectedFilterName] = useState('Year');
  const [selectedMonthId, setSelectedMonthId] = useState(
    DateUtils.getCurrentMonthData().id,
  );
  const [selectedMonthName, setSelectedMonthName] = useState(
    DateUtils.getCurrentMonthData().label,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<BedHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const snapPoints = useMemo(() => ['100%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState(
    BottomSheetType.Filter,
  );
  const {showSnackbar} = useSnackbar();

  //Extra Filters
  const [selectedTreatmentRoomName, setSelectedTreatmentRoomName] =
    useState('all');
  const [selectedBedName, setSelectedBedName] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPatientName, setSelectedPatientName] = useState('all');
  const [
    selectedSiranapCodeTreatmentClass,
    setSelectedSiranapCodeTreatmentClass,
  ] = useState('all');
  const [
    selectedSiranapCodeTreatmentRoom,
    setSelectedSiranapCodeTreatmentRoom,
  ] = useState('all');
  const [selectedRsOnlineTreatment, setSelectedRsOnlineTreatment] =
    useState('all');
  const [selectedDinkesBedType, setSelectedDinkesBedType] = useState('all');
  const [selectedDpjpDoctorName, setSelectedDpjpDoctorName] = useState('all');
  const [selectedIsNewPatient, setSelectedIsNewPatient] = useState('all');

  const filterDataTypes = useMemo(
    () => [
      'nama_ruangan_perawatan',
      'nama_bed',
      'kelas',
      'nama_pasien',
      'kode_siranap_kelas_perawatan',
      'kode_siranap_ruang_perawatan',
      'rsonline_perawatan',
      'dinkes_jenis_bed',
      'nama_dpjp_dokter',
      'is_pasien_baru',
    ],
    [],
  );

  const [treatmentRoomNames, setTreatmentRoomNames] = useState<FilterItem[]>(
    [],
  );
  const [bedNames, setBedNames] = useState<FilterItem[]>([]);
  const [classes, setClasses] = useState<FilterItem[]>([]);
  const [patientNames, setPatientNames] = useState<FilterItem[]>([]);
  const [siranapCodeTreatmentClasses, setSiranapCodeTreatmentClasses] =
    useState<FilterItem[]>([]);
  const [siranapCodeTreatmentRooms, setSiranapCodeTreatmentRooms] = useState<
    FilterItem[]
  >([]);
  const [rsOnlineTreatments, setRsOnlineTreatments] = useState<FilterItem[]>(
    [],
  );
  const [dinkesBedTypes, setDinkesBedTypes] = useState<FilterItem[]>([]);
  const [dpjpDoctorNames, setDpjpDoctorNames] = useState<FilterItem[]>([]);
  const [isNewPatients, setIsNewPatients] = useState<FilterItem[]>([]);

  const columns = [
    {label: 'ID Bed', field: 'id_bed', width: 100},
    {label: 'Bed Occupied Date', field: 'bed_occupied_date'},
    {label: 'Nama Ruangan Perawatan', field: 'nama_ruangan_perawatan'},
    {label: 'Nama Bed', field: 'nama_bed'},
    {label: 'Kelas', field: 'kelas'},
    {label: 'No RM Pasien', field: 'no_rm_pasien'},
    {label: 'Honorifics', field: 'honorifics'},
    {label: 'Nama Pasien', field: 'nama_pasien'},
    {label: 'ID Visit', field: 'id_visit'},
    {label: 'ID Reg', field: 'id_reg', width: 100},
    {label: 'ID Episode', field: 'id_episode', width: 100},
    {label: 'Nama Penjamin', field: 'nama_penjamin'},
    {label: 'Nama Dept Asal', field: 'nama_dept_asal'},
    {label: 'Nama PJ Visit', field: 'nama_pj_visit'},
    {label: 'Check in Bed', field: 'check_in_bed'},
    {label: 'Check out Bed', field: 'check_out_bed'},
    {label: 'Check in Petugas', field: 'checkin_petugas'},
    {label: 'Check out Petugas', field: 'checkout_petugas'},
    {label: 'Nama Cara Datang', field: 'nama_cara_datang'},
    {label: 'No Reg', field: 'no_reg'},
    {label: 'No Visit', field: 'no_visit'},
    {
      label: 'Kode Siranap Kelas Perawatan',
      field: 'kode_siranap_kelas_perawatan',
    },
    {
      label: 'Kode Siranap Ruang Perawatan',
      field: 'kode_siranap_ruang_perawatan',
    },
    {label: 'Rsonline Perawatan', field: 'rsonline_perawatan'},
    {label: 'Dinkes Jenis Bed', field: 'dinkes_jenis_bed'},
    {label: 'Nama DPJP Dokter', field: 'nama_dpjp_dokter'},
    {label: 'Pasien Baru', field: 'is_pasien_baru'},
    {label: 'Pasien Luar', field: 'is_pasien_luar'},
    {label: 'ID Kamar', field: 'id_kamar'},
    {label: 'ID Dept', field: 'id_dept'},
    {label: 'Jenis Rawat', field: 'jenis_rawat'},
    {label: 'Umur', field: 'umur'},
    {label: 'Covid', field: 'is_covid'},
    {label: 'Pasien Titip', field: 'is_pasien_titip'},
    {label: 'Grup EWS', field: 'grup_ews'},
    {label: 'Is BOR', field: 'is_bor'},
    {label: 'Siranap Perawatan', field: 'siranap_perawatan'},
  ];

  const openBottomSheet = useCallback(type => {
    setBottomSheetType(type);
    bottomSheetRef.current?.present();
  }, []);
  const closeBottomSheet = () => bottomSheetRef.current?.dismiss();

  const handleSelect = (filter, value) => {
    setSelectedFilterId(filter);
    setSelectedTreatmentRoomName(value.treatmentRoomName);
    setSelectedBedName(value.bedName);
    setSelectedClass(value.class);
    setSelectedPatientName(value.patientName);
    setSelectedSiranapCodeTreatmentClass(value.siranapCodeTreatmentClass);
    setSelectedSiranapCodeTreatmentRoom(value.siranapCodeTreatmentRoom);
    setSelectedRsOnlineTreatment(value.rsOnlineTreatment);
    setSelectedDinkesBedType(value.dinkesBedType);
    setSelectedDpjpDoctorName(value.dpjpDoctorName);
    setSelectedIsNewPatient(value.isNewPatient);

    switch (filter) {
      case 1:
        setSelectedMonthId(value.month);
        setSelectedMonthName(value.monthName);
        setSelectedYear(value.year);
        setSelectedFilterName('Month');
        break;
      case 2:
        setStartDate(value.startDate);
        setEndDate(value.endDate);
        setSelectedFilterName('Range');
        break;
      case 3:
        setSelectedYear(value.year);
        setSelectedFilterName('Year');
        break;
      case 4:
        setSelectedDate(value.date);
        setSelectedFilterName('Date');
    }
    closeBottomSheet();
  };

  const renderBottomSheet = () => {
    switch (bottomSheetType) {
      case BottomSheetType.Filter:
        return (
          <FilterBottomSheetView
            onApply={handleSelect}
            onClose={closeBottomSheet}
            isOnlyShowMonth={false}
            noDate={false}
            selectedFilter={selectedFilterName}
            selectedYear={selectedYear.toString()}
            selectedMonth={selectedMonthName}
            selectedDate={selectedDate}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
            showTreatmentRoomName={true}
            treatmentRoomNames={treatmentRoomNames}
            showBedName={true}
            bedNames={bedNames}
            showClass={true}
            classes={classes}
            showPatientName={true}
            patientNames={patientNames}
            showSiranapCodeTreatmentClass={true}
            siranapCodeTreatmentClasses={siranapCodeTreatmentClasses}
            showSiranapCodeTreatmentRoom={true}
            siranapCodeTreatmentRooms={siranapCodeTreatmentRooms}
            showRsOnlineTreatment={true}
            rsOnlineTreatments={rsOnlineTreatments}
            showDinkesBedType={true}
            dinkesBedTypes={dinkesBedTypes}
            showDpjpDoctorName={true}
            dpjpDoctorNames={dpjpDoctorNames}
            showIsNewPatient={true}
            isNewPatients={isNewPatients}
          />
        );
      case BottomSheetType.Export:
        return (
          <ExportBottomSheetView
            onSelect={item => {
              handleExport(item.id);
              closeBottomSheet();
            }}
            onClose={closeBottomSheet}
          />
        );
      default:
        return null;
    }
  };

  const BackdropElement = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const handleExport = async (type: ExportType) => {
    setLoadingDialog(true);
    try {
      const result = await exportBedHistory(
        type,
        selectedFilterId,
        '0',
        selectedYear.toString(),
        selectedMonthId,
        selectedDate.toISOString().split('T')[0],
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        selectedTreatmentRoomName,
        selectedBedName,
        selectedClass,
        selectedPatientName,
        selectedSiranapCodeTreatmentClass,
        selectedSiranapCodeTreatmentRoom,
        selectedRsOnlineTreatment,
        selectedDinkesBedType,
        selectedDpjpDoctorName,
        selectedIsNewPatient,
      );

      if (typeof result !== 'string') {
        await FileUtils.saveBase64(
          result?.data ?? '',
          MODULES['577_BED_HISTORY'],
          type,
          showSnackbar,
        );
      } else {
        showSnackbar(result, 'error');
      }

      setLoadingDialog(false);
    } catch (error) {
      showSnackbar(error, 'error');
      setLoadingDialog(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getBedHistory(
        selectedFilterId,
        selectedYear.toString(),
        selectedMonthId,
        DateUtils.formatDateToYMD(selectedDate),
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        selectedTreatmentRoomName,
        selectedBedName,
        selectedClass,
        selectedPatientName,
        selectedSiranapCodeTreatmentClass,
        selectedSiranapCodeTreatmentRoom,
        selectedRsOnlineTreatment,
        selectedDinkesBedType,
        selectedDpjpDoctorName,
        selectedIsNewPatient,
      );
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [
    selectedFilterId,
    selectedYear,
    selectedMonthId,
    selectedDate,
    startDate,
    endDate,
    selectedTreatmentRoomName,
    selectedBedName,
    selectedClass,
    selectedPatientName,
    selectedSiranapCodeTreatmentClass,
    selectedSiranapCodeTreatmentRoom,
    selectedRsOnlineTreatment,
    selectedDinkesBedType,
    selectedDpjpDoctorName,
    selectedIsNewPatient,
  ]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        filterDataTypes.forEach(async filterDataType => {
          const result = await getFilterDataBedHistory(filterDataType);
          switch (filterDataType) {
            case 'nama_ruangan_perawatan':
              setTreatmentRoomNames(result);
              break;
            case 'nama_bed':
              setBedNames(result);
              break;
            case 'kelas':
              setClasses(result);
              break;
            case 'nama_pasien':
              setPatientNames(result);
              break;
            case 'kode_siranap_kelas_perawatan':
              setSiranapCodeTreatmentClasses(result);
              break;
            case 'kode_siranap_ruang_perawatan':
              setSiranapCodeTreatmentRooms(result);
              break;
            case 'rsonline_perawatan':
              setRsOnlineTreatments(result);
              break;
            case 'dinkes_jenis_bed':
              setDinkesBedTypes(result);
              break;
            case 'nama_dpjp_dokter':
              setDpjpDoctorNames(result);
              break;
            case 'is_pasien_baru':
              setIsNewPatients(result);
              break;

            default:
              break;
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilterData();
  }, [filterDataTypes]);

  const getFormattedPeriod = () => {
    switch (selectedFilterName) {
      case 'Year':
        return selectedYear.toString();
      case 'Month':
        return selectedMonthName + ' ' + selectedYear;
      case 'Date':
        return DateUtils.formatDate(selectedDate);
      case 'Range':
        return (
          DateUtils.formatDate(startDate) +
          ' - ' +
          DateUtils.formatDate(endDate)
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={loadingDialog}
            customIndicator={
              <View style={STYLES.spinnerContainer}>
                <ActivityIndicator size="large" color={COLORS.blue} />
              </View>
            }
          />
          <CustomAppBar
            title={MODULES['577_BED_HISTORY']}
            showBackButton={true}
            showFilterButton={true}
            onBackPress={() => navigation.goBack()}
            onFilterPress={() => openBottomSheet(BottomSheetType.Filter)}
          />

          <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={BackdropElement}
            backgroundStyle={{backgroundColor: COLORS.white}}>
            {renderBottomSheet()}
          </BottomSheetModal>

          {
            <View style={styles.content}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.blue}
                  style={styles.loader}
                />
              ) : (
                <View style={styles.content}>
                  <Text style={TEXT_STYLES.text18SemiBold}>Data</Text>
                  <View style={STYLES.mt4} />
                  <Text style={TEXT_STYLES.text14}>
                    Periode : {getFormattedPeriod()}
                  </Text>
                  {data && data.data.length > 0 ? (
                    <AppDataTable data={data.data} columns={columns} />
                  ) : (
                    <Text style={styles.noDataText}>Tidak ada data</Text>
                  )}
                </View>
              )}
            </View>
          }

          <View style={styles.bottomContainer}>
            <AppButton
              title="Export"
              onPress={() => {
                if (data?.data.length === 0 || data?.data === undefined) {
                  showSnackbar('Data kosong, tidak bisa export!', 'error');
                  return;
                }
                openBottomSheet(BottomSheetType.Export);
              }}
            />
          </View>
        </SafeAreaView>
      </BottomSheetModalProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: COLORS.white,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2}, // Top shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // For Android
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  dateButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  dateButtonRange: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {fontWeight: 'bold', fontSize: 16},
  noDataText: {textAlign: 'center', marginTop: 20, fontSize: 16},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    gap: 2,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  excelButton: {
    backgroundColor: '#28a745', // Green for Excel
  },
  pdfButton: {
    backgroundColor: '#dc3545', // Red for PDF
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exportButton: {
    width: '100%',
    backgroundColor: '#28a745',
    alignItems: 'center',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 20,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownWrapper: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.grey2,
    marginHorizontal: 8,
  },
  chartContainer: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BedHistoryScreen;
