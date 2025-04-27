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
import RenderHTML from 'react-native-render-html';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumDetail'>;

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

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
    <View style={styles.replyContainer}>
      <StyledText style={styles.replyAuthor}>{item.author}</StyledText>
      <StyledText style={styles.replyDate}>{item.dateFormatted}</StyledText>
      <Text style={styles.replyContent}>{item.content}</Text>
      {item.images && item.images.length > 0 && (
        <ScrollView horizontal style={{marginTop: 8}}>
          {item.images.map((img, idx) => (
            <Image
              key={idx}
              source={{uri: img}}
              style={styles.replyImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView>
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

        <View style={styles.infoSection}>
          <StyledText style={styles.title}>{mainTopic.title}</StyledText>
          <View style={styles.metaContainer}>
            <StyledText style={styles.metaText}>{mainTopic.author}</StyledText>
            <StyledText style={styles.metaSeparator}>|</StyledText>
            <StyledText style={styles.metaText}>
              {mainTopic.dateFormatted}
            </StyledText>
          </View>
          <View style={styles.metaContainer}>
            <StyledText style={styles.metaText}>
              {mainTopic.firstCategory}
            </StyledText>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <RenderHTML
            contentWidth={
              width - styles.descriptionSection.paddingHorizontal * 2
            }
            source={{html: mainTopic.contentHTML}}
            // @ts-ignore
            tagsStyles={htmlStyles}
            enableExperimentalMarginCollapsing={true}
          />
        </View>

        {replies && replies.length > 0 && (
          <>
            <View style={styles.separator} />
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Balasan</Text>
            </View>
          </>
        )}

        <FlatList
          data={replies}
          renderItem={renderReply}
          keyExtractor={(_, idx) => `reply-${idx}`}
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
    marginBottom: 12,
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
  replyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: COLORS.greyDark,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  replyAuthor: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  replyDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  replyContent: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  replyImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
  },
});

const htmlStyles = {
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
  // Tambahkan style untuk tag lain jika perlu (ul, li, h1, h2, blockquote, dll.)
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
};

export default ForumDetailScreen;
