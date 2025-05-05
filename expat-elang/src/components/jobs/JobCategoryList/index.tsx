import {StyleSheet, TouchableOpacity, View} from 'react-native';
import COLORS from '../../../constants/colors';
import StyledText from '../../common/StyledText';
import {useJobCategoryQuery} from '../../../hooks/useJobsQuery';
import {JobCategory} from '../../../types/jobs';

interface JobCategoryListProps {
  state: JobCategory | null;
  setState: (category: JobCategory) => void;
  isManualRefreshing: boolean;
}

const JobCategoryList = ({
  state,
  setState,
  isManualRefreshing,
}: JobCategoryListProps) => {
  const data = useJobCategoryQuery();

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryScroll}>
        {data.map(category => {
          const isActive = state?.id === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton]}
              onPress={() => {
                setState(category);
              }}
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
      </View>
    </View>
  );
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
  categoryScroll: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
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

export default JobCategoryList;
