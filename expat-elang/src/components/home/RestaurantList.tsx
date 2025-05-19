import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../constants/colors';
import HeaderSection from './HeaderSection';
import {useRestaurantItemsInfinite} from '../../hooks/useBizQuery';
import {ProcessedBizItem} from '../../types/biz';
import StyledText from '../common/StyledText';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.4;

const renderRestaurantCard = ({item}: {item: ProcessedBizItem}) => (
  <TouchableOpacity
    style={[styles.card, styles.restaurantCard]}
    activeOpacity={0.8}>
    <Image source={{uri: item.imageUrl}} style={styles.restaurantImage} />
    <View style={styles.cardContent}>
      <Text style={styles.restaurantName} numberOfLines={2}>
        {item.name}
      </Text>
      <View>
        <Text style={styles.restaurantLocation}>{item.city}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFC107" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const RestaurantList = () => {
  const {data, error, isLoading} = useRestaurantItemsInfinite({});

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <HeaderSection
          subtitle="Rekomendasi Restoran"
          title="Restaurant"
          goto="Restaurant"
        />
        <View
          style={[
            styles.horizontalListPadding,
            {alignItems: 'center', justifyContent: 'center', minHeight: 120},
          ]}>
          <StyledText>Loading...</StyledText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.sectionContainer}>
        <HeaderSection
          subtitle="Rekomendasi Restoran"
          title="Restaurant"
          goto="Restaurant"
        />
        <View
          style={[
            styles.horizontalListPadding,
            {alignItems: 'center', justifyContent: 'center', minHeight: 120},
          ]}>
          <StyledText>{error?.message}</StyledText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <HeaderSection
        subtitle="Rekomendasi Restoran"
        title="Restaurant"
        goto="Restaurant"
      />
      <FlatList
        horizontal
        data={data}
        renderItem={renderRestaurantCard}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 25,
  },
  horizontalListPadding: {
    paddingHorizontal: 20,
    paddingRight: 5,
  },
  card: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: COLORS.greyDark,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  restaurantCard: {
    width: cardWidth,
  },
  restaurantImage: {
    width: '100%',
    height: 144,
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 24,
  },
  restaurantLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default RestaurantList;
