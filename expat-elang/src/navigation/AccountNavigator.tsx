import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AccountStackParamList} from './types';
import {useAuthStore} from '../store/useAuthStore';

import {useShallow} from 'zustand/react/shallow';

import AccountScreen from '../screens/main/AccountScreen';
import LoadingScreen from '../screens/LoadingScreen';
import LoggedInScreen from '../screens/main/AccountScreen/LoggedInScreen';
import {TouchableOpacity} from 'react-native';
import {CustomIcon} from '../components/common/CustomPhosporIcon';
import {DRAWERICONOPTIONS} from '../constants/sidebarItem';

const AccountStack = createNativeStackNavigator<AccountStackParamList>(); // Stack untuk Tab Akun
function AccountStackNavigator({navigation}: any) {
  const {isLoggedIn, isLoading} = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
    })),
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              style={{marginLeft: -15, marginRight: 15}}>
              <CustomIcon
                name="List"
                size={DRAWERICONOPTIONS.size}
                type="bold"
                color={DRAWERICONOPTIONS.color}
                style={{marginLeft: 15}}
              />
            </TouchableOpacity>
          );
        },
      }}>
      {isLoggedIn ? (
        <AccountStack.Screen
          name="LoggedIn"
          component={LoggedInScreen}
          options={{
            headerTitle: 'Edit Profile',
          }}
        />
      ) : (
        <AccountStack.Screen name="Account" component={AccountScreen} />
      )}
    </AccountStack.Navigator>
  );
}

export default AccountStackNavigator;
