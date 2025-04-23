import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useBlogPostDetail} from '../../../hooks/useBlogQuery';
import COLORS from '../../../constants/colors';
import {ProcessedBlogPost} from '../../../types/blog';
import LoadingScreen from '../../LoadingScreen';
import ErrorScreen from '../../ErrorScreen';
import {BlogItem} from '../../../components/blog/BlogItem';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

const BlogDetailScreen = ({route, navigation}: Props) => {
  const {id: blogSlug} = route.params;
  const {width} = useWindowDimensions();
  const {data, isLoading, error, refetch} = useBlogPostDetail(blogSlug);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !data?.mainPost) {
    return (
      <ErrorScreen
        error={error}
        placeholder="Blog tidak ditemukan"
        refetch={refetch}
      />
    );
  }

  const {mainPost, recentPosts} = data; // Destructure data

  // Fungsi render item untuk FlatList recent posts
  const renderRecentPost = ({item}: {item: ProcessedBlogPost}) => {
    return <BlogItem item={item} navigation={navigation} usePush />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView>
        {mainPost.imageUrl && (
          <Image
            source={{uri: mainPost.imageUrl}}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{mainPost.title}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{mainPost.author}</Text>
            <Text style={styles.metaSeparator}>|</Text>
            <Text style={[styles.metaText, styles.categoryText]}>
              {mainPost.categories[0]}
            </Text>
            <Text style={styles.metaSeparator}>|</Text>
            <Text style={styles.metaText}>{mainPost.date}</Text>
          </View>
          <RenderHTML
            contentWidth={width - styles.contentContainer.paddingHorizontal * 2}
            source={{html: mainPost.content}}
            // @ts-ignore
            tagsStyles={htmlStyles}
            enableExperimentalMarginCollapsing={true}
          />
          {recentPosts && recentPosts.length > 0 && (
            <Text style={styles.recentPostsTitle}>Postingan Terbaru</Text>
          )}
        </View>

        <FlatList
          data={recentPosts}
          renderItem={renderRecentPost}
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
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40, // Beri ruang di bawah konten
  },
  featuredImage: {
    width: '100%',
    height: 250, // Sesuaikan tinggi gambar fitur
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20, // Padding kiri-kanan untuk teks
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    flexWrap: 'wrap', // Agar wrap jika terlalu panjang
  },
  metaText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  categoryText: {
    color: COLORS.primary,
    fontFamily: 'Roboto-Medium',
  },
  metaSeparator: {
    marginHorizontal: 8,
    color: COLORS.textSecondary,
  },
  listContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  recentPostsTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: 30,
    marginBottom: 15,
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

export default BlogDetailScreen;
