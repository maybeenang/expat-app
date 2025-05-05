import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useEventDetailQuery} from '../../../hooks/useEventQuery';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {ProcessedEventItem} from '../../../types/event';
import EventItemCard from '../../../components/event/EventItemCard';
import COLORS from '../../../constants/colors';
import StyledText from '../../../components/common/StyledText';
import RenderHTML from 'react-native-render-html';
import {htmlStyles} from '../../../constants/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const EventDetailScreen = ({route, navigation}: Props) => {
  const {eventId, categoryId} = route.params;
  const {data, isLoading, error, refetch} = useEventDetailQuery(
    eventId,
    categoryId,
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error || !data?.mainEvent) {
    return (
      <ErrorScreen
        error={error}
        refetch={refetch}
        placeholder="Gagal memuat detail event"
      />
    );
  }

  const {mainEvent, recentEvents} = data;

  const renderRecentEvent = ({item}: {item: ProcessedEventItem}) => {
    return (
      <EventItemCard
        item={item}
        navigation={navigation}
        showActionMenu={false}
        catId={categoryId}
      />
    );
  };

  const renderPagination = (index: number, total: number) => (
    <View style={styles.paginationStyle}>
      <Text style={styles.paginationText}>
        {index + 1}/{total}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView>
        {mainEvent.imageUrls.length > 0 ? (
          <Swiper
            style={styles.swiperWrapper}
            height={IMAGE_HEIGHT}
            showsButtons={false}
            loop={false}
            renderPagination={renderPagination}
            loadMinimal
            loadMinimalSize={1}>
            {mainEvent.imageUrls.map((url, index) => (
              <View style={styles.slide} key={`${mainEvent.id}-img-${index}`}>
                <Image
                  source={{uri: url}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        ) : (
          <View
            style={[
              styles.slide,
              {height: IMAGE_HEIGHT, backgroundColor: COLORS.greyLight},
            ]}>
            <StyledText style={{color: COLORS.greyDark}}>
              Gambar tidak tersedia
            </StyledText>
          </View>
        )}

        <View style={styles.infoSection}>
          <StyledText style={styles.title}>{mainEvent.title}</StyledText>
          <View style={styles.metaContainer}>
            <StyledText style={styles.metaText}>
              {mainEvent.location}
            </StyledText>
            <StyledText style={styles.metaText}>
              {mainEvent.dateTimeFormatted}
            </StyledText>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <RenderHTML
            contentWidth={width}
            source={{html: mainEvent.description}}
            tagsStyles={htmlStyles}
            enableExperimentalMarginCollapsing={true}
          />
        </View>

        {recentEvents && recentEvents.length > 0 && (
          <>
            <View style={styles.separator} />
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Event Terbaru Lainnya</Text>
            </View>
          </>
        )}

        <FlatList
          data={recentEvents}
          renderItem={renderRecentEvent}
          keyExtractor={item => `recent-${item.id}`}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  swiperWrapper: {},
  slide: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
  paginationText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 28,
  },
  metaContainer: {
    gap: 4,
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 8,
  },
  metaText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  // Separator
  separator: {
    height: 6,
    backgroundColor: COLORS.greyLight,
    marginVertical: 10,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  listContentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaSeparator: {
    color: COLORS.textSecondary,
  },
});

export default EventDetailScreen;
