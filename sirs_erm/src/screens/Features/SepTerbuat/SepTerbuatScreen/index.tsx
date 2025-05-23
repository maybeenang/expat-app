import React, {useLayoutEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Switch,
  Clipboard,
  ToastAndroid,
  Platform,
} from 'react-native';
import {SepTerbuatFilter} from '../components/SepTerbuatFilter';
import {useNavigation} from '@react-navigation/native';
import {SepTerbuat, SepTerbuatListParams} from '../../../../types/sepTerbuat';
import {
  useSepTerbuatChartData,
  useSepTerbuatTable,
} from '../../../../hooks/useSepTerbuat';
import UniversalHeaderTitle from '../../../../components/common/UniversarHeader';
import EmptyListComponent from '../../../../components/common/EmptyListComponent';
import ReusableBottomSheetModal from '../../../../components/common/ReusableBottomSheet';
import {numbers, colors, COLORS} from '../../../../contants/styles';
import {ScreenContainer} from '../../../../components/common';
import {
  ReusableTable,
  Column,
} from '../../../../components/common/ReusableTable';
import {Button, Text, Snackbar} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import SepTerbuatChart from '../components/SepTerbuatChart';

const SepTerbuatScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<any>(null);

  const [params, setParams] = useState<SepTerbuatListParams>({
    filter: 'range',
    deleted: 'active',
    limit: 10,
    page: 1,
    code_diag_awal: 'simrs',
    jns_pelayanan: 2,
    range_start: new Date('2025-02-01').toISOString().split('T')[0],
    range_end: new Date('2025-02-28').toISOString().split('T')[0],
  });

  const {data, isLoading, isError, error, isFetching, refetch} =
    useSepTerbuatTable(params);

  const [showChart, setShowChart] = useState<boolean>(false);
  const [showSequenceNumber, setShowSequenceNumber] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    chartData: chartDataSimrs,
    isLoading: isLoadingSimrs,
    error: errorSimrs,
  } = useSepTerbuatChartData(params);

  const handlePageChange = (page: number) => {
    setParams(prev => ({...prev, page}));
  };

  const handleFilterChange = (newParams: SepTerbuatListParams) => {
    console.log('New Params:', newParams);
    setParams(prev => ({...prev, ...newParams, page: 1}));
    bottomSheetRef.current?.dismiss();
  };

  const copyToClipboard = useCallback((item: SepTerbuat) => {
    if (item.noSep) {
      Clipboard.setString(item.noSep);
      // setSnackbarMessage(`SEP No. ${item.noSep} disalin ke clipboard`);
      // setSnackbarVisible(true);

      // Show native toast on Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('SEP No. disalin ke clipboard', ToastAndroid.SHORT);
      }
    }
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFormattedPeriod = () => {
    if (params.filter === 'range' && params.range_start && params.range_end) {
      return `${formatDate(params.range_start)} - ${formatDate(
        params.range_end,
      )}`;
    } else if (params.filter === 'bulan' && params.month && params.year) {
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      return `${monthNames[parseInt(params.month) - 1]} ${params.year}`;
    } else if (params.filter === 'tahun' && params.year) {
      return params.year.toString();
    } else if (params.filter === 'hari' && params.date) {
      return formatDate(params.date);
    }
    return 'Semua periode';
  };

  const tableColumns: Column<SepTerbuat>[] = [
    {id: 'noSep', label: 'No SEP'},
    {id: 'noKartu', label: 'No Kartu'},
    {id: 'id_pasien_registrasi', label: 'ID Pasien Regist'},
    {id: 'nama_petugas_input', label: 'Nama Petugas Input'},
    {
      id: 'created_date',
      label: 'Tgl SEP',
      render: item => (
        <Text
          style={{
            textAlign: 'center',
            flexWrap: 'wrap',
            fontSize: 12,
          }}>
          {formatDate(item.created_date)}
        </Text>
      ),
    },
    {id: 'code_diagAwal', label: 'Code Diag Awal'},
    {id: 'diagAwal', label: 'Diag Awal'},
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle
          searchValue={params.search}
          onSearchChange={text => {
            setParams(prev => ({
              ...prev,
              search: text,
              page: 1,
            }));
          }}
          isSearchable
          searchPlaceholder="Cari SEP..."
          rightActions={[
            {
              iconName: 'Faders',
              onPress: () => bottomSheetRef.current?.present(),
              accessibilityLabel: 'Buka Filter SEP',
            },
          ]}
        />
      ),
    });
  }, [navigation, params.search]);

  if (isError) {
    return (
      <ScreenContainer>
        <EmptyListComponent
          onRefresh={refetch}
          refreshing={isFetching}
          message={error?.message || 'Terjadi kesalahan saat memuat data.'}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : (
            <View style={styles.content}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: numbers.margin * 2,
                }}>
                <Text style={[styles.title]}>Graphic SEP Terbuat</Text>

                <Switch
                  trackColor={{
                    false: COLORS.greyMedium,
                    true: COLORS.greyDark,
                  }}
                  thumbColor={COLORS.primary}
                  onValueChange={setShowChart}
                  value={showChart}
                />
              </View>

              <View style={styles.spacer} />

              {showChart && !isLoadingSimrs && !errorSimrs && (
                <SepTerbuatChart chartDataSimrs={chartDataSimrs} />
              )}
              <Text style={[styles.title]}>
                LAPORAN SEP TERBUAT DI VCLAIM & SIMRS
              </Text>
              <View style={styles.spacer} />

              <View style={styles.optionsContainer}>
                <Text style={styles.periodText}>
                  Periode : {getFormattedPeriod()}
                </Text>

                <View style={styles.optionSwitch}>
                  <Text style={{marginRight: 8, fontSize: 14}}>No. Urut</Text>
                  <Switch
                    trackColor={{
                      false: COLORS.greyMedium,
                      true: COLORS.greyDark,
                    }}
                    thumbColor={COLORS.primary}
                    onValueChange={setShowSequenceNumber}
                    value={showSequenceNumber}
                  />
                </View>
              </View>

              <Text style={styles.hintText}>
                Tekan lama untuk menyalin No SEP
              </Text>

              {data && data.data && data.data.length > 0 ? (
                <ReusableTable
                  columns={tableColumns}
                  data={data.data}
                  pagination={data.pagination}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                  showSequenceNumber={showSequenceNumber}
                  onRowPress={item => console.log('Row pressed', item.id)}
                  onRowHold={copyToClipboard}
                />
              ) : (
                <Text style={styles.noDataText}>Tidak ada data</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ReusableBottomSheetModal
        ref={bottomSheetRef}
        title="Filter SEP"
        snapPoints={['95%']}>
        <SepTerbuatFilter
          onFilterChange={handleFilterChange}
          initialParams={params}
        />
      </ReusableBottomSheetModal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    minHeight: Dimensions.get('window').height - 220,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    marginTop: 4,
  },
  periodText: {
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: numbers.margin,
  },
  optionSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  snackbar: {
    backgroundColor: colors.primary,
  },
});

export default SepTerbuatScreen;
