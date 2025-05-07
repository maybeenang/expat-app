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
import IcNext from '../../assets/icons/ic_next.svg';
import {TEXT_STYLES} from '../../constants/TEXT_STYLES';
import CustomAppBar from '../../components/CustomAppBar';
import {STYLES} from '../../constants/STYLES';
import {COLORS} from '../../constants/COLORS';
import AppTextField from '../../components/AppTextField';

const menuData = [
  {id: '1', title: 'Live - Laporan RS', name: 'LiveLaporanRs'},
  {id: '2', title: 'Arsip - Laporan RS', name: 'LaporanRs'},
  {id: '3', title: 'Arsip - Laporan RS Online', name: 'LaporanRsOnline'},
];

const CategoryScreen = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = menuData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const {isFromSidebar} = route.params || {};

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.push(item.name)}
      style={styles.card}>
      <IcDocument width={48} height={48} />

      <View style={styles.textContainer}>
        <Text
          style={TEXT_STYLES.text14SemiBold}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.title}
        </Text>
      </View>

      <IcNext />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!isFromSidebar === true && (
        <>
          <CustomAppBar
            title="Category"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
            showFilterButton={false}
          />
        </>
      )}

      <View style={styles.content}>
        <AppTextField
          placeholder={"Search here"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          showSearchIcon
        />
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingVertical: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    marginBottom: 12, // Beri jarak antar item
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
});

export default CategoryScreen;
