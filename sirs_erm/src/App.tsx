import '../gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {checkAuthStatus} from './store/useAuthStore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {colors, COLORS} from './contants/styles';
import LoadingOverlay from './components/common/LoadingOverlay';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import {DefaultTheme, PaperProvider} from 'react-native-paper';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    checkAuthStatus();
    return () => {};
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.white}
              />
              <NavigationContainer>
                <LoadingOverlay />
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </PaperProvider>
  );
};

export default App;
