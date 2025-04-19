import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AccountScreen from '../screens/main/AccountScreen';

import {MainTabParamList, RootStackParamList} from './types'; // Import tipe params
import COLORS from '../constants/colors';
import ExploreScreen from '../screens/main/ExploreScreen';
import Icon from '@react-native-vector-icons/ionicons';
import BlogScreen from '../screens/main/BlogScreen';
import {getTabBarIconName} from '../utils/helpers';
import NoRippleTabBarButton from '../components/tabbar/NoRippleTabBarButton';

const Tab = createBottomTabNavigator<MainTabParamList>();
const AccountStack = createNativeStackNavigator<RootStackParamList>(); // Stack untuk Tab Akun

function AccountStackNavigator() {
  const isUserLoggedIn = false; // Ganti dengan state auth Anda

  return (
    <AccountStack.Navigator>
      {isUserLoggedIn ? (
        <></> // Placeholder
      ) : (
        <AccountStack.Screen
          name="Account"
          component={AccountScreen}
          options={{
            title: 'Account',
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: COLORS.textPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
          }}
        />
      )}
    </AccountStack.Navigator>
  );
}

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          const iconName = getTabBarIconName(route.name, focused);
          // @ts-ignore
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary, // Warna ikon aktif
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        animation: 'shift',
        tabBarButton: props => <NoRippleTabBarButton {...props} />,
      })}>
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{tabBarLabel: 'Explore', headerShown: false}}
      />

      <Tab.Screen
        name="Blog"
        component={BlogScreen}
        options={{tabBarLabel: 'Blog', headerShown: false}}
      />

      <Tab.Screen
        name="Event"
        component={BlogScreen}
        options={{tabBarLabel: 'Event', headerShown: false}}
      />

      <Tab.Screen
        name="Gallery"
        component={BlogScreen}
        options={{tabBarLabel: 'Gallery', headerShown: false}}
      />

      <Tab.Screen
        name="AccountStack"
        component={AccountStackNavigator}
        options={{tabBarLabel: 'Login', headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
