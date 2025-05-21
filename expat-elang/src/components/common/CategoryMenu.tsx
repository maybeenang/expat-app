import React from 'react';
import {View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import StyledText from './StyledText';
import COLORS from '../../constants/colors';
import {CustomIcon, IconName} from './CustomPhosporIcon';

export type CategoryMenuItemType = {
  label: string;
  icon: IconName;
  onPress?: () => void;
};

interface CategoryMenuProps {
  items: CategoryMenuItemType[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({items}) => {
  return (
    <View style={styles.menuContainer}>
      <FlatList
        data={items}
        renderItem={({item}) => <CategoryMenuItem item={item} />}
        keyExtractor={item => item.label}
        numColumns={4}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
};

const CategoryMenuItem: React.FC<{item: CategoryMenuItemType}> = ({item}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.7}
      onPress={item.onPress}
      disabled={!item.onPress}>
      <View style={styles.iconCircle}>
        <CustomIcon
          name={item.icon}
          size={32}
          color={COLORS.primary}
          type="fill"
        />
      </View>
      <StyledText style={styles.label}>{item.label}</StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  row: {
    marginBottom: 24,
  },
  item: {
    alignItems: 'center',
    width: '25%',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CategoryMenu;

