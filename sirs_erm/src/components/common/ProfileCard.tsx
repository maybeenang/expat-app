import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useAuthStore} from '../../store/useAuthStore';
import {IMAGE_AVATAR_PLACEHOLDER} from '../../contants/placeholder';
import {Text} from './Text';
import {COLORS} from '../../contants/styles';

const ProfileCard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {isAuthenticated: isLoggedIn, userSession} = useAuthStore();

  const handlePress = () => {
    // if (isLoggedIn) {
    //   // @ts-ignore
    //   navigation.navigate('AppDrawer', {
    //     screen: 'Profile',
    //   });
    // } else {
    //   // @ts-ignore
    //   navigation.navigate('LoginV1');
    // }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.avatarContainer}>
        {isLoggedIn ? (
          <Image
            source={{
              uri: IMAGE_AVATAR_PLACEHOLDER,
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
            resizeMode="cover"
          />
        ) : null}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {isLoggedIn ? userSession?.nama || 'User' : 'Guest'}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {isLoggedIn ? userSession?.role || 'User' : 'Sign in to your account'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ProfileCard;
