import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import StyledText from '../../common/StyledText';
import COLORS from '../../../constants/colors';
import {memo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProcessedBlogPost} from '../../../types/blog';

interface Props {
  item: ProcessedBlogPost;
  navigation?: NativeStackNavigationProp<any>;
  usePush?: boolean; // Flag untuk menentukan pakai push atau navigate
}

export const BlogItem = memo(({item, navigation, usePush = false}: Props) => {
  const handlePress = () => {
    if (navigation) {
      if (usePush) {
        navigation.push('BlogDetail', {id: item.id});
      } else {
        navigation.navigate('BlogDetail', {id: item.id});
      }
    } else {
      console.warn('Navigation prop is not provided');
    }
  };

  return (
    <TouchableOpacity
      style={styles.blogItemContainer}
      onPress={handlePress}
      activeOpacity={0.7}>
      {item.imageUrl && (
        <Image
          source={{uri: item.imageUrl}}
          style={styles.blogItemImage}
          resizeMode="cover"
        />
      )}
      {!item.imageUrl && (
        <View style={[styles.blogItemImage, styles.imagePlaceholder]}>
          <StyledText style={styles.placeholderText}>No Image</StyledText>
        </View>
      )}
      <View style={styles.blogItemTextContainer}>
        <StyledText style={styles.blogItemTitle} numberOfLines={3}>
          {item.title}
        </StyledText>
        <View style={styles.blogItemMetaContainer}>
          <StyledText style={styles.blogItemAuthor}>{item.author}</StyledText>
          <StyledText style={styles.blogItemDate}>{item.date}</StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  blogItemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    minHeight: 80,
  },
  blogItemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: COLORS.greyLight,
  },
  blogItemTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  blogItemTitle: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 21,
  },
  blogItemMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Author kiri, date kanan
    alignItems: 'center', // Sejajarkan vertikal
  },
  blogItemAuthor: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  blogItemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  imagePlaceholder: {
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.greyDark,
  },
});
