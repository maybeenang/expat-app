import '../gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {checkAuthStatus, useAuthStore} from './store/useAuthStore';
import {AuthStack} from './navigation/AuthStack';
import {DrawerNavigator} from './navigation/DrawerNavigator';
import type {RootStackParamList} from './types/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {COLORS} from './contants/styles';
import LoadingOverlay from './components/common/LoadingOverlay';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  const {isAuthenticated} = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
    return () => {};
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <NavigationContainer>
              <LoadingOverlay />
              <Stack.Navigator screenOptions={{headerShown: false}}>
                {!isAuthenticated ? (
                  <Stack.Screen name="Auth" component={AuthStack} />
                ) : (
                  <Stack.Screen name="Main" component={DrawerNavigator} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
