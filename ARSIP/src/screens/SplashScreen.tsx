import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IcLogoText from '../assets/icons/ic_logo_text.svg';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const tokenExpiryTime = await AsyncStorage.getItem('tokenExpiryTime');

        if (token && Date.now() < parseInt(tokenExpiryTime ?? '0', 10)) {
          navigation.replace('MainApp');
          // navigation.replace('Login');
        } else {
          navigation.replace('Login');
        }
  } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Login');
      }
    };

    setTimeout(() => {
      checkLoginStatus();
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
       <IcLogoText height={200} width={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SplashScreen;
