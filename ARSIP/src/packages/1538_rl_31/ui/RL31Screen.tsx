import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import {getRl31, exportRL31} from '../services/rl31Service';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {RL31Item, RL31Response} from '../models/rl31Response';
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
import {columns} from '../data/rl31Column';

const RL31Screen = ({navigation}) => {
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
  const [data, setData] = useState<RL31Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const snapPoints = useMemo(() => ['100%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState(
    BottomSheetType.Filter,
  );
  const {showSnackbar} = useSnackbar();

  const openBottomSheet = useCallback(type => {
    setBottomSheetType(type);
    bottomSheetRef.current?.present();
  }, []);
  const closeBottomSheet = () => bottomSheetRef.current?.dismiss();

  const handleSelect = (filter, value) => {
    setSelectedFilterId(filter);
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
      const result = await exportRL31(
        type,
        selectedFilterId,
        '0',
        selectedYear.toString(),
        selectedMonthId,
        selectedDate.toISOString().split('T')[0],
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
      );

      if (typeof result !== 'string') {
        await FileUtils.saveBase64(
          result?.data ?? '',
          MODULES['1538_RL_31'],
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
      const result = await getRl31(
        selectedFilterId,
        selectedYear.toString(),
        selectedMonthId,
        DateUtils.formatDateToYMD(selectedDate),
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
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
  ]);

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
            title={MODULES['1538_RL_31']}
            showBackButton={true}
            showFilterButton={true}
            onBackPress={() => navigation.goBack()}
            onFilterPress={() => openBottomSheet(BottomSheetType.Filter)}
          />

          <ScrollView>
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
                    {data && data.length > 0 ? (
                      <AppDataTable data={data} columns={columns} />
                    ) : (
                      <Text style={styles.noDataText}>Tidak ada data</Text>
                    )}
                  </View>
                )}
              </View>
            }
          </ScrollView>

          <View style={styles.bottomContainer}>
            <AppButton
              title="Export"
              onPress={() => {
                if (data?.length === undefined) {
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
    minHeight: Dimensions.get('window').height - 180,
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

export default RL31Screen;
