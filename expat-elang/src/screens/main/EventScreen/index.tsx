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
import {EventCategoryApi} from '../../../types/event';
import {
  useEventCategoriesQuery,
  useEventItemsInfinite,
} from '../../../hooks/useEventQuery';
import LoadingScreen, {LoadingFooter} from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import EmptyScreen from '../../EmptyScreen';
import EventItemCard from '../../../components/event/EventItemCard';
import COLORS from '../../../constants/colors';
import useManualRefresh from '../../../hooks/useManualRefresh';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';

const EventScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useEventCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<EventCategoryApi | null>(
    null,
  );

  const {
    data: eventItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
    error: errorEvents,
    refetch: refetchEvents,
  } = useEventItemsInfinite(activeCategory);

  const {handleManualRefresh, isManualRefreshing} = useManualRefresh({
    refetch: refetchEvents,
    isFetching: isFetchingEvents,
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

  const renderEventList = () => {
    if (isLoadingEvents && !eventItems) {
      return <LoadingScreen />;
    }
    if (errorEvents && !eventItems) {
      return (
        <ErrorScreen
          error={errorEvents}
          refetch={refetchEvents}
          placeholder="Gagal memuat data event."
        />
      );
    }
    if (!eventItems || eventItems.length === 0) {
      return <EmptyScreen />;
    }

    return (
      <FlatList
        data={eventItems}
        renderItem={({item}) => (
          <EventItemCard item={item} navigation={navigation} />
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
      <View style={styles.listArea}>{renderEventList()}</View>
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

export default React.memo(EventScreen);
