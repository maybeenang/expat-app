import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../constants/COLORS';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import IcDropdown from '../assets/icons/ic_dropdown.svg';
import { STYLES } from '../constants/STYLES';

interface DropdownProps {
  label: string;
  onPress: () => void;
}

const AppDropdown: React.FC<DropdownProps> = ({label, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={[TEXT_STYLES.text14, STYLES.mr8]}>{label}</Text>
      <IcDropdown />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppDropdown;
