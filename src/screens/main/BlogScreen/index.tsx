import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import COLORS from '../../../constants/colors';
import {useBlogCategories, useBlogPosts} from '../../../hooks/useBlogQuery';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {BlogItem} from '../../../components/blog/BlogItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList>;

const BlogScreen = ({navigation}: Props) => {
  const {data: posts, isLoading, error, refetch, isFetching} = useBlogPosts();
  const categories = useBlogCategories();
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] || 'Semua Kategori',
  );

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || 'Semua Kategori');
    }
  }, [categories, activeCategory]);

  const filteredPosts = useMemo(() => {
    if (!posts) {
      return [];
    }
    if (activeCategory === 'Semua Kategori') {
      return posts;
    }
    return posts.filter(post => post.categories.includes(activeCategory));
  }, [activeCategory, posts]);

  if (isLoading && !posts) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        refetch={refetch}
        placeholder="Gagal memuat data"
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        {/* Filter Kategori */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categories.map(category => {
              const isActive = category === activeCategory;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    isActive && styles.categoryButtonActive,
                  ]}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}>
                    {category}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Daftar Blog Post */}
        <FlatList
          data={filteredPosts}
          renderItem={({item}) => (
            <BlogItem item={item} navigation={navigation} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          // TODO: Tambahkan fitur pull-to-refresh jika perlu
          // ListEmptyComponent={<Text>Tidak ada post.</Text>}
          onRefresh={refetch}
          refreshing={isFetching && !!posts}
        />
      </View>
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
  },
  // --- Category Filter ---
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
  categoryButtonActive: {
    // Style tambahan jika perlu saat aktif (misal border bawah jadi tebal)
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

  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },

  blogItemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    minHeight: 80,
  },
  blogItemImage: {
    width: 90, // Lebar gambar
    height: 90, // Tinggi gambar
    borderRadius: 8, // Sudut gambar melengkung
    marginRight: 15,
    backgroundColor: COLORS.greyLight, // Warna latar belakang gambar
  },
  blogItemTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  blogItemTitle: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 21,
  },
  blogItemMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Author kiri, date kanan
    alignItems: 'center', // Sejajarkan vertikal
  },
  blogItemAuthor: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  blogItemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  imagePlaceholder: {
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.greyDark,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Medium',
  },
});

export default BlogScreen;
