import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SnackbarProvider} from './src/components/SnackbarContext';
import Routes from './src/navigation/routes';

const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </SnackbarProvider>
  );
};

export default App;
