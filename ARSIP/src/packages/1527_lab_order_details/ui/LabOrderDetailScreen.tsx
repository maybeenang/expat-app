import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  getLabOrderDetail,
  exportLabOrderDetail,
  getFilterDataLabOrderDetail,
} from '../services/labOrderDetailService';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {LabOrderDetailResponse} from '../models/labOrderDetailResponse';
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

const LabOrderDetailScreen = ({navigation}) => {
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
  const [data, setData] = useState<LabOrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const snapPoints = useMemo(() => ['100%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState(
    BottomSheetType.Filter,
  );
  const {showSnackbar} = useSnackbar();

  //Extra Filters
  const [selectedDeptOriginal, setSelectedDeptOriginal] = useState('all');
  const [selectedDeptDestination, setSelectedDeptDestination] = useState('all');
  const [selectedPatientStatus, setSelectedPatientStatus] = useState('all');
  const [selectedAnalystName, setSelectedAnalystName] = useState('all');
  const [selectedAnalystNoRm, setSelectedAnalystNoRm] = useState('all');
  const [selectedDpjpLabName, setSelectedDpjpLabName] = useState('all');
  const [selectedDpjpLabNoRm, setSelectedDpjpLabNoRm] = useState('all');
  const [selectedPjLabName, setSelectedPjLabName] = useState('all');
  const [selectedPjLabNoRm, setSelectedPjLabNoRm] = useState('all');
  const [selectedActivityName, setSelectedActivityName] = useState('all');

  const filterDataTypes = useMemo(
    () => [
      'deptori_nama_dept_ori',
      'deptori_nama_dept_dest',
      'status_pasien',
      'nama_pasien',
      'analis_nama',
      'analis_no_rm',
      'dpjp_lab_nama',
      'dpjp_lab_no_rm',
      'pj_lab_nama',
      'pj_lab_no_rm',
      'nama_kegiatan',
    ],
    [],
  );

  const [deptOriginals, setDeptOriginals] = useState<FilterItem[]>([]);
  const [deptDestinations, setDeptDestinations] = useState<FilterItem[]>([]);
  const [patientStatuses, setPatientStatuses] = useState<FilterItem[]>([]);
  const [analystNames, setAnalystNames] = useState<FilterItem[]>([]);
  const [analystNoRms, setAnalystNoRms] = useState<FilterItem[]>([]);
  const [dpjpLabNames, setDpjpLabNames] = useState<FilterItem[]>([]);
  const [dpjpLabNoRms, setDpjpLabNoRms] = useState<FilterItem[]>([]);
  const [pjLabNames, setPjLabNames] = useState<FilterItem[]>([]);
  const [pjLabNoRms, setPjLabNoRms] = useState<FilterItem[]>([]);
  const [activityNames, setActivityNames] = useState<FilterItem[]>([]);

  const columns = [
    {label: 'ID Ref Lab Order', field: 'id_ref_lab_order'},
    {label: 'ID Ref Order Jenis Pasien', field: 'id_ref_order_jenis_pasien'},
    {label: 'ID Episode', field: 'id_episode'},
    {label: 'ID Kel', field: 'id_kel'},
    {label: 'ID Reg', field: 'id_reg'},
    {label: 'ID Order Poli Details', field: 'id_order_poli_details'},
    {label: 'ID Order', field: 'id_order'},
    {label: 'ID Visit', field: 'id_visit'},
    {label: 'ID Pasien Episode', field: 'id_pasien_episode'},
    {label: 'ID Dept Ori', field: 'id_dept_ori'},
    {label: 'ID Dept Dest', field: 'id_dept_dest'},
    {label: 'ID RS Antrean CS', field: 'id_rs_antrean_cs'},
    {label: 'ID Order Poli', field: 'id_order_poli'},
    {label: 'ID Ref Tarif Group', field: 'id_ref_tarif_group'},
    {label: 'ID Ref Kegiatan', field: 'id_ref_kegiatan'},
    {label: 'ID Group Ref Kegiatan', field: 'id_group_ref_kegiatan'},
    {label: 'ID Parent Ref Kegiatan', field: 'id_parent_ref_kegiatan'},
    {label: 'Created Date', field: 'created_date'},
    {label: 'Input Date', field: 'input_date'},
    {label: 'Preapproved Date', field: 'preapproved_date'},
    {label: 'Approved Date', field: 'approved_date'},
    {label: 'Deptori Nama Dept Ori', field: 'deptori_nama_dept_ori'},
    {label: 'Nama Pasien', field: 'nama_pasien'},
    {label: 'Alamat Pasien', field: 'alamat_pasien'},
    {label: 'Status Pasien', field: 'status_pasien'},
    {label: 'Deptori Nama Dept Dest', field: 'deptori_nama_dept_dest'},
    {label: 'Hasil Lab Klinis Pasien', field: 'hasillab_klinis_pasien'},
    {label: 'Created By', field: 'created_by'},
    {label: 'Orderp No Order', field: 'orderp_no_order'},
    {label: 'Cito', field: 'cito'},
    {label: 'No RM', field: 'no_rm'},
    {label: 'No Reg', field: 'no_reg'},
    {label: 'Catatan', field: 'catatan'},
    {label: 'Kesan', field: 'kesan'},
    {label: 'Pesan', field: 'pesan'},
    {label: 'Selesai Pemeriksaan', field: 'selesai_pemeriksaan'},
    {label: 'Sample Diterima', field: 'sample_diterima'},
    {label: 'Analis Nama', field: 'analis_nama'},
    {label: 'Analis No RM', field: 'analis_no_rm'},
    {label: 'DPJP Lab Nama', field: 'dpjp_lab_nama'},
    {label: 'DPJP Lab No RM', field: 'dpjp_lab_no_rm'},
    {label: 'PJ Lab Nama', field: 'pj_lab_nama'},
    {label: 'PJ Lab No RM', field: 'pj_lab_no_rm'},
    {label: 'DPJP NIP', field: 'dpjp_nip'},
    {label: 'XStatus', field: 'xstatus'},
    {label: 'Preapproved By', field: 'preapproved_by'},
    {label: 'Approved By', field: 'approved_by'},
    {label: 'Tarif Penjamin', field: 'tarif_penjamin'},
    {label: 'Tarif Kelas', field: 'tarif_kelas'},
    {label: 'Orderp Nama Tarif', field: 'orderpd_nama_tarif'},
    {label: 'Nama Kegiatan', field: 'nama_kegiatan'},
    {label: 'Harga Normal', field: 'harga_normal'},
    {label: 'Harga Tarif', field: 'harga_tarif'},
    {label: 'Harga Satuan', field: 'harga_satuan'},
    {label: 'Harga UP', field: 'harga_up'},
    {label: 'Harga Diskon', field: 'harga_diskon'},
    {label: 'Tarif Group', field: 'tarif_group'},
    {label: 'Tarif Jenis Rawat', field: 'tarif_jenis_rawat'},
    {label: 'Resume Billing Group', field: 'resume_billing_group'},
    {label: 'Kode Transaksi Pembayaran', field: 'kode_transaksi_pembayaran'},
    {label: 'Cara Pembayaran', field: 'cara_pembayaran'},
    {label: 'Tipe Lab Order', field: 'tipe_lab_order'},
    {label: 'Sumber Test Covid', field: 'sumber_test_covid'},
    {label: 'Tipe Test Covid', field: 'tipe_test_covid'},
    {label: 'Tarif Excess', field: 'tarif_excess'},
    {
      label: 'Tanggal Order Terkirim ke LIS',
      field: 'tanggal_data_order_terkirim_ke_lis',
    },
  ];

  const openBottomSheet = useCallback(type => {
    setBottomSheetType(type);
    bottomSheetRef.current?.present();
  }, []);
  const closeBottomSheet = () => bottomSheetRef.current?.dismiss();

  const handleSelect = (filter, value) => {
    setSelectedFilterId(filter);
    setSelectedDeptOriginal(value.deptOriginal);
    setSelectedDeptDestination(value.deptDestination);
    setSelectedPatientStatus(value.patientStatus);
    setSelectedAnalystName(value.analystName);
    setSelectedAnalystNoRm(value.analystNoRm);
    setSelectedDpjpLabName(value.dpjpLabName);
    setSelectedDpjpLabNoRm(value.dpjpLabNoRm);
    setSelectedPjLabName(value.pjLabName);
    setSelectedPjLabNoRm(value.pjLabNoRm);
    setSelectedActivityName(value.activityName);

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
            showDeptOriginal={true}
            deptOriginals={deptOriginals}
            selectedDeptOriginal={selectedDeptOriginal}
            showDeptDestination={true}
            deptDestinations={deptDestinations}
            selectedDeptDestination={selectedDeptDestination}
            showPatientStatus={true}
            patientStatuses={patientStatuses}
            selectedPatientStatus={selectedPatientStatus}
            showAnalystName={true}
            analystNames={analystNames}
            selectedAnalystName={selectedAnalystName}
            showAnalystNoRm={true}
            analystNoRms={analystNoRms}
            selectedAnalystNoRm={selectedAnalystNoRm}
            showDpjpLabName={true}
            dpjpLabNames={dpjpLabNames}
            selectedDpjpLabName={selectedDpjpLabName}
            showDpjpLabNoRm={true}
            dpjpLabNoRms={dpjpLabNoRms}
            selectedDpjpLabNoRm={selectedDpjpLabNoRm}
            showPjLabName={true}
            pjLabNames={pjLabNames}
            selectedPjLabName={selectedPjLabName}
            showPjLabNoRm={true}
            pjLabNoRms={pjLabNoRms}
            selectedPjLabNoRm={selectedPjLabNoRm}
            showActivityName={true}
            activityNames={activityNames}
            selectedActivityName={selectedActivityName}
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
      const result = await exportLabOrderDetail(
        type,
        selectedFilterId,
        '0',
        selectedYear.toString(),
        selectedMonthId,
        selectedDate.toISOString().split('T')[0],
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        selectedDeptOriginal,
        selectedDeptDestination,
        selectedPatientStatus,
        selectedAnalystName,
        selectedAnalystNoRm,
        selectedDpjpLabName,
        selectedDpjpLabNoRm,
        selectedPjLabName,
        selectedPjLabNoRm,
        selectedActivityName,
      );

      if (typeof result !== 'string') {
        await FileUtils.saveBase64(
          result?.data ?? '',
          MODULES['1527_LAB_ORDER_DETAIL'],
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
      const result = await getLabOrderDetail(
        selectedFilterId,
        selectedYear.toString(),
        selectedMonthId,
        DateUtils.formatDateToYMD(selectedDate),
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        selectedDeptOriginal,
        selectedDeptDestination,
        selectedPatientStatus,
        selectedAnalystName,
        selectedAnalystNoRm,
        selectedDpjpLabName,
        selectedDpjpLabNoRm,
        selectedPjLabName,
        selectedPjLabNoRm,
        selectedActivityName,
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
    selectedDeptOriginal,
    selectedDeptDestination,
    selectedPatientStatus,
    selectedAnalystName,
    selectedAnalystNoRm,
    selectedDpjpLabName,
    selectedDpjpLabNoRm,
    selectedPjLabName,
    selectedPjLabNoRm,
    selectedActivityName,
  ]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        filterDataTypes.forEach(async filterDataType => {
          const result = await getFilterDataLabOrderDetail(filterDataType);
          switch (filterDataType) {
            case 'deptori_nama_dept_ori':
              setDeptOriginals(result);
              break;
            case 'deptori_nama_dept_dest':
              setDeptDestinations(result);
              break;
            case 'status_pasien':
              setPatientStatuses(result);
              break;
            case 'analis_nama':
              setAnalystNames(result);
              break;
            case 'analis_no_rm':
              setAnalystNoRms(result);
              break;
            case 'dpjp_lab_nama':
              setDpjpLabNames(result);
              break;
            case 'dpjp_lab_no_rm':
              setDpjpLabNoRms(result);
              break;
            case 'pj_lab_nama':
              setPjLabNames(result);
              break;
            case 'pj_lab_no_rm':
              setPjLabNoRms(result);
              break;
            case 'nama_kegiatan':
              setActivityNames(result);
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
            title={MODULES['1527_LAB_ORDER_DETAIL']}
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

export default LabOrderDetailScreen;
