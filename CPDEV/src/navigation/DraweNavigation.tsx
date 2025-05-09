import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {DrawerParamList} from './types';
import BottomTabNavigation from './BottomTabNavigation';
import {CustomDrawerContent} from '../components/layout/CustomDrawer';
import {colors} from '../contants/styles';
import AdminCrewsScreen from '../screens/Main/AdminCrews';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DraweNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      detachInactiveScreens={true}
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
          borderBottomColor: colors.border,
        },
        drawerStyle: {
          width: '70%',
          borderRadius: 0,
          borderTopRightRadius: 0,
          borderEndEndRadius: 0,
        },
      })}>
      <Drawer.Screen
        name="BottomTab"
        component={BottomTabNavigation}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen name="AdminCrew" component={AdminCrewsScreen} />
    </Drawer.Navigator>
  );
};

export default DraweNavigation;
