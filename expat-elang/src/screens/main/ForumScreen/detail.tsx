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
  RefreshControl,
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
import {useAuthStore} from '../../../store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumDetail'>;

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;

// HTML styles for better rendering
const htmlStyles: Record<string, MixedStyleDeclaration> = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
  p: {
    marginBottom: 10,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  ul: {
    marginBottom: 10,
  },
  ol: {
    marginBottom: 10,
  },
  li: {
    marginBottom: 5,
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 10,
    marginLeft: 0,
    marginBottom: 10,
  },
  code: {
    backgroundColor: COLORS.greyLight,
    padding: 5,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  pre: {
    backgroundColor: COLORS.greyLight,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
};

// Helper function to detect if content is HTML
const isHtml = (content: string): boolean => {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
};

// Helper function to format plain text with proper line breaks
const formatPlainText = (text: string): string => {
  if (!text) return '';
  return text
    .split('\\n')
    .map(line => line.trim())
    .join('\n');
};

const ForumDetailScreen = ({route}: Props) => {
  const {isLoggedIn} = useAuthStore();

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
        placeholder="Failed to load forum detail"
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

  const renderContent = (content: string) => {
    if (isHtml(content)) {
      return (
        <RenderHTML
          contentWidth={width}
          source={{html: content}}
          tagsStyles={htmlStyles}
          enableExperimentalMarginCollapsing={true}
        />
      );
    }
    return <Text style={styles.plainText}>{formatPlainText(content)}</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[COLORS.primary]}
          />
        }>
        <View style={{minHeight: width * 0.5}}>
          <View style={styles.metaContainer}>
            <View style={styles.authorContainer}>
              <CustomIcon
                name="UserCircle"
                size={48}
                type="fill"
                color={COLORS.greyMedium}
              />
              <View style={{flex: 1, flexDirection: 'column', gap: 4}}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <StyledText style={[styles.author]} weight="medium">
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
            {renderContent(mainTopic.contentHTML)}
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
          <Text style={styles.sectionTitle}>Replies</Text>
        </View>

        {isLoggedIn && <ForumReplyInput forumId={forumId} />}

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
                No replies yet
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
  plainText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
});

export default ForumDetailScreen;
