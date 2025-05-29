import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import COLORS from '../../constants/colors';
import StyledText from '../common/StyledText';
import HeaderSection from './HeaderSection';
import {useEventItemsInfinite} from '../../hooks/useEventQuery';
import {ProcessedEventItem} from '../../types/event';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.4;

const EventCard = ({item}: {item: ProcessedEventItem}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('EventDetail', {
      eventId: item.id,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, styles.eventCard]}
      activeOpacity={0.8}
      onPress={handlePress}>
      <Image source={{uri: item.imageUrl ?? ''}} style={styles.eventImage} />
      <View style={styles.cardContent}>
        <StyledText style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </StyledText>
        <View>
          <StyledText style={styles.eventLocation} numberOfLines={1}>
            {item.location}
          </StyledText>
          <StyledText style={styles.eventDate}>{item.dateFormatted}</StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventList = () => {
  const {
    data: eventItems,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useEventItemsInfinite({});

  if (isLoadingEvents) {
    return (
      <View style={styles.sectionContainer}>
        <HeaderSection
          subtitle="Rekomendasi event seru untukmu"
          title="Event"
          goto="Event"
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

  if (errorEvents) {
    return (
      <View style={styles.sectionContainer}>
        <HeaderSection
          subtitle="Rekomendasi event seru untukmu"
          title="Event"
          goto="Event"
        />
        <View
          style={[
            styles.horizontalListPadding,
            {alignItems: 'center', justifyContent: 'center', minHeight: 120},
          ]}>
          <StyledText>
            {errorEvents.message || 'Gagal memuat data event.'}
          </StyledText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <HeaderSection
        subtitle="Rekomendasi event seru untukmu"
        title="Event"
        goto="Event"
      />
      <FlatList
        horizontal
        data={eventItems}
        renderItem={({item}) => <EventCard item={item} />}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 20,
    marginBottom: 25,
  },
  horizontalListPadding: {
    paddingHorizontal: 20,
    paddingRight: 5,
  },
  card: {
    backgroundColor: COLORS.white,
    marginRight: 15,
    overflow: 'hidden',
  },
  eventCard: {
    width: cardWidth,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventImage: {
    width: '100%',
    height: 90,
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 24,
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default EventList;
