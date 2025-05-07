export type MessageReadStatus = 'sent' | 'delivered' | 'read';

export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ChatConversation {
  id: string;
  participant: ChatParticipant;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  lastMessageStatus?: MessageReadStatus; // Status pesan terakhir yang dikirim oleh user ini
  isLastMessageSentByMe?: boolean; // Untuk menentukan siapa pengirim pesan terakhir
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'user' or participant.id
  text: string;
  timestamp: Date;
  status: MessageReadStatus; // Status pesan (jika dikirim oleh user)
}

// Untuk memisahkan tanggal di detail chat
export interface DateSeparator {
  type: 'date_separator';
  date: Date;
}

// Gabungan tipe untuk list di ChatDetailScreen
export type ChatListItem = ChatMessage | DateSeparator;
