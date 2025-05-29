import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import StyledText from '../../common/StyledText';
import COLORS from '../../../constants/colors';
import {ProcessedForumReply} from '../../../types/forum';
import {CustomIcon} from '../../common/CustomPhosporIcon';

interface ForumReplyItemProps {
  item: ProcessedForumReply;
}

const {width} = Dimensions.get('window');

const ForumReplyItem = ({item}: ForumReplyItemProps) => {
  return (
    <View style={styles.replyContainer}>
      <View>
        <CustomIcon
          name="UserCircle"
          size={36}
          type="fill"
          color={COLORS.greyMedium}
        />
      </View>
      <View style={{gap: 4}}>
        <View style={styles.replyAuthorContainer}>
          <StyledText style={styles.replyAuthor}>{item.author}</StyledText>
          <StyledText style={styles.replyDate}>{item.dateFormatted}</StyledText>
        </View>
        <View style={{width: width - width * 0.2}}>
          <StyledText style={styles.replyContent}>{item.content}</StyledText>
        </View>
        <View style={styles.replyImageContainer}>
          {item.images &&
            item.images.length > 0 &&
            item.images.map((img, idx) => (
              <Image
                key={idx}
                source={{uri: img}}
                style={styles.replyImage}
                resizeMode="cover"
              />
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  replyAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  replyAuthor: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  replyDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  replyContent: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  replyImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
});

export default ForumReplyItem;
