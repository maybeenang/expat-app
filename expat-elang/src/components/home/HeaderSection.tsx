import React from 'react';
import StyledText from '../common/StyledText';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import COLORS from '../../constants/colors';

interface HeaderProps {
  title: string;
  subtitle: string;
  goto: string;
}

const HeaderSection = ({title, subtitle, goto}: HeaderProps) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <StyledText style={styles.sectionTitle} weight="bold">
          {title}
        </StyledText>
        <TouchableOpacity>
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
