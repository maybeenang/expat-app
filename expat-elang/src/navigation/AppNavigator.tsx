import React, {useEffect, useLayoutEffect} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreenV1 from '../screens/LoginScreenV1'; // Sesuaikan path jika perlu
import {RootStackParamList} from './types';
import {useAuthStore} from '../store/useAuthStore';
import {useShallow} from 'zustand/react/shallow';
import GalleryDetailScreen from '../screens/main/GalleryScreen/detail';
import COLORS from '../constants/colors';
import BlogDetailScreen from '../screens/main/BlogScreen/detail';
import BlogSearchScreen from '../screens/main/BlogScreen/search';
import RentalDetailScreen from '../screens/main/ExploreScreen/detail';
import EventDetailScreen from '../screens/main/EventScreen/detail';
import {AppDrawer} from './AppDrawer';
import CustomHeader from '../components/header/CustomHeader';
import ForumDetailScreen from '../screens/main/ForumScreen/detail';
import ForumCreateScreen from '../screens/main/ForumScreen/create';
import ForumUpdateScreen from '../screens/main/ForumScreen/update';
import ForumSearchScreen from '../screens/main/ForumScreen/search';
import LoadingOverlay from '../components/common/LoadingOverlay';
import {useLoadingOverlayStore} from '../store/useLoadingOverlayStore';
import {useRedirectStore} from '../store/useRedirectStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {isLoading, isLoggedIn} = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
    })),
  );
  const {show, hide} = useLoadingOverlayStore();

  useLayoutEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }

    return () => {
      hide();
    };
  }, [isLoading, show, hide]);

  const {targetScreen, params, clearRedirect} = useRedirectStore();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (isLoggedIn && targetScreen && navigationRef.isReady()) {
      navigationRef.navigate(targetScreen as never, params as never);
      clearRedirect();
    }

    return () => {
      if (targetScreen) {
        clearRedirect();
      }
    };
  }, [isLoggedIn, targetScreen, params, navigationRef, clearRedirect]);

  return (
    <NavigationContainer ref={navigationRef}>
      <LoadingOverlay />
      <Stack.Navigator
        screenOptions={{
          header: CustomHeader,
        }}>
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

        <Stack.Screen
          name="ForumDetail"
          component={ForumDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: COLORS.primary,
          }}
        />

        <Stack.Screen
          name="ForumCreate"
          component={ForumCreateScreen}
          options={{
            headerShown: true,
            title: 'Buat Forum',
            headerTitleStyle: {
              color: COLORS.textPrimary,
              fontWeight: '600',
            },
            headerTintColor: COLORS.primary,
          }}
        />

        <Stack.Screen
          name="ForumUpdate"
          component={ForumUpdateScreen}
          options={{
            headerShown: true,
            title: 'Edit Forum',
            headerTitleStyle: {
              color: COLORS.textPrimary,
              fontWeight: '600',
            },
            headerTintColor: COLORS.primary,
          }}
        />
        <Stack.Screen
          name="ForumSearch"
          component={ForumSearchScreen}
          options={{
            headerShown: true,
            title: '',
            headerTitleStyle: {
              color: COLORS.textPrimary,
              fontWeight: '600',
            },
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
