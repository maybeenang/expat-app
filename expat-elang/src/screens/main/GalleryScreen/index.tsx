// src/screens/GalleryScreen/index.tsx (Ganti isinya)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {GalleryItemData} from '../../../types/gallery';
import {useGalleryImages} from '../../../hooks/useGalleryQuery';
import COLORS from '../../../constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';

const {width} = Dimensions.get('window');
const NUM_COLUMNS = 2;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

// Komponen Item Grid
const GalleryItem = React.memo(({item}: {item: GalleryItemData}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('GalleryDetail', {
      selectedImageId: item.id,
    });
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={handlePress}
      activeOpacity={0.8}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
});

// Komponen Layar Gallery
const GalleryScreen = () => {
  const {
    data: images, // Data yang sudah di-select (flat array)
    fetchNextPage, // Fungsi untuk fetch halaman berikutnya
    hasNextPage, // Boolean: apakah ada halaman berikutnya?
    isFetchingNextPage, // Boolean: sedang fetch halaman berikutnya?
    isLoading, // Boolean: loading awal?
    isFetching, // Boolean: sedang fetch (awal atau berikutnya)?
    error, // Error object
    refetch, // Fungsi untuk refetch semua halaman (pull-to-refresh)
  } = useGalleryImages();

  const loadMore = () => {
    // Hanya fetch jika ada halaman berikutnya dan tidak sedang fetching
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading && !images) {
    return <LoadingScreen />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorScreen
        error={error}
        placeholder="Gagal memuat galeri"
        refetch={refetch}
      />
    );
  }
  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    } // Jangan render apa2 jika tidak loading next page
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <FlatList
        data={images}
        renderItem={({item}) => <GalleryItem item={item} />}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContainer}
        onRefresh={refetch}
        refreshing={isLoading && !!images}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>Galeri masih kosong.</Text>
          </View>
        }
        onEndReached={loadMore} // Panggil loadMore saat mendekati akhir
        onEndReachedThreshold={0.5} // Trigger 0.5 panjang layar dari akhir
        ListFooterComponent={renderFooter} // Tampilkan loading di bawah
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    marginTop: 24,
    padding: ITEM_MARGIN / 2,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2, // Sesuaikan rasio aspek jika perlu
    margin: ITEM_MARGIN / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.greyLight,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Roboto-Regular', // Pastikan font family konsisten
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Medium',
  },
  footerLoader: {
    paddingVertical: 20, // Beri ruang untuk loader di bawah
  },
});

export default React.memo(GalleryScreen);
