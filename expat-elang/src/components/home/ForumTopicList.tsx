import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';
import StyledText from '../common/StyledText';
import {CustomIcon} from '../common/CustomPhosporIcon';
import HeaderSection from './HeaderSection';
import {ForumCategoryApi} from '../../types/forum';
import {useForumCategoriesQuery} from '../../hooks/useForumQuery';
import {useNavigation} from '@react-navigation/native';

const ForumTopicList = () => {
  const {
    data: forumTopics = [],
    isLoading,
    isError,
    error,
  } = useForumCategoriesQuery();

  const navigation = useNavigation();

  const renderForumTopic = ({item}: {item: ForumCategoryApi}) => (
    <TouchableOpacity
      style={styles.forumChip}
      activeOpacity={0.7}
      key={item.id}
      onPress={() =>
        navigation.navigate('Forum', {
          category: item,
        })
      }>
      <CustomIcon
        name="ChatsTeardrop"
        size={24}
        color={COLORS.primary}
        style={styles.forumChipIcon}
      />
      <StyledText style={styles.forumChipText}>{item.name}</StyledText>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.sectionContainer, styles.forumBackground]}>
        <HeaderSection
          title="Forum"
          subtitle="Gabung diskusi seru sesuai topik favoritmu"
          goto="Forum"
        />
        <View
          style={[
            styles.forumChipsContainer,
            {alignItems: 'center', justifyContent: 'center', minHeight: 120},
          ]}>
          <StyledText>Loading...</StyledText>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.sectionContainer, styles.forumBackground]}>
        <HeaderSection
          title="Forum"
          subtitle="Gabung diskusi seru sesuai topik favoritmu"
          goto="Forum"
        />
        <View
          style={[
            styles.forumChipsContainer,
            {alignItems: 'center', justifyContent: 'center', minHeight: 120},
          ]}>
          <StyledText style={{color: COLORS.red}}>
            {error?.message || 'Gagal memuat data forum.'}
          </StyledText>
        </View>
      </View>
    );
  }

  if (!forumTopics || forumTopics.length === 0) {
    <View style={[styles.sectionContainer, styles.forumBackground]}>
      <HeaderSection
        title="Forum"
        subtitle="Gabung diskusi seru sesuai topik favoritmu"
        goto="Forum"
      />
      <View
        style={[
          styles.forumChipsContainer,
          {alignItems: 'center', justifyContent: 'center', minHeight: 120},
        ]}>
        <StyledText>Tidak ada topik forum yang tersedia.</StyledText>
      </View>
    </View>;
  }

  return (
    <View style={[styles.sectionContainer, styles.forumBackground]}>
      <HeaderSection
        title="Forum"
        subtitle="Gabung diskusi seru sesuai topik favoritmu"
        goto="Forum"
      />
      <View style={styles.forumChipsContainer}>
        {forumTopics.slice(0, 10).map((item: ForumCategoryApi) => (
          <View key={item.id}>{renderForumTopic({item})}</View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 25,
  },
  forumBackground: {
    backgroundColor: '#FFF0F5',
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 25,
  },
  forumChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  forumChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  forumChipIcon: {
    marginRight: 5,
  },
  forumChipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});

export default ForumTopicList;
