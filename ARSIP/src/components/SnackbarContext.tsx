import React, {createContext, useContext} from 'react';
import Snackbar from 'react-native-snackbar';
import {COLORS} from '../constants/COLORS';
import {Linking} from 'react-native';
import FileViewer from 'react-native-file-viewer';

// Define Snackbar Context
const SnackbarContext = createContext({
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => {},
});

// Snackbar Provider Component
export const SnackbarProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const showSnackbar = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    filePath: string,
    delay: number = 1000
  ) => {
    let backgroundColor;
    switch (type) {
      case 'success':
        backgroundColor = COLORS.green;
        break;
      case 'error':
        backgroundColor = COLORS.red2;
        break;
      default:
        backgroundColor = COLORS.darkBlue;
    }

    setTimeout(() => {
      console.log('snackbar shown');
      Snackbar.show({
        text: message,
        backgroundColor,
        textColor: '#FFFFFF',
        duration: Snackbar.LENGTH_LONG,
        ...(filePath
          ? {
              action: {
                text: 'OPEN',
                textColor: COLORS.white,
                onPress: () => {
                  FileViewer.open(filePath)
                    .then(() => console.log('File opened successfully'))
                    .catch(err => console.error('Failed to open file:', err));
                },
              },
            }
          : {}),
      });
    }, delay);
  };

  return (
    <SnackbarContext.Provider value={{showSnackbar}}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
