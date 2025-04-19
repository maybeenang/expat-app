import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreenV1 from '../screens/LoginScreenV1'; // Sesuaikan path jika perlu
import { RootStackParamList } from './types';
import LoginScreenV2 from '../screens/LoginScreenV2';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainTabs">
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />


                <Stack.Screen
                    name="LoginV1"
                    component={LoginScreenV1}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginV2"
                    component={LoginScreenV2}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
