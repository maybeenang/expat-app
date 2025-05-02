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
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html';
import {useNavigation} from '@react-navigation/native';

interface ForumItemCardProps {
  item: ProcessedForumTopic;
  isInOwnCategory?: boolean;
  handlePress: () => void;
}

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const ForumItemCard = React.memo(
  ({item, handlePress, isInOwnCategory = false}: ForumItemCardProps) => {
    const navigation = useNavigation();

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate(
            'ForumDetail' as never,
            {forumId: item.id} as never,
          )
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

        <View style={styles.infoContainer}>
          <StyledText style={styles.title} weight="bold" numberOfLines={2}>
            {item.title}
          </StyledText>
          <RenderHTML
            source={{html: item.content}}
            tagsStyles={htmlStyles}
            contentWidth={width - 30}
          />
        </View>

        {item.imageUrl ? (
          <ImageBackground
            source={{uri: item.imageUrl}}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.bubbleContainer}>
          <CustomIcon
            name="ChatsTeardrop"
            color={COLORS.textSecondary}
            size={20}
          />
          <StyledText style={styles.replyCount}>{item.replyCount}</StyledText>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.greyMedium,
    gap: 10,
  },
  imageBackground: {
    height: IMAGE_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: COLORS.greyMedium,
    backgroundColor: COLORS.greyLight,
  },
  imageStyle: {
    borderRadius: 8,
  },
  infoContainer: {
    padding: 0,
  },
  title: {
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  replyCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

const htmlStyles: Readonly<Record<string, MixedStyleDeclaration>> = {
  p: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 16, // Jarak antar paragraf
  },
  strong: {
    fontFamily: 'Roboto-Bold',
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'none',
    fontFamily: 'Roboto-Regular',
  },
  ul: {
    marginBottom: 16,
  },
  li: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  h1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
  },
  h2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
  blockquote: {
    fontFamily: 'Roboto-Italic',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textSecondary,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  h3: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
};

export default ForumItemCard;
