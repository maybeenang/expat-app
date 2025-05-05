import {
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  MY_JOBS_CATEGORY,
  allJobCategories,
  useJobItemsInfinite,
} from '../../../hooks/useJobsQuery';
import {
  JobCategory,
  ProcessedJobItem,
  ProcessedListItem,
} from '../../../types/jobs';
import AdItemCard from '../../../components/jobs/AdItemCard';
import JobItemCard from '../../../components/jobs/JobItemCard';
import COLORS from '../../../constants/colors';
import useManualRefresh from '../../../hooks/useManualRefresh';
import {LoadingFooter} from '../../LoadingScreen';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import EmptyScreen from '../../EmptyScreen';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAuthStore} from '../../../store/useAuthStore';
import JobCategoryList from '../../../components/jobs/JobCategoryList';
import BottomSheetJobs from '../../../components/jobs/BottomSheetJobs';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const JobsScreen = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedJob, setSelectedJob] = useState<ProcessedJobItem | null>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setSelectedJob(null);
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState<JobCategory | null>(
    null,
  );

  const {
    data: listItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useJobItemsInfinite({
    categoryId: activeCategory?.id,
    searchTerm: '',
    location: '',
  });

  const {isManualRefreshing, handleManualRefresh} = useManualRefresh({
    refetch: refetch,
    isFetching: isFetching,
  });

  const {isLoggedIn} = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && !activeCategory) {
      setActiveCategory(allJobCategories[0]);
    }

    if (!isLoggedIn && activeCategory) {
      setActiveCategory(null);
    }

    return () => {};
  }, [isLoggedIn, activeCategory]);

  const renderItem = ({item}: {item: ProcessedListItem}) => {
    if (item.type === 'ad') {
      return <AdItemCard item={item.data} key={`ad-${item.data.id}`} />;
    } else if (item.type === 'job') {
      return (
        <JobItemCard
          item={item.data}
          key={`jobs-${item.data.id}`}
          categoryId={activeCategory?.id}
          showActionButton={
            isLoggedIn && activeCategory?.id === MY_JOBS_CATEGORY.id
          }
          handleActionButtonPress={() => {
            setSelectedJob(item.data);
            handlePresentModalPress();
          }}
        />
      );
    }
    return null;
  };

  // --- Render Footer ---
  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return <LoadingFooter />;
  };

  const renderListContent = () => {
    if (isLoading && !listItems) {
      return <LoadingScreen />;
    }
    if (error && !listItems) {
      return (
        <ErrorScreen
          refetch={refetch}
          error={error}
          placeholder="Terdapat kesalahan"
        />
      );
    }
    if ((!listItems || listItems.length === 0) && !isFetching) {
      return <EmptyScreen />;
    }

    return (
      <FlatList
        data={listItems}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // Infinite Scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7} // Trigger lebih awal
        ListFooterComponent={renderFooter}
        // Pull to Refresh
        onRefresh={handleManualRefresh}
        refreshing={isManualRefreshing && !isFetchingNextPage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {isLoggedIn && (
        <JobCategoryList
          isManualRefreshing={isManualRefreshing}
          setState={setActiveCategory}
          state={activeCategory}
        />
      )}

      {/* List Area */}
      <View style={styles.listArea}>{renderListContent()}</View>

      {/* Bottom Sheet */}
      <BottomSheetJobs
        handleSheetChanges={handleSheetChanges}
        bottomSheetModalRef={bottomSheetRef}
        selectedJob={selectedJob}
        categoryId={activeCategory?.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listArea: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
    gap: 10,
  },
});

export default JobsScreen;
