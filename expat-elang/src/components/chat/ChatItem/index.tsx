import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {format, isToday, isYesterday} from 'date-fns';
import {id} from 'date-fns/locale';
import {ChatConversation} from '../../../types/chat';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../../constants/colors';

interface ChatItemProps {
  conversation: ChatConversation;
  onPress: () => void;
}

const formatTimestamp = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  // Check if same year
  if (date.getFullYear() === new Date().getFullYear()) {
    return format(date, 'dd MMM', {locale: id}); // Format '21 Mar'
  }
  // Different year
  return format(date, 'dd MMM yyyy', {locale: id}); // Format '21 Mar 2024'
};

const ChatItem: React.FC<ChatItemProps> = ({conversation, onPress}) => {
  const {
    participant,
    lastMessage,
    lastMessageTimestamp,
    unreadCount,
    isLastMessageSentByMe,
    lastMessageStatus,
  } = conversation;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image source={{uri: participant.avatarUrl}} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{participant.name}</Text>
        </View>
        <View style={styles.messageRow}>
          {isLastMessageSentByMe && (
            <Icon
              name={
                lastMessageStatus === 'read' ? 'checkmark-done' : 'checkmark'
              } // checkmark-done for blue ticks
              size={16}
              color={
                lastMessageStatus === 'read'
                  ? COLORS.greyLight
                  : COLORS.greyMedium
              } // Blue if read
              style={styles.readTick}
            />
          )}
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.timestamp}>
          {formatTimestamp(lastMessageTimestamp)}
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    // No specific style needed unless you want to align something else here
  },
  name: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium', // Medium or Bold
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTick: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    flexShrink: 1, // Allow message to shrink if needed
  },
  metaContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
});

export default React.memo(ChatItem);
