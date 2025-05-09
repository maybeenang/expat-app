import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import useDebounce from '../../../hooks/useDebounce';
import {
  AdminCrew,
  GetAdminCrewsParams,
} from '../../../features/adminCrews/types';
import {useInfiniteAdminCrewsQuery} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import AdminCrewCard from '../../../features/adminCrews/components/adminCrewCard';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {colors, fonts, numbers} from '../../../contants/styles';
import {ListFooterLoading, ScreenContainer} from '../../../components/common';

const ITEMS_PER_PAGE = 10; // Atau ambil dari konstanta

const AdminCrewsScreen: React.FC = () => {
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

  const handleCardPress = (crewId: string) => {
    console.log('Navigate to crew detail:', crewId);
  };

  // Menggabungkan semua halaman data menjadi satu array untuk FlatList
  const allCrews = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const renderCrewItem = useCallback(
    ({item}: {item: AdminCrew}) => (
      <AdminCrewCard crew={item} onPress={handleCardPress} />
    ),
    [],
  );

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kru (nama, email, no. telp)..."
          placeholderTextColor={colors.greyDark}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Bisa tambahkan ikon search di sini */}
      </View>

      <FlatList
        data={allCrews}
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background, // Latar belakang utama layar
  },
  searchContainer: {
    paddingHorizontal: numbers.padding,
    paddingTop: numbers.padding / 2, // Beri sedikit jarak jika tidak ada header navigator
    paddingBottom: numbers.padding / 1.5,
    backgroundColor: colors.surface, // Bisa beda dari screen background
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.greyLight, // Atau colors.neutralLight
    borderRadius: numbers.borderRadius,
    paddingHorizontal: numbers.padding,
    paddingVertical: 10, // Sesuaikan tinggi
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContentContainer: {
    padding: numbers.padding,
    flexGrow: 1, // Penting agar EmptyListComponent bisa di tengah jika konten sedikit
  },
});

export default AdminCrewsScreen;
