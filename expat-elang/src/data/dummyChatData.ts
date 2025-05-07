import {ChatConversation, ChatMessage, ChatParticipant} from '../types/chat'; // Sesuaikan path

const participants: Record<string, ChatParticipant> = {
  '1': {
    id: '1',
    name: 'Revina Putri',
    avatarUrl: 'https://randomuser.me/api/portraits/women/75.jpg',
  },
  '2': {
    id: '2',
    name: 'John Dukes',
    avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  '3': {
    id: '3',
    name: 'Frances Swann',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  '4': {
    id: '4',
    name: 'Joshua Jane',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  '5': {
    id: '5',
    name: 'Ricky Smith',
    avatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
  },
};

export const dummyConversations: ChatConversation[] = [
  {
    id: 'conv1',
    participant: participants['1'],
    lastMessage: 'Baik kak, kalau gitu terima kasih...',
    lastMessageTimestamp: new Date(new Date().setHours(13, 8, 0, 0)), // Today 13:08
    unreadCount: 2,
    isLastMessageSentByMe: false, // Pesan terakhir dari Revina
  },
  {
    id: 'conv2',
    participant: participants['2'],
    lastMessage: 'Iyaa kak',
    lastMessageTimestamp: new Date(
      new Date().setDate(new Date().getDate() - 1),
    ), // Yesterday
    unreadCount: 0,
    isLastMessageSentByMe: false,
  },
  {
    id: 'conv3',
    participant: participants['3'],
    lastMessage: 'Terima kasih yaa kak',
    lastMessageTimestamp: new Date(2025, 2, 21, 10, 30, 0), // 21 Mar (Bulan dimulai dari 0)
    unreadCount: 0,
    isLastMessageSentByMe: true, // Pesan terakhir dari user
    lastMessageStatus: 'read', // Sudah dibaca Frances
  },
  {
    id: 'conv4',
    participant: participants['4'],
    lastMessage: 'Baik kak, kalau gitu terima kasih at...',
    lastMessageTimestamp: new Date(2025, 2, 19, 15, 0, 0), // 19 Mar
    unreadCount: 0,
    isLastMessageSentByMe: false,
  },
  {
    id: 'conv5',
    participant: participants['5'],
    lastMessage: 'iyaa saya sudah pesan',
    lastMessageTimestamp: new Date(2025, 2, 19, 9, 0, 0), // 19 Mar
    unreadCount: 0,
    isLastMessageSentByMe: true, // Pesan terakhir dari user
    lastMessageStatus: 'read', // Sudah dibaca Ricky
  },
];

// Dummy messages for a specific conversation (e.g., with Revina, chatId='conv1')
export const dummyMessagesConv1: ChatMessage[] = [
  // Earlier messages...
  {
    id: 'm1',
    senderId: 'user',
    text: 'Halo kak boleh tanya ngga?',
    timestamp: new Date(2025, 2, 31, 1, 29, 0),
    status: 'read',
  },
  {
    id: 'm2',
    senderId: '1',
    text: 'Halo kak selamat datang, ada yang bisa dibantu',
    timestamp: new Date(2025, 2, 31, 9, 23, 0),
    status: 'read',
  }, // Irrelevant status for received msg
  {
    id: 'm3',
    senderId: 'user',
    text: 'Ada hoodie uniqlo airism size L kak, kalau ada boleh tau harganya?',
    timestamp: new Date(2025, 2, 31, 10, 21, 0),
    status: 'read',
  },
  {
    id: 'm4',
    senderId: '1',
    text: 'Selama masih tampil di display berarti produk tersedia ya, mohon cek berkala untuk stoknya',
    timestamp: new Date(2025, 2, 31, 10, 23, 0),
    status: 'read',
  },
  {
    id: 'm5',
    senderId: '1',
    text: 'Ada lagi yang bisa dibantu kak?',
    timestamp: new Date(2025, 2, 31, 10, 23, 10),
    status: 'read',
  },
  {
    id: 'm6',
    senderId: 'user',
    text: 'Baik kak, terima kasih atas jawabannya, saya lagi cari baju tapi gaada sizenya kak',
    timestamp: new Date(2025, 2, 31, 14, 55, 0),
    status: 'read',
  },
  // Pesan terakhir dari desain ChatScreen (sebagai contoh)
  {
    id: 'm7',
    senderId: '1',
    text: 'Baik kak, kalau gitu terima kasih...',
    timestamp: new Date(new Date().setHours(13, 8, 0, 0)),
    status: 'read',
  },
];

// Function to get dummy messages based on chatId (replace with API call later)
export const getDummyMessages = (chatId: string): ChatMessage[] => {
  if (chatId === 'conv1') {
    return dummyMessagesConv1.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    ); // Sort ascending for processing
  }
  // Add more conditions for other dummy chats
  return []; // Return empty for other chats for now
};
