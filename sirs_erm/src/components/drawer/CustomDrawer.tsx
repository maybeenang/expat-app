import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {COLORS, colors} from '../../contants/styles';
import ProfileCard from '../common/ProfileCard';
import {CustomIcon, IconName} from '../common/CustomIcon';
import {useAuthStore} from '../../store/useAuthStore';

export const CustomDrawer = (props: any) => {
  const navigation = props.navigation;

  const activeIndex = props.state?.index;

  const {logout} = useAuthStore();

  const drawerItems = useMemo(
    (): {
      name: string;
      icon: IconName;
      onPress: () => void;
    }[] => [
      {
        name: 'Home',
        icon: 'House',
        onPress: () => {
          navigation.navigate('Home');
        },
      },
      {
        name: 'Category',
        icon: 'Newspaper',
        onPress: () => {
          navigation.navigate('Category');
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
            focused={
              activeIndex === drawerItems.findIndex(i => i.name === item.name)
            }
            icon={({color}) => (
              <CustomIcon name={item.icon} size={20} color={color} />
            )}
            onPress={() => {
              item.onPress();
            }}
          />
        ))}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          icon={({color}) => (
            <CustomIcon name="SignOut" size={20} color={colors.red} />
          )}
          onPress={() => {
            logout();
          }}
          labelStyle={styles.logoutLabel}
        />
      </View>
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
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutLabel: {
    color: colors.red,
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
