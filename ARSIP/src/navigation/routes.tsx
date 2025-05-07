import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../packages/login/ui/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import StatsErmScreen from '../packages/913_stats_erm/ui/StatsErmScreen';
import MktRajalScreen from '../packages/1420_mkt_rajal/ui/MktRajalScreen';
import RadOrderNoRegScreen from '../packages/1526_rad_order_no_reg/ui/RadOrderNoRegScreen';
import {RootStackParamList} from './types';
import BedHistoryScreen from '../packages/577_bed_history/ui/BedHistoryScreen';
import BedRekapScreen from '../packages/578_bed_rekap/ui/BedRekapScreen';
import RL41Screen from '../packages/1557_rl_41/ui/RL41Screen';
import RL42Screen from '../packages/1558_rl_42/ui/RL42Screen';
import RL43Screen from '../packages/1559_rl_43/ui/RL43Screen';
import CategoryScreen from '../packages/category/CategoryScreen';
import LaporanRsScreen from '../packages/laporan_rs/LaporanRsScreen';
import LaporanRsOnlineScreen from '../packages/laporan_rs_online/LaporanRsOnlineScreen';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {STYLES} from '../constants/STYLES';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../constants/COLORS';
import RL311Screen from '../packages/1548_rl_311/ui/RL311Screen';
import RL31Screen from '../packages/1538_rl_31/ui/RL31Screen';
import RL37Screen from '../packages/1544_rl_37/ui/RL37Screen';
import RL39Screen from '../packages/1546_rl_39/ui/RL39Screen';
import RL51Screen from '../packages/1560_rl_51/ui/RL51Screen';
import RL52Screen from '../packages/1561_rl_52/ui/RL52Screen';
import RL53Screen from '../packages/1562_rl_53/ui/RL53Screen';
import RL34Screen from '../packages/1541_rl_34/ui/RL34Screen';
import LiveLaporanRsScreen from '../packages/live_laporan_rs/LiveLaporanRsScreen';
import MktRanapScreen from '../packages/1421_mkt_ranap/ui/MktRanapScreen';
import MktAsalPasienScreen from '../packages/1422_mkt_asal_pasien/ui/MktAsalPasienScreen';
import LabOrderDetailScreen from '../packages/1527_lab_order_details/ui/LabOrderDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const icons = {
  Home: 'home',
  Category: 'format-list-bulleted',
};

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="LiveLaporanRs" component={LiveLaporanRsScreen} />
      <Stack.Screen name="LaporanRs" component={LaporanRsScreen} />
      <Stack.Screen name="LaporanRsOnline" component={LaporanRsOnlineScreen} />
      <Stack.Screen name="913_stats_erm" component={StatsErmScreen} />
      <Stack.Screen name="1420_mkt_rajal" component={MktRajalScreen} />
      <Stack.Screen
        name="1526_rad_order_no_reg"
        component={RadOrderNoRegScreen}
      />
      <Stack.Screen
        name="1527_lab_order_details"
        component={LabOrderDetailScreen}
      />
      <Stack.Screen name="577_bed_history" component={BedHistoryScreen} />
      <Stack.Screen name="578_bed_rekap" component={BedRekapScreen} />
      <Stack.Screen name="1557_rl_41" component={RL41Screen} />
      <Stack.Screen name="1558_rl_42" component={RL42Screen} />
      <Stack.Screen name="1559_rl_43" component={RL43Screen} />
      <Stack.Screen name="1548_rl_311" component={RL311Screen} />
      <Stack.Screen name="1538_rl_31" component={RL31Screen} />
      <Stack.Screen name="1544_rl_37" component={RL37Screen} />
      <Stack.Screen name="1546_rl_39" component={RL39Screen} />
      <Stack.Screen name="1560_rl_51" component={RL51Screen} />
      <Stack.Screen name="1561_rl_52" component={RL52Screen} />
      <Stack.Screen name="1562_rl_53" component={RL53Screen} />
      <Stack.Screen name="1541_rl_34" component={RL34Screen} />
      <Stack.Screen name="1421_mkt_ranap" component={MktRanapScreen} />
      <Stack.Screen
        name="1422_mkt_asal_pasien"
        component={MktAsalPasienScreen}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerTitleAlign: 'center',
      headerTitleStyle: [TEXT_STYLES.text16SemiBold],
      drawerStyle: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    }}
    drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Category" component={CategoryScreen} />
  </Drawer.Navigator>
);

// Custom Drawer Content
const CustomDrawerContent = props => {
  const [userName, setUserName] = useState('');
  const activeIndex = props.state?.index;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.nama || 'Guest');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{flexGrow: 1, paddingStart: 0, paddingEnd: 0}}>
        <View style={styles.drawerHeader}>
          <Image
            source={{uri: 'https://i.pravatar.cc/150?img=1'}}
            style={styles.avatar}
          />
          <Text style={[TEXT_STYLES.text22SemiBold, STYLES.mt16]}>
            {userName}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItems}>
          {props.state.routes.map((route, index) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                key={route.name}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() =>
                  props.navigation.navigate(route.name, {isFromSidebar: true})
                }>
                <MaterialCommunityIcons
                  name={icons[route.name] || 'dots-horizontal'}
                  color={COLORS.blue}
                  size={24}
                  style={{marginRight: 16}}
                />
                <Text style={styles.menuText}>{route.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>
      {/* Logout button at the bottom */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('tokenExpiryTime');
          await AsyncStorage.removeItem('user');
          props.navigation.replace('Splash');
        }}>
        <MaterialCommunityIcons name="logout" color="red" size={24} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
  },
  avatar: {width: 50, height: 50, borderRadius: 40},
  role: {fontSize: 14, color: 'gray'},
  menuItems: {marginTop: 10, paddingHorizontal: 20, flexGrow: 1},
  menuItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMenuItem: {
    backgroundColor: COLORS.primary50,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.blue,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
    marginLeft: 16,
    fontFamily: 'inter_regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});

export default Routes;
