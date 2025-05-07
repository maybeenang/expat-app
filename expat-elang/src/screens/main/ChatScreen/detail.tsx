import React, {useState, useCallback, useLayoutEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {format, isSameDay} from 'date-fns';
import {id} from 'date-fns/locale';
import {RootStackParamList} from '../../../navigation/types';
import {ChatListItem, ChatMessage} from '../../../types/chat';
import {getDummyMessages} from '../../../data/dummyChatData';
import COLORS from '../../../constants/colors';
import MessageBubble from '../../../components/chat/MessageBubble';
import ChatInput from '../../../components/chat/ChatInput';

interface ChatDetailScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'ChatDetail'> {} // Adjust route name

// Helper function to group messages and add date separators
const processMessagesForList = (messages: ChatMessage[]): ChatListItem[] => {
  if (!messages || messages.length === 0) {
    return [];
  }

  const listItems: ChatListItem[] = [];
  let lastDate: Date | null = null;

  // Sort messages ascending by timestamp first
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  sortedMessages.forEach(message => {
    const messageDate = message.timestamp;
    // Add date separator if the date is different from the last one
    if (!lastDate || !isSameDay(messageDate, lastDate)) {
      listItems.push({type: 'date_separator', date: messageDate});
      lastDate = messageDate;
    }
    listItems.push(message); // Add the message
  });

  // The list is now chronologically ordered with separators interspersed
  return listItems;
};

const ChatDetailScreen = ({navigation, route}: ChatDetailScreenProps) => {
  const {chatId, participantName, participantAvatarUrl} = route.params;
  const userId = 'user'; // Dummy user ID

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getDummyMessages(chatId),
  );
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Process messages for display, including date separators
  const processedListItems = useMemo(
    () => processMessagesForList(messages),
    [messages],
  );

  // Set dynamic header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Image
            source={{uri: participantAvatarUrl}}
            style={styles.headerAvatar}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {participantName}
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
      headerStyle: {backgroundColor: COLORS.white},
      headerShadowVisible: false,
    });
  }, [navigation, participantName, participantAvatarUrl]);

  // Handle sending a new message
  const handleSend = useCallback(() => {
    if (inputText.trim().length === 0 || isSending) {
      return;
    }
    setIsSending(true);

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      text: inputText.trim(),
      timestamp: new Date(),
      status: 'sent',
    };

    // Simulate sending and receiving read receipt
    setTimeout(() => {
      // Add message optimistically
      setMessages(prevMessages =>
        [...prevMessages, newMessage].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        ),
      );
      setInputText('');
      setIsSending(false);

      // Simulate read receipt after delay
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? {...msg, status: 'read'} : msg,
          ),
        );
      }, 1500);
    }, 500);
  }, [inputText, userId, isSending]);

  // Render item for FlatList (Handles both message and date separator)
  const renderItem = ({item}: {item: ChatListItem}) => {
    // --- Type Guard ---
    if ('type' in item && item.type === 'date_separator') {
      // --- Render Date Separator ---
      return (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>
            {format(item.date, 'dd MMM yyyy', {locale: id})}
          </Text>
        </View>
      );
    } else {
      return (
        <MessageBubble
          message={item as ChatMessage} // Pass the ChatMessage
          isSentByMe={item.senderId === userId}
        />
      );
    }
  };

  // Key extractor for FlatList (Handles both types)
  const keyExtractor = (item: ChatListItem, index: number): string => {
    // --- Type Guard ---
    if ('type' in item && item.type === 'date_separator') {
      // Generate a unique key for date separators
      return `date-${item.date.toISOString()}-${index}`;
    } else {
      // Use the message ID for ChatMessage items
      return item.id;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <FlatList
        data={processedListItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor} // Use the corrected keyExtractor
        contentContainerStyle={styles.messageListContent}
        style={styles.messageList}
        // Optimization props (optional but recommended for chat)
        removeClippedSubviews={Platform.OS === 'android'} // Can improve performance on Android
        initialNumToRender={15} // Render a decent amount initially
        maxToRenderPerBatch={10} // Render in smaller batches during scroll
        windowSize={11} // Render items within viewport + 5 above/below
      />
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        isSending={isSending}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
    marginRight: 30 /* Add margin right to prevent long names overlapping */,
  },
  headerAvatar: {width: 36, height: 36, borderRadius: 18, marginRight: 10},
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textPrimary,
    flexShrink: 1 /* Allow text to shrink */,
  },
  messageList: {flex: 1},
  messageListContent: {paddingVertical: 10},
  dateSeparatorContainer: {alignItems: 'center', marginVertical: 10},
  dateSeparatorText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.greyLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default ChatDetailScreen;
