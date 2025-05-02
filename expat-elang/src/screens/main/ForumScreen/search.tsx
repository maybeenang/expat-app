import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import StyledText from '../../../components/common/StyledText';
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../../constants/colors';
import {useDebounce} from '../../../hooks/useDebounce';
import {useBlogSearch} from '../../../hooks/useBlogQuery';
import SearchBarInput from '../../../components/common/SearchBarInput';

interface ForumSearchScreenProps
  extends NativeStackScreenProps<RootStackParamList> {}

const ForumSearchScreen = ({navigation}: ForumSearchScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');

  const debouncedValue = useDebounce(searchTerm, 500);
  const {
    data: results,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useBlogSearch(debouncedValue);

  const handleSearchSubmit = useCallback(() => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      setSubmittedSearchTerm(trimmedTerm);
      Keyboard.dismiss();
    }
  }, [searchTerm, setSubmittedSearchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSubmittedSearchTerm('');
  }, [setSearchTerm, setSubmittedSearchTerm]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBarInput
          handleSearchSubmit={handleSearchSubmit}
          onChangeText={setSearchTerm}
          placeholder="Cari Forum"
          searchTerm={searchTerm}
          clearSearch={clearSearch}
        />
      ),
      headerTitleAlign: 'left',
      animation: 'none',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}>
          <Icon
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
            size={26}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
      headerStyle: {backgroundColor: COLORS.white},
      headerShadowVisible: false, // Optional: hilangkan shadow header
    });
  }, [navigation, searchTerm, clearSearch, handleSearchSubmit]);

  return (
    <View>
      <StyledText>ForumSearchScreen</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // Header Styles
  headerBackButton: {
    padding: 5, // Area sentuh lebih besar
    marginLeft: Platform.OS === 'android' ? 0 : 10, // Sesuaikan margin per platform
  },
  headerInputContainer: {
    flex: 1, // Ambil sisa ruang header
    height: 40,
    backgroundColor: COLORS.greyLight, // Background input
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: Platform.OS === 'ios' ? 15 : 5, // Beri jarak kanan
    marginLeft: Platform.OS === 'ios' ? -10 : 5, // Sesuaikan margin kiri
  },
  headerSearchIcon: {
    marginRight: 8,
  },
  headerInput: {
    flex: 1, // Input text mengisi ruang
    height: '100%',
    paddingVertical: 0, // Hapus padding vertikal default
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  headerClearButton: {
    padding: 5, // Area sentuh
  },
  // Content Styles
  listContainer: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerIndicator: {
    marginTop: 50, // Beri jarak dari header
  },

  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight, // Warna garis bawah filter
    paddingBottom: 0, // Tidak perlu padding bawah jika indicator nempel
  },
  categoryScroll: {
    paddingHorizontal: 15, // Padding kiri-kanan untuk scroll
    paddingVertical: 12, // Padding atas-bawah tombol kategori
  },
  categoryButton: {
    marginRight: 20, // Jarak antar kategori
    paddingBottom: 12, // Ruang untuk indicator di bawah teks
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Roboto-Medium', // Atau Regular
    fontSize: 15,
    color: COLORS.textSecondary, // Warna teks non-aktif
  },
  categoryTextActive: {
    fontFamily: 'Roboto-Bold', // Atau Medium
    color: COLORS.textPrimary, // Warna teks aktif
  },
  activeIndicator: {
    height: 3,
    width: '100%',
    backgroundColor: COLORS.textPrimary,
    position: 'absolute',
    bottom: -1,
  },

  container: {
    flex: 1,
  },
});

export default ForumSearchScreen;
