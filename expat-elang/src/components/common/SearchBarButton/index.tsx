import Icon from '@react-native-vector-icons/ionicons';
import {StyleSheet, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import {TouchableOpacity} from 'react-native';

interface SearchBarButtonProps {
  onPress?: () => void;
  placeholder: string;
}

const SearchBarButton = ({
  onPress,
  placeholder = 'Mau cari apa?',
}: SearchBarButtonProps) => {
  return (
    <TouchableOpacity style={styles.headerInputContainer} onPress={onPress}>
      <Icon
        name="search-outline"
        size={20}
        color={COLORS.primary}
        style={styles.headerSearchIcon}
      />
      <TextInput
        style={styles.headerInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.greyDark}
        selectionColor={COLORS.primary}
        readOnly
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerInputContainer: {
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
    flex: 1, // Input text mengisi ruang
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
});

export default SearchBarButton;
