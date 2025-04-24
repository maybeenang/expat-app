import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AccountStackParamList} from './types';
import {useAuthStore} from '../store/useAuthStore';

import {useShallow} from 'zustand/react/shallow';

import AccountScreen from '../screens/main/AccountScreen';
import LoadingScreen from '../screens/LoadingScreen';
import LoggedInScreen from '../screens/main/AccountScreen/LoggedInScreen';

const AccountStack = createNativeStackNavigator<AccountStackParamList>(); // Stack untuk Tab Akun
function AccountStackNavigator() {
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
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <AccountStack.Screen name="LoggedIn" component={LoggedInScreen} />
      ) : (
        <AccountStack.Screen name="Account" component={AccountScreen} />
      )}
    </AccountStack.Navigator>
  );
}

export default AccountStackNavigator;
