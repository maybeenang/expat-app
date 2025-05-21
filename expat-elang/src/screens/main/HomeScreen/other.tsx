import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import CategoryMenu, {
  CategoryMenuItemType,
} from '../../../components/common/CategoryMenu';
import COLORS from '../../../constants/colors';
import {useNavigation} from '@react-navigation/native';

const OtherMenu = () => {
  const navigation = useNavigation();

  const categories: CategoryMenuItemType[] = [
    {
      label: 'Sewa Kamar',
      icon: 'Bed',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'MainTabsDrawer',
            params: {
              screen: 'Rental',
              params: {
                category: {
                  value: 'SHARED-ROOM',
                  label: 'SHARED ROOM',
                },
              },
            },
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Sewa Kendaraan',
      icon: 'Car',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'MainTabsDrawer',
            params: {
              screen: 'Rental',
              params: {
                category: {
                  value: 'UNIT',
                  label: 'UNIT',
                },
              },
            },
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Event Terdekat',
      icon: 'Ticket',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'MainTabsDrawer',
            params: {
              screen: 'Event',
            },
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Restaurant',
      icon: 'ForkKnife',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'Restaurant',
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Forum',
      icon: 'ChatsTeardrop',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'MainTabsDrawer',
            params: {
              screen: 'Forum',
            },
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Blog',
      icon: 'Newspaper',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'Blog',
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Lawyers',
      icon: 'Scales',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'Lawyers',
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Gallery',
      icon: 'Images',
      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'Gallery',
          },
          {
            pop: true,
          },
        ),
    },
    {
      label: 'Jobs',
      icon: 'BriefCase',

      onPress: () =>
        navigation.navigate(
          'AppDrawer',
          {
            screen: 'Jobs',
          },
          {
            pop: true,
          },
        ),
    },
  ];

  return (
    <View style={styles.container}>
      <CategoryMenu items={categories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 16,
  },
});

export default memo(OtherMenu);
