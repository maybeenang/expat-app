import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
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
import {EventCategoryApi, ProcessedEventItem} from '../../../types/event';
import {
  MY_EVENT_CATEGORY,
  useEventCategoriesQuery,
  useEventDeleteMutation,
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
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import BottomSheetAction, {
  ActionItem,
} from '../../../components/common/BottomSheetAction';
import {useAuthStore} from '../../../store/useAuthStore';

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

  const {show, hide} = useLoadingOverlayStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [selectedEvent, setSelectedEvent] = useState<ProcessedEventItem | null>(
    null,
  );

  // Fungsi untuk membuka bottom sheet
  const openActionMenu = useCallback((event: ProcessedEventItem) => {
    setSelectedEvent(event);
    bottomSheetModalRef.current?.present();
  }, []);

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

  const deleteMutation = useEventDeleteMutation();

  const {isLoggedIn} = useAuthStore();

  const eventActions: ActionItem[] = useMemo(() => {
    if (!selectedEvent) {
      return [];
    }

    const categoryId = activeCategory?.name;
    console.log('categoryId:', categoryId);

    return [
      {
        label: 'Lihat Detail',
        variant: 'primary',
        onPress: () => {
          // Logika navigasi ke detail
          navigation.navigate('EventDetail', {
            eventId: selectedEvent.id,
            categoryId: categoryId, // Kirim categoryId jika perlu
          });
        },
      },
      {
        label: 'Edit Event',
        variant: 'secondary',
        onPress: () => {
          // Logika navigasi ke halaman edit
          navigation.navigate('EventUpdate', {
            eventId: selectedEvent.id,
            categoryId: categoryId,
          });
        },
      },
      {
        label: 'Hapus Event',
        destructive: true, // Aktifkan konfirmasi
        destructiveMessage: `Yakin ingin menghapus event "${selectedEvent.title}"?`, // Pesan kustom
        onPress: async () => {
          if (deleteMutation.isPending) {
            return;
          } // Hindari double click
          show(); // Tampilkan overlay jika perlu (atau handle via mutation.isPending)
          try {
            await deleteMutation.mutateAsync(selectedEvent.id);
            // onSuccess akan menangani alert sukses, refetch, dan dismiss sheet
          } catch (e) {
            // onError akan menangani alert error
            console.log('Error caught in onPress:', e);
          } finally {
            hide();
          }
        },
        disabled: deleteMutation.isPending,
      },
    ];
  }, [selectedEvent, navigation, deleteMutation, show, hide, activeCategory]);

  useEffect(() => {
    if (categoriesData && !activeCategory) {
      setActiveCategory(categoriesData[0]);
    }

    if (!isLoggedIn) {
      if (activeCategory?.id === MY_EVENT_CATEGORY.id && categoriesData) {
        setActiveCategory(categoriesData[0]);
      }
    }
  }, [categoriesData, activeCategory, isLoggedIn]);

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
                  key={`cat-${category.id}`}
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
    if ((isLoadingEvents && !eventItems) || isLoadingCategories) {
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
          <EventItemCard
            item={item}
            navigation={navigation}
            key={`event-${item.id}`}
            showActionMenu={
              isLoggedIn && activeCategory?.name === MY_EVENT_CATEGORY.name
            }
            catId={activeCategory?.name}
            onPressActionMenu={openActionMenu}
          />
        )}
        keyExtractor={item => `${item.id}${Math.random()}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          isFetchingNextPage ? <LoadingFooter key={Math.random()} /> : null
        }
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
      {/* Render BottomSheetAction Universal */}
      <BottomSheetAction
        bottomSheetModalRef={bottomSheetModalRef}
        actions={eventActions}
        snapPoints={['35%', '50%']} // Contoh kustomisasi snap points
        handleSheetChanges={(index: number) => {
          if (index === -1) {
            setSelectedEvent(null);
          }
        }}
      />
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
