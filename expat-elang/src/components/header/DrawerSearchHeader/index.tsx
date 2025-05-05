import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import COLORS from '../../../constants/colors';
import NUMBER from '../../../constants/number';
import Icon from '@react-native-vector-icons/ionicons';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import StyledText from '../../common/StyledText';
import {useAuthStore} from '../../../store/useAuthStore';
import {useRedirectStore} from '../../../store/useRedirectStore';

interface SearchHeaderProps {
  searchPlaceholder?: string;
  searchScreen?: keyof RootStackParamList;
  createScreen?: keyof RootStackParamList;
  showCreateButton?: boolean;
}

const DrawerSearchHeader = ({
  searchPlaceholder = 'Search',
  searchScreen,
  createScreen,
  showCreateButton = true,
}: SearchHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();

  const {isLoggedIn} = useAuthStore();
  const {setRedirect} = useRedirectStore();

  const handleSearchPress = () => {
    if (!searchScreen) {
      return;
    }
    navigation.navigate(searchScreen as any);
  };

  const handleCreatePress = () => {
    if (!createScreen) {
      return;
    }

    if (!isLoggedIn) {
      setRedirect(createScreen as any);
      navigation.navigate('LoginV1');
      return;
    }
    navigation.navigate(createScreen as any);
  };

  const handleChatPress = () => {
    if (!isLoggedIn) {
      setRedirect('Chat' as any);
      navigation.navigate('LoginV1');
      return;
    }

    navigation.navigate('Chat' as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerInputContainer}
        onPress={handleSearchPress}>
        <Icon
          name="search-outline"
          size={20}
          color={COLORS.primary}
          style={styles.headerSearchIcon}
        />
        <View style={styles.headerInput}>
          <StyledText style={styles.inputText}>{searchPlaceholder}</StyledText>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {showCreateButton && (
          <TouchableOpacity onPress={handleCreatePress}>
            <CustomIcon name="Plus" size={25} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleChatPress}>
          <CustomIcon name="ChatCircleDots" size={25} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: NUMBER.defaultTitleHeaderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerInputContainer: {
    flex: 1,
    backgroundColor: COLORS.greyLight, // Background input
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerSearchIcon: {
    marginRight: 8,
  },
  headerInput: {
    flex: 1,
    paddingVertical: 10,
  },
  inputText: {
    fontSize: 15,
    color: COLORS.greyDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default DrawerSearchHeader;
