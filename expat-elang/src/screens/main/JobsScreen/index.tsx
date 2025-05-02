// src/screens/JobsScreen/index.tsx (Buat folder dan file baru)
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Keyboard,
} from 'react-native';
import {useJobItemsInfinite} from '../../../hooks/useJobsQuery';
import {ProcessedListItem} from '../../../types/jobs';
import AdItemCard from '../../../components/jobs/AdItemCard';
import JobItemCard from '../../../components/jobs/JobItemCard';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';

const JobsScreen = () => {
  // State untuk search dan location filter
  const [searchQuery, setSearchQuery] = useState(''); // Teks yang diketik user
  const [locationQuery, setLocationQuery] = useState(''); // Lokasi yang diketik user
  const [submittedSearch, setSubmittedSearch] = useState(''); // Term search yang disubmit
  const [submittedLocation, setSubmittedLocation] = useState(''); // Lokasi yang disubmit

  // Gunakan hook infinite query dengan state yang SUDAH disubmit
  const {
    data: listItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useJobItemsInfinite(submittedSearch, submittedLocation);

  // --- Handlers ---
  const handleFilterSubmit = () => {
    Keyboard.dismiss();
    setSubmittedSearch(searchQuery.trim());
    setSubmittedLocation(locationQuery.trim());
    // Refetch tidak perlu dipanggil manual, perubahan queryKey akan trigger
  };

  // Fungsi untuk pull-to-refresh manual
  const handleManualRefresh = useCallback(async () => {
    try {
      // refetch() dari useInfiniteQuery akan mengambil ulang dari halaman 1
      await refetch();
    } catch (err) {
      console.error('Manual refresh failed:', err);
    }
  }, [refetch]);

  // --- Render Item ---
  const renderItem = ({item}: {item: ProcessedListItem}) => {
    if (item.type === 'ad') {
      return <AdItemCard item={item.data} key={`ad-${item.data.id}`} />;
    } else if (item.type === 'job') {
      return <JobItemCard item={item.data} key={`jobs-${item.data.id}`} />;
    }
    return null;
  };

  // --- Render Footer ---
  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  // --- Render Loading / Error / Empty ---
  const renderListContent = () => {
    // Initial Loading
    if (isLoading && !listItems) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    if (error && !listItems) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Gagal memuat data: {error.message}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if ((!listItems || listItems.length === 0) && !isFetching) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="file-tray-outline" size={60} color={COLORS.greyMedium} />
          <Text style={styles.infoText}>Lowongan tidak ditemukan.</Text>
          <Text style={styles.infoSubText}>
            Coba ubah kata kunci atau lokasi pencarian Anda.
          </Text>
        </View>
      );
    }
    // Tampilkan list jika ada data
    return (
      <FlatList
        data={listItems}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // Infinite Scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7} // Trigger lebih awal
        ListFooterComponent={renderFooter}
        // Pull to Refresh
        onRefresh={handleManualRefresh}
        refreshing={isFetching && !isFetchingNextPage} // Hanya saat refetch penuh
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Asumsi Header dari Stack Navigator */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Icon
              name="search-outline"
              size={20}
              color={COLORS.greyDark}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Keyword"
              placeholderTextColor={COLORS.greyDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleFilterSubmit} // Bisa submit dari sini
            />
          </View>
          <View style={styles.inputSeparator} />
          <View style={styles.inputContainer}>
            <Icon
              name="location-outline"
              size={20}
              color={COLORS.greyDark}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Lokasi"
              placeholderTextColor={COLORS.greyDark}
              value={locationQuery}
              onChangeText={setLocationQuery}
              returnKeyType="search"
              onSubmitEditing={handleFilterSubmit} // Atau dari sini
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleFilterSubmit}>
          <Text style={styles.searchButtonText}>Cari Lowongan</Text>
        </TouchableOpacity>
      </View>

      {/* List Area */}
      <View style={styles.listArea}>{renderListContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white, // Atau light grey jika mau
  },
  // Filter Section
  filterSection: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greyLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  inputSeparator: {
    width: 10, // Jarak antar input
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  // List Area
  listArea: {
    flex: 1,
    // backgroundColor: '#F9F9F9', // Background area list jika beda
  },
  listContainer: {
    padding: 15,
  },
  // Loading/Error/Empty States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // Padding lebih besar
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Medium',
  },
  infoText: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.textPrimary, // Lebih gelap dari secondary
    fontSize: 17,
    marginTop: 15,
    textAlign: 'center',
  },
  infoSubText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center', // Pusatkan loader
  },
});

export default JobsScreen;
