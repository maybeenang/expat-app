import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/COLORS';

interface TabButtonProps {
  selectedTab: string;
  onTabPress: (tab: string) => void;
}

const AppTabButton: React.FC<TabButtonProps> = ({ selectedTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'List' && styles.activeTab]}
        onPress={() => onTabPress('List')}
      >
        <Text style={[styles.text, selectedTab === 'List' && styles.activeText]}>List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === 'Chart' && styles.activeTab]}
        onPress={() => onTabPress('Chart')}
      >
        <Text style={[styles.text, selectedTab === 'Chart' && styles.activeText]}>Chart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.greyf1,
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  text: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: 'inter_medium',
  },
  activeText: {
    color: COLORS.black27,
  },
});

export default AppTabButton;
