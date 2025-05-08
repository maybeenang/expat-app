import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types'; // Import tipe param list
import {LoginScreen} from '../screens/Login';
import {useAuthStore} from '../store/useAuthStore';
import DraweNavigation from './DraweNavigation';
import {colors} from '../contants/styles';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {isLoggedIn} = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Drawer"
        component={DraweNavigation}
        options={{
          headerShown: false,
        }}
      />

      {isLoggedIn ? null : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: colors.primary,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
