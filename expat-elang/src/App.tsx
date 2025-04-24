import '../gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {checkAuthStatus} from './store/useAuthStore';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useEffect(() => {
    checkAuthStatus();
    return () => {};
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
