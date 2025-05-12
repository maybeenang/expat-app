import React, {
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef,
} from 'react'; // Tambahkan useRef
import {View, FlatList, StyleSheet, RefreshControl, Text} from 'react-native'; // Hapus ActivityIndicator jika tidak digunakan langsung
import {BottomSheetModal} from '@gorhom/bottom-sheet'; // Impor tipe BottomSheetModal
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DrawerParamList} from '../../../navigation/types';
import {useForm} from 'react-hook-form';
import AssignmentFilterContent, {
  FilterFormInputs,
} from '../../../features/adminAssigned/components/AssignedFilterContent';
import {
  AssignedEvent,
  GetAssignedCalendarParams,
} from '../../../features/adminAssigned/types/adminAssigned';
import {
  useAdminCrewAssignedCalendarQuery,
  useAdminCrewAssignedOptionsQuery,
} from '../../../features/adminAssigned/hooks/useAdminAssignedQuery';
import AssignedEventCard from '../../../features/adminAssigned/components/AssignedEventCard';
import {PickerItemOption} from '../../../components/common/ControllerPicker';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {colors, numbers} from '../../../contants/styles';
import {ScreenContainer} from '../../../components/common';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import ReusableBottomSheetModal from '../../../components/common/ReusableBottomSheet';

interface Props
  extends NativeStackScreenProps<DrawerParamList, 'AdminAssigned'> {}

const AdminCrewAssignedCalendarScreen: React.FC<Props> = ({navigation}) => {
  const currentYear = new Date().getFullYear();

  // Ref untuk BottomSheet Filter
  const filterBottomSheetRef = useRef<BottomSheetModal>(null);

  // State untuk search term di header (hanya UI untuk saat ini)
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');

  // Form handling untuk filter (tetap di layar utama karena state filter dibutuhkan di sini)
  const {control, handleSubmit: handleRHFSubmit} = useForm<FilterFormInputs>({
    defaultValues: {
      selectedCrewId: '',
      selectedArea: '',
      selectedYear: '',
    },
  });

  // State untuk menahan parameter query yang aktif
  const [activeQueryParams, setActiveQueryParams] =
    useState<GetAssignedCalendarParams>({
      year: currentYear,
    });

  // Query untuk opsi dan data kalender (tetap sama)
  const {data: optionsData, isLoading: isLoadingOptions} =
    useAdminCrewAssignedOptionsQuery();
  const {
    data: assignedEvents,
    isLoading: isLoadingEvents,
    isError,
    error,
    refetch,
    isRefetching,
  } = useAdminCrewAssignedCalendarQuery(activeQueryParams);

  // --- Handler untuk BottomSheet Filter ---
  const openFilterSheet = useCallback(() => {
    filterBottomSheetRef.current?.present();
  }, []);

  const closeFilterSheet = useCallback(() => {
    filterBottomSheetRef.current?.dismiss();
  }, []);

  // Fungsi yang dipanggil saat form filter di BottomSheet di-submit
  const applyFiltersFromSheet = (filters: FilterFormInputs) => {
    const params: GetAssignedCalendarParams = {};

    if (filters.selectedYear) {
      params.year = parseInt(filters.selectedYear, 10);
    }

    if (filters.selectedCrewId) {
      params.id_users = filters.selectedCrewId;
    }
    if (filters.selectedArea) {
      params.area = filters.selectedArea;
    }

    setActiveQueryParams(params);
    closeFilterSheet();
  };

  // --- Logika daftar dan item (tetap sama) ---
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEventCardPress = useCallback((eventId: string) => {
    console.log('Event card pressed:', eventId);
  }, []);

  const renderEventItem = useCallback(
    ({item}: {item: AssignedEvent}) => (
      <AssignedEventCard event={item} onPress={handleEventCardPress} />
    ),
    [handleEventCardPress],
  );

  const crewPickerOptions: PickerItemOption[] = useMemo(() => {
    if (!optionsData?.crews) {
      return [{label: 'Memuat Crew...', value: ''}];
    }
    return [
      {label: 'Semua Crew', value: ''},
      ...optionsData.crews.map(c => ({label: c.name, value: c.id})),
    ];
  }, [optionsData?.crews]);

  const areaPickerOptions: PickerItemOption[] = useMemo(() => {
    if (!optionsData?.area) {
      return [{label: 'Memuat Area...', value: ''}];
    }
    return [
      {label: 'Semua Area', value: ''},
      ...optionsData.area.map(a => ({label: a.area, value: a.area})),
    ];
  }, [optionsData?.area]);

  const yearPickerOptions: PickerItemOption[] = useMemo(() => {
    // all

    const options = Array.from({length: 5}, (_, i) => currentYear - 2 + i).map(
      y => ({
        label: y.toString(),
        value: y.toString(),
      }),
    );

    options.unshift({
      label: 'Semua Tahun',
      value: '',
    });

    return options;
  }, [currentYear]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle
          isSearchable // Aktifkan mode pencarian
          searchValue={headerSearchTerm}
          onSearchChange={setHeaderSearchTerm} // Hanya update state lokal, belum ada aksi
          searchPlaceholder="Search assigned crew..." // Placeholder untuk search
          rightActions={[
            {
              iconName: 'Faders',
              onPress: openFilterSheet,
              accessibilityLabel: 'Buka Filter',
            },
          ]}
        />
      ),
    });
  }, [navigation, headerSearchTerm, openFilterSheet]); // Tambahkan openFilterSheet ke dependensi

  const isLoadingInitialData =
    isLoadingOptions || (isLoadingEvents && !assignedEvents && !isRefetching);

  return (
    <ScreenContainer style={styles.screen}>
      {isError && (
        <View style={styles.centeredMessage}>
          <EmptyListComponent
            message={`Error: ${error?.message || 'Gagal memuat jadwal.'}`}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        </View>
      )}

      {!isError && (
        <FlatList
          data={assignedEvents ?? []}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyListComponent
              isLoading={isLoadingInitialData}
              message={
                !activeQueryParams.year
                  ? 'Pilih tahun dan terapkan filter untuk melihat jadwal.'
                  : 'Tidak ada jadwal ditemukan untuk filter ini.'
              }
              onRefresh={activeQueryParams.year ? handleRefresh : undefined}
              refreshing={isRefetching}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoadingInitialData}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <ReusableBottomSheetModal
        ref={filterBottomSheetRef}
        title="Filter Jadwal"
        onDismiss={closeFilterSheet}
        snapPoints={['80%']}>
        <AssignmentFilterContent
          control={control}
          errors={useForm().formState.errors} // Kirim errors dari RHF
          handleSubmit={handleRHFSubmit} // Kirim handleSubmit dari RHF
          onApplyFilters={applyFiltersFromSheet}
          onClose={closeFilterSheet}
          crewOptions={crewPickerOptions}
          areaOptions={areaPickerOptions}
          yearOptions={yearPickerOptions}
          isApplyingFilters={isLoadingEvents && !isRefetching} // Loading saat query kalender jalan
        />
      </ReusableBottomSheetModal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Hapus style filterContainer yang lama
  listContentContainer: {
    padding: numbers.padding,
    flexGrow: 1,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminCrewAssignedCalendarScreen;
