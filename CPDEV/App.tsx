import './gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import {StatusBar} from 'react-native';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/config/queryClient';
import LoadingOverlay from './src/components/common/LoadingOverlay';
import {colors} from './src/contants/styles';
import {checkAuthStatus} from './src/store/useAuthStore';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  useEffect(() => {
    checkAuthStatus();
    return () => {};
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <NavigationContainer>
              <LoadingOverlay />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
