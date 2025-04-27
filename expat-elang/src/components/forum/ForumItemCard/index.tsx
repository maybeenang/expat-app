import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ProcessedForumTopic} from '../../../types/forum';
import COLORS from '../../../constants/colors';
import StyledText from '../../common/StyledText';
import {useNavigation} from '@react-navigation/native';

interface ForumItemCardProps {
  item: ProcessedForumTopic;
}

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const ForumItemCard = React.memo(({item}: ForumItemCardProps) => {
  const navigation = useNavigation();

  const defaultImageUrl =
    'https://via.placeholder.com/300x150/cccccc/969696?text=No+Image';

  const handlePress = () => {
    try {
      navigation.navigate('ForumDetail' as never, {forumId: item.id} as never);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.8}>
      {item.imageUrl ? (
        <ImageBackground
          source={{uri: item.imageUrl ?? defaultImageUrl}}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.imageStyle,
            {
              height: IMAGE_HEIGHT,
              backgroundColor: COLORS.greyLight,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <StyledText style={{color: COLORS.greyDark}}>
            Gambar tidak tersedia
          </StyledText>
        </View>
      )}
      <View style={styles.infoContainer}>
        <StyledText style={styles.title} weight="medium" numberOfLines={2}>
          {item.title}
        </StyledText>
        <View style={styles.metaContainer}>
          <StyledText style={styles.author} numberOfLines={1}>
            {item.author}
          </StyledText>
          <StyledText style={styles.date}>{item.dateFormatted}</StyledText>
        </View>
        <View style={styles.metaContainer}>
          <StyledText style={styles.category} numberOfLines={1}>
            {item.firstCategory}
          </StyledText>
          <StyledText style={styles.replyCount}>
            {item.replyCount} Balasan
          </StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  imageBackground: {
    height: IMAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 8,
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
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  category: {
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  replyCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

export default ForumItemCard;

