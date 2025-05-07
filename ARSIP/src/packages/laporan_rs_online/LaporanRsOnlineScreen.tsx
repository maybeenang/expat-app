import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IcDocument from '../../assets/icons/ic_document.svg';
import {TEXT_STYLES} from '../../constants/TEXT_STYLES';
import {COLORS} from '../../constants/COLORS';
import AppTextField from '../../components/AppTextField';
import CustomAppBar from '../../components/CustomAppBar';
import {MODULES} from '../../constants/MODULES';

const reportData = [
  {id: '1', title: 'RL 4.1', subtitle: MODULES['1557_RL_41']},
  {id: '2', title: 'RL 4.2', subtitle: MODULES['1558_RL_42']},
  {id: '3', title: 'RL 4.3', subtitle: MODULES['1559_RL_43']},
  {id: '4', title: 'RL 3.11', subtitle: MODULES['1548_RL_311']},
  {id: '5', title: 'RL 3.1', subtitle: MODULES['1538_RL_31']},
  {id: '6', title: 'RL 3.7', subtitle: MODULES['1544_RL_37']},
  {id: '7', title: 'RL 3.9', subtitle: MODULES['1546_RL_39']},
  {id: '8', title: 'RL 5.1', subtitle: MODULES['1560_RL_51']},
  {id: '9', title: 'RL 5.2', subtitle: MODULES['1561_RL_52']},
  {id: '10', title: 'RL 5.3', subtitle: MODULES['1562_RL_53']},
  {id: '11', title: 'RL 3.4', subtitle: MODULES['1541_RL_34']},
];

const LaporanRsOnlineScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = reportData.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Jika jumlah item ganjil, tambahkan item dummy untuk memastikan layout tetap rapi
  const adjustedData =
    filteredData.length % 2 !== 0
      ? [...filteredData, {id: 'dummy', empty: true}]
      : filteredData;

  const renderItem = ({item}) => {
    if (item.empty) {
      return <View style={[styles.card, styles.hiddenCard]} />;
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.push(item.subtitle)}
        style={styles.card}>
        <IcDocument width={48} height={48} />
        <View style={styles.textContainer}>
          <Text
            style={TEXT_STYLES.text14SemiBold}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <CustomAppBar
          title="Arsip - Laporan RS Online"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          showFilterButton={false}
        />
        <View style={styles.content}>
          <AppTextField
            placeholder="Search here"
            value={searchQuery}
            onChangeText={setSearchQuery}
            showSearchIcon
          />
          <View style={styles.listContainer}>
            <FlatList
              data={adjustedData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={false} // Scroll ditangani oleh ScrollView
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
    flex: 1,
  },
  listContainer: {
    marginTop: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Mencegah item tunggal di baris terakhir mengisi seluruh lebar
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    borderColor: COLORS.fieldBorder,
  },
  hiddenCard: {
    opacity: 0, // Menyembunyikan item dummy tanpa mengganggu layout
  },
  textContainer: {
    flex: 1,
    marginTop: 8,
  },
});

export default LaporanRsOnlineScreen;
