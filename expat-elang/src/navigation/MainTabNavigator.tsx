import {
  type BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {MainTabParamList} from './types';
import COLORS from '../constants/colors';
import ExploreScreen from '../screens/main/ExploreScreen';
import {getTabBarIconName} from '../utils/helpers';
import NoRippleTabBarButton from '../components/tabbar/NoRippleTabBarButton';
import AccountStackNavigator from './AccountNavigator';
import {StyleSheet, TouchableOpacity} from 'react-native';
import EventScreen from '../screens/main/EventScreen';
import {CustomIcon} from '../components/common/CustomPhosporIcon';
import HomeScreen from '../screens/main/HomeScreen';
import ForumScreen from '../screens/main/ForumScreen';
import {DRAWERICONOPTIONS} from '../constants/sidebarItem';
import {useAuthStore} from '../store/useAuthStore';
import {useShallow} from 'zustand/react/shallow';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const {isLoggedIn} = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
    })),
  );
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Event" component={EventScreen} />
      <Tab.Screen
        name="Rental"
        component={ExploreScreen}
        options={{tabBarLabel: 'Rental'}}
      />

      <Tab.Screen name="Forum" component={ForumScreen} />
      {/*
      <Tab.Screen
        name="Blog"
        component={BlogScHandshakereen}
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('BlogSearch');
                }}>
                <CustomIcon
                  name="MagnifyingGlass"
                  size={24}
                  color={COLORS.primary}
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      */}

      <Tab.Screen
        name="AccountStack"
        component={AccountStackNavigator}
        options={{
          tabBarLabel: isLoggedIn ? 'Account' : 'Login',
          title: 'Account',
        }}
      />
    </Tab.Navigator>
  );
};

const screenOptions = ({
  route,
  navigation,
}: any): BottomTabNavigationOptions => {
  return {
    headerShown: true,
    tabBarIcon: ({focused, color, size}) => {
      const iconName = getTabBarIconName(route.name);
      return (
        <CustomIcon
          name={iconName}
          size={size}
          color={color}
          type={focused ? 'fill' : 'regular'}
        />
      );
    },

    headerLeft: () => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}
          style={{marginRight: 8}}>
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
    tabBarActiveTintColor: COLORS.primary,
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
    },
    tabBarItemStyle: {
      padding: 10,
    },
    tabBarButton: props => <NoRippleTabBarButton {...props} />,
    tabBarStyle: styles.tabBarStyleBase,
    headerShadowVisible: false,
    headerTitleStyle: {
      fontFamily: 'Roboto-Medium',
      fontWeight: '600',
      fontSize: 24,
    },
    animation: 'shift',
    headerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.greyLight,
    },
  };
};

// Style dasar untuk tab bar (jika ada kustomisasi lain)
const styles = StyleSheet.create({
  tabBarStyleBase: {
    borderColor: COLORS.greyLight,
    elevation: 0,
    height: 70,
  },
});

export default MainTabNavigator;
