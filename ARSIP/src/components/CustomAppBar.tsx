import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../constants/COLORS';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import IcFilter from '../assets/icons/ic_filter.svg';
import IcBack from '../assets/icons/ic_back.svg';

interface CustomAppBarProps {
  title: string;
  showBackButton?: boolean;
  showFilterButton?: boolean; // Tambahkan properti opsional
  onBackPress?: () => void;
  onFilterPress?: () => void;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title,
  showBackButton = false,
  showFilterButton = false, // Default: tidak menampilkan tombol filter
  onBackPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      {showBackButton ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <IcBack />
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      {/* Centered Title */}
      <View style={styles.titleContainer}>
        <Text style={[TEXT_STYLES.text16SemiBold, styles.title]}>{title}</Text>
      </View>

      {/* Right Buttons */}
      <View style={styles.rightButtons}>
        {showFilterButton && (
          <TouchableOpacity onPress={onFilterPress} style={styles.iconButton}>
            <IcFilter />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.white2,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.fieldBorder,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backPlaceholder: {
    width: 40, // Ensures spacing when no back button
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute', // Keeps title at the center
    left: 0,
    right: 0,
  },
  title: {
    color: COLORS.text950,
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CustomAppBar;
