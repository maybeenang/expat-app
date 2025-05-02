import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from '../../common/StyledText';
import COLORS from '../../../constants/colors';
import {UseQueryResult} from '@tanstack/react-query';
import {ForumCategoryApi} from '../../../types/forum';
import {memo} from 'react';

interface ForumCategoryListProps {
  query: UseQueryResult<ForumCategoryApi[], Error>;
  state: ForumCategoryApi | null;
  setState: (category: ForumCategoryApi) => void;
  isManualRefreshing: boolean;
}

const ForumCategoryList = ({
  query,
  state,
  setState,
  isManualRefreshing,
}: ForumCategoryListProps) => {
  const {isLoading, data, error} = query;

  if (isLoading && !data) {
    return null;
  }
  if (error && !data) {
    return null;
  }
  if (data) {
    return (
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          {data.map(category => {
            const isActive = state?.id === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton]}
                onPress={() => setState(category)}
                activeOpacity={0.7}
                disabled={isManualRefreshing}>
                <StyledText
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}>
                  {category.name}
                </StyledText>
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

const styles = StyleSheet.create({
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
});

export default memo(ForumCategoryList);
