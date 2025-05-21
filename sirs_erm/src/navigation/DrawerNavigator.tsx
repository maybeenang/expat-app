import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from '../components/drawer/CustomDrawer';
import {MainTabs} from './MainTabs';
import {Page1Screen} from '../screens/Page1';
import {Page2Screen} from '../screens/Page2';
import SepTerbuatScreen from '../screens/SepTerbuat/SepTerbuatScreen';
import type {DrawerParamList} from '../types/navigation';
import {colors} from '../contants/styles';
import Icon from '@react-native-vector-icons/ionicons';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
          width: '75%',
        },
      }}>
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'Main',
          drawerLabel: 'Main',
        }}
      />
      <Drawer.Screen
        name="SepTerbuat"
        component={SepTerbuatScreen}
        options={{
          title: 'SEP Terbuat',
          drawerIcon: ({color}) => (
            <Icon name="document-text-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
