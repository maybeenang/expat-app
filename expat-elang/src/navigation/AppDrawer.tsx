import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator'; // Navigator Tab Anda
import {CustomDrawerContent} from '../screens/Drawer';
import {DrawerParamList} from './types';
import BlogScreen from '../screens/main/BlogScreen';
import GalleryScreen from '../screens/main/GalleryScreen';
import RestaurantScreen from '../screens/main/RestaurantScreen';
import {CustomIcon} from '../components/common/CustomPhosporIcon';
import COLORS from '../constants/colors';
import {TouchableOpacity} from 'react-native';
import {DRAWERICONOPTIONS} from '../constants/sidebarItem';
import LawyerScreen from '../screens/main/LawyerScreen';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator<DrawerParamList>();

export function AppDrawer() {
  const naviagtion = useNavigation();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      detachInactiveScreens={true}
      initialRouteName="MainTabsDrawer"
      screenOptions={({navigation}) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'Roboto-Medium',
          fontWeight: '600',
          fontSize: 24,
        },
        headerStyle: {
          borderBottomWidth: 1,
          borderBottomColor: COLORS.greyLight,
        },
        headerLeft: () => {
          return (
            <TouchableOpacity
              style={{marginRight: 8}}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <CustomIcon
                name="List"
                size={DRAWERICONOPTIONS.size}
                type="bold"
                color={DRAWERICONOPTIONS.color}
                style={{marginLeft: 15}}
              />
            </TouchableOpacity>
          );
        },
        drawerStyle: {
          width: '70%',
          borderRadius: 0,
          borderTopRightRadius: 0,
          borderEndEndRadius: 0,
        },
      })}>
      <Drawer.Screen
        name="MainTabsDrawer"
        component={MainTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  naviagtion.navigate('BlogSearch' as never);
                  console.log('Search pressed');
                }}>
                <CustomIcon
                  name="MagnifyingGlass"
                  size={24}
                  color={COLORS.primary}
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Drawer.Screen name="Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Restaurant" component={RestaurantScreen} />
      <Drawer.Screen name="Lawyers" component={LawyerScreen} />
    </Drawer.Navigator>
  );
}
