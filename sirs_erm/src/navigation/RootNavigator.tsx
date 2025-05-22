import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthStore} from '../store/useAuthStore';
import {AuthStack} from './AuthStack';
import {DrawerNavigator} from './DrawerNavigator';
import {RootStackParamList} from './types';
import {HomeScreen} from '../screens/Home';
import CategoryScreen from '../screens/Category/CategoryScreen';
import SepTerbuatScreen from '../screens/Features/SepTerbuat/SepTerbuatScreen';
import {colors} from '../contants/styles';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const {isAuthenticated} = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.textPrimary,
        },
      }}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
            title: '',
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="SepTerbuat" component={SepTerbuatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
