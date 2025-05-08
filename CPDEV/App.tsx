import './gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import {StatusBar} from 'react-native';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/config/queryClient';
import LoadingOverlay from './src/components/common/LoadingOverlay';
import {colors} from './src/contants/styles';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <NavigationContainer>
          <LoadingOverlay />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
