import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './types';
import {HomeScreen} from '../screens/Main';
import {getTabBarIconName} from '../data/getTabBarIconName';
import {CustomIcon} from '../components/common/CustomIcon';
import {StyleSheet, TouchableOpacity} from 'react-native';
import NoRippleTabBarButton from '../components/common/NoRippleTabBarButton';
import {DRAWERICONOPTIONS, colors} from '../contants/styles';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
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
    tabBarActiveTintColor: colors.primary,
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
      borderBottomColor: colors.greyLight,
    },
  };
};

// Style dasar untuk tab bar (jika ada kustomisasi lain)
const styles = StyleSheet.create({
  tabBarStyleBase: {
    borderColor: colors.greyLight,
    elevation: 0,
    height: 70,
  },
});

export default BottomTabNavigation;
