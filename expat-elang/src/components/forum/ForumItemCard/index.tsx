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
import {CustomIcon} from '../../common/CustomPhosporIcon';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import ContentRenderer from '../../common/ContentRenderer';

interface ForumItemCardProps {
  item: ProcessedForumTopic;
  isInOwnCategory?: boolean;
  handlePress: () => void;
}

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const ForumItemCard = React.memo(
  ({item, handlePress, isInOwnCategory = false}: ForumItemCardProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('ForumDetail', {forumId: item.id})
        }
        activeOpacity={0.8}>
        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <CustomIcon
              name="UserCircle"
              size={48}
              type="fill"
              color={COLORS.greyMedium}
            />
            <View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <StyledText
                  style={[styles.author]}
                  numberOfLines={1}
                  weight="medium">
                  {item.author}
                </StyledText>
                {item.firstCategory && (
                  <StyledText style={styles.category} numberOfLines={1}>
                    {item.firstCategory}{' '}
                  </StyledText>
                )}
              </View>
              <StyledText style={styles.date}>{item.dateFormatted}</StyledText>
            </View>
          </View>

          {isInOwnCategory && (
            <TouchableOpacity
              style={{alignSelf: 'flex-start'}}
              onPress={() => handlePress()}>
              <CustomIcon
                name="DotsThreeVertical"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          <StyledText style={styles.title} numberOfLines={2}>
            {item.title}
          </StyledText>
          <ContentRenderer content={item.content} numberOfLines={3} />
        </View>

        {item.imageUrl && (
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{uri: item.imageUrl}}
              style={styles.image}
              resizeMode="cover">
              {item.replyCount > 0 && (
                <View style={styles.imageCount}>
                  <StyledText style={styles.imageCountText}>
                    {item.replyCount} replies
                  </StyledText>
                </View>
              )}
            </ImageBackground>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.greyLight,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  author: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  category: {
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
  },
  contentContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
  imageCountText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
  },
});

export default ForumItemCard;
