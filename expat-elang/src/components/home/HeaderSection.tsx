import React from 'react';
import StyledText from '../common/StyledText';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import COLORS from '../../constants/colors';
import {useNavigation} from '@react-navigation/native';

interface HeaderProps {
  title: string;
  subtitle: string;
  goto: string;
}

const HeaderSection = ({title, subtitle, goto}: HeaderProps) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    if (!goto) {
      return;
    }
    try {
      navigation.navigate(goto);
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <StyledText style={styles.sectionTitle} weight="bold">
          {title}
        </StyledText>
        <TouchableOpacity onPress={handleNavigation}>
          <StyledText weight="medium" style={styles.seeAllText}>
            Lihat semua
          </StyledText>
        </TouchableOpacity>
      </View>

      <StyledText style={styles.sectionSubtitle}>{subtitle}</StyledText>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: 15,
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
});

export default HeaderSection;
