import '../gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {checkAuthStatus} from './store/useAuthStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ENV} from './config/env';
import {getApiKey} from './store/useApiKeyStore';

enableScreens();

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useEffect(() => {
    console.log('App mounted');
    getApiKey();
    checkAuthStatus();
    return () => {};
  }, []);

  console.log(ENV.API_BASE_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
