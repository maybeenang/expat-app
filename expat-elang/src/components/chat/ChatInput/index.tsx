import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  isSending?: boolean; // Optional: to disable while sending
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'Tulis pesan...',
  isSending = false,
}) => {
  const canSend = value.trim().length > 0 && !isSending;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.greyDark}
        multiline
        editable={!isSending}
      />
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.7}>
        <Icon
          name="send" // Or 'paper-plane' depending on library
          size={22}
          color={canSend ? COLORS.primary : COLORS.greyMedium}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    minHeight: 40, // Minimum height
    maxHeight: 100, // Maximum height for multiline
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 10 : 8, // Adjust padding for vertical alignment
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    backgroundColor: COLORS.greyLight, // Input background
    borderRadius: 20, // Rounded input
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatInput;
