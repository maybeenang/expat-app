import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import StyledText from '../../common/StyledText';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import {useAuthStore} from '../../../store/useAuthStore';
import {IMAGE_AVATAR_PLACEHOLDER} from '../../../constants/images';

const ProfileCard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {isLoggedIn, userSession} = useAuthStore();

  const handlePress = () => {
    if (isLoggedIn) {
      // @ts-ignore
      navigation.navigate('AppDrawer', {
        screen: 'Profile',
      });
    } else {
      // @ts-ignore
      navigation.navigate('LoginV1');
    }
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
        ) : (
          <CustomIcon
            name="UserCircle"
            size={48}
            type="fill"
            color={COLORS.greyMedium}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <StyledText style={styles.name} numberOfLines={1}>
          {isLoggedIn ? userSession?.nama || 'User' : 'Guest'}
        </StyledText>
        <StyledText style={styles.email} numberOfLines={1}>
          {isLoggedIn
            ? userSession?.email || 'User'
            : 'Sign in to your account'}
        </StyledText>
      </View>
      <CustomIcon name="ArrowRight" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
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
