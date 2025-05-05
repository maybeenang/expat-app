import React, {useState, useLayoutEffect, useRef, useCallback} from 'react';
import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard,
  Platform,
  Text,
} from 'react-native';
import StyledText from '../../../components/common/StyledText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import {CustomIcon} from '../../../components/common/CustomPhosporIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/ionicons';
import {useJobItemsInfinite} from '../../../hooks/useJobsQuery';
import {ProcessedListItem} from '../../../types/jobs';
import AdItemCard from '../../../components/jobs/AdItemCard';
import JobItemCard from '../../../components/jobs/JobItemCard';
import ErrorScreen from '../../ErrorScreen';
import LoadingScreen, {LoadingFooter} from '../../LoadingScreen';
import EmptyScreen from '../../EmptyScreen';
import useManualRefresh from '../../../hooks/useManualRefresh';

const locations = [
  {label: 'Semua Lokasi', value: ''}, // Option to clear filter
  {label: 'Jakarta', value: 'jakarta'},
  {label: 'Bandung', value: 'bandung'},
  {label: 'Surabaya', value: 'surabaya'},
  {label: 'Medan', value: 'medan'},
  {label: 'Balikpapan', value: 'balikpapan'},
  {label: 'Bogor', value: 'bogor'},
  {label: 'Tangerang', value: 'tangerang'},
  {label: 'Malang', value: 'malang'},
];

interface JobsSearchScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'JobSearch'> {}

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  onSubmit: () => void;
  bottomModalRef: React.RefObject<BottomSheetModal | null>;
}

const SearchHeader = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
  bottomModalRef,
}: SearchHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInputContainer}>
        <Icon
          name="search-outline"
          size={20}
          color={COLORS.primary} // Changed color to primary
          style={styles.headerSearchIcon}
        />
        <TextInput
          style={styles.headerInput}
          placeholder="Search Jobs"
          placeholderTextColor={COLORS.greyMedium}
          selectionColor={COLORS.primary}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoFocus
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          bottomModalRef.current?.present();
        }}>
        <CustomIcon name="Faders" size={25} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const JobsSearchScreen = ({navigation}: JobsSearchScreenProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState('');

  const {
    data: listItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useJobItemsInfinite({
    searchTerm: submittedSearch,
    location: submittedLocation,
  });

  const handleFilterSubmit = useCallback(() => {
    setSubmittedSearch(prev => {
      if (searchTerm.trim() === '') {
        return prev;
      }
      return searchTerm.trim();
    });

    setSubmittedLocation(selectedLocation);
    Keyboard.dismiss();
    bottomSheetModalRef.current?.dismiss();
  }, [searchTerm, selectedLocation]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log('handleSheetChanges', index);
      if (index === -1) {
        handleFilterSubmit();
      }
    },
    [handleFilterSubmit],
  );

  const {handleManualRefresh, isManualRefreshing} = useManualRefresh({
    refetch: refetch,
    isFetching: isFetching,
  });

  const handleSelectLocation = (locationValue: string) => {
    setSelectedLocation(locationValue);
  };

  const handleResetFilters = () => {
    setSelectedLocation('');
    setSubmittedLocation('');
    bottomSheetModalRef.current?.dismiss();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle() {
        return (
          <SearchHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={handleFilterSubmit}
            bottomModalRef={bottomSheetModalRef}
          />
        );
      },
    });
  }, [navigation, searchTerm, handleFilterSubmit]);

  const renderItem = ({item}: {item: ProcessedListItem}) => {
    if (item.type === 'ad') {
      return <AdItemCard item={item.data} />;
    } else if (item.type === 'job') {
      return <JobItemCard item={item.data} />;
    }
    return null;
  };

  // --- Render Footer for FlatList ---
  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return <LoadingFooter />;
  };

  const renderListContent = () => {
    if (!submittedSearch) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.infoText}>Cari Lowongan Pekerjaan</Text>
        </View>
      );
    }

    if (isLoading && !listItems) {
      return <LoadingScreen />;
    }
    if (error && !listItems) {
      return (
        <ErrorScreen
          error={error}
          refetch={refetch}
          placeholder="Terdapat kesalahan"
        />
      );
    }

    if ((!listItems || listItems.length === 0) && !isFetching) {
      return <EmptyScreen />;
    }

    return (
      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={item => `${item.type}-${item.data.id}-${Math.random()}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing && !isFetchingNextPage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.contentArea}>{renderListContent()}</View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        onChange={handleSheetChanges}
        backdropComponent={props => (
          <BottomSheetBackdrop
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
            {...props}
          />
        )}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.sheetHeader}>
            <StyledText style={styles.sheetTitle}>Filter Lokasi</StyledText>
            <TouchableOpacity
              onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Icon name="close-outline" size={28} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={locations}
            keyExtractor={item => item.value}
            renderItem={({item}) => {
              const isSelected = selectedLocation === item.value;
              return (
                <TouchableOpacity
                  style={[
                    styles.locationItem,
                    isSelected && styles.locationItemSelected,
                  ]}
                  onPress={() => handleSelectLocation(item.value)}>
                  <StyledText
                    style={[
                      styles.locationText,
                      isSelected && styles.locationTextSelected,
                    ]}>
                    {item.label}
                  </StyledText>
                  {isSelected && (
                    <Icon
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {/* Action Buttons */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilters}>
              <StyledText style={styles.resetButtonText}>Reset</StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleFilterSubmit}>
              <StyledText style={styles.applyButtonText}>
                Terapkan Filter
              </StyledText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentArea: {
    flex: 1, // Ensure list area takes remaining space
  },
  // Header Styles
  headerBackButton: {
    padding: 5,
    marginLeft: Platform.OS === 'android' ? 0 : 10,
  },
  headerContainer: {
    // width: NUMBER.defaultTitleHeaderWidth, // Removed, let flex handle it
    flex: 1, // Take available space
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: Platform.OS === 'ios' ? 0 : 10, // Adjust right margin if needed on Android
  },
  headerInputContainer: {
    flex: 1,
    height: 40, // Fixed height
    backgroundColor: COLORS.greyLight,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerSearchIcon: {
    marginRight: 8,
  },
  headerInput: {
    flex: 1,
    paddingVertical: 0, // Remove default padding
    fontSize: 15,
    color: COLORS.textPrimary, // Darker text color for input
    fontFamily: 'Roboto-Regular', // Assuming you have this font
  },
  // Bottom Sheet Styles
  handleIndicator: {
    backgroundColor: COLORS.greyMedium,
    width: 40,
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    // padding: 20, // Removed padding from here, apply to inner elements
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold', // Assuming this exists
    color: COLORS.textPrimary,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  locationItemSelected: {
    // backgroundColor: COLORS.primary + '10', // Optional background highlight
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  locationTextSelected: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.greyLight,
    marginHorizontal: 20,
  },
  sheetFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    gap: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  resetButtonText: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  applyButton: {
    flex: 2, // Apply button wider
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30, // Extra padding at bottom
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default JobsSearchScreen;
