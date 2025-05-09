import React, {
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef,
} from 'react';
import {FlatList, StyleSheet, RefreshControl, Alert} from 'react-native';
import useDebounce from '../../../hooks/useDebounce';
import {
  AdminCrew,
  GetAdminCrewsParams,
} from '../../../features/adminCrews/types';
import {useInfiniteAdminCrewsQuery} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import AdminCrewCard from '../../../features/adminCrews/components/adminCrewCard';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {colors, numbers} from '../../../contants/styles';
import {ListFooterLoading, ScreenContainer} from '../../../components/common';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DrawerParamList} from '../../../navigation/types';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {CustomIcon} from '../../../components/common/CustomIcon';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ReusableBottomSheetModal, {
  BottomSheetAction,
} from '../../../components/common/ReusableBottomSheet';

const ITEMS_PER_PAGE = 10; // Atau ambil dari konstanta

interface Props extends NativeStackScreenProps<DrawerParamList, 'AdminCrew'> {}

const AdminCrewsScreen: React.FC<Props> = ({navigation}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCrewForAction, setSelectedCrewForAction] =
    useState<AdminCrew | null>(null);

  const handleOpenActionSheet = useCallback((crew: AdminCrew) => {
    setSelectedCrewForAction(crew);
    bottomSheetModalRef.current?.present(); // Buka bottom sheet
  }, []);

  const handleCloseActionSheet = useCallback(() => {
    setSelectedCrewForAction(null); // Reset crew yang dipilih saat ditutup
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce 500ms

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
    isLoading, // Loading awal
    isError,
    error,
    refetch, // Untuk pull-to-refresh
    isRefetching, // Untuk status pull-to-refresh
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
      console.log('Navigate to crew detail:', crewId);

      // @ts-ignore
      navigation.navigate('AdminCrewDetail', {crewId});
    },
    [navigation],
  );

  const renderCrewItem = useCallback(
    ({item}: {item: AdminCrew}) => (
      <AdminCrewCard
        crew={item}
        onPress={handleCardPress}
        onActionPress={crew => handleOpenActionSheet(crew)}
      />
    ),
    [handleCardPress, handleOpenActionSheet],
  );

  const crewActions = useMemo((): BottomSheetAction[] => {
    if (!selectedCrewForAction) {
      return [];
    }

    return [
      {
        id: 'view-details',
        label: `Lihat Detail ${selectedCrewForAction.name}`,
        iconName: 'Bed',
        onPress: () => {
          Alert.alert(
            'View Details',
            `Melihat detail untuk: ${selectedCrewForAction.name}`,
          );
          bottomSheetModalRef.current?.dismiss();
          // navigation.navigate('AdminCrewDetail', { crewId: selectedCrewForAction.id });
        },
      },
      {
        id: 'edit-crew',
        label: 'Edit Kru',
        iconName: 'DotsThreeVertical',
        onPress: () => {
          Alert.alert(
            'Edit Crew',
            `Mengedit kru: ${selectedCrewForAction.name}`,
          );
          bottomSheetModalRef.current?.dismiss();
          // Logika untuk navigasi ke layar edit atau membuka modal edit
        },
      },
      {
        id: 'view-contracts',
        label: 'Lihat Kontrak',
        iconName: 'X',
        onPress: () => {
          Alert.alert(
            'View Contracts',
            `Melihat kontrak untuk: ${selectedCrewForAction.name}`,
          );
          bottomSheetModalRef.current?.dismiss();
        },
      },
      {
        id: 'delete-crew',
        label: 'Hapus Kru',
        iconName: 'DotsThreeVertical',
        isDestructive: true,
        onPress: () => {
          bottomSheetModalRef.current?.dismiss(); // Tutup dulu sebelum Alert agar tidak tumpang tindih
          Alert.alert(
            'Hapus Kru',
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
  }, [selectedCrewForAction]);

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
              iconElement: (
                <CustomIcon
                  name="SquareSplitVertical"
                  size={24}
                  color={colors.primary}
                />
              ),
              onPress: () => console.log('Filter button pressed!'),
              accessibilityLabel: 'Filter kru',
            },
            {
              iconName: 'plus-circle-outline',
              onPress: () => console.log('Add crew pressed!'),
              accessibilityLabel: 'Tambah kru baru',
            },
          ]}
        />
      ),
    });
  }, [navigation, searchTerm]);

  if (isError) {
    // Tampilan error yang lebih baik bisa dibuat
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
        onEndReachedThreshold={0.5} // Seberapa dekat dari bawah sebelum onEndReached dipanggil
        ListFooterComponent={
          <ListFooterLoading isLoading={isFetchingNextPage} />
        }
        ListEmptyComponent={
          <EmptyListComponent
            isLoading={isLoading && !isRefetching} // Hanya tampilkan loading utama jika bukan dari refresh
            message={
              debouncedSearchTerm
                ? `Tidak ada kru ditemukan untuk "${debouncedSearchTerm}".`
                : 'Belum ada kru terdaftar.'
            }
            onRefresh={handleRefresh} // Bisa juga untuk kasus empty
            refreshing={isRefetching}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading} // Hanya true saat pull-to-refresh aktif
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      <ReusableBottomSheetModal
        ref={bottomSheetModalRef}
        actions={crewActions}
        onDismiss={handleCloseActionSheet} // Callback saat ditutup
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background, // Latar belakang utama layar
  },
  searchContainer: {
    width: numbers.headerWidth,
    backgroundColor: colors.surface, // Bisa beda dari screen background
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContentContainer: {
    padding: numbers.padding,
    flexGrow: 1, // Penting agar EmptyListComponent bisa di tengah jika konten sedikit
  },
});

export default AdminCrewsScreen;
