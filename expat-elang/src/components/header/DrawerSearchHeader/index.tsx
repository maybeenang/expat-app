import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import COLORS from '../../../constants/colors';
import NUMBER from '../../../constants/number';
import Icon from '@react-native-vector-icons/ionicons';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../../../store/useAuthStore';
import {useRedirectStore} from '../../../store/useRedirectStore';

interface SearchHeaderProps {
  searchPlaceholder?: string;
  searchScreen?: keyof RootStackParamList;
  createScreen?: keyof RootStackParamList;
  showCreateButton?: boolean;
  handleSearchChange?: (text: string) => void;
  searchable?: boolean; // Optional prop to control searchability
  handleSearchPress?: () => void; // Optional prop for search press action
}

const DrawerSearchHeader = ({
  searchPlaceholder = 'Search',
  searchable = true, // Default to true for searchability
  createScreen,
  showCreateButton = true,
  handleSearchChange = () => {}, // Default to a no-op function
  handleSearchPress = () => {}, // Default to a no-op function
}: SearchHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();

  const {isLoggedIn} = useAuthStore();
  const {setRedirect} = useRedirectStore();

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
      <View style={styles.headerInputContainer}>
        <Icon
          name="search-outline"
          size={20}
          color={COLORS.primary}
          style={styles.headerSearchIcon}
        />
        <View style={styles.headerInput}>
          {!searchable ? (
            <TouchableOpacity onPress={handleSearchPress}>
              <TextInput
                placeholder={searchPlaceholder}
                placeholderTextColor={COLORS.greyDark}
                selectionColor={COLORS.primary}
                style={styles.inputText}
                readOnly
              />
            </TouchableOpacity>
          ) : (
            <TextInput
              placeholder={searchPlaceholder}
              placeholderTextColor={COLORS.greyDark}
              selectionColor={COLORS.primary}
              style={styles.inputText}
              onChangeText={handleSearchChange}
            />
          )}
        </View>
      </View>
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
  },
  inputText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default DrawerSearchHeader;
