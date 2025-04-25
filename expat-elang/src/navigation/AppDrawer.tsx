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
// Import tipe jika perlu
// import type { RootStackParamList } from './types'; // Jika drawer bagian dari RootStack

// Tipe untuk Drawer Navigator (jika punya screen sendiri selain MainTabs)

const Drawer = createDrawerNavigator<DrawerParamList>(); // Tidak perlu tipe jika hanya 1 screen

export function AppDrawer() {
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
      <Drawer.Screen name="Blog" component={BlogScreen} />
      <Drawer.Screen name="Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Restaurant" component={RestaurantScreen} />
      <Drawer.Screen name="Lawyers" component={LawyerScreen} />
    </Drawer.Navigator>
  );
}
