import React, {useState, useLayoutEffect, useCallback} from 'react';
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
import Icon from '@react-native-vector-icons/ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useRentalDetailQuery} from '../../../hooks/useRentalQuery';
import COLORS from '../../../constants/colors';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import StyledText from '../../../components/common/StyledText';
import {format} from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalDetail'>;

const {width} = Dimensions.get('window');

// Helper function to clean HTML tags from text
const cleanHtmlTags = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .trim(); // Remove leading/trailing whitespace
};

const RentalDetailScreen = ({route, navigation}: Props) => {
  const {rentalId} = route.params;
  const {
    data: rental,
    isLoading,
    error,
    refetch,
  } = useRentalDetailQuery(rentalId);

  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleShare = useCallback(async () => {
    if (!rental) {
      return;
    }
    try {
      const shareUrl = `https://yourapp.com/rental/${rental.id}`;
      await Share.share({
        message: `Check out this interesting property: ${rental.title}\n${shareUrl}`,
        url: shareUrl,
        title: rental.title,
      });
    } catch (shareError: any) {
      Alert.alert('Failed to Share', shareError.message);
    }
  }, [rental]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Icon name="share-social-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, rental, handleShare]);

  // --- Contact CS Action ---
  const handleContactCS = async () => {
    if (!rental?.contactNumber) {
      Alert.alert('Contact Information Not Available');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${rental.contactNumber}`;
    try {
      await Linking.openURL(whatsappUrl);
    } catch (err) {
      Alert.alert('Failed to Open WhatsApp');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error || !rental) {
    return (
      <ErrorScreen
        error={error}
        placeholder="Failed to load rental data."
        refetch={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.slide}>
          <Image
            source={{uri: rental.imageUrls[0]}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{rental.title}</Text>
          <View style={styles.locationContainer}>
            <Icon
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.location}>{rental.location}</Text>
          </View>
          <StyledText style={styles.price} weight="bold">
            {rental.priceFormatted[0]}
            <StyledText style={styles.priceType}>
              {rental.priceFormatted[1]}
            </StyledText>
          </StyledText>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Property Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name="home-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{rental.typeLabel}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailLabel}>Availability</Text>
              <Text style={styles.detailValue}>
                {format(new Date(rental.availability), 'MMMM d, yyyy')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailLabel}>Minimum Stay</Text>
              <Text style={styles.detailValue}>
                {rental.stayMin} {rental.stayType.toLowerCase()}
                {rental.stayMax &&
                  ` - ${rental.stayMax} ${rental.stayType.toLowerCase()}`}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailLabel}>Maximum Stay</Text>
              <Text style={styles.detailValue}>
                {rental.stayMax} {rental.stayType.toLowerCase()}
              </Text>
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <Icon name="location-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addressTitle}>Address</Text>
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressText}>
                {rental.address}
                {rental.address2 && `\n${rental.address2}`}
                {rental.city && `\n${rental.city}`}
                {rental.state && `, ${rental.state}`}
                {rental.zip && ` ${rental.zip}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text
            style={styles.description}
            numberOfLines={isDescExpanded ? undefined : 3}>
            {cleanHtmlTags(rental.description)}
          </Text>
          {rental.descExpandable && (
            <TouchableOpacity
              onPress={() => setIsDescExpanded(!isDescExpanded)}
              style={styles.expandButton}>
              <Text style={styles.expandButtonText}>
                {isDescExpanded ? 'Show Less' : 'Show More'}
              </Text>
              <Icon
                name={
                  isDescExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
                }
                size={16}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
          {isDescExpanded && rental.imageUrls.length > 1 && (
            <View style={styles.additionalImagesContainer}>
              {rental.imageUrls.slice(1).map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{uri: imageUrl}}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.separator} />

        {/* Features Section */}
        {rental.features && rental.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {rental.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* House Rules Section */}
        {rental.houseRules && rental.houseRules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>House Rules</Text>
            <View style={styles.rulesList}>
              {rental.houseRules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Icon
                    name="information-circle"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Contact CS Button - Temporarily Disabled
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.contactButton, {opacity: 0.5}]}
          disabled={true}>
          <Icon name="logo-whatsapp" size={22} color={COLORS.white} style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>Contact CS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={handleShare}>
          <Icon name="logo-whatsapp" size={22} color={COLORS.white} style={styles.contactIcon} />
          <Text style={styles.whatsappButtonText}>Contact via WhatsApp</Text>
        </TouchableOpacity>
      </View>
        */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width, // Adjust width to account for padding
    height: (width - 40) * 0.75, // 4:3 aspect ratio
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: 20,
    color: COLORS.primary,
  },
  priceType: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  separator: {
    height: 8,
    backgroundColor: COLORS.greyLight,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: 'Roboto-Medium',
  },
  addressSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  addressContent: {
    backgroundColor: COLORS.greyLight,
    padding: 15,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  featureItem: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  rulesList: {
    marginHorizontal: -5,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  ruleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  additionalImagesContainer: {
    marginTop: 15,
  },
  additionalImage: {
    width: width, // Adjust width to account for padding
    height: (width - 40) * 0.75, // 4:3 aspect ratio
    marginBottom: 15,
    overflow: 'hidden',
  },
  bottomButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  whatsappButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  headerButton: {
    padding: 8,
  },
  expandButton: {
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  expandButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  contactIcon: {
    marginRight: 8,
  },
});

export default RentalDetailScreen;
