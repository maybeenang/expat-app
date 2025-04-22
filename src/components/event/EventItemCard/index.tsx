import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ProcessedEventItem} from '../../../types/event';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import StyledText from '../../common/StyledText';

interface EventItemCardProps {
  item: ProcessedEventItem;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  usePush?: boolean;
}

const EventItemCard = React.memo(
  ({item, navigation, usePush}: EventItemCardProps) => {
    const handlePress = () => {
      console.log('Navigate to event detail:', item.slug);
      if (navigation) {
        if (usePush) {
          navigation.push('EventDetail', {eventId: item.id});
        } else {
          navigation.navigate('EventDetail', {eventId: item.id});
        }
      } else {
        console.warn('Navigation prop is not provided');
      }
    };

    const defaultImageUrl =
      'https://via.placeholder.com/300x150/cccccc/969696?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={handlePress}
        activeOpacity={0.8}>
        <ImageBackground
          source={{uri: item.imageUrl ?? defaultImageUrl}}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <StyledText style={styles.title} weight="medium" numberOfLines={2}>
            {item.title}
          </StyledText>
          <View style={styles.metaContainer}>
            <StyledText
              style={styles.location}
              weight="medium"
              numberOfLines={1}>
              {item.location}
            </StyledText>
            <StyledText style={styles.date}>{item.dateFormatted}</StyledText>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  imageBackground: {
    height: 200,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default EventItemCard;
