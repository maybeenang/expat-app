import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {ForumCategoryApi, ProcessedForumTopic} from '../../../types/forum';
import {
  MY_FORUM_CATEGORY_PLACEHOLDER,
  useDeleteForumMutation,
  useForumCategoriesQuery,
  useForumTopicsInfinite,
} from '../../../hooks/useForumQuery';
import COLORS from '../../../constants/colors';
import useManualRefresh from '../../../hooks/useManualRefresh';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import ForumCategoryList from '../../../components/forum/ForumCategoryList';
import {useAuthStore} from '../../../store/useAuthStore';
import ForumItemList from '../../../components/forum/ForumItemList';
import ForumItemCard from '../../../components/forum/ForumItemCard';
import BottomSheetForum from '../../../components/forum/BottomSheetForum';
import SearchBarButton from '../../../components/common/SearchBarButton';
import SearchAndCreate from '../../../components/common/RightHeaderButton/SearchAndCreate';

const {width} = Dimensions.get('window');

interface ForumScreenProps extends NativeStackScreenProps<RootStackParamList> {}

const ForumScreen = ({navigation}: ForumScreenProps) => {
  const {isLoggedIn} = useAuthStore();

  const categoryQuery = useForumCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<ForumCategoryApi | null>(
    null,
  );

  const forumQuery = useForumTopicsInfinite(activeCategory);
  const [activeItem, setActiveItem] = useState<ProcessedForumTopic | null>(
    null,
  );

  const mutateDeleteForum = useDeleteForumMutation(activeCategory?.name);
  const {handleManualRefresh, isManualRefreshing} = useManualRefresh({
    refetch: forumQuery.refetch,
    isFetching: forumQuery.isFetching,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setActiveItem(null);
        mutateDeleteForum.reset();
      }
    },
    [mutateDeleteForum],
  );

  const handleNavigateDetail = useCallback(
    (id: string, screen: 'ForumDetail' | 'ForumUpdate') => {
      navigation.navigate(screen, {
        forumId: id,
      });
    },
    [navigation],
  );

  const handlePress = (item: ProcessedForumTopic) => {
    setActiveItem(item);
    handlePresentModalPress();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={'close'}
      />
    ),
    [],
  );

  useEffect(() => {
    if (categoryQuery.data && !activeCategory) {
      setActiveCategory(categoryQuery.data[0]);
    }

    if (!isLoggedIn) {
      if (
        activeCategory?.id === MY_FORUM_CATEGORY_PLACEHOLDER.id &&
        categoryQuery.data
      ) {
        setActiveCategory(categoryQuery.data[0]);
      }
    }

    return () => {};
  }, [categoryQuery.data, activeCategory, isLoggedIn]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ForumCategoryList
        isManualRefreshing={isManualRefreshing}
        query={categoryQuery}
        state={activeCategory}
        setState={setActiveCategory}
      />

      <View style={styles.listArea}>
        <ForumItemList
          query={forumQuery}
          isManualRefreshing={isManualRefreshing}
          handleManualRefresh={handleManualRefresh}
          renderItem={({item}) => (
            <ForumItemCard
              item={item}
              handlePress={() => handlePress(item)}
              isInOwnCategory={
                activeCategory?.id === MY_FORUM_CATEGORY_PLACEHOLDER.id
              }
              key={
                activeCategory?.id === MY_FORUM_CATEGORY_PLACEHOLDER.id
                  ? item.id
                  : `forum-${item.id}`
              }
            />
          )}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        $modal={true}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <BottomSheetForum
            mutateDeleteForum={mutateDeleteForum}
            activeItem={activeItem}
            handleNavigateDetail={handleNavigateDetail}
            handleDismissModalPress={handleDismissModalPress}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  container: {flex: 1},
  listArea: {flex: 1},
  bottomSheetContainer: {
    minHeight: width * 0.7,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },
});

export default React.memo(ForumScreen);
