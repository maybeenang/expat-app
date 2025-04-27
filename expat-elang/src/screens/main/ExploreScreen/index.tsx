import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {RentalCategory} from '../../../types/rental';
import {
  useRentalCategoriesQuery,
  useRentalItemsInfinite,
} from '../../../hooks/useRentalQuery';
import COLORS from '../../../constants/colors';
import LoadingScreen, {LoadingFooter} from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import EmptyScreen from '../../EmptyScreen';
import RentalItemCard from '../../../components/rental/RentalItem';
import RentalCategoryIocn from '../../../components/rental/RentalCategoryIcon';
import useManualRefresh from '../../../hooks/useManualRefresh';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList} from '../../../navigation/types';

interface ExploreScreenProps
  extends NativeStackScreenProps<MainTabParamList, 'Rental'> {}

const ExploreScreen = ({route}: ExploreScreenProps) => {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
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
  } = useRentalItemsInfinite(activeCategory);

  const {isManualRefreshing, handleManualRefresh} = useManualRefresh({
    refetch: refetchRentals,
    isFetching: isFetchingNextPage,
  });

  useEffect(() => {
    if (categoriesData && !activeCategory) {
      setActiveCategory(categoriesData[0]);
    }

    return () => {};
  }, [categoriesData, activeCategory]);

  useEffect(() => {
    if (route.params?.category && categoriesData) {
      const initialCategory = categoriesData.find(
        category => category.value === route.params.category?.value,
      );
      if (initialCategory) {
        setActiveCategory(initialCategory);
      }
    }

    return () => {};
  }, [route.params?.category, categoriesData]);

  const renderCategoryFilter = () => {
    if (isLoadingCategories && !categoriesData) {
      return null;
    }
    if (errorCategories && !categoriesData) {
      return null;
    }
    if (categoriesData) {
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
                  key={category.value} // Gunakan value unik
                  style={styles.categoryButton}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}
                  disabled={isManualRefreshing} // Disable saat loading
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
                  {/* Indikator aktif di bawah teks */}
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }
    return <View style={styles.categoryContainer} />; // Placeholder
  };

  // --- Render List Rental ---
  const renderRentalList = () => {
    if (isLoadingRentals) {
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
    if (!rentalItems || rentalItems.length === 0) {
      return <EmptyScreen />;
    }

    return (
      <FlatList
        data={rentalItems}
        renderItem={({item}) => <RentalItemCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter /> : null}
        // Pull to Refresh
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing && !isFetchingNextPage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {/* Search Bar Area */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search-outline"
            size={20}
            color={COLORS.primary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Mau cari apa?"
            placeholderTextColor={COLORS.greyDark}
            style={styles.searchInput}
            readOnly
            // onPressIn={() => navigation.navigate('RentalSearch')} // Navigasi ke layar search terpisah
          />
        </View>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Rental List Area */}
      <View style={styles.listArea}>{renderRentalList()}</View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    paddingBottom: 10,
    backgroundColor: COLORS.white, // Pastikan ada background
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greyLight, // Background abu muda
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0, // Reset padding bawaan
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  // Category Filter
  categoryContainer: {
    paddingBottom: 0, // Tidak perlu padding bawah jika indicator nempel
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  categoryScroll: {
    zIndex: 10,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 0, // Indicator akan menutupi area ini
  },
  categoryButton: {
    alignItems: 'center',
    paddingBottom: 12, // Ruang untuk indicator
    marginRight: 25, // Jarak antar kategori
    minWidth: 60, // Lebar minimum tombol
  },
  categoryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginTop: 4,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.textPrimary,
  },
  activeIndicator: {
    height: 3,
    width: '120%',
    alignSelf: 'center',
    backgroundColor: COLORS.textPrimary,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  // List Area
  listArea: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  // Loading, Error, Empty States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  footerLoader: {paddingVertical: 20},
  // Style untuk error/loading kategori (jika diperlukan)
  centerContainerShort: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
  },
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
