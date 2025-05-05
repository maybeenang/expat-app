import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import StyledText from '../../common/StyledText';
import COLORS from '../../../constants/colors';
import {useAuthStore} from '../../../store/useAuthStore';
import {IMAGE_PLACEHOLDER} from '../../../constants/images';
import {useNavigation} from '@react-navigation/native';

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
                uri: userSession?.avatar ?? IMAGE_PLACEHOLDER,
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
            <StyledText
              style={{fontSize: 14, color: COLORS.greyDark}}
              weight="medium">
              Edit Profile
            </StyledText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileTextContainer}>
        <StyledText style={styles.profileName}>
          {userSession?.nama ?? 'Guest User'}
        </StyledText>
        <StyledText style={styles.profileEmail}>
          {userSession?.email ?? ''}
        </StyledText>
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
