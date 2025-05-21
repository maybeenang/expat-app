import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/Login';
import {colors} from '../contants/styles';
import type {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: colors.primary,
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};

