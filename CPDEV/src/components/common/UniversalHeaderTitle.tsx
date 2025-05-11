import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import {colors, fonts, numbers} from '../../contants/styles';
import {CustomIcon, IconName} from './CustomIcon';

export interface HeaderAction {
  iconName?: IconName;
  iconElement?: React.ReactNode; // Atau elemen ikon kustom
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
}

export interface UniversalHeaderTitleProps {
  // Opsi untuk judul teks statis
  title?: string;
  titleStyle?: TextStyle;

  // Opsi untuk search input
  isSearchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  searchTextInputProps?: Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'placeholder' | 'style'
  >;

  // Opsi untuk tombol aksi di sebelah kanan
  rightActions?: HeaderAction[]; // Array untuk beberapa tombol jika diperlukan

  // Style kustom untuk container utama
  containerStyle?: ViewStyle;
}
const UniversalHeaderTitle: React.FC<UniversalHeaderTitleProps> = ({
  title,
  titleStyle,
  isSearchable = false,
  searchPlaceholder = 'Cari...',
  searchValue,
  onSearchChange,
  searchTextInputProps,
  rightActions,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftAndCenterContainer}>
        {isSearchable ? (
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.greyDark}
            value={searchValue}
            onChangeText={onSearchChange}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent" // Hilangkan underline di Android
            {...searchTextInputProps}
          />
        ) : title ? (
          <Text
            style={[styles.titleText, titleStyle]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>
        ) : null}
      </View>

      {rightActions && rightActions.length > 0 && (
        <View style={styles.rightActionsContainer}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={`header-action-${index}`}
              onPress={action.onPress}
              disabled={action.disabled}
              style={styles.actionButton}
              accessibilityLabel={action.accessibilityLabel}
              accessibilityRole="button"
              accessibilityState={{disabled: action.disabled}}
              testID={action.testID}>
              {action.iconElement ? (
                action.iconElement
              ) : action.iconName ? (
                <CustomIcon
                  name={action.iconName}
                  size={24}
                  color={action.disabled ? colors.textDisabled : colors.primary}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: colors.surface, // Latar belakang header bisa diatur di navigator
    width: numbers.headerWidth,
  },
  leftAndCenterContainer: {
    flex: 1, // Mengambil ruang sebanyak mungkin, mendorong tombol kanan ke kanan
    marginRight: numbers.padding / 1.5, // Jarak jika ada tombol kanan
    justifyContent: 'center', // Pusatkan judul jika tidak ada tombol kanan yang banyak
  },
  titleText: {
    fontSize: 17, // Ukuran font default untuk header title
    fontFamily: fonts.bold,
    color: colors.textPrimary, // Atau warna headerTintColor dari navigator
    textAlign: 'left', // Default untuk iOS
  },
  searchInput: {
    backgroundColor: colors.greyLight, // Atau colors.neutralLight
    borderRadius: numbers.borderRadius,
    paddingHorizontal: numbers.padding,
    paddingVertical: 10, // Sesuaikan tinggi
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  actionButton: {
    paddingHorizontal: numbers.padding / 2, // Jarak antar tombol
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40, // Pastikan area sentuh cukup
  },
});

export default UniversalHeaderTitle;
