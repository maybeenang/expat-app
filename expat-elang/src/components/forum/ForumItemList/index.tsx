import {UseInfiniteQueryResult} from '@tanstack/react-query';
import {memo} from 'react';
import {ProcessedForumTopic} from '../../../types/forum';
import LoadingScreen, {LoadingFooter} from '../../../screens/LoadingScreen';
import ErrorScreen from '../../../screens/ErrorScreen';
import EmptyScreen from '../../../screens/EmptyScreen';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';

interface ForumItemListProps {
  query: UseInfiniteQueryResult<ProcessedForumTopic[], Error>;
  isManualRefreshing: boolean;
  handleManualRefresh: () => void;
  renderItem: ListRenderItem<ProcessedForumTopic>;
}

const ForumItemList = ({
  query,
  isManualRefreshing,
  handleManualRefresh,
  renderItem,
}: ForumItemListProps) => {
  const {
    data: forumTopics,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTopics,
    error: errorTopics,
    refetch: refetchTopics,
  } = query;

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
      renderItem={renderItem}
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

const styles = StyleSheet.create({
  listContainer: {},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default memo(ForumItemList);
