import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuthStore} from '../../store/useAuthStore';
import {useNavigation} from '@react-navigation/native';
import {IMAGE_AVATAR_PLACEHOLDER} from '../../contants/placeholder';
import {COLORS} from '../../contants/styles';
import {CustomIcon} from './CustomIcon';
import {Text} from 'react-native-gesture-handler';

const ProfileCard = () => {
  const {userSession, isLoggedIn} = useAuthStore();

  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate(
      'AppDrawer' as never,
      {
        screen: 'Profile',
      } as never,
    );
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          {isLoggedIn && (
            <Image
              source={{
                uri: userSession?.avatar ?? IMAGE_AVATAR_PLACEHOLDER,
              }}
              style={{width: 60, height: 60}}
            />
          )}
        </View>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.profileEditButton}
            onPress={handleEditProfile}>
            <CustomIcon name="Pencil" color={COLORS.greyDark} size={18} />
            <Text style={{fontSize: 14, color: COLORS.greyDark}}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>
          {userSession?.nama ?? 'Guest User'}
        </Text>
        <Text style={styles.profileEmail}>{userSession?.email ?? ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 60,
    overflow: 'hidden',
    height: 60,
    borderRadius: '100%',
    backgroundColor: COLORS.greyMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
  },
  profileEditButton: {
    flexDirection: 'row',
    gap: 5,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: COLORS.greyMedium,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ProfileCard;
