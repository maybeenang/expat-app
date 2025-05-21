// src/screens/BlogScreen/index.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {BlogCategory} from '../../../types/blog';
import {
  useBlogCategoriesQuery,
  useBlogPostsInfinite,
} from '../../../hooks/useBlogQuery';
import COLORS from '../../../constants/colors';
import {BlogItem} from '../../../components/blog/BlogItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EmptyScreen from '../../EmptyScreen';
import {LoadingFooter} from '../../LoadingScreen';
import useManualRefresh from '../../../hooks/useManualRefresh';
import ErrorScreen from '../../ErrorScreen';
import StyledText from '../../../components/common/StyledText';

const BlogScreen = ({navigation}: NativeStackScreenProps<any>) => {
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
  } = useBlogPostsInfinite(activeCategory?.id);

  const {isManualRefreshing, handleManualRefresh} = useManualRefresh({
    refetch: refetchPosts,
    isFetching: isFetchingPosts,
  });

  useEffect(() => {
    if (categoriesData && !activeCategory) {
      setActiveCategory(categoriesData[0]);
    }
  }, [categoriesData, activeCategory]);

  const renderCategoryFilter = () => {
    if (isLoadingCategories && !categoriesData) {
      return null;
    }
    if (errorCategories && !categoriesData) {
      return null;
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
                  style={[styles.categoryButton]}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.7}
                  disabled={isManualRefreshing}>
                  <StyledText
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}>
                    {category.name}
                  </StyledText>
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
    if (isLoadingPosts && !posts) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    if (errorPosts && !posts) {
      return (
        <ErrorScreen
          refetch={refetchPosts}
          placeholder="Gagal memuat data blog."
          error={errorPosts}
        />
      );
    }
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
    justifyContent: 'center',
  },
  categoryScroll: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    marginRight: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.textPrimary,
  },
  activeIndicator: {
    height: 3,
    width: '120%',
    backgroundColor: COLORS.textPrimary,
    position: 'absolute',
    bottom: 0,
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
});

export default BlogScreen;
