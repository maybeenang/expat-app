import React, {
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef,
} from 'react';
import {View, FlatList, StyleSheet, RefreshControl, Alert} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DrawerParamList} from '../../../navigation/types';
import {
  ContactResultItem,
  GetContactResultsParams,
} from '../../../features/contactResult/types/contactResult';
import ContactResultFilterContent, {
  ContactResultFilterFormInputs,
} from '../../../features/contactResult/components/ContactResultFilterContent';
import {
  useDeleteContactResultMutation,
  useInfiniteContactResultsQuery,
} from '../../../features/contactResult/hooks/useContactResultQuery';
import ContactResultCard from '../../../features/contactResult/components/ContactResultCard';
import ReusableBottomSheetModal, {
  BottomSheetAction,
} from '../../../components/common/ReusableBottomSheet';
import {colors, numbers} from '../../../contants/styles';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {ListFooterLoading, ScreenContainer} from '../../../components/common';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

const ITEMS_PER_PAGE = 10;

// interface Props extends NativeStackScreenProps<RootStackParamList, 'ContactResults'> {}
interface Props
  extends NativeStackScreenProps<DrawerParamList, 'ContactResult'> {} // Ganti dengan tipe navigasi yang benar

const ContactResultsScreen: React.FC<Props> = ({navigation}) => {
  // --- Refs ---
  const filterBottomSheetRef = useRef<BottomSheetModal>(null);
  const actionsBottomSheetRef = useRef<BottomSheetModal>(null); // Untuk aksi per item (delete)

  // --- State ---
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  // const debouncedHeaderSearch = useDebounce(headerSearchTerm, 500); // Untuk search API jika ada

  const [selectedContactResultForAction, setSelectedContactResultForAction] =
    useState<ContactResultItem | null>(null);

  // Form untuk filter
  const {
    control: filterControl,
    handleSubmit: handleFilterFormSubmit,
    watch: watchFilters,
  } = useForm<ContactResultFilterFormInputs>({
    defaultValues: {selectedCompany: ''},
  });
  const currentFilters = watchFilters();

  // State untuk parameter query yang aktif
  const [activeQueryParams, setActiveQueryParams] = useState<
    Omit<GetContactResultsParams, 'offset' | 'limit'>
  >({
    company: currentFilters.selectedCompany || undefined, // Ambil nilai awal
    // search: debouncedHeaderSearch || undefined, // Jika search API sudah siap
  });

  // --- Queries & Mutations ---
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteContactResultsQuery({
    ...activeQueryParams,
    limit: ITEMS_PER_PAGE,
  });

  const deleteMutation = useDeleteContactResultMutation();

  // --- Opsi Filter (Contoh, idealnya dari API lain atau hardcode lebih baik) ---
  const companyOptions = useMemo(
    () => [
      {label: 'Semua Perusahaan', value: ''},
      {label: 'SATU BANGSA PHOTOGRAPHY', value: 'SATU BANGSA PHOTOGRAPHY'},
      {label: 'DUA INSANI VIDEOGRAPHY', value: 'DUA INSANI VIDEOGRAPHY'},
      // Tambahkan opsi perusahaan lain di sini
    ],
    [],
  );

  // --- Handlers ---
  const openFilterSheet = useCallback(
    () => filterBottomSheetRef.current?.present(),
    [],
  );
  const closeFilterSheet = useCallback(
    () => filterBottomSheetRef.current?.dismiss(),
    [],
  );

  const applyFiltersFromSheet = useCallback(
    (filters: ContactResultFilterFormInputs) => {
      setActiveQueryParams({
        company: filters.selectedCompany || undefined,
        // search: debouncedHeaderSearch || undefined,
      });
      closeFilterSheet();
    },
    [closeFilterSheet /*, debouncedHeaderSearch */],
  );

  const openActionsSheet = useCallback((contactResult: ContactResultItem) => {
    setSelectedContactResultForAction(contactResult);
    actionsBottomSheetRef.current?.present();
  }, []);
  const closeActionsSheet = useCallback(() => {
    actionsBottomSheetRef.current?.dismiss();
    // Tidak reset selectedContactResultForAction agar judul bottom sheet tetap saat menutup
  }, []);

  const loading = useLoadingOverlayStore();

  const handleDeleteContactResult = useCallback(() => {
    if (!selectedContactResultForAction) {
      return;
    }
    closeActionsSheet(); // Tutup sheet aksi dulu
    Alert.alert(
      'Konfirmasi Hapus',
      `Anda yakin ingin menghapus hasil kontak untuk "${
        selectedContactResultForAction.name1
      }${
        selectedContactResultForAction.name2
          ? ` & ${selectedContactResultForAction.name2}`
          : ''
      }"?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            loading.show();
            try {
              await deleteMutation.mutateAsync(
                selectedContactResultForAction.id,
                {
                  onSettled: () => setSelectedContactResultForAction(null),
                },
              );
              Alert.alert('Sukses', 'Hasil kontak berhasil dihapus.');
            } catch (err: any) {
              Alert.alert(
                'Gagal',
                err?.message || 'Tidak dapat menghapus hasil kontak.',
              );
            } finally {
              loading.hide();
            }
          },
        },
      ],
    );
  }, [
    selectedContactResultForAction,
    deleteMutation,
    closeActionsSheet,
    loading,
  ]);

  const handleRefresh = useCallback(() => refetch(), [refetch]);
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardPress = useCallback((contactResultId: string) => {
    console.log(
      'Navigate to contact result detail (not implemented):',
      contactResultId,
    );
  }, []);

  const renderContactResultItem = useCallback(
    ({item}: {item: ContactResultItem}) => (
      <ContactResultCard
        item={item}
        onPress={handleCardPress}
        onActionPress={openActionsSheet}
      />
    ),
    [handleCardPress, openActionsSheet],
  );

  // Aksi untuk BottomSheet Aksi per item
  const itemActions = useMemo((): BottomSheetAction[] => {
    if (!selectedContactResultForAction) {
      return [];
    }
    return [
      {
        id: 'delete-contact-result',
        label: 'Hapus Hasil Kontak',
        iconName: 'Trash',
        isDestructive: true,
        onPress: handleDeleteContactResult,
      },
      // Tambahkan aksi lain di sini (mis. Edit, Tandai Selesai, dll.)
    ];
  }, [selectedContactResultForAction, handleDeleteContactResult]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle
          isSearchable
          searchValue={headerSearchTerm}
          onSearchChange={setHeaderSearchTerm} // Hanya UI, belum ada aksi API
          searchPlaceholder="Cari hasil kontak..."
          rightActions={[
            {
              iconName: 'Faders',
              onPress: openFilterSheet,
              accessibilityLabel: 'Buka Filter Hasil Kontak',
            },
          ]}
        />
      ),
    });
  }, [navigation, headerSearchTerm, openFilterSheet]);

  const isLoadingInitialOrFilter =
    isLoading || (isFetchingNextPage && !infiniteData?.length);

  return (
    <ScreenContainer style={styles.screen}>
      {/* Header Search dan Tombol Filter sudah dihandle oleh useLayoutEffect */}

      {isError && (
        <View style={styles.centeredMessage}>
          <EmptyListComponent
            message={`Error: ${error?.message || 'Gagal memuat data.'}`}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        </View>
      )}

      {!isError && (
        <FlatList
          data={infiniteData}
          renderItem={renderContactResultItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContentContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <ListFooterLoading isLoading={isFetchingNextPage} />
          }
          ListEmptyComponent={
            <EmptyListComponent
              isLoading={isLoadingInitialOrFilter && !isRefetching}
              message={
                activeQueryParams.company /*|| activeQueryParams.search*/
                  ? 'Tidak ada hasil kontak ditemukan untuk filter ini.'
                  : 'Belum ada hasil kontak.'
              }
              onRefresh={handleRefresh}
              refreshing={isRefetching}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoadingInitialOrFilter}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* BottomSheet untuk Filter */}
      <ReusableBottomSheetModal
        ref={filterBottomSheetRef}
        title="Filter Hasil Kontak"
        snapPoints={useMemo(() => ['60%'], [])} // 'auto' atau persentase yang sesuai
        onDismiss={closeFilterSheet}>
        <ContactResultFilterContent
          control={filterControl}
          errors={useForm<ContactResultFilterFormInputs>().formState.errors} // Kirim errors RHF
          handleSubmit={handleFilterFormSubmit}
          onApplyFilters={applyFiltersFromSheet}
          onClose={closeFilterSheet}
          companyOptions={companyOptions}
          isApplyingFilters={!isRefetching && isLoadingInitialOrFilter}
        />
      </ReusableBottomSheetModal>

      {/* BottomSheet untuk Aksi per Item */}
      <ReusableBottomSheetModal
        ref={actionsBottomSheetRef}
        title={
          selectedContactResultForAction
            ? `Aksi untuk ${selectedContactResultForAction.name1}`
            : undefined
        }
        actions={itemActions}
        onDismiss={() => setSelectedContactResultForAction(null)} // Reset saat ditutup
        snapPoints={useMemo(() => ['80%'], [])}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  listContentContainer: {padding: numbers.padding, flexGrow: 1},
  centeredMessage: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default ContactResultsScreen;
