import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import {BlogItem} from '../../../components/blog/BlogItem';
import ErrorScreen from '../../ErrorScreen';
import {
  useBlogCategoriesQuery,
  useBlogSearch,
} from '../../../hooks/useBlogQuery';
import {BlogCategory} from '../../../types/blog';
import LoadingScreen from '../../LoadingScreen';
import {useDebounce} from '../../../hooks/useDebounce';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogSearch'>;

const BlogSearchScreen = ({navigation}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');

  const debouncedValue = useDebounce(searchTerm, 500);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useBlogCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(
    null,
  );
  useEffect(() => {
    if (categories && !activeCategory) {
      setActiveCategory(categories[0]);
    }
    return () => {};
  }, [categories, activeCategory]);

  const {
    data: results,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useBlogSearch(debouncedValue);

  const filteredPosts = useMemo(() => {
    if (!results || !activeCategory) {
      return [];
    }
    if (activeCategory.id === 'all') {
      return results;
    }
    return results.filter(post =>
      post.categories.includes(activeCategory.name),
    );
  }, [activeCategory, results]);

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
      // Gunakan headerTitle untuk merender komponen input
      headerTitle: () => (
        <View style={styles.headerInputContainer}>
          <Icon
            name="search-outline"
            size={20}
            color={COLORS.greyDark}
            style={styles.headerSearchIcon}
          />
          <TextInput
            style={styles.headerInput}
            placeholder="Cari artikel"
            placeholderTextColor={COLORS.greyDark}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus={true}
            selectionColor={COLORS.primary} // Warna kursor
          />
          {/* Tombol clear hanya muncul jika ada teks */}
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.headerClearButton}>
              <Icon name="close-circle" size={20} color={COLORS.greyDark} />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerTitleAlign: 'left', // Rata kiri title (input)
      headerLeft: () => (
        // Tombol kembali custom
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

  const renderContent = () => {
    if (isLoadingCategories) {
      return <LoadingScreen />;
    }

    if (errorCategories) {
      return (
        <ErrorScreen
          error={errorCategories}
          placeholder="Gagal memuat kategori"
          refetch={refetch}
        />
      );
    }

    if (isLoading && !filteredPosts) {
      return (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.centerIndicator}
        />
      );
    }
    if (error && submittedSearchTerm) {
      <ErrorScreen
        error={error}
        placeholder="Gagal memuat hasil pencarian"
        refetch={refetch}
      />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categories.map(category => {
              const isActive = category === activeCategory;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryButton]}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}>
                    {category.name}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {isFetching && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={styles.centerIndicator}
          />
        )}
        {filteredPosts.length === 0 && !isFetching && (
          <View style={styles.centerContainer}>
            <Image
              source={require('../../../assets/images/not-found-search.png')}
            />
            <Text style={styles.infoText}>Belum ada artikel</Text>
          </View>
        )}

        {filteredPosts.length > 0 && !isFetching && (
          <FlatList
            data={filteredPosts}
            renderItem={({item}) => (
              <BlogItem item={item} navigation={navigation} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {renderContent()}
    </SafeAreaView>
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
  infoText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
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

export default BlogSearchScreen;
