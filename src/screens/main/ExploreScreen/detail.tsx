import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from '@react-native-vector-icons/ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useRentalDetailQuery} from '../../../hooks/useRentalQuery';
import COLORS from '../../../constants/colors';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import StyledText from '../../../components/common/StyledText';
type Props = NativeStackScreenProps<RootStackParamList, 'RentalDetail'>;

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 1; // Tinggi gambar (rasio 4:3)

const RentalDetailScreen = ({route, navigation}: Props) => {
  const {rentalId} = route.params;
  const {
    data: rental,
    isLoading,
    error,
    refetch,
  } = useRentalDetailQuery(rentalId);

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleShare = async () => {
    if (!rental) {
      return;
    }
    try {
      const shareUrl = `https://yourapp.com/rental/${rental.id}`;
      await Share.share({
        message: `Lihat properti menarik ini: ${rental.title}\n${shareUrl}`,
        url: shareUrl,
        title: rental.title,
      });
    } catch (shareError: any) {
      Alert.alert('Gagal Membagikan', shareError.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Icon name="share-social-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, rental, handleShare]);

  // --- Kontak CS Action ---
  const handleContactCS = async () => {
    if (!rental?.contactNumber) {
      Alert.alert('Info Kontak Tidak Tersedia');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${rental.contactNumber}`;
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          'WhatsApp Tidak Terinstall',
          'Silakan install WhatsApp untuk menghubungi CS.',
        );
      }
    } catch (err) {
      Alert.alert('Gagal Membuka WhatsApp');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error || !rental) {
    return (
      <ErrorScreen
        error={error}
        placeholder="Gagal memuat data rental."
        refetch={refetch}
      />
    );
  }

  // Custom pagination untuk Swiper
  const renderPagination = (index: number, total: number) => (
    <View style={styles.paginationStyle}>
      <Text style={styles.paginationText}>
        {index + 1}/{total}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {rental.imageUrls.length > 0 ? (
          <Swiper
            style={styles.swiperWrapper}
            height={IMAGE_HEIGHT}
            showsButtons={false}
            loop={false}
            renderPagination={renderPagination}
            onIndexChanged={index => setCurrentImageIndex(index)} // Update index saat ini jika perlu
            loadMinimal
            loadMinimalSize={1}>
            {rental.imageUrls.map((url, index) => (
              <View style={styles.slide} key={`${rental.id}-img-${index}`}>
                <Image
                  source={{uri: url}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        ) : (
          <View style={[styles.slide, {height: IMAGE_HEIGHT}]}>
            <Text style={{color: COLORS.greyDark}}>Gambar tidak tersedia</Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{rental.title}</Text>
          <Text style={styles.location}>{rental.location}</Text>
          <StyledText style={styles.price} weight="bold">
            {rental.priceFormatted[0]}
            <StyledText style={styles.priceType}>
              {rental.priceFormatted[1]}
            </StyledText>
          </StyledText>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={isDescExpanded ? undefined : 4}>
            {rental.description || 'Tidak ada deskripsi tersedia.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.expandButotn, {backgroundColor: COLORS.white}]}
          onPress={() => setIsDescExpanded(!isDescExpanded)}>
          <StyledText style={styles.readMoreText}>
            {isDescExpanded ? 'Lebih Sedikit' : 'Selengkapnya'}
          </StyledText>
          <Icon
            name={
              isDescExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
            }
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactCS}
          activeOpacity={0.8}
          disabled={!rental.contactNumber}>
          <Icon
            name="ban"
            size={22}
            color={COLORS.white}
            style={styles.contactIcon}
          />
          <Text style={styles.contactButtonText}>Kontak CS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  headerButton: {padding: 10, marginRight: 5}, // Padding untuk tombol header
  // Swiper & Image
  swiperWrapper: {}, // Tidak perlu style height jika sudah di Swiper prop
  slide: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.greyLight,
  },
  image: {width: '100%', height: '100%'},
  paginationStyle: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paginationText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  // Info Section
  infoSection: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15},
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  location: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  price: {fontFamily: 'Roboto-Bold', fontSize: 18, color: COLORS.primary},
  // Separator
  separator: {height: 6, backgroundColor: COLORS.greyLight, marginVertical: 10},
  // Description Section
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 18,
    color: COLORS.primary,
    marginRight: 4,
  },
  // Bottom Button
  bottomButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButotn: {
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIcon: {marginRight: 10},
  contactButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },

  priceType: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default RentalDetailScreen;
