import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import type {DrawerContentComponentProps} from '@react-navigation/drawer';
import {useAuthStore} from '../../store/useAuthStore';
import COLORS from '../../constants/colors';
import {useShallow} from 'zustand/react/shallow';
import {DrawerActions, useNavigationState} from '@react-navigation/native';
import {DrawerItemType, drawerButtons} from '../../constants/sidebarItem';
import {CustomIcon} from '../../components/common/CustomPhosporIcon';
import {useAuthMutations} from '../../hooks/useAuthMutations';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {logout} = useAuthMutations();
  const {userSession, isLoggedIn} = useAuthStore(
    useShallow(state => ({
      userSession: state.userSession,
      isLoggedIn: state.isLoggedIn,
    })),
  );

  const currentRouteNameMainTabs = useNavigationState(state => {
    if (!state) {
      return undefined;
    }

    const appDrawer = state.routes.find(route => {
      return route.name === 'AppDrawer';
    });

    const mainTabsRoute = appDrawer?.state?.routes?.find((route: any) => {
      return route.name === 'MainTabsDrawer';
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
  ): boolean => {
    if (type === 'tab') {
      return (
        currentRouteNameMainTabs === targetRouteName && props.state.index === 0
      );
    }

    const index = props.state.index;
    const routes = props.state.routes;
    const route = routes[index];
    return route.name === targetRouteName;
  };

  const navigateToScreen = (screenName: string, type: DrawerItemType) => {
    if (type === 'tab') {
      // Navigasi ke tab
      props.navigation.navigate('MainTabsDrawer', {
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
        {/* Bagian Header Profil */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarPlaceholder}>
            <CustomIcon
              name="UserCircle"
              size={70}
              color={COLORS.greyMedium}
              type="fill"
            />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              {userSession?.nama ?? 'Guest User'}
            </Text>
            <Text style={styles.profileEmail}>{userSession?.email ?? ''}</Text>
          </View>
        </View>

        <View style={styles.groupContainer}>
          {drawerButtons.map((item, index) => (
            <DrawerItem
              style={styles.drawerItem}
              pressColor={COLORS.greyLight}
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
              activeTintColor={COLORS.primary}
              activeBackgroundColor={'transparent'}
              focused={isDrawerItemActive(item.label, item.type)}
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
        <DrawerItem
          style={styles.drawerItem}
          pressColor={COLORS.greyLight}
          label="Profile"
          labelStyle={styles.drawerLabel}
          icon={({color, size, focused}) => (
            <CustomIcon
              name="UserCircle"
              color={color}
              size={size}
              type={focused ? 'fill' : 'regular'}
            />
          )}
          activeTintColor={COLORS.primary}
          activeBackgroundColor={'transparent'}
          focused={isDrawerItemActive('AccountStack', 'tab')}
          onPress={() => {
            //props.navigation.dispatch(DrawerActions.closeDrawer());
            navigateToScreen('AccountStack' ?? '', 'tab');
          }}
        />

        {!isLoggedIn ? (
          <DrawerItem
            style={[styles.drawerItem, {}]}
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
              props.navigation.navigate('LoginV1');
            }}
          />
        ) : (
          <DrawerItem
            style={[styles.drawerItem, {}]}
            label="Logout"
            labelStyle={[styles.drawerLabel]}
            icon={({color, size, focused}) => (
              <CustomIcon
                name="SignOut"
                color={COLORS.red}
                size={size}
                type={focused ? 'fill' : 'regular'}
              />
            )}
            activeTintColor={COLORS.red}
            inactiveTintColor={COLORS.red}
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
  profileContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: '100%',
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.greyLight,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  drawerItem: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  drawerLabel: {
    fontSize: 14,
  },
  groupContainer: {
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 12,
    borderColor: COLORS.greyLight,
  },
});
