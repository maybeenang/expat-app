import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator, // Import Alert
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet'; // Import BottomSheetModal
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  RentalCategory,
  ProcessedRentalItem, // Asumsi Anda punya tipe ini
} from '../../../types/rental';
import {
  useRentalCategoriesQuery,
  useRentalDeleteMutation,
  useRentalItemsInfinite,
} from '../../../hooks/useRentalQuery';
import COLORS from '../../../constants/colors';
import LoadingScreen, {LoadingFooter} from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import EmptyScreen from '../../EmptyScreen';
import RentalItemCard from '../../../components/rental/RentalItem';
import RentalCategoryIocn from '../../../components/rental/RentalCategoryIcon';
import BottomSheetAction, {
  ActionItem,
} from '../../../components/common/BottomSheetAction'; // Import BottomSheetAction
import useManualRefresh from '../../../hooks/useManualRefresh';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore'; // Import loading store
import {MainTabParamList, RootStackParamList} from '../../../navigation/types'; // Sesuaikan Path & Nama ParamList

interface ExploreScreenProps
  extends NativeStackScreenProps<MainTabParamList, 'Rental'> {}

type ExploreScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>; // Gunakan Root Stack jika navigasi ke luar Tab

const ExploreScreen = ({route}: ExploreScreenProps) => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
    refetch: refetchCategories, // Tambahkan refetch jika perlu
  } = useRentalCategoriesQuery();

  const [activeCategory, setActiveCategory] = useState<RentalCategory | null>(
    null,
  );

  const {
    data: rentalItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingRentals,
    error: errorRentals,
    refetch: refetchRentals,
  } = useRentalItemsInfinite(activeCategory); // Gunakan activeCategory?.value jika hook butuh ID

  const deleteMutation = useRentalDeleteMutation(); // Hook mutasi hapus
  const {show, hide} = useLoadingOverlayStore();

  // --- State dan Ref untuk Bottom Sheet ---
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedRental, setSelectedRental] =
    useState<ProcessedRentalItem | null>(null);

  const {isManualRefreshing, handleManualRefresh} = useManualRefresh({
    refetch: async () => {
      await refetchCategories();
      await refetchRentals();
    },
    isFetching: isFetchingNextPage || isLoadingRentals || isLoadingCategories, // Gabungkan status fetching
  });

  // Efek untuk set kategori aktif awal
  useEffect(() => {
    if (categoriesData && !activeCategory && categoriesData.length > 0) {
      setActiveCategory(categoriesData[0]);
    }
  }, [categoriesData, activeCategory]);

  // Efek untuk set kategori dari parameter route
  useEffect(() => {
    if (route.params?.category && categoriesData) {
      const initialCategory = categoriesData.find(
        category => category.value === route.params.category?.value,
      );
      if (initialCategory) {
        setActiveCategory(initialCategory);
      }
    }
  }, [route.params?.category, categoriesData]);

  // Fungsi untuk membuka Bottom Sheet
  const openActionMenu = useCallback((rental: ProcessedRentalItem) => {
    setSelectedRental(rental);
    bottomSheetModalRef.current?.present();
  }, []);

  // Definisi aksi-aksi untuk Bottom Sheet
  const rentalActions = useMemo((): ActionItem[] => {
    if (!selectedRental) {
      return [];
    }

    return [
      {
        label: 'Lihat Detail',
        variant: 'primary',
        onPress: () => {
          navigation.navigate('RentalDetail', {rentalId: selectedRental.id});
        },
      },
      {
        label: 'Edit Rental',
        variant: 'secondary',
        onPress: () => {
          navigation.navigate('RentalUpdate', {rentalId: selectedRental.id});
        },
      },
      {
        label: 'Hapus Rental',
        destructive: true,
        destructiveMessage: `Yakin ingin menghapus rental "${selectedRental.title}"?`,
        onPress: async () => {
          if (deleteMutation.isPending) {
            return;
          }
          show(); // Tampilkan loading
          try {
            await deleteMutation.mutateAsync(selectedRental.id);
            Alert.alert('Sukses', 'Rental berhasil dihapus.');
            bottomSheetModalRef.current?.dismiss();
          } catch (error: any) {
            console.error('Delete error:', error);
            Alert.alert('Error', error?.message || 'Gagal menghapus rental.');
          } finally {
            hide();
          }
        },
        disabled: deleteMutation.isPending, // Disable tombol saat proses hapus
      },
    ];
  }, [selectedRental, navigation, deleteMutation, show, hide]);

  const renderCategoryFilter = () => {
    if (isLoadingCategories && !categoriesData) {
      return (
        <View style={styles.categoryContainer}>
          <ActivityIndicator />
        </View>
      ); // Tampilkan loading kecil
    }
    if (errorCategories && !categoriesData) {
      // Tampilkan opsi retry kecil jika gagal load kategori
      return (
        <View style={styles.centerContainerShort}>
          <Text style={styles.errorTextSmall}>Gagal memuat kategori.</Text>
          <TouchableOpacity
            onPress={() => refetchCategories()}
            style={styles.retryButtonSmall}>
            <Text style={styles.retryButtonTextSmall}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (categoriesData && categoriesData.length > 0) {
      return (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categoriesData.map(category => {
              const isActive = activeCategory?.value === category.value;
              return (
                <TouchableOpacity
                  key={category.value}
                  style={styles.categoryButton}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}
                  disabled={isManualRefreshing || isLoadingRentals} // Disable saat loading data list juga
                >
                  <RentalCategoryIocn
                    categoryName={category.value}
                    isActive={isActive}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}>
                    {category.label}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }
    return <View style={styles.categoryContainer} />; // Kosong jika tidak ada kategori
  };

  const renderRentalList = () => {
    if ((isLoadingRentals && !rentalItems) || isLoadingCategories) {
      // Tampilkan LoadingScreen hanya saat load awal
      return <LoadingScreen />;
    }
    if (errorRentals) {
      return (
        <ErrorScreen
          error={errorRentals}
          refetch={refetchRentals}
          placeholder="Gagal memuat data rental."
        />
      );
    }

    // FlatList tetap dirender meskipun data kosong untuk fitur pull-to-refresh
    return (
      <FlatList
        data={rentalItems ?? []} // Berikan array kosong jika undefined
        renderItem={({item}) => (
          <RentalItemCard item={item} onPressActionMenu={openActionMenu} />
        )}
        keyExtractor={item => item.id.toString()} // Pastikan ID adalah string atau konversi
        contentContainerStyle={
          rentalItems && rentalItems.length > 0
            ? styles.listContainer
            : styles.centerContainer
        } // Padding jika ada item, center jika kosong
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter /> : null}
        ListEmptyComponent={!isLoadingRentals ? <EmptyScreen /> : null}
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing && !isFetchingNextPage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {renderCategoryFilter()}
      <View style={styles.listArea}>{renderRentalList()}</View>

      <BottomSheetAction
        bottomSheetModalRef={bottomSheetModalRef}
        actions={rentalActions}
        snapPoints={['30%', '45%']}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  searchBarContainer: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greyLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {marginRight: 8},
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  categoryScroll: {paddingHorizontal: 15, paddingTop: 12, paddingBottom: 0},
  categoryButton: {
    alignItems: 'center',
    paddingBottom: 12,
    marginRight: 25,
    minWidth: 60,
  },
  categoryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginTop: 4,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {color: COLORS.textPrimary},
  activeIndicator: {
    height: 3,
    width: '120%',
    alignSelf: 'center',
    backgroundColor: COLORS.textPrimary,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  listArea: {flex: 1},
  listContainer: {padding: 15},
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }, // Gunakan flexGrow untuk Empty state
  infoText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  footerLoader: {paddingVertical: 20},
  centerContainerShort: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
  }, // Untuk error kategori
  errorTextSmall: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Roboto-Regular',
  },
  retryButtonSmall: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  retryButtonTextSmall: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});

export default React.memo(ExploreScreen);
