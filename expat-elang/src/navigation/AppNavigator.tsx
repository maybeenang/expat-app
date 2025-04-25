import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreenV1 from '../screens/LoginScreenV1'; // Sesuaikan path jika perlu
import {RootStackParamList} from './types';
// import LoginScreenV2 from '../screens/LoginScreenV2';
import {useAuthStore} from '../store/useAuthStore';
import LoadingScreen from '../screens/LoadingScreen';
import {useShallow} from 'zustand/react/shallow';
import GalleryDetailScreen from '../screens/main/GalleryScreen/detail';
import COLORS from '../constants/colors';
import BlogDetailScreen from '../screens/main/BlogScreen/detail';
import BlogSearchScreen from '../screens/main/BlogScreen/search';
import RentalDetailScreen from '../screens/main/ExploreScreen/detail';
import EventDetailScreen from '../screens/main/EventScreen/detail';
import {AppDrawer} from './AppDrawer';
import {Text, View} from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {isLoading, isLoggedIn} = useAuthStore(
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
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GalleryDetail"
          component={GalleryDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
        />
        <Stack.Screen
          name="BlogDetail"
          component={BlogDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
        />

        <Stack.Screen
          name="BlogSearch"
          component={BlogSearchScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
        />

        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
          initialParams={{
            eventId: '1',
          }}
        />

        <Stack.Screen
          name="RentalDetail"
          component={RentalDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
        />
        {!isLoggedIn && (
          <Stack.Screen
            name="LoginV1"
            component={LoginScreenV1}
            options={{
              headerShown: true,
              title: '',
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackVisible: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
