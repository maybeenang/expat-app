import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from '../components/drawer/CustomDrawer';
import {colors} from '../contants/styles';
import Icon from '@react-native-vector-icons/ionicons';
import {DrawerParamList} from './types';
import {HomeScreen} from '../screens/Home';
import CategoryScreen from '../screens/Category/CategoryScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.textPrimary,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
          width: '75%',
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="document-text-outline" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="document-text-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
