import React, {useLayoutEffect, useState, useRef} from 'react';
import {StyleSheet, View, Dimensions, ActivityIndicator} from 'react-native';
import {SepTerbuatFilter} from '../components/SepTerbuatFilter';
import {useNavigation} from '@react-navigation/native';
import {SepTerbuat, SepTerbuatListParams} from '../../../../types/sepTerbuat';
import {useSepTerbuatTable} from '../../../../hooks/useSepTerbuat';
import UniversalHeaderTitle from '../../../../components/common/UniversarHeader';
import EmptyListComponent from '../../../../components/common/EmptyListComponent';
import ReusableBottomSheetModal from '../../../../components/common/ReusableBottomSheet';
import {numbers, colors} from '../../../../contants/styles';
import {ScreenContainer} from '../../../../components/common';
import {
  ReusableTable,
  Column,
} from '../../../../components/common/ReusableTable';
import {Button, Text} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

const SepTerbuatScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<any>(null);

  const [params, setParams] = useState<SepTerbuatListParams>({
    filter: 'range',
    deleted: 'active',
    limit: 10,
    page: 1,
    code_diag_awal: 'vclaim',
    jns_pelayanan: 2,
    range_start: new Date('2025-02-01').toISOString().split('T')[0],
    range_end: new Date('2025-02-28').toISOString().split('T')[0],
  });

  const {data, isLoading, isError, error, isFetching, refetch} =
    useSepTerbuatTable(params);

  const handlePageChange = (page: number) => {
    setParams(prev => ({...prev, page}));
  };

  const handleFilterChange = (newParams: SepTerbuatListParams) => {
    console.log('New Params:', newParams);
    setParams(prev => ({...prev, ...newParams, page: 1}));
    bottomSheetRef.current?.dismiss();
  };

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
    {id: 'noSep', label: 'No SEP', width: 120},
    {
      id: 'created_date',
      label: 'Tgl SEP',
      width: 100,
      render: item => <Text>{formatDate(item.created_date)}</Text>,
    },
    {id: 'noKartu', label: 'No Kartu', width: 120},
    {id: 'id_pasien_registrasi', label: 'Pasien ID', width: 150},
    {id: 'diagAwal', label: 'Diagnosa', width: 150},
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
              <Text style={styles.title}>Data SEP</Text>
              <View style={styles.spacer} />
              <Text style={styles.periodText}>
                Periode : {getFormattedPeriod()}
              </Text>
              {data && data.data && data.data.length > 0 ? (
                <ReusableTable
                  columns={tableColumns}
                  data={data.data}
                  pagination={data.pagination}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                  onRowPress={item => console.log('Row pressed', item.id)}
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
    paddingHorizontal: numbers.padding,
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
    marginBottom: numbers.margin,
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
});

export default SepTerbuatScreen;
