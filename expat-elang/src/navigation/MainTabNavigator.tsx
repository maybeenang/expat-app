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
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import EventScreen from '../screens/main/EventScreen';
import {CustomIcon} from '../components/common/CustomPhosporIcon';
import HomeScreen from '../screens/main/HomeScreen';
import ForumScreen from '../screens/main/ForumScreen';
import {DRAWERICONOPTIONS} from '../constants/sidebarItem';
import {useAuthStore} from '../store/useAuthStore';
import {useShallow} from 'zustand/react/shallow';
import SearchAndCreate from '../components/common/RightHeaderButton/SearchAndCreate';
import SearchBarButton from '../components/common/SearchBarButton';
import ForumHeaderRight from '../components/forum/ForumHeaderRight';
import NotificationScreen from '../screens/main/NotificationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const {width} = Dimensions.get('window');

const MainTabNavigator = () => {
  const {isLoggedIn} = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
    })),
  );
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => {
          return {
            headerTitleContainerStyle: {
              flex: 2,
            },
            headerTitle: () => {
              return <SearchBarButton placeholder="Cari" onPress={() => {}} />;
            },
          };
        }}
      />

      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={({navigation}) => {
          return {
            headerTitleContainerStyle: {
              flex: 2,
            },
            headerTitle: () => {
              return (
                <SearchBarButton placeholder="Cari Event" onPress={() => {}} />
              );
            },
          };
        }}
      />
      <Tab.Screen
        name="Rental"
        component={ExploreScreen}
        options={({navigation}) => {
          return {
            headerTitleContainerStyle: {
              flex: 2,
            },
            headerTitle: () => {
              return (
                <SearchBarButton
                  placeholder="Mau Cari apa?"
                  onPress={() => {}}
                />
              );
            },
          };
        }}
      />

      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={({navigation}) => {
          return {
            headerTitleContainerStyle: {
              flex: 2,
            },
            headerTitle: () => {
              return (
                <SearchBarButton
                  placeholder="Cari Forum"
                  onPress={() => navigation.navigate('ForumSearch' as never)}
                />
              );
            },
            headerRight: () => {
              return <ForumHeaderRight />;
            },
          };
        }}
      />

      <Tab.Screen name="Notification" component={NotificationScreen} />
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
