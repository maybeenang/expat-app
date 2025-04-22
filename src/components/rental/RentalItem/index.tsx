import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// Import tipe RootStackParamList jika navigasi ke detail ada di sana
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProcessedRentalItem} from '../../../types/rental';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import StyledText from '../../common/StyledText';

interface RentalItemCardProps {
  item: ProcessedRentalItem;
}

const RentalItemCard = React.memo(({item}: RentalItemCardProps) => {
  // Asumsi navigasi ke 'RentalDetail' di RootStack
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('RentalDetail', {rentalId: item.id});
  };

  const defaultImageUrl =
    'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image';

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.8}>
      <ImageBackground
        source={{uri: item.imageUrl ?? defaultImageUrl}}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover">
        {/* Tag Tipe */}
        <View style={styles.typeTagContainer}>
          <StyledText weight="medium" style={styles.typeTagText}>
            {item.typeLabel}
          </StyledText>
        </View>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <StyledText style={styles.title} numberOfLines={1}>
          {item.title}
        </StyledText>
        <StyledText style={styles.location} numberOfLines={1}>
          {item.location}
        </StyledText>
        <StyledText style={styles.price} weight="bold">
          {item.priceFormatted[0]}
          <StyledText style={styles.priceType}>
            {item.priceFormatted[1]}
          </StyledText>
        </StyledText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 40,
  },
  imageBackground: {
    height: 240,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageStyle: {
    borderRadius: 8,
  },
  typeTagContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 8,
  },
  typeTagText: {
    color: COLORS.white,
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    color: COLORS.primary,
  },
  priceType: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default RentalItemCard;
