import Icon from '@react-native-vector-icons/ionicons';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../../../constants/colors';

interface SearchBarInputProps {
  onChangeText: (_text: string) => void;
  placeholder: string;
  searchTerm: string;
  handleSearchSubmit: () => void;
  clearSearch: () => void;
}

const SearchBarInput = ({
  onChangeText,
  placeholder = 'Mau cari apa?',
  searchTerm,
  handleSearchSubmit,
  clearSearch,
}: SearchBarInputProps) => {
  return (
    <View style={styles.headerInputContainer}>
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
        value={searchTerm}
        onChangeText={onChangeText}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
        autoFocus={true}
        selectionColor={COLORS.primary}
      />
      {/* Tombol clear hanya muncul jika ada teks */}
      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={clearSearch}
          style={styles.headerClearButton}>
          <Icon name="close-circle" size={20} color={COLORS.greyDark} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flex: 1,
  },
  headerBackButton: {
    padding: 5, // Area sentuh lebih besar
    marginLeft: Platform.OS === 'android' ? 0 : 10, // Sesuaikan margin per platform
  },
  headerInputContainer: {
    flex: 1,
    backgroundColor: COLORS.greyLight, // Background input
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: Platform.OS === 'ios' ? 15 : 5, // Beri jarak kanan
    marginLeft: Platform.OS === 'ios' ? -10 : 5, // Sesuaikan margin kiri
  },
  headerSearchIcon: {
    marginRight: 8,
  },
  headerInput: {
    flex: 1, // Input text mengisi ruang
    height: '100%',
    paddingVertical: 0, // Hapus padding vertikal default
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
  },
  headerClearButton: {
    padding: 5, // Area sentuh
  },
  // Content Styles
  listContainer: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerIndicator: {
    marginTop: 50, // Beri jarak dari header
  },
});

export default SearchBarInput;
