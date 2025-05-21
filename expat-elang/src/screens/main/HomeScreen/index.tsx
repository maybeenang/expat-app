import React, {useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import COLORS from '../../../constants/colors';
import HomeMenuList from '../../../components/home/HomeMenuList';
import HomeBannerList from '../../../components/home/HomeBannerList';
import ForumTopicList from '../../../components/home/ForumTopicList';
import EventList from '../../../components/home/EventList';
import RestaurantList from '../../../components/home/RestaurantList';
import LawyerList from '../../../components/home/LawyerList';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import {
  useRestaurantItemsInfinite,
  useLawyerItemsInfinite,
} from '../../../hooks/useBizQuery';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  // Menggunakan infinite query hooks
  const {refetch: refetchRestaurants} = useRestaurantItemsInfinite({});

  const {refetch: refetchLawyers} = useLawyerItemsInfinite({});

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchRestaurants(), refetchLawyers()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchRestaurants, refetchLawyers]);

  // Memoize komponen untuk mencegah re-render yang tidak perlu
  const memoizedHomeMenuList = useMemo(() => <HomeMenuList />, []);
  const memoizedHomeBannerList = useMemo(() => <HomeBannerList />, []);
  const memoizedEventList = useMemo(() => <EventList />, []);
  const memoizedForumTopicList = useMemo(() => <ForumTopicList />, []);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.greyLight} />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {memoizedHomeMenuList}
          {memoizedHomeBannerList}
          {memoizedEventList}
          {memoizedForumTopicList}
          <RestaurantList />
          <LawyerList />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default React.memo(HomeScreen);
