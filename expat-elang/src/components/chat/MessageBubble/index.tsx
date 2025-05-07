import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ChatMessage} from '../../../types/chat';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../../constants/colors';
import {format} from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  isSentByMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message, isSentByMe}) => {
  const {text, timestamp, status} = message;

  const bubbleStyle = isSentByMe ? styles.sentBubble : styles.receivedBubble;
  const textStyle = isSentByMe ? styles.sentText : styles.receivedText;
  const containerStyle = isSentByMe
    ? styles.sentContainer
    : styles.receivedContainer;

  const getReadIcon = () => {
    if (!isSentByMe) return null;
    return (
      <Icon
        name={status === 'read' ? 'checkmark-done' : 'checkmark'}
        size={16}
        color={status === 'read' ? COLORS.greyLight : COLORS.greyMedium} // Blue for read, muted white otherwise
        style={styles.readTick}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={textStyle}>{text}</Text>
        <View style={styles.metaContainer}>
          <Text style={[styles.timestamp, isSentByMe && styles.sentTimestamp]}>
            {format(timestamp, 'HH:mm')}
          </Text>
          {getReadIcon()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%', // Prevent bubble from taking full width
  },
  sentContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18, // General radius
  },
  sentBubble: {
    backgroundColor: COLORS.primary, // Red color from design
    borderBottomRightRadius: 6, // Less rounded corner
  },
  receivedBubble: {
    backgroundColor: COLORS.greyLight, // White/Light grey from design
    borderBottomLeftRadius: 6, // Less rounded corner
  },
  sentText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.white,
  },
  receivedText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align timestamp and ticks to the end
    marginTop: 4,
    marginLeft: 10, // Add some space if text is short
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary, // Default grey for received
  },
  sentTimestamp: {
    color: COLORS.greyLight, // Lighter color for sent timestamp
  },
  readTick: {
    marginLeft: 4,
  },
});

export default React.memo(MessageBubble);
