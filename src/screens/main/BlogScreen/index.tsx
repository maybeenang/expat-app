// src/screens/BlogScreen/index.tsx
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {BlogCategory} from '../../../types/blog';
import {
  blogCategoriesQueryKey,
  useBlogCategoriesQuery,
  useBlogPostsInfinite,
} from '../../../hooks/useBlogQuery';
import COLORS from '../../../constants/colors';
import {BlogItem} from '../../../components/blog/BlogItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EmptyScreen from '../../EmptyScreen';
import {LoadingFooter} from '../../LoadingScreen';

const BlogScreen = ({navigation}: NativeStackScreenProps<any>) => {
  const queryClient = useQueryClient();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useBlogCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(
    null,
  );

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
    error: errorPosts,
    refetch: refetchPosts,
  } = useBlogPostsInfinite(activeCategory);

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  useEffect(() => {
    if (categoriesData && !activeCategory) {
      setActiveCategory(categoriesData[0]);
    }
  }, [categoriesData, activeCategory]);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await refetchPosts(); // Tunggu refetch selesai (opsional, tapi bisa lebih baik)
    } catch (err) {
      console.error('Manual refresh failed:', err);
    } finally {
      setIsManualRefreshing(false); // Akan dihandle oleh useEffect di bawah
    }
  }, [refetchPosts]);

  // Efek untuk mematikan state manual refresh saat fetching selesai
  useEffect(() => {
    if (!isFetchingPosts) {
      setIsManualRefreshing(false);
    }
  }, [isFetchingPosts]);

  // Render bagian filter kategori
  const renderCategoryFilter = () => {
    if (isLoadingCategories && !categoriesData) {
      return (
        <View style={[styles.categoryContainer, styles.centerContainerShort]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }
    if (errorCategories && !categoriesData) {
      return (
        <View style={[styles.categoryContainer, styles.centerContainerShort]}>
          <Text style={styles.errorTextSmall}>Gagal memuat kategori.</Text>
          <TouchableOpacity
            onPress={() =>
              queryClient.refetchQueries({queryKey: blogCategoriesQueryKey})
            }
            style={styles.retryButtonSmall}>
            <Text style={styles.retryButtonTextSmall}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (categoriesData) {
      return (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categoriesData.map(category => {
              const isActive = activeCategory?.id === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    isActive && styles.categoryButtonActive,
                  ]}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}
                  disabled={isManualRefreshing} // Disable saat post loading/refetching
                >
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
      );
    }
    return <View style={styles.categoryContainer} />;
  };

  // Render bagian list post
  const renderPostList = () => {
    // Loading awal post (setelah kategori ada)
    if (isLoadingPosts && !posts) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    // Error awal post (setelah kategori ada)
    if (errorPosts && !posts) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Gagal memuat artikel: {errorPosts.message}
          </Text>
          <TouchableOpacity
            onPress={() => refetchPosts()}
            style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // Jika tidak loading/error awal, tampilkan FlatList
    return (
      <FlatList
        data={posts} // Data flat dari hook infinite query
        renderItem={({item}) => (
          <BlogItem item={item} navigation={navigation} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isFetchingPosts && categoriesData ? <EmptyScreen /> : null
        }
        // Infinite Scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter /> : null}
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        {renderCategoryFilter()}
        {/* Area untuk list post, mengisi sisa ruang */}
        <View style={styles.listArea}>{renderPostList()}</View>
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
  // Kategori Styles
  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
    minHeight: 55,
    justifyContent: 'center',
  },
  centerContainerShort: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  errorTextSmall: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Roboto-Regular',
  },
  retryButtonSmall: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  retryButtonTextSmall: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryButton: {
    marginRight: 20,
    paddingBottom: 12,
    alignItems: 'center',
  },
  categoryButtonActive: {
    // Tidak perlu style khusus jika hanya indicator
  },
  categoryText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
  },
  activeIndicator: {
    height: 3,
    width: '100%',
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: -1,
  },
  // List Area & Content Styles
  listArea: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20, // Padding bawah agar footer/item terakhir tidak mepet
  },
  centerContainer: {
    // Untuk loading/error/empty utama
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Beri tinggi minimum
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
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
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});

export default BlogScreen;
