import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IcDocument from '../assets/icons/ic_document.svg';
import IcNext from '../assets/icons/ic_next.svg';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {STYLES} from '../constants/STYLES';
import {COLORS} from '../constants/COLORS';
import AppTextField from '../components/AppTextField';
import CustomAppBar from '../components/CustomAppBar';
import {MODULES} from '../constants/MODULES';

const reportData = [
  {id: '1', title: 'ERM 913', subtitle: MODULES['913_STATS_ERM']},
  {id: '2', title: 'MKT 1420', subtitle: MODULES['1420_MKT_RAJAL']},
  {id: '3', title: 'RAD 1526', subtitle: MODULES['1420_RAD_ORDER_NO_REG']},
  {id: '4', title: 'BED 577', subtitle: MODULES['577_BED_HISTORY']},
  {id: '5', title: 'BED 578', subtitle: MODULES['578_BED_REKAP']},
  {id: '6', title: 'RL 4.1', subtitle: MODULES['1557_RL_41']},
  {id: '7', title: 'RL 4.2', subtitle: MODULES['1558_RL_42']},
  {id: '8', title: 'RL 4.3', subtitle: MODULES['1559_RL_43']},
];

const HomeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = reportData.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.push(item.subtitle)}
      style={styles.card}>
      <IcDocument width={48} height={48} />

      {/* Wrapper to ensure text does not push `IcNext` out */}
      <View style={[styles.textContainer]}>
        {/* <Text
          style={TEXT_STYLES.text18SemiBold}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.title}
        </Text> */}
        <Text style={TEXT_STYLES.text14SemiBold} numberOfLines={1} ellipsizeMode="tail">
          {item.subtitle}
        </Text>
      </View>

      {/* <IcNext /> */}
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <CustomAppBar
          title="Home"
          showBackButton={false}
          showFilterButton={false}
        />
        <View style={styles.content}>
          <AppTextField
            placeholder="Search here"
            value={searchQuery}
            onChangeText={setSearchQuery}
            showSearchIcon
          />

          {/* Wrap FlatList in a View */}
          <View style={STYLES.mt20}>
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              numColumns={2} // ➜ Menampilkan 3 kolom
              columnWrapperStyle={styles.row} // ➜ Menangani styling antar kolom
              scrollEnabled={false} // ➜ Scroll dihandle oleh ScrollView
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    flex: 1,
  },
  card: {
    flex: 1, // Membagi ruang dengan rata dalam 2 kolom
    flexDirection: 'column', // Menjaga ikon di atas, teks di bawah
    justifyContent: 'space-between', // Memberi ruang di antara ikon & teks
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    margin: 8, // Jarak antar item agar tidak dempet
    borderColor: COLORS.fieldBorder,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
