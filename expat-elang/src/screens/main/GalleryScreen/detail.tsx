// src/screens/GalleryDetailScreen/index.tsx (Buat folder dan file baru)
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper'; // Import Swiper
import Icon from '@react-native-vector-icons/ionicons'; // Import Icon
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import COLORS from '../../../constants/colors';
import {useGalleryImages} from '../../../hooks/useGalleryQuery';
import {useEffect, useMemo, useState} from 'react';
import {RootStackParamList} from '../../../navigation/types';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryDetail'>;

const {width} = Dimensions.get('window');

const GalleryDetailScreen = ({route, navigation}: Props) => {
  const {selectedImageId} = route.params;
  const {data: images, isLoading, error, refetch} = useGalleryImages();

  const [currentIndex, setCurrentIndex] = useState(0);

  const initialIndex = useMemo(() => {
    if (!images) {
      return 0;
    }
    const index = images.findIndex(img => img.id === selectedImageId);
    return index >= 0 ? index : 0; // Default ke 0 jika tidak ditemukan
  }, [images, selectedImageId]);

  // Set state index saat data pertama kali dimuat
  useEffect(() => {
    setCurrentIndex(initialIndex);
    return () => {};
  }, [initialIndex]);

  const handleLinkPress = async () => {
    // Pastikan images ada dan index valid
    if (!images || !images[currentIndex]) {
      return;
    }

    const link = images[currentIndex].link; // Ambil link dari gambar saat ini
    try {
      await Linking.openURL(link);
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  // Custom pagination component
  const renderPagination = (index: number, total: number) => {
    return (
      <View style={styles.paginationStyle}>
        <Text style={styles.paginationText}>
          {index + 1}/{total}
        </Text>
      </View>
    );
  };

  // Render loading state
  if (isLoading && !images) {
    return <LoadingScreen />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorScreen
        refetch={refetch}
        placeholder="Gagal memuat gambar"
        error={error}
      />
    );
  }

  if (!images || images.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text>Data gambar tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <Swiper
          style={styles.swiperWrapper}
          showsButtons={false}
          loop={false} // Biasanya false untuk galeri detail
          // Set index awal Swiper
          index={initialIndex}
          renderPagination={renderPagination}
          // Update state saat slide berubah
          onIndexChanged={index => setCurrentIndex(index)}
          loadMinimal // Optimasi: Hanya render slide terdekat
          loadMinimalSize={1}>
          {images.map(item => (
            <View style={styles.slide} key={item.id}>
              <Image
                source={{uri: item.imageUrl}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </Swiper>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleLinkPress}
            activeOpacity={0.8}
            // Disable tombol jika link tidak ada di gambar saat ini
            disabled={!images[currentIndex]?.link}>
            <Icon
              name="link-outline"
              size={20}
              color={
                images[currentIndex]?.link ? COLORS.primary : COLORS.greyMedium
              }
              style={styles.linkIcon}
            />
            <Text
              style={[
                styles.linkButtonText,
                !images[currentIndex]?.link && styles.linkButtonTextDisabled,
              ]}>
              Baca Selengkapnya
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 0.8,
  },
  swiperWrapper: {},
  slide: {
    flex: 1, // Slide mengisi ruang Swiper
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black, // Background slide (jika image 'contain')
  },
  image: {
    width: width, // Lebar penuh
    flex: 1,
  },
  paginationContainer: {
    bottom: 70,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 20, // Jarak dari bawah gambar
    left: 20, // Jarak dari kiri
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Background semi-transparan
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15, // Sudut melengkung
  },
  paginationText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: COLORS.white, // Pastikan ada background solid
    borderTopWidth: 1, // Garis pemisah tipis (opsional)
    borderTopColor: COLORS.greyLight, // Warna garis (opsional)
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.greyMedium, // Warna border tombol
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  linkIcon: {
    marginRight: 8,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  linkButtonTextDisabled: {
    color: COLORS.greyMedium,
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
});

export default GalleryDetailScreen;
