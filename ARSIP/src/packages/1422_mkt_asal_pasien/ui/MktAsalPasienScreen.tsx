import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {MktAsalPasienResponse} from '../models/mktAsalPasienResponse';
import {
  exportMktAsalPasien,
  getFilterDataMktAsalPasien,
  getMktAsalPasien,
} from '../services/mktAsalPasienService';
import ExportType from '../../../enums/ExportType';
import {DateUtils} from '../../../utils/dateUtils';
import {FileUtils} from '../../../utils/fileUtils';
import {MODULES} from '../../../constants/MODULES';
import {useSnackbar} from '../../../components/SnackbarContext';
import {STYLES} from '../../../constants/STYLES';
import {COLORS} from '../../../constants/COLORS';
import CustomAppBar from '../../../components/CustomAppBar';
import BottomSheetType from '../../../enums/BottomSheetType ';
import ExportBottomSheetView from '../../../components/ExportBottomSheetView';
import {TEXT_STYLES} from '../../../constants/TEXT_STYLES';
import AppButton from '../../../components/AppButton';
import FilterBottomSheet from '../../../components/FilterBottomSheetView';
import AppDataTable from '../../../components/AppDataTable';
import {FilterItem} from '../../../models/filterResponse';

const MktAsalPasienScreen = ({navigation}) => {
  const [selectedFilter] = useState('1');
  const [selectedFilterName, setSelectedFilterName] = useState('Month');
  const [selectedMonthId, setSelectedMonthId] = useState(
    DateUtils.getCurrentMonthData().id,
  );
  const [selectedMonthName, setSelectedMonthName] = useState(
    DateUtils.getCurrentMonthData().label,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<MktAsalPasienResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState(BottomSheetType.Month);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const {showSnackbar} = useSnackbar();

  //Extra Filters
  const [selectedReferringFacility, setSelectedReferringFacility] =
    useState('all');
  const filterDataTypes = useMemo(() => ['nama_faskes_perujuk'], []);
  const [referringFacilities, setReferringFacilities] = useState<FilterItem[]>(
    [],
  );

  const columns = [
    {label: 'ID Reg', field: 'id_reg', width: 100},
    {label: 'No Rm Pasien', field: 'no_rm_pasien'},
    {label: 'Panggilan Kehormatan', field: 'panggilan_kehormatan'},
    {label: 'Nama Pasien', field: 'nama_pasien'},
    {label: 'Pasien Baru Lama', field: 'pasien_baru_lama'},
    {label: 'Nama Penjamin', field: 'nama_penjamin'},
    {label: 'Nama Faskes Perujuk', field: 'nama_faskes_perujuk'},
    {label: 'Nama DPJP Faskes Perujuk', field: 'dpjp_faskes_perujuk'},
    {label: 'Cara Datang', field: 'cara_datang'},
    {label: 'No Rm DPJP', field: 'no_rm_dpjp'},
    {label: 'DPJP Dokter', field: 'nama_dpjp_dokter'},
  ];

  const handleExport = async (type: ExportType) => {
    setLoadingDialog(true);
    try {
      const result = await exportMktAsalPasien(
        type,
        selectedYear.toString(),
        selectedMonthId,
      );

      if (typeof result !== 'string') {
        await FileUtils.saveBase64(
          result?.data ?? '',
          MODULES['1422_MKT_ASAL_PASIEN'],
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

  const openBottomSheet = useCallback(type => {
    setBottomSheetType(type);
    bottomSheetRef.current?.present();
  }, []);
  const closeBottomSheet = () => bottomSheetRef.current?.dismiss();

  const handleSelect = (filter, value) => {
    setSelectedMonthId(value.month);
    setSelectedMonthName(value.monthName);
    setSelectedYear(value.year);
    setSelectedReferringFacility(value.referringFacility);
    console.log(value.referringFacility);
    closeBottomSheet();
  };

  const renderBottomSheet = () => {
    switch (bottomSheetType) {
      case BottomSheetType.Filter:
        return (
          <FilterBottomSheet
            onApply={handleSelect}
            onClose={closeBottomSheet}
            isOnlyShowMonth={true}
            noDate={false}
            selectedFilter={selectedFilterName}
            selectedYear={selectedYear.toString()}
            selectedMonth={selectedMonthName}
            showReferringFacility={true}
            referringFacilities={referringFacilities}
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getMktAsalPasien(
        selectedFilter,
        selectedYear.toString(),
        selectedMonthId,
        selectedReferringFacility,
      );
      setData(result);
      setLoading(false);

      filterDataTypes.forEach(filterDataType => {
        if (filterDataType === 'nama_faskes_perujuk' && result?.data) {
          const filters: FilterItem[] = [
            {value: 'All', name: 'All'},
            ...Array.from(
              new Set(
                result.data
                  .map(item => item.nama_faskes_perujuk?.trim())
                  .filter(name => !!name),
              ),
            ).map(name => ({
              value: name!,
              name: name!,
            })),
          ];

          setReferringFacilities(filters);
        }
      });
    };

    fetchData();
  }, [
    selectedFilter,
    selectedYear,
    selectedMonthId,
    filterDataTypes,
    selectedReferringFacility,
  ]);

  const getFormattedPeriod = () => {
    return selectedMonthName + ' ' + selectedYear;
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
            title={MODULES['1422_MKT_ASAL_PASIEN']}
            showBackButton={true}
            showFilterButton={true}
            onBackPress={() => navigation.goBack()}
            onFilterPress={() => openBottomSheet(BottomSheetType.Filter)}
          />

          <View style={styles.overviewContainer}>
            <View style={styles.overviewCard}>
              <Text style={styles.title}>Total Pasien</Text>
              <Text style={styles.value}>{data?.total_pasien}</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.title}>Pasien Baru</Text>
              <Text style={styles.value}>{data?.total_pasien_baru}</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.title}>Pasien Lama</Text>
              <Text style={styles.value}>{data?.total_pasien_lama}</Text>
            </View>
          </View>

          <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={BackdropElement}
            backgroundStyle={{backgroundColor: COLORS.white}}>
            {renderBottomSheet()}
          </BottomSheetModal>

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
                <View style={STYLES.mt12} />
                <AppDataTable data={data?.data} columns={columns} />
              </View>
            )}
          </View>
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
    backgroundColor: '#fff',
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
  dropdownWrapper: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.grey2,
    marginHorizontal: 8,
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
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {fontSize: 14, marginBottom: 8, textAlign: 'center'},
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
  graphicButton: {
    backgroundColor: '#007bff', // Blue for Show Graphic
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5, // Adjust spacing between pickers
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.blue,
  },
  overviewContainer: {
    flexDirection: 'row', // Ensure all cards are in one line
    justifyContent: 'space-between', // Distribute spacing evenly
    alignItems: 'center', // Align items in the center
    padding: 12,
  },
  overviewCard: {
    flex: 1, // Ensure equal width
    backgroundColor: '#fff',
    padding: 4,
    marginHorizontal: 5, // Space between cards
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
  },
});

export default MktAsalPasienScreen;
