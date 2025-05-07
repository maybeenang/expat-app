import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack'; // Atau Tab Screen Props
import {RootStackParamList} from '../../../navigation/types';
import {ChatConversation} from '../../../types/chat';
import {dummyConversations} from '../../../data/dummyChatData';
import COLORS from '../../../constants/colors';
import ChatItem from '../../../components/chat/ChatItem';

interface ChatScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'Chat'> {} // Ganti 'ChatList'

const ChatScreen = ({navigation}: ChatScreenProps) => {
  // Nanti ganti dengan data dari state management atau API fetch
  const [conversations] = useState<ChatConversation[]>(dummyConversations);

  const handleNavigateToDetail = (
    chatId: string,
    participantName: string,
    participantAvatarUrl: string,
  ) => {
    navigation.navigate('ChatDetail', {
      chatId,
      participantName,
      participantAvatarUrl,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {/* Header diatur oleh Stack Navigator */}
      <FlatList
        data={conversations}
        renderItem={({item}) => (
          <ChatItem
            conversation={item}
            onPress={() =>
              handleNavigateToDetail(
                item.id,
                item.participant.name,
                item.participant.avatarUrl,
              )
            }
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.greyLight,
    marginLeft: 78, // Align with text content (Avatar width + margin)
  },
});

export default ChatScreen;
