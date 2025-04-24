import {
  type BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {MainTabParamList, RootStackParamList} from './types'; // Import tipe params
import COLORS from '../constants/colors';
import ExploreScreen from '../screens/main/ExploreScreen';
import {getTabBarIconName} from '../utils/helpers';
import NoRippleTabBarButton from '../components/tabbar/NoRippleTabBarButton';
import AccountStackNavigator from './AccountNavigator';
import {StyleSheet, TouchableOpacity} from 'react-native';
import GalleryScreen from '../screens/main/GalleryScreen';
import BlogScreen from '../screens/main/BlogScreen';
import EventScreen from '../screens/main/EventScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CustomIcon} from '../components/common/CustomPhosporIcon';
import HomeScreen from '../screens/main/HomeScreen';
import ForumScreen from '../screens/main/ForumScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = NativeStackScreenProps<RootStackParamList>;

const MainTabNavigator = ({navigation}: Props) => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Event" component={EventScreen} />
      <Tab.Screen
        name="Rental"
        component={ExploreScreen}
        options={{tabBarLabel: 'Rental', headerShown: false}}
      />

      <Tab.Screen name="Forum" component={ForumScreen} />
      {/*
      <Tab.Screen
        name="Blog"
        component={BlogScreen}
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
        options={{tabBarLabel: 'Login', title: 'Account'}}
      />
    </Tab.Navigator>
  );
};

const screenOptions = ({route}: any): BottomTabNavigationOptions => {
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
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: 'gray',
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
    },
    tabBarItemStyle: {
      padding: 10,
    },
    animation: 'shift',
    tabBarButton: props => <NoRippleTabBarButton {...props} />,
    tabBarStyle: styles.tabBarStyleBase,
    headerShadowVisible: false,
    headerTitleStyle: {
      fontFamily: 'Roboto-Medium',
      fontWeight: '600',
      fontSize: 24,
    },
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
