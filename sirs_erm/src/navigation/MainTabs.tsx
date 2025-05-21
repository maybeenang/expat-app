import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/Home';
import {Page11Screen} from '../screens/Page11';
import {Page12Screen} from '../screens/Page12';
import {Page13Screen} from '../screens/Page13';
import type {BottomTabParamList} from '../types/navigation';
import {colors} from '../contants/styles';
import Icon from '@react-native-vector-icons/ionicons';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerTintColor: colors.primary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Page11"
        component={Page11Screen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="document-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Page12"
        component={Page12Screen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Page13"
        component={Page13Screen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

