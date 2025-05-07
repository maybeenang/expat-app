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
  {id: '1', title: 'BED 577', subtitle: MODULES['577_BED_HISTORY']},
  {id: '2', title: 'BED 578', subtitle: MODULES['578_BED_REKAP']},
  {id: '3', title: 'RAD 1526', subtitle: MODULES['1420_RAD_ORDER_NO_REG']},
  {id: '4', title: 'LAB 1527', subtitle: MODULES['1527_LAB_ORDER_DETAIL']},
];

const LaporanRsScreen = ({navigation}) => {
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
          title="Arsip - Laporan RS"
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

export default LaporanRsScreen;
