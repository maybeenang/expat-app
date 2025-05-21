import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {COLORS, colors} from '../../contants/styles';
import Icon from '@react-native-vector-icons/ionicons';
import ProfileCard from '../common/ProfileCard';

export const CustomDrawer = (props: any) => {
  const navigation = props.navigation;

  const drawerItems = useMemo(
    () => [
      {
        name: 'Home',
        icon: 'home',
        onPress: () => {},
      },
      {
        name: 'SEP Terbuat',
        icon: 'home',
        onPress: () => {
          navigation.navigate('SepTerbuat');
        },
      },
    ],
    [navigation],
  );

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <ProfileCard />

        {drawerItems.map(item => (
          <DrawerItem
            key={item.name}
            label={item.name}
            style={styles.drawerItem}
            labelStyle={[styles.drawerLabel]}
            pressColor={COLORS.greyLight}
            icon={({color}) => (
              <Icon name={item.icon} size={20} color={color} />
            )}
            onPress={() => {
              item.onPress();
            }}
          />
        ))}

        <View style={styles.footer}>
          <DrawerItem
            label="Logout"
            onPress={() => {
              // Handle logout
            }}
            labelStyle={styles.logoutLabel}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 'auto',
  },
  logoutLabel: {
    color: colors.error,
  },
  drawerItem: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyDrawerItem,
  },
  drawerLabel: {
    fontSize: 14,
  },
});
