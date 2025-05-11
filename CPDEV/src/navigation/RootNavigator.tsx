import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types'; // Import tipe param list
import {LoginScreen} from '../screens/Login';
import {useAuthStore} from '../store/useAuthStore';
import DraweNavigation from './DraweNavigation';
import {colors} from '../contants/styles';
import AdminCrewDetailScreen from '../screens/Main/AdminCrews/detail';
import ContractDetailScreen from '../screens/Main/Contract/detail';
import AdminCrewContractDetailScreen from '../screens/Main/AdminCrews/contractDetail';
import CreateAdminCrewScreen from '../screens/Main/AdminCrews/create';
import CreateAdminCrewContractScreen from '../screens/Main/AdminCrews/contractCreate';
import SignaturePadScreen from '../screens/Main/AdminCrews/signaturePad';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {isLoggedIn} = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Drawer"
        component={DraweNavigation}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Group>
        <Stack.Screen
          name="AdminCrewDetail"
          component={AdminCrewDetailScreen}
          options={{
            headerShown: true,
            headerTintColor: colors.primary,
          }}
        />

        <Stack.Screen
          name="AdminCrewContractDetail"
          component={AdminCrewContractDetailScreen}
          options={{
            headerShown: true,
            title: 'Detail Kontrak',
            headerTintColor: colors.primary,
          }}
        />

        <Stack.Screen
          name="AdminCrewCreate"
          component={CreateAdminCrewScreen}
          options={{
            headerShown: true,
            title: 'Detail Kontrak',
            headerTintColor: colors.primary,
          }}
        />

        <Stack.Screen
          name="AdminCrewCreateContract"
          component={CreateAdminCrewContractScreen}
          options={{
            headerShown: true,
            headerTintColor: colors.primary,
          }}
        />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="ContractDetail"
          component={ContractDetailScreen}
          options={{
            headerShown: true,
            headerTintColor: colors.primary,
          }}
        />
      </Stack.Group>

      <Stack.Screen
        name="SignaturePadScreen"
        component={SignaturePadScreen}
        options={{
          headerShown: true,
          headerTintColor: colors.primary,
        }}
      />

      {isLoggedIn ? null : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            title: '',
            headerTintColor: colors.primary,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
