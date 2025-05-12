import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import type {DrawerContentComponentProps} from '@react-navigation/drawer';
import {useAuthStore} from '../../store/useAuthStore';
import {useAuthMutations} from '../../hooks/useAuthMutation';
import {DrawerActions, useNavigationState} from '@react-navigation/native';
import {colors} from '../../contants/styles';
import {DrawerItemType, drawerButtons} from '../../data/getDrawerItem';
import {CustomIcon} from '../common/CustomIcon';
import ProfileCard from '../common/ProfileCard';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {logout} = useAuthMutations();
  const {isLoggedIn} = useAuthStore();

  const currentRouteNameMainTabs = useNavigationState(state => {
    if (!state) {
      return undefined;
    }

    const appDrawer = state.routes.find(route => {
      return route.name === 'Drawer';
    });

    // @ts-ignore
    const mainTabsRoute = appDrawer?.state?.routes?.find((route: any) => {
      return route.name === 'BottomTab';
    });

    if (mainTabsRoute?.state) {
      const tabIndex = mainTabsRoute.state.index;
      return mainTabsRoute.state.routeNames?.[tabIndex] ?? 'Home';
    }
    return undefined;
  });

  const isDrawerItemActive = (
    targetRouteName: string,
    type: DrawerItemType,
    key?: string,
  ): boolean => {
    if (type === 'tab') {
      return (
        currentRouteNameMainTabs === targetRouteName && props.state.index === 0
      );
    }

    const index = props.state.index;
    const routes = props.state.routes;
    const route = routes[index];
    return route.name === targetRouteName || route.name === key;
  };

  const navigateToScreen = (screenName: string, type: DrawerItemType) => {
    if (type === 'tab') {
      // Navigasi ke tab
      props.navigation.navigate('BottomTab', {
        screen: screenName,
      });
      return;
    }
    props.navigation.navigate(screenName);
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollContent}>
        <ProfileCard />

        <View style={styles.groupContainer}>
          {drawerButtons().map((item, index) => (
            <DrawerItem
              style={styles.drawerItem}
              pressColor={colors.greyLight}
              key={index}
              label={item.label}
              labelStyle={styles.drawerLabel}
              icon={({color, size, focused}) => (
                <CustomIcon
                  name={item.icon}
                  color={color}
                  size={size}
                  type={focused ? 'fill' : 'regular'}
                />
              )}
              activeTintColor={colors.primary}
              activeBackgroundColor={'transparent'}
              focused={isDrawerItemActive(item.label, item.type, item?.key)}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());
                navigateToScreen(item.navigateTo ?? '', item.type);
              }}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      <View
        style={[
          styles.groupContainer,
          {
            margin: 12,
          },
        ]}>
        {!isLoggedIn ? (
          <DrawerItem
            style={[
              styles.drawerItem,
              {
                borderWidth: 0,
                borderColor: colors.white,
              },
            ]}
            label="Login"
            labelStyle={[styles.drawerLabel]}
            icon={({color, size, focused}) => (
              <CustomIcon
                name="SignIn"
                color={color}
                size={size}
                type={focused ? 'fill' : 'regular'}
              />
            )}
            onPress={() => {
              props.navigation.navigate('Login');
            }}
          />
        ) : (
          <DrawerItem
            style={[
              styles.drawerItem,
              {
                borderWidth: 0,
                borderColor: colors.white,
              },
            ]}
            label="Logout"
            labelStyle={[styles.drawerLabel]}
            icon={({size, focused}) => (
              <CustomIcon
                name="SignOut"
                color={colors.red}
                size={size}
                type={focused ? 'fill' : 'regular'}
              />
            )}
            activeTintColor={colors.red}
            inactiveTintColor={colors.red}
            onPress={() => {
              props.navigation.dispatch(DrawerActions.closeDrawer());
              logout();
            }}
          />
        )}
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.greyLight,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  drawerItem: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyDrawerItem,
  },
  drawerLabel: {
    fontSize: 14,
  },
  groupContainer: {
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: 0,
    borderColor: colors.greyLight,
  },
});
