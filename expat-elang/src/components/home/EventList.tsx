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

const {width} = Dimensions.get('window');
const cardWidth = width * 0.4;

type EventType = {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
};

interface EventListProps {
  events: EventType[];
}

const EventCard = ({item}: {item: EventType}) => (
  <TouchableOpacity style={[styles.card, styles.eventCard]} activeOpacity={0.8}>
    <Image source={{uri: item.imageUrl}} style={styles.eventImage} />
    <View style={styles.cardContent}>
      <StyledText style={styles.eventTitle} numberOfLines={2}>
        {item.title}
      </StyledText>
      <View>
        <StyledText style={styles.eventLocation}>{item.location}</StyledText>
        <StyledText style={styles.eventDate}>{item.date}</StyledText>
      </View>
    </View>
  </TouchableOpacity>
);

const EventList = ({events}: EventListProps) => {
  return (
    <View style={styles.sectionContainer}>
      <HeaderSection
        subtitle="Rekomendasi event seru untukmu"
        title="Event"
        goto="event"
      />
      <FlatList
        horizontal
        data={events}
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
  cardContent: {},
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

