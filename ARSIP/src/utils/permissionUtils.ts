import {PermissionsAndroid, Platform} from 'react-native';

export const PermissionUtils = {
  requestStoragePermission: async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version < 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  },
};
