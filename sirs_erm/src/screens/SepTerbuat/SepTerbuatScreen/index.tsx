import React, {useLayoutEffect, useState, useRef} from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useSepTerbuatList} from '../../../hooks/useSepTerbuat';
import {ScreenContainer} from '../../../components/common';
import {numbers} from '../../../contants/styles';
import {SepTerbuatCard} from '../components/SepTerbuatCard';
import type {SepTerbuatListParams} from '../../../types/sepTerbuat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DrawerParamList} from '../../../types/navigation';
import UniversalHeaderTitle from '../../../components/common/UniversarHeader';
import ListFooterLoading from '../../../components/common/ListFooterLoading';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import ReusableBottomSheetModal from '../../../components/common/ReusableBottomSheet';
import {SepTerbuatFilter} from '../components/SepTerbuatFilter';

interface SepTerbuatScreenProps
  extends NativeStackScreenProps<DrawerParamList, 'SepTerbuat'> {}

const SepTerbuatScreen: React.FC<SepTerbuatScreenProps> = props => {
  const navigation = props.navigation;
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isRefetching,
  } = useSepTerbuatList(params);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleFilterChange = (newParams: SepTerbuatListParams) => {
    console.log('New Params:', newParams);
    setParams(prev => ({...prev, ...newParams, page: 1}));
    bottomSheetRef.current?.dismiss();
  };

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

  const isLoadingInitialOrFilter =
    isLoading || (isFetchingNextPage && !data?.length);

  const renderItem = ({item}: {item: any}) => <SepTerbuatCard item={item} />;

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyListComponent
          isLoading={isLoading}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      </ScreenContainer>
    );
  }

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
    <ScreenContainer>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListFooterLoading isLoading={isFetchingNextPage} />
        }
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyListComponent
            isLoading={isLoadingInitialOrFilter && !isRefetching}
            message={
              params.search ? 'Tidak ada hasil ditemukan.' : 'Belum ada hasil.'
            }
            onRefresh={refetch}
            refreshing={isRefetching}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <ReusableBottomSheetModal
        ref={bottomSheetRef}
        title="Filter SEP"
        snapPoints={['95%']}>
        <SepTerbuatFilter
          onFilterChange={handleFilterChange}
          initialParams={params} // Pass initial params to the filter component
        />
      </ReusableBottomSheetModal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: numbers.padding,
  },
  footer: {
    paddingVertical: numbers.padding,
    alignItems: 'center',
  },
});

export default SepTerbuatScreen;
