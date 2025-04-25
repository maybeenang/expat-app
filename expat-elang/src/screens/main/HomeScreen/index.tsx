import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, StatusBar} from 'react-native';
import COLORS from '../../../constants/colors';
import HomeMenuList from '../../../components/home/HomeMenuList';
import HomeBannerList from '../../../components/home/HomeBannerList';
import ForumTopicList from '../../../components/home/ForumTopicList';
import EventList from '../../../components/home/EventList';
import RestaurantList from '../../../components/home/RestaurantList';
import LawyerList from '../../../components/home/LawyerList';

// --- Dummy Data (Replace with API data later) ---

const events = [
  {
    id: 'e1',
    title: 'Festival Kuliner Nusantara',
    location: 'Bandung',
    date: '12 Mei 2025',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'e2',
    title: 'Expo Industri Digital Indonesia',
    location: 'Jakarta',
    date: '8 Agu 2025',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'e3',
    title: 'Wisata Budaya Musik Lokal',
    location: 'Denpasar',
    date: '9 Sep 2025',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
];

const forumTopics = [
  {id: 'f1', label: 'Film Jumbo'},
  {id: 'f2', label: 'Keuangan'},
  {id: 'f3', label: 'Teknologi'},
  {id: 'f4', label: 'Travel'},
  {id: 'f5', label: 'AI'},
  {id: 'f6', label: 'Politik'},
  {id: 'f7', label: 'Travel'},
];

const restaurants = [
  {
    id: 'r1',
    name: 'Nasi Padang Salero Bundo',
    location: 'Jakarta',
    rating: '4.2',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'r2',
    name: 'Senjakala Cafe Mountain',
    location: 'Jakarta',
    rating: '4.1',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'r3',
    name: 'Rocket Chicken',
    location: 'Jakarta',
    rating: '4.8',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
];

const lawyers = [
  {
    id: 'l1',
    name: 'James Hall, S.H., M.H.',
    specializations: [
      'Kekayaan Intelektual',
      'Hutang Piutang',
      'Teknologi Informasi',
    ],
    experience: '> 5 tahun',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'l2',
    name: 'Frances Swann, S.H., M.H.',
    specializations: [
      'Ketenagakerjaan',
      'Kekayaan Intelektual',
      'Hutang Piutang',
    ],
    experience: '> 4 tahun',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'l3',
    name: 'Alex Buckmaster, S.H., M.H.',
    specializations: [
      'Keluarga',
      'Bisnis',
      'Hutang Piutang',
      'Pidana dan Lapor Polisi',
    ],
    experience: '> 11 tahun',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
  {
    id: 'l4',
    name: 'Davina Elson, S.H., M.H.',
    specializations: [
      'Pidana dan Lapor Polisi',
      'Kekayaan Intelektual',
      'Hutang Piutang',
    ],
    experience: '> 3 tahun',
    imageUrl: 'https://picsum.photos/200/300.jpg',
  },
];
// --- End Dummy Data ---

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.greyLight} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HomeMenuList />
        <HomeBannerList />
        <EventList events={events} />
        <ForumTopicList forumTopics={forumTopics} />
        <RestaurantList restaurants={restaurants} />
        <LawyerList lawyers={lawyers} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default HomeScreen;
