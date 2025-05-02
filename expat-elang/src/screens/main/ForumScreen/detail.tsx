import React from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useForumDetailQuery} from '../../../hooks/useForumQuery';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {ProcessedForumReply} from '../../../types/forum';
import COLORS from '../../../constants/colors';
import StyledText from '../../../components/common/StyledText';
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html';
import {CustomIcon} from '../../../components/common/CustomPhosporIcon';
import ForumReplyItem from '../../../components/forum/ForumReplyItem';
import ForumReplyInput from '../../../components/forum/ForumReplyInput';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumDetail'>;

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

const repliesDemo: ProcessedForumReply[] = [
  {
    id: '1',
    author: 'John Doe',
    images: [
      'https://picsum.photos/200/300.jpg',
      'https://picsum.photos/200/300.jpg',
      'https://picsum.photos/200/300.jpg',
      'https://picsum.photos/200/300.jpg',
      'https://picsum.photos/200/300.jpg',
    ],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dateFormatted: '2023-10-01',
  },
  {
    id: '2',
    author: 'John Doe',
    images: [],
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dateFormatted: '2023-10-01',
  },
  {
    id: '3',
    author: 'John Doe',
    images: [],
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dateFormatted: '2023-10-01',
  },
];

const ForumDetailScreen = ({route}: Props) => {
  const {forumId} = route.params;
  const {data, isLoading, error, refetch} = useForumDetailQuery(forumId);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error || !data?.mainTopic) {
    return (
      <ErrorScreen
        error={error}
        refetch={refetch}
        placeholder="Gagal memuat detail forum"
      />
    );
  }

  const {mainTopic, replies} = data;

  const renderPagination = (index: number, total: number) => (
    <View style={styles.paginationStyle}>
      <Text style={styles.paginationText}>
        {index + 1}/{total}
      </Text>
    </View>
  );

  const renderReply = ({item}: {item: ProcessedForumReply}) => (
    <ForumReplyItem item={item} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView style={styles.container}>
        <View style={{minHeight: width * 0.5}}>
          <View style={styles.metaContainer}>
            <View style={styles.authorContainer}>
              <CustomIcon
                name="UserCircle"
                size={48}
                type="fill"
                color={COLORS.greyMedium}
              />
              <View>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <StyledText
                    style={[styles.author]}
                    numberOfLines={1}
                    weight="medium">
                    {mainTopic.author}
                  </StyledText>
                  {mainTopic.firstCategory && (
                    <StyledText style={styles.category} numberOfLines={1}>
                      {mainTopic.firstCategory}{' '}
                    </StyledText>
                  )}
                </View>
                <StyledText style={styles.date}>
                  {mainTopic.dateFormatted}
                </StyledText>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <StyledText style={styles.title}>{mainTopic.title}</StyledText>
            <RenderHTML
              contentWidth={width}
              source={{html: mainTopic.contentHTML}}
              tagsStyles={htmlStyles}
              enableExperimentalMarginCollapsing={true}
            />
          </View>

          {mainTopic.imageUrls.length > 0 ? (
            <Swiper
              style={styles.swiperWrapper}
              height={IMAGE_HEIGHT}
              showsButtons={false}
              loop={false}
              renderPagination={renderPagination}
              loadMinimal
              loadMinimalSize={1}>
              {mainTopic.imageUrls.map((url, index) => (
                <View style={styles.slide} key={`${mainTopic.id}-img-${index}`}>
                  <Image
                    source={{uri: url}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          ) : null}
        </View>

        <View style={styles.separator} />
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Balasan</Text>
        </View>

        <ForumReplyInput />

        <FlatList
          data={replies}
          renderItem={renderReply}
          keyExtractor={(_, idx) => `reply-${idx}`}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center', paddingVertical: 20}}>
              <StyledText style={styles.descriptionText}>
                Belum ada balasan
              </StyledText>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  container: {
    paddingHorizontal: 15,
  },
  swiperWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
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
    lineHeight: 28,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  metaSeparator: {
    color: COLORS.textSecondary,
  },
  separator: {
    height: 6,
    backgroundColor: COLORS.greyLight,
    marginVertical: 10,
  },
  descriptionSection: {
    marginBottom: 20,
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
  recentSection: {},
  listContentContainer: {
    paddingBottom: 20,
    gap: 20,
  },
  author: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  category: {
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
  },
  replyCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

const htmlStyles: Readonly<Record<string, MixedStyleDeclaration>> = {
  p: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 16, // Jarak antar paragraf
  },
  strong: {
    fontFamily: 'Roboto-Bold',
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'none',
    fontFamily: 'Roboto-Regular',
  },
  ul: {
    marginBottom: 16,
  },
  li: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  h1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
  },
  h2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
  blockquote: {
    fontFamily: 'Roboto-Italic',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textSecondary,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  h3: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
};

export default ForumDetailScreen;
