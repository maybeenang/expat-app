import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IcDocument from '../assets/icons/ic_document.svg';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {STYLES} from '../constants/STYLES';
import {COLORS} from '../constants/COLORS';
import CustomAppBar from '../components/CustomAppBar';
import IcNext from '../assets/icons/ic_next.svg';

const menuData = [{id: '1', title: 'Category'}];

const HomeScreen = ({navigation}) => {

  const filteredData = menuData.filter(item => item.title);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.push(item.title)}
      style={styles.card}>
      <IcDocument width={48} height={48} />

      {/* Wrapper to ensure text does not push `IcNext` out */}
      <View style={[styles.textContainer]}>
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* <AppTextField
            placeholder="Search here"
            value={searchQuery}
            onChangeText={setSearchQuery}
            showSearchIcon
          /> */}

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
    flexDirection: 'row', // Menjaga ikon di atas, teks di bawah
    justifyContent: 'space-between', // Memberi ruang di antara ikon & teks
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
