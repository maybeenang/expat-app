import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreenV1 from '../screens/LoginScreenV1'; // Sesuaikan path jika perlu
import {RootStackParamList} from './types';
// import LoginScreenV2 from '../screens/LoginScreenV2';
import MainTabNavigator from './MainTabNavigator';
import {useAuthStore} from '../store/useAuthStore';
import LoadingScreen from '../screens/LoadingScreen';
import {useShallow} from 'zustand/react/shallow';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {isLoggedIn, isLoading} = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
    })),
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="LoginV1"
            component={LoginScreenV1}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
