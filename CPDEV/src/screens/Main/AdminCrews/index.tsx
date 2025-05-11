import React, {useState, useCallback, useMemo, useLayoutEffect} from 'react';
import {FlatList, StyleSheet, RefreshControl, Alert} from 'react-native';
// import { LocaleConfig } from 'react-native-calendars'; // Tidak diperlukan lagi

import useDebounce from '../../../hooks/useDebounce';
import {colors, numbers} from '../../../contants/styles';
import {useAdminCrewActions} from '../../../features/adminCrews/hooks/useAdminCrewAction';
import {
  AdminCrew,
  GetAdminCrewsParams,
} from '../../../features/adminCrews/types';
import {useInfiniteAdminCrewsQuery} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import AdminCrewCard from '../../../features/adminCrews/components/adminCrewCard';
import ReusableBottomSheetModal, {
  BottomSheetAction,
} from '../../../components/common/ReusableBottomSheet';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {ListFooterLoading, ScreenContainer} from '../../../components/common';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import ManageUnavailableDatesContent from '../../../features/adminCrews/components/UnavailableDatePicker';

const ITEMS_PER_PAGE = 10;

interface Props {
  navigation: any;
}

const AdminCrewsScreen: React.FC<Props> = ({navigation}) => {
  const {
    actionsBottomSheetRef,
    manageDatesBottomSheetRef, // Nama ref diupdate
    selectedCrewForAction,
    openActionsSheet,
    closeActionsSheet,
    openManageDatesSheet, // Nama fungsi diupdate
    closeManageDatesSheet,
    handleSaveUnavailableDates, // Nama fungsi diupdate
    isSavingUnavailableDate,
  } = useAdminCrewActions();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const queryParams = useMemo((): Omit<GetAdminCrewsParams, 'page'> & {
    limit: number;
  } => {
    const params: Omit<GetAdminCrewsParams, 'page'> & {limit: number} = {
      limit: ITEMS_PER_PAGE,
    };
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }
    return params;
  }, [debouncedSearchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteAdminCrewsQuery(queryParams);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardPress = useCallback(
    (crewId: string) => {
      navigation.navigate('AdminCrewDetail', {crewId});
    },
    [navigation],
  );

  const renderCrewItem = useCallback(
    ({item}: {item: AdminCrew}) => (
      <AdminCrewCard
        crew={item}
        onPress={handleCardPress}
        onActionPress={openActionsSheet} // Gunakan dari custom hook
      />
    ),
    [handleCardPress, openActionsSheet],
  );

  // Aksi untuk BottomSheet Utama
  const crewActions = useMemo((): BottomSheetAction[] => {
    if (!selectedCrewForAction) {
      return [];
    }
    return [
      {
        id: 'add-unavailable-date',
        label: 'Add Unavailable Date',
        iconName: 'Calendar',
        onPress: openManageDatesSheet, // Gunakan dari custom hook
      },
      {
        id: 'edit-crew',
        label: 'Edit Admin Crew',
        iconName: 'Pencil',
        onPress: () => {
          Alert.alert(
            'Edit Crew (NOT IMPLEMENTED)',
            `Mengedit kru: ${selectedCrewForAction.name}`,
          );
          closeActionsSheet(); // Gunakan dari custom hook
        },
      },
      {
        id: 'delete-crew',
        label: 'Hapus Admin Crew',
        iconName: 'X',
        isDestructive: true,
        onPress: () => {
          closeActionsSheet(); // Gunakan dari custom hook
          Alert.alert(
            'Hapus Kru (NOT IMPLEMENTED)',
            `Anda yakin ingin menghapus ${selectedCrewForAction.name}?`,
            [
              {text: 'Batal', style: 'cancel'},
              {
                text: 'Hapus',
                style: 'destructive',
                onPress: () =>
                  console.log('DELETE CREW:', selectedCrewForAction.id),
              },
            ],
          );
        },
      },
    ];
  }, [selectedCrewForAction, closeActionsSheet, openManageDatesSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle
          isSearchable
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari kru..."
          rightActions={[
            {
              iconName: 'Plus',
              onPress: () => {
                navigation.navigate('AdminCrewCreate');
              },
              accessibilityLabel: 'Tambah kru baru',
            },
          ]}
        />
      ),
    });
  }, [navigation, searchTerm]);

  if (isError && !isLoading) {
    return (
      <ScreenContainer>
        <EmptyListComponent
          message={`Error: ${error?.message || 'Gagal memuat data.'}`}
          onRefresh={handleRefresh}
          refreshing={isRefetching}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <FlatList
        data={data}
        renderItem={renderCrewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListFooterLoading isLoading={isFetchingNextPage} />
        }
        ListEmptyComponent={
          <EmptyListComponent
            isLoading={isLoading && !isRefetching}
            message={
              debouncedSearchTerm
                ? `Tidak ada kru ditemukan untuk "${debouncedSearchTerm}".`
                : 'Belum ada kru terdaftar.'
            }
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* BottomSheet untuk Aksi Utama */}
      <ReusableBottomSheetModal
        ref={actionsBottomSheetRef}
        title={
          selectedCrewForAction
            ? `Action untuk ${selectedCrewForAction.name}`
            : undefined
        }
        actions={crewActions}
        onDismiss={closeActionsSheet}
      />

      {selectedCrewForAction && (
        <ReusableBottomSheetModal
          ref={manageDatesBottomSheetRef} // Gunakan ref yang benar
          onDismiss={closeManageDatesSheet} // Gunakan fungsi yang benar
          snapPoints={['95%', '100%']}>
          <ManageUnavailableDatesContent
            crew={selectedCrewForAction}
            initialUnavailableDatesString={
              selectedCrewForAction.unavailable_date
            }
            onSave={handleSaveUnavailableDates}
            onCancel={closeManageDatesSheet}
            isSaving={isSavingUnavailableDate}
          />
        </ReusableBottomSheetModal>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  listContentContainer: {padding: numbers.padding, flexGrow: 1},
});

export default AdminCrewsScreen;
