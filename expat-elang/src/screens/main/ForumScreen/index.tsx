import React, {useState, useEffect} from 'react';
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
import {ForumCategoryApi, ProcessedForumTopic} from '../../../types/forum';
import {
  useForumCategoriesQuery,
  useForumTopicsInfinite,
} from '../../../hooks/useForumQuery';
import LoadingScreen, {LoadingFooter} from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import EmptyScreen from '../../EmptyScreen';
import COLORS from '../../../constants/colors';
import useManualRefresh from '../../../hooks/useManualRefresh';
import ForumItemCard from '../../../components/forum/ForumItemCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';

interface ForumScreenProps extends NativeStackScreenProps<RootStackParamList> {}

const ForumScreen = ({}: ForumScreenProps) => {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useForumCategoriesQuery();

  const [activeCategory, setActiveCategory] = useState<ForumCategoryApi | null>(
    null,
  );

  const {
    data: forumTopics,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTopics,
    isFetching: isFetchingTopics,
    error: errorTopics,
    refetch: refetchTopics,
  } = useForumTopicsInfinite(activeCategory);

  const {handleManualRefresh, isManualRefreshing} = useManualRefresh({
    refetch: refetchTopics,
    isFetching: isFetchingTopics,
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

  const renderForumList = () => {
    if (isLoadingTopics && !forumTopics) {
      return <LoadingScreen />;
    }
    if (errorTopics && !forumTopics) {
      return (
        <ErrorScreen
          error={errorTopics}
          refetch={refetchTopics}
          placeholder="Gagal memuat data forum."
        />
      );
    }
    if (!forumTopics || forumTopics.length === 0) {
      return <EmptyScreen />;
    }

    return (
      <FlatList
        data={forumTopics}
        renderItem={({item}) => (
          <ForumItemCard item={item as ProcessedForumTopic} key={item.id} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={isFetchingNextPage ? <LoadingFooter /> : null}
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing && !isFetchingNextPage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {renderCategoryFilter()}
      <View style={styles.listArea}>{renderForumList()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  container: {flex: 1},
  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  centerContainerShort: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  categoryScroll: {paddingHorizontal: 15},
  categoryButton: {
    marginRight: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {fontFamily: 'Roboto-Medium', color: COLORS.textPrimary},
  activeIndicator: {
    height: 3,
    width: '120%',
    alignSelf: 'center',
    backgroundColor: COLORS.textPrimary,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  // List Area & Content Styles
  listArea: {flex: 1},
  listContainer: {padding: 15},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default React.memo(ForumScreen);
