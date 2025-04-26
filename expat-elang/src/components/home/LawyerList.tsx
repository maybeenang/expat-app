import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../constants/colors';
import HeaderSection from './HeaderSection';
import StyledText from '../common/StyledText';

const {width} = Dimensions.get('window');

const NUM_COLUMNS = 2;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

type LawyerType = {
  id: string;
  name: string;
  specializations: string[];
  experience: string;
  imageUrl: string;
};

interface LawyerListProps {
  lawyers: LawyerType[];
}

const renderLawyerCard = ({item}: {item: LawyerType}) => (
  <TouchableOpacity
    style={[styles.card, styles.lawyerCard]}
    activeOpacity={0.8}>
    <Image source={{uri: item.imageUrl}} style={styles.lawyerImage} />
    <View style={styles.cardContent}>
      <View>
        <StyledText style={styles.lawyerName} numberOfLines={2}>
          {item.name}
        </StyledText>
        <StyledText style={styles.specializationLabel}>Spesialisasi</StyledText>
        <StyledText style={styles.specializationText} numberOfLines={4}>
          {item.specializations.join(', ')}
        </StyledText>
      </View>
      <View style={styles.experienceContainer}>
        <Icon name="briefcase-outline" size={14} color={COLORS.textSecondary} />
        <StyledText style={styles.experienceText}>
          Lebih dari {item.experience.split(' ')[2]} tahun
        </StyledText>
      </View>
    </View>
  </TouchableOpacity>
);

const LawyerList = ({lawyers}: LawyerListProps) => {
  return (
    <View style={styles.sectionContainer}>
      <HeaderSection
        title="Lawyers"
        subtitle="Temukan konsultan hukum"
        goto="Lawyers"
      />
      <FlatList
        data={lawyers}
        scrollEnabled={false}
        renderItem={renderLawyerCard}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.horizontalListPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 25,
  },
  horizontalListPadding: {
    padding: ITEM_MARGIN / 2,
  },
  card: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: COLORS.greyDark,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lawyerCard: {
    width: ITEM_WIDTH,
    minHeight: ITEM_WIDTH * 2,
    margin: ITEM_MARGIN / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  lawyerImage: {
    width: '100%',
    height: 166,
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  lawyerName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  specializationLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  specializationText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default LawyerList;
